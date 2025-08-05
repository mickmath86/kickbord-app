"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Palette, Target, Megaphone } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardAdPreferencesProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const MARKETING_MATERIALS = [
  { id: "social_media_posts", label: "Social Media Posts", description: "Facebook, Instagram, Twitter posts" },
  { id: "property_flyers", label: "Property Flyers", description: "Printable marketing flyers" },
  { id: "email_campaigns", label: "Email Campaigns", description: "Professional email templates" },
  { id: "landing_page", label: "Landing Page", description: "Dedicated property website" },
  { id: "virtual_tour", label: "Virtual Tour", description: "Interactive property showcase" },
  { id: "brochures", label: "Brochures", description: "Detailed property brochures" },
]

const STYLE_OPTIONS = [
  { id: "modern", label: "Modern & Clean", description: "Minimalist design with clean lines" },
  { id: "luxury", label: "Luxury & Elegant", description: "Sophisticated and upscale feel" },
  { id: "warm", label: "Warm & Inviting", description: "Cozy and welcoming atmosphere" },
  { id: "professional", label: "Professional", description: "Business-focused and credible" },
]

const TONE_OPTIONS = [
  { id: "friendly", label: "Friendly & Approachable", description: "Casual and welcoming tone" },
  { id: "professional", label: "Professional & Authoritative", description: "Expert and trustworthy" },
  { id: "exciting", label: "Exciting & Energetic", description: "Dynamic and enthusiastic" },
  { id: "sophisticated", label: "Sophisticated & Refined", description: "Elegant and polished" },
]

export function WizardAdPreferences({ onNext, onPrevious }: WizardAdPreferencesProps) {
  const { data, updateData } = useCampaignData()
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(
    data?.materials_to_generate || ["social_media_posts", "property_flyers", "email_campaigns"],
  )
  const [selectedStyle, setSelectedStyle] = useState(data?.design_style || "modern")
  const [selectedTone, setSelectedTone] = useState(data?.content_tone || "professional")

  const handleMaterialToggle = (materialId: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(materialId) ? prev.filter((id) => id !== materialId) : [...prev, materialId],
    )
  }

  const handleNext = () => {
    updateData({
      materials_to_generate: selectedMaterials,
      design_style: selectedStyle,
      content_tone: selectedTone,
    })
    onNext()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Marketing Preferences
          </CardTitle>
          <CardDescription>Customize your marketing materials and style preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Marketing Materials */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Marketing Materials</Label>
                <p className="text-sm text-muted-foreground">Choose what we should create for your campaign</p>
              </div>
              <Badge variant="secondary">{selectedMaterials.length} selected</Badge>
            </div>

            <div className="grid gap-3">
              {MARKETING_MATERIALS.map((material) => (
                <div
                  key={material.id}
                  className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedMaterials.includes(material.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => handleMaterialToggle(material.id)}
                >
                  <Checkbox
                    checked={selectedMaterials.includes(material.id)}
                    onChange={() => handleMaterialToggle(material.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <Label className="font-medium cursor-pointer">{material.label}</Label>
                    <p className="text-sm text-muted-foreground">{material.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Design Style */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Design Style
              </Label>
              <p className="text-sm text-muted-foreground">Choose the visual style for your marketing materials</p>
            </div>

            <RadioGroup value={selectedStyle} onValueChange={setSelectedStyle}>
              <div className="grid gap-3">
                {STYLE_OPTIONS.map((style) => (
                  <div
                    key={style.id}
                    className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedStyle === style.id ? "border-blue-500 bg-blue-50" : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem value={style.id} className="mt-0.5" />
                    <div className="flex-1">
                      <Label className="font-medium cursor-pointer">{style.label}</Label>
                      <p className="text-sm text-muted-foreground">{style.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Content Tone */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Content Tone
              </Label>
              <p className="text-sm text-muted-foreground">Select the tone of voice for your marketing content</p>
            </div>

            <RadioGroup value={selectedTone} onValueChange={setSelectedTone}>
              <div className="grid gap-3">
                {TONE_OPTIONS.map((tone) => (
                  <div
                    key={tone.id}
                    className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTone === tone.id ? "border-blue-500 bg-blue-50" : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem value={tone.id} className="mt-0.5" />
                    <div className="flex-1">
                      <Label className="font-medium cursor-pointer">{tone.label}</Label>
                      <p className="text-sm text-muted-foreground">{tone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 border rounded-lg p-4">
            <h4 className="font-medium mb-3">Campaign Summary</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Materials:</span> {selectedMaterials.length} items selected
              </div>
              <div>
                <span className="font-medium">Style:</span> {STYLE_OPTIONS.find((s) => s.id === selectedStyle)?.label}
              </div>
              <div>
                <span className="font-medium">Tone:</span> {TONE_OPTIONS.find((t) => t.id === selectedTone)?.label}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onPrevious}>
              Previous
            </Button>
            <Button onClick={handleNext}>Generate Campaign</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
