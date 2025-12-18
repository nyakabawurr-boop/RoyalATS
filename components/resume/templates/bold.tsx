import { Resume } from '@/types/resume'
import { TemplateBase } from './template-base'

export function BoldTemplate({ resume }: { resume: Resume }) {
  return (
    <TemplateBase
      resume={resume}
      className="bold-template bg-white p-10 max-w-4xl mx-auto text-sm"
    />
  )
}

