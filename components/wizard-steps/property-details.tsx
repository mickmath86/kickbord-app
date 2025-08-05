"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Star, Plus, X, Tag } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardPropertyDetailsProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardPropertyDetails({ onNext, onPrevious }: WizardPropertyDetailsProps) {
  const { data, updateData } = useCampaignData()
  const [newFeature, setNewFeature] = useState("")
  const [newKeyword, setNewKeyword] = useState("")

  const commonFeatures = [
    "Hardwood Floors",
    "Granite Countertops",
    "Stainless Steel Appliances",
    "Walk-in Closet",
    "Fireplace",
    "Updated Kitchen",
    "Master Suite",
    "Garage",
    "Deck/Patio",
    "Pool",
    "Central Air",
    "Basement",
    "Laundry Room",
    "Garden",
    "Security System",
  ]

  const addFeature = (feature: string) => {
    if (feature && !data.key_features.includes(feature)) {
      updateData({ key_features: [...data.key_features, feature] })
    }
    setNewFeature("")
  }

  const removeFeature = (feature: string) => {
    updateData({ key_features: data.key_features.filter((f) => f !== feature) })
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

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Property Features & Details</span>
          </CardTitle>
          <CardDescription>Highlight what makes this property special</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Features */}
          <div className="space-y-3">
            <Label>Key Features</Label>
            <p className="text-sm text-muted-foreground">Select or add features that make this property stand out</p>

            {/* Common Features */}
            <div className="flex flex-wrap gap-2">
              {commonFeatures.map((feature) => (
                <Button
                  key={feature}
                  variant={data.key_features.includes(feature) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (data.key_features.includes(feature)) {
                      removeFeature(feature)
                    } else {
                      addFeature(feature)
                    }
                  }}
                  className="text-xs"
                >
                  {feature}
                </Button>
              ))}
            </div>

            {/* Custom Feature Input */}
            <div className="flex space-x-2">
              <Input
                placeholder="Add custom feature..."
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addFeature(newFeature)}
              />
              <Button onClick={() => addFeature(newFeature)} size="icon" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Selected Features */}
            {data.key_features.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">Selected Features:</Label>
                <div className="flex flex-wrap gap-2">
                  {data.key_features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="flex items-center space-x-1">
                      <span>{feature}</span>
                      <button
                        onClick={() => removeFeature(feature)}
                        className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Keywords */}
          <div className="space-y-3">
            <Label className="flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>Marketing Keywords</span>
            </Label>
            <p className="text-sm text-muted-foreground">
              Add keywords that describe the property's appeal (e.g., "luxury", "cozy", "modern")
            </p>

            <div className="flex space-x-2">
              <Input
                placeholder="Add keyword..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addKeyword(newKeyword)}
              />
              <Button onClick={() => addKeyword(newKeyword)} size="icon" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {data.keywords.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">Keywords:</Label>
                <div className="flex flex-wrap gap-2">
                  {data.keywords.map((keyword) => (
                    <Badge key={keyword} variant="outline" className="flex items-center space-x-1">
                      <span>{keyword}</span>
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="additional_notes">Additional Notes</Label>
            <Textarea
              id="additional_notes"
              placeholder="Any additional details about the property, neighborhood, or special circumstances..."
              value={data.additional_notes}
              onChange={(e) => updateData({ additional_notes: e.target.value })}
              rows={4}
            />
          </div>

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onPrevious}>
              Previous
            </Button>
            <Button onClick={onNext}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
