/**
 * Resume Storage Utilities
 * Handles localStorage persistence and schema migrations
 */

import { Resume, DEFAULT_RESUME } from '@/types/resume'

const STORAGE_KEY = 'royal_resume_drafts'
const CURRENT_SESSION_KEY = 'royal_resume_current_session'
const CURRENT_VERSION = '1.0.0'

export function saveResumeToLocalStorage(resume: Resume): void {
  try {
    resume.updatedAt = new Date().toISOString()
    const drafts = getResumeDrafts()
    const existingIndex = drafts.findIndex(d => d.id === resume.id)
    
    if (existingIndex >= 0) {
      drafts[existingIndex] = resume
    } else {
      drafts.push(resume)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts))
  } catch (error) {
    console.error('Failed to save resume to localStorage:', error)
  }
}

export function getResumeDrafts(): Resume[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const drafts = JSON.parse(stored) as Resume[]
    // Migrate old versions if needed
    return drafts.map(draft => migrateResume(draft))
  } catch (error) {
    console.error('Failed to load resumes from localStorage:', error)
    return []
  }
}

export function getResumeDraft(id: string): Resume | null {
  const drafts = getResumeDrafts()
  return drafts.find(d => d.id === id) || null
}

export function deleteResumeDraft(id: string): void {
  try {
    const drafts = getResumeDrafts()
    const filtered = drafts.filter(d => d.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Failed to delete resume from localStorage:', error)
  }
}

export function createNewResume(): Resume {
  return {
    ...DEFAULT_RESUME,
    id: `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

function migrateResume(resume: Resume): Resume {
  // Handle future schema migrations here
  if (resume.version !== CURRENT_VERSION) {
    // For now, just update version
    resume.version = CURRENT_VERSION
  }
  return resume
}

/**
 * Export resume as JSON string
 */
export function exportResumeToJSON(resume: Resume): string {
  return JSON.stringify(resume, null, 2)
}

/**
 * Import resume from JSON string
 */
export function importResumeFromJSON(jsonString: string): Resume {
  try {
    const parsed = JSON.parse(jsonString) as Resume
    // Validate and migrate if needed
    const migrated = migrateResume(parsed)
    // Ensure required fields
    if (!migrated.id) {
      migrated.id = `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    if (!migrated.createdAt) {
      migrated.createdAt = new Date().toISOString()
    }
    migrated.updatedAt = new Date().toISOString()
    return migrated
  } catch (error) {
    throw new Error('Invalid resume JSON format')
  }
}

/**
 * Session management for Resume Builder
 */
export function startResumeSession(resume: Resume): void {
  try {
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(resume))
  } catch (error) {
    console.error('Failed to start resume session:', error)
  }
}

export function getCurrentResumeSession(): Resume | null {
  try {
    const stored = localStorage.getItem(CURRENT_SESSION_KEY)
    if (!stored) return null
    const resume = JSON.parse(stored) as Resume
    return migrateResume(resume)
  } catch (error) {
    console.error('Failed to load current resume session:', error)
    return null
  }
}

export function endResumeSession(): void {
  try {
    localStorage.removeItem(CURRENT_SESSION_KEY)
  } catch (error) {
    console.error('Failed to end resume session:', error)
  }
}

export function updateCurrentSession(resume: Resume): void {
  try {
    resume.updatedAt = new Date().toISOString()
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(resume))
  } catch (error) {
    console.error('Failed to update resume session:', error)
  }
}

