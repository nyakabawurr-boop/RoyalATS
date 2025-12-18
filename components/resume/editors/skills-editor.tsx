'use client'

import { Resume, ResumeSkillCategory } from '@/types/resume'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

interface SkillsEditorProps {
  resume: Resume
  onUpdate: (updates: Partial<Resume>) => void
}

export function SkillsEditor({ resume, onUpdate }: SkillsEditorProps) {
  const addCategory = () => {
    const newCat: ResumeSkillCategory = {
      id: `skill_${Date.now()}`,
      name: '',
      skills: [],
    }
    onUpdate({
      skills: [...resume.skills, newCat],
    })
  }

  const updateCategory = (id: string, updates: Partial<ResumeSkillCategory>) => {
    onUpdate({
      skills: resume.skills.map(cat =>
        cat.id === id ? { ...cat, ...updates } : cat
      ),
    })
  }

  const removeCategory = (id: string) => {
    onUpdate({
      skills: resume.skills.filter(cat => cat.id !== id),
    })
  }

  const addSkill = (catId: string) => {
    const cat = resume.skills.find(c => c.id === catId)
    if (cat) {
      updateCategory(catId, {
        skills: [...cat.skills, ''],
      })
    }
  }

  const updateSkill = (catId: string, skillIndex: number, value: string) => {
    const cat = resume.skills.find(c => c.id === catId)
    if (cat) {
      const skills = [...cat.skills]
      skills[skillIndex] = value
      updateCategory(catId, { skills })
    }
  }

  const removeSkill = (catId: string, skillIndex: number) => {
    const cat = resume.skills.find(c => c.id === catId)
    if (cat) {
      updateCategory(catId, {
        skills: cat.skills.filter((_, i) => i !== skillIndex),
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Skills</h3>
        <Button onClick={addCategory} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Category
        </Button>
      </div>

      {resume.skills.map((category) => (
        <div key={category.id} className="border rounded-lg p-4 space-y-3">
          <div>
            <Label>Category Name (Optional)</Label>
            <Input
              value={category.name}
              onChange={(e) => updateCategory(category.id, { name: e.target.value })}
              placeholder="Technical Skills, Languages, etc."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Skills</Label>
              <Button onClick={() => addSkill(category.id)} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Skill
              </Button>
            </div>
            <div className="space-y-2">
              {category.skills.map((skill, skillIdx) => (
                <div key={skillIdx} className="flex gap-2">
                  <Input
                    value={skill}
                    onChange={(e) => updateSkill(category.id, skillIdx, e.target.value)}
                    placeholder="Skill name"
                  />
                  <Button
                    onClick={() => removeSkill(category.id, skillIdx)}
                    size="sm"
                    variant="ghost"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={() => removeCategory(category.id)}
            size="sm"
            variant="destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove Category
          </Button>
        </div>
      ))}
    </div>
  )
}

