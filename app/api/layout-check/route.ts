import { NextRequest, NextResponse } from 'next/server'
import { analyzeLayout } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resumeText } = body

    if (!resumeText) {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      )
    }

    const analysis = await analyzeLayout(resumeText)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Layout analysis error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze layout' },
      { status: 500 }
    )
  }
}

