"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Palette, Target, FileText } from 'lucide-react'
import { useCampaignData } from "@/app/dashboard/campaigns/create/context"

interface WizardAdPreferencesProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const MATERIALS_OPTIONS = [
  "Property Description",
  "Social Media Posts",
  "Email Templates",
  "Print Flyers",
  "Website Listing"
]

const CREATIVE_STYLES = [
  { value: "professional", label: "Professional", description: "Clean, sophisticated, business-focused" },
  { value: "luxury", label: "Luxury", description: "Elegant, premium, high-end appeal" },
  { value: "modern", label: "Modern", description: "Contemporary, sleek, minimalist" },
  { value: "warm", label: "Warm & Inviting", description: "Cozy, family-friendly, welcoming" }
]

const COPY_TONES = [
  "Informative",
  "Persuasive", 
  "Emotional",
  "Urgent",
  "Friendly",
  "Professional"
]

export function WizardAdPreferences({ onNext, onPrevious }: WizardAdPreferencesProps) {
  const { data, updateData } = useCampaignData()

  const handleMaterialToggle = (material: string, checked: boolean) => {
    const updated = checked 
      ? [...data.materials_to_generate, material]
      : data.materials_to_generate.filter(m => m !== material)
    updateData({ materials_to_generate: updated })
  }

  const handleToneToggle = (tone: string, checked: boolean) => {
    const updated = checked 
      ? [...data.copy_tone, tone]
      : data.copy_tone.filter(t => t !== tone)
    updateData({ copy_tone: updated })
  }

  const canProceed = data.materials_to_generate.length > 0 && data.creative_style && data.copy_tone.length > 0

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Marketing Preferences</h2>
        <p className="text-muted-foreground">
          Customize your marketing materials to match your style and goals
        </p>
      </div>

      <div className="space-y-8">
        {/* Materials to Generate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              What would you like us to create?
            </CardTitle>
            <CardDescription>
              Select the marketing materials you need for your campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MATERIALS_OPTIONS.map((material) => (
                <div key={material} className="flex items-center space-x-2">
                  <Checkbox
                    id={material}
                    checked={data.materials_to_generate.includes(material)}
                    onCheckedChange={(checked) => handleMaterialToggle(material, checked as boolean)}
                  />
                  <Label htmlFor={material}>{material}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Creative Style */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Creative Style
            </CardTitle>
            <CardDescription>
              Choose the overall style and tone for your marketing materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={data.creative_style} 
              onValueChange={(value) => updateData({ creative_style: value })}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CREATIVE_STYLES.map((style) => (
                  <div key={style.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={style.value} id={style.value} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={style.value} className="font-medium">
                        {style.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {style.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Copy Tone */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Copy Tone
            </CardTitle>
            <CardDescription>
              Select the tone(s) that best fit your target audience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {COPY_TONES.map((tone) => (
                <div key={tone} className="flex items-center space-x-2">
                  <Checkbox
                    id={tone}
                    checked={data.copy_tone.includes(tone)}
                    onCheckedChange={(checked) => handleToneToggle(tone, checked as boolean)}
                  />
                  <Label htmlFor={tone}>{tone}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Keywords */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Keywords</CardTitle>
            <CardDescription>
              Any specific keywords or phrases you want to include in your marketing copy?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., first-time buyer friendly, investment opportunity, move-in ready..."
              value={data.keywords_to_include}
              onChange={(e) => updateData({ keywords_to_include: e.target.value })}
              rows={3}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed}>
          Generate Marketing Materials
        </Button>
      </div>
    </div>
  )
}
