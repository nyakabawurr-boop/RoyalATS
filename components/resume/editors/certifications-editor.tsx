'use client'

import { Resume, ResumeCertification } from '@/types/resume'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2 } from 'lucide-react'

interface CertificationsEditorProps {
  resume: Resume
  onUpdate: (updates: Partial<Resume>) => void
}

export function CertificationsEditor({ resume, onUpdate }: CertificationsEditorProps) {
  const addCertification = () => {
    const newCert: ResumeCertification = {
      id: `cert_${Date.now()}`,
      name: '',
      issuer: '',
    }
    onUpdate({
      certifications: [...resume.certifications, newCert],
    })
  }

  const updateCertification = (id: string, updates: Partial<ResumeCertification>) => {
    onUpdate({
      certifications: resume.certifications.map(cert =>
        cert.id === id ? { ...cert, ...updates } : cert
      ),
    })
  }

  const removeCertification = (id: string) => {
    onUpdate({
      certifications: resume.certifications.filter(cert => cert.id !== id),
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Certifications</h3>
        <Button onClick={addCertification} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Certification
        </Button>
      </div>

      {resume.certifications.map((cert) => (
        <div key={cert.id} className="border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Certification Name *</Label>
              <Input
                value={cert.name}
                onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                placeholder="AWS Certified Solutions Architect"
              />
            </div>
            <div>
              <Label>Issuing Organization *</Label>
              <Input
                value={cert.issuer}
                onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                placeholder="Amazon Web Services"
              />
            </div>
            <div>
              <Label>Issue Date</Label>
              <Input
                type="month"
                value={cert.date || ''}
                onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
              />
            </div>
            <div>
              <Label>Expiry Date (Optional)</Label>
              <Input
                type="month"
                value={cert.expiryDate || ''}
                onChange={(e) => updateCertification(cert.id, { expiryDate: e.target.value })}
              />
            </div>
          </div>

          <Button
            onClick={() => removeCertification(cert.id)}
            size="sm"
            variant="destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove Certification
          </Button>
        </div>
      ))}
    </div>
  )
}

