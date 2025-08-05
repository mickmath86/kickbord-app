"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Settings, Palette, MessageSquare, Save } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardAdPreferencesProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const materialOptions = [
  { id: "facebook_ads", label: "Facebook & Instagram Ads", icon: "📘" },
  { id: "tiktok_script", label: "TikTok Video Script", icon: "🎵" },
  { id: "landing_page", label: "Landing Page", icon: "🌐" },
  { id: "social_graphics", label: "Social Media Graphics", icon: "🎨" },
  { id: "pdf_flyer", label: "PDF Flyer", icon: "📄" },
  { id: "email_template", label: "Email Template", icon: "📧" },
]

const styleOptions = [
  { id: "modern", label: "Modern & Clean", description: "Minimalist design with clean lines" },
  { id: "luxury", label: "Luxury & Elegant", description: "Sophisticated and upscale feel" },
  { id: "warm", label: "Warm & Inviting", description: "Cozy and welcoming atmosphere" },
  { id: "bold", label: "Bold & Dynamic", description: "Eye-catching and energetic" },
]

const toneOptions = [
  { id: "professional", label: "Professional", description: "Formal and trustworthy" },
  { id: "friendly", label: "Friendly", description: "Approachable and conversational" },
  { id: "luxury", label: "Luxury", description: "Sophisticated and exclusive" },
  { id: "urgent", label: "Urgent", description: "Creates sense of urgency" },
  { id: "informative", label: "Informative", description: "Educational and detailed" },
]

export function WizardAdPreferences({ onNext, onPrevious }: WizardAdPreferencesProps) {
  const { data, updateData } = useCampaignData()

  const handleMaterialToggle = (materialId: string) => {
    const current = data.materials_to_generate || []
    const updated = current.includes(materialId) ? current.filter((id) => id !== materialId) : [...current, materialId]
    updateData({ materials_to_generate: updated })
  }

  const handleStyleChange = (styleId: string) => {
    updateData({ creative_style: styleId })
  }

  const handleToneToggle = (toneId: string) => {
    const current = data.copy_tone || []
    const updated = current.includes(toneId) ? current.filter((id) => id !== toneId) : [...current, toneId]
    updateData({ copy_tone: updated })
  }

  const canProceed = (data.materials_to_generate?.length || 0) > 0

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Marketing Preferences</span>
          </CardTitle>
          <CardDescription>Choose what marketing materials to generate and set your style preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Materials to Generate */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Label className="text-base font-medium">What would you like to generate? *</Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {materialOptions.map((option) => (
                <div
                  key={option.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    data.materials_to_generate?.includes(option.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleMaterialToggle(option.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={data.materials_to_generate?.includes(option.id) || false}
                      onChange={() => handleMaterialToggle(option.id)}
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{option.icon}</span>
                      <span className="font-medium text-sm">{option.label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Creative Style */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span>Creative Style</span>
              </Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={data.save_style || false}
                  onCheckedChange={(checked) => updateData({ save_style: checked as boolean })}
                />
                <Label className="text-sm text-muted-foreground flex items-center space-x-1">
                  <Save className="h-3 w-3" />
                  <span>Save as default</span>
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {styleOptions.map((option) => (
                <div
                  key={option.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    data.creative_style === option.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleStyleChange(option.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 mt-0.5 ${
                        data.creative_style === option.id ? "border-blue-500 bg-blue-500" : "border-gray-300"
                      }`}
                    >
                      {data.creative_style === option.id && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                    </div>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Copy Tone */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Copy Tone (select multiple)</span>
              </Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={data.save_tone_default || false}
                  onCheckedChange={(checked) => updateData({ save_tone_default: checked as boolean })}
                />
                <Label className="text-sm text-muted-foreground flex items-center space-x-1">
                  <Save className="h-3 w-3" />
                  <span>Save as default</span>
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {toneOptions.map((option) => (
                <div
                  key={option.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    data.copy_tone?.includes(option.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleToneToggle(option.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={data.copy_tone?.includes(option.id) || false}
                      onChange={() => handleToneToggle(option.id)}
                    />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {data.copy_tone && data.copy_tone.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.copy_tone.map((tone) => (
                  <Badge key={tone} variant="secondary">
                    {toneOptions.find((t) => t.id === tone)?.label}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Additional Preferences */}
          <div className="space-y-2">
            <Label htmlFor="keywords_to_include">Additional Keywords or Preferences</Label>
            <Textarea
              id="keywords_to_include"
              placeholder="Any specific keywords, phrases, or preferences for your marketing materials..."
              value={data.keywords_to_include || ""}
              onChange={(e) => updateData({ keywords_to_include: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onPrevious}>
              Previous
            </Button>
            <Button onClick={onNext} disabled={!canProceed}>
              Generate Marketing Materials
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
