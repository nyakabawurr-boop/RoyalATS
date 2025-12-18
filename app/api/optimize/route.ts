import { NextRequest, NextResponse } from 'next/server'
import { generateOptimizationPlan } from '@/lib/ai'

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

    const plan = await generateOptimizationPlan(resumeText, jobDescription)

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Optimization error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate optimization plan' },
      { status: 500 }
    )
  }
}

