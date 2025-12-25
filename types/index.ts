// AI Response Types
export interface MatchAnalysis {
  matchScore: number; // 0-100
  categoryScores: {
    skills: number;
    experience: number;
    education: number;
    relevance: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  summaryFeedback: string;
}

export interface OptimizationStep {
  title: string;
  description: string;
  suggestions: {
    section: string;
    currentText: string;
    suggestedText: string;
  }[];
}

export interface OptimizationPlan {
  steps: OptimizationStep[];
  optimizedResumeText?: string;  // NEW: Full optimized resume text
  changesSummary?: string[];      // NEW: Summary of changes made
}

// Scoring Types
export type ScoreRanking = 'Strong' | 'Moderate' | 'Weak';

export interface ScoreResponse {
  overallMatchPct: number;        // 0-100
  skillsMatchPct: number;         // 0-100
  ranking: ScoreRanking;
  matchedSkills: string[];
  missingSkills: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  notes: string[];
}

export interface LayoutAnalysis {
  layoutScore: number; // 0-100
  issues: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  recommendations: string[];
}

// Cover Letter Types
export type CoverLetterTone = 'Professional' | 'Enthusiastic' | 'Concise';
export type CoverLetterLength = 'Short' | 'Standard';

export interface CoverLetterRequest {
  resumeText: string;
  jobDescription: string;
  tone?: CoverLetterTone;
  length?: CoverLetterLength;
  companyName?: string;
  roleTitle?: string;
  hiringManager?: string;
  location?: string;
  keyHighlights?: string[];
  userName?: string;
  contactInfo?: string;
}

export interface CoverLetterResponse {
  coverLetter: string;
  bulletsUsed: string[];
  detectedCompany: string | null;
  detectedRole: string | null;
}

// Resume Types
export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
  };
  headline: string;
  summary: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    bullets: string[];
  }[];
  education: {
    degree: string;
    school: string;
    location?: string;
    graduationDate?: string;
    gpa?: string;
  }[];
  projects?: {
    name: string;
    description: string;
    technologies?: string[];
    url?: string;
  }[];
  certifications?: {
    name: string;
    issuer: string;
    date?: string;
    expiryDate?: string;
  }[];
}

