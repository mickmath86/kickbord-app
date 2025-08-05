"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Shuffle } from "lucide-react"
import { useCampaignData } from "@/components/campaign-wizard"
import { useState } from "react"

interface WizardAdPreferencesProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const materialOptions = [
  { id: "facebook", label: "Facebook Ad" },
  { id: "instagram", label: "Instagram Ad" },
  { id: "google", label: "Google Display Ad" },
  { id: "pdf", label: "PDF Brochure" },
]

const creativeStyles = [
  { id: "luxury", label: "Luxury Style", description: "Elegant, sophisticated, premium feel" },
  { id: "family", label: "Family Friendly", description: "Warm, welcoming, community-focused" },
  { id: "investor", label: "Investor-Focused", description: "Data-driven, ROI-focused, analytical" },
]

const toneOptions = ["Professional", "Casual", "Luxury", "Friendly", "Urgent", "Minimal"]

export function WizardAdPreferences({ onNext, onPrevious }: WizardAdPreferencesProps) {
  const { data, updateData } = useCampaignData()
  const [currentStyles, setCurrentStyles] = useState(creativeStyles)

  const toggleMaterial = (materialId: string) => {
    const materials = data.materials_to_generate.includes(materialId)
      ? data.materials_to_generate.filter((m) => m !== materialId)
      : [...data.materials_to_generate, materialId]
    updateData({ materials_to_generate: materials })
  }

  const selectCreativeStyle = (styleId: string) => {
    updateData({ creative_style: styleId })
  }

  const randomizeStyles = () => {
    // In a real app, this would fetch new options from an API
    const allStyles = [
      ...creativeStyles,
      { id: "minimalist", label: "Minimalist", description: "Clean, simple, uncluttered design" },
      { id: "rustic", label: "Rustic Charm", description: "Cozy, natural, countryside appeal" },
      { id: "contemporary", label: "Contemporary", description: "Current trends, fresh, stylish" },
    ]

    const shuffled = allStyles.sort(() => 0.5 - Math.random()).slice(0, 3)
    setCurrentStyles(shuffled)
  }

  const toggleTone = (tone: string) => {
    const tones = data.copy_tone.includes(tone) ? data.copy_tone.filter((t) => t !== tone) : [...data.copy_tone, tone]
    updateData({ copy_tone: tones })
  }

  const isValid = data.materials_to_generate.length > 0 && data.creative_style && data.copy_tone.length > 0

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="text-sm font-medium text-blue-600 mb-2">Phase 2 of 2: Advertising Preferences</div>
        <h2 className="text-2xl font-bold mb-2">Ad Preferences Setup</h2>
        <p className="text-muted-foreground">Choose what materials to generate and customize your marketing style</p>
      </div>

      <div className="space-y-8">
        {/* A. Materials to Generate */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Materials to Generate</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {materialOptions.map((material) => (
              <Card
                key={material.id}
                className={`cursor-pointer transition-all ${
                  data.materials_to_generate.includes(material.id)
                    ? "ring-2 ring-blue-600 bg-blue-50"
                    : "hover:shadow-md"
                }`}
                onClick={() => toggleMaterial(material.id)}
              >
                <CardContent className="flex items-center space-x-3 p-4">
                  <Checkbox
                    checked={data.materials_to_generate.includes(material.id)}
                    onChange={() => {}} // Handled by card click
                  />
                  <Label className="font-medium cursor-pointer">{material.label}</Label>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* B. Creative Style */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Creative Style</h3>
            <Button variant="outline" size="sm" onClick={randomizeStyles}>
              <Shuffle className="mr-2 h-4 w-4" />
              Randomize
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {currentStyles.map((style) => (
              <Card
                key={style.id}
                className={`cursor-pointer transition-all ${
                  data.creative_style === style.id ? "ring-2 ring-blue-600 bg-blue-50" : "hover:shadow-md"
                }`}
                onClick={() => selectCreativeStyle(style.id)}
              >
                <CardHeader className="pb-2">
                  <div className="w-full h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-2 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">{style.label} Preview</span>
                  </div>
                  <CardTitle className="text-base">{style.label}</CardTitle>
                  <CardDescription className="text-sm">{style.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    variant={data.creative_style === style.id ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                  >
                    {data.creative_style === style.id ? "Selected" : "Select"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox checked={data.save_style} onCheckedChange={(checked) => updateData({ save_style: !!checked })} />
            <Label>Save this style for future campaigns</Label>
          </div>
        </div>

        {/* C. Copy Preferences */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Copy Preferences</h3>

          {/* Tone */}
          <div>
            <Label className="text-base font-medium">Tone (select multiple)</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {toneOptions.map((tone) => (
                <Badge
                  key={tone}
                  variant={data.copy_tone.includes(tone) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTone(tone)}
                >
                  {tone}
                </Badge>
              ))}
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                checked={data.save_tone_default}
                onCheckedChange={(checked) => updateData({ save_tone_default: !!checked })}
              />
              <Label className="text-sm">Save these tone preferences as my default</Label>
            </div>
          </div>

          {/* Additional Tone Preferences */}
          <div>
            <Label htmlFor="additional-tone">Additional Tone Preferences</Label>
            <Input
              id="additional-tone"
              value={data.additional_tone_preferences || ""}
              onChange={(e) => updateData({ additional_tone_preferences: e.target.value })}
              placeholder="e.g., emphasize family-friendly, highlight investment potential, focus on luxury amenities..."
            />
            <p className="text-sm text-muted-foreground mt-1">
              Provide specific guidance for the tone and messaging of your marketing copy
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={onNext} disabled={!isValid} className="bg-blue-600 hover:bg-blue-700">
          Generate Copy
        </Button>
      </div>
    </div>
  )
}
