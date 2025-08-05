"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Plus, X } from "lucide-react"

interface WizardPropertyDetailsProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
  data: any
  updateData: (data: any) => void
}

const SUGGESTED_FEATURES = [
  "Hardwood Floors",
  "Granite Countertops",
  "Stainless Steel Appliances",
  "Walk-in Closet",
  "Fireplace",
  "Swimming Pool",
  "Garage",
  "Deck/Patio",
  "Updated Kitchen",
  "Master Suite",
  "Basement",
  "Fenced Yard",
  "Central Air",
  "New Roof",
  "Energy Efficient",
]

const SUGGESTED_KEYWORDS = [
  "Move-in Ready",
  "Updated",
  "Spacious",
  "Charming",
  "Modern",
  "Cozy",
  "Luxury",
  "Family-Friendly",
  "Quiet Neighborhood",
  "Great Location",
  "Investment Opportunity",
  "Starter Home",
  "Dream Home",
  "Must See",
  "Price Reduced",
]

export function WizardPropertyDetails({
  onNext,
  onPrevious,
  isFirstStep,
  data,
  updateData,
}: WizardPropertyDetailsProps) {
  const [newFeature, setNewFeature] = useState("")
  const [newKeyword, setNewKeyword] = useState("")

  const addFeature = (feature: string) => {
    if (feature.trim() && !data.keyFeatures?.includes(feature.trim())) {
      updateData({
        keyFeatures: [...(data.keyFeatures || []), feature.trim()],
      })
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = [...(data.keyFeatures || [])]
    updatedFeatures.splice(index, 1)
    updateData({ keyFeatures: updatedFeatures })
  }

  const addKeyword = (keyword: string) => {
    if (keyword.trim() && !data.keywords?.includes(keyword.trim())) {
      updateData({
        keywords: [...(data.keywords || []), keyword.trim()],
      })
      setNewKeyword("")
    }
  }

  const removeKeyword = (index: number) => {
    const updatedKeywords = [...(data.keywords || [])]
    updatedKeywords.splice(index, 1)
    updateData({ keywords: updatedKeywords })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="h-8 w-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Features & Details</h2>
        <p className="text-lg text-muted-foreground">Highlight what makes this property special</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
            <p className="text-sm text-muted-foreground">Add the standout features that buyers will love</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_FEATURES.map((feature) => (
                <Badge
                  key={feature}
                  variant={data.keyFeatures?.includes(feature) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => addFeature(feature)}
                >
                  {feature}
                  {data.keyFeatures?.includes(feature) && <Plus className="ml-1 h-3 w-3" />}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add custom feature..."
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addFeature(newFeature)}
              />
              <Button onClick={() => addFeature(newFeature)} disabled={!newFeature.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {data.keyFeatures && data.keyFeatures.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Selected Features:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.keyFeatures.map((feature: string, index: number) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {feature}
                      <button onClick={() => removeFeature(index)} className="ml-1 hover:bg-red-100 rounded-full p-0.5">
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
            <CardTitle>Marketing Keywords</CardTitle>
            <p className="text-sm text-muted-foreground">Choose words that will attract potential buyers</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_KEYWORDS.map((keyword) => (
                <Badge
                  key={keyword}
                  variant={data.keywords?.includes(keyword) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => addKeyword(keyword)}
                >
                  {keyword}
                  {data.keywords?.includes(keyword) && <Plus className="ml-1 h-3 w-3" />}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add custom keyword..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addKeyword(newKeyword)}
              />
              <Button onClick={() => addKeyword(newKeyword)} disabled={!newKeyword.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {data.keywords && data.keywords.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Selected Keywords:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.keywords.map((keyword: string, index: number) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {keyword}
                      <button onClick={() => removeKeyword(index)} className="ml-1 hover:bg-red-100 rounded-full p-0.5">
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
            <p className="text-sm text-muted-foreground">Any special details or unique selling points</p>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., Recently renovated kitchen, quiet cul-de-sac location, walking distance to schools..."
              value={data.additionalNotes || ""}
              onChange={(e) => updateData({ additionalNotes: e.target.value })}
              rows={4}
            />
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={onPrevious} disabled={isFirstStep} size="lg">
          Previous
        </Button>
        <Button onClick={onNext} size="lg">
          Next: Upload Photos
        </Button>
      </div>
    </div>
  )
}
