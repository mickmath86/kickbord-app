"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Target, Palette, MessageSquare } from 'lucide-react'
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardAdPreferencesProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const MATERIAL_OPTIONS = [
  { id: "social_posts", label: "Social Media Posts", description: "Facebook, Instagram, Twitter ready content" },
  { id: "email_templates", label: "Email Templates", description: "Professional email marketing templates" },
  { id: "landing_page", label: "Landing Page Copy", description: "Website and landing page content" },
  { id: "property_description", label: "Property Description", description: "Detailed listing descriptions" },
  { id: "ad_copy", label: "Advertisement Copy", description: "Google Ads, Facebook Ads copy" },
]

const STYLE_OPTIONS = [
  { id: "professional", label: "Professional", description: "Clean, formal, business-focused" },
  { id: "modern", label: "Modern", description: "Contemporary, sleek, minimalist" },
  { id: "luxury", label: "Luxury", description: "Premium, elegant, sophisticated" },
  { id: "friendly", label: "Friendly", description: "Warm, approachable, personal" },
]

const TONE_OPTIONS = [
  { id: "informative", label: "Informative" },
  { id: "persuasive", label: "Persuasive" },
  { id: "enthusiastic", label: "Enthusiastic" },
  { id: "trustworthy", label: "Trustworthy" },
  { id: "urgent", label: "Urgent" },
]

export function WizardAdPreferences({ onNext, onPrevious }: WizardAdPreferencesProps) {
  const { data, updateData } = useCampaignData()
  const [formData, setFormData] = useState({
    materials_to_generate: data.materials_to_generate || [],
    creative_style: data.creative_style || "",
    save_style: data.save_style || false,
    copy_tone: data.copy_tone || [],
    save_tone_default: data.save_tone_default || false,
    keywords_to_include: data.keywords_to_include || "",
  })

  const handleMaterialToggle = (materialId: string) => {
    const updated = formData.materials_to_generate.includes(materialId)
      ? formData.materials_to_generate.filter(id => id !== materialId)
      : [...formData.materials_to_generate, materialId]
    
    setFormData(prev => ({ ...prev, materials_to_generate: updated }))
  }

  const handleToneToggle = (tone: string) => {
    const updated = formData.copy_tone.includes(tone)
      ? formData.copy_tone.filter(t => t !== tone)
      : [...formData.copy_tone, tone]
    
    setFormData(prev => ({ ...prev, copy_tone: updated }))
  }

  const handleNext = () => {
    updateData(formData)
    onNext()
  }

  const canProceed = formData.materials_to_generate.length > 0 && formData.creative_style

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle>Marketing Preferences</CardTitle>
          <CardDescription>
            Choose what marketing materials to generate and your preferred style
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Materials to Generate */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <Label className="text-base font-medium">What would you like us to create?</Label>
            </div>
            <div className="space-y-3">
              {MATERIAL_OPTIONS.map((option) => (
                <div key={option.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id={option.id}
                    checked={formData.materials_to_generate.includes(option.id)}
                    onCheckedChange={() => handleMaterialToggle(option.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={option.id} className="font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Creative Style */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-blue-600" />
              <Label className="text-base font-medium">Creative Style</Label>
            </div>
            <RadioGroup 
              value={formData.creative_style} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, creative_style: value }))}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {STYLE_OPTIONS.map((option) => (
                  <div key={option.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <div className="flex-1">
                      <Label htmlFor={option.id} className="font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="save_style"
                checked={formData.save_style}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, save_style: !!checked }))}
              />
              <Label htmlFor="save_style" className="text-sm">
                Save this as my default style preference
              </Label>
            </div>
          </div>

          {/* Copy Tone */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <Label className="text-base font-medium">Copy Tone (Select all that apply)</Label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {TONE_OPTIONS.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={formData.copy_tone.includes(option.id)}
                    onCheckedChange={() => handleToneToggle(option.id)}
                  />
                  <Label htmlFor={option.id} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="save_tone_default"
                checked={formData.save_tone_default}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, save_tone_default: !!checked }))}
              />
              <Label htmlFor="save_tone_default" className="text-sm">
                Save these tone preferences as default
              </Label>
            </div>
          </div>

          {/* Additional Keywords */}
          <div className="space-y-2">
            <Label htmlFor="keywords_to_include">Additional Keywords to Include</Label>
            <Input
              id="keywords_to_include"
              placeholder="luxury, waterfront, move-in ready..."
              value={formData.keywords_to_include}
              onChange={(e) => setFormData(prev => ({ ...prev, keywords_to_include: e.target.value }))}
            />
            <p className="text-sm text-muted-foreground">
              Separate multiple keywords with commas
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onPrevious}>
              Back
            </Button>
            <Button onClick={handleNext} disabled={!canProceed}>
              Generate Materials
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
