'use client'

import { Resume, ResumeCustomSection } from '@/types/resume'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

interface AdditionalSectionsEditorProps {
  resume: Resume
  onUpdate: (updates: Partial<Resume>) => void
}

export function AdditionalSectionsEditor({ resume, onUpdate }: AdditionalSectionsEditorProps) {
  const addSection = () => {
    const newSection: ResumeCustomSection = {
      id: `section_${Date.now()}`,
      title: '',
      content: '',
    }
    onUpdate({
      additional: [...resume.additional, newSection],
    })
  }

  const updateSection = (id: string, updates: Partial<ResumeCustomSection>) => {
    onUpdate({
      additional: resume.additional.map(section =>
        section.id === id ? { ...section, ...updates } : section
      ),
    })
  }

  const removeSection = (id: string) => {
    onUpdate({
      additional: resume.additional.filter(section => section.id !== id),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Additional Sections</h3>
        <Button onClick={addSection} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Section
        </Button>
      </div>

      {resume.additional.map((section) => (
        <div key={section.id} className="border rounded-lg p-4 space-y-4">
          <div>
            <Label>Section Title *</Label>
            <Input
              value={section.title}
              onChange={(e) => updateSection(section.id, { title: e.target.value })}
              placeholder="Awards, Publications, etc."
            />
          </div>

          <div>
            <Label>Content</Label>
            <Textarea
              value={section.content}
              onChange={(e) => updateSection(section.id, { content: e.target.value })}
              placeholder="Section content..."
              className="min-h-[100px]"
            />
          </div>

          <Button
            onClick={() => removeSection(section.id)}
            size="sm"
            variant="destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove Section
          </Button>
        </div>
      ))}
    </div>
  )
}

