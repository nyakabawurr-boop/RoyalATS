/**
 * Template Renderer - Routes to the correct template component
 */

import { Resume } from '@/types/resume'
import { MinimalTemplate } from './templates/minimal'
import { ModernTemplate } from './templates/modern'
import { ClassicTemplate } from './templates/classic'
import { CompactTemplate } from './templates/compact'
import { BoldTemplate } from './templates/bold'

export function TemplateRenderer({ resume }: { resume: Resume }) {
  switch (resume.template) {
    case 'minimal':
      return <MinimalTemplate resume={resume} />
    case 'modern':
      return <ModernTemplate resume={resume} />
    case 'classic':
      return <ClassicTemplate resume={resume} />
    case 'compact':
      return <CompactTemplate resume={resume} />
    case 'bold':
      return <BoldTemplate resume={resume} />
    default:
      return <ModernTemplate resume={resume} />
  }
}

export const TEMPLATE_OPTIONS = [
  { id: 'minimal', name: 'Minimal', description: 'Clean and simple' },
  { id: 'modern', name: 'Modern', description: 'Contemporary design' },
  { id: 'classic', name: 'Classic', description: 'Traditional format' },
  { id: 'compact', name: 'Compact', description: 'Space-efficient' },
  { id: 'bold', name: 'Bold', description: 'Eye-catching design' },
] as const

