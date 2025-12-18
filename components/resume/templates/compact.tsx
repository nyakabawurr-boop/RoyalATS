import { Resume } from '@/types/resume'
import { TemplateBase } from './template-base'

export function CompactTemplate({ resume }: { resume: Resume }) {
  return (
    <TemplateBase
      resume={resume}
      className="compact-template bg-white p-6 max-w-4xl mx-auto text-xs"
    />
  )
}

