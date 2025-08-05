"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface WizardOnboardingProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardOnboarding({ onNext }: WizardOnboardingProps) {
  return (
    <div className="flex h-full">
      {/* Left side - Image */}
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-64 h-64 bg-white rounded-lg shadow-lg flex items-center justify-center mb-6">
            <img
              src="/placeholder.svg?height=200&width=200&text=Real+Estate+Marketing"
              alt="Real Estate Marketing"
              className="w-48 h-48 object-cover rounded"
            />
          </div>
          <p className="text-muted-foreground">Professional marketing materials in minutes</p>
        </div>
      </div>

      {/* Right side - Content */}
      <div className="flex-1 p-8 flex flex-col justify-center">
        <div className="max-w-md">
          <h1 className="text-3xl font-bold mb-6">Let's Create Your Listing Campaign</h1>

          <div className="space-y-4 mb-8">
            <p className="text-lg text-muted-foreground">
              We'll guide you through a simple process to create professional marketing materials for your property
              listing.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-sm">Collect property details and photos</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-sm">Choose your marketing style and preferences</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-sm">Generate and customize your marketing copy</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-sm">Launch your campaign across multiple channels</span>
              </div>
            </div>
          </div>

          <Button onClick={onNext} size="lg" className="bg-blue-600 hover:bg-blue-700">
            Let's Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
