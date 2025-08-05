"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Star, Plus, X } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardPropertyDetailsProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const POPULAR_FEATURES = [
  "Updated Kitchen",
  "Hardwood Floors",
  "Granite Countertops",
  "Stainless Steel Appliances",
  "Walk-in Closet",
  "Master Suite",
  "Fireplace",
  "Garage",
  "Pool",
  "Deck/Patio",
  "Garden",
  "Air Conditioning",
  "Central Heating",
  "Laundry Room",
  "Storage Space",
  "High Ceilings",
  "Natural Light",
  "Open Floor Plan",
]

export function WizardPropertyDetails({ onNext, onPrevious }: WizardPropertyDetailsProps) {
  const { data, updateData } = useCampaignData()
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(data?.key_features || [])
  const [customFeature, setCustomFeature] = useState("")
  const [keywords, setKeywords] = useState(data?.keywords || "")
  const [notes, setNotes] = useState(data?.notes || "")

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) => (prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]))
  }

  const addCustomFeature = () => {
    if (customFeature.trim() && !selectedFeatures.includes(customFeature.trim())) {
      setSelectedFeatures((prev) => [...prev, customFeature.trim()])
      setCustomFeature("")
    }
  }

  const removeFeature = (feature: string) => {
    setSelectedFeatures((prev) => prev.filter((f) => f !== feature))
  }

  const handleNext = () => {
    updateData({
      key_features: selectedFeatures,
      keywords: keywords.trim(),
      notes: notes.trim(),
    })
    onNext()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Property Features & Details
          </CardTitle>
          <CardDescription>Highlight what makes your property special</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Features */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Key Features</Label>
              <p className="text-sm text-muted-foreground">Select the features that best describe your property</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {POPULAR_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={selectedFeatures.includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                  />
                  <Label htmlFor={feature} className="text-sm font-normal cursor-pointer">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>

            {/* Custom Feature Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom feature..."
                value={customFeature}
                onChange={(e) => setCustomFeature(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCustomFeature()}
                className="flex-1 px-3 py-2 border border-input rounded-md text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomFeature}
                disabled={!customFeature.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Selected Features */}
            {selectedFeatures.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Selected Features ({selectedFeatures.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedFeatures.map((feature) => (
                    <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                      {feature}
                      <button onClick={() => removeFeature(feature)} className="ml-1 hover:bg-muted rounded-full p-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label htmlFor="keywords">Marketing Keywords (optional)</Label>
            <Textarea
              id="keywords"
              placeholder="luxury, modern, updated, move-in ready, prime location..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Add keywords that describe your property's appeal and target market
            </p>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special details, recent renovations, neighborhood highlights, or unique selling points..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Share any additional information that would help create better marketing content
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">🎯 Marketing Impact</h4>
            <p className="text-sm text-purple-700">
              The features and details you select will be used to create compelling headlines, social media posts, and
              property descriptions that highlight your home's best qualities.
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onPrevious}>
              Previous
            </Button>
            <Button onClick={handleNext}>Next: Upload Photos</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
