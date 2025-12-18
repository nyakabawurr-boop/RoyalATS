/**
 * Keyword Extraction Utility
 * Reuses ATS logic for keyword extraction from job descriptions
 */

import { analyzeMatch } from './ai'

export interface KeywordAnalysis {
  keywords: string[]
  matched: string[]
  missing: string[]
  suggestions: string[]
}

/**
 * Extract keywords from job description using existing ATS logic
 */
export async function extractKeywordsFromJD(jobDescription: string, resumeText: string): Promise<KeywordAnalysis> {
  try {
    // Use existing analyzeMatch function to get keywords
    const analysis = await analyzeMatch(resumeText, jobDescription)
    
    return {
      keywords: [...analysis.matchedKeywords, ...analysis.missingKeywords],
      matched: analysis.matchedKeywords,
      missing: analysis.missingKeywords,
      suggestions: analysis.missingKeywords.slice(0, 10) // Top 10 missing keywords
    }
  } catch (error) {
    console.error('Error extracting keywords:', error)
    // Fallback: simple keyword extraction
    return extractKeywordsSimple(jobDescription)
  }
}

/**
 * Simple keyword extraction (fallback)
 * Extracts important terms from job description
 */
function extractKeywordsSimple(jobDescription: string): KeywordAnalysis {
  const text = jobDescription.toLowerCase()
  
  // Common skill/technology keywords
  const techKeywords = [
    'javascript', 'python', 'java', 'sql', 'react', 'node', 'aws', 'docker',
    'kubernetes', 'agile', 'scrum', 'machine learning', 'data science',
    'excel', 'tableau', 'salesforce', 'crm', 'seo', 'sem'
  ]
  
  const found: string[] = []
  techKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      found.push(keyword)
    }
  })
  
  // Extract capitalized words (likely skills/technologies)
  const capitalized = text.match(/\b[A-Z][a-z]+\b/g) || []
  const unique = [...new Set([...found, ...capitalized])].slice(0, 20)
  
  return {
    keywords: unique,
    matched: [],
    missing: unique,
    suggestions: unique.slice(0, 10)
  }
}

/**
 * Check keyword density in text (to avoid keyword stuffing)
 */
export function checkKeywordDensity(text: string, keywords: string[]): {
  density: number
  warnings: string[]
} {
  const words = text.toLowerCase().split(/\s+/)
  const totalWords = words.length
  let keywordCount = 0
  const warnings: string[] = []
  
  keywords.forEach(keyword => {
    const count = (text.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length
    keywordCount += count
  })
  
  const density = totalWords > 0 ? (keywordCount / totalWords) * 100 : 0
  
  if (density > 5) {
    warnings.push('High keyword density detected. Consider using keywords more naturally.')
  }
  
  if (density > 8) {
    warnings.push('Very high keyword density. This may be seen as keyword stuffing by ATS systems.')
  }
  
  return { density, warnings }
}

