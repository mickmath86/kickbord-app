"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { MapPin, Search } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardPropertyAddressProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardPropertyAddress({ onNext, onPrevious, isFirstStep }: WizardPropertyAddressProps) {
  const { data, updateData } = useCampaignData()
  const [address, setAddress] = useState(data?.address || "")
  const [city, setCity] = useState(data?.city || "")
  const [state, setState] = useState(data?.state || "")
  const [zipCode, setZipCode] = useState(data?.zip_code || "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!address.trim()) {
      newErrors.address = "Property address is required"
    }
    if (!city.trim()) {
      newErrors.city = "City is required"
    }
    if (!state.trim()) {
      newErrors.state = "State is required"
    }
    if (!zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required"
    } else if (!/^\d{5}(-\d{4})?$/.test(zipCode)) {
      newErrors.zipCode = "Please enter a valid ZIP code"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      updateData({
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        zip_code: zipCode.trim(),
      })
      onNext()
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Property Address
          </CardTitle>
          <CardDescription>Enter the complete address of the property you want to market</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <div className="relative">
                <Input
                  id="address"
                  placeholder="123 Main Street"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={errors.address ? "border-red-500" : ""}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="San Francisco"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  placeholder="CA"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={errors.state ? "border-red-500" : ""}
                />
                {errors.state && <p className="text-sm text-red-600">{errors.state}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                placeholder="94102"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className={errors.zipCode ? "border-red-500" : ""}
              />
              {errors.zipCode && <p className="text-sm text-red-600">{errors.zipCode}</p>}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tip</h4>
            <p className="text-sm text-blue-700">
              Make sure the address is accurate as it will be used across all your marketing materials. We'll use this
              information to generate location-specific content and target the right audience.
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onPrevious} disabled={isFirstStep}>
              Previous
            </Button>
            <Button onClick={handleNext}>Next: Property Details</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
