"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCampaignData } from "@/app/dashboard/campaigns/create/context"

interface WizardPropertyAddressProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardPropertyAddress({ onNext, onPrevious }: WizardPropertyAddressProps) {
  const { data, updateData } = useCampaignData()

  const handleInputChange = (field: string, value: string) => {
    updateData({ [field]: value })
  }

  const handleNext = () => {
    if (data.address && data.city && data.state && data.zip_code) {
      onNext()
    }
  }

  const isValid = data.address && data.city && data.state && data.zip_code

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Property Address</CardTitle>
          <CardDescription>
            Enter the complete address of the property you're listing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              value={data.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={data.city || ""}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="San Francisco"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={data.state || ""}
                onChange={(e) => handleInputChange("state", e.target.value)}
                placeholder="CA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip_code">ZIP Code *</Label>
              <Input
                id="zip_code"
                value={data.zip_code || ""}
                onChange={(e) => handleInputChange("zip_code", e.target.value)}
                placeholder="94102"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={onPrevious}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back
            </button>
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
