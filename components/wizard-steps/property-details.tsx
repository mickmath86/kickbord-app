"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { CampaignData } from "@/components/campaign-wizard"
import { useState } from "react"

interface WizardPropertyDetailsProps {
  data: CampaignData
  updateData: (updates: Partial<CampaignData>) => void
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const propertyTypes = ["Single-family", "Condo", "Townhouse", "Multi-family", "Commercial", "Land", "Mobile Home"]

const commonFeatures = [
  "Pool",
  "Garage",
  "Fireplace",
  "Renovated",
  "ADU",
  "Hardwood Floors",
  "Stainless Appliances",
  "Walk-in Closet",
  "Balcony",
  "Patio",
  "Garden",
  "Central AC",
  "In-unit Laundry",
  "Parking",
  "Storage",
  "Gym",
  "Elevator",
]

const commonKeywords = [
  "Luxury",
  "Turnkey",
  "Investor-friendly",
  "Walkable",
  "Coastal",
  "Urban",
  "Family-friendly",
  "Modern",
  "Charming",
  "Spacious",
  "Cozy",
  "Updated",
  "Move-in Ready",
  "Prime Location",
  "Quiet",
  "Trendy",
  "Historic",
]

const ctaOptions = [
  "Book a showing",
  "Contact agent",
  "Download brochure",
  "Schedule tour",
  "Get more info",
  "Make an offer",
]

export function WizardPropertyDetails({ data, updateData, onNext, onPrevious }: WizardPropertyDetailsProps) {
  const [newFeature, setNewFeature] = useState("")
  const [newKeyword, setNewKeyword] = useState("")

  const addFeature = (feature: string) => {
    if (feature && !data.features.includes(feature)) {
      updateData({ features: [...data.features, feature] })
    }
    setNewFeature("")
  }

  const removeFeature = (feature: string) => {
    updateData({ features: data.features.filter((f) => f !== feature) })
  }

  const addKeyword = (keyword: string) => {
    if (keyword && !data.keywords.includes(keyword)) {
      updateData({ keywords: [...data.keywords, keyword] })
    }
    setNewKeyword("")
  }

  const removeKeyword = (keyword: string) => {
    updateData({ keywords: data.keywords.filter((k) => k !== keyword) })
  }

  const isValid = data.property_address && data.price && data.property_type

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Property Details</h2>
        <p className="text-muted-foreground">
          Tell us about your listing so we can create targeted marketing materials
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>

          <div>
            <Label htmlFor="address">Property Address *</Label>
            <Input
              id="address"
              value={data.property_address}
              onChange={(e) => updateData({ property_address: e.target.value })}
              placeholder="123 Main St, Los Angeles, CA 90210"
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
              <Label htmlFor="sqft">Square Feet</Label>
              <Input
                id="sqft"
                type="number"
                value={data.square_feet || ""}
                onChange={(e) => updateData({ square_feet: e.target.value ? Number.parseInt(e.target.value) : null })}
                placeholder="2000"
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
          </div>

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

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <Label htmlFor="lot-size">Lot Size</Label>
              <Input
                id="lot-size"
                value={data.lot_size}
                onChange={(e) => updateData({ lot_size: e.target.value })}
                placeholder="0.25 acres"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="hoa">HOA Information</Label>
            <Input
              id="hoa"
              value={data.hoa_info}
              onChange={(e) => updateData({ hoa_info: e.target.value })}
              placeholder="$200/month"
            />
          </div>
        </div>

        {/* Features & Keywords */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Features & Marketing</h3>

          <div>
            <Label>Property Features</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {data.features.map((feature) => (
                <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeFeature(feature)} />
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {commonFeatures
                .filter((f) => !data.features.includes(f))
                .map((feature) => (
                  <Badge
                    key={feature}
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => addFeature(feature)}
                  >
                    + {feature}
                  </Badge>
                ))}
            </div>
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addFeature(newFeature)}
              placeholder="Add custom feature..."
            />
          </div>

          <div>
            <Label>Descriptive Keywords</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {data.keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                  {keyword}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeKeyword(keyword)} />
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {commonKeywords
                .filter((k) => !data.keywords.includes(k))
                .map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => addKeyword(keyword)}
                  >
                    + {keyword}
                  </Badge>
                ))}
            </div>
            <Input
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addKeyword(newKeyword)}
              placeholder="Add custom keyword..."
            />
          </div>

          <div>
            <Label htmlFor="neighborhood">Neighborhood Info</Label>
            <Textarea
              id="neighborhood"
              value={data.neighborhood_info}
              onChange={(e) => updateData({ neighborhood_info: e.target.value })}
              placeholder="West Adams, trendy area with great restaurants..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="cta">Call-to-Action Preference</Label>
            <Select value={data.cta_preference} onValueChange={(value) => updateData({ cta_preference: value })}>
              <SelectTrigger>
                <SelectValue placeholder="What should leads do?" />
              </SelectTrigger>
              <SelectContent>
                {ctaOptions.map((cta) => (
                  <SelectItem key={cta} value={cta}>
                    {cta}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={onNext} disabled={!isValid} className="bg-blue-600 hover:bg-blue-700">
          Next: Tone & Audience
        </Button>
      </div>
    </div>
  )
}
