import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30 // Increase timeout for large files

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Handle file - in Next.js FormData, file will be a File-like object
    let fileType = ''
    let fileName = ''
    let arrayBuffer: ArrayBuffer

    // Check if it's a File-like object
    if (file && typeof file === 'object' && 'arrayBuffer' in file) {
      const fileObj = file as { type?: string; name?: string; arrayBuffer: () => Promise<ArrayBuffer> }
      fileType = fileObj.type || ''
      fileName = (fileObj.name || 'uploaded-file').toLowerCase()
      arrayBuffer = await fileObj.arrayBuffer()
    } else {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      )
    }

    // Handle JSON files - process in API route but can also be done client-side
    if (fileType === 'application/json' || fileName.endsWith('.json')) {
      try {
        const text = new TextDecoder().decode(arrayBuffer)
        const json = JSON.parse(text)
        return NextResponse.json({ type: 'json', data: json })
      } catch (parseError) {
        return NextResponse.json(
          { error: 'Invalid JSON format' },
          { status: 400 }
        )
      }
    }

    // Handle PDF files
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      try {
        // Convert array buffer to Node.js Buffer first
        const buffer = Buffer.from(arrayBuffer)
        
        // Dynamically import pdf-parse with error handling
        let pdfParse: any
        try {
          const pdfParseModule = await import('pdf-parse')
          // pdf-parse can export as default or named export
          pdfParse = (pdfParseModule as any).default || pdfParseModule
        } catch (importError) {
          console.error('Failed to import pdf-parse:', importError)
          return NextResponse.json(
            { error: 'PDF parsing library not available. Please ensure pdf-parse is installed: npm install pdf-parse' },
            { status: 500 }
          )
        }
        
        // Parse PDF with options
        const pdfData = await pdfParse(buffer, {
          max: 0, // Parse all pages
        })
        
        const text = pdfData?.text || ''
        
        if (!text || text.trim().length === 0) {
          return NextResponse.json(
            { error: 'Could not extract text from PDF. The file may be empty, corrupted, or contain only images.' },
            { status: 400 }
          )
        }

        return NextResponse.json({ type: 'text', data: text })
      } catch (error) {
        console.error('PDF parsing error details:', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          fileName: fileName,
          fileSize: arrayBuffer.byteLength,
          errorName: error instanceof Error ? error.name : typeof error
        })
        return NextResponse.json(
          { 
            error: `Failed to parse PDF file: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure the PDF is not password-protected or corrupted. If the issue persists, try converting the PDF to text manually and paste it into the builder.` 
          },
          { status: 500 }
        )
      }
    }

    // Handle DOCX files
    if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      try {
        const mammoth = await import('mammoth')
        
        const result = await mammoth.extractRawText({ arrayBuffer })
        
        if (result.messages && result.messages.length > 0) {
          console.warn('Mammoth parsing warnings:', result.messages)
        }
        
        const text = result.value || ''
        
        if (!text || text.trim().length === 0) {
          return NextResponse.json(
            { error: 'Could not extract text from DOCX file. The file may be empty or corrupted.' },
            { status: 400 }
          )
        }

        return NextResponse.json({ type: 'text', data: text })
      } catch (error) {
        console.error('DOCX parsing error details:', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          fileName: fileName,
          fileSize: arrayBuffer.byteLength
        })
        return NextResponse.json(
          { 
            error: `Failed to parse DOCX file: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure the file is a valid DOCX document.` 
          },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Unsupported file format. Please use JSON, PDF, or DOCX files.' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Import API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to process file'
    console.error('Full error:', error)
    return NextResponse.json(
      { error: `Server error: ${errorMessage}. Please try again or contact support if the issue persists.` },
      { status: 500 }
    )
  }
}

