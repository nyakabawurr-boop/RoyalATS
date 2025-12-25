'use client'

import { useState, useEffect, useCallback } from 'react'
import { Resume, DEFAULT_RESUME } from '@/types/resume'
import { createNewResume, saveResumeToLocalStorage, getResumeDrafts, importResumeFromJSON, exportResumeToJSON, startResumeSession, getCurrentResumeSession, endResumeSession, updateCurrentSession } from '@/lib/resume-storage'
import { exportResumeToPDF } from '@/lib/resume-export-new'
import { importResume } from '@/lib/resume-importer'
import { TemplateRenderer, TEMPLATE_OPTIONS } from '@/components/resume/template-renderer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Download, FileText, Upload, Save, Trash2, Loader2 } from 'lucide-react'

// Import section editors (we'll create these)
import { ContactEditor } from '@/components/resume/editors/contact-editor'
import { SummaryEditor } from '@/components/resume/editors/summary-editor'
import { ExperienceEditor } from '@/components/resume/editors/experience-editor'
import { EducationEditor } from '@/components/resume/editors/education-editor'
import { SkillsEditor } from '@/components/resume/editors/skills-editor'
import { ProjectsEditor } from '@/components/resume/editors/projects-editor'
import { CertificationsEditor } from '@/components/resume/editors/certifications-editor'
import { AdditionalSectionsEditor } from '@/components/resume/editors/additional-editor'
import { TailorToJD } from '@/components/resume/tailor-to-jd'

const SECTIONS = [
  { id: 'contact', label: 'Contact' },
  { id: 'summary', label: 'Summary' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'additional', label: 'Additional' },
] as const

type SectionId = typeof SECTIONS[number]['id']

