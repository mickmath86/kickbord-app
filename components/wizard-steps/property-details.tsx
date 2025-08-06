"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Star } from 'lucide-react'
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardPropertyDetailsProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const COMMON_FEATURES = [
  "Updated Kitchen",
  "Hardwood Floors",
  "Granite Countertops",
  "Stainless Steel Appliances",
  "Walk-in Closet",
  "Master Suite",
  "Fireplace",
  "Garage",
  "Deck/Patio",
  "Swimming Pool",
  "Fenced Yard",
  "New HVAC",
  "Recently Renovated",
  "Move-in Ready"
]

export function WizardPropertyDetails({ onNext, onPrevious }: WizardPropertyDetailsProps) {
  const { data, updateData } = useCampaignData()
  const [formData, setFormData] = useState({
    square_feet: data.square_feet || "",
    lot_size: data.lot_size || "",
    year_built: data.year_built || "",
    key_features: data.key_features || [],
    additional_notes: data.additional_notes || ""
  })
  const [newFeature, setNewFeature] = useState("")

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addFeature = (feature: string) => {
    if (feature && !formData.key_features.includes(feature)) {
      handleInputChange("key_features", [...formData.key_features, feature])
    }
  }

  const removeFeature = (feature: string) => {
    handleInputChange("key_features", formData.key_features.filter(f => f !== feature))
  }

  const addCustomFeature = () => {
    if (newFeature.trim()) {
      addFeature(newFeature.trim())
      setNewFeature("")
    }
  }

  const handleNext = () => {
    updateData({
      square_feet: formData.square_feet ? Number(formData.square_feet) : null,
      lot_size: formData.lot_size,
      year_built: formData.year_built ? Number(formData.year_built) : null,
      key_features: formData.key_features,
      additional_notes: formData.additional_notes
    })
    onNext()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Property Details</h2>
        <p className="text-muted-foreground">
          Add more details to make your listing stand out
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Specifications</CardTitle>
            <CardDescription>
              Optional details that help buyers understand your property better
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="square_feet">Square Feet</Label>
                <Input
                  id="square_feet"
                  type="number"
                  placeholder="2000"
                  value={formData.square_feet}
                  onChange={(e) => handleInputChange("square_feet", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year_built">Year Built</Label>
                <Input
                  id="year_built"
                  type="number"
                  placeholder="2010"
                  value={formData.year_built}
                  onChange={(e) => handleInputChange("year_built", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lot_size">Lot Size</Label>
              <Input
                id="lot_size"
                placeholder="0.25 acres or 10,890 sq ft"
                value={formData.lot_size}
                onChange={(e) => handleInputChange("lot_size", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Key Features
            </CardTitle>
            <CardDescription>
              Select features that make your property special
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {COMMON_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={formData.key_features.includes(feature)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        addFeature(feature)
                      } else {
                        removeFeature(feature)
                      }
                    }}
                  />
                  <Label htmlFor={feature} className="text-sm">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Add Custom Feature</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter custom feature"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomFeature()}
                />
                <Button type="button" variant="outline" onClick={addCustomFeature}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {formData.key_features.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Features</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.key_features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
            <CardDescription>
              Any other important details about the property
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Recent updates, neighborhood highlights, special features, etc."
              value={formData.additional_notes}
              onChange={(e) => handleInputChange("additional_notes", e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button onClick={handleNext}>
          Continue
        </Button>
      </div>
    </div>
  )
}
