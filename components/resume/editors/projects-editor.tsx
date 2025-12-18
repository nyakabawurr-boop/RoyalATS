'use client'

import { Resume, ResumeProject } from '@/types/resume'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

interface ProjectsEditorProps {
  resume: Resume
  onUpdate: (updates: Partial<Resume>) => void
}

export function ProjectsEditor({ resume, onUpdate }: ProjectsEditorProps) {
  const addProject = () => {
    const newProj: ResumeProject = {
      id: `proj_${Date.now()}`,
      name: '',
      description: '',
      technologies: [],
    }
    onUpdate({
      projects: [...resume.projects, newProj],
    })
  }

  const updateProject = (id: string, updates: Partial<ResumeProject>) => {
    onUpdate({
      projects: resume.projects.map(proj =>
        proj.id === id ? { ...proj, ...updates } : proj
      ),
    })
  }

  const removeProject = (id: string) => {
    onUpdate({
      projects: resume.projects.filter(proj => proj.id !== id),
    })
  }

  const updateTechnologies = (id: string, techs: string[]) => {
    updateProject(id, { technologies: techs })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Projects</h3>
        <Button onClick={addProject} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Project
        </Button>
      </div>

      {resume.projects.map((project) => (
        <div key={project.id} className="border rounded-lg p-4 space-y-4">
          <div>
            <Label>Project Name *</Label>
            <Input
              value={project.name}
              onChange={(e) => updateProject(project.id, { name: e.target.value })}
              placeholder="Project Name"
            />
          </div>

          <div>
            <Label>Description *</Label>
            <Textarea
              value={project.description}
              onChange={(e) => updateProject(project.id, { description: e.target.value })}
              placeholder="Brief description of the project..."
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label>Technologies (comma-separated)</Label>
            <Input
              value={project.technologies?.join(', ') || ''}
              onChange={(e) => {
                const techs = e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                updateTechnologies(project.id, techs)
              }}
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div>
            <Label>URL (Optional)</Label>
            <Input
              value={project.url || ''}
              onChange={(e) => updateProject(project.id, { url: e.target.value })}
              placeholder="https://project-url.com"
            />
          </div>

          <Button
            onClick={() => removeProject(project.id)}
            size="sm"
            variant="destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove Project
          </Button>
        </div>
      ))}
    </div>
  )
}

