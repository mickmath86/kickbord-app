"use client"

import { Button } from "@/components/ui/button"

interface WizardOnboardingProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardOnboarding({ onNext }: WizardOnboardingProps) {
  return (
    <div className="flex h-full min-h-[600px]">
      {/* Left side - Image */}
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-64 h-64 mx-auto mb-6 bg-white rounded-lg shadow-lg flex items-center justify-center">
            <img
              src="/placeholder.svg?height=200&width=200&text=Real+Estate+Marketing"
              alt="Real Estate Marketing"
              className="w-48 h-48 object-cover rounded"
            />
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Professional marketing materials designed to showcase your property's best features
          </p>
        </div>
      </div>

      {/* Right side - Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Let's Create Your Listing Campaign</h1>
            <p className="text-lg text-muted-foreground">
              We'll guide you through creating professional marketing materials for your property listing. In just a few
              steps, you'll have custom ads, brochures, and landing pages ready to attract potential buyers.
            </p>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-xs">1</span>
              </div>
              <span>Tell us about your property</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-xs">2</span>
              </div>
              <span>Upload photos and videos</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-xs">3</span>
              </div>
              <span>Choose your marketing preferences</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-xs">4</span>
              </div>
              <span>Review and customize your materials</span>
            </div>
          </div>

          <Button onClick={onNext} size="lg" className="w-full">
            Let's Get Started
          </Button>
        </div>
      </div>
    </div>
  )
}
