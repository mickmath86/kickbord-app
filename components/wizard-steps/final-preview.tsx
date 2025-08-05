"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, Share2, Calendar, MapPin, DollarSign, Home, Camera } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardFinalPreviewProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardFinalPreview({ onNext, onPrevious }: WizardFinalPreviewProps) {
  const { data } = useCampaignData()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateCampaign = async () => {
    setIsCreating(true)
    // Simulate campaign creation
    setTimeout(() => {
      setIsCreating(false)
      onNext()
    }, 2000)
  }

  if (!data) {
    return <div>Loading campaign preview...</div>
  }

  const generatedCopy = data.generated_copy || {}

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Campaign Ready for Launch
          </CardTitle>
          <CardDescription>Review your complete marketing campaign before we create it</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Campaign Overview */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {data.address}, {data.city}, {data.state} {data.zip_code}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">${data.price?.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {data.bedrooms} bed • {data.bathrooms} bath • {data.property_type}
                  </span>
                </div>
                {data.square_footage && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{data.square_footage.toLocaleString()} sq ft</span>
                  </div>
                )}
                {data.uploaded_photos && data.uploaded_photos.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{data.uploaded_photos.length} photos uploaded</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Marketing Materials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {data.materials_to_generate?.map((material) => (
                    <Badge key={material} variant="secondary" className="justify-center">
                      {material.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Design Style:</span>
                    <span className="font-medium capitalize">{data.design_style}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Content Tone:</span>
                    <span className="font-medium capitalize">{data.content_tone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Features */}
          {data.key_features && data.key_features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.key_features.map((feature) => (
                    <Badge key={feature} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generated Content Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generated Content Preview</CardTitle>
              <CardDescription>Sample of your marketing materials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Social Media Post */}
              {generatedCopy.social_posts && generatedCopy.social_posts[0] && (
                <div>
                  <h4 className="font-medium mb-2">Social Media Post</h4>
                  <div className="bg-muted p-4 rounded-lg text-sm">{generatedCopy.social_posts[0]}</div>
                </div>
              )}

              {/* Email Subject */}
              {generatedCopy.email_subject && (
                <div>
                  <h4 className="font-medium mb-2">Email Campaign Subject</h4>
                  <div className="bg-muted p-3 rounded-lg text-sm font-medium">{generatedCopy.email_subject}</div>
                </div>
              )}

              {/* Landing Page Headline */}
              {generatedCopy.landing_page_headline && (
                <div>
                  <h4 className="font-medium mb-2">Landing Page Headline</h4>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-lg font-bold">{generatedCopy.landing_page_headline}</h3>
                    {generatedCopy.landing_page_subheading && (
                      <p className="text-sm text-muted-foreground mt-2">{generatedCopy.landing_page_subheading}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Campaign Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">{data.materials_to_generate?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Materials</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">{data.key_features?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Features</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-purple-600">{data.uploaded_photos?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Photos</div>
            </div>
          </div>

          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-900 mb-2">Your Campaign is Ready!</h3>
            <p className="text-green-700 mb-4">
              We've generated professional marketing materials tailored specifically for your property. Click "Create
              Campaign" to save everything and start promoting your listing.
            </p>
            <div className="flex justify-center gap-2">
              <Badge variant="secondary">
                <Calendar className="h-3 w-3 mr-1" />
                Ready to Launch
              </Badge>
              <Badge variant="secondary">
                <Share2 className="h-3 w-3 mr-1" />
                Multi-Platform
              </Badge>
              <Badge variant="secondary">
                <Download className="h-3 w-3 mr-1" />
                Downloadable
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={onPrevious}>
              Previous: Edit Content
            </Button>
            <Button onClick={handleCreateCampaign} disabled={isCreating} className="bg-green-600 hover:bg-green-700">
              {isCreating ? "Creating Campaign..." : "Create Campaign"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
