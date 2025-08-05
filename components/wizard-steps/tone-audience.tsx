"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CampaignData } from "@/components/campaign-wizard"
import { Crown, Users, TrendingUp, Home, Building, Briefcase } from "lucide-react"

interface WizardToneAudienceProps {
  data: CampaignData
  updateData: (updates: Partial<CampaignData>) => void
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const toneOptions = [
  {
    id: "luxury",
    title: "Luxury",
    description: "Sophisticated, premium, exclusive language",
    icon: Crown,
    color: "bg-purple-100 text-purple-800",
    example: "Exquisite craftsmanship meets modern elegance in this stunning estate...",
  },
  {
    id: "first-time-buyer",
    title: "First-Time Buyer",
    description: "Friendly, approachable, educational tone",
    icon: Home,
    color: "bg-green-100 text-green-800",
    example: "Your dream home awaits! This move-in ready gem is perfect for starting your homeownership journey...",
  },
  {
    id: "investor-focused",
    title: "Investor-Focused",
    description: "Data-driven, ROI-focused, analytical",
    icon: TrendingUp,
    color: "bg-blue-100 text-blue-800",
    example: "Strong cash flow opportunity in high-growth market. Cap rate 6.2%, excellent rental demand...",
  },
  {
    id: "family-oriented",
    title: "Family-Oriented",
    description: "Warm, community-focused, lifestyle-driven",
    icon: Users,
    color: "bg-orange-100 text-orange-800",
    example: "Create lasting memories in this family-friendly neighborhood with top-rated schools nearby...",
  },
  {
    id: "urban-professional",
    title: "Urban Professional",
    description: "Modern, efficient, lifestyle-focused",
    icon: Building,
    color: "bg-indigo-100 text-indigo-800",
    example: "Sleek urban living meets convenience. Walk to work, dine, and play in the heart of the city...",
  },
  {
    id: "commercial",
    title: "Commercial",
    description: "Professional, business-focused, opportunity-driven",
    icon: Briefcase,
    color: "bg-gray-100 text-gray-800",
    example: "Prime commercial opportunity in high-traffic location. Excellent visibility and growth potential...",
  },
]

export function WizardToneAudience({ data, updateData, onNext, onPrevious }: WizardToneAudienceProps) {
  const selectedTone = toneOptions.find((tone) => tone.id === data.tone)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Tone & Audience</h2>
        <p className="text-muted-foreground">
          Choose the tone that best matches your target audience and marketing style
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {toneOptions.map((tone) => {
          const Icon = tone.icon
          const isSelected = data.tone === tone.id

          return (
            <Card
              key={tone.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-blue-600 bg-blue-50" : ""
              }`}
              onClick={() => updateData({ tone: tone.id })}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${tone.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-lg">{tone.title}</CardTitle>
                  </div>
                  {isSelected && <Badge className="bg-blue-600">Selected</Badge>}
                </div>
                <CardDescription>{tone.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground italic">"{tone.example}"</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedTone && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Selected Tone: {selectedTone.title}</h3>
          <p className="text-blue-800 text-sm">
            Your marketing materials will use {selectedTone.description.toLowerCase()} to appeal to your target
            audience.
          </p>
        </div>
      )}

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={onNext} disabled={!data.tone} className="bg-blue-600 hover:bg-blue-700">
          Next: Media Upload
        </Button>
      </div>
    </div>
  )
}
