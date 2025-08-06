"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Search } from 'lucide-react'
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardPropertyAddressProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardPropertyAddress({ onNext, onPrevious }: WizardPropertyAddressProps) {
  const { data, updateData } = useCampaignData()
  const [address, setAddress] = useState(data.address || "")
  const [isValidating, setIsValidating] = useState(false)

  const handleNext = async () => {
    if (!address.trim()) return

    setIsValidating(true)
    
    // Simulate address validation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    updateData({ address: address.trim() })
    setIsValidating(false)
    onNext()
  }

  const canProceed = address.trim().length > 0

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle>Property Address</CardTitle>
          <CardDescription>
            Enter the complete address of the property you want to market
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address">Property Address</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                placeholder="123 Main Street, City, State, ZIP"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="pl-10"
                disabled={isValidating}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Include street address, city, state, and ZIP code for best results
            </p>
          </div>

          {address && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Address Preview</h4>
                  <p className="text-blue-700">{address}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium mb-2">💡 Pro Tip</h4>
            <p className="text-sm text-muted-foreground">
              A complete and accurate address helps our AI generate more targeted and location-specific marketing content.
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onPrevious}>
              Back
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={!canProceed || isValidating}
            >
              {isValidating ? "Validating..." : "Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
