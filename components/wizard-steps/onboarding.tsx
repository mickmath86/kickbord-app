"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Home, Camera, Palette, FileText } from 'lucide-react'

interface WizardOnboardingProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardOnboarding({ onNext }: WizardOnboardingProps) {
  const steps = [
    {
      icon: Home,
      title: "Property Details",
      description: "Tell us about your property's key features and location"
    },
    {
      icon: Camera,
      title: "Media Upload",
      description: "Upload photos and videos to showcase your property"
    },
    {
      icon: Palette,
      title: "Marketing Preferences",
      description: "Choose your marketing style and target audience"
    },
    {
      icon: FileText,
      title: "Generate Content",
      description: "We'll create compelling marketing materials for you"
    }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Welcome to Campaign Creator</h2>
        <p className="text-lg text-muted-foreground">
          Let's create a comprehensive marketing campaign for your property listing in just a few steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <Card key={index} className="relative">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
            <div>
              <h3 className="font-semibold text-green-900 mb-2">What You'll Get</h3>
              <ul className="text-green-800 space-y-1">
                <li>• Professional property descriptions</li>
                <li>• Social media ready content</li>
                <li>• Email marketing templates</li>
                <li>• Print-ready flyers and brochures</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center mt-8">
        <Button onClick={onNext} size="lg" className="px-8">
          Get Started
        </Button>
      </div>
    </div>
  )
}
