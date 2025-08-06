"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home, DollarSign, Bed, Bath } from 'lucide-react'
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardPropertyBasicsProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const PROPERTY_TYPES = [
  "Single Family Home",
  "Townhouse",
  "Condominium",
  "Multi-Family",
  "Vacant Land",
  "Commercial",
  "Other"
]

export function WizardPropertyBasics({ onNext, onPrevious }: WizardPropertyBasicsProps) {
  const { data, updateData } = useCampaignData()
  const [formData, setFormData] = useState({
    property_type: data.property_type || "",
    price: data.price || "",
    bedrooms: data.bedrooms || "",
    bathrooms: data.bathrooms || ""
  })

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    updateData({
      property_type: formData.property_type,
      price: formData.price ? Number(formData.price) : null,
      bedrooms: formData.bedrooms ? Number(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null
    })
    onNext()
  }

  const canProceed = formData.property_type && formData.price

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Property Basics</h2>
        <p className="text-muted-foreground">
          Tell us about the key details of your property
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Basic Information
          </CardTitle>
          <CardDescription>
            These details help us create accurate and compelling marketing content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="property_type">Property Type *</Label>
            <Select value={formData.property_type} onValueChange={(value) => handleInputChange("property_type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Listing Price *</Label>
            <div className="relative">
              <Input
                id="price"
                type="number"
                placeholder="500000"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className="pl-8"
              />
              <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <div className="relative">
                <Input
                  id="bedrooms"
                  type="number"
                  placeholder="3"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                  className="pl-8"
                />
                <Bed className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <div className="relative">
                <Input
                  id="bathrooms"
                  type="number"
                  step="0.5"
                  placeholder="2.5"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                  className="pl-8"
                />
                <Bath className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {formData.price && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Property Summary</h4>
              <p className="text-green-800">
                {formData.bedrooms && formData.bathrooms 
                  ? `${formData.bedrooms} bed, ${formData.bathrooms} bath ` 
                  : ""
                }
                {formData.property_type} • ${Number(formData.price).toLocaleString()}
              </p>
            </div>
          )}

          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium mb-2">💡 Why We Need This</h4>
            <p className="text-sm text-muted-foreground">
              Property type and price help us create targeted marketing content and 
              identify the right audience for your listing.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!canProceed}>
          Continue
        </Button>
      </div>
    </div>
  )
}
