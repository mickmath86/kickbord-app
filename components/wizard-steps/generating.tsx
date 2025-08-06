"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Loader2, Sparkles, FileText, ImageIcon, Mail, Globe } from 'lucide-react'
import { useCampaignData } from "@/app/dashboard/campaigns/create/context"

interface WizardGeneratingProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const GENERATION_STEPS = [
  { id: "analyzing", label: "Analyzing Property Details", icon: Sparkles, duration: 2000 },
  { id: "content", label: "Generating Marketing Copy", icon: FileText, duration: 3000 },
  { id: "visuals", label: "Creating Visual Concepts", icon: ImageIcon, duration: 2500 },
  { id: "email", label: "Crafting Email Templates", icon: Mail, duration: 2000 },
  { id: "landing", label: "Building Landing Page", icon: Globe, duration: 3000 },
  { id: "finalizing", label: "Finalizing Campaign", icon: CheckCircle, duration: 1500 },
]

export function WizardGenerating({ onNext }: WizardGeneratingProps) {
  const { data, updateData } = useCampaignData()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  useEffect(() => {
    if (!data) return

    let stepIndex = 0
    const runStep = () => {
      if (stepIndex >= GENERATION_STEPS.length) {
        // Generation complete - create mock generated content
        const mockGeneratedContent = {
          social_posts: [
            `🏡 JUST LISTED! Stunning ${data.bedrooms}BR/${data.bathrooms}BA ${data.property_type} at ${data.address}. ${data.key_features?.slice(0, 3).join(", ")}. Priced at $${data.price?.toLocaleString()}. Don't miss this gem! #JustListed #DreamHome`,
            `✨ NEW TO MARKET ✨ This beautiful ${data.property_type} offers the perfect blend of comfort and style. ${data.key_features?.slice(0, 2).join(" and ")}. Schedule your showing today! #NewListing #RealEstate`,
          ],
          property_description: `Welcome to this exceptional ${data.bedrooms}-bedroom, ${data.bathrooms}-bathroom ${data.property_type} located at ${data.address}. This stunning property offers ${data.key_features?.slice(0, 5).join(", ")} and so much more. Priced at $${data.price?.toLocaleString()}, this home represents incredible value in today's market.`,
          email_subject: `New Listing Alert - ${data.address}`,
          email_body: `I'm excited to share this incredible new listing that just hit the market. This ${data.property_type} at ${data.address} offers everything you've been looking for and more. With ${data.bedrooms} bedrooms, ${data.bathrooms} bathrooms, and features like ${data.key_features?.slice(0, 3).join(", ")}, this property won't last long at $${data.price?.toLocaleString()}.`,
          landing_page_headline: `Your Dream Home Awaits at ${data.address}`,
          landing_page_subheading: `Discover this exceptional ${data.bedrooms}BR/${data.bathrooms}BA ${data.property_type} featuring ${data.key_features?.slice(0, 2).join(" and ")}.`,
        }

        updateData({ generated_copy: mockGeneratedContent })
        setTimeout(() => onNext(), 1000)
        return
      }

      const step = GENERATION_STEPS[stepIndex]
      setCurrentStep(stepIndex)

      // Animate progress for this step
      let stepProgress = 0
      const progressInterval = setInterval(() => {
        stepProgress += 2
        const totalProgress =
          (stepIndex / GENERATION_STEPS.length) * 100 + (stepProgress / 100) * (100 / GENERATION_STEPS.length)
        setProgress(Math.min(totalProgress, 100))

        if (stepProgress >= 100) {
          clearInterval(progressInterval)
        }
      }, step.duration / 50)

      // Complete step and move to next
      setTimeout(() => {
        clearInterval(progressInterval)
        setCompletedSteps((prev) => [...prev, stepIndex])
        stepIndex++
        setTimeout(runStep, 500)
      }, step.duration)
    }

    runStep()
  }, [data, updateData, onNext])

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            Generating Your Marketing Campaign
          </CardTitle>
          <CardDescription>
            Our AI is creating personalized marketing materials for your property
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Overall Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-blue-100 rounded-full">
                {GENERATION_STEPS[currentStep] && (
                  <GENERATION_STEPS[currentStep].icon className="h-8 w-8 text-blue-600" />
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {GENERATION_STEPS[currentStep]?.label}
              </h3>
              <p className="text-muted-foreground">
                This may take a few moments...
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {GENERATION_STEPS.map((step, index) => {
              const Icon = step.icon
              const isCompleted = completedSteps.includes(index)
              const isCurrent = index === currentStep

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                    isCurrent 
                      ? "bg-blue-50 border border-blue-200 scale-105" 
                      : isCompleted
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    isCompleted ? "bg-green-100" : 
                    isCurrent ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : isCurrent ? (
                      <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                    ) : (
                      <Icon className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      isCompleted ? "text-green-700" :
                      isCurrent ? "text-blue-700" : "text-gray-500"
                    }`}>
                      {step.label}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {isCompleted ? "Complete" :
                       isCurrent ? "In progress..." : "Pending"}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium mb-3">Creating materials for:</h4>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{data.address}</p>
              <p>{data.bedrooms} bed • {data.bathrooms} bath • ${data.price?.toLocaleString()}</p>
              <p className="text-muted-foreground">
                {data.materials_to_generate?.length} marketing materials selected
              </p>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p>
              💡 <strong>Did you know?</strong> Our AI analyzes over 50 data points to create 
              personalized marketing content that resonates with your target audience.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
