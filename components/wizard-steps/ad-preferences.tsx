"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Palette, FileText, Megaphone } from "lucide-react"
import { useCampaignData } from "@/components/campaign-wizard"

const MARKETING_MATERIALS = [
  { id: "social_media", label: "Social Media Posts", description: "Instagram, Facebook, Twitter ready content" },
  { id: "listing_description", label: "Listing Description", description: "Professional MLS description" },
  { id: "flyer", label: "Property Flyer", description: "Print-ready marketing flyer" },
  { id: "email_template", label: "Email Template", description: "Client outreach template" },
  { id: "landing_page", label: "Landing Page Copy", description: "Website content for the property" },
]

const STYLE_OPTIONS = [
  { id: "professional", label: "Professional", description: "Clean, formal, business-focused" },
  { id: "luxury", label: "Luxury", description: "Elegant, sophisticated, high-end" },
  { id: "modern", label: "Modern", description: "Contemporary, sleek, minimalist" },
  { id: "warm", label: "Warm & Inviting", description: "Friendly, welcoming, family-focused" },
]

const TONE_OPTIONS = [
  { id: "informative", label: "Informative", description: "Fact-focused, detailed, educational" },
  { id: "persuasive", label: "Persuasive", description: "Compelling, action-oriented, sales-focused" },
  { id: "emotional", label: "Emotional", description: "Story-driven, lifestyle-focused, aspirational" },
]

export function WizardAdPreferences() {
  const { data, updateData, nextStep, prevStep } = useCampaignData()

  if (!data) {
    return <div>Loading...</div>
  }

  const selectedMaterials = data.marketing_materials || []
  const selectedStyle = data.style || ""
  const selectedTone = data.tone || ""

  const toggleMaterial = (materialId: string) => {
    const updated = selectedMaterials.includes(materialId)
      ? selectedMaterials.filter((m) => m !== materialId)
      : [...selectedMaterials, materialId]
    updateData({ marketing_materials: updated })
  }

  const handleNext = () => {
    if (selectedMaterials.length > 0 && selectedStyle && selectedTone) {
      nextStep()
    }
  }

  const canProceed = selectedMaterials.length > 0 && selectedStyle && selectedTone

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Marketing Preferences</h2>
        <p className="text-muted-foreground mt-2">Choose what marketing materials to generate and set the style</p>
      </div>

      <div className="grid gap-6">
        {/* Marketing Materials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Marketing Materials
            </CardTitle>
            <CardDescription>Select which marketing materials you'd like us to generate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {MARKETING_MATERIALS.map((material) => (
              <div
                key={material.id}
                className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={material.id}
                  checked={selectedMaterials.includes(material.id)}
                  onCheckedChange={() => toggleMaterial(material.id)}
                />
                <div className="flex-1">
                  <Label htmlFor={material.id} className="font-medium cursor-pointer">
                    {material.label}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">{material.description}</p>
                </div>
              </div>
            ))}
            {selectedMaterials.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  Selected Materials ({selectedMaterials.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedMaterials.map((materialId) => {
                    const material = MARKETING_MATERIALS.find((m) => m.id === materialId)
                    return (
                      <Badge key={materialId} variant="secondary">
                        {material?.label}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Style Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Visual Style
            </CardTitle>
            <CardDescription>Choose the overall style and aesthetic for your marketing materials</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedStyle}
              onValueChange={(value) => updateData({ style: value })}
              className="space-y-3"
            >
              {STYLE_OPTIONS.map((style) => (
                <div
                  key={style.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <RadioGroupItem value={style.id} id={style.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={style.id} className="font-medium cursor-pointer">
                      {style.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">{style.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Tone Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Tone
            </CardTitle>
            <CardDescription>Select the tone and approach for your marketing copy</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedTone}
              onValueChange={(value) => updateData({ tone: value })}
              className="space-y-3"
            >
              {TONE_OPTIONS.map((tone) => (
                <div
                  key={tone.id}
                  className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <RadioGroupItem value={tone.id} id={tone.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={tone.id} className="font-medium cursor-pointer">
                      {tone.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">{tone.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!canProceed} className="bg-blue-600 hover:bg-blue-700">
          Generate Campaign
        </Button>
      </div>
    </div>
  )
}
