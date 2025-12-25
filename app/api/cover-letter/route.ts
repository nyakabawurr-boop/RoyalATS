import { NextRequest, NextResponse } from 'next/server'
import { generateCoverLetter } from '@/lib/ai'
import { CoverLetterTone, CoverLetterLength } from '@/types'

// Simple in-memory rate limiter for development
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10 // 10 requests per minute per IP

function getRateLimitKey(request: NextRequest): string {
  // In production, use a proper identifier (user ID, session, etc.)
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return ip
}

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  record.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request)
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const {
      resumeText,
      jobDescription,
      tone,
      length,
      companyName,
      roleTitle,
      hiringManager,
      location,
      keyHighlights,
      userName,
      contactInfo,
    } = body

    // Validation
    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume text and job description are required' },
        { status: 400 }
      )
    }

    // Input size validation (prevent extremely large payloads)
    const combinedLength = resumeText.length + jobDescription.length
    const MAX_LENGTH = 40000 // ~40k characters
    if (combinedLength > MAX_LENGTH) {
      return NextResponse.json(
        { error: `Total input size exceeds ${MAX_LENGTH} characters. Please reduce the size of your resume or job description.` },
        { status: 400 }
      )
    }

    // Validate tone and length enums
    const validTones: CoverLetterTone[] = ['Professional', 'Enthusiastic', 'Concise']
    const validLengths: CoverLetterLength[] = ['Short', 'Standard']
    
    if (tone && !validTones.includes(tone)) {
      return NextResponse.json(
        { error: `Invalid tone. Must be one of: ${validTones.join(', ')}` },
        { status: 400 }
      )
    }

    if (length && !validLengths.includes(length)) {
      return NextResponse.json(
        { error: `Invalid length. Must be one of: ${validLengths.join(', ')}` },
        { status: 400 }
      )
    }

    // Generate cover letter
    const result = await generateCoverLetter(resumeText, jobDescription, {
      tone: tone || 'Professional',
      length: length || 'Standard',
      companyName,
      roleTitle,
      hiringManager,
      location,
      keyHighlights: Array.isArray(keyHighlights) ? keyHighlights : [],
      userName,
      contactInfo,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Cover letter generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate cover letter' },
      { status: 500 }
    )
  }
}

