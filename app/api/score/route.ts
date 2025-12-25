import { NextRequest, NextResponse } from 'next/server'
import { calculateScore } from '@/lib/ai'

// Simple in-memory rate limiter for development
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 15 // 15 requests per minute per IP

function getRateLimitKey(request: NextRequest): string {
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
    const { resumeText, jobDescription, mode } = body

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

    // Handle empty/short text gracefully
    if (resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Resume text is too short. Please provide a complete resume.' },
        { status: 400 }
      )
    }

    if (jobDescription.trim().length < 50) {
      return NextResponse.json(
        { error: 'Job description is too short. Please provide a complete job description.' },
        { status: 400 }
      )
    }

    // Calculate score
    const score = await calculateScore(resumeText.trim(), jobDescription.trim())

    return NextResponse.json(score)
  } catch (error) {
    console.error('Score calculation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to calculate score' },
      { status: 500 }
    )
  }
}

