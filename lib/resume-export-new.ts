/**
 * Resume Export Utilities
 * PDF and JSON export for the new Resume Builder
 */

import { Resume } from '@/types/resume'
import jsPDF from 'jspdf'

/**
 * Export resume as PDF
 */
export function exportResumeToPDF(resume: Resume): void {
  const doc = new jsPDF()
  let yPos = 20
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - 2 * margin

  const addText = (text: string, x: number, y: number, options: {
    fontSize?: number
    bold?: boolean
    align?: 'left' | 'center' | 'right'
    maxWidth?: number
  } = {}): number => {
    let currentY = y
    doc.setFontSize(options.fontSize || 12)
    if (options.bold) {
      doc.setFont(undefined, 'bold')
    } else {
      doc.setFont(undefined, 'normal')
    }
    
    const maxWidth = options.maxWidth || contentWidth
    const lines = doc.splitTextToSize(text, maxWidth)
    
    lines.forEach((line: string) => {
      if (currentY > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage()
        currentY = 20
      }
      doc.text(line, x, currentY, { align: options.align || 'left' })
      currentY += 6
    })
    
    return currentY
  }

  // Name
  yPos = addText(resume.contact.name || 'Your Name', pageWidth / 2, yPos, {
    fontSize: 20,
    bold: true,
    align: 'center'
  })
  yPos += 5

  // Headline
  if (resume.contact.headline) {
    yPos = addText(resume.contact.headline, pageWidth / 2, yPos, {
      fontSize: 14,
      align: 'center'
    })
    yPos += 5
  }

  // Contact Info
  const contactParts = [
    resume.contact.email,
    resume.contact.phone,
    resume.contact.location,
    ...resume.contact.links.map(l => l.url)
  ].filter(Boolean)
  
  if (contactParts.length > 0) {
    yPos = addText(contactParts.join(' | '), pageWidth / 2, yPos, {
      fontSize: 10,
      align: 'center'
    })
    yPos += 10
  }

  // Summary
  if (resume.summary) {
    yPos += 5
    yPos = addText('Professional Summary', margin, yPos, { fontSize: 14, bold: true })
    yPos += 5
    yPos = addText(resume.summary, margin, yPos, { fontSize: 11 })
    yPos += 10
  }

  // Experience
  if (resume.experience.length > 0) {
    yPos += 5
    yPos = addText('Professional Experience', margin, yPos, { fontSize: 14, bold: true })
    yPos += 5
    
    resume.experience.forEach((exp) => {
      const titleText = `${exp.jobTitle}${exp.company ? ` at ${exp.company}` : ''}`
      yPos = addText(titleText, margin, yPos, { fontSize: 12, bold: true })
      
      const dateText = [
        exp.startDate || '',
        exp.current ? ' - Present' : (exp.endDate ? ` - ${exp.endDate}` : ''),
        exp.location ? ` | ${exp.location}` : ''
      ].filter(Boolean).join('')
      
      if (dateText) {
        yPos = addText(dateText, margin, yPos, { fontSize: 10 })
      }
      
      exp.bullets.forEach((bullet) => {
        yPos = addText(`• ${bullet}`, margin + 10, yPos, { fontSize: 11 })
      })
      
      yPos += 5
    })
  }

  // Education
  if (resume.education.length > 0) {
    yPos += 5
    yPos = addText('Education', margin, yPos, { fontSize: 14, bold: true })
    yPos += 5
    
    resume.education.forEach((edu) => {
      const eduText = [
        `${edu.degree}${edu.school ? `, ${edu.school}` : ''}`,
        edu.location,
        edu.graduationDate,
        edu.gpa ? `GPA: ${edu.gpa}` : ''
      ].filter(Boolean).join(' | ')
      
      yPos = addText(eduText, margin, yPos, { fontSize: 11 })
      yPos += 5
    })
  }

  // Skills
  if (resume.skills.length > 0) {
    yPos += 5
    yPos = addText('Skills', margin, yPos, { fontSize: 14, bold: true })
    yPos += 5
    
    resume.skills.forEach((category) => {
      const skillText = category.name 
        ? `${category.name}: ${category.skills.join(', ')}`
        : category.skills.join(', ')
      yPos = addText(skillText, margin, yPos, { fontSize: 11 })
      yPos += 5
    })
  }

  // Projects
  if (resume.projects.length > 0) {
    yPos += 5
    yPos = addText('Projects', margin, yPos, { fontSize: 14, bold: true })
    yPos += 5
    
    resume.projects.forEach((project) => {
      yPos = addText(project.name, margin, yPos, { fontSize: 12, bold: true })
      yPos = addText(project.description, margin, yPos, { fontSize: 11 })
      if (project.technologies && project.technologies.length > 0) {
        yPos = addText(`Technologies: ${project.technologies.join(', ')}`, margin, yPos, { fontSize: 10 })
      }
      yPos += 5
    })
  }

  // Certifications
  if (resume.certifications.length > 0) {
    yPos += 5
    yPos = addText('Certifications', margin, yPos, { fontSize: 14, bold: true })
    yPos += 5
    
    resume.certifications.forEach((cert) => {
      const certText = [
        cert.name,
        cert.issuer,
        cert.date
      ].filter(Boolean).join(' - ')
      
      yPos = addText(certText, margin, yPos, { fontSize: 11 })
      yPos += 5
    })
  }

  const filename = resume.contact.name 
    ? `${resume.contact.name.replace(/\s+/g, '_')}_Resume.pdf`
    : 'resume.pdf'
  
  doc.save(filename)
}

