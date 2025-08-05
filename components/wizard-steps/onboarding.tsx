"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface WizardOnboardingProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardOnboarding({ onNext }: WizardOnboardingProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 min-h-[500px]">
            {/* Left Side - Image */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-8">
              <img
                src="/placeholder.svg?height=400&width=500&text=Real+Estate+Marketing"
                alt="Real Estate Marketing"
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>

            {/* Right Side - Content */}
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Let's Create Your Listing Campaign</h1>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    We'll guide you through creating professional marketing materials for your property listing. In just
                    a few steps, you'll have custom ads, brochures, and landing pages ready to attract potential buyers.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-semibold">1</span>
                    </div>
                    <p className="text-gray-600">Enter your property details and upload photos</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-semibold">2</span>
                    </div>
                    <p className="text-gray-600">Choose your marketing style and tone preferences</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-semibold">3</span>
                    </div>
                    <p className="text-gray-600">Review and customize your generated marketing copy</p>
                  </div>
                </div>

                <div className="pt-6">
                  <Button onClick={onNext} size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
                    Let's Get Started
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
