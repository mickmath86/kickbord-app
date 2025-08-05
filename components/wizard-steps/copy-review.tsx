"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, Edit3, Eye } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardCopyReviewProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardCopyReview({ onNext, onPrevious }: WizardCopyReviewProps) {
  const { data, updateData } = useCampaignData()
  const [selectedCopy, setSelectedCopy] = useState<Record<string, any>>({})
  const [feedback, setFeedback] = useState<Record<string, string>>({})
  const [editingContent, setEditingContent] = useState<Record<string, string>>({})

  const generatedContent = data.generated_copy || {}

  const handleCopySelection = (materialType: string, copyId: string, content: any) => {
    setSelectedCopy((prev) => ({
      ...prev,
      [materialType]: { id: copyId, content },
    }))
  }

  const handleFeedback = (materialType: string, feedbackText: string) => {
    setFeedback((prev) => ({
      ...prev,
      [materialType]: feedbackText,
    }))
  }

  const handleEdit = (materialType: string, field: string, value: string) => {
    const key = `${materialType}_${field}`
    setEditingContent((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const saveCopySelections = () => {
    updateData({
      selected_copy: selectedCopy,
      feedback: feedback,
    })
    onNext()
  }

  // Mock generated content variations
  const mockContent = {
    facebook_ads: [
      {
        id: "fb_1",
        headline: "Your Dream Home Awaits!",
        body: `Beautiful ${data.property_type} at ${data.address}. ${data.bedrooms} bed, ${data.bathrooms} bath. ${data.key_features.slice(0, 2).join(" and ")}. $${data.price?.toLocaleString()}`,
        cta: "Schedule Tour Today",
      },
      {
        id: "fb_2",
        headline: "Don't Miss This Opportunity!",
        body: `Stunning property now available! ${data.bedrooms}BR/${data.bathrooms}BA ${data.property_type} with premium features. Located at ${data.address}. Priced at $${data.price?.toLocaleString()}.`,
        cta: "Book Your Visit",
      },
    ],
    landing_page: [
      {
        id: "lp_1",
        hero_title: `Welcome Home to ${data.address}`,
        subtitle: `Exceptional ${data.property_type} in Prime Location`,
        description: `This beautiful ${data.bedrooms}-bedroom, ${data.bathrooms}-bathroom home offers the perfect blend of comfort and style.`,
      },
    ],
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Review Generated Content</span>
          </CardTitle>
          <CardDescription>Review and customize your marketing materials before finalizing</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="facebook_ads" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="facebook_ads">Facebook Ads</TabsTrigger>
              <TabsTrigger value="landing_page">Landing Page</TabsTrigger>
              <TabsTrigger value="email_template">Email Template</TabsTrigger>
            </TabsList>

            <TabsContent value="facebook_ads" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Facebook & Instagram Ad Copy</h3>
                {mockContent.facebook_ads.map((ad, index) => (
                  <Card
                    key={ad.id}
                    className={`cursor-pointer transition-colors ${
                      selectedCopy.facebook_ads?.id === ad.id ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="outline">Option {index + 1}</Badge>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant={selectedCopy.facebook_ads?.id === ad.id ? "default" : "outline"}
                            onClick={() => handleCopySelection("facebook_ads", ad.id, ad)}
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Select
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Headline:</label>
                          <p className="font-semibold">{ad.headline}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Body:</label>
                          <p className="text-sm">{ad.body}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Call-to-Action:</label>
                          <p className="text-sm font-medium text-blue-600">{ad.cta}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Feedback or Modifications:</label>
                  <Textarea
                    placeholder="Any changes you'd like to make to the Facebook ad copy?"
                    value={feedback.facebook_ads || ""}
                    onChange={(e) => handleFeedback("facebook_ads", e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="landing_page" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Landing Page Content</h3>
                {mockContent.landing_page.map((page, index) => (
                  <Card
                    key={page.id}
                    className={`cursor-pointer transition-colors ${
                      selectedCopy.landing_page?.id === page.id ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="outline">Option {index + 1}</Badge>
                        <Button
                          size="sm"
                          variant={selectedCopy.landing_page?.id === page.id ? "default" : "outline"}
                          onClick={() => handleCopySelection("landing_page", page.id, page)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Select
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Hero Title:</label>
                          <h2 className="text-xl font-bold">{page.hero_title}</h2>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Subtitle:</label>
                          <p className="text-lg text-gray-600">{page.subtitle}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Description:</label>
                          <p className="text-sm">{page.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Feedback or Modifications:</label>
                  <Textarea
                    placeholder="Any changes you'd like to make to the landing page content?"
                    value={feedback.landing_page || ""}
                    onChange={(e) => handleFeedback("landing_page", e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="email_template" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <Edit3 className="h-12 w-12 mx-auto mb-4" />
                <p>Email template content will be generated based on your selections.</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={onPrevious}>
              Previous
            </Button>
            <Button onClick={saveCopySelections}>Finalize Content</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
