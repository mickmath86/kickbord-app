"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Loader2, FileText, Image, Mail, Printer } from 'lucide-react'
import { useCampaignData } from "@/app/dashboard/campaigns/create/context"

interface WizardGeneratingProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const GENERATION_STEPS = [
  { id: 1, title: "Analyzing property details", icon: FileText, duration: 2000 },
  { id: 2, title: "Processing media files", icon: Image, duration: 3000 },
  { id: 3, title: "Creating marketing copy", icon: Mail, duration: 4000 },
  { id: 4, title: "Generating print materials", icon: Printer, duration: 2000 },
  { id: 5, title: "Finalizing campaign", icon: CheckCircle, duration: 1000 }
]

export function WizardGenerating({ onNext }: WizardGeneratingProps) {
  const { data, updateData } = useCampaignData()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let stepIndex = 0
    let totalProgress = 0

    const processStep = () => {
      if (stepIndex < GENERATION_STEPS.length) {
        const step = GENERATION_STEPS[stepIndex]
        setCurrentStep(stepIndex + 1)
        
        const stepProgress = 100 / GENERATION_STEPS.length
        const startProgress = totalProgress
        const endProgress = totalProgress + stepProgress
        
        let currentProgress = startProgress
        const progressInterval = setInterval(() => {
          currentProgress += 2
          if (currentProgress >= endProgress) {
            currentProgress = endProgress
            clearInterval(progressInterval)
            
            setTimeout(() => {
              stepIndex++
              totalProgress = endProgress
              processStep()
            }, 500)
          }
          setProgress(currentProgress)
        }, step.duration / 50)
      } else {
        // Generation complete
        const mockGeneratedContent = {
          property_description: "Stunning 3-bedroom, 2.5-bathroom home in a desirable neighborhood...",
          social_posts: [
            "🏡 New Listing Alert! Beautiful family home with modern updates...",
            "✨ Open House this weekend! Don't miss this gem..."
          ],
          email_template: "Subject: New Listing - Your Dream Home Awaits...",
          flyer_content: "JUST LISTED - Move-in Ready Home..."
        }
        
        updateData({ generated_copy: mockGeneratedContent })
        
        setTimeout(() => {
          onNext()
        }, 1000)
      }
    }

    const timer = setTimeout(() => {
      processStep()
    }, 1000)

    return () => clearTimeout(timer)
  }, [onNext, updateData])

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Generating Your Marketing Campaign</h2>
        <p className="text-muted-foreground">
          Please wait while we create your personalized marketing materials...
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Creating Your Campaign</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          <div className="space-y-4">
            {GENERATION_STEPS.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === index + 1
              const isComplete = currentStep > index + 1
              const isPending = currentStep < index + 1

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive ? "bg-blue-50 border border-blue-200" : 
                    isComplete ? "bg-green-50 border border-green-200" : 
                    "bg-gray-50"
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    isActive ? "bg-blue-100" : 
                    isComplete ? "bg-green-100" : 
                    "bg-gray-100"
                  }`}>
                    {isActive ? (
                      <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                    ) : isComplete ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Icon className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <span className={`font-medium ${
                    isActive ? "text-blue-900" : 
                    isComplete ? "text-green-900" : 
                    "text-gray-500"
                  }`}>
                    {step.title}
                  </span>
                  {isActive && (
                    <div className="ml-auto">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">What we're creating for you:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              {data.materials_to_generate.map((material, index) => (
                <li key={index}>• {material}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
