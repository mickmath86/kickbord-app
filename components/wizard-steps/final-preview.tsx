"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, Share, Save, Eye, FileText, Mail, ImageIcon } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"
import { useRouter } from "next/navigation"

interface WizardFinalPreviewProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardFinalPreview({ onPrevious, onClose, isFirstStep }: WizardFinalPreviewProps) {
  const { data } = useCampaignData()
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  // Add null check for data
  if (!data) {
    return <div>Loading...</div>
  }

  const handleSaveCampaign = async () => {
    setSaving(true)
    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setSaving(false)
    router.push("/dashboard/campaigns")
    onClose()
  }

  const getContent = (itemType: string, itemIndex: number, originalContent: string) => {
    const key = `${itemType}_${itemIndex}`
    return data.selected_copy?.[key] || originalContent
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Final Preview</span>
          </CardTitle>
          <CardDescription>
            Review your complete marketing campaign before saving. All materials are ready to use!
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Property Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Address</h4>
                <p className="text-sm">{data.address}</p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Type</h4>
                <p className="text-sm capitalize">{data.property_type?.replace("-", " ")}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Price</h4>
                  <p className="text-sm">${data.price?.toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Beds/Baths</h4>
                  <p className="text-sm">
                    {data.bedrooms}BR / {data.bathrooms}BA
                  </p>
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

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Generated Materials</h4>
                <div className="space-y-2">
                  {data.materials_to_generate.map((material) => (
                    <div key={material} className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="capitalize">{material.replace("_", " ")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Preview */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="social" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="social" className="flex items-center space-x-1">
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Social</span>
              </TabsTrigger>
              <TabsTrigger value="description" className="flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Description</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center space-x-1">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Email</span>
              </TabsTrigger>
              <TabsTrigger value="flyer" className="flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Flyer</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="social" className="space-y-4">
              {data.generated_copy?.social_posts?.map((post: string, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">Social Media Post {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-lg text-white">
                      <p className="whitespace-pre-wrap">{getContent("social", index, post)}</p>
                    </div>
                    <div className="flex justify-end mt-3 space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="description" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Property Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">
                      {getContent("description", 0, data.generated_copy?.property_description || "")}
                    </p>
                  </div>
                  <div className="flex justify-end mt-3 space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Email Campaign</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-white">
                    <p className="whitespace-pre-wrap">
                      {getContent("email", 0, data.generated_copy?.email_campaign || "")}
                    </p>
                  </div>
                  <div className="flex justify-end mt-3 space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="flyer" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Property Flyer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">
                      {getContent("flyer", 0, data.generated_copy?.flyer || "Flyer content will appear here...")}
                    </p>
                  </div>
                  <div className="flex justify-end mt-3 space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-8">
        <Button variant="outline" onClick={onPrevious} disabled={isFirstStep}>
          Previous
        </Button>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose}>
            Save as Draft
          </Button>
          <Button onClick={handleSaveCampaign} disabled={saving}>
            {saving ? (
              <>
                <Save className="h-4 w-4 mr-2 animate-spin" />
                Saving Campaign...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save & Launch Campaign
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
