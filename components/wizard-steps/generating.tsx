"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle, FileText, ImageIcon, Globe, Mail } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardGeneratingProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const generationSteps = [
  { id: 1, label: "Analyzing property details", icon: FileText },
  { id: 2, label: "Processing media files", icon: ImageIcon },
  { id: 3, label: "Generating marketing copy", icon: FileText },
  { id: 4, label: "Creating social media posts", icon: Globe },
  { id: 5, label: "Building landing page", icon: Globe },
  { id: 6, label: "Designing print materials", icon: Mail },
  { id: 7, label: "Finalizing campaign", icon: CheckCircle },
]

export function WizardGenerating({ onNext }: WizardGeneratingProps) {
  const { data } = useCampaignData()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => onNext(), 1000)
          return 100
        }
        return prev + 2
      })
    }, 200)

    return () => clearInterval(timer)
  }, [onNext])

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= generationSteps.length - 1) {
          clearInterval(stepTimer)
          return prev
        }
        return prev + 1
      })
    }, 1500)

    return () => clearInterval(stepTimer)
  }, [])

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Generating Your Campaign</h2>
        <p className="text-lg text-muted-foreground">
          We're creating professional marketing materials for {data.address}
        </p>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            <div className="space-y-4">
              {generationSteps.map((step, index) => {
                const StepIcon = step.icon
                const isCompleted = index < currentStep
                const isCurrent = index === currentStep
                const isPending = index > currentStep

                return (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isCompleted
                        ? "bg-green-50 text-green-700"
                        : isCurrent
                          ? "bg-blue-50 text-blue-700"
                          : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : isCurrent ? (
                        <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    <span className="font-medium">{step.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-medium text-blue-900 mb-2">What we're creating for you:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          {data.materials_to_generate.map((material) => (
            <li key={material}>• {material.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
