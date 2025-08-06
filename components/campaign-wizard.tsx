"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X } from 'lucide-react'
import { WizardOnboarding } from "@/components/wizard-steps/onboarding"
import { WizardPropertyAddress } from "@/components/wizard-steps/property-address"
import { WizardPropertyBasics } from "@/components/wizard-steps/property-basics"
import { WizardPropertyDetails } from "@/components/wizard-steps/property-details"
import { WizardMediaUpload } from "@/components/wizard-steps/media-upload"
import { WizardAdPreferences } from "@/components/wizard-steps/ad-preferences"
import { WizardGenerating } from "@/components/wizard-steps/generating"
import { WizardCopyReview } from "@/components/wizard-steps/copy-review"
import { WizardFinalPreview } from "@/components/wizard-steps/final-preview"

interface CampaignWizardProps {
  onClose?: () => void
}

const steps = [
  { id: 1, title: "Welcome", phase: 1, component: WizardOnboarding },
  { id: 2, title: "Property Address", phase: 1, component: WizardPropertyAddress },
  { id: 3, title: "Property Basics", phase: 1, component: WizardPropertyBasics },
  { id: 4, title: "Property Details", phase: 1, component: WizardPropertyDetails },
  { id: 5, title: "Media Upload", phase: 1, component: WizardMediaUpload },
  { id: 6, title: "Ad Preferences", phase: 2, component: WizardAdPreferences },
  { id: 7, title: "Generating", phase: 2, component: WizardGenerating },
  { id: 8, title: "Copy Review", phase: 2, component: WizardCopyReview },
  { id: 9, title: "Final Preview", phase: 2, component: WizardFinalPreview },
]

export function CampaignWizard({ onClose }: CampaignWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)

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

  const getPhaseSteps = (phase: number) => {
    return steps.filter((step) => step.phase === phase)
  }

  const getCurrentPhaseStep = () => {
    const phaseSteps = getPhaseSteps(currentPhase)
    const currentPhaseStepIndex = phaseSteps.findIndex((step) => step.id === currentStep)
    return currentPhaseStepIndex + 1
  }

  const getPhaseTitle = () => {
    return currentPhase === 1 ? "Property Setup" : "Marketing Generation"
  }

  return (
    <div className="flex flex-col h-full max-h-[90vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Create Listing Campaign</h2>
          <div className="text-sm text-muted-foreground">
            Phase {currentPhase} of 2: {getPhaseTitle()} ({getCurrentPhaseStep()} of{" "}
            {getPhaseSteps(currentPhase).length})
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Progress */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Phase {currentPhase}: {getPhaseTitle()}</span>
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
            onClose={onClose || (() => {})}
            isFirstStep={currentStep === 1}
            isLastStep={currentStep === steps.length}
          />
        )}
      </div>
    </div>
  )
}
