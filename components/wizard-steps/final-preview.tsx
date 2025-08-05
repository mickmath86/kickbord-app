"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, Share2, CheckCircle, ExternalLink } from "lucide-react"
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
  const [isCompleting, setIsCompleting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const router = useRouter()

  const handleComplete = async () => {
    setIsCompleting(true)

    // Simulate saving campaign
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsComplete(true)

    // Redirect after showing success
    setTimeout(() => {
      router.push("/dashboard/campaigns")
      onClose()
    }, 2000)
  }

  if (isComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Campaign Created Successfully!</h2>
        <p className="text-muted-foreground mb-6">
          Your marketing materials are ready and your campaign has been saved.
        </p>
        <div className="text-sm text-muted-foreground">Redirecting to campaigns...</div>
      </div>
    )
  }

  const selectedContent = data.selected_copy || {}

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Final Preview & Download</span>
          </CardTitle>
          <CardDescription>
            Your marketing materials are ready! Preview and download your campaign assets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="ads">Social Ads</TabsTrigger>
              <TabsTrigger value="landing">Landing Page</TabsTrigger>
              <TabsTrigger value="downloads">Downloads</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Property Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">Address:</span>
                      <p className="text-sm text-muted-foreground">{data.address}</p>
                    </div>
                    <div>
                      <span className="font-medium">Type:</span>
                      <p className="text-sm text-muted-foreground capitalize">{data.property_type.replace("-", " ")}</p>
                    </div>
                    <div>
                      <span className="font-medium">Price:</span>
                      <p className="text-sm text-muted-foreground">${data.price?.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium">Details:</span>
                      <p className="text-sm text-muted-foreground">
                        {data.bedrooms} bed • {data.bathrooms} bath • {data.square_feet?.toLocaleString()} sq ft
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Generated Materials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {data.materials_to_generate?.map((material) => (
                        <div key={material} className="flex items-center justify-between">
                          <span className="text-sm capitalize">{material.replace("_", " ")}</span>
                          <Badge variant="secondary">Ready</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

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
            </TabsContent>

            <TabsContent value="ads" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Facebook & Instagram Ad</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedContent.facebook_ads ? (
                    <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Headline:</span>
                        <p className="font-semibold">{selectedContent.facebook_ads.content.headline}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Body:</span>
                        <p className="text-sm">{selectedContent.facebook_ads.content.body}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Call-to-Action:</span>
                        <p className="text-sm font-medium text-blue-600">{selectedContent.facebook_ads.content.cta}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No Facebook ad content selected</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="landing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Landing Page Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedContent.landing_page ? (
                    <div className="space-y-4 p-6 border rounded-lg bg-gradient-to-b from-blue-50 to-white">
                      <h1 className="text-3xl font-bold">{selectedContent.landing_page.content.hero_title}</h1>
                      <h2 className="text-xl text-gray-600">{selectedContent.landing_page.content.subtitle}</h2>
                      <p className="text-gray-700">{selectedContent.landing_page.content.description}</p>
                      <Button className="mt-4">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Full Landing Page
                      </Button>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No landing page content selected</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="downloads" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {data.materials_to_generate?.map((material) => (
                  <Card key={material}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium capitalize">{material.replace("_", " ")}</h3>
                          <p className="text-sm text-muted-foreground">Ready for download</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Share Campaign</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <Button variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Copy Campaign Link
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download All Assets
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={onPrevious}>
              Previous
            </Button>
            <Button onClick={handleComplete} disabled={isCompleting} className="bg-green-600 hover:bg-green-700">
              {isCompleting ? "Completing..." : "Complete Campaign"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
