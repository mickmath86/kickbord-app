"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Sparkles, FileText, ImageIcon, Globe, Printer } from "lucide-react"
import { useCampaignData } from "@/components/campaign-wizard"

const GENERATION_STEPS = [
  { id: "analyzing", label: "Analyzing Property", icon: Sparkles, duration: 2000 },
  { id: "content", label: "Generating Content", icon: FileText, duration: 3000 },
  { id: "images", label: "Processing Images", icon: ImageIcon, duration: 2500 },
  { id: "materials", label: "Creating Materials", icon: Printer, duration: 3500 },
  { id: "finalizing", label: "Finalizing Campaign", icon: Globe, duration: 1500 },
]

export function WizardGenerating() {
  const { nextStep } = useCampaignData()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let stepTimeout: NodeJS.Timeout
    let progressInterval: NodeJS.Timeout

    const runStep = (stepIndex: number) => {
      if (stepIndex >= GENERATION_STEPS.length) {
        // All steps complete, move to next wizard step
        setTimeout(() => {
          nextStep()
        }, 1000)
        return
      }

      setCurrentStep(stepIndex)
      const step = GENERATION_STEPS[stepIndex]
      let stepProgress = 0

      // Animate progress for current step
      progressInterval = setInterval(() => {
        stepProgress += 2
        const totalProgress = stepIndex * 20 + stepProgress * 0.2
        setProgress(Math.min(totalProgress, 100))

        if (stepProgress >= 100) {
          clearInterval(progressInterval)
        }
      }, step.duration / 50)

      // Move to next step
      stepTimeout = setTimeout(() => {
        clearInterval(progressInterval)
        runStep(stepIndex + 1)
      }, step.duration)
    }

    runStep(0)

    return () => {
      clearTimeout(stepTimeout)
      clearInterval(progressInterval)
    }
  }, [nextStep])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Generating Your Campaign</h2>
        <p className="text-muted-foreground mt-2">
          Our AI is creating personalized marketing materials for your property
        </p>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Current Step */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-blue-100 rounded-full">
                  {GENERATION_STEPS[currentStep] && (\
                    <GENERATION_STEPS[currentStep].icon className="h-8 w-8 text-blue-600 animate-pulse" />
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

            {/* Steps List */}
            <div className="space-y-3">
              {GENERATION_STEPS.map((step, index) => {
                const Icon = step.icon
                const isCompleted = index < currentStep
                const isCurrent = index === currentStep
                const isPending = index > currentStep

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isCurrent ? "bg-blue-50 border border-blue-200" : ""
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      isCompleted ? "bg-green-100" : 
                      isCurrent ? "bg-blue-100" : "bg-gray-100"
                    }`}>
                      <Icon className={`h-4 w-4 ${
                        isCompleted ? "text-green-600" :
                        isCurrent ? "text-blue-600" : "text-gray-400"
                      }`} />
                    </div>
                    <span className={`flex-1 ${
                      isCompleted ? "text-green-700" :
                      isCurrent ? "text-blue-700 font-medium" : "text-gray-500"
                    }`}>
                      {step.label}
                    </span>
                    <Badge variant={
                      isCompleted ? "default" :
                      isCurrent ? "secondary" : "outline"
                    } className={
                      isCompleted ? "bg-green-100 text-green-800" :
                      isCurrent ? "bg-blue-100 text-blue-800" : ""
                    }>
                      {isCompleted ? "Complete" :
                       isCurrent ? "In Progress" : "Pending"}
                    </Badge>
                  </div>
                )
              })}
            </div>

            {/* Fun Facts */}
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Did you know?</strong> Our AI analyzes over 50 data points to create 
                personalized marketing content that resonates with your target audience.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
