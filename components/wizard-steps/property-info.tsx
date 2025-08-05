"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { useCampaignData } from "@/components/campaign-wizard"
import { useState } from "react"

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

export function WizardPropertyInfo({ onNext, onPrevious }: WizardPropertyInfoProps) {
  const { data, updateData } = useCampaignData()
  const [newKeyword, setNewKeyword] = useState("")
  const [newFeature, setNewFeature] = useState("")

  const addKeyword = (keyword: string) => {
    if (keyword && !data.keywords.includes(keyword)) {
      updateData({ keywords: [...data.keywords, keyword] })
    }
    setNewKeyword("")
  }

  const removeKeyword = (keyword: string) => {
    updateData({ keywords: data.keywords.filter((k) => k !== keyword) })
  }

  const addCustomFeature = (feature: string) => {
    if (feature && !data.key_features.includes(feature)) {
      updateData({ key_features: [...data.key_features, feature] })
    }
    setNewFeature("")
  }

  const toggleFeature = (feature: string) => {
    const features = data.key_features.includes(feature)
      ? data.key_features.filter((f) => f !== feature)
      : [...data.key_features, feature]
    updateData({ key_features: features })
  }

  const removeFeature = (feature: string) => {
    updateData({ key_features: data.key_features.filter((f) => f !== feature) })
  }

  const isValid = data.property_type && data.address && data.price

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Property Information</h2>
        <p className="text-muted-foreground">Tell us about your property to create targeted marketing materials</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>

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
              value={data.address}
              onChange={(e) => updateData({ address: e.target.value })}
              placeholder="123 Main St, Los Angeles, CA 90210"
            />
          </div>

          <div>
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              type="number"
              value={data.price || ""}
              onChange={(e) => updateData({ price: e.target.value ? Number.parseFloat(e.target.value) : null })}
              placeholder="750000"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                value={data.bedrooms || ""}
                onChange={(e) => updateData({ bedrooms: e.target.value ? Number.parseInt(e.target.value) : null })}
                placeholder="3"
              />
            </div>
            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                step="0.5"
                value={data.bathrooms || ""}
                onChange={(e) => updateData({ bathrooms: e.target.value ? Number.parseFloat(e.target.value) : null })}
                placeholder="2.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sqft">Square Footage</Label>
              <Input
                id="sqft"
                type="number"
                value={data.square_feet || ""}
                onChange={(e) => updateData({ square_feet: e.target.value ? Number.parseInt(e.target.value) : null })}
                placeholder="2000"
              />
            </div>
            <div>
              <Label htmlFor="year-built">Year Built</Label>
              <Input
                id="year-built"
                type="number"
                value={data.year_built || ""}
                onChange={(e) => updateData({ year_built: e.target.value ? Number.parseInt(e.target.value) : null })}
                placeholder="1995"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="lot-size">Lot Size (optional)</Label>
            <Input
              id="lot-size"
              value={data.lot_size}
              onChange={(e) => updateData({ lot_size: e.target.value })}
              placeholder="0.25 acres"
            />
          </div>
        </div>

        {/* Features & Marketing */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Key Features</h3>

          <div>
            <Label>Select all that apply:</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {keyFeatures.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={data.key_features.includes(feature)}
                    onCheckedChange={() => toggleFeature(feature)}
                  />
                  <Label htmlFor={feature} className="text-sm">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Features */}
          <div>
            <Label>Custom Features</Label>
            <p className="text-sm text-muted-foreground mb-2">Add any additional features not listed above</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {data.key_features
                .filter((feature) => !keyFeatures.includes(feature))
                .map((feature) => (
                  <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                    {feature}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeFeature(feature)} />
                  </Badge>
                ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCustomFeature(newFeature)}
                placeholder="Add custom feature"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addCustomFeature(newFeature)}
                disabled={!newFeature}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label>Keywords</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Add descriptive phrases like "walk to beach", "corner lot", etc.
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {data.keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                  {keyword}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeKeyword(keyword)} />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addKeyword(newKeyword)}
                placeholder="Add keyword"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addKeyword(newKeyword)}
                disabled={!newKeyword}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={data.additional_notes}
              onChange={(e) => updateData({ additional_notes: e.target.value })}
              placeholder="Any additional details about the property..."
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={onNext} disabled={!isValid} className="bg-blue-600 hover:bg-blue-700">
          Next: Media Upload
        </Button>
      </div>
    </div>
  )
}
