'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { OptimizationSteps } from '@/components/optimization-steps'
import { CoverLetterPanel } from '@/components/cover-letter-panel'
import { ScoreComparisonCard } from '@/components/score-comparison-card'
import { OptimizationPlan, ScoreResponse } from '@/types'
import { Loader2, RefreshCw, Download, LogOut, LogIn } from 'lucide-react'
import { saveOptimizeSession, getOptimizeSession, clearOptimizeSession } from '@/lib/optimize-session'

export default function OptimizePage() {
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [plan, setPlan] = useState<OptimizationPlan | null>(null)
  const [optimizedResumeText, setOptimizedResumeText] = useState<string>('')
  const [useOptimizedResume, setUseOptimizedResume] = useState(true)
  const [beforeScore, setBeforeScore] = useState<ScoreResponse | null>(null)
  const [afterScore, setAfterScore] = useState<ScoreResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingBeforeScore, setLoadingBeforeScore] = useState(false)
  const [loadingAfterScore, setLoadingAfterScore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionActive, setSessionActive] = useState(false)

  // Restore session on mount
  useEffect(() => {
    const session = getOptimizeSession()
    if (session) {
      setResumeText(session.resumeText || '')
      setJobDescription(session.jobDescription || '')
      if (session.optimizedResumeText) {
        setOptimizedResumeText(session.optimizedResumeText)
      }
      if (session.beforeScore) {
        setBeforeScore(session.beforeScore)
      }
      if (session.afterScore) {
        setAfterScore(session.afterScore)
      }
      if (session.plan) {
        setPlan(session.plan)
      }
      setSessionActive(true)
    }
  }, [])

  // Auto-save session
  useEffect(() => {
    if (!sessionActive) return
    
    const timeoutId = setTimeout(() => {
      saveOptimizeSession({
        resumeText,
        jobDescription,
        optimizedResumeText,
        beforeScore,
        afterScore,
        plan,
      })
    }, 2000) // Debounce 2 seconds

    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeText, jobDescription, optimizedResumeText, beforeScore, afterScore, plan, sessionActive])

  // Calculate baseline score when resume and job description are available
  const calculateBeforeScore = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      return
    }

    setLoadingBeforeScore(true)
    setError(null)

    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resumeText.trim(),
          jobDescription: jobDescription.trim(),
          mode: 'baseline',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to calculate baseline score')
      }

      const data: ScoreResponse = await response.json()
      setBeforeScore(data)
    } catch (err) {
      console.error('Error calculating before score:', err)
      // Don't show error for baseline score calculation, just log it
    } finally {
      setLoadingBeforeScore(false)
    }
  }

  // Calculate after score using optimized resume
  const calculateAfterScore = async (optimizedText: string) => {
    if (!optimizedText.trim() || !jobDescription.trim()) {
      return
    }

    setLoadingAfterScore(true)
    setError(null)

    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: optimizedText.trim(),
          jobDescription: jobDescription.trim(),
          mode: 'post',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to calculate after score')
      }

      const data: ScoreResponse = await response.json()
      setAfterScore(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate after score')
    } finally {
      setLoadingAfterScore(false)
    }
  }

  // Auto-calculate baseline score when both inputs are provided
  useEffect(() => {
    if (resumeText.trim().length > 100 && jobDescription.trim().length > 100 && !beforeScore && !loadingBeforeScore) {
      const timer = setTimeout(() => {
        calculateBeforeScore()
      }, 1000) // Debounce by 1 second

      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeText, jobDescription])

  const handleOptimize = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError('Please provide both resume text and job description')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Step 1: Calculate baseline score if not already calculated
      if (!beforeScore) {
        await calculateBeforeScore()
      }

      // Step 2: Generate optimization plan
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resumeText.trim(),
          jobDescription: jobDescription.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate optimization plan')
      }

      const data: OptimizationPlan = await response.json()
      setPlan(data)

      // Step 3: Set optimized resume text
      if (data.optimizedResumeText) {
        setOptimizedResumeText(data.optimizedResumeText)
      } else {
        // Fallback: use original resume if AI didn't provide optimized version
        setOptimizedResumeText(resumeText.trim())
      }

      // Step 4: Calculate after score with optimized resume
      if (data.optimizedResumeText) {
        await calculateAfterScore(data.optimizedResumeText)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleRecalculateAfterScore = async () => {
    const textToUse = useOptimizedResume ? optimizedResumeText : resumeText
    if (textToUse.trim()) {
      await calculateAfterScore(textToUse)
    }
  }

  const handleStartSession = () => {
    saveOptimizeSession({
      resumeText,
      jobDescription,
      optimizedResumeText,
      beforeScore,
      afterScore,
      plan,
    })
    setSessionActive(true)
  }

  const handleEndSession = () => {
    if (confirm('End current session? Your progress will be cleared. You can always start a new session.')) {
      clearOptimizeSession()
      setSessionActive(false)
      setResumeText('')
      setJobDescription('')
      setOptimizedResumeText('')
      setPlan(null)
      setBeforeScore(null)
      setAfterScore(null)
    }
  }

  const handleDownloadOptimizedResume = () => {
    const textToDownload = useOptimizedResume && optimizedResumeText ? optimizedResumeText : resumeText
    if (!textToDownload.trim()) {
      alert('No resume text to download')
      return
    }

    const blob = new Blob([textToDownload], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `optimized-resume-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Determine which resume text to show
  const currentResumeText = useOptimizedResume && optimizedResumeText ? optimizedResumeText : resumeText

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Resume Optimization</h1>
        <div className="flex items-center gap-2">
          {sessionActive ? (
            <>
              <span className="text-sm text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Session active
              </span>
              <Button onClick={handleEndSession} variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                End Session
              </Button>
            </>
          ) : (
            <Button onClick={handleStartSession} variant="outline" size="sm">
              <LogIn className="mr-2 h-4 w-4" />
              Start Session
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="resume-text">Paste your resume content</Label>
            <Textarea
              id="resume-text"
              placeholder="Paste your resume content here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="min-h-[400px] mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="job-description">Paste the job description</Label>
            <Textarea
              id="job-description"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[400px] mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Baseline Score - shown when resume and JD are provided */}
      {resumeText.trim() && jobDescription.trim() && (
        <div className="mb-6">
          <ScoreComparisonCard
            beforeScore={beforeScore}
            afterScore={null}
            loading={loadingBeforeScore ? 'before' : null}
          />
        </div>
      )}

      <div className="flex justify-center mb-8">
        <Button
          onClick={handleOptimize}
          disabled={loading || !resumeText.trim() || !jobDescription.trim()}
          size="lg"
          className="px-8"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Optimizing Resume...
            </>
          ) : (
            'Generate Optimization Plan'
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* After Score Comparison - shown after optimization */}
      {plan && optimizedResumeText && (
        <div className="mb-6">
          <ScoreComparisonCard
            beforeScore={beforeScore}
            afterScore={afterScore}
            loading={loadingAfterScore ? 'after' : null}
          />
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleRecalculateAfterScore}
              disabled={loadingAfterScore}
              variant="outline"
              size="sm"
            >
              {loadingAfterScore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recalculating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Recalculate After Score
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Toggle for optimized resume display */}
      {plan && optimizedResumeText && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Optimized Resume Preview</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleDownloadOptimizedResume}
                  variant="outline"
                  size="sm"
                  title="Download Optimized Resume"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Label htmlFor="use-optimized" className="text-sm">
                  <input
                    id="use-optimized"
                    type="checkbox"
                    checked={useOptimizedResume}
                    onChange={(e) => setUseOptimizedResume(e.target.checked)}
                    className="mr-2"
                  />
                  Show optimized resume
                </Label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={currentResumeText}
              onChange={(e) => {
                if (useOptimizedResume) {
                  setOptimizedResumeText(e.target.value)
                } else {
                  setResumeText(e.target.value)
                }
              }}
              className="min-h-[400px] font-mono text-sm"
              placeholder="Optimized resume will appear here..."
            />
            {plan.changesSummary && plan.changesSummary.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <h3 className="font-semibold text-sm mb-2">Key Changes Made:</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {plan.changesSummary.map((change, index) => (
                    <li key={index}>{change}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {plan && <OptimizationSteps plan={plan} />}

      {/* Cover Letter Section - shown after optimization plan is generated */}
      {plan && (
        <CoverLetterPanel
          resumeText={useOptimizedResume && optimizedResumeText ? optimizedResumeText : resumeText}
          jobDescription={jobDescription}
          autoGenerate={true}
        />
      )}
    </div>
  )
}
