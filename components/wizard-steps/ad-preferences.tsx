"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Settings, Target, Palette, MessageSquare } from 'lucide-react'
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardAdPreferencesProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const MATERIALS_OPTIONS = [
  { id: "social_posts", label: "Social Media Posts", description: "Facebook, Instagram, Twitter posts" },
  { id: "property_description", label: "Property Description", description: "Detailed listing description" },
  { id: "email_template", label: "Email Template", description: "Agent and client email templates" },
  { id: "landing_page", label: "Landing Page", description: "Dedicated property website" },
  { id: "flyer", label: "Digital Flyer", description: "Printable marketing flyer" }
]

const CREATIVE_STYLES = [
  { id: "professional", label: "Professional", description: "Clean, sophisticated, business-focused" },
  { id: "modern", label: "Modern", description: "Contemporary, sleek, minimalist" },
  { id: "luxury", label: "Luxury", description: "Premium, elegant, high-end" },
  { id: "family", label: "Family-Friendly", description: "Warm, welcoming, comfortable" },
  { id: "trendy", label: "Trendy", description: "Current, stylish, eye-catching" }
]

const COPY_TONES = [
  "Professional",
  "Friendly",
  "Urgent",
  "Informative",
  "Emotional",
  "Conversational"
]

export function WizardAdPreferences({ onNext, onPrevious }: WizardAdPreferencesProps) {
  const { data, updateData } = useCampaignData()
  const [formData, setFormData] = useState({
    materials_to_generate: data.materials_to_generate || [],
    creative_style: data.creative_style || "",
    copy_tone: data.copy_tone || [],
    keywords_to_include: data.keywords_to_include || ""
  })

  const handleMaterialToggle = (materialId: string) => {
    setFormData(prev => ({
      ...prev,
      materials_to_generate: prev.materials_to_generate.includes(materialId)
        ? prev.materials_to_generate.filter(id => id !== materialId)
        : [...prev.materials_to_generate, materialId]
    }))
  }

  const handleToneToggle = (tone: string) => {
    setFormData(prev => ({
      ...prev,
      copy_tone: prev.copy_tone.includes(tone)
        ? prev.copy_tone.filter(t => t !== tone)
        : [...prev.copy_tone, tone]
    }))
  }

  const handleNext = () => {
    updateData(formData)
    onNext()
  }

  const canProceed = formData.materials_to_generate.length > 0 && formData.creative_style

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Marketing Preferences</h2>
        <p className="text-muted-foreground">
          Customize your marketing materials to match your style and needs
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Materials to Generate
            </CardTitle>
            <CardDescription>
              Select which marketing materials you'd like us to create
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {MATERIALS_OPTIONS.map((material) => (
              <div key={material.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  id={material.id}
                  checked={formData.materials_to_generate.includes(material.id)}
                  onCheckedChange={() => handleMaterialToggle(material.id)}
                />
                <div className="flex-1">
                  <Label htmlFor={material.id} className="font-medium">
                    {material.label}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {material.description}
                  </p>
                </div>
              </div>
            ))}
            
            {formData.materials_to_generate.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Selected Materials</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.materials_to_generate.map((materialId) => {
                    const material = MATERIALS_OPTIONS.find(m => m.id === materialId)
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Creative Style
            </CardTitle>
            <CardDescription>
              Choose the overall style and feel for your marketing materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={formData.creative_style}
              onValueChange={(value) => setFormData(prev => ({ ...prev, creative_style: value }))}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CREATIVE_STYLES.map((style) => (
                  <div key={style.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                    <RadioGroupItem value={style.id} id={style.id} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={style.id} className="font-medium">
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Copy Tone
            </CardTitle>
            <CardDescription>
              Select the tone(s) for your marketing copy (optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {COPY_TONES.map((tone) => (
                <div key={tone} className="flex items-center space-x-2">
                  <Checkbox
                    id={tone}
                    checked={formData.copy_tone.includes(tone)}
                    onCheckedChange={() => handleToneToggle(tone)}
                  />
                  <Label htmlFor={tone} className="text-sm">
                    {tone}
                  </Label>
                </div>
              ))}
            </div>
            
            {formData.copy_tone.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.copy_tone.map((tone) => (
                  <Badge key={tone} variant="outline">
                    {tone}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Keywords & Focus
            </CardTitle>
            <CardDescription>
              Any specific keywords or selling points to emphasize (optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., move-in ready, great schools, walkable neighborhood, investment opportunity..."
              value={formData.keywords_to_include}
              onChange={(e) => setFormData(prev => ({ ...prev, keywords_to_include: e.target.value }))}
              rows={3}
            />
          </CardContent>
        </Card>

        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium mb-2">🎯 Pro Tip</h4>
          <p className="text-sm text-muted-foreground">
            Our AI will analyze your property details and create content that highlights 
            your property's unique selling points while matching your preferred style and tone.
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!canProceed}>
          Generate Materials
        </Button>
      </div>
    </div>
  )
}
