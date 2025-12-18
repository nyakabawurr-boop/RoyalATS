'use client'

import { Resume } from '@/types/resume'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

interface ContactEditorProps {
  resume: Resume
  onUpdate: (updates: Partial<Resume>) => void
}

export function ContactEditor({ resume, onUpdate }: ContactEditorProps) {
  const updateContact = (field: keyof Resume['contact'], value: any) => {
    onUpdate({
      contact: {
        ...resume.contact,
        [field]: value,
      },
    })
  }

  const addLink = () => {
    updateContact('links', [
      ...resume.contact.links,
      { label: '', url: '' }
    ])
  }

  const updateLink = (index: number, field: 'label' | 'url', value: string) => {
    const links = [...resume.contact.links]
    links[index] = { ...links[index], [field]: value }
    updateContact('links', links)
  }

  const removeLink = (index: number) => {
    updateContact('links', resume.contact.links.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Contact Information</h3>
      
      <div>
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          value={resume.contact.name}
          onChange={(e) => updateContact('name', e.target.value)}
          placeholder="John Doe"
        />
      </div>

      <div>
        <Label htmlFor="headline">Professional Headline</Label>
        <Input
          id="headline"
          value={resume.contact.headline || ''}
          onChange={(e) => updateContact('headline', e.target.value)}
          placeholder="Software Engineer"
        />
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={resume.contact.email}
          onChange={(e) => updateContact('email', e.target.value)}
          placeholder="john@example.com"
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={resume.contact.phone || ''}
          onChange={(e) => updateContact('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={resume.contact.location || ''}
          onChange={(e) => updateContact('location', e.target.value)}
          placeholder="City, State"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Links</Label>
          <Button onClick={addLink} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Link
          </Button>
        </div>
        {resume.contact.links.map((link, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <Input
              placeholder="Label (e.g., LinkedIn)"
              value={link.label}
              onChange={(e) => updateLink(index, 'label', e.target.value)}
            />
            <Input
              placeholder="URL"
              value={link.url}
              onChange={(e) => updateLink(index, 'url', e.target.value)}
            />
            <Button
              onClick={() => removeLink(index)}
              size="sm"
              variant="ghost"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

