"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, DownloadCloud, CheckCircle } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardFinalPreviewProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const materialIcons = {
  facebook: "📘",
  instagram: "📷",
  google: "🌐",
  pdf: "📄",
  landing: "🏠",
}

export function WizardFinalPreview({ onPrevious, onClose }: WizardFinalPreviewProps) {
  const { data } = useCampaignData()

  const handleDownloadAll = () => {
    // In a real app, this would generate and download a zip file
    console.log("Downloading all materials...")
  }

  const handleDownloadMaterial = (materialType: string) => {
    // In a real app, this would download the specific material
    console.log(`Downloading ${materialType} material...`)
  }

  const handleLaunchCampaign = () => {
    // In a real app, this would save the campaign and launch it
    console.log("Launching campaign...")
    onClose()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Your Campaign is Ready!</h2>
        <p className="text-lg text-muted-foreground">
          Your marketing materials have been generated and are ready to launch
        </p>
      </div>

      {/* Selected Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Selected Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {data.materials_to_generate.map((material) => (
              <Badge key={material} variant="secondary" className="px-3 py-2">
                <span className="mr-2">{materialIcons[material as keyof typeof materialIcons]}</span>
                {material.charAt(0).toUpperCase() + material.slice(1)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Marketing Materials */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Marketing Materials</CardTitle>
            <Button onClick={handleDownloadAll} variant="outline">
              <DownloadCloud className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.materials_to_generate.map((material) => (
              <Card key={material} className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{materialIcons[material as keyof typeof materialIcons]}</span>
                      <h3 className="font-medium">{material.charAt(0).toUpperCase() + material.slice(1)} Ad</h3>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleDownloadMaterial(material)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="bg-gray-100 rounded-lg p-4 mb-3">
                    <div className="text-center text-gray-500 text-sm">{material.toUpperCase()} Creative Preview</div>
                    <div className="mt-2 text-xs text-gray-400">Final creative will be generated here</div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Ready for {material === "pdf" ? "print" : "digital"} distribution
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Property Details</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <strong>Address:</strong> {data.address}
                </p>
                <p>
                  <strong>Type:</strong> {data.property_type}
                </p>
                <p>
                  <strong>Price:</strong> ${data.price?.toLocaleString()}
                </p>
                <p>
                  <strong>Size:</strong> {data.bedrooms} bed, {data.bathrooms} bath, {data.square_feet} sq ft
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Marketing Preferences</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <strong>Style:</strong> {data.creative_style}
                </p>
                <p>
                  <strong>Tone:</strong> {data.copy_tone.join(", ")}
                </p>
                <p>
                  <strong>Materials:</strong> {data.materials_to_generate.length} types
                </p>
                <p>
                  <strong>Photos:</strong> {data.photos.length} uploaded
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={onPrevious} size="lg">
          Previous
        </Button>
        <Button onClick={handleLaunchCampaign} size="lg" className="bg-green-600 hover:bg-green-700">
          Launch Campaign
        </Button>
      </div>
    </div>
  )
}
