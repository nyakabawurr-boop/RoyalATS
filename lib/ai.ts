import { MatchAnalysis, OptimizationPlan, LayoutAnalysis, CoverLetterResponse, CoverLetterTone, CoverLetterLength, ScoreResponse, ScoreRanking } from '@/types';

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
    const aiProvider = getAIProvider();
    throw new Error(
      `AI_PROVIDER is set to "${aiProvider}" but GEMINI_API_KEY is not set in environment variables. ` +
      `Please set GEMINI_API_KEY in your Vercel environment variables. ` +
      `Go to your Vercel project → Settings → Environment Variables and add GEMINI_API_KEY.`
    );
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
    // Check if OpenAI API key is available before calling
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        `AI_PROVIDER is set to "${aiProvider}" but OPENAI_API_KEY is not set in environment variables. ` +
        `Please set OPENAI_API_KEY in your Vercel environment variables, or set AI_PROVIDER="gemini" and GEMINI_API_KEY instead.`
      );
    }
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
 * Generate optimization plan for resume with optimized resume text
 */
export async function generateOptimizationPlan(
  resumeText: string,
  jobDescription: string
): Promise<OptimizationPlan> {
  const systemPrompt = `You are an expert resume optimization assistant. 
Your task is to create a step-by-step optimization plan AND a fully rewritten optimized resume that improves alignment with a job description.

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
  ],
  "optimizedResumeText": "<FULL rewritten resume text with all optimizations applied. This must be a complete, usable resume that preserves all original information but with improved wording, better keyword alignment, and enhanced ATS-friendliness. DO NOT invent skills, companies, degrees, or achievements that aren't in the original resume. Only rephrase and reorganize existing content.>",
  "changesSummary": [
    "<brief summary of key changes made>",
    "<another change summary>"
  ]
}

Create 4-6 actionable steps covering: headline/summary, skills section, work experience bullets, keywords, and achievements alignment.`;

  const prompt = `Create an optimization plan for the following resume to better match this job description:

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Provide a detailed, step-by-step optimization plan with concrete before/after suggestions. Also provide a fully rewritten optimized resume text that incorporates all the improvements. The optimized resume must:
- Be truthful: only rephrase/reshape existing content, never invent new qualifications
- Be ATS-friendly: use standard formatting, keywords from the job description
- Maintain all original information: same companies, titles, dates, achievements
- Be ready to use: complete and formatted properly`;

  const response = await callAI(prompt, systemPrompt);
  let parsed: any;
  try {
    parsed = JSON.parse(response);
  } catch (e) {
    // Try to extract JSON if wrapped in markdown
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Failed to parse optimization response as JSON');
    }
  }

  // Ensure optimizedResumeText and changesSummary exist
  if (!parsed.optimizedResumeText) {
    parsed.optimizedResumeText = resumeText; // Fallback to original if not provided
  }
  if (!parsed.changesSummary) {
    parsed.changesSummary = ['Resume optimized for better ATS alignment'];
  }

  return parsed as OptimizationPlan;
}

/**
 * Extract skills and keywords from resume and job description using AI
 * Returns structured data for deterministic scoring
 */
async function extractScoringData(
  resumeText: string,
  jobDescription: string
): Promise<{
  requiredSkills: string[];
  preferredSkills: string[];
  resumeSkills: string[];
  keywords: string[];
}> {
  const systemPrompt = `You are an expert ATS analyst. Extract structured data from a resume and job description for scoring purposes.

CRITICAL: You MUST output ONLY valid JSON. Do not include any text before or after the JSON.

Output format (must be valid JSON):
{
  "requiredSkills": [<array of hard skills/technologies explicitly required in the job description>],
  "preferredSkills": [<array of skills listed as "preferred", "nice to have", or "bonus" in the job description>],
  "resumeSkills": [<array of all technical skills, tools, and technologies mentioned in the resume>],
  "keywords": [<array of important keywords/phrases from the job description (excluding skills already listed)>]
}

Be thorough and specific. Use normalized skill names (e.g., "JavaScript" not "JS", "React" not "React.js").`;

  const prompt = `Extract skills and keywords from the following:

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Extract all relevant skills and keywords in the specified format.`;

  const response = await callAI(prompt, systemPrompt);
  let parsed: any;
  try {
    // Try parsing directly (OpenAI returns clean JSON)
    parsed = JSON.parse(response);
  } catch (e) {
    // Fallback: extract JSON from text (in case AI wrapped it)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (e2) {
        throw new Error('Failed to parse extraction response as JSON');
      }
    } else {
      throw new Error('Failed to parse extraction response as JSON');
    }
  }

  return {
    requiredSkills: Array.isArray(parsed.requiredSkills) ? parsed.requiredSkills : [],
    preferredSkills: Array.isArray(parsed.preferredSkills) ? parsed.preferredSkills : [],
    resumeSkills: Array.isArray(parsed.resumeSkills) ? parsed.resumeSkills : [],
    keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
  };
}

