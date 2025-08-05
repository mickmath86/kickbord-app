"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, CheckCircle, Share2, FileText, MessageSquare, Globe, Mail } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardFinalPreviewProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const materialIcons = {
  social_media: MessageSquare,
  landing_page: Globe,
  email_template: Mail,
  print_flyer: FileText,
}

const materialLabels = {
  social_media: "Social Media Posts",
  landing_page: "Landing Page",
  email_template: "Email Template",
  print_flyer: "Print Flyer",
}

export function WizardFinalPreview({ onPrevious, onClose, isFirstStep }: WizardFinalPreviewProps) {
  const { data } = useCampaignData()

  const handleDownloadAll = () => {
    // Implementation for downloading all materials
    console.log("Downloading all materials...")
  }

  const handleDownloadMaterial = (material: string) => {
    // Implementation for downloading specific material
    console.log(`Downloading ${material}...`)
  }

  const handleSaveCampaign = () => {
    // Implementation for saving campaign
    console.log("Saving campaign...")
    onClose()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Campaign Complete!</h2>
        <p className="text-lg text-muted-foreground">Your marketing materials are ready for {data.address}</p>
      </div>

      {/* Selected Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Selected Marketing Channels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.materials_to_generate.map((material) => (
              <Badge key={material} variant="secondary" className="px-3 py-1">
                {materialLabels[material as keyof typeof materialLabels]}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generated Materials */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Generated Marketing Materials</CardTitle>
            <Button onClick={handleDownloadAll} className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Download All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.materials_to_generate.map((material) => {
              const Icon = materialIcons[material as keyof typeof materialIcons]
              const label = materialLabels[material as keyof typeof materialLabels]

              return (
                <div key={material} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{label}</h3>
                        <p className="text-sm text-muted-foreground">Ready to use</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleDownloadMaterial(material)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Property Details</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{data.address}</p>
                <p>
                  {data.bedrooms}BR • {data.bathrooms}BA • {data.square_feet?.toLocaleString()} sq ft
                </p>
                <p>${data.price?.toLocaleString()}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Style & Tone</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Creative Style: {data.creative_style}</p>
                <p>Copy Tone: {data.copy_tone.join(", ")}</p>
                <p>Materials: {data.materials_to_generate.length} types</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={onPrevious} disabled={isFirstStep} size="lg">
          Previous
        </Button>
        <Button onClick={handleSaveCampaign} size="lg" className="bg-green-600 hover:bg-green-700">
          Save Campaign
        </Button>
      </div>
    </div>
  )
}
