"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Home, Camera, Target, Zap } from 'lucide-react'

interface WizardOnboardingProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardOnboarding({ onNext }: WizardOnboardingProps) {
  const features = [
    {
      icon: Home,
      title: "Property Details",
      description: "Tell us about your property's key features and specifications"
    },
    {
      icon: Camera,
      title: "Media Upload",
      description: "Upload photos and videos to showcase your property"
    },
    {
      icon: Target,
      title: "Marketing Preferences",
      description: "Choose your target audience and marketing style"
    },
    {
      icon: Zap,
      title: "AI Generation",
      description: "Our AI creates personalized marketing materials instantly"
    }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Sparkles className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Welcome to Kickbord's Listing Generator</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create professional marketing materials for your property listing in minutes with AI-powered content generation.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Card key={index} className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">What You'll Get</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>📱 Social media posts</div>
              <div>📧 Email marketing templates</div>
              <div>🌐 Landing page content</div>
              <div>📄 Property descriptions</div>
              <div>🎯 Targeted ad copy</div>
              <div>✨ Professional branding</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center mt-8">
        <Button onClick={onNext} size="lg" className="px-8">
          Get Started
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
