'use client'

import { useState } from 'react'
import { Resume } from '@/types/resume'
import { extractKeywordsFromJD, checkKeywordDensity } from '@/lib/keyword-extractor'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, AlertCircle } from 'lucide-react'

interface TailorToJDProps {
  resume: Resume
  onResumeUpdate: (updates: Partial<Resume>) => void
}

export function TailorToJD({ resume, onResumeUpdate }: TailorToJDProps) {
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<{
    keywords: string[]
    matched: string[]
    missing: string[]
    suggestions: string[]
    densityWarnings: string[]
  } | null>(null)

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return

    setLoading(true)
    try {
      // Convert resume to text for analysis
      const resumeText = [
        resume.contact.headline,
        resume.summary,
        ...resume.experience.flatMap(exp => [
          exp.jobTitle,
          exp.company,
          ...exp.bullets
        ]),
        ...resume.skills.flatMap(cat => cat.skills),
      ].filter(Boolean).join('\n')

      const keywordAnalysis = await extractKeywordsFromJD(jobDescription, resumeText)
      
      // Check keyword density in summary and experience
      const summaryText = resume.summary
      const summaryDensity = checkKeywordDensity(summaryText, keywordAnalysis.keywords)
      
      const experienceText = resume.experience.flatMap(exp => exp.bullets).join(' ')
      const experienceDensity = checkKeywordDensity(experienceText, keywordAnalysis.keywords)

      setAnalysis({
        ...keywordAnalysis,
        densityWarnings: [...summaryDensity.warnings, ...experienceDensity.warnings],
      })
    } catch (error) {
      console.error('Error analyzing JD:', error)
      alert('Failed to analyze job description. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const addMissingKeywordsToSkills = () => {
    if (!analysis) return

    const currentSkills = resume.skills.length > 0 
      ? resume.skills[0].skills 
      : []

    const newSkills = [...new Set([...currentSkills, ...analysis.missing.slice(0, 10)])]
    
    if (resume.skills.length > 0) {
      onResumeUpdate({
        skills: resume.skills.map((cat, idx) => 
          idx === 0 ? { ...cat, skills: newSkills } : cat
        ),
      })
    } else {
      onResumeUpdate({
        skills: [{
          id: `skill_${Date.now()}`,
          name: 'Skills',
          skills: newSkills,
        }],
      })
    }
  }

  return (
    <Card className="p-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Tailor to Job Description</h3>
        <p className="text-sm text-gray-600 mb-4">
          Paste a job description to see keyword matching and get suggestions.
        </p>
      </div>

      <div>
        <Label htmlFor="jd-input">Job Description</Label>
        <Textarea
          id="jd-input"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description here..."
          className="min-h-[150px] mt-2"
        />
      </div>

      <Button
        onClick={handleAnalyze}
        disabled={loading || !jobDescription.trim()}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          'Analyze Keywords'
        )}
      </Button>

      {analysis && (
        <div className="space-y-4 pt-4 border-t">
          {/* Warnings */}
          {analysis.densityWarnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Keyword Density Warning</p>
                  {analysis.densityWarnings.map((warning, idx) => (
                    <p key={idx} className="text-xs text-yellow-700 mt-1">{warning}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Matched Keywords */}
          {analysis.matched.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Matched Keywords ({analysis.matched.length})</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {analysis.matched.map((keyword, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-green-100 text-green-800">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Missing Keywords */}
          {analysis.missing.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Missing Keywords ({analysis.missing.length})</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {analysis.missing.slice(0, 15).map((keyword, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-red-100 text-red-800">
                    {keyword}
                  </Badge>
                ))}
              </div>
              <Button
                onClick={addMissingKeywordsToSkills}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Add Missing Keywords to Skills
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

