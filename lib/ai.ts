import { MatchAnalysis, OptimizationPlan, LayoutAnalysis } from '@/types';

/**
 * AI Integration Layer
 * Supports both OpenAI (ChatGPT) and Google Gemini
 * Switch providers via AI_PROVIDER environment variable
 */

/**
 * Get the AI provider from environment variables (read at runtime)
 */
function getAIProvider(): string {
  return process.env.AI_PROVIDER || 'openai';
}

interface AIResponse {
  content: string;
}

/**
 * Call OpenAI API
 */
async function callOpenAI(prompt: string, systemPrompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set in environment variables');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Call Google Gemini API using the official SDK
 */
async function callGemini(prompt: string, systemPrompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }

  // Dynamically import the Google Generative AI SDK
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const fullPrompt = `${systemPrompt}\n\n${prompt}`;

  // Try different models in order of preference
  // Using the latest available models based on your API key
  const modelNames = [
    'gemini-2.5-flash',      // Latest flash model (fast and efficient)
    'gemini-2.5-pro',        // Latest pro model (more capable)
    'gemini-flash-latest',   // Always latest flash
    'gemini-pro-latest',     // Always latest pro
    'gemini-2.0-flash',      // Fallback option
  ];

  let lastError: Error | null = null;

  for (const modelName of modelNames) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      if (text) {
        return text;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      // If it's a model not found error, try next model
      if (error instanceof Error && error.message.includes('not found')) {
        continue;
      }
      // For other errors, we might want to continue or throw
      // Let's continue to try other models
      continue;
    }
  }

  // If all attempts failed
  const errorMessage = lastError 
    ? `Gemini API error: All model attempts failed. Last error: ${lastError.message}` 
    : 'Gemini API error: All model attempts failed with unknown error';
  
  throw new Error(`${errorMessage}. Please verify your API key at https://makersuite.google.com/app/apikey`);
}

/**
 * Extract JSON from text response (handles cases where AI adds extra text)
 */
function extractJSON(text: string): string {
  // Try to find JSON object in the response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  // If no match, return original text
  return text;
}

/**
 * Generic AI call function that routes to the appropriate provider
 */
async function callAI(prompt: string, systemPrompt: string): Promise<string> {
  const aiProvider = getAIProvider();
  if (aiProvider === 'gemini') {
    const response = await callGemini(prompt, systemPrompt);
    // Extract JSON in case there's extra text
    return extractJSON(response);
  } else {
    return callOpenAI(prompt, systemPrompt);
  }
}

/**
 * Analyze resume match with job description
 */
export async function analyzeMatch(
  resumeText: string,
  jobDescription: string
): Promise<MatchAnalysis> {
  const systemPrompt = `You are an expert ATS (Applicant Tracking System) and resume optimization assistant. 
Your task is to analyze how well a resume matches a job description and provide a detailed, structured analysis.

CRITICAL: You MUST output ONLY valid JSON. Do not include any text before or after the JSON. No explanations, no markdown formatting, just pure JSON.

Output format (must be valid JSON):
{
  "matchScore": <number 0-100>,
  "categoryScores": {
    "skills": <number 0-100>,
    "experience": <number 0-100>,
    "education": <number 0-100>,
    "relevance": <number 0-100>
  },
  "matchedKeywords": [<array of matched keywords/phrases>],
  "missingKeywords": [<array of important keywords from job description not found in resume>],
  "summaryFeedback": "<detailed explanation of the match analysis>"
}

Be thorough and specific. The matchScore should reflect overall alignment.`;

  const prompt = `Analyze the following resume and job description:

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Provide a comprehensive match analysis.`;

  const response = await callAI(prompt, systemPrompt);
  const parsed = JSON.parse(response);
  return parsed as MatchAnalysis;
}

/**
 * Generate optimization plan for resume
 */
export async function generateOptimizationPlan(
  resumeText: string,
  jobDescription: string
): Promise<OptimizationPlan> {
  const systemPrompt = `You are an expert resume optimization assistant. 
Your task is to create a step-by-step optimization plan to improve a resume's alignment with a job description.

CRITICAL: You MUST output ONLY valid JSON. Do not include any text before or after the JSON. No explanations, no markdown formatting, just pure JSON.

Output format (must be valid JSON):
{
  "steps": [
    {
      "title": "<step title>",
      "description": "<explanation of what to change and why>",
      "suggestions": [
        {
          "section": "<section name, e.g., 'Summary', 'Experience - Job Title', 'Skills'>",
          "currentText": "<current text from resume>",
          "suggestedText": "<improved version>"
        }
      ]
    }
  ]
}

Create 4-6 actionable steps covering: headline/summary, skills section, work experience bullets, keywords, and achievements alignment.`;

  const prompt = `Create an optimization plan for the following resume to better match this job description:

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Provide a detailed, step-by-step optimization plan with concrete before/after suggestions.`;

  const response = await callAI(prompt, systemPrompt);
  const parsed = JSON.parse(response);
  return parsed as OptimizationPlan;
}

/**
 * Analyze resume layout and formatting
 */
export async function analyzeLayout(resumeText: string): Promise<LayoutAnalysis> {
  const systemPrompt = `You are an expert ATS compatibility analyst. 
Your task is to analyze resume layout and formatting for ATS compatibility.

CRITICAL: You MUST output ONLY valid JSON. Do not include any text before or after the JSON. No explanations, no markdown formatting, just pure JSON.

Output format (must be valid JSON):
{
  "layoutScore": <number 0-100>,
  "issues": [
    {
      "type": "<issue type, e.g., 'columns', 'tables', 'images', 'fonts', 'headings', 'length'>",
      "description": "<detailed description of the issue>",
      "severity": "<'low' | 'medium' | 'high'>"
    }
  ],
  "recommendations": [<array of actionable recommendations>]
}

Focus on ATS parsing compatibility: one-column layouts, clear headings, bullet structure, standard fonts, appropriate length (1-2 pages), and absence of graphics/icons.`;

  const prompt = `Analyze the layout and formatting of the following resume text for ATS compatibility:

${resumeText}

Provide a comprehensive layout analysis with specific issues and recommendations.`;

  const response = await callAI(prompt, systemPrompt);
  const parsed = JSON.parse(response);
  return parsed as LayoutAnalysis;
}

