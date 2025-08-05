"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Loader2 } from "lucide-react"
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
  { id: 3, label: "Generating headlines and descriptions", duration: 2500 },
  { id: 4, label: "Optimizing for selected platforms", duration: 2000 },
  { id: 5, label: "Finalizing materials", duration: 1500 },
]

export function WizardGenerating({ onNext }: WizardGeneratingProps) {
  const { updateData } = useCampaignData()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let stepIndex = 0
    let progressValue = 0

    const runStep = () => {
      if (stepIndex < generationSteps.length) {
        setCurrentStep(stepIndex)

        const stepDuration = generationSteps[stepIndex].duration
        const progressIncrement = 100 / generationSteps.length
        const startProgress = progressValue
        const endProgress = progressValue + progressIncrement

        // Animate progress for current step
        const progressInterval = setInterval(
          () => {
            progressValue += 2
            if (progressValue >= endProgress) {
              progressValue = endProgress
              clearInterval(progressInterval)

              stepIndex++
              setTimeout(runStep, 500) // Brief pause between steps
            }
            setProgress(progressValue)
          },
          stepDuration / (progressIncrement / 2),
        )
      } else {
        // Generation complete, create mock data
        const mockGeneratedCopy = {
          headline: [
            "Stunning Modern Home in Prime Location",
            "Your Dream Home Awaits in This Beautiful Property",
            "Exceptional Living in a Desirable Neighborhood",
          ],
          eyebrow: ["NEW LISTING", "JUST LISTED", "EXCLUSIVE OPPORTUNITY"],
          subCopy: [
            "Discover luxury living in this beautifully appointed home featuring modern amenities and prime location.",
            "This exceptional property offers the perfect blend of comfort, style, and convenience.",
            "Experience the best of modern living in this thoughtfully designed home.",
          ],
          fullBio: [
            "Welcome to this stunning property that perfectly combines modern luxury with comfortable living. Featuring spacious rooms, premium finishes, and an ideal location, this home offers everything you've been searching for. The open-concept design creates a seamless flow between living spaces, while large windows flood the interior with natural light.",
            "This exceptional home showcases the finest in contemporary design and functionality. From the moment you enter, you'll be impressed by the attention to detail and quality craftsmanship throughout. The thoughtfully planned layout maximizes both privacy and entertainment possibilities.",
            "Nestled in a highly sought-after neighborhood, this beautiful property offers the perfect sanctuary from the everyday hustle. With its blend of modern amenities and timeless appeal, this home represents an outstanding opportunity for discerning buyers.",
          ],
          amenities: [
            ["Modern Kitchen", "Spacious Bedrooms", "Updated Bathrooms", "Private Outdoor Space"],
            ["Premium Finishes", "Open Floor Plan", "Natural Light", "Prime Location"],
            ["Move-in Ready", "Quality Construction", "Desirable Neighborhood", "Excellent Value"],
          ],
          cta: [
            "Schedule Your Private Tour Today",
            "Contact Us for More Information",
            "Don't Miss This Opportunity - Call Now",
          ],
        }

        updateData({ generated_copy: mockGeneratedCopy })
        setTimeout(onNext, 1000)
      }
    }

    runStep()
  }, [updateData, onNext])

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-12 text-center">
          <div className="space-y-8">
            <div>
              <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-2">Generating Your Marketing Materials</h2>
              <p className="text-muted-foreground">
                Our AI is creating personalized copy and materials for your property listing
              </p>
            </div>

            <div className="space-y-6">
              <Progress value={progress} className="w-full h-2" />

              <div className="space-y-4">
                {generationSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                      index < currentStep
                        ? "bg-green-50 text-green-700"
                        : index === currentStep
                          ? "bg-blue-50 text-blue-700"
                          : "text-muted-foreground"
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : index === currentStep ? (
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                    )}
                    <span className="font-medium">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm text-muted-foreground">This usually takes 30-60 seconds...</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
