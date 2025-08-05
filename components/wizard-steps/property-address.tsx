"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Search } from "lucide-react"
import { useCampaignData } from "@/components/campaign-wizard"

export function WizardPropertyAddress() {
  const { data, updateData, nextStep } = useCampaignData()
  const [isSearching, setIsSearching] = useState(false)

  if (!data) {
    return <div>Loading...</div>
  }

  const handleAddressChange = (value: string) => {
    updateData({ property_address: value })
  }

  const handleNext = () => {
    if (data.property_address?.trim()) {
      nextStep()
    }
  }

  const canProceed = data.property_address?.trim()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Property Address</h2>
        <p className="text-muted-foreground mt-2">
          Enter the address of the property you want to create a campaign for
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Property Location
          </CardTitle>
          <CardDescription>
            Start typing the property address and we'll help you find the exact location
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Property Address *</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                placeholder="123 Main Street, City, State, ZIP"
                value={data.property_address || ""}
                onChange={(e) => handleAddressChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Include the full address with city, state, and ZIP code for best results
            </p>
          </div>

          {data.property_address && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">{data.property_address}</p>
                  <p className="text-sm text-muted-foreground">
                    We'll use this address to generate location-specific marketing content
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <div></div>
        <Button onClick={handleNext} disabled={!canProceed} className="bg-blue-600 hover:bg-blue-700">
          Continue
        </Button>
      </div>
    </div>
  )
}
