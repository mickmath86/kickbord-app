"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, FileText, ImageIcon, Globe, Download } from "lucide-react"
import type { CampaignData } from "@/components/campaign-wizard"

interface WizardIntroductionProps {
  data: CampaignData
  updateData: (updates: Partial<CampaignData>) => void
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardIntroduction({ onNext }: WizardIntroductionProps) {
  return (
    <div className="p-6">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">Welcome to Kickbord's Listing Generator</h1>
            <p className="text-lg text-muted-foreground">
              We'll walk you through a few quick steps to collect details about your listing and then create a complete
              marketing kit.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">What's included in your marketing kit:</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Social Ad Copy</p>
                  <p className="text-sm text-muted-foreground">
                    Platform-specific copy for Facebook, Instagram, and TikTok
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Landing Page</p>
                  <p className="text-sm text-muted-foreground">Professional property landing page with lead capture</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <ImageIcon className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium">Visual Mockups</p>
                  <p className="text-sm text-muted-foreground">Social media graphics in multiple formats</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Download className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium">PDF Flyer</p>
                  <p className="text-sm text-muted-foreground">Print-ready property brochure</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={onNext} size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </div>
        </div>

        {/* Right side - Visual */}
        <div className="hidden md:block">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-600 rounded-lg mx-auto flex items-center justify-center">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Professional Marketing Materials</h3>
              <p className="text-muted-foreground">
                Generate everything you need to market your listing effectively across all platforms
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
