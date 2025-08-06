"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Edit, Copy, CheckCircle, RefreshCw } from 'lucide-react'
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
  const [editedContent, setEditedContent] = useState(data.generated_copy || {})
  const [activeTab, setActiveTab] = useState("social")

  const handleContentChange = (key: string, value: string) => {
    setEditedContent(prev => ({ ...prev, [key]: value }))
  }

  const handleNext = () => {
    updateData({ selected_copy: editedContent })
    onNext()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const regenerateContent = (key: string) => {
    // Simulate regeneration with slight variations
    const variations = {
      social_posts: [
        `🏡 INCREDIBLE OPPORTUNITY! Beautiful ${data.bedrooms}BR/${data.bathrooms}BA ${data.property_type} now available at ${data.address}. Features ${data.key_features?.slice(0, 2).join(" and ")}. Listed at $${data.price?.toLocaleString()}. Call today! #NewListing #RealEstate`,
        `✨ MUST SEE! This gorgeous ${data.property_type} at ${data.address} won't last long! ${data.bedrooms} bedrooms, ${data.bathrooms} bathrooms, plus ${data.key_features?.[0]}. Priced to sell at $${data.price?.toLocaleString()}. #JustListed #DreamHome`
      ]
    }
    
    if (variations[key as keyof typeof variations]) {
      handleContentChange(key, variations[key as keyof typeof variations].join('\n\n'))
    }
  }

  if (!data.generated_copy) {
    return <div>No generated content available</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Review & Edit Content</h2>
        <p className="text-muted-foreground">
          Review the generated marketing materials and make any adjustments
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Generated Marketing Materials
          </CardTitle>
          <CardDescription>
            Click on any content to edit it. Your changes will be saved automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="social">Social Posts</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="landing">Landing Page</TabsTrigger>
            </TabsList>

            <TabsContent value="social" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Social Media Posts</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => regenerateContent('social_posts')}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              </div>
              <Textarea
                value={editedContent.social_posts?.join('\n\n') || ''}
                onChange={(e) => handleContentChange('social_posts', e.target.value.split('\n\n'))}
                rows={8}
                className="font-mono text-sm"
              />
              <div className="flex justify-between items-center">
                <Badge variant="secondary">2 posts generated</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(editedContent.social_posts?.join('\n\n') || '')}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="description" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Property Description</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => regenerateContent('property_description')}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
              <Textarea
                value={editedContent.property_description || ''}
                onChange={(e) => handleContentChange('property_description', e.target.value)}
                rows={6}
                className="font-mono text-sm"
              />
              <div className="flex justify-between items-center">
                <Badge variant="secondary">
                  {editedContent.property_description?.length || 0} characters
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(editedContent.property_description || '')}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Email Template</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => regenerateContent('email_body')}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Subject Line</label>
                  <Textarea
                    value={editedContent.email_subject || ''}
                    onChange={(e) => handleContentChange('email_subject', e.target.value)}
                    rows={1}
                    className="font-mono text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email Body</label>
                  <Textarea
                    value={editedContent.email_body || ''}
                    onChange={(e) => handleContentChange('email_body', e.target.value)}
                    rows={6}
                    className="font-mono text-sm mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">Email template</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(`${editedContent.email_subject}\n\n${editedContent.email_body}`)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Email
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="landing" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Landing Page Content</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => regenerateContent('landing_page_headline')}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Headline</label>
                  <Textarea
                    value={editedContent.landing_page_headline || ''}
                    onChange={(e) => handleContentChange('landing_page_headline', e.target.value)}
                    rows={2}
                    className="font-mono text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Subheading</label>
                  <Textarea
                    value={editedContent.landing_page_subheading || ''}
                    onChange={(e) => handleContentChange('landing_page_subheading', e.target.value)}
                    rows={2}
                    className="font-mono text-sm mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">Landing page copy</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(`${editedContent.landing_page_headline}\n\n${editedContent.landing_page_subheading}`)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Content
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-6 bg-muted rounded-lg p-4">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          Content Review Tips
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Make sure all property details are accurate</li>
          <li>• Adjust the tone to match your brand voice</li>
          <li>• Add any specific calls-to-action you prefer</li>
          <li>• Consider your target audience when reviewing</li>
        </ul>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button onClick={handleNext}>
          Continue to Preview
        </Button>
      </div>
    </div>
  )
}
