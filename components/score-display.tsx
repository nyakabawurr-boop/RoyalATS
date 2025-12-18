'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MatchAnalysis } from '@/types'

interface ScoreDisplayProps {
  analysis: MatchAnalysis
}

export function ScoreDisplay({ analysis }: ScoreDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Match Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(analysis.matchScore / 100) * 351.86} 351.86`}
                  className={getScoreColor(analysis.matchScore)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{analysis.matchScore}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Skills & Keywords</span>
              <span className="text-sm font-bold">{analysis.categoryScores.skills}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getScoreColor(analysis.categoryScores.skills)}`}
                style={{ width: `${analysis.categoryScores.skills}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Experience Alignment</span>
              <span className="text-sm font-bold">{analysis.categoryScores.experience}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getScoreColor(analysis.categoryScores.experience)}`}
                style={{ width: `${analysis.categoryScores.experience}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Education & Certifications</span>
              <span className="text-sm font-bold">{analysis.categoryScores.education}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getScoreColor(analysis.categoryScores.education)}`}
                style={{ width: `${analysis.categoryScores.education}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Overall Relevance</span>
              <span className="text-sm font-bold">{analysis.categoryScores.relevance}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getScoreColor(analysis.categoryScores.relevance)}`}
                style={{ width: `${analysis.categoryScores.relevance}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Matched Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.matchedKeywords.map((keyword, idx) => (
                <Badge key={idx} variant="secondary" className="bg-green-100 text-green-800">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Missing Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.missingKeywords.map((keyword, idx) => (
                <Badge key={idx} variant="secondary" className="bg-red-100 text-red-800">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{analysis.summaryFeedback}</p>
        </CardContent>
      </Card>
    </div>
  )
}

