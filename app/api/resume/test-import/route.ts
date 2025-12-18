import { NextResponse } from 'next/server'

/**
 * Test endpoint to verify PDF/DOCX parsing libraries are working
 */
export async function GET() {
  try {
    // Test pdf-parse import
    let pdfParseAvailable = false
    try {
      const pdfParse = await import('pdf-parse')
      pdfParseAvailable = true
    } catch (e) {
      console.error('pdf-parse not available:', e)
    }

    // Test mammoth import
    let mammothAvailable = false
    try {
      const mammoth = await import('mammoth')
      mammothAvailable = true
    } catch (e) {
      console.error('mammoth not available:', e)
    }

    return NextResponse.json({
      pdfParseAvailable,
      mammothAvailable,
      nodeVersion: process.version,
      platform: process.platform,
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}

