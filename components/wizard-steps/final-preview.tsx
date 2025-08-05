"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Facebook, Instagram, FileText, Globe, Loader2, Download, DownloadIcon } from "lucide-react"
import { useCampaignData } from "@/components/campaign-wizard"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

interface WizardFinalPreviewProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardFinalPreview({ onPrevious, onClose }: WizardFinalPreviewProps) {
  const { data } = useCampaignData()
  const [isLaunching, setIsLaunching] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const router = useRouter()

  const launchCampaign = async () => {
    setIsLaunching(true)

    try {
      const supabase = createClient()

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error("User not authenticated")
      }

      // Save campaign to database
      const { data: campaign, error: campaignError } = await supabase
        .from("campaigns")
        .insert({
          user_id: user.id,
          property_address: data.address,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          square_feet: data.square_feet,
          price: data.price,
          property_type: data.property_type,
          year_built: data.year_built,
          lot_size: data.lot_size,
          features: data.key_features,
          keywords: data.keywords,
          neighborhood_info: data.additional_notes,
          tone: data.copy_tone.join(", "),
          media_urls: data.photos,
          generated_copy: data.generated_copy,
          status: "completed",
        })
        .select()
        .single()

      if (campaignError) {
        throw campaignError
      }

      setIsComplete(true)

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard/campaigns/listings")
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Error launching campaign:", error)
      alert("Failed to launch campaign. Please try again.")
    } finally {
      setIsLaunching(false)
    }
  }

  const downloadAll = () => {
    // In a real app, this would generate and download a zip file
    alert("Downloading all marketing materials...")
  }

  const downloadMaterial = (material: string) => {
    // In a real app, this would download the specific material
    alert(`Downloading ${material} creative...`)
  }

  if (isComplete) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-96">
        <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Campaign Launched Successfully!</h2>
        <p className="text-muted-foreground text-center mb-6">
          Your listing campaign is now live and ready to generate leads.
        </p>
        <div className="text-sm text-muted-foreground">Redirecting to campaigns...</div>
      </div>
    )
  }

  const materialIcons: Record<string, any> = {
    facebook: Facebook,
    instagram: Instagram,
    google: Globe,
    pdf: FileText,
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Your Campaign is Ready!</h2>
        <p className="text-muted-foreground">Review your campaign preview and launch when ready</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Selected Copy Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Selected Ad Copy</CardTitle>
            <CardDescription>Your chosen copy variations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.selected_copy &&
              Object.entries(data.selected_copy).map(([copyType, optionIndex]) => {
                const copyData = data.generated_copy?.[copyType]?.[optionIndex as number]
                if (!copyData) return null

                return (
                  <div key={copyType} className="border-l-2 border-blue-600 pl-3">
                    <p className="text-sm font-medium text-blue-600 capitalize mb-1">
                      {copyType.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    {copyType === "amenities" ? (
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        {copyData.map((amenity: string, i: number) => (
                          <li key={i}>{amenity}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">{copyData}</p>
                    )}
                  </div>
                )
              })}
          </CardContent>
        </Card>

        {/* Campaign Details */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>Property and targeting information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium">{data.address}</p>
              <p className="text-sm text-muted-foreground">{data.property_type}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Price</p>
                <p className="font-medium">${data.price?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Style</p>
                <p className="font-medium capitalize">{data.creative_style}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tone</p>
              <div className="flex flex-wrap gap-1">
                {data.copy_tone.map((tone) => (
                  <Badge key={tone} variant="secondary" className="text-xs">
                    {tone}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Channels */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Selected Channels</CardTitle>
            <CardDescription>Where your campaign will be deployed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {data.materials_to_generate.map((material) => {
                const Icon = materialIcons[material] || FileText

                return (
                  <div key={material} className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                    <Icon className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium capitalize">
                      {material === "pdf" ? "PDF Brochure" : `${material} Ads`}
                    </span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Marketing Materials */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Marketing Materials</CardTitle>
                <CardDescription>Generated assets ready for deployment</CardDescription>
              </div>
              <Button onClick={downloadAll} variant="outline" className="flex items-center space-x-2 bg-transparent">
                <Download className="h-4 w-4" />
                <span>Download All</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.materials_to_generate.map((material) => {
                const Icon = materialIcons[material] || FileText

                return (
                  <div key={material} className="text-center p-4 border rounded-lg">
                    <Icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <p className="font-medium capitalize mb-2">
                      {material === "pdf" ? "PDF Brochure" : `${material} Ad`}
                    </p>
                    <Badge className="bg-green-100 text-green-800 mb-3">Ready</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => downloadMaterial(material)}
                    >
                      <DownloadIcon className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Landing Page Preview */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Landing Page Preview</CardTitle>
            <CardDescription>Your property's dedicated landing page</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="w-full h-32 bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
                <div className="text-center">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">Landing Page Preview</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional landing page with lead capture form and property details
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={launchCampaign} disabled={isLaunching} className="bg-green-600 hover:bg-green-700" size="lg">
          {isLaunching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Launching Campaign...
            </>
          ) : (
            "Launch Campaign"
          )}
        </Button>
      </div>
    </div>
  )
}
