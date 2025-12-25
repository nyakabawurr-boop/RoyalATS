import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'
import { saveAs } from 'file-saver'

interface CoverLetterExportOptions {
  userName?: string
  contactInfo?: string
  companyName?: string
  roleTitle?: string
}

/**
 * Export cover letter as DOCX file
 */
export async function downloadCoverLetterAsDocx(
  content: string,
  options: CoverLetterExportOptions = {}
): Promise<void> {
  const { userName, contactInfo, companyName, roleTitle } = options

  // Parse content into paragraphs (split by double line breaks)
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0)

  // Build document sections
  const docSections: Paragraph[] = []

  // Header with name and contact info (if provided)
  if (userName || contactInfo) {
    if (userName) {
      docSections.push(
        new Paragraph({
          text: userName,
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 120 },
        })
      )
    }
    if (contactInfo) {
      const contactLines = contactInfo.split('\n').filter(line => line.trim())
      contactLines.forEach(line => {
        docSections.push(
          new Paragraph({
            text: line.trim(),
            spacing: { after: 60 },
          })
        )
      })
    }
    // Add spacing after header
    docSections.push(
      new Paragraph({
        text: '',
        spacing: { after: 240 },
      })
    )
  }

  // Date
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  docSections.push(
    new Paragraph({
      text: dateStr,
      spacing: { after: 240 },
    })
  )

  // Company and role (if provided)
  if (companyName || roleTitle) {
    const recipientLines: string[] = []
    if (companyName) recipientLines.push(companyName)
    if (roleTitle) recipientLines.push(roleTitle)
    
    recipientLines.forEach(line => {
      docSections.push(
        new Paragraph({
          text: line,
          spacing: { after: 60 },
        })
      )
    })
    docSections.push(
      new Paragraph({
        text: '',
        spacing: { after: 240 },
      })
    )
  }

  // Greeting (try to extract from content, or use default)
  let greetingFound = false
  const firstParagraph = paragraphs[0] || ''
  if (firstParagraph.toLowerCase().includes('dear')) {
    greetingFound = true
  }

  // Cover letter body paragraphs
  paragraphs.forEach((para, index) => {
    // Skip if it's just a greeting line (we'll handle it separately)
    const trimmedPara = para.trim()
    if (trimmedPara.toLowerCase().startsWith('dear') && trimmedPara.length < 100) {
      docSections.push(
        new Paragraph({
          text: trimmedPara,
          spacing: { after: 120 },
        })
      )
    } else {
      // Regular paragraph
      docSections.push(
        new Paragraph({
          text: trimmedPara,
          spacing: { after: index === paragraphs.length - 1 ? 120 : 180 },
          alignment: AlignmentType.JUSTIFIED,
        })
      )
    }
  })

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docSections,
      },
    ],
  })

  // Generate and download
  const blob = await Packer.toBlob(doc)
  const fileName = `Cover Letter${companyName ? ` - ${companyName}` : ''}${roleTitle ? ` - ${roleTitle}` : ''}.docx`
  saveAs(blob, fileName)
}
