"use client"

import { useEffect, useState } from "react"
import { Loader2, CheckCircle } from "lucide-react"
import { useCampaignData } from "@/components/campaign-wizard"

interface WizardGeneratingProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const generationSteps = [
  "Analyzing property details...",
  "Processing uploaded media...",
  "Generating ad copy variations...",
  "Creating visual mockups...",
  "Finalizing marketing materials...",
]

export function WizardGenerating({ onNext }: WizardGeneratingProps) {
  const { updateData } = useCampaignData()
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < generationSteps.length - 1) {
          return prev + 1
        } else {
          setIsComplete(true)
          clearInterval(interval)
          return prev
        }
      })
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isComplete) {
      // Generate mock copy data
      const mockGeneratedCopy = {
        headline: [
          "Stunning Modern Home in Prime Location",
          "Your Dream Home Awaits in This Beautiful Property",
          "Exceptional Living in the Heart of the City",
        ],
        eyebrow: ["Just Listed", "New to Market", "Exclusive Opportunity"],
        subCopy: [
          "Discover luxury living at its finest",
          "Where comfort meets elegance",
          "Your perfect home is waiting",
        ],
        fullBio: [
          "This exceptional property offers the perfect blend of modern amenities and timeless charm. Located in a highly sought-after neighborhood, this home features spacious rooms, updated finishes, and a beautiful outdoor space perfect for entertaining.",
          "Welcome to your new home! This beautifully maintained property boasts an open floor plan, gourmet kitchen, and luxurious master suite. The private backyard oasis is perfect for relaxation and hosting gatherings with family and friends.",
          "Step into luxury with this meticulously crafted home. Every detail has been thoughtfully designed to create a warm and inviting atmosphere. From the moment you walk through the front door, you'll feel right at home.",
        ],
        amenities: [
          ["Updated Kitchen", "Spacious Bedrooms", "Private Backyard", "Garage Parking"],
          ["Modern Appliances", "Walk-in Closets", "Outdoor Entertainment Area", "Storage Space"],
          ["Premium Finishes", "Natural Light", "Landscaped Yard", "Convenient Location"],
        ],
        cta: ["Schedule Your Private Tour Today", "Book a Showing Now", "Contact Us for More Information"],
      }

      updateData({ generated_copy: mockGeneratedCopy })

      // Auto-advance after showing completion
      const timeout = setTimeout(() => {
        onNext()
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [isComplete, onNext, updateData])

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-96">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 mx-auto">
          {isComplete ? (
            <CheckCircle className="w-16 h-16 text-green-600" />
          ) : (
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">
            {isComplete ? "Generation Complete!" : "Generating Your Marketing Materials"}
          </h2>
          <p className="text-muted-foreground">
            {isComplete
              ? "Your marketing copy has been generated successfully"
              : "Please wait while we create your personalized marketing content"}
          </p>
        </div>

        <div className="space-y-3 max-w-md">
          {generationSteps.map((step, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  index < currentStep ? "bg-green-600" : index === currentStep ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                {index < currentStep && <CheckCircle className="w-3 h-3 text-white" />}
                {index === currentStep && !isComplete && <Loader2 className="w-3 h-3 text-white animate-spin" />}
              </div>
              <span className={`text-sm ${index <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                {step}
              </span>
            </div>
          ))}
        </div>

        {isComplete && <div className="text-sm text-muted-foreground">Proceeding to copy review...</div>}
      </div>
    </div>
  )
}
