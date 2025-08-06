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
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Property Address</h2>
        <p className="text-muted-foreground">
          Enter the complete address of the property you want to market
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Property Location
          </CardTitle>
          <CardDescription>
            We'll use this address to gather market data and create location-specific content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address">Full Address</Label>
            <div className="relative">
              <Input
                id="address"
                placeholder="123 Main Street, City, State 12345"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Include street number, street name, city, state, and ZIP code
            </p>
          </div>

          {address && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Address Preview</h4>
              <p className="text-blue-800">{address}</p>
            </div>
          )}

          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium mb-2">💡 Pro Tip</h4>
            <p className="text-sm text-muted-foreground">
              Make sure the address is accurate - we'll use it to pull neighborhood data, 
              comparable sales, and create location-specific marketing content.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-8">
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
    </div>
  )
}
