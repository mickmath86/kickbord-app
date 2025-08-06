"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, Share2, Mail, FileText, Printer, Home } from 'lucide-react'
import { useCampaignData } from "@/app/dashboard/campaigns/create/context"

interface WizardFinalPreviewProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardFinalPreview({ onPrevious, onClose }: WizardFinalPreviewProps) {
  const { data } = useCampaignData()

  const handleCreateCampaign = () => {
    // Here you would typically save the campaign to your database
    console.log("Creating campaign with data:", data)
    onClose()
  }

  const formatPrice = (price: number | null) => {
    if (!price) return "Not specified"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <h2 className="text-2xl font-bold">Campaign Ready!</h2>
        </div>
        <p className="text-muted-foreground">
          Your marketing campaign has been created successfully. Review the summary below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Property Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Property Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Address</h4>
              <p>{data.address || "Not specified"}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Property Type</h4>
                <p>{data.property_type || "Not specified"}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Price</h4>
                <p>{formatPrice(data.price)}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Bedrooms</h4>
                <p>{data.bedrooms || "N/A"}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Bathrooms</h4>
                <p>{data.bathrooms || "N/A"}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Sq Ft</h4>
                <p>{data.square_feet ? data.square_feet.toLocaleString() : "N/A"}</p>
              </div>
            </div>

            {data.key_features.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Key Features</h4>
                <div className="flex flex-wrap gap-1">
                  {data.key_features.slice(0, 6).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {data.key_features.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{data.key_features.length - 6} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Campaign Details */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Creative Style</h4>
              <p className="capitalize">{data.creative_style || "Not specified"}</p>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Copy Tone</h4>
              <div className="flex flex-wrap gap-1">
                {data.copy_tone.map((tone, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tone}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Materials Generated</h4>
              <div className="space-y-2">
                {data.materials_to_generate.map((material, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{material}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Media Files</h4>
              <div className="text-sm text-muted-foreground">
                {data.photos.length} photos, {data.videos.length} videos
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>
            Your campaign is ready! Choose what you'd like to do next.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="flex items-center gap-2 h-auto p-4 flex-col">
              <Download className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Download All</div>
                <div className="text-xs text-muted-foreground">Get all materials as files</div>
              </div>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4 flex-col">
              <Share2 className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Share Campaign</div>
                <div className="text-xs text-muted-foreground">Send to team or clients</div>
              </div>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4 flex-col">
              <Mail className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Email Materials</div>
                <div className="text-xs text-muted-foreground">Send directly to contacts</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Back to Review
        </Button>
        <div className="flex gap-4">
          <Button variant="outline" onClick={onClose}>
            Save as Draft
          </Button>
          <Button onClick={handleCreateCampaign} className="bg-green-600 hover:bg-green-700">
            Create Campaign
          </Button>
        </div>
      </div>
    </div>
  )
}
