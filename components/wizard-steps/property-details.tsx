"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Home } from 'lucide-react'
import { useCampaignData } from "@/app/dashboard/campaigns/create/context"

interface WizardPropertyDetailsProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const COMMON_FEATURES = [
  "Pool", "Garage", "Fireplace", "Hardwood Floors", "Updated Kitchen",
  "Master Suite", "Walk-in Closet", "Patio/Deck", "Garden", "Storage",
  "Laundry Room", "Home Office", "Basement", "Attic", "Security System"
]

export function WizardPropertyDetails({ onNext, onPrevious }: WizardPropertyDetailsProps) {
  const { data, updateData } = useCampaignData()
  const [newFeature, setNewFeature] = useState("")
  const [newKeyword, setNewKeyword] = useState("")

  const handleFeatureToggle = (feature: string, checked: boolean) => {
    const updatedFeatures = checked 
      ? [...data.key_features, feature]
      : data.key_features.filter(f => f !== feature)
    updateData({ key_features: updatedFeatures })
  }

  const addCustomFeature = () => {
    if (newFeature.trim() && !data.key_features.includes(newFeature.trim())) {
      updateData({ key_features: [...data.key_features, newFeature.trim()] })
      setNewFeature("")
    }
  }

  const removeFeature = (feature: string) => {
    updateData({ key_features: data.key_features.filter(f => f !== feature) })
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !data.keywords.includes(newKeyword.trim())) {
      updateData({ keywords: [...data.keywords, newKeyword.trim()] })
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    updateData({ keywords: data.keywords.filter(k => k !== keyword) })
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Property Details</h2>
        <p className="text-muted-foreground">
          Add features and details that make your property special
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Key Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Key Features
            </CardTitle>
            <CardDescription>
              Select features that highlight your property's best qualities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {COMMON_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={data.key_features.includes(feature)}
                    onCheckedChange={(checked) => handleFeatureToggle(feature, checked as boolean)}
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
                  placeholder="e.g., Wine Cellar, Solar Panels"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomFeature()}
                />
                <Button type="button" onClick={addCustomFeature} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Custom Features */}
            {data.key_features.filter(f => !COMMON_FEATURES.includes(f)).length > 0 && (
              <div className="space-y-2">
                <Label>Custom Features</Label>
                <div className="flex flex-wrap gap-2">
                  {data.key_features
                    .filter(f => !COMMON_FEATURES.includes(f))
                    .map((feature) => (
                      <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <button
                          onClick={() => removeFeature(feature)}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
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

        {/* Keywords and Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Marketing Keywords & Notes</CardTitle>
            <CardDescription>
              Add keywords and additional details for marketing content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Marketing Keywords</Label>
              <p className="text-sm text-muted-foreground">
                Add phrases like "move-in ready", "quiet neighborhood", etc.
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Move-in Ready, Quiet Street"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addKeyword()}
                />
                <Button type="button" onClick={addKeyword} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {data.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {data.keywords.map((keyword) => (
                    <Badge key={keyword} variant="outline" className="flex items-center gap-1">
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional_notes">Additional Notes</Label>
              <Textarea
                id="additional_notes"
                placeholder="Any additional information about the property, recent updates, neighborhood highlights, etc."
                value={data.additional_notes}
                onChange={(e) => updateData({ additional_notes: e.target.value })}
                rows={6}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  )
}
