"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Shuffle, X, Plus } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardAdPreferencesProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const materialOptions = [
  {
    id: "facebook",
    label: "Facebook Ad",
    logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI0IDEyQzI0IDE4LjYyNzQgMTguNjI3NCAyNCAxMiAyNEM1LjM3MjU4IDI0IDAgMTguNjI3NCAwIDEyQzAgNS4zNzI1OCA1LjM3MjU4IDAgMTIgMEMxOC42Mjc0IDAgMjQgNS4zNzI1OCAyNCAxMloiIGZpbGw9IiMxODc3RjIiLz4KPHBhdGggZD0iTTE2LjY3MTIgMTUuNTg0TDE3LjIwNjMgMTIuMzM0SDE0LjA4MzNWMTAuMjI1QzE0LjA4MzMgOS4zNzUgMTQuNTIwOCA4LjU0MTY3IDE1Ljg0MzggOC41NDE2N0gxNy4zMzMzVjUuNzVDMTcuMzMzMyA1Ljc1IDE1LjY3NzEgNS40NTgzMyAxNC4wODMzIDUuNDU4MzNDMTAuNzUgNS40NTgzMyA4LjU4MzMzIDcuNDU4MzMgOC41ODMzMyAxMC43NVYxMi4zMzRINS43NVYxNS41ODRIOC41ODMzM1YyNEgxNC4wODMzVjE1LjU4NEgxNi42NzEyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+",
  },
  {
    id: "instagram",
    label: "Instagram Ad",
    logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iaW5zdGFncmFtIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzgzNEE5QiIvPgo8c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6I0Q2Mjk3NiIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkRDODAiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8cGF0aCBkPSJNMTIgMkM2LjQ3NyAyIDIgNi40NzcgMiAxMkMyIDE3LjUyMyA2LjQ3NyAyMiAxMiAyMkMxNy41MjMgMjIgMjIgMTcuNTIzIDIyIDEyQzIyIDYuNDc3IDE3LjUyMyAyIDEyIDJaIiBmaWxsPSJ1cmwoI2luc3RhZ3JhbSkiLz4KPHBhdGggZD0iTTEyIDUuODM4QzE0LjQ1OSA1LjgzOCAxNC44MTkgNS44NDggMTUuODg1IDUuODk2QzE2Ljg2NyA1Ljk0IDE3LjQwNCA2LjA4NyAxNy43NCA2LjIwNUMxOC4xOTQgNi4zNzMgMTguNTI2IDYuNTc4IDE4Ljg3MyA2LjkyNUMxOS4yMiA3LjI3MiAxOS40MjUgNy42MDQgMTkuNTkzIDguMDU4QzE5LjcxMSA4LjM5NCAxOS44NTggOC45MzEgMTkuOTAyIDkuOTEzQzE5Ljk1IDEwLjk3OSAxOS45NiAxMS4zMzkgMTkuOTYgMTMuNzk4QzE5Ljk2IDE2LjI1NyAxOS45NSAxNi42MTcgMTkuOTAyIDE3LjY4M0MxOS44NTggMTguNjY1IDE5LjcxMSAxOS4yMDIgMTkuNTkzIDE5LjUzOEMxOS40MjUgMTkuOTkyIDE5LjIyIDIwLjMyNCAxOC44NzMgMjAuNjcxQzE4LjUyNiAyMS4wMTggMTguMTk0IDIxLjIyMyAxNy43NCAyMS4zOTFDMTcuNDA0IDIxLjUwOSAxNi44NjcgMjEuNjU2IDE1Ljg4NSAyMS43QzE0LjgxOSAyMS43NDggMTQuNDU5IDIxLjc1OCAxMiAyMS43NThDOS41NDEgMjEuNzU4IDkuMTgxIDIxLjc0OCA4LjExNSAyMS43QzcuMTMzIDIxLjY1NiA2LjU5NiAyMS41MDkgNi4yNiAyMS4zOTFDNS44MDYgMjEuMjIzIDUuNDc0IDIxLjAxOCA1LjEyNyAyMC42NzFDNC43OCAyMC4zMjQgNC41NzUgMTkuOTkyIDQuNDA3IDE5LjUzOEM0LjI4OSAxOS4yMDIgNC4xNDIgMTguNjY1IDQuMDk4IDE3LjY4M0M0LjA1IDE2LjYxNyA0LjA0IDE2LjI1NyA0LjA0IDEzLjc5OEM0LjA0IDExLjMzOSA0LjA1IDEwLjk3OSA0LjA5OCA5LjkxM0M0LjE0MiA4LjkzMSA0LjI4OSA4LjM5NCA0LjQwNyA4LjA1OEM0LjU3NSA3LjYwNCA0Ljc4IDcuMjcyIDUuMTI3IDYuOTI1QzUuNDc0IDYuNTc4IDUuODA2IDYuMzczIDYuMjYgNi4yMDVDNi41OTYgNi4wODcgNy4xMzMgNS45NCA4LjExNSA1Ljg5NkM5LjE4MSA1Ljg0OCA5LjU0MSA1LjgzOCAxMiA1LjgzOFpNMTIgNC4xNjJDOS41MDQgNC4xNjIgOS4xNDQgNC4xNzIgOC4wNjcgNC4yMkM2Ljk5NCA0LjI2OCA2LjI0NyA0LjQyIDUuNjEgNC42OTdDNC45NDUgNC45ODQgNC4zODMgNS4zNzggMy45MjUgNS44MzZDMy40NjcgNi4yOTQgMy4wNzMgNi44NTYgMi43ODYgNy41MjFDMi41MDkgOC4xNTggMi4zNTcgOC45MDUgMi4zMDkgOS45NzhDMi4yNjEgMTEuMDU1IDIuMjUxIDExLjQxNSAyLjI1MSAxMi45MTFDMi4yNTEgMTQuNDA3IDIuMjYxIDE0Ljc2NyAyLjMwOSAxNS44NDRDMi4zNTcgMTYuOTE3IDIuNTA5IDE3LjY2NCAyLjc4NiAxOC4zMDFDMy4wNzMgMTguOTY2IDMuNDY3IDE5LjUyOCAzLjkyNSAxOS45ODZDNC4zODMgMjAuNDQ0IDQuOTQ1IDIwLjgzOCA1LjYxIDIxLjEyNUM2LjI0NyAyMS40MDIgNi45OTQgMjEuNTU0IDguMDY3IDIxLjYwMkM5LjE0NCAyMS42NSA5LjUwNCAyMS42NiAxMiAyMS42NkMxNC40OTYgMjEuNjYgMTQuODU2IDIxLjY1IDE1LjkzMyAyMS42MDJDMTcuMDA2IDIxLjU1NCAxNy43NTMgMjEuNDAyIDE4LjM5IDIxLjEyNUMxOS4wNTUgMjAuODM4IDE5LjYxNyAyMC40NDQgMjAuMDc1IDE5Ljk4NkMyMC41MzMgMTkuNTI4IDIwLjkyNyAxOC45NjYgMjEuMjE0IDE4LjMwMUMyMS40OTEgMTcuNjY0IDIxLjY0MyAxNi45MTcgMjEuNjkxIDE1Ljg0NEMyMS43MzkgMTQuNzY3IDIxLjc0OSAxNC40MDcgMjEuNzQ5IDEyLjkxMUMyMS43NDkgMTEuNDE1IDIxLjczOSAxMS4wNTUgMjEuNjkxIDkuOTc4QzIxLjY0MyA4LjkwNSAyMS40OTEgOC4xNTggMjEuMjE0IDcuNTIxQzIwLjkyNyA2Ljg1NiAyMC41MzMgNi4yOTQgMjAuMDc1IDUuODM2QzE5LjYxNyA1LjM3OCAxOS4wNTUgNC45ODQgMTguMzkgNC42OTdDMTcuNzUzIDQuNDIgMTcuMDA2IDQuMjY4IDE1LjkzMyA0LjIyQzE0Ljg1NiA0LjE3MiAxNC40OTYgNC4xNjIgMTIgNC4xNjJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgNy44MzhDOS4yNjQgNy44MzggNy4wMzggMTAuMDY0IDcuMDM4IDEyLjhDNy4wMzggMTUuNTM2IDkuMjY0IDE3Ljc2MiAxMiAxNy43NjJDMTQuNzM2IDE3Ljc2MiAxNi45NjIgMTUuNTM2IDE2Ljk2MiAxMi44QzE2Ljk2MiAxMC4wNjQgMTQuNzM2IDcuODM4IDEyIDcuODM4Wk0xMiAxNi4wODZDMTAuMTg5IDE2LjA4NiA4LjcxNCAxNC42MTEgOC43MTQgMTIuOEM4LjcxNCAxMC45ODkgMTAuMTg5IDkuNTE0IDEyIDkuNTE0QzEzLjgxMSA5LjUxNCAxNS4yODYgMTAuOTg5IDE1LjI4NiAxMi44QzE1LjI4NiAxNC42MTEgMTMuODExIDE2LjA4NiAxMiAxNi4wODZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTcuMjA2IDkuMDM0QzE3LjY3NyA5LjAzNCAxOC4wNTkgOC42NTIgMTguMDU5IDguMTgxQzE4LjA1OSA3LjcxIDE3LjY3NyA3LjMyOCAxNy4yMDYgNy4zMjhDMTYuNzM1IDcuMzI4IDE2LjM1MyA3LjcxIDE2LjM1MyA4LjE4MUMxNi4zNTMgOC42NTIgMTYuNzM1IDkuMDM0IDE3LjIwNiA5LjAzNFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==",
  },
  {
    id: "google",
    label: "Google Display Ad",
    logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIyLjU2IDEyLjI1QzIyLjU2IDExLjQ3IDIyLjQ5IDEwLjcyIDIyLjM2IDEwSDE2VjE0LjI2SDIwLjkyQzIwLjY2IDE1LjYgMTkuOTIgMTYuNzQgMTguNzQgMTcuNDhWMjAuNThIMjAuNzJDMjEuNjEgMTguNzMgMjIuNTYgMTUuNzMgMjIuNTYgMTIuMjVaIiBmaWxsPSIjNDI4NUY0Ii8+CjxwYXRoIGQ9Ik0xNiAyNEMxOS40MyAyNCAyMi4yNSAyMi45MiAyMi4yNSAyMC41OEgyMC4yN0MxOS41MyAyMS4zIDE4LjUgMjEuNzUgMTYgMjEuNzVDMTMuMjQgMjEuNzUgMTAuOTEgMTkuNjkgMTAuMDcgMTYuOTZINy45NlYyMC4wOUM5LjY5IDIzLjUzIDEyLjYxIDI0IDE2IDI0WiIgZmlsbD0iIzM0QTg1MyIvPgo8cGF0aCBkPSJNMTAuMDcgMTYuOTZDOS42NyAxNS42NiA5LjY3IDEyLjM0IDEwLjA3IDExLjA0VjcuOTFINy45NkM2LjY5IDEwLjQ1IDYuNjkgMTMuNTUgNy45NiAxNi4wOUwxMC4wNyAxNi45NloiIGZpbGw9IiNGQkJDMDQiLz4KPHBhdGggZD0iTTE2IDIuMjVDMTguNSAyLjI1IDE5LjUzIDMuMzEgMjAuMjcgNC4wNEwyMi4yNSAyLjA2QzIwLjI1IDAuMTkgMTcuNDMgLTAuNzUgMTYgLTAuNzVDMTIuNjEgLTAuNzUgOS42OSAwLjQ3IDcuOTYgMy45MUwxMC4wNyA3LjA0QzEwLjkxIDQuMzEgMTMuMjQgMi4yNSAxNiAyLjI1WiIgZmlsbD0iI0VBNDMzNSIvPgo8L3N2Zz4K",
  },
  {
    id: "pdf",
    label: "PDF Brochure",
    logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggMkM2Ljg5NTQzIDIgNiAyLjg5NTQzIDYgNFYyMEM2IDIxLjEwNDYgNi44OTU0MyAyMiA4IDIySDE2QzE3LjEwNDYgMjIgMTggMjEuMTA0NiAxOCAyMFY4TDE0IDJIOFoiIGZpbGw9IiNEQzI2MjYiLz4KPHBhdGggZD0iTTE0IDJWOEgxOCIgZmlsbD0iI0Y4NzE3MSIvPgo8cGF0aCBkPSJNOSAxNEgxNSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTkgMTdIMTMiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik05IDExSDEyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K",
  },
]

