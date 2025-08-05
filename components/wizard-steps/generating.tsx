"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, Sparkles, FileText, ImageIcon, Mail } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardGeneratingProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const GENERATION_STEPS = [
  { id: "analyzing", label: "Analyzing property details", icon: Sparkles },
  { id: "copy", label: "Generating marketing copy", icon: FileText },
  { id: "visuals", label: "Creating visual concepts", icon: ImageIcon },
  { id: "email", label: "Crafting email campaigns", icon: Mail },
  { id: "finalizing", label: "Finalizing materials", icon: Sparkles },
]

export function WizardGenerating({ onNext }: WizardGeneratingProps) {
  const { data, updateData } = useCampaignData()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          // Simulate generated content
          updateData({
            generated_copy: {
              social_posts: [
                "🏡 JUST LISTED! Stunning 3BR/2BA home in prime location. Modern updates throughout, gorgeous kitchen, and private backyard. Don't miss this gem! #JustListed #DreamHome",
                "✨ NEW TO MARKET ✨ This beautiful home offers the perfect blend of comfort and style. Updated kitchen, spacious bedrooms, and move-in ready condition. Schedule your showing today!",
              ],
              property_description:
                "Welcome to this exceptional 3-bedroom, 2-bathroom home that perfectly combines modern comfort with timeless appeal. The heart of the home features an updated kitchen with granite countertops and stainless steel appliances, flowing seamlessly into the open living area with beautiful hardwood floors throughout...",
              email_campaign:
                "Subject: New Listing Alert - Your Dream Home Awaits!\n\nDear [Name],\n\nI'm excited to share this incredible new listing that just hit the market. This stunning property offers everything you've been looking for and more...",
            },
          })
          setTimeout(() => onNext(), 1000)
          return 100
        }
        return prev + 2
      })
    }, 100)

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < GENERATION_STEPS.length - 1) {
          return prev + 1
        }
        clearInterval(stepTimer)
        return prev
      })
    }, 2000)

    return () => {
      clearInterval(timer)
      clearInterval(stepTimer)
    }
  }, [onNext, updateData])

  // Add null check for data
  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Generating Your Marketing Materials</span>
          </CardTitle>
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
            {GENERATION_STEPS.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep

              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 border border-blue-200"
                      : isCompleted
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div
                    className={`p-2 rounded-full ${
                      isActive ? "bg-blue-100" : isCompleted ? "bg-green-100" : "bg-gray-100"
                    }`}
                  >
                    {isActive ? (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    ) : (
                      <Icon className={`h-4 w-4 ${isCompleted ? "text-green-600" : "text-gray-400"}`} />
                    )}
                  </div>
                  <span
                    className={`font-medium ${
                      isActive ? "text-blue-900" : isCompleted ? "text-green-900" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">What we're creating for you:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              {data.materials_to_generate.map((material) => (
                <li key={material}>• {material.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
