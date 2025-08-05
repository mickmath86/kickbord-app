"use client"

import { useState, createContext, useContext } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft } from "lucide-react"
import { WizardOnboarding } from "@/components/wizard-steps/onboarding"
import { WizardPropertyInfo } from "@/components/wizard-steps/property-info"
import { WizardMediaUpload } from "@/components/wizard-steps/media-upload"
import { WizardAdPreferences } from "@/components/wizard-steps/ad-preferences"
import { WizardGenerating } from "@/components/wizard-steps/generating"
import { WizardCopyReview } from "@/components/wizard-steps/copy-review"
import { WizardFinalPreview } from "@/components/wizard-steps/final-preview"

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
  additional_tone_preferences: string

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
  additional_tone_preferences: "",
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

export default function CreateCampaignPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [campaignData, setCampaignData] = useState<CampaignData>(() => {
    // Load saved preferences from localStorage
    if (typeof window !== "undefined") {
      const savedPreferences = localStorage.getItem("campaign_preferences")
      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences)
        return {
          ...initialData,
          creative_style: preferences.save_style ? preferences.creative_style : "",
          copy_tone: preferences.save_tone_default ? preferences.copy_tone : [],
        }
      }
    }
    return initialData
  })

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

  const handleClose = () => {
    router.push("/dashboard/campaigns")
  }

  const updateCampaignData = (updates: Partial<CampaignData>) => {
    setCampaignData((prev) => {
      const newData = { ...prev, ...updates }

      // Save preferences to localStorage when save options are checked
      if (typeof window !== "undefined") {
        if (updates.save_style !== undefined || updates.save_tone_default !== undefined) {
          const preferences = {
            save_style: newData.save_style,
            creative_style: newData.creative_style,
            save_tone_default: newData.save_tone_default,
            copy_tone: newData.copy_tone,
          }
          localStorage.setItem("campaign_preferences", JSON.stringify(preferences))
        }
      }

      return newData
    })
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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={handleClose}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Campaigns
                </Button>
                <div className="h-6 w-px bg-gray-300" />
                <h1 className="text-xl font-semibold">Create Listing Campaign</h1>
                <div className="text-sm text-muted-foreground">
                  Phase {currentPhase} of 2: {currentStepData?.title} ({getCurrentPhaseStep()} of{" "}
                  {getPhaseSteps(currentPhase).length})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Phase {currentPhase}: {currentPhase === 1 ? "Property Information" : "Marketing Preferences"}
              </span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {CurrentStepComponent && (
            <CurrentStepComponent
              onNext={handleNext}
              onPrevious={handlePrevious}
              onClose={handleClose}
              isFirstStep={currentStep === 1}
              isLastStep={currentStep === steps.length}
            />
          )}
        </div>
      </div>
    </CampaignContext.Provider>
  )
}