/**
 * Calculate ATS-style score for resume against job description
 * Uses hybrid approach: AI extraction + deterministic scoring
 */
export async function calculateScore(
  resumeText: string,
  jobDescription: string
): Promise<ScoreResponse> {
  // Extract data using AI
  const { requiredSkills, preferredSkills, resumeSkills, keywords } = await extractScoringData(
    resumeText,
    jobDescription
  );

  // Normalize skills for comparison (case-insensitive, trim whitespace)
  const normalizeSkill = (skill: string) => skill.toLowerCase().trim();
  const normalizedResumeSkills = new Set(resumeSkills.map(normalizeSkill));
  const normalizedRequiredSkills = requiredSkills.map(normalizeSkill);
  const normalizedPreferredSkills = preferredSkills.map(normalizeSkill);

  // Calculate matched and missing skills
  const matchedRequiredSkills = normalizedRequiredSkills.filter(skill =>
    normalizedResumeSkills.has(skill)
  );
  const missingRequiredSkills = normalizedRequiredSkills.filter(
    skill => !normalizedResumeSkills.has(skill)
  );

  // Calculate matched preferred skills
  const matchedPreferredSkills = normalizedPreferredSkills.filter(skill =>
    normalizedResumeSkills.has(skill)
  );

  // Skills Match % = (matched required + 0.5 * matched preferred) / (required + 0.5 * preferred) * 100
  const requiredWeight = 1.0;
  const preferredWeight = 0.5;
  const totalSkillsWeight = normalizedRequiredSkills.length * requiredWeight + 
                            normalizedPreferredSkills.length * preferredWeight;
  const matchedSkillsWeight = matchedRequiredSkills.length * requiredWeight + 
                              matchedPreferredSkills.length * preferredWeight;
  const skillsMatchPct = totalSkillsWeight > 0 
    ? Math.min(100, Math.round((matchedSkillsWeight / totalSkillsWeight) * 100))
    : 100; // If no skills specified, give full score

  // Keyword matching (simple text search)
  const resumeTextLower = resumeText.toLowerCase();
  const matchedKeywords = keywords.filter(keyword => 
    resumeTextLower.includes(keyword.toLowerCase())
  );
  const missingKeywords = keywords.filter(keyword => 
    !resumeTextLower.includes(keyword.toLowerCase())
  );

  // Keyword Match % (30% weight in overall)
  const keywordMatchPct = keywords.length > 0
    ? Math.round((matchedKeywords.length / keywords.length) * 100)
    : 100;

  // Overall Match % = 60% skills + 30% keywords + 10% role/title alignment (simplified)
  const overallMatchPct = Math.round(
    skillsMatchPct * 0.6 + keywordMatchPct * 0.3 + 100 * 0.1 // Role alignment assumed 100 for now
  );

  // Determine ranking
  let ranking: ScoreRanking;
  if (overallMatchPct >= 75) {
    ranking = 'Strong';
  } else if (overallMatchPct >= 50) {
    ranking = 'Moderate';
  } else {
    ranking = 'Weak';
  }

  // Generate notes
  const notes: string[] = [];
  if (matchedRequiredSkills.length > 0) {
    notes.push(`Matched ${matchedRequiredSkills.length} of ${normalizedRequiredSkills.length} required skills`);
  }
  if (missingRequiredSkills.length > 0) {
    notes.push(`Missing ${missingRequiredSkills.length} required skills`);
  }
  if (matchedKeywords.length > 0) {
    notes.push(`Matched ${matchedKeywords.length} of ${keywords.length} keywords`);
  }
  if (notes.length === 0) {
    notes.push('Analysis complete');
  }

  return {
    overallMatchPct,
    skillsMatchPct,
    ranking,
    matchedSkills: [...new Set(matchedRequiredSkills.concat(matchedPreferredSkills))], // Deduplicated
    missingSkills: missingRequiredSkills,
    matchedKeywords,
    missingKeywords,
    notes,
  };
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

/**
 * Generate a tailored cover letter for a job application
 */
export async function generateCoverLetter(
  resumeText: string,
  jobDescription: string,
  options: {
    tone?: CoverLetterTone;
    length?: CoverLetterLength;
    companyName?: string;
    roleTitle?: string;
    hiringManager?: string;
    location?: string;
    keyHighlights?: string[];
    userName?: string;
    contactInfo?: string;
  } = {}
): Promise<CoverLetterResponse> {
  const {
    tone = 'Professional',
    length = 'Standard',
    companyName,
    roleTitle,
    hiringManager,
    location,
    keyHighlights = [],
    userName,
    contactInfo,
  } = options;

  // Determine word count target
  const wordCountTarget = length === 'Short' ? '200-250 words' : '300-400 words';

  // Build context for the prompt
  let contextInfo = '';
  if (companyName) contextInfo += `\nCompany: ${companyName}`;
  if (roleTitle) contextInfo += `\nRole: ${roleTitle}`;
  if (hiringManager) contextInfo += `\nHiring Manager: ${hiringManager}`;
  if (location) contextInfo += `\nLocation: ${location}`;
  if (keyHighlights.length > 0) {
    contextInfo += `\nKey Achievements to Highlight:\n${keyHighlights.map(h => `- ${h}`).join('\n')}`;
  }

  const systemPrompt = `You are an expert cover letter writer specializing in ATS-friendly, professional cover letters.

CRITICAL REQUIREMENTS:
1. Output ONLY the cover letter text - no JSON, no markdown formatting, no explanations, no metadata
2. The cover letter must be ATS-friendly: plain text, no tables, no fancy symbols, no images
3. Use exactly ${wordCountTarget} words
4. Write in a ${tone.toLowerCase()} tone
5. Structure: 3-5 paragraphs maximum
   - Opening paragraph: Express interest and position yourself
   - 1-3 body paragraphs: Highlight relevant experience, achievements, and fit
   - Closing paragraph: Call to action and thank you
6. Use specific, measurable achievements from the resume when available (numbers, projects, results)
7. DO NOT hallucinate or invent information:
   - If company name is not provided, use neutral phrasing like "your organization"
   - If hiring manager name is not provided, use "Dear Hiring Manager" or "Dear [Company] Team"
   - If role title is not provided, reference the position from the job description
8. Avoid repetition and fluff
9. Be specific to the job description - reference key requirements and show how you meet them
10. Use line breaks between paragraphs (double line break)

Output format: Plain text cover letter only, with double line breaks between paragraphs.`;

  let prompt = `Write a tailored cover letter based on the following resume and job description.${contextInfo}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

${userName ? `\nApplicant Name: ${userName}` : ''}
${contactInfo ? `\nContact Info: ${contactInfo}` : ''}

Generate a ${tone.toLowerCase()}, ${wordCountTarget} cover letter that:
- Highlights the most relevant experience and achievements from the resume
- Demonstrates clear alignment with the job requirements
- Uses specific examples and measurable results
- Shows enthusiasm and professionalism
- Is tailored specifically to this role and company`;

  const response = await callAI(prompt, systemPrompt);
  
  // Clean up the response - remove any JSON formatting if AI added it
  let coverLetterText = response.trim();
  
  // Remove markdown code blocks if present
  coverLetterText = coverLetterText.replace(/^```[\w]*\n?/gm, '').replace(/\n?```$/gm, '');
  
  // Extract JSON if AI wrapped it (some models do this)
  const jsonMatch = coverLetterText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.coverLetter) {
        coverLetterText = parsed.coverLetter;
      } else if (typeof parsed === 'string') {
        coverLetterText = parsed;
      }
    } catch {
      // Not valid JSON, use as-is
    }
  }

  // Try to detect company and role from job description if not provided
  let detectedCompany: string | null = companyName || null;
  let detectedRole: string | null = roleTitle || null;

  if (!detectedCompany || !detectedRole) {
    // Simple extraction - look for common patterns
    const companyMatch = jobDescription.match(/(?:at|with|for)\s+([A-Z][a-zA-Z\s&]+?)(?:\s|,|$)/i);
    if (companyMatch && !detectedCompany) {
      detectedCompany = companyMatch[1].trim();
    }

    const roleMatch = jobDescription.match(/(?:position|role|job|opening)[:\s]+([A-Z][a-zA-Z\s]+?)(?:\s|,|$)/i);
    if (roleMatch && !detectedRole) {
      detectedRole = roleMatch[1].trim();
    }
  }

  // Extract key bullets/achievements mentioned in the cover letter
  const bulletsUsed: string[] = [];
  if (keyHighlights.length > 0) {
    // Check which highlights were actually used
    keyHighlights.forEach(highlight => {
      if (coverLetterText.toLowerCase().includes(highlight.toLowerCase().substring(0, 20))) {
        bulletsUsed.push(highlight);
      }
    });
  }

  return {
    coverLetter: coverLetterText,
    bulletsUsed,
    detectedCompany,
    detectedRole,
  };
}

