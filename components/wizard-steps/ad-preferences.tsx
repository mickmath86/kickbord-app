"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, MessageSquare, FileText } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardAdPreferencesProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const materialOptions = [
  { id: "social_media", label: "Social Media Posts", description: "Facebook & Instagram ready posts" },
  { id: "landing_page", label: "Landing Page", description: "Dedicated property website" },
  { id: "print_flyer", label: "Print Flyer", description: "Professional PDF flyer" },
  { id: "email_template", label: "Email Template", description: "Email marketing template" },
]

const creativeStyles = [
  { id: "modern", label: "Modern", description: "Clean, minimalist design with bold typography" },
  { id: "luxury", label: "Luxury", description: "Elegant, sophisticated with premium feel" },
  { id: "classic", label: "Classic", description: "Traditional, timeless design approach" },
  { id: "vibrant", label: "Vibrant", description: "Colorful, energetic with dynamic elements" },
]

const copyTones = [
  {
    id: "professional",
    label: "Professional",
    description: "Formal, authoritative tone that builds trust and credibility",
  },
  {
    id: "friendly",
    label: "Friendly",
    description: "Warm, approachable tone that feels personal and welcoming",
  },
  {
    id: "luxury",
    label: "Luxury",
    description: "Sophisticated, exclusive tone for high-end properties",
  },
  {
    id: "urgent",
    label: "Urgent",
    description: "Creates urgency and encourages quick action from buyers",
  },
]

// Platform logos as SVG components
const FacebookLogo = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const InstagramLogo = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="url(#instagram-gradient)">
    <defs>
      <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#833AB4" />
        <stop offset="50%" stopColor="#FD1D1D" />
        <stop offset="100%" stopColor="#FCB045" />
      </linearGradient>
    </defs>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const GoogleLogo = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

const PDFLogo = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#FF0000">
    <path d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.018.29.018.411 0 .668-.214.668-.618 0-.33-.213-.614-.586-.614zm2.274-2.882c-.198 0-.33.018-.407.036v2.61c.077.018.201.018.313.018.77 0 1.24-.375 1.24-1.364 0-.835-.396-1.3-1.146-1.3zM19.394 3.006H4.606c-.871 0-1.578.707-1.578 1.578v14.832c0 .871.707 1.578 1.578 1.578h14.788c.871 0 1.578-.707 1.578-1.578V4.584c0-.871-.707-1.578-1.578-1.578zm-7.887 8.195c0 1.104-.471 1.736-1.32 1.736-.18 0-.308-.018-.411-.054v1.617H8.822V9.712c.193-.036.471-.072.798-.072.849 0 1.287.504 1.287 1.361zm3.146 1.682c0 1.177-.543 1.827-1.578 1.827-.18 0-.36-.018-.54-.054V9.712c.216-.036.471-.072.828-.072 1.287 0 1.29.828 1.29 1.973zm2.274-1.682c0 .504-.108.9-.324 1.188-.216.288-.54.432-.936.432-.18 0-.324-.018-.432-.036v1.617h-.954V9.712c.216-.036.504-.072.9-.072.396 0 .72.108.936.324.216.216.324.504.324.936z" />
  </svg>
)

export function WizardAdPreferences({ onNext, onPrevious, isFirstStep }: WizardAdPreferencesProps) {
  const { data, updateData } = useCampaignData()

  // Load saved preferences on mount
  useEffect(() => {
    const savedStyle = localStorage.getItem("preferred_creative_style")
    const savedTone = localStorage.getItem("preferred_copy_tone")

    if (savedStyle && !data.creative_style) {
      updateData({ creative_style: savedStyle })
    }

    if (savedTone && data.copy_tone.length === 0) {
      updateData({ copy_tone: [savedTone] })
    }
  }, [])

  const handleMaterialChange = (materialId: string, checked: boolean) => {
    const updatedMaterials = checked
      ? [...data.materials_to_generate, materialId]
      : data.materials_to_generate.filter((m) => m !== materialId)
    updateData({ materials_to_generate: updatedMaterials })
  }

  const handleStyleChange = (style: string) => {
    updateData({ creative_style: style })
  }

  const handleSaveStyleChange = (checked: boolean) => {
    updateData({ save_style: checked })
    if (checked && data.creative_style) {
      localStorage.setItem("preferred_creative_style", data.creative_style)
    } else {
      localStorage.removeItem("preferred_creative_style")
    }
  }

  const handleToneChange = (tone: string, checked: boolean) => {
    const updatedTones = checked
      ? [tone] // Only allow one tone selection
      : []
    updateData({ copy_tone: updatedTones })
  }

  const handleSaveToneChange = (checked: boolean) => {
    updateData({ save_tone_default: checked })
    if (checked && data.copy_tone.length > 0) {
      localStorage.setItem("preferred_copy_tone", data.copy_tone[0])
    } else {
      localStorage.removeItem("preferred_copy_tone")
    }
  }

  const isFormValid = () => {
    return data.materials_to_generate.length > 0 && data.creative_style && data.copy_tone.length > 0
  }

  const getPlatformLogo = (materialId: string) => {
    switch (materialId) {
      case "social_media":
        return (
          <div className="flex gap-1">
            <FacebookLogo />
            <InstagramLogo />
          </div>
        )
      case "landing_page":
        return <GoogleLogo />
      case "print_flyer":
        return <PDFLogo />
      default:
        return <FileText className="w-6 h-6 text-gray-400" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Palette className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Marketing Preferences</h2>
        <p className="text-lg text-muted-foreground">
          Choose what marketing materials to generate and set your style preferences
        </p>
      </div>

      {/* Materials to Generate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Marketing Materials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {materialOptions.map((material) => (
              <div
                key={material.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  data.materials_to_generate.includes(material.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleMaterialChange(material.id, !data.materials_to_generate.includes(material.id))}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={data.materials_to_generate.includes(material.id)}
                    onChange={() => {}}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getPlatformLogo(material.id)}
                      <h3 className="font-medium">{material.label}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{material.description}</p>
                  </div>
                </div>
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
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {creativeStyles.map((style) => (
              <div
                key={style.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  data.creative_style === style.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleStyleChange(style.id)}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="creative_style"
                    checked={data.creative_style === style.id}
                    onChange={() => {}}
                    className="mt-1"
                  />
                  <div>
                    <h3 className="font-medium mb-1">{style.label}</h3>
                    <p className="text-sm text-muted-foreground">{style.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="save-style" checked={data.save_style} onCheckedChange={handleSaveStyleChange} />
            <Label htmlFor="save-style" className="text-sm">
              Save this style for future campaigns
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Copy Tone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Copy Tone & Voice
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            This sets the tone and voice for all your marketing copy. You can adjust this later during the review
            process.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {copyTones.map((tone) => (
              <div
                key={tone.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  data.copy_tone.includes(tone.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleToneChange(tone.id, !data.copy_tone.includes(tone.id))}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="copy_tone"
                    checked={data.copy_tone.includes(tone.id)}
                    onChange={() => {}}
                    className="mt-1"
                  />
                  <div>
                    <h3 className="font-medium mb-1">{tone.label}</h3>
                    <p className="text-sm text-muted-foreground">{tone.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="save-tone" checked={data.save_tone_default} onCheckedChange={handleSaveToneChange} />
            <Label htmlFor="save-tone" className="text-sm">
              Save these tone preferences for future campaigns
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={onPrevious} disabled={isFirstStep} size="lg">
          Previous
        </Button>
        <Button onClick={onNext} disabled={!isFormValid()} size="lg">
          Generate Marketing Materials
        </Button>
      </div>
    </div>
  )
}
