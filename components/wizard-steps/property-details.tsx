"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Settings, Plus, X } from 'lucide-react'
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardPropertyDetailsProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const COMMON_FEATURES = [
  "Updated Kitchen", "Hardwood Floors", "Granite Countertops", "Stainless Steel Appliances",
  "Master Suite", "Walk-in Closet", "Fireplace", "Deck/Patio", "Garage", "Pool",
  "Central Air", "New Windows", "Open Floor Plan", "Basement", "Fenced Yard"
]

export function WizardPropertyDetails({ onNext, onPrevious }: WizardPropertyDetailsProps) {
  const { data, updateData } = useCampaignData()
  const [formData, setFormData] = useState({
    square_feet: data.square_feet?.toString() || "",
    lot_size: data.lot_size || "",
    year_built: data.year_built?.toString() || "",
    key_features: data.key_features || [],
    keywords: data.keywords || [],
    additional_notes: data.additional_notes || "",
  })
  const [newKeyword, setNewKeyword] = useState("")

  const handleFeatureToggle = (feature: string) => {
    const updatedFeatures = formData.key_features.includes(feature)
      ? formData.key_features.filter(f => f !== feature)
      : [...formData.key_features, feature]
    
    setFormData(prev => ({ ...prev, key_features: updatedFeatures }))
  }

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }))
      setNewKeyword("")
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }))
  }

  const handleNext = () => {
    updateData({
      square_feet: formData.square_feet ? parseInt(formData.square_feet.replace(/,/g, '')) : null,
      lot_size: formData.lot_size,
      year_built: formData.year_built ? parseInt(formData.year_built) : null,
      key_features: formData.key_features,
      keywords: formData.keywords,
      additional_notes: formData.additional_notes,
    })
    onNext()
  }

  const formatSquareFeet = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '')
    if (!numericValue) return ''
    return parseInt(numericValue).toLocaleString()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle>Property Details</CardTitle>
          <CardDescription>
            Add specific details and features that make your property special
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Property Specifications */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="square_feet">Square Feet</Label>
              <Input
                id="square_feet"
                placeholder="2,500"
                value={formData.square_feet}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  square_feet: formatSquareFeet(e.target.value) 
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lot_size">Lot Size</Label>
              <Input
                id="lot_size"
                placeholder="0.25 acres"
                value={formData.lot_size}
                onChange={(e) => setFormData(prev => ({ ...prev, lot_size: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year_built">Year Built</Label>
              <Input
                id="year_built"
                placeholder="2020"
                value={formData.year_built}
                onChange={(e) => setFormData(prev => ({ ...prev, year_built: e.target.value }))}
              />
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-3">
            <Label>Key Features (Select all that apply)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {COMMON_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={formData.key_features.includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                  />
                  <Label htmlFor={feature} className="text-sm cursor-pointer">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
            {formData.key_features.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.key_features.map((feature) => (
                  <Badge key={feature} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Keywords */}
          <div className="space-y-3">
            <Label>Marketing Keywords</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add keyword (e.g., luxury, modern, cozy)"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
              />
              <Button type="button" onClick={handleAddKeyword} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword) => (
                  <Badge key={keyword} variant="outline" className="gap-1">
                    {keyword}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleRemoveKeyword(keyword)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="additional_notes">Additional Notes</Label>
            <Textarea
              id="additional_notes"
              placeholder="Any special features, recent updates, or unique selling points..."
              value={formData.additional_notes}
              onChange={(e) => setFormData(prev => ({ ...prev, additional_notes: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onPrevious}>
              Back
            </Button>
            <Button onClick={handleNext}>
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
