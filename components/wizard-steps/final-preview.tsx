"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Home, MapPin, DollarSign, Bed, Bath, Square, Star, FileText, Download, Share, Eye } from "lucide-react"
import { useCampaignData } from "@/components/campaign-wizard"

export function WizardFinalPreview() {
  const { data, prevStep } = useCampaignData()
  const [isCreating, setIsCreating] = useState(false)

  if (!data) {
    return <div>Loading...</div>
  }

  const handleCreateCampaign = async () => {
    setIsCreating(true)

    // In real app, save campaign to database
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to campaign page or close wizard
      console.log("Campaign created successfully!")
    } catch (error) {
      console.error("Error creating campaign:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const selectedMaterials = data.marketing_materials || []
  const features = data.features || []
  const keywords = data.keywords || []

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Campaign Preview</h2>
        <p className="text-muted-foreground mt-2">Review your complete campaign before launching</p>
      </div>

      <div className="grid gap-6">
        {/* Property Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Property Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{data.property_address}</p>
                <p className="text-sm text-muted-foreground">Property Address</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-semibold">${data.price?.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Price</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="font-semibold">{data.bedrooms}</p>
                  <p className="text-xs text-muted-foreground">Bedrooms</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="font-semibold">{data.bathrooms}</p>
                  <p className="text-xs text-muted-foreground">Bathrooms</p>
                </div>
              </div>
              {data.square_feet && (
                <div className="flex items-center gap-2">
                  <Square className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="font-semibold">{data.square_feet?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Sq Ft</p>
                  </div>
                </div>
              )}
            </div>

            {features.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Key Features
                </p>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature) => (
                    <Badge key={feature} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {keywords.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Marketing Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword) => (
                    <Badge key={keyword} variant="outline">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {data.notes && (
              <div>
                <p className="text-sm font-medium mb-2">Additional Notes</p>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">{data.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Marketing Materials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Marketing Materials
            </CardTitle>
            <CardDescription>{selectedMaterials.length} materials will be generated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {selectedMaterials.map((materialId) => {
                const materialNames: { [key: string]: string } = {
                  social_media: "Social Media Posts",
                  listing_description: "MLS Listing Description",
                  flyer: "Property Flyer",
                  email_template: "Email Template",
                  landing_page: "Landing Page Copy",
                }

                return (
                  <div key={materialId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{materialNames[materialId]}</span>
                    </div>
                    <Badge variant="secondary">Ready</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Style & Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Style & Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Visual Style</p>
                <Badge variant="outline" className="capitalize">
                  {data.style}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Content Tone</p>
                <Badge variant="outline" className="capitalize">
                  {data.tone}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Actions */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>Once created, you'll be able to download, share, and track your campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Download className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">Download Materials</p>
                  <p className="text-xs text-muted-foreground">Get all files ready to use</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Share className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Share Campaign</p>
                  <p className="text-xs text-muted-foreground">Send to clients and team</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Eye className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-sm">Track Performance</p>
                  <p className="text-xs text-muted-foreground">Monitor views and leads</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Back to Edit
        </Button>
        <Button
          onClick={handleCreateCampaign}
          disabled={isCreating}
          className="bg-green-600 hover:bg-green-700"
          size="lg"
        >
          {isCreating ? "Creating Campaign..." : "Create Campaign"}
        </Button>
      </div>
    </div>
  )
}
