'use client'

import { Resume } from '@/types/resume'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface SummaryEditorProps {
  resume: Resume
  onUpdate: (updates: Partial<Resume>) => void
}

export function SummaryEditor({ resume, onUpdate }: SummaryEditorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Professional Summary</h3>
      <div>
        <Label htmlFor="summary">
          Write a brief summary of your professional background and key strengths
        </Label>
        <Textarea
          id="summary"
          value={resume.summary}
          onChange={(e) => onUpdate({ summary: e.target.value })}
          placeholder="Experienced professional with expertise in..."
          className="min-h-[200px] mt-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          Tip: Keep it concise (2-3 sentences) and highlight your most relevant achievements.
        </p>
      </div>
    </div>
  )
}

