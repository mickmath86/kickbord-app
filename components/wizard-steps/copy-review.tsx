"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Edit3, Check, X, RefreshCw } from 'lucide-react'
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
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Record<string, string>>({})

  const generatedCopy = data?.generated_copy || {}

  const handleEdit = (field: string, currentValue: string) => {
    setEditingField(field)
    setEditValues({ ...editValues, [field]: currentValue })
  }

  const handleSave = (field: string) => {
    const newValue = editValues[field]
    if (newValue !== undefined) {
      updateData({
        generated_copy: {
          ...generatedCopy,
          [field]: newValue
        }
      })
    }
    setEditingField(null)
  }

  const handleCancel = () => {
    setEditingField(null)
  }

  const handleRegenerate = (field: string) => {
    // Mock regeneration - in real app this would call AI API
    const regeneratedContent = {
      social_posts: [
        `🌟 STUNNING NEW LISTING! This gorgeous ${data?.bedrooms}BR/${data?.bathrooms}BA ${data?.property_type} at ${data?.address} is everything you've been searching for! Features include ${data?.key_features?.slice(0, 2).join(" and ")}. Listed at $${data?.price?.toLocaleString()}. Book your tour today! #NewListing #HomeForSale`,
        `✨ PRICE TO SELL ✨ Beautiful ${data?.property_type} now available! This ${data?.bedrooms}-bedroom home offers ${data?.key_features?.slice(0, 3).join(", ")} and more. Perfect for first-time buyers or investors. Call now! #RealEstate #HomeOwnership`
      ],
      property_description: `Discover the perfect blend of comfort and elegance in this remarkable ${data?.bedrooms}-bedroom, ${data?.bathrooms}-bathroom ${data?.property_type}. Nestled at ${data?.address}, this property showcases ${data?.key_features?.slice(0, 4).join(", ")} and countless other premium features. At $${data?.price?.toLocaleString()}, this represents an exceptional opportunity in today's competitive market.`,
      email_subject: `🏡 Exclusive Listing - ${data?.address} | ${data?.bedrooms}BR/${data?.bathrooms}BA`,
      email_body: `Dear Valued Client,\n\nI'm thrilled to present this exceptional ${data?.property_type} that has just become available. Located at ${data?.address}, this ${data?.bedrooms}-bedroom, ${data?.bathrooms}-bathroom home offers an impressive array of features including ${data?.key_features?.slice(0, 3).join(", ")}.\n\nPriced competitively at $${data?.price?.toLocaleString()}, this property represents outstanding value and won't remain on the market long.\n\nI'd love to schedule a private showing at your convenience.`,
      landing_page_headline: `Exceptional Living Awaits at ${data?.address}`,
      landing_page_subheading: `Experience luxury and comfort in this stunning ${data?.bedrooms}BR/${data?.bathrooms}BA ${data?.property_type} with ${data?.key_features?.slice(0, 2).join(" and ")}.`
    }

    updateData({
      generated_copy: {
        ...generatedCopy,
        [field]: regeneratedContent[field as keyof typeof regeneratedContent]
      }
    })
  }

  const EditableField = ({ 
    field, 
    value, 
    label, 
    multiline = false 
  }: { 
    field: string
    value: string
    label: string
    multiline?: boolean 
  }) => {
    const isEditing = editingField === field
    const currentValue = editValues[field] ?? value

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">{label}</Label>
          <div className="flex gap-2">
            {!isEditing && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(field, value)}
                  className="h-8 px-2"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRegenerate(field)}
                  className="h-8 px-2"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </>
            )}
            {isEditing && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSave(field)}
                  className="h-8 px-2 text-green-600"
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="h-8 px-2 text-red-600"
                >
                  <X className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
        {isEditing ? (
          multiline ? (
            <Textarea
              value={currentValue}
              onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
              className="min-h-[100px]"
              autoFocus
            />
          ) : (
            <Input
              value={currentValue}
              onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
              autoFocus
            />
          )
        ) : (
          <div className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
            {value || "No content generated"}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Review & Edit Generated Content</CardTitle>
          <CardDescription>
            Review the AI-generated marketing materials and make any adjustments needed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="social" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="landing">Landing Page</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>

            <TabsContent value="social" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Social Media Posts</h3>
                {generatedCopy.social_posts?.map((post: string, index: number) => (
                  <EditableField
                    key={`social_${index}`}
                    field={`social_posts.${index}`}
                    value={post}
                    label={`Post ${index + 1}`}
                    multiline
                  />
                )) || (
                  <div className="text-muted-foreground">No social media posts generated</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="description" className="space-y-6">
              <EditableField
                field="property_description"
                value={generatedCopy.property_description || ""}
                label="Property Description"
                multiline
              />
            </TabsContent>

            <TabsContent value="email" className="space-y-6">
              <div className="space-y-4">
                <EditableField
                  field="email_subject"
                  value={generatedCopy.email_subject || ""}
                  label="Email Subject Line"
                />
                <EditableField
                  field="email_body"
                  value={generatedCopy.email_body || ""}
                  label="Email Body"
                  multiline
                />
              </div>
            </TabsContent>

            <TabsContent value="landing" className="space-y-6">
              <div className="space-y-4">
                <EditableField
                  field="landing_page_headline"
                  value={generatedCopy.landing_page_headline || ""}
                  label="Landing Page Headline"
                />
                <EditableField
                  field="landing_page_subheading"
                  value={generatedCopy.landing_page_subheading || ""}
                  label="Landing Page Subheading"
                  multiline
                />
              </div>
            </TabsContent>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Content Summary</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Social Media</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="secondary">
                          {generatedCopy.social_posts?.length || 0} posts
                        </Badge>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Email Campaign</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="secondary">
                          {generatedCopy.email_subject ? "Ready" : "Not generated"}
                        </Badge>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Property Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="secondary">
                          {generatedCopy.property_description ? "Ready" : "Not generated"}
                        </Badge>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Landing Page</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="secondary">
                          {generatedCopy.landing_page_headline ? "Ready" : "Not generated"}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={onPrevious}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button onClick={onNext}>
              Continue to Preview
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
