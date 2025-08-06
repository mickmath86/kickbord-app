"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CheckCircle, Home, Mail, Globe, FileText, Calendar, DollarSign } from 'lucide-react'
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
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Redirect to campaigns page
    router.push("/dashboard/campaigns")
  }

  const generatedCopy = data?.generated_copy || {}

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
        <CardContent className="space-y-6">
          {/* Property Summary */}
          <div className="bg-muted rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  {data?.address}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{data?.bedrooms} bed</span>
                  <span>•</span>
                  <span>{data?.bathrooms} bath</span>
                  <span>•</span>
                  <span>{data?.square_feet?.toLocaleString()} sq ft</span>
                  <span>•</span>
                  <span>{data?.property_type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-lg font-semibold">${data?.price?.toLocaleString()}</span>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Ready to Launch
              </Badge>
            </div>
          </div>

          {/* Campaign Materials */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Generated Marketing Materials</h4>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="landing">Landing Page</TabsTrigger>
                <TabsTrigger value="description">Description</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Social Media Posts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{generatedCopy.social_posts?.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Ready to publish</p>
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
                      <p className="text-2xl font-bold">1</p>
                      <p className="text-sm text-muted-foreground">Template created</p>
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
                      <p className="text-2xl font-bold">1</p>
                      <p className="text-sm text-muted-foreground">Page ready</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Launch Date
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">Today</p>
                      <p className="text-sm text-muted-foreground">Immediate</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="social" className="space-y-4">
                <div className="space-y-4">
                  {generatedCopy.social_posts?.map((post: string, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-base">Post {index + 1}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm whitespace-pre-wrap">{post}</p>
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
                      <h5 className="font-medium mb-2">Subject Line</h5>
                      <p className="text-sm bg-muted p-3 rounded">{generatedCopy.email_subject}</p>
                    </div>
                    <Separator />
                    <div>
                      <h5 className="font-medium mb-2">Email Body</h5>
                      <p className="text-sm bg-muted p-3 rounded whitespace-pre-wrap">{generatedCopy.email_body}</p>
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
                      <h5 className="font-medium mb-2">Main Headline</h5>
                      <p className="text-sm bg-muted p-3 rounded">{generatedCopy.landing_page_headline}</p>
                    </div>
                    <Separator />
                    <div>
                      <h5 className="font-medium mb-2">Subheading</h5>
                      <p className="text-sm bg-muted p-3 rounded">{generatedCopy.landing_page_subheading}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="description" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Property Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm bg-muted p-3 rounded whitespace-pre-wrap">{generatedCopy.property_description}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Key Features Summary */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Key Features Highlighted</h4>
            <div className="flex flex-wrap gap-2">
              {data?.key_features?.map((feature, index) => (
                <Badge key={index} variant="outline">{feature}</Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={onPrevious}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Edit
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Save as Draft
              </Button>
              <Button 
                onClick={handleCreateCampaign}
                disabled={isCreating}
                className="bg-green-600 hover:bg-green-700"
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
