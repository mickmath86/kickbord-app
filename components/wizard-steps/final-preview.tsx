"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Check, Download, Share2, Eye, Calendar, DollarSign, Home, MapPin } from "lucide-react"
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
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real app, this would save to the database
    console.log("Creating campaign with data:", data)

    setIsCreating(false)
    onClose() // Navigate back to campaigns list
  }

  const generatedCopy = data?.generated_copy || {}

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-6 w-6 text-green-600" />
            Campaign Ready for Launch
          </CardTitle>
          <CardDescription>
            Review your complete marketing campaign before launching. All materials are ready to go!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Property Summary */}
          <div className="bg-muted rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{data?.address}</p>
                    <p className="text-sm text-muted-foreground">{data?.property_type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{data?.bedrooms} bed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm">{data?.bathrooms} bath</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">${data?.price?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Key Features:</p>
                <div className="flex flex-wrap gap-1">
                  {data?.key_features?.slice(0, 6).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Materials */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Generated Marketing Materials</h3>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="landing">Landing Page</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Social Media Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        {generatedCopy.social_posts?.length || 0} posts ready
                      </p>
                      <div className="space-y-2">
                        {generatedCopy.social_posts?.slice(0, 1).map((post: string, index: number) => (
                          <div key={index} className="p-2 bg-muted rounded text-xs">
                            {post.substring(0, 100)}...
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Email Campaign</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">Subject: {generatedCopy.email_subject}</p>
                      <div className="p-2 bg-muted rounded text-xs">
                        {generatedCopy.email_body?.substring(0, 100)}...
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Landing Page</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-medium mb-1">{generatedCopy.landing_page_headline}</p>
                      <p className="text-xs text-muted-foreground">{generatedCopy.landing_page_subheading}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Property Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-2 bg-muted rounded text-xs">
                        {generatedCopy.property_description?.substring(0, 150)}...
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="social" className="space-y-4">
                <div className="space-y-4">
                  {generatedCopy.social_posts?.map((post: string, index: number) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Post {index + 1}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm whitespace-pre-wrap">{post}</p>
                        <div className="flex gap-2 mt-3">
                          <Badge variant="secondary">{post.length} characters</Badge>
                          <Badge variant={post.length <= 280 ? "default" : "destructive"}>
                            {post.length <= 280 ? "Twitter ready" : "Too long for Twitter"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="email" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Email Campaign</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Subject Line:</Label>
                      <p className="text-sm mt-1 p-2 bg-muted rounded">{generatedCopy.email_subject}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email Body:</Label>
                      <p className="text-sm mt-1 p-3 bg-muted rounded whitespace-pre-wrap">
                        {generatedCopy.email_body}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="landing" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Landing Page Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Main Headline:</Label>
                      <p className="text-lg font-semibold mt-1 p-3 bg-muted rounded">
                        {generatedCopy.landing_page_headline}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Subheading:</Label>
                      <p className="text-sm mt-1 p-2 bg-muted rounded">{generatedCopy.landing_page_subheading}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Property Description:</Label>
                      <p className="text-sm mt-1 p-3 bg-muted rounded whitespace-pre-wrap">
                        {generatedCopy.property_description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Campaign Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Campaign Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Materials</span>
                  </div>
                  <div className="space-y-1">
                    {data?.materials_to_generate?.map((material, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Style</span>
                  </div>
                  <p className="text-sm">{data?.creative_style}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Tone</span>
                  </div>
                  <div className="space-y-1">
                    {data?.copy_tone?.map((tone, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tone}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={onPrevious}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Edit
            </Button>

            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Materials
              </Button>
              <Button onClick={handleCreateCampaign} disabled={isCreating} className="min-w-[140px]">
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Launch Campaign
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
