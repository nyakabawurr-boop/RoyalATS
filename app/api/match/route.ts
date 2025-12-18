import { NextRequest, NextResponse } from 'next/server'
import { analyzeMatch } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resumeText, jobDescription } = body

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume text and job description are required' },
        { status: 400 }
      )
    }

    const analysis = await analyzeMatch(resumeText, jobDescription)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Match analysis error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze match' },
      { status: 500 }
    )
  }
}

