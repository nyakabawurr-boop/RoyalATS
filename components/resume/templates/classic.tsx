import { Resume } from '@/types/resume'
import { TemplateBase } from './template-base'

export function ClassicTemplate({ resume }: { resume: Resume }) {
  return (
    <TemplateBase
      resume={resume}
      className="classic-template bg-white p-10 max-w-4xl mx-auto text-sm font-serif"
    />
  )
}

