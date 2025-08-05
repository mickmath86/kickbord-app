"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Palette, MessageSquare } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardAdPreferencesProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const MATERIAL_OPTIONS = [
  { id: "social_posts", label: "Social Media Posts", description: "Instagram, Facebook posts" },
  { id: "property_description", label: "Property Description", description: "Detailed listing copy" },
  { id: "email_campaign", label: "Email Campaign", description: "Marketing email content" },
  { id: "flyer", label: "Property Flyer", description: "Printable marketing flyer" },
  { id: "website_copy", label: "Website Copy", description: "Property website content" },
]

const CREATIVE_STYLES = [
  { value: "modern", label: "Modern & Clean" },
  { value: "luxury", label: "Luxury & Elegant" },
  { value: "cozy", label: "Cozy & Welcoming" },
  { value: "professional", label: "Professional & Corporate" },
  { value: "creative", label: "Creative & Artistic" },
]

const COPY_TONES = [
  { id: "professional", label: "Professional" },
  { id: "friendly", label: "Friendly" },
  { id: "luxury", label: "Luxury" },
  { id: "casual", label: "Casual" },
  { id: "urgent", label: "Urgent" },
  { id: "informative", label: "Informative" },
]

const LISTING_STYLES = [
  { id: "detailed", label: "Detailed & Comprehensive" },
  { id: "concise", label: "Concise & Punchy" },
  { id: "storytelling", label: "Storytelling Approach" },
  { id: "feature_focused", label: "Feature-Focused" },
  { id: "lifestyle", label: "Lifestyle-Oriented" },
]

export function WizardAdPreferences({ onNext, onPrevious, isFirstStep }: WizardAdPreferencesProps) {
  const { data, updateData } = useCampaignData()

  // Add null check for data
  if (!data) {
    return <div>Loading...</div>
  }

  const handleMaterialToggle = (materialId: string, checked: boolean) => {
    if (checked) {
      updateData({ materials_to_generate: [...data.materials_to_generate, materialId] })
    } else {
      updateData({ materials_to_generate: data.materials_to_generate.filter((id) => id !== materialId) })
    }
  }

  const handleToneToggle = (toneId: string, checked: boolean) => {
    if (checked) {
      updateData({ copy_tone: [...data.copy_tone, toneId] })
    } else {
      updateData({ copy_tone: data.copy_tone.filter((id) => id !== toneId) })
    }
  }

  const handleListingStyleToggle = (styleId: string, checked: boolean) => {
    if (checked) {
      updateData({ listing_style: [...data.listing_style, styleId] })
    } else {
      updateData({ listing_style: data.listing_style.filter((id) => id !== styleId) })
    }
  }

  const canProceed = data.materials_to_generate.length > 0 && data.creative_style && data.copy_tone.length > 0

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Materials to Generate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Materials to Generate</span>
          </CardTitle>
          <CardDescription>Select the marketing materials you'd like us to create</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MATERIAL_OPTIONS.map((material) => (
              <div key={material.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={material.id}
                  checked={data.materials_to_generate.includes(material.id)}
                  onCheckedChange={(checked) => handleMaterialToggle(material.id, checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor={material.id} className="font-medium cursor-pointer">
                    {material.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">{material.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Creative Style */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Creative Style</span>
          </CardTitle>
          <CardDescription>Choose the visual and creative style for your materials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Style Preference *</Label>
            <Select value={data.creative_style || ""} onValueChange={(value) => updateData({ creative_style: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a creative style" />
              </SelectTrigger>
              <SelectContent>
                {CREATIVE_STYLES.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="save_style"
              checked={data.save_style}
              onCheckedChange={(checked) => updateData({ save_style: checked as boolean })}
            />
            <Label htmlFor="save_style" className="text-sm">
              Save this as my default style preference
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Copy Tone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Copy Tone & Style</span>
          </CardTitle>
          <CardDescription>Define the tone and style for your marketing copy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Copy Tone * (select all that apply)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {COPY_TONES.map((tone) => (
                <div key={tone.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={tone.id}
                    checked={data.copy_tone.includes(tone.id)}
                    onCheckedChange={(checked) => handleToneToggle(tone.id, checked as boolean)}
                  />
                  <Label htmlFor={tone.id} className="text-sm cursor-pointer">
                    {tone.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Listing Style (select all that apply)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {LISTING_STYLES.map((style) => (
                <div key={style.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={style.id}
                    checked={data.listing_style.includes(style.id)}
                    onCheckedChange={(checked) => handleListingStyleToggle(style.id, checked as boolean)}
                  />
                  <Label htmlFor={style.id} className="text-sm cursor-pointer">
                    {style.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords_to_include">Additional Keywords to Include</Label>
            <Textarea
              id="keywords_to_include"
              placeholder="Any specific keywords or phrases you want included in the copy..."
              value={data.keywords_to_include || ""}
              onChange={(e) => updateData({ keywords_to_include: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="save_tone_default"
              checked={data.save_tone_default}
              onCheckedChange={(checked) => updateData({ save_tone_default: checked as boolean })}
            />
            <Label htmlFor="save_tone_default" className="text-sm">
              Save these preferences as my default
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious} disabled={isFirstStep}>
          Previous
        </Button>
        <Button onClick={onNext} disabled={!canProceed}>
          Generate Materials
        </Button>
      </div>
    </div>
  )
}
