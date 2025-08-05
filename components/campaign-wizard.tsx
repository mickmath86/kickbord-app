"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X } from "lucide-react"
import { WizardIntroduction } from "@/components/wizard-steps/introduction"
import { WizardPropertyDetails } from "@/components/wizard-steps/property-details"
import { WizardToneAudience } from "@/components/wizard-steps/tone-audience"
import { WizardMediaUpload } from "@/components/wizard-steps/media-upload"
import { WizardReviewSubmit } from "@/components/wizard-steps/review-submit"

interface CampaignWizardProps {
  onClose: () => void
}

export interface CampaignData {
  // Property Details
  property_address: string
  bedrooms: number | null
  bathrooms: number | null
  square_feet: number | null
  price: number | null
  property_type: string
  year_built: number | null
  lot_size: string
  hoa_info: string
  features: string[]
  keywords: string[]
  neighborhood_info: string
  cta_preference: string

  // Tone & Audience
  tone: string

  // Media
  media_urls: string[]
}

const initialData: CampaignData = {
  property_address: "",
  bedrooms: null,
  bathrooms: null,
  square_feet: null,
  price: null,
  property_type: "",
  year_built: null,
  lot_size: "",
  hoa_info: "",
  features: [],
  keywords: [],
  neighborhood_info: "",
  cta_preference: "",
  tone: "",
  media_urls: [],
}

const steps = [
  { id: 1, title: "Introduction", component: WizardIntroduction },
  { id: 2, title: "Property Details", component: WizardPropertyDetails },
  { id: 3, title: "Tone & Audience", component: WizardToneAudience },
  { id: 4, title: "Media Upload", component: WizardMediaUpload },
  { id: 5, title: "Review & Submit", component: WizardReviewSubmit },
]

export function CampaignWizard({ onClose }: CampaignWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [campaignData, setCampaignData] = useState<CampaignData>(initialData)

  const currentStepData = steps.find((step) => step.id === currentStep)
  const CurrentStepComponent = currentStepData?.component

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateCampaignData = (updates: Partial<CampaignData>) => {
    setCampaignData((prev) => ({ ...prev, ...updates }))
  }

  return (
    <div className="flex flex-col h-full max-h-[90vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Create Listing Campaign</h2>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}: {currentStepData?.title}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress */}
      <div className="px-6 py-4 border-b">
        <Progress value={progress} className="w-full" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {CurrentStepComponent && (
          <CurrentStepComponent
            data={campaignData}
            updateData={updateCampaignData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onClose={onClose}
            isFirstStep={currentStep === 1}
            isLastStep={currentStep === steps.length}
          />
        )}
      </div>
    </div>
  )
}
