"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, Share, Eye } from 'lucide-react'
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

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
    
    // In a real app, this would save to the database
    console.log('Creating campaign with data:', data)
    
    setIsCreating(false)
    onClose()
  }

  const generatedContent = data.generated_copy || {}

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <CardTitle>Campaign Preview</CardTitle>
          <CardDescription>
            Review your complete marketing campaign before creating
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Property Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Property Summary</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Address:</strong> {data.address}</p>
                  <p><strong>Type:</strong> {data.property_type?.replace('-', ' ')}</p>
                  <p><strong>Price:</strong> ${data.price?.toLocaleString()}</p>
                </div>
                <div>
                  <p><strong>Bedrooms:</strong> {data.bedrooms}</p>
                  <p><strong>Bathrooms:</strong> {data.bathrooms}</p>
                  <p><strong>Square Feet:</strong> {data.square_feet?.toLocaleString()}</p>
                </div>
              </div>
              {data.key_features && data.key_features.length > 0 && (
                <div className="mt-3">
                  <p className="font-medium mb-2">Key Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {data.key_features.slice(0, 6).map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
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

          {/* Generated Content Preview */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="web">Web</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Materials Generated</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {data.materials_to_generate?.map((material) => (
                      <div key={material} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm capitalize">
                          {material.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Style & Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <strong>Style:</strong> {data.creative_style}
                    </div>
                    <div className="text-sm">
                      <strong>Tone:</strong> {data.copy_tone?.join(', ')}
                    </div>
                    <div className="text-sm">
                      <strong>Media:</strong> {data.photos?.length || 0} photos, {data.videos?.length || 0} videos
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <h3 className="font-semibold">Social Media Posts</h3>
              {generatedContent.social_posts?.map((post: string, index: number) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline">Post {index + 1}</Badge>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{post}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <h3 className="font-semibold">Email Marketing</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <Badge variant="outline" className="mb-2">Subject Line</Badge>
                      <p className="font-medium">{generatedContent.email_subject}</p>
                    </div>
                    <Separator />
                    <div>
                      <Badge variant="outline" className="mb-2">Email Body</Badge>
                      <p className="text-sm whitespace-pre-wrap">{generatedContent.email_body}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="web" className="space-y-4">
              <h3 className="font-semibold">Web Content</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div>
                      <Badge variant="outline" className="mb-2">Landing Page Headline</Badge>
                      <h2 className="text-xl font-bold">{generatedContent.landing_page_headline}</h2>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">Subheading</Badge>
                      <p className="text-muted-foreground">{generatedContent.landing_page_subheading}</p>
                    </div>
                    <Separator />
                    <div>
                      <Badge variant="outline" className="mb-2">Property Description</Badge>
                      <p className="text-sm">{generatedContent.property_description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onPrevious}>
              Back to Edit
            </Button>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                onClick={handleCreateCampaign}
                disabled={isCreating}
                className="px-6"
              >
                {isCreating ? "Creating Campaign..." : "Create Campaign"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