export default function ResumeBuilderPage() {
  const [resume, setResume] = useState<Resume>(() => {
    // Try to restore session on mount
    const session = getCurrentResumeSession()
    return session || createNewResume()
  })
  const [activeSection, setActiveSection] = useState<SectionId>('contact')
  const [hasChanges, setHasChanges] = useState(false)
  const [showLanding, setShowLanding] = useState(false)
  const [importing, setImporting] = useState(false)
  const [sessionActive, setSessionActive] = useState(() => !!getCurrentResumeSession())

  // Auto-save to localStorage and session
  useEffect(() => {
    if (!hasChanges) return
    
    const timeoutId = setTimeout(() => {
      saveResumeToLocalStorage(resume)
      if (sessionActive) {
        updateCurrentSession(resume)
      }
      setHasChanges(false)
    }, 1000) // Debounce 1 second

    return () => clearTimeout(timeoutId)
  }, [resume, hasChanges, sessionActive])

  const updateResume = useCallback((updates: Partial<Resume>) => {
    setResume(prev => ({ ...prev, ...updates }))
    setHasChanges(true)
  }, [])

  const handleStartSession = useCallback(() => {
    startResumeSession(resume)
    setSessionActive(true)
    setShowLanding(false)
  }, [resume])

  const handleEndSession = useCallback(() => {
    if (confirm('End current session? Your progress will be saved to drafts, but the session will be cleared.')) {
      // Save to drafts before ending
      saveResumeToLocalStorage(resume)
      endResumeSession()
      setSessionActive(false)
      setResume(createNewResume())
      setActiveSection('contact')
      setShowLanding(true)
    }
  }, [resume])

  const handleExportPDF = () => {
    exportResumeToPDF(resume)
  }

  const handleExportJSON = () => {
    const json = exportResumeToJSON(resume)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${resume.contact.name || 'resume'}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImportFile = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,.pdf,.docx'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setImporting(true)
        try {
          const imported = await importResume(file)
          setResume(imported)
          startResumeSession(imported)
          setSessionActive(true)
          setShowLanding(false)
          setHasChanges(true)
        } catch (error) {
          console.error('Import error:', error)
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
          alert(`Failed to import resume: ${errorMessage}\n\nNote: PDF and DOCX parsing may not extract all information perfectly. You may need to review and adjust the imported data.`)
        } finally {
          setImporting(false)
        }
      }
    }
    input.click()
  }

  const handleNewResume = () => {
    if (confirm('Create a new resume? Current session will be saved to drafts.')) {
      // Save current session before creating new
      if (sessionActive) {
        saveResumeToLocalStorage(resume)
      }
      const newResume = createNewResume()
      setResume(newResume)
      setActiveSection('contact')
      setShowLanding(false)
      setHasChanges(false)
      // Start new session
      if (sessionActive) {
        startResumeSession(newResume)
      }
    }
  }

  // Check if there are existing drafts on mount
  useEffect(() => {
    const drafts = getResumeDrafts()
    if (drafts.length === 0 && !resume.contact.name && resume.summary === '') {
      setShowLanding(true)
    }
  }, [])

  if (showLanding && !resume.contact.name && resume.summary === '') {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto p-8 text-center">
          <h1 className="text-3xl font-bold mb-6">Resume Builder</h1>
          <p className="text-gray-600 mb-8">
            Build a professional resume step by step. Choose a template, fill in your information, and export as PDF or JSON.
          </p>
          
          <div className="space-y-4">
            <Button onClick={() => {
              const newResume = createNewResume()
              setResume(newResume)
              startResumeSession(newResume)
              setSessionActive(true)
              setShowLanding(false)
            }} size="lg" className="w-full">
              Start New Resume
            </Button>
            <Button 
              onClick={handleImportFile} 
              variant="outline" 
              size="lg" 
              className="w-full"
              disabled={importing}
            >
              {importing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Resume (JSON, PDF, DOCX)
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Editor */}
      <div className="w-1/3 border-r bg-white overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Resume Builder</h2>
            <div className="flex gap-2">
              {sessionActive && (
                <Button 
                  onClick={handleEndSession} 
                  variant="outline" 
                  size="sm" 
                  title="End Session"
                  className="text-orange-600 hover:text-orange-700"
                >
                  End Session
                </Button>
              )}
              <Button onClick={handleNewResume} variant="outline" size="sm" title="New Resume">
                New
              </Button>
              <Button onClick={handleExportPDF} variant="outline" size="sm" title="Export PDF">
                <Download className="h-4 w-4" />
              </Button>
              <Button onClick={handleExportJSON} variant="outline" size="sm" title="Export JSON">
                <FileText className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {sessionActive && (
            <div className="text-xs text-green-600 mb-2 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Session active - Auto-saving
            </div>
          )}

          {/* Template Selector */}
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Template</label>
            <select
              value={resume.template}
              onChange={(e) => updateResume({ template: e.target.value })}
              className="w-full p-2 border rounded"
            >
              {TEMPLATE_OPTIONS.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Section Stepper */}
          <div className="flex flex-wrap gap-2">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-3 py-1 text-sm rounded ${
                  activeSection === section.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section Editor */}
        <div className="p-4">
          {activeSection === 'contact' && (
            <ContactEditor resume={resume} onUpdate={updateResume} />
          )}
          {activeSection === 'summary' && (
            <SummaryEditor resume={resume} onUpdate={updateResume} />
          )}
          {activeSection === 'experience' && (
            <ExperienceEditor resume={resume} onUpdate={updateResume} />
          )}
          {activeSection === 'education' && (
            <EducationEditor resume={resume} onUpdate={updateResume} />
          )}
          {activeSection === 'skills' && (
            <SkillsEditor resume={resume} onUpdate={updateResume} />
          )}
          {activeSection === 'projects' && (
            <ProjectsEditor resume={resume} onUpdate={updateResume} />
          )}
          {activeSection === 'certifications' && (
            <CertificationsEditor resume={resume} onUpdate={updateResume} />
          )}
          {activeSection === 'additional' && (
            <AdditionalSectionsEditor resume={resume} onUpdate={updateResume} />
          )}

          {/* Tailor to JD Panel - Always visible at bottom */}
          <div className="mt-8 border-t pt-4">
            <TailorToJD resume={resume} onResumeUpdate={updateResume} />
          </div>
        </div>
      </div>

      {/* Right Side - Preview */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg min-h-[11in]">
          <TemplateRenderer resume={resume} />
        </div>
      </div>
    </div>
  )
}

