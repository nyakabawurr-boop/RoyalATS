/**
 * Resume Data Model - Single Source of Truth
 * Version: 1.0.0
 */

export interface ResumeContact {
  name: string
  headline?: string
  phone?: string
  email: string
  location?: string
  links: {
    label: string
    url: string
  }[]
}

export interface ResumeExperience {
  id: string
  jobTitle: string
  company: string
  location?: string
  startDate: string // YYYY-MM format
  endDate?: string // YYYY-MM format
  current: boolean
  bullets: string[]
}

export interface ResumeEducation {
  id: string
  degree: string
  school: string
  location?: string
  graduationDate?: string // YYYY-MM format
  gpa?: string
}

export interface ResumeSkillCategory {
  id: string
  name: string
  skills: string[]
}

export interface ResumeProject {
  id: string
  name: string
  description: string
  technologies?: string[]
  url?: string
}

export interface ResumeCertification {
  id: string
  name: string
  issuer: string
  date?: string // YYYY-MM format
  expiryDate?: string // YYYY-MM format
}

export interface ResumeCustomSection {
  id: string
  title: string
  content: string
  bullets?: string[]
}

export interface Resume {
  id: string
  version: string // Schema version for migration
  template: string // Template identifier
  theme?: {
    fontFamily?: string
    fontSize?: string
    spacing?: string
    accentColor?: string
  }
  contact: ResumeContact
  summary: string
  experience: ResumeExperience[]
  education: ResumeEducation[]
  skills: ResumeSkillCategory[]
  projects: ResumeProject[]
  certifications: ResumeCertification[]
  additional: ResumeCustomSection[]
  createdAt: string
  updatedAt: string
}

export const DEFAULT_RESUME: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'> = {
  version: '1.0.0',
  template: 'modern',
  contact: {
    name: '',
    email: '',
    links: [],
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  additional: [],
}

