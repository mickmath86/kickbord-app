"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCampaignData } from "@/app/dashboard/campaigns/create/context"

interface WizardPropertyBasicsProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardPropertyBasics({ onNext, onPrevious }: WizardPropertyBasicsProps) {
  const { data, updateData } = useCampaignData()

  const handleInputChange = (field: string, value: string | number) => {
    updateData({ [field]: value })
  }

  const handleNext = () => {
    if (data.property_type && data.bedrooms && data.bathrooms && data.price) {
      onNext()
    }
  }

  const isValid = data.property_type && data.bedrooms && data.bathrooms && data.price

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Property Basics</CardTitle>
          <CardDescription>
            Tell us about the key details of your property
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="property_type">Property Type *</Label>
              <Select
                value={data.property_type || ""}
                onValueChange={(value) => handleInputChange("property_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-family">Single Family Home</SelectItem>
                  <SelectItem value="condo">Condominium</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="duplex">Duplex</SelectItem>
                  <SelectItem value="multi-family">Multi-Family</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Listing Price *</Label>
              <Input
                id="price"
                type="number"
                value={data.price || ""}
                onChange={(e) => handleInputChange("price", parseInt(e.target.value))}
                placeholder="750000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms *</Label>
              <Input
                id="bedrooms"
                type="number"
                value={data.bedrooms || ""}
                onChange={(e) => handleInputChange("bedrooms", parseInt(e.target.value))}
                placeholder="3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms *</Label>
              <Input
                id="bathrooms"
                type="number"
                step="0.5"
                value={data.bathrooms || ""}
                onChange={(e) => handleInputChange("bathrooms", parseFloat(e.target.value))}
                placeholder="2.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="square_feet">Square Feet</Label>
              <Input
                id="square_feet"
                type="number"
                value={data.square_feet || ""}
                onChange={(e) => handleInputChange("square_feet", parseInt(e.target.value))}
                placeholder="2000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lot_size">Lot Size</Label>
              <Input
                id="lot_size"
                value={data.lot_size || ""}
                onChange={(e) => handleInputChange("lot_size", e.target.value)}
                placeholder="0.25 acres"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year_built">Year Built</Label>
              <Input
                id="year_built"
                type="number"
                value={data.year_built || ""}
                onChange={(e) => handleInputChange("year_built", parseInt(e.target.value))}
                placeholder="2010"
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
