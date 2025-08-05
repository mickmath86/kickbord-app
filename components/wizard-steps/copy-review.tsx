"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Edit3, Check, X, RefreshCw } from "lucide-react"
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
  const [feedback, setFeedback] = useState<Record<string, string>>({})

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
          [field]: newValue,
        },
      })
    }
    setEditingField(null)
  }

  const handleCancel = () => {
    setEditingField(null)
  }

  const handleRegenerate = (field: string) => {
    // In a real app, this would call the AI API to regenerate
    const regeneratedContent = {
      social_posts: [
        `🌟 STUNNING NEW LISTING! This gorgeous ${data?.bedrooms}BR/${data?.bathrooms}BA ${data?.property_type} at ${data?.address} is everything you've been searching for! Features include ${data?.key_features?.slice(0, 2).join(" and ")}. Listed at $${data?.price?.toLocaleString()}. Book your tour today! #NewListing #HomeForSale`,
        `🏠 DREAM HOME ALERT! Incredible ${data?.property_type} now available at ${data?.address}. This beauty boasts ${data?.key_features?.slice(0, 3).join(", ")} and so much more. Don't wait - homes like this sell fast! #DreamHome #RealEstate`,
      ],
      property_description: `Discover the perfect blend of luxury and comfort in this stunning ${data?.bedrooms}-bedroom, ${data?.bathrooms}-bathroom ${data?.property_type}. Nestled at ${data?.address}, this exceptional home features ${data?.key_features?.slice(0, 4).join(", ")}. At $${data?.price?.toLocaleString()}, this property offers unmatched value and endless possibilities.`,
      email_subject: `Exclusive Listing - ${data?.address} | ${data?.bedrooms}BR/${data?.bathrooms}BA`,
      email_body: `I'm thrilled to present this exclusive new listing that perfectly matches your criteria. Located at ${data?.address}, this exceptional ${data?.property_type} offers ${data?.bedrooms} spacious bedrooms, ${data?.bathrooms} well-appointed bathrooms, and premium features including ${data?.key_features?.slice(0, 3).join(", ")}. Priced competitively at $${data?.price?.toLocaleString()}, this won't be on the market long.`,
      landing_page_headline: `Exceptional Living at ${data?.address}`,
      landing_page_subheading: `Experience luxury in this meticulously crafted ${data?.bedrooms}BR/${data?.bathrooms}BA ${data?.property_type} with ${data?.key_features?.slice(0, 2).join(" and ")}.`,
    }

    updateData({
      generated_copy: {
        ...generatedCopy,
        ...regeneratedContent,
      },
    })
  }

  const handleFeedback = (field: string, feedbackText: string) => {
    setFeedback({ ...feedback, [field]: feedbackText })
    updateData({
      feedback: { ...data?.feedback, [field]: feedbackText },
    })
  }

  const renderEditableField = (field: string, value: string, label: string, isTextarea = false) => {
    const isEditing = editingField === field

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">{label}</Label>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleRegenerate(field)} className="h-8">
              <RefreshCw className="h-3 w-3 mr-1" />
              Regenerate
            </Button>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => handleEdit(field, value)} className="h-8">
                <Edit3 className="h-3 w-3 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            {isTextarea ? (
              <Textarea
                value={editValues[field] || value}
                onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
                className="min-h-[100px]"
              />
            ) : (
              <Input
                value={editValues[field] || value}
                onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
              />
            )}
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleSave(field)}>
                <Check className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm whitespace-pre-wrap">{value}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Review & Edit Your Marketing Copy</CardTitle>
          <CardDescription>
            Review the generated content and make any adjustments. You can edit any section or regenerate content you'd
            like to improve.
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
              <div>
                <h3 className="text-lg font-semibold mb-4">Social Media Posts</h3>
                <div className="space-y-6">
                  {generatedCopy.social_posts?.map((post: string, index: number) => (
                    <div key={index}>
                      {renderEditableField(`social_post_${index}`, post, `Post ${index + 1}`, true)}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">{post.length} characters</Badge>
                        <Badge variant={post.length <= 280 ? "default" : "destructive"}>
                          {post.length <= 280 ? "Twitter friendly" : "Too long for Twitter"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Email Campaign</h3>
                <div className="space-y-6">
                  {renderEditableField("email_subject", generatedCopy.email_subject || "", "Subject Line")}
                  {renderEditableField("email_body", generatedCopy.email_body || "", "Email Body", true)}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="landing" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Landing Page Content</h3>
                <div className="space-y-6">
                  {renderEditableField(
                    "landing_page_headline",
                    generatedCopy.landing_page_headline || "",
                    "Main Headline",
                  )}
                  {renderEditableField(
                    "landing_page_subheading",
                    generatedCopy.landing_page_subheading || "",
                    "Subheading",
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="description" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Property Description</h3>
                {renderEditableField(
                  "property_description",
                  generatedCopy.property_description || "",
                  "Full Description",
                  true,
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Navigation */}
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
