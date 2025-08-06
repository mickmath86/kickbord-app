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
    setEditValues({})
  }

  const handleRegenerateField = (field: string) => {
    // Mock regeneration - in real app this would call AI API
    const regeneratedContent = {
      social_posts: [
        `🌟 STUNNING NEW LISTING! This gorgeous ${data?.bedrooms}BR/${data?.bathrooms}BA ${data?.property_type} at ${data?.address} is everything you've been searching for! Features include ${data?.key_features?.slice(0, 2).join(" and ")}. Listed at $${data?.price?.toLocaleString()}. Book your showing today! #NewListing #DreamHome`,
        `🏠 MARKET FRESH! Incredible ${data?.property_type} now available at ${data?.address}. This ${data?.bedrooms}-bedroom gem offers ${data?.key_features?.slice(0, 3).join(", ")} and more. Don't wait - properties like this move fast! #JustListed #RealEstate`
      ],
      property_description: `Discover the perfect blend of comfort and elegance in this remarkable ${data?.bedrooms}-bedroom, ${data?.bathrooms}-bathroom ${data?.property_type} at ${data?.address}. Featuring ${data?.key_features?.slice(0, 4).join(", ")}, this property offers exceptional value at $${data?.price?.toLocaleString()}. Schedule your private tour today.`,
      email_subject: `Exclusive Listing - ${data?.address} | ${data?.bedrooms}BR/${data?.bathrooms}BA`,
      email_body: `Dear Valued Client,\n\nI'm thrilled to present this exceptional ${data?.property_type} that just became available at ${data?.address}. This ${data?.bedrooms}-bedroom, ${data?.bathrooms}-bathroom home showcases ${data?.key_features?.slice(0, 3).join(", ")} and represents outstanding value at $${data?.price?.toLocaleString()}.\n\nI'd love to arrange a private showing at your convenience.`,
      landing_page_headline: `Exceptional ${data?.property_type} at ${data?.address}`,
      landing_page_subheading: `Experience luxury living in this ${data?.bedrooms}BR/${data?.bathrooms}BA home featuring ${data?.key_features?.slice(0, 2).join(" and ")}.`
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
                  onClick={() => handleRegenerateField(field)}
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
            {value}
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="landing">Landing Page</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
            </TabsList>

            <TabsContent value="social" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Social Media Posts</h3>
                  <Badge variant="secondary">{generatedCopy.social_posts?.length || 0} posts</Badge>
                </div>
                {generatedCopy.social_posts?.map((post: string, index: number) => (
                  <EditableField
                    key={`social_post_${index}`}
                    field={`social_posts.${index}`}
                    value={post}
                    label={`Post ${index + 1}`}
                    multiline
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Email Campaign</h3>
                <EditableField
                  field="email_subject"
                  value={generatedCopy.email_subject || ""}
                  label="Subject Line"
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
                <h3 className="text-lg font-semibold">Landing Page Content</h3>
                <EditableField
                  field="landing_page_headline"
                  value={generatedCopy.landing_page_headline || ""}
                  label="Main Headline"
                />
                <EditableField
                  field="landing_page_subheading"
                  value={generatedCopy.landing_page_subheading || ""}
                  label="Subheading"
                  multiline
                />
              </div>
            </TabsContent>

            <TabsContent value="description" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Property Description</h3>
                <EditableField
                  field="property_description"
                  value={generatedCopy.property_description || ""}
                  label="Full Description"
                  multiline
                />
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
