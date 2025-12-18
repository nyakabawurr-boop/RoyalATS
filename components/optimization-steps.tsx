'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { OptimizationPlan } from '@/types'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface OptimizationStepsProps {
  plan: OptimizationPlan
}

export function OptimizationSteps({ plan }: OptimizationStepsProps) {
  const [copiedIndex, setCopiedIndex] = useState<{ step: number; suggestion: number } | null>(null)

  const copyToClipboard = (text: string, stepIdx: number, suggestionIdx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex({ step: stepIdx, suggestion: suggestionIdx })
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step-by-Step Optimization Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {plan.steps.map((step, stepIdx) => (
            <AccordionItem key={stepIdx} value={`step-${stepIdx}`}>
              <AccordionTrigger className="text-left">
                <div>
                  <div className="font-semibold">{step.title}</div>
                  <div className="text-sm text-gray-600 font-normal mt-1">{step.description}</div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {step.suggestions.map((suggestion, suggestionIdx) => (
                    <div key={suggestionIdx} className="border rounded-lg p-4 space-y-3">
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">
                          Section: {suggestion.section}
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Current:</p>
                            <div className="bg-gray-50 p-3 rounded border text-sm">
                              {suggestion.currentText}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Suggested:</p>
                            <div className="bg-green-50 p-3 rounded border border-green-200 text-sm">
                              {suggestion.suggestedText}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(suggestion.suggestedText, stepIdx, suggestionIdx)}
                        className="w-full"
                      >
                        {copiedIndex?.step === stepIdx && copiedIndex?.suggestion === suggestionIdx ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Suggested Text
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

