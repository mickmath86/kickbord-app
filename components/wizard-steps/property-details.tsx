"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Sparkles } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardPropertyDetailsProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const SUGGESTED_FEATURES = [
  "Updated Kitchen",
  "Hardwood Floors",
  "Granite Countertops",
  "Stainless Steel Appliances",
  "Walk-in Closet",
  "Master Suite",
  "Fireplace",
  "Deck/Patio",
  "Garage",
  "Pool",
  "Garden",
  "High Ceilings",
  "Open Floor Plan",
  "Recently Renovated",
]

export function WizardPropertyDetails({ onNext, onPrevious, isFirstStep }: WizardPropertyDetailsProps) {
  const { data, updateData } = useCampaignData()
  const [newFeature, setNewFeature] = useState("")
  const [newKeyword, setNewKeyword] = useState("")

  // Add null check for data
  if (!data) {
    return <div>Loading...</div>
  }

  const addFeature = (feature: string) => {
    if (feature.trim() && !data.key_features.includes(feature.trim())) {
      updateData({ key_features: [...data.key_features, feature.trim()] })
      setNewFeature("")
    }
  }

  const removeFeature = (feature: string) => {
    updateData({ key_features: data.key_features.filter((f) => f !== feature) })
  }

  const addKeyword = (keyword: string) => {
    if (keyword.trim() && !data.keywords.includes(keyword.trim())) {
      updateData({ keywords: [...data.keywords, keyword.trim()] })
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    updateData({ keywords: data.keywords.filter((k) => k !== keyword) })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>Property Details</span>
          </CardTitle>
          <CardDescription>Add features and details that make your property special</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Features */}
          <div className="space-y-3">
            <Label>Key Features</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {data.key_features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removeFeature(feature)} />
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add a key feature..."
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addFeature(newFeature)}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => addFeature(newFeature)}
                disabled={!newFeature.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Suggested Features */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Suggested features:</Label>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_FEATURES.filter((feature) => !data.key_features.includes(feature))
                  .slice(0, 8)
                  .map((feature) => (
                    <Button
                      key={feature}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addFeature(feature)}
                      className="text-xs"
                    >
                      + {feature}
                    </Button>
                  ))}
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="space-y-3">
            <Label>Marketing Keywords</Label>
            <p className="text-sm text-muted-foreground">
              Add keywords that describe your property's appeal (e.g., "luxury", "cozy", "modern")
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {data.keywords.map((keyword, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {keyword}
                  <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removeKeyword(keyword)} />
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add a keyword..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addKeyword(newKeyword)}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => addKeyword(newKeyword)}
                disabled={!newKeyword.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="additional_notes">Additional Notes</Label>
            <Textarea
              id="additional_notes"
              placeholder="Any additional details about the property, neighborhood, or special selling points..."
              value={data.additional_notes || ""}
              onChange={(e) => updateData({ additional_notes: e.target.value })}
              rows={4}
            />
          </div>

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onPrevious} disabled={isFirstStep}>
              Previous
            </Button>
            <Button onClick={onNext}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
