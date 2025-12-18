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

