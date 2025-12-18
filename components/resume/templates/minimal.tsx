import { Resume } from '@/types/resume'
import { TemplateBase } from './template-base'

export function MinimalTemplate({ resume }: { resume: Resume }) {
  return (
    <TemplateBase
      resume={resume}
      className="minimal-template bg-white p-8 max-w-4xl mx-auto text-sm"
    />
  )
}

