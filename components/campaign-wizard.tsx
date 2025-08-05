"use client"

import { useState, createContext, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X } from "lucide-react"
import { WizardOnboarding } from "@/components/wizard-steps/onboarding"
import { WizardPropertyInfo } from "@/components/wizard-steps/property-info"
import { WizardMediaUpload } from "@/components/wizard-steps/media-upload"
import { WizardAdPreferences } from "@/components/wizard-steps/ad-preferences"
import { WizardGenerating } from "@/components/wizard-steps/generating"
import { WizardCopyReview } from "@/components/wizard-steps/copy-review"
import { WizardFinalPreview } from "@/components/wizard-steps/final-preview"

interface CampaignWizardProps {
  onClose: () => void
}

export interface CampaignData {
  // Property Information
  property_type: string
  address: string
  price: number | null
  bedrooms: number | null
  bathrooms: number | null
  square_feet: number | null
  lot_size: string
  year_built: number | null
  key_features: string[]
  keywords: string[]
  additional_notes: string

  // Media
  photos: string[]
  videos: string[]

  // Ad Preferences
  materials_to_generate: string[]
  creative_style: string
  save_style: boolean
  copy_tone: string[]
  save_tone_default: boolean
  listing_style: string[]
  keywords_to_include: string

  // Generated Content
  generated_copy: any
  selected_copy: any
  feedback: any
}

const initialData: CampaignData = {
  property_type: "",
  address: "",
  price: null,
  bedrooms: null,
  bathrooms: null,
  square_feet: null,
  lot_size: "",
  year_built: null,
  key_features: [],
  keywords: [],
  additional_notes: "",
  photos: [],
  videos: [],
  materials_to_generate: [],
  creative_style: "",
  save_style: false,
  copy_tone: [],
  save_tone_default: false,
  listing_style: [],
  keywords_to_include: "",
  generated_copy: null,
  selected_copy: {},
  feedback: {},
}

const steps = [
  { id: 1, title: "Welcome", phase: 1, component: WizardOnboarding },
  { id: 2, title: "Property Info", phase: 1, component: WizardPropertyInfo },
  { id: 3, title: "Media Upload", phase: 1, component: WizardMediaUpload },
  { id: 4, title: "Ad Preferences", phase: 2, component: WizardAdPreferences },
  { id: 5, title: "Generating", phase: 2, component: WizardGenerating },
  { id: 6, title: "Copy Review", phase: 2, component: WizardCopyReview },
  { id: 7, title: "Final Preview", phase: 2, component: WizardFinalPreview },
]

// Context for sharing data between steps
const CampaignContext = createContext<{
  data: CampaignData
  updateData: (updates: Partial<CampaignData>) => void
} | null>(null)

export const useCampaignData = () => {
  const context = useContext(CampaignContext)
  if (!context) {
    throw new Error("useCampaignData must be used within CampaignWizard")
  }
  return context
}

export function CampaignWizard({ onClose }: CampaignWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [campaignData, setCampaignData] = useState<CampaignData>(initialData)

  const currentStepData = steps.find((step) => step.id === currentStep)
  const CurrentStepComponent = currentStepData?.component
  const currentPhase = currentStepData?.phase || 1

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

  const getPhaseSteps = (phase: number) => {
    return steps.filter((step) => step.phase === phase)
  }

  const getCurrentPhaseStep = () => {
    const phaseSteps = getPhaseSteps(currentPhase)
    const currentPhaseStepIndex = phaseSteps.findIndex((step) => step.id === currentStep)
    return currentPhaseStepIndex + 1
  }

  return (
    <CampaignContext.Provider value={{ data: campaignData, updateData: updateCampaignData }}>
      <div className="flex flex-col h-full max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">Create Listing Campaign</h2>
            <div className="text-sm text-muted-foreground">
              Phase {currentPhase} of 2: {currentStepData?.title} ({getCurrentPhaseStep()} of{" "}
              {getPhaseSteps(currentPhase).length})
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Phase {currentPhase}: Property Info</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {CurrentStepComponent && (
            <CurrentStepComponent
              onNext={handleNext}
              onPrevious={handlePrevious}
              onClose={onClose}
              isFirstStep={currentStep === 1}
              isLastStep={currentStep === steps.length}
            />
          )}
        </div>
      </div>
    </CampaignContext.Provider>
  )
}
