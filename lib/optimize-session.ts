/**
 * Session management for Optimize page
 * Saves resume text, job description, optimized resume, and scores to localStorage
 */

const OPTIMIZE_SESSION_KEY = 'royal_optimize_session'

export interface OptimizeSession {
  resumeText: string
  jobDescription: string
  optimizedResumeText?: string
  beforeScore?: any
  afterScore?: any
  plan?: any
  updatedAt: string
}

export function saveOptimizeSession(session: Partial<OptimizeSession>): void {
  try {
    const existing = getOptimizeSession()
    const updated: OptimizeSession = {
      ...existing,
      ...session,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(OPTIMIZE_SESSION_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to save optimize session:', error)
  }
}

export function getOptimizeSession(): OptimizeSession | null {
  try {
    const stored = localStorage.getItem(OPTIMIZE_SESSION_KEY)
    if (!stored) return null
    return JSON.parse(stored) as OptimizeSession
  } catch (error) {
    console.error('Failed to load optimize session:', error)
    return null
  }
}

export function clearOptimizeSession(): void {
  try {
    localStorage.removeItem(OPTIMIZE_SESSION_KEY)
  } catch (error) {
    console.error('Failed to clear optimize session:', error)
  }
}

