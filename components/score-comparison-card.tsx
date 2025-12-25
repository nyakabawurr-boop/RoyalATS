'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScoreResponse, ScoreRanking } from '@/types'
import { Badge } from '@/components/ui/badge'
import { ArrowUp, ArrowDown, Minus, TrendingUp } from 'lucide-react'

interface ScoreComparisonCardProps {
  beforeScore: ScoreResponse | null
  afterScore: ScoreResponse | null
  loading?: 'before' | 'after' | null
}

export function ScoreComparisonCard({
  beforeScore,
  afterScore,
  loading,
}: ScoreComparisonCardProps) {
  const getRankingColor = (ranking: ScoreRanking) => {
    switch (ranking) {
      case 'Strong':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'Weak':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const calculateDelta = (before: number, after: number) => {
    return after - before
  }

  const DeltaDisplay = ({ delta }: { delta: number }) => {
    if (delta > 0) {
      return (
        <span className="text-green-600 flex items-center gap-1">
          <ArrowUp className="h-4 w-4" />
          +{delta}%
        </span>
      )
    } else if (delta < 0) {
      return (
        <span className="text-red-600 flex items-center gap-1">
          <ArrowDown className="h-4 w-4" />
          {delta}%
        </span>
      )
    } else {
      return (
        <span className="text-gray-600 flex items-center gap-1">
          <Minus className="h-4 w-4" />
          0%
        </span>
      )
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Before Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Score Before Optimization</span>
            {loading === 'before' && (
              <span className="text-sm text-gray-500">Calculating...</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {beforeScore ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold">
                    <span className={getScoreColor(beforeScore.overallMatchPct)}>
                      {beforeScore.overallMatchPct}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Overall Match</div>
                </div>
                <Badge className={getRankingColor(beforeScore.ranking)}>
                  {beforeScore.ranking}
                </Badge>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Skills Match</span>
                  <span className={`font-semibold ${getScoreColor(beforeScore.skillsMatchPct)}`}>
                    {beforeScore.skillsMatchPct}%
                  </span>
                </div>
                {beforeScore.missingSkills && beforeScore.missingSkills.length > 0 && (
                  <div className="text-xs text-gray-500 mt-2">
                    Missing: {beforeScore.missingSkills.slice(0, 3).join(', ')}
                    {beforeScore.missingSkills.length > 3 && '...'}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {loading === 'before' ? (
                <span>Calculating baseline score...</span>
              ) : (
                <span>Baseline score will appear here</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* After Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Score After Optimization</span>
            {loading === 'after' && (
              <span className="text-sm text-gray-500">Recalculating...</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {afterScore ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold">
                    <span className={getScoreColor(afterScore.overallMatchPct)}>
                      {afterScore.overallMatchPct}%
                    </span>
                    {beforeScore && (
                      <span className="ml-3 text-lg">
                        <DeltaDisplay
                          delta={calculateDelta(beforeScore.overallMatchPct, afterScore.overallMatchPct)}
                        />
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Overall Match</div>
                </div>
                <Badge className={getRankingColor(afterScore.ranking)}>
                  {afterScore.ranking}
                </Badge>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Skills Match</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${getScoreColor(afterScore.skillsMatchPct)}`}>
                      {afterScore.skillsMatchPct}%
                    </span>
                    {beforeScore && (
                      <DeltaDisplay
                        delta={calculateDelta(beforeScore.skillsMatchPct, afterScore.skillsMatchPct)}
                      />
                    )}
                  </div>
                </div>
                {afterScore.missingSkills.length > 0 && (
                  <div className="text-xs text-gray-500 mt-2">
                    Missing: {afterScore.missingSkills.slice(0, 3).join(', ')}
                    {afterScore.missingSkills.length > 3 && '...'}
                  </div>
                )}
                {beforeScore?.missingSkills && afterScore.missingSkills.length < beforeScore.missingSkills.length && (
                  <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Improved skill alignment
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {loading === 'after' ? (
                <span>Recalculating score after optimization...</span>
              ) : (
                <span>After score will appear here</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

