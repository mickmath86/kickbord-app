"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Loader2, Wand2 } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardGeneratingProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const generationSteps = [
  { id: 1, label: "Analyzing property details", duration: 2000 },
  { id: 2, label: "Creating marketing copy", duration: 3000 },
  { id: 3, label: "Generating social media content", duration: 2500 },
  { id: 4, label: "Designing graphics and layouts", duration: 3500 },
  { id: 5, label: "Finalizing materials", duration: 1500 },
]

export function WizardGenerating({ onNext }: WizardGeneratingProps) {
  const { data, updateData } = useCampaignData()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let stepIndex = 0
    const totalProgress = 0

    const runStep = () => {
      if (stepIndex >= generationSteps.length) {
        // Generation complete
        const mockGeneratedContent = {
          facebook_ads: {
            headline: "Stunning Property Now Available!",
            body: `Discover this beautiful ${data.property_type} at ${data.address}. ${data.bedrooms} bed, ${data.bathrooms} bath with ${data.key_features.slice(0, 3).join(", ")}. Priced at $${data.price?.toLocaleString()}. Don't miss out!`,
            cta: "Schedule Your Tour Today",
          },
          landing_page: {
            hero_title: `Your Dream Home Awaits at ${data.address}`,
            description: `This exceptional ${data.property_type} offers ${data.bedrooms} bedrooms and ${data.bathrooms} bathrooms in a prime location.`,
            features: data.key_features,
          },
        }

        updateData({ generated_copy: mockGeneratedContent })
        setTimeout(onNext, 1000)
        return
      }

      const step = generationSteps[stepIndex]
      setCurrentStep(stepIndex + 1)

      // Animate progress for this step
      const stepProgress = (stepIndex / generationSteps.length) * 100
      const nextStepProgress = ((stepIndex + 1) / generationSteps.length) * 100

      let currentProgress = stepProgress
      const progressInterval = setInterval(() => {
        currentProgress += (nextStepProgress - stepProgress) / 20
        setProgress(Math.min(currentProgress, nextStepProgress))

        if (currentProgress >= nextStepProgress) {
          clearInterval(progressInterval)
        }
      }, step.duration / 20)

      setTimeout(() => {
        clearInterval(progressInterval)
        setProgress(nextStepProgress)
        stepIndex++
        setTimeout(runStep, 500)
      }, step.duration)
    }

    runStep()
  }, [data, updateData, onNext])

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Wand2 className="h-5 w-5" />
            <span>Generating Your Marketing Materials</span>
          </CardTitle>
          <CardDescription>Our AI is creating personalized marketing content for your property</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Generation Steps */}
          <div className="space-y-4">
            {generationSteps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-3">
                {index < currentStep - 1 ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : index === currentStep - 1 ? (
                  <Loader2 className="h-5 w-5 text-blue-600 animate-spin flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                )}
                <span className={`text-sm ${index < currentStep ? "text-gray-900" : "text-gray-500"}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* What's Being Generated */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium mb-3">Creating your marketing kit:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {data.materials_to_generate?.map((material) => (
                <div key={material} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="capitalize">{material.replace("_", " ")}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Property Summary */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Generating materials for:</p>
            <p className="font-medium text-gray-900">{data.address}</p>
            <p>
              {data.bedrooms} bed • {data.bathrooms} bath • ${data.price?.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
