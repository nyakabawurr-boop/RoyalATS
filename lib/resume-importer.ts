/**
 * Resume Import Utilities
 * Supports JSON, PDF, and DOCX file imports
 */

import { Resume, DEFAULT_RESUME, ResumeExperience, ResumeEducation, ResumeProject } from '@/types/resume'
import { importResumeFromJSON } from './resume-storage'

/**
 * Import resume from various file formats
 */
export async function importResume(file: File): Promise<Resume> {
  const fileType = file.type
  const fileName = file.name.toLowerCase()

  // Handle JSON files directly in browser
  if (fileType === 'application/json' || fileName.endsWith('.json')) {
    const text = await file.text()
    return importResumeFromJSON(text)
  }

  // Handle PDF and DOCX via API route (requires server-side processing)
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/resume/import', {
    method: 'POST',
    body: formData,
  })

  // Check if response is JSON
  const contentType = response.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    // If we got HTML (error page), read it to see the error
    const text = await response.text()
    if (text.includes('<!DOCTYPE') || text.includes('<html')) {
      throw new Error('Server error occurred while processing the file. The API route may not be working correctly. Please try again or contact support.')
    }
    throw new Error(`Unexpected response type: ${contentType}`)
  }

  if (!response.ok) {
    try {
      const error = await response.json()
      throw new Error(error.error || 'Failed to import file')
    } catch (parseError) {
      throw new Error(`Server returned error status ${response.status}`)
    }
  }

  const result = await response.json()

  // If it's JSON data, import directly
  if (result.type === 'json') {
    return importResumeFromJSON(JSON.stringify(result.data))
  }

  // Otherwise, parse the extracted text
  if (result.type === 'text' && result.data) {
    return parseResumeFromText(result.data)
  }

  throw new Error('Unexpected response format from import API')
}

/**
 * Parse resume text into structured Resume object
 * This is a basic parser - could be enhanced with AI or more sophisticated parsing
 */
