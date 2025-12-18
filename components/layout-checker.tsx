'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LayoutAnalysis } from '@/types'
import { AlertCircle, CheckCircle, Info } from 'lucide-react'

interface LayoutCheckerProps {
  analysis: LayoutAnalysis
}

export function LayoutChecker({ analysis }: LayoutCheckerProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="h-4 w-4" />
      case 'medium':
        return <Info className="h-4 w-4" />
      case 'low':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Layout Score */}
      <Card>
        <CardHeader>
          <CardTitle>ATS Layout Compatibility Score</CardTitle>
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
                  strokeDasharray={`${(analysis.layoutScore / 100) * 351.86} 351.86`}
                  className={getScoreColor(analysis.layoutScore)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-3xl font-bold ${getScoreColor(analysis.layoutScore)}`}>
                  {analysis.layoutScore}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues */}
      {analysis.issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Formatting Issues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.issues.map((issue, idx) => (
              <div
                key={idx}
                className={`border rounded-lg p-4 ${getSeverityColor(issue.severity)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getSeverityIcon(issue.severity)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{issue.type}</span>
                      <Badge variant="outline" className="text-xs">
                        {issue.severity}
                      </Badge>
                    </div>
                    <p className="text-sm">{issue.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

