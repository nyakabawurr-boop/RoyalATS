'use client'

import { Resume, ResumeEducation } from '@/types/resume'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

interface EducationEditorProps {
  resume: Resume
  onUpdate: (updates: Partial<Resume>) => void
}

export function EducationEditor({ resume, onUpdate }: EducationEditorProps) {
  const addEducation = () => {
    const newEdu: ResumeEducation = {
      id: `edu_${Date.now()}`,
      degree: '',
      school: '',
      graduationDate: '',
    }
    onUpdate({
      education: [...resume.education, newEdu],
    })
  }

  const updateEducation = (id: string, updates: Partial<ResumeEducation>) => {
    onUpdate({
      education: resume.education.map(edu =>
        edu.id === id ? { ...edu, ...updates } : edu
      ),
    })
  }

  const removeEducation = (id: string) => {
    onUpdate({
      education: resume.education.filter(edu => edu.id !== id),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Education</h3>
        <Button onClick={addEducation} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Education
        </Button>
      </div>

      {resume.education.map((edu) => (
        <div key={edu.id} className="border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Degree *</Label>
              <Input
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                placeholder="Bachelor of Science"
              />
            </div>
            <div>
              <Label>School *</Label>
              <Input
                value={edu.school}
                onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                placeholder="University Name"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={edu.location || ''}
                onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                placeholder="City, State"
              />
            </div>
            <div>
              <Label>Graduation Date</Label>
              <Input
                type="month"
                value={edu.graduationDate || ''}
                onChange={(e) => updateEducation(edu.id, { graduationDate: e.target.value })}
              />
            </div>
            <div>
              <Label>GPA (Optional)</Label>
              <Input
                value={edu.gpa || ''}
                onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                placeholder="3.8"
              />
            </div>
          </div>

          <Button
            onClick={() => removeEducation(edu.id)}
            size="sm"
            variant="destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        </div>
      ))}
    </div>
  )
}

