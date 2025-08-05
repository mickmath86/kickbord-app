"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Shuffle, X, Plus } from "lucide-react"
import { useCampaignData } from "@/components/campaign-wizard"

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
  { id: "landing", label: "Landing Page" },
]

const styleOptions = [
  { id: "luxury", label: "Luxury Style", image: "/placeholder.svg?height=120&width=200&text=Luxury+Style" },
  { id: "family", label: "Family Friendly", image: "/placeholder.svg?height=120&width=200&text=Family+Friendly" },
  { id: "investor", label: "Investor-Focused", image: "/placeholder.svg?height=120&width=200&text=Investor+Focused" },
]

const toneOptions = ["Professional", "Casual", "Luxury", "Friendly", "Urgent", "Minimal"]

export function WizardAdPreferences({ onNext, onPrevious }: WizardAdPreferencesProps) {
  const { data, updateData } = useCampaignData()
  const [currentStyles, setCurrentStyles] = useState(styleOptions)
  const [newTonePreference, setNewTonePreference] = useState("")

  const handleMaterialChange = (materialId: string, checked: boolean) => {
    const updatedMaterials = checked
      ? [...data.materials_to_generate, materialId]
      : data.materials_to_generate.filter((m) => m !== materialId)
    updateData({ materials_to_generate: updatedMaterials })
  }

  const handleStyleSelect = (styleId: string) => {
    updateData({ creative_style: styleId })
  }

  const randomizeStyles = () => {
    // In a real app, this would fetch new styles from an API
    const shuffledStyles = [...currentStyles].sort(() => Math.random() - 0.5)
    setCurrentStyles(shuffledStyles)
  }

  const handleToneChange = (tone: string, checked: boolean) => {
    const updatedTones = checked ? [...data.copy_tone, tone] : data.copy_tone.filter((t) => t !== tone)
    updateData({ copy_tone: updatedTones })
  }

  const addTonePreference = () => {
    if (newTonePreference.trim() && !data.copy_tone.includes(newTonePreference.trim())) {
      updateData({ copy_tone: [...data.copy_tone, newTonePreference.trim()] })
      setNewTonePreference("")
    }
  }

  const removeTonePreference = (tone: string) => {
    updateData({ copy_tone: data.copy_tone.filter((t) => t !== tone) })
  }

  const isFormValid = () => {
    return data.materials_to_generate.length > 0 && data.creative_style && data.copy_tone.length > 0
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-6">
        <div className="text-sm font-medium text-blue-600 mb-2">Phase 2 of 2: Advertising Preferences</div>
        <h2 className="text-2xl font-bold mb-2">Customize Your Marketing Materials</h2>
        <p className="text-muted-foreground">Choose what materials to create and how you want them styled</p>
      </div>

      {/* Materials to Generate */}
      <Card>
        <CardHeader>
          <CardTitle>Materials to Generate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {materialOptions.map((material) => (
              <div key={material.id} className="flex items-center space-x-2">
                <Checkbox
                  id={material.id}
                  checked={data.materials_to_generate.includes(material.id)}
                  onCheckedChange={(checked) => handleMaterialChange(material.id, checked as boolean)}
                />
                <Label htmlFor={material.id} className="text-sm">
                  {material.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Creative Style */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Creative Style
            <Button variant="outline" size="sm" onClick={randomizeStyles}>
              <Shuffle className="h-4 w-4 mr-2" />
              Randomize
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentStyles.map((style) => (
              <div
                key={style.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  data.creative_style === style.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleStyleSelect(style.id)}
              >
                <img
                  src={style.image || "/placeholder.svg"}
                  alt={style.label}
                  className="w-full h-24 object-cover rounded mb-3"
                />
                <div className="text-center">
                  <h3 className="font-medium">{style.label}</h3>
                  <Button variant={data.creative_style === style.id ? "default" : "outline"} size="sm" className="mt-2">
                    {data.creative_style === style.id ? "Selected" : "Select"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="save-style"
                checked={data.save_style}
                onCheckedChange={(checked) => updateData({ save_style: checked as boolean })}
              />
              <Label htmlFor="save-style" className="text-sm">
                Save this style for future campaigns
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Copy Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Copy Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium">Tone</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {toneOptions.map((tone) => (
                <div key={tone} className="flex items-center space-x-2">
                  <Checkbox
                    id={tone}
                    checked={data.copy_tone.includes(tone)}
                    onCheckedChange={(checked) => handleToneChange(tone, checked as boolean)}
                  />
                  <Label htmlFor={tone} className="text-sm">
                    {tone}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Additional Tone Preferences</Label>
            <p className="text-sm text-muted-foreground mb-2">Add custom tone preferences for your copy</p>
            <div className="flex gap-2">
              <Input
                placeholder="Add tone preference"
                value={newTonePreference}
                onChange={(e) => setNewTonePreference(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTonePreference()}
              />
              <Button type="button" onClick={addTonePreference} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.copy_tone
                .filter((tone) => !toneOptions.includes(tone))
                .map((tone) => (
                  <Badge key={tone} variant="secondary" className="flex items-center gap-1">
                    {tone}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTonePreference(tone)} />
                  </Badge>
                ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="save-tone"
              checked={data.save_tone_default}
              onCheckedChange={(checked) => updateData({ save_tone_default: checked as boolean })}
            />
            <Label htmlFor="save-tone" className="text-sm">
              Save these tone preferences as my default
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={onNext} disabled={!isFormValid()}>
          Generate Materials
        </Button>
      </div>
    </div>
  )
}