function parseResumeFromText(text: string): Resume {
  const resume: Resume = {
    ...DEFAULT_RESUME,
    id: `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)
  
  // Extract name (usually first line)
  if (lines.length > 0) {
    resume.contact.name = lines[0]
  }

  // Extract email
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)
  if (emailMatch) {
    resume.contact.email = emailMatch[0]
  }

  // Extract phone
  const phoneMatch = text.match(/(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/)
  if (phoneMatch) {
    resume.contact.phone = phoneMatch[0]
  }

  // Extract sections
  let currentSection = ''
  let currentExperience: ResumeExperience | null = null
  let currentEducation: ResumeEducation | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lowerLine = line.toLowerCase()

    // Detect section headers
    if (isSectionHeader(line)) {
      currentSection = getSectionName(line)
      continue
    }

    // Parse based on current section
    switch (currentSection) {
      case 'summary':
      case 'professional summary':
      case 'objective':
        if (!resume.summary) {
          resume.summary = line
        } else {
          resume.summary += ' ' + line
        }
        break

      case 'experience':
      case 'work experience':
      case 'employment':
        if (isJobTitleLine(line)) {
          // Save previous experience if exists
          if (currentExperience) {
            resume.experience.push(currentExperience)
          }
          // Start new experience
          const parsed = parseJobTitleLine(line)
          currentExperience = {
            id: `exp_${Date.now()}_${i}`,
            jobTitle: parsed.title,
            company: parsed.company || '',
            location: parsed.location,
            startDate: parsed.startDate || '',
            endDate: parsed.endDate,
            current: parsed.current || false,
            bullets: [],
          }
        } else if (currentExperience && isBulletPoint(line)) {
          currentExperience.bullets.push(cleanBulletPoint(line))
        } else if (currentExperience && isDateRange(line)) {
          const dates = parseDateRange(line)
          if (dates.start) currentExperience.startDate = dates.start
          if (dates.end) currentExperience.endDate = dates.end
          currentExperience.current = dates.current || false
        }
        break

      case 'education':
        if (isDegreeLine(line)) {
          const parsed = parseDegreeLine(line)
          currentEducation = {
            id: `edu_${Date.now()}_${i}`,
            degree: parsed.degree || '',
            school: parsed.school || '',
            location: parsed.location,
            graduationDate: parsed.date,
            gpa: parsed.gpa,
          }
          resume.education.push(currentEducation)
        }
        break

      case 'skills':
      case 'technical skills':
        if (!resume.skills.length) {
          resume.skills.push({
            id: `skill_${Date.now()}`,
            name: '',
            skills: [],
          })
        }
        const skills = extractSkills(line)
        resume.skills[0].skills.push(...skills)
        break

      case 'projects':
        if (isProjectTitle(line)) {
          const project: ResumeProject = {
            id: `proj_${Date.now()}_${i}`,
            name: line,
            description: '',
            technologies: [],
          }
          resume.projects.push(project)
        } else if (resume.projects.length > 0) {
          const lastProject = resume.projects[resume.projects.length - 1]
          if (!lastProject.description) {
            lastProject.description = line
          }
        }
        break
    }
  }

  // Save last experience if exists
  if (currentExperience) {
    resume.experience.push(currentExperience)
  }

  // Clean up
  resume.skills = resume.skills.filter(cat => cat.skills.length > 0)
  
  return resume
}

// Helper functions for parsing

function isSectionHeader(line: string): boolean {
  const headers = [
    'summary', 'professional summary', 'objective',
    'experience', 'work experience', 'employment', 'work history',
    'education', 'educational background',
    'skills', 'technical skills', 'core competencies',
    'projects', 'certifications', 'awards', 'publications'
  ]
  const lower = line.toLowerCase()
  return headers.some(h => lower.startsWith(h) && line.length < 50)
}

function getSectionName(line: string): string {
  const lower = line.toLowerCase()
  if (lower.includes('summary') || lower.includes('objective')) return 'summary'
  if (lower.includes('experience') || lower.includes('employment')) return 'experience'
  if (lower.includes('education')) return 'education'
  if (lower.includes('skill')) return 'skills'
  if (lower.includes('project')) return 'projects'
  if (lower.includes('certification')) return 'certifications'
  return lower
}

function isJobTitleLine(line: string): boolean {
  // Common patterns: "Software Engineer", "Senior Developer at Company"
  return /^[A-Z][a-zA-Z\s]+(?:at|@|\|).*$/i.test(line) || 
         /^(Senior|Junior|Lead|Principal)\s+[A-Z][a-zA-Z\s]+/.test(line)
}

function parseJobTitleLine(line: string): {
  title: string
  company?: string
  location?: string
} {
  const atMatch = line.match(/^(.+?)\s+(?:at|@|\|)\s+(.+?)(?:\s*[-|]\s*(.+))?$/)
  if (atMatch) {
    return {
      title: atMatch[1].trim(),
      company: atMatch[2].trim(),
      location: atMatch[3]?.trim(),
    }
  }
  return { title: line }
}

function isDateRange(line: string): boolean {
  return /\d{4}|\d{1,2}\/\d{4}|Present|Current/i.test(line)
}

function parseDateRange(line: string): {
  start?: string
  end?: string
  current?: boolean
} {
  const current = /present|current/i.test(line)
  const dates = line.match(/(\d{4}|\d{1,2}\/\d{4})/g) || []
  
  if (current) {
    return {
      start: dates[0]?.replace('/', '-').padEnd(7, '-01'),
      current: true,
    }
  }
  
  return {
    start: dates[0]?.replace('/', '-').padEnd(7, '-01'),
    end: dates[1]?.replace('/', '-').padEnd(7, '-01'),
  }
}

function isBulletPoint(line: string): boolean {
  return /^[•\-\*]|^\d+\./.test(line.trim())
}

function cleanBulletPoint(line: string): string {
  return line.replace(/^[•\-\*]\s*|^\d+\.\s*/, '').trim()
}

function isDegreeLine(line: string): boolean {
  return /bachelor|master|phd|doctorate|associate|degree|diploma/i.test(line)
}

function parseDegreeLine(line: string): {
  degree?: string
  school?: string
  location?: string
  date?: string
  gpa?: string
} {
  const gpaMatch = line.match(/gpa[:\s]+(\d+\.?\d*)/i)
  const dateMatch = line.match(/(\d{4})/)
  const parts = line.split(',').map(p => p.trim())
  
  return {
    degree: parts[0],
    school: parts[1],
    location: parts[2],
    date: dateMatch ? dateMatch[1] + '-01' : undefined,
    gpa: gpaMatch ? gpaMatch[1] : undefined,
  }
}

function extractSkills(line: string): string[] {
  // Split by common delimiters
  return line
    .split(/[,;•\-\|]/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && s.length < 50)
}

function isProjectTitle(line: string): boolean {
  // Simple heuristic: capitalized line that's not too long
  return /^[A-Z]/.test(line) && line.length < 100 && !line.includes('|') && !line.includes('@')
}

