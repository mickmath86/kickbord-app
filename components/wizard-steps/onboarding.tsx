"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCampaignData } from "@/app/dashboard/campaigns/create/context"

interface WizardOnboardingProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardOnboarding({ onNext }: WizardOnboardingProps) {
  const { data, updateData } = useCampaignData()

  const handleInputChange = (field: string, value: string) => {
    updateData({ [field]: value })
  }

  const handleNext = () => {
    if (data.agent_name && data.agent_email && data.brokerage) {
      onNext()
    }
  }

  const isValid = data.agent_name && data.agent_email && data.brokerage

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Welcome! Let's get started</CardTitle>
          <CardDescription>
            First, tell us a bit about yourself and your brokerage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agent_name">Your Name *</Label>
              <Input
                id="agent_name"
                value={data.agent_name || ""}
                onChange={(e) => handleInputChange("agent_name", e.target.value)}
                placeholder="John Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="agent_email">Email Address *</Label>
              <Input
                id="agent_email"
                type="email"
                value={data.agent_email || ""}
                onChange={(e) => handleInputChange("agent_email", e.target.value)}
                placeholder="john@realty.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agent_phone">Phone Number</Label>
              <Input
                id="agent_phone"
                value={data.agent_phone || ""}
                onChange={(e) => handleInputChange("agent_phone", e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brokerage">Brokerage *</Label>
              <Input
                id="brokerage"
                value={data.brokerage || ""}
                onChange={(e) => handleInputChange("brokerage", e.target.value)}
                placeholder="ABC Realty"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              disabled={!isValid}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
