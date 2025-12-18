'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScoreDisplay } from '@/components/score-display'
import { MatchAnalysis } from '@/types'
import { Upload, Loader2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

export default function JobMatchPage() {
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [analysis, setAnalysis] = useState<MatchAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    try {
      // For demo, we'll read as text
      // In production, use proper PDF/DOCX parsing
      const text = await file.text()
      setResumeText(text)
      setError(null)
    } catch (err) {
      setError('Failed to read file. Please paste your resume text instead.')
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: false,
  })

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError('Please provide both resume text and job description')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resumeText.trim(),
          jobDescription: jobDescription.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze match')
      }

      const data = await response.json()
      setAnalysis(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Match Analysis</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Resume Input */}
        <Card>
          <CardHeader>
            <CardTitle>Resume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-gray-400 bg-gray-50' : 'border-gray-300'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {isDragActive
                  ? 'Drop your resume here'
                  : 'Drag & drop a resume file, or click to select'}
              </p>
              <p className="text-xs text-gray-400 mt-2">Supports TXT, PDF, DOCX</p>
            </div>
            <div>
              <Label htmlFor="resume-text">Or paste resume text</Label>
              <Textarea
                id="resume-text"
                placeholder="Paste your resume content here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="min-h-[300px] mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Job Description Input */}
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

      {/* Analyze Button */}
      <div className="flex justify-center mb-8">
        <Button
          onClick={handleAnalyze}
          disabled={loading || !resumeText.trim() || !jobDescription.trim()}
          size="lg"
          className="px-8"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Match'
          )}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Results */}
      {analysis && <ScoreDisplay analysis={analysis} />}
    </div>
  )
}

