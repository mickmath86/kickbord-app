"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { useCampaignData } from "@/components/campaign-wizard"

interface WizardPropertyInfoProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const propertyTypes = ["Single-Family", "Condo", "Duplex", "Triplex", "4-Unit", "Apartment", "Commercial"]

const keyFeatures = [
  "Pool",
  "Garage",
  "ADU",
  "Fireplace",
  "Renovated Kitchen",
  "EV Charger",
  "Walk-in Closet",
  "Outdoor Space",
  "In-Unit Laundry",
  "Gated Access",
  "Smart Home Features",
]

export function WizardPropertyInfo({ onNext, onPrevious, isFirstStep }: WizardPropertyInfoProps) {
  const { data, updateData } = useCampaignData()
  const [newKeyword, setNewKeyword] = useState("")
  const [newFeature, setNewFeature] = useState("")

  const handleFeatureChange = (feature: string, checked: boolean) => {
    const updatedFeatures = checked ? [...data.key_features, feature] : data.key_features.filter((f) => f !== feature)
    updateData({ key_features: updatedFeatures })
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !data.keywords.includes(newKeyword.trim())) {
      updateData({ keywords: [...data.keywords, newKeyword.trim()] })
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    updateData({ keywords: data.keywords.filter((k) => k !== keyword) })
  }

  const addCustomFeature = () => {
    if (newFeature.trim() && !data.key_features.includes(newFeature.trim())) {
      updateData({ key_features: [...data.key_features, newFeature.trim()] })
      setNewFeature("")
    }
  }

  const removeCustomFeature = (feature: string) => {
    updateData({ key_features: data.key_features.filter((f) => f !== feature) })
  }

  const isFormValid = () => {
    return data.property_type && data.address && data.price && data.bedrooms && data.bathrooms && data.square_feet
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Property Information</h2>
        <p className="text-muted-foreground">Tell us about the property to create targeted marketing materials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="property-type">Property Type *</Label>
              <Select value={data.property_type} onValueChange={(value) => updateData({ property_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="address">Full Address *</Label>
              <Input
                id="address"
                placeholder="123 Main St, City, State, ZIP"
                value={data.address}
                onChange={(e) => updateData({ address: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                placeholder="500000"
                value={data.price || ""}
                onChange={(e) => updateData({ price: Number.parseInt(e.target.value) || null })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  placeholder="3"
                  value={data.bedrooms || ""}
                  onChange={(e) => updateData({ bedrooms: Number.parseInt(e.target.value) || null })}
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms *</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  step="0.5"
                  placeholder="2.5"
                  value={data.bathrooms || ""}
                  onChange={(e) => updateData({ bathrooms: Number.parseFloat(e.target.value) || null })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="square-feet">Square Footage *</Label>
              <Input
                id="square-feet"
                type="number"
                placeholder="2000"
                value={data.square_feet || ""}
                onChange={(e) => updateData({ square_feet: Number.parseInt(e.target.value) || null })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="lot-size">Lot Size</Label>
              <Input
                id="lot-size"
                placeholder="0.25 acres"
                value={data.lot_size}
                onChange={(e) => updateData({ lot_size: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="year-built">Year Built</Label>
              <Input
                id="year-built"
                type="number"
                placeholder="2020"
                value={data.year_built || ""}
                onChange={(e) => updateData({ year_built: Number.parseInt(e.target.value) || null })}
              />
            </div>

            <div>
              <Label>Key Features</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {keyFeatures.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={data.key_features.includes(feature)}
                      onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
                    />
                    <Label htmlFor={feature} className="text-sm">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Custom Features */}
              <div className="mt-4">
                <Label>Custom Features</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add custom feature"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addCustomFeature()}
                  />
                  <Button type="button" onClick={addCustomFeature} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.key_features
                    .filter((feature) => !keyFeatures.includes(feature))
                    .map((feature) => (
                      <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeCustomFeature(feature)} />
                      </Badge>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keywords and Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Keywords</Label>
            <p className="text-sm text-muted-foreground mb-2">Add phrases like "walk to beach", "corner lot", etc.</p>
            <div className="flex gap-2">
              <Input
                placeholder="Add keyword"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addKeyword()}
              />
              <Button type="button" onClick={addKeyword} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                  {keyword}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeKeyword(keyword)} />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="additional-notes">Additional Notes</Label>
            <Textarea
              id="additional-notes"
              placeholder="Any additional information about the property..."
              value={data.additional_notes}
              onChange={(e) => updateData({ additional_notes: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious} disabled={isFirstStep}>
          Previous
        </Button>
        <Button onClick={onNext} disabled={!isFormValid()}>
          Next: Media Upload
        </Button>
      </div>
    </div>
  )
}
