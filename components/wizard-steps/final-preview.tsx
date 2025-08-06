"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CheckCircle, Home, Mail, Globe, Share2, FileText, Loader2 } from 'lucide-react'
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"
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
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateCampaign = async () => {
    setIsCreating(true)
    
    // Mock campaign creation - in real app this would save to database
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to campaigns page
      router.push("/dashboard/campaigns")
    } catch (error) {
      console.error("Error creating campaign:", error)
      setIsCreating(false)
    }
  }

  if (!data) {
    return <div>Loading...</div>
  }

  const generatedCopy = data.generated_copy || {}

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Campaign Ready for Launch
          </CardTitle>
          <CardDescription>
            Review your complete marketing campaign before creating it
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Property Summary */}
          <div className="bg-muted rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{data.address}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{data.bedrooms} bed</span>
                  <span>•</span>
                  <span>{data.bathrooms} bath</span>
                  <span>•</span>
                  <span>{data.square_feet?.toLocaleString()} sq ft</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{data.property_type}</Badge>
                  <Badge variant="outline">${data.price?.toLocaleString()}</Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  ${data.price?.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Listed Price</div>
              </div>
            </div>
          </div>

          {/* Campaign Materials */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Generated Marketing Materials</h3>
            
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="landing">Landing Page</TabsTrigger>
                <TabsTrigger value="description">Description</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Share2 className="h-4 w-4" />
                        Social Media
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {generatedCopy.social_posts?.length || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Posts ready</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Campaign
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">✓</div>
                      <div className="text-sm text-muted-foreground">Template ready</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Landing Page
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">✓</div>
                      <div className="text-sm text-muted-foreground">Content ready</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Description
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">✓</div>
                      <div className="text-sm text-muted-foreground">Copy ready</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Campaign Features</h4>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">AI-optimized content</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Multi-platform ready</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Professional copywriting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Brand-consistent messaging</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="social" className="space-y-4">
                <div className="space-y-4">
                  {generatedCopy.social_posts?.map((post: string, index: number) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Social Media Post {index + 1}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap">
                          {post}
                        </div>
                      </CardContent>
                    </Card>
                  )) || (
                    <div className="text-muted-foreground">No social media posts generated</div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="email" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Email Subject</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-muted rounded-lg text-sm">
                      {generatedCopy.email_subject || "No subject generated"}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Email Body</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap">
                      {generatedCopy.email_body || "No email body generated"}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="landing" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Landing Page Headline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-muted rounded-lg text-sm">
                      {generatedCopy.landing_page_headline || "No headline generated"}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Landing Page Subheading</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-muted rounded-lg text-sm">
                      {generatedCopy.landing_page_subheading || "No subheading generated"}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="description" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Property Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap">
                      {generatedCopy.property_description || "No description generated"}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onPrevious} disabled={isCreating}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} disabled={isCreating}>
                Save as Draft
              </Button>
              <Button onClick={handleCreateCampaign} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Campaign...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Create Campaign
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
