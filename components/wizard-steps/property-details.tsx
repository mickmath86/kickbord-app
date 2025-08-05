"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Star, Tag } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardPropertyDetailsProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

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

export function WizardPropertyDetails({ onNext, onPrevious, isFirstStep }: WizardPropertyDetailsProps) {
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Features & Details</h2>
        <p className="text-lg text-muted-foreground">Highlight what makes this property special</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Key Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Select all that apply</Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
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
            </div>

            {/* Custom Features */}
            <div>
              <Label>Add Custom Features</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="e.g., Wine cellar, Home theater"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomFeature()}
                />
                <Button type="button" onClick={addCustomFeature} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {data.key_features
                  .filter((feature) => !keyFeatures.includes(feature))
                  .map((feature) => (
                    <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                      {feature}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          removeCustomFeature(feature)
                        }}
                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Keywords & Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Marketing Keywords & Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Marketing Keywords</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Add phrases like "walk to beach", "corner lot", "quiet street"
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Add keyword or phrase"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addKeyword()}
                />
                <Button type="button" onClick={addKeyword} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {data.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                    {keyword}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        removeKeyword(keyword)
                      }}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="additional-notes">Additional Notes</Label>
              <Textarea
                id="additional-notes"
                placeholder="Any additional information about the property that would help with marketing..."
                value={data.additional_notes}
                onChange={(e) => updateData({ additional_notes: e.target.value })}
                rows={6}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Include details about the neighborhood, recent upgrades, or unique selling points
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={onPrevious} disabled={isFirstStep} size="lg">
          Previous
        </Button>
        <Button onClick={onNext} size="lg">
          Next: Media Upload
        </Button>
      </div>
    </div>
  )
}