const styleOptions = [
  {
    id: "luxury",
    label: "Luxury Style",
    description: "Elegant, sophisticated, premium feel",
    image: "/placeholder.svg?height=120&width=200&text=Luxury+Style",
  },
  {
    id: "family",
    label: "Family Friendly",
    description: "Warm, welcoming, community-focused",
    image: "/placeholder.svg?height=120&width=200&text=Family+Friendly",
  },
  {
    id: "investor",
    label: "Investor-Focused",
    description: "Data-driven, ROI-focused, analytical",
    image: "/placeholder.svg?height=120&width=200&text=Investor+Focused",
  },
]

const toneOptions = [
  {
    value: "Professional",
    label: "Professional",
    description: "Formal, authoritative, and business-focused language",
  },
  {
    value: "Casual",
    label: "Casual",
    description: "Relaxed, conversational, and approachable tone",
  },
  {
    value: "Luxury",
    label: "Luxury",
    description: "Sophisticated, exclusive, and premium positioning",
  },
  {
    value: "Friendly",
    label: "Friendly",
    description: "Warm, welcoming, and personable communication",
  },
  {
    value: "Urgent",
    label: "Urgent",
    description: "Creates urgency and encourages immediate action",
  },
  {
    value: "Minimal",
    label: "Minimal",
    description: "Clean, concise, and straightforward messaging",
  },
]

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
    const allStyles = [
      ...styleOptions,
      {
        id: "minimalist",
        label: "Minimalist",
        description: "Clean, simple, uncluttered design",
        image: "/placeholder.svg?height=120&width=200&text=Minimalist",
      },
      {
        id: "rustic",
        label: "Rustic Charm",
        description: "Cozy, natural, countryside appeal",
        image: "/placeholder.svg?height=120&width=200&text=Rustic+Charm",
      },
      {
        id: "contemporary",
        label: "Contemporary",
        description: "Current trends, fresh, stylish",
        image: "/placeholder.svg?height=120&width=200&text=Contemporary",
      },
    ]
    const shuffled = allStyles.sort(() => Math.random() - 0.5).slice(0, 3)
    setCurrentStyles(shuffled)
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
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <div className="text-sm font-medium text-blue-600 mb-2">Phase 2 of 2: Advertising Preferences</div>
        <h2 className="text-3xl font-bold mb-4">Customize Your Marketing Materials</h2>
        <p className="text-lg text-muted-foreground">Choose what materials to create and how you want them styled</p>
      </div>

      {/* Materials to Generate */}
      <Card>
        <CardHeader>
          <CardTitle>Materials to Generate</CardTitle>
          <p className="text-sm text-muted-foreground">Select which marketing materials you'd like us to create</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {materialOptions.map((material) => (
              <Card
                key={material.id}
                className={`cursor-pointer transition-all ${
                  data.materials_to_generate.includes(material.id)
                    ? "ring-2 ring-blue-500 bg-blue-50"
                    : "hover:shadow-md"
                }`}
                onClick={() => handleMaterialChange(material.id, !data.materials_to_generate.includes(material.id))}
              >
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <img src={material.logo || "/placeholder.svg"} alt={material.label} className="w-8 h-8 mb-3" />
                  <Checkbox
                    checked={data.materials_to_generate.includes(material.id)}
                    onChange={() => {}}
                    className="mb-2"
                  />
                  <Label className="text-sm font-medium cursor-pointer">{material.label}</Label>
                </CardContent>
              </Card>
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
          <p className="text-sm text-muted-foreground">Choose the visual style for your marketing materials</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentStyles.map((style) => (
              <Card
                key={style.id}
                className={`cursor-pointer transition-all ${
                  data.creative_style === style.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
                }`}
                onClick={() => handleStyleSelect(style.id)}
              >
                <CardContent className="p-4">
                  <img
                    src={style.image || "/placeholder.svg"}
                    alt={style.label}
                    className="w-full h-24 object-cover rounded mb-3"
                  />
                  <div className="text-center space-y-2">
                    <h3 className="font-medium">{style.label}</h3>
                    <p className="text-xs text-muted-foreground">{style.description}</p>
                    <Button
                      variant={data.creative_style === style.id ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                    >
                      {data.creative_style === style.id ? "Selected" : "Select"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6">
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
          <p className="text-sm text-muted-foreground">
            These settings will determine the tone and style of all marketing copy generated for your campaign. You can
            always adjust these later during the review process.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">Tone (select multiple)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {toneOptions.map((tone) => (
                <Card
                  key={tone.value}
                  className={`cursor-pointer transition-all ${
                    data.copy_tone.includes(tone.value) ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-sm"
                  }`}
                  onClick={() => handleToneChange(tone.value, !data.copy_tone.includes(tone.value))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox checked={data.copy_tone.includes(tone.value)} onChange={() => {}} className="mt-1" />
                      <div className="flex-1">
                        <Label className="font-medium cursor-pointer">{tone.label}</Label>
                        <p className="text-xs text-muted-foreground mt-1">{tone.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
            <div className="flex flex-wrap gap-2 mt-3">
              {data.copy_tone
                .filter((tone) => !toneOptions.some((t) => t.value === tone))
                .map((tone) => (
                  <Badge key={tone} variant="secondary" className="flex items-center gap-1">
                    {tone}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        removeTonePreference(tone)
                      }}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
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
      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={onPrevious} size="lg">
          Previous
        </Button>
        <Button onClick={onNext} disabled={!isFormValid()} size="lg">
          Generate Materials
        </Button>
      </div>
    </div>
  )
}
