'use client'

import { useState } from 'react'
import { Resume, ResumeExperience } from '@/types/resume'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Sparkles } from 'lucide-react'
import { getSuggestions, inferJobFamily } from '@/data/phrases'
import { strengthenBullet, isWeakBullet } from '@/lib/bullet-rewriter'

interface ExperienceEditorProps {
  resume: Resume
  onUpdate: (updates: Partial<Resume>) => void
}

export function ExperienceEditor({ resume, onUpdate }: ExperienceEditorProps) {
  const [jobTitleForSuggestions, setJobTitleForSuggestions] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  const addExperience = () => {
    const newExp: ResumeExperience = {
      id: `exp_${Date.now()}`,
      jobTitle: '',
      company: '',
      startDate: '',
      current: false,
      bullets: [],
    }
    onUpdate({
      experience: [...resume.experience, newExp],
    })
  }

  const updateExperience = (id: string, updates: Partial<ResumeExperience>) => {
    onUpdate({
      experience: resume.experience.map(exp =>
        exp.id === id ? { ...exp, ...updates } : exp
      ),
    })
  }

  const removeExperience = (id: string) => {
    onUpdate({
      experience: resume.experience.filter(exp => exp.id !== id),
    })
  }

  const addBullet = (expId: string) => {
    const exp = resume.experience.find(e => e.id === expId)
    if (exp) {
      updateExperience(expId, {
        bullets: [...exp.bullets, ''],
      })
    }
  }

  const updateBullet = (expId: string, bulletIndex: number, value: string) => {
    const exp = resume.experience.find(e => e.id === expId)
    if (exp) {
      const bullets = [...exp.bullets]
      bullets[bulletIndex] = value
      updateExperience(expId, { bullets })
    }
  }

  const removeBullet = (expId: string, bulletIndex: number) => {
    const exp = resume.experience.find(e => e.id === expId)
    if (exp) {
      updateExperience(expId, {
        bullets: exp.bullets.filter((_, i) => i !== bulletIndex),
      })
    }
  }

  const strengthenBulletPoint = (expId: string, bulletIndex: number) => {
    const exp = resume.experience.find(e => e.id === expId)
    if (exp && exp.bullets[bulletIndex]) {
      const strengthened = strengthenBullet(exp.bullets[bulletIndex])
      updateBullet(expId, bulletIndex, strengthened)
    }
  }

  const loadSuggestions = () => {
    if (!jobTitleForSuggestions.trim()) return
    
    const family = inferJobFamily(jobTitleForSuggestions)
    const suggs = getSuggestions(family, 8)
    setSuggestions(suggs.bullets)
  }

  const insertSuggestion = (expId: string, suggestion: string) => {
    const exp = resume.experience.find(e => e.id === expId)
    if (exp) {
      updateExperience(expId, {
        bullets: [...exp.bullets, suggestion],
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <Button onClick={addExperience} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Experience
        </Button>
      </div>

      {/* Suggestions Helper */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <Label>Get Smart Suggestions</Label>
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="Enter job title for suggestions"
            value={jobTitleForSuggestions}
            onChange={(e) => setJobTitleForSuggestions(e.target.value)}
            className="flex-1"
          />
          <Button onClick={loadSuggestions} size="sm" variant="outline">
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {resume.experience.map((exp) => (
        <div key={exp.id} className="border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Job Title *</Label>
              <Input
                value={exp.jobTitle}
                onChange={(e) => updateExperience(exp.id, { jobTitle: e.target.value })}
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <Label>Company *</Label>
              <Input
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                placeholder="Company Name"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={exp.location || ''}
                onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                placeholder="City, State"
              />
            </div>
            <div>
              <Label>Start Date *</Label>
              <Input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="month"
                value={exp.endDate || ''}
                onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                disabled={exp.current}
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                />
                <span className="text-sm">Current Position</span>
              </label>
            </div>
          </div>

          {/* Bullets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Bullet Points</Label>
              <div className="flex gap-2">
                {suggestions.length > 0 && (
                  <div className="text-xs text-blue-600">
                    {suggestions.length} suggestions available
                  </div>
                )}
                <Button onClick={() => addBullet(exp.id)} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Bullet
                </Button>
              </div>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded border">
                <Label className="text-xs font-medium mb-2 block">Quick Insert:</Label>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((sugg, idx) => (
                    <button
                      key={idx}
                      onClick={() => insertSuggestion(exp.id, sugg)}
                      className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-100"
                    >
                      {sugg.substring(0, 40)}...
                    </button>
                  ))}
                </div>
              </div>
            )}

            {exp.bullets.map((bullet, bulletIdx) => (
              <div key={bulletIdx} className="flex gap-2 mb-2">
                <Textarea
                  value={bullet}
                  onChange={(e) => updateBullet(exp.id, bulletIdx, e.target.value)}
                  placeholder="Describe an achievement or responsibility..."
                  className="min-h-[60px] flex-1"
                />
                <div className="flex flex-col gap-1">
                  {isWeakBullet(bullet) && (
                    <Button
                      onClick={() => strengthenBulletPoint(exp.id, bulletIdx)}
                      size="sm"
                      variant="outline"
                      title="Strengthen this bullet"
                    >
                      <Sparkles className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    onClick={() => removeBullet(exp.id, bulletIdx)}
                    size="sm"
                    variant="ghost"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {exp.bullets.length === 0 && (
              <p className="text-xs text-gray-500 italic">
                Add bullet points to describe your achievements and responsibilities.
              </p>
            )}
          </div>

          <Button
            onClick={() => removeExperience(exp.id)}
            size="sm"
            variant="destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove Experience
          </Button>
        </div>
      ))}
    </div>
  )
}

