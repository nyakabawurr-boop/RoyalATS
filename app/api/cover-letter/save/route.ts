import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      content,
      tone,
      length,
      companyName,
      roleTitle,
      resumeId,
      jobApplicationId,
    } = body

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Content size validation
    if (content.length > 10000) {
      return NextResponse.json(
        { error: 'Cover letter content is too long (max 10,000 characters)' },
        { status: 400 }
      )
    }

    // For now, we'll save without user authentication
    // In a production app with auth, you'd get userId from the session
    // Example: const session = await getServerSession(authOptions)
    // const userId = session?.user?.id
    
    // Since userId is optional in the schema, we can save without it
    // This allows the feature to work even without authentication
    const userId: string | undefined = undefined // TODO: Get from auth session if available

    // Create cover letter
    const coverLetter = await prisma.coverLetter.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        tone: tone || null,
        length: length || null,
        companyName: companyName || null,
        roleTitle: roleTitle || null,
        userId: userId,
        resumeId: resumeId || null,
        jobApplicationId: jobApplicationId || null,
      },
    })

    return NextResponse.json({
      id: coverLetter.id,
      message: 'Cover letter saved successfully',
    })
  } catch (error) {
    console.error('Save cover letter error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save cover letter' },
      { status: 500 }
    )
  }
}

