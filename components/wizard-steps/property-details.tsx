"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Star, Plus, X } from "lucide-react"
import { useCampaignData } from "@/components/campaign-wizard"
import { useState } from "react"

const COMMON_FEATURES = [
  "Pool",
  "Garage",
  "Fireplace",
  "Hardwood Floors",
  "Updated Kitchen",
  "Master Suite",
  "Walk-in Closet",
  "Patio/Deck",
  "Garden",
  "Mountain View",
  "Ocean View",
  "City View",
  "Gourmet Kitchen",
  "Wine Cellar",
  "Home Office",
  "Gym/Fitness Room",
  "Guest House",
  "Solar Panels",
  "Smart Home",
  "Security System",
]

export function WizardPropertyDetails() {
  const { data, updateData, nextStep, prevStep } = useCampaignData()
  const [newKeyword, setNewKeyword] = useState("")

  if (!data) {
    return <div>Loading...</div>
  }

  const features = data.features || []
  const keywords = data.keywords || []

  const toggleFeature = (feature: string) => {
    const currentFeatures = features || []
    const updatedFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter((f) => f !== feature)
      : [...currentFeatures, feature]
    updateData({ features: updatedFeatures })
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      updateData({ keywords: [...keywords, newKeyword.trim()] })
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    updateData({ keywords: keywords.filter((k) => k !== keyword) })
  }

  const handleNext = () => {
    nextStep()
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Property Details</h2>
        <p className="text-muted-foreground mt-2">Add features and details that make this property special</p>
      </div>

      <div className="grid gap-6">
        {/* Key Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Key Features
            </CardTitle>
            <CardDescription>Select the standout features of this property</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {COMMON_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={features.includes(feature)}
                    onCheckedChange={() => toggleFeature(feature)}
                  />
                  <Label htmlFor={feature} className="text-sm font-normal cursor-pointer">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
            {features.length > 0 && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Selected Features:</p>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature) => (
                    <Badge key={feature} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Custom Keywords */}
        <Card>
          <CardHeader>
            <CardTitle>Marketing Keywords</CardTitle>
            <CardDescription>Add specific words or phrases you want emphasized in the marketing copy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="e.g., luxury, modern, spacious"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addKeyword()}
              />
              <Button onClick={addKeyword} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <Badge key={keyword} variant="outline" className="pr-1">
                    {keyword}
                    <button onClick={() => removeKeyword(keyword)} className="ml-1 hover:bg-muted rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
            <CardDescription>Any special details, recent updates, or unique selling points</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., Recently renovated kitchen, quiet neighborhood, close to schools..."
              value={data.notes || ""}
              onChange={(e) => updateData({ notes: e.target.value })}
              rows={4}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
          Continue
        </Button>
      </div>
    </div>
  )
}
