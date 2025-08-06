"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, Share, Eye, Rocket } from 'lucide-react'
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
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateCampaign = async () => {
    setIsCreating(true)
    
    // Simulate campaign creation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In a real app, this would save to database
    console.log('Creating campaign with data:', data)
    
    setIsCreating(false)
    onClose() // Close wizard and return to campaigns list
  }

  const selectedCopy = data.selected_copy || data.generated_copy || {}

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Campaign Preview</h2>
        <p className="text-muted-foreground">
          Review your complete marketing campaign before launching
        </p>
      </div>

      <div className="space-y-6">
        {/* Campaign Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Campaign Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Property</h4>
                <p className="font-semibold">{data.address}</p>
                <p className="text-sm text-muted-foreground">
                  {data.bedrooms} bed • {data.bathrooms} bath • ${data.price?.toLocaleString()}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Materials Generated</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.materials_to_generate?.map((material) => (
                    <Badge key={material} variant="secondary" className="text-xs">
                      {material.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Style</h4>
                <p className="capitalize">{data.creative_style}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Media Files</h4>
                <p>{(data.photos?.length || 0) + (data.videos?.length || 0)} files uploaded</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Preview */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Social Media Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedCopy.social_posts?.slice(0, 2).map((post: string, index: number) => (
                  <div key={index} className="bg-muted rounded-lg p-3">
                    <p className="text-sm">{post}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Property Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm line-clamp-6">
                  {selectedCopy.property_description}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Email Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm font-medium">Subject:</p>
                  <p className="text-sm">{selectedCopy.email_subject}</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm line-clamp-4">{selectedCopy.email_body}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Landing Page</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm font-medium">Headline:</p>
                  <p className="text-sm">{selectedCopy.landing_page_headline}</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm">{selectedCopy.landing_page_subheading}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Ready to Launch?</CardTitle>
            <CardDescription>
              Your marketing campaign is ready. You can create it now or make final adjustments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleCreateCampaign}
                disabled={isCreating}
                className="flex items-center gap-2"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating Campaign...
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4" />
                    Create Campaign
                  </>
                )}
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Materials
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share className="h-4 w-4" />
                Share Preview
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview Landing Page
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">🎉 Campaign Ready!</h4>
          <p className="text-sm text-green-800">
            Your marketing campaign has been generated and is ready to launch. 
            All materials are optimized for your property and target audience.
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrevious}>
          Back to Edit
        </Button>
        <Button variant="outline" onClick={onClose}>
          Save as Draft
        </Button>
      </div>
    </div>
  )
}
