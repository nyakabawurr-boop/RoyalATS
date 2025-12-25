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

    // Input size validation
    const combinedLength = resumeText.length + jobDescription.length
    const MAX_LENGTH = 40000
    if (combinedLength > MAX_LENGTH) {
      return NextResponse.json(
        { error: `Total input size exceeds ${MAX_LENGTH} characters. Please reduce the size of your resume or job description.` },
        { status: 400 }
      )
    }

    const plan = await generateOptimizationPlan(resumeText.trim(), jobDescription.trim())

    // Ensure optimizedResumeText exists (fallback to original if AI didn't provide it)
    if (!plan.optimizedResumeText) {
      plan.optimizedResumeText = resumeText.trim()
    }
    if (!plan.changesSummary || plan.changesSummary.length === 0) {
      plan.changesSummary = ['Resume optimized for better ATS alignment with job description']
    }

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Optimization error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate optimization plan' },
      { status: 500 }
    )
  }
}

