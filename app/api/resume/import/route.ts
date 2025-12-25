import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30 // Increase timeout for large files

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/json',
]

/**
 * Normalize and clean extracted text
 */
function normalizeText(text: string): string {
  // Remove excessive whitespace
  let normalized = text
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
    .replace(/[ \t]+/g, ' ') // Multiple spaces/tabs to single space
    .replace(/[ \t]+$/gm, '') // Trailing whitespace on lines
    .trim()

  return normalized
}

export async function POST(request: NextRequest) {
  try {
    // Parse multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        {
          error: 'IMPORT_FAILED',
          message: 'No file provided. Please select a file to import.',
        },
        { status: 400 }
      )
    }

    // Get file metadata
    const fileType = file.type || ''
    const fileName = (file.name || 'uploaded-file').toLowerCase()
    const fileSize = file.size

    // Validate file size
    if (fileSize === 0) {
      return NextResponse.json(
        {
          error: 'IMPORT_FAILED',
          message: 'The uploaded file is empty. Please select a valid file.',
        },
        { status: 400 }
      )
    }

    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: 'IMPORT_FAILED',
          message: `File size (${Math.round(fileSize / 1024 / 1024)}MB) exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB. Please use a smaller file.`,
        },
        { status: 413 }
      )
    }

    // Validate file type
    const isValidType = ALLOWED_MIME_TYPES.includes(fileType) ||
      fileName.endsWith('.pdf') ||
      fileName.endsWith('.docx') ||
      fileName.endsWith('.txt') ||
      fileName.endsWith('.json')

    if (!isValidType) {
      return NextResponse.json(
        {
          error: 'IMPORT_FAILED',
          message: `Unsupported file format. Please use PDF, DOCX, TXT, or JSON files. Received: ${fileType || 'unknown'}`,
        },
        { status: 415 }
      )
    }

    // Convert file to ArrayBuffer
    let arrayBuffer: ArrayBuffer
    try {
      arrayBuffer = await file.arrayBuffer()
    } catch (error) {
      console.error('Error reading file:', {
        error: error instanceof Error ? error.message : String(error),
        fileName,
        fileSize,
      })
      return NextResponse.json(
        {
          error: 'IMPORT_FAILED',
          message: 'Failed to read file. Please try again or use a different file.',
        },
        { status: 400 }
      )
    }

    // Handle JSON files
    if (fileType === 'application/json' || fileName.endsWith('.json')) {
      try {
        const text = new TextDecoder('utf-8').decode(arrayBuffer)
        const json = JSON.parse(text)
        return NextResponse.json({
          type: 'json',
          data: json,
        })
      } catch (parseError) {
        console.error('JSON parse error:', {
          error: parseError instanceof Error ? parseError.message : String(parseError),
          fileName,
        })
        return NextResponse.json(
          {
            error: 'IMPORT_FAILED',
            message: 'Invalid JSON format. Please ensure the file is a valid JSON document.',
            details: parseError instanceof Error ? parseError.message : undefined,
          },
          { status: 422 }
        )
      }
    }

    // Handle PDF files
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      try {
        const buffer = Buffer.from(arrayBuffer)

        // Import pdf-parse with error handling
        let pdfParse: any
        try {
          const pdfParseModule = await import('pdf-parse')
          // pdf-parse can export as default or named export
          pdfParse = (pdfParseModule as any).default || pdfParseModule
        } catch (importError) {
          console.error('Failed to import pdf-parse:', importError)
          return NextResponse.json(
            {
              error: 'IMPORT_FAILED',
              message: 'PDF parsing library not available. Please ensure pdf-parse is installed.',
              details: importError instanceof Error ? importError.message : undefined,
            },
            { status: 500 }
          )
        }

        // Parse PDF
        const pdfData = await pdfParse(buffer, {
          max: 0, // Parse all pages
        })

        const rawText = pdfData?.text || ''

        if (!rawText || rawText.trim().length === 0) {
          return NextResponse.json(
            {
              error: 'IMPORT_FAILED',
              message: 'Could not extract text from PDF. The file may contain only images, be password-protected, or corrupted. Try a text-based PDF or convert the PDF to text manually.',
            },
            { status: 422 }
          )
        }

        const normalizedText = normalizeText(rawText)

        return NextResponse.json({
          type: 'text',
          data: normalizedText,
        })
      } catch (error) {
        console.error('PDF parsing error:', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          fileName,
          fileSize,
          errorName: error instanceof Error ? error.name : typeof error,
        })

        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        
        // Handle specific PDF errors
        if (errorMessage.includes('password') || errorMessage.includes('encrypted')) {
          return NextResponse.json(
            {
              error: 'IMPORT_FAILED',
              message: 'PDF is password-protected. Please remove the password or use a different file.',
            },
            { status: 422 }
          )
        }

        return NextResponse.json(
          {
            error: 'IMPORT_FAILED',
            message: `Failed to parse PDF file: ${errorMessage}. Please ensure the PDF is not corrupted. If the issue persists, try converting the PDF to text manually.`,
            details: errorMessage,
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
        const buffer = Buffer.from(arrayBuffer)
        const mammoth = await import('mammoth')

        // mammoth.extractRawText expects { buffer: Buffer }
        const result = await mammoth.extractRawText({ buffer })

        // Log warnings if any
        if (result.messages && result.messages.length > 0) {
          console.warn('Mammoth parsing warnings:', {
            fileName,
            warnings: result.messages,
          })
        }

        const rawText = result.value || ''

        if (!rawText || rawText.trim().length === 0) {
          return NextResponse.json(
            {
              error: 'IMPORT_FAILED',
              message: 'DOCX extraction returned empty text. The file may be empty, corrupted, or contain only images.',
            },
            { status: 422 }
          )
        }

        const normalizedText = normalizeText(rawText)

        return NextResponse.json({
          type: 'text',
          data: normalizedText,
        })
      } catch (error) {
        console.error('DOCX parsing error:', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          fileName,
          fileSize,
        })

        return NextResponse.json(
          {
            error: 'IMPORT_FAILED',
            message: `Failed to parse DOCX file: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure the file is a valid DOCX document.`,
            details: error instanceof Error ? error.message : undefined,
          },
          { status: 500 }
        )
      }
    }

    // Handle TXT files
    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      try {
        const rawText = new TextDecoder('utf-8').decode(arrayBuffer)

        if (!rawText || rawText.trim().length === 0) {
          return NextResponse.json(
            {
              error: 'IMPORT_FAILED',
              message: 'Text file is empty. Please provide a file with content.',
            },
            { status: 422 }
          )
        }

        const normalizedText = normalizeText(rawText)

        return NextResponse.json({
          type: 'text',
          data: normalizedText,
        })
      } catch (error) {
        console.error('TXT parsing error:', {
          error: error instanceof Error ? error.message : String(error),
          fileName,
        })

        return NextResponse.json(
          {
            error: 'IMPORT_FAILED',
            message: `Failed to read text file: ${error instanceof Error ? error.message : 'Unknown error'}.`,
          },
          { status: 500 }
        )
      }
    }

    // Fallback: unsupported format
    return NextResponse.json(
      {
        error: 'IMPORT_FAILED',
        message: `Unsupported file format. Please use PDF, DOCX, TXT, or JSON files. Received: ${fileType || fileName}`,
      },
      { status: 415 }
    )
  } catch (error) {
    console.error('Import API error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        error: 'IMPORT_FAILED',
        message: `Server error: ${error instanceof Error ? error.message : 'Failed to process file'}. Please try again or contact support if the issue persists.`,
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}
