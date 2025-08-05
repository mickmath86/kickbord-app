"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown, Edit, Copy, Check } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardCopyReviewProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardCopyReview({ onNext, onPrevious, isFirstStep }: WizardCopyReviewProps) {
  const { data, updateData } = useCampaignData()
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  // Add null check for data
  if (!data) {
    return <div>Loading...</div>
  }

  const handleFeedback = (itemType: string, itemIndex: number, feedback: "like" | "dislike") => {
    const currentFeedback = data.feedback || {}
    const key = `${itemType}_${itemIndex}`
    updateData({
      feedback: {
        ...currentFeedback,
        [key]: feedback,
      },
    })
  }

  const handleEdit = (itemType: string, itemIndex: number, newContent: string) => {
    const currentSelected = data.selected_copy || {}
    updateData({
      selected_copy: {
        ...currentSelected,
        [`${itemType}_${itemIndex}`]: newContent,
      },
    })
    setEditingItem(null)
  }

  const copyToClipboard = (text: string, itemKey: string) => {
    navigator.clipboard.writeText(text)
    setCopiedItem(itemKey)
    setTimeout(() => setCopiedItem(null), 2000)
  }

  const getContent = (itemType: string, itemIndex: number, originalContent: string) => {
    const key = `${itemType}_${itemIndex}`
    return data.selected_copy?.[key] || originalContent
  }

  const renderContentItem = (content: string, itemType: string, itemIndex: number, title: string) => {
    const itemKey = `${itemType}_${itemIndex}`
    const isEditing = editingItem === itemKey
    const feedback = data.feedback?.[itemKey]
    const displayContent = getContent(itemType, itemIndex, content)

    return (
      <Card key={itemKey} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{title}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(displayContent, itemKey)}>
                {copiedItem === itemKey ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setEditingItem(isEditing ? null : itemKey)}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={displayContent}
                onChange={(e) => handleEdit(itemType, itemIndex, e.target.value)}
                rows={6}
                className="w-full"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => setEditingItem(null)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => setEditingItem(null)}>
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{displayContent}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">How does this look?</span>
                  <Button
                    variant={feedback === "like" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFeedback(itemType, itemIndex, "like")}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={feedback === "dislike" ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => handleFeedback(itemType, itemIndex, "dislike")}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
                {feedback && (
                  <Badge variant={feedback === "like" ? "default" : "destructive"}>
                    {feedback === "like" ? "Approved" : "Needs Revision"}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Review Your Marketing Materials</CardTitle>
          <CardDescription>
            Review, edit, and approve the generated content. You can make changes to any text before finalizing.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="social" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="social">Social Posts</TabsTrigger>
          <TabsTrigger value="description">Property Description</TabsTrigger>
          <TabsTrigger value="email">Email Campaign</TabsTrigger>
          <TabsTrigger value="flyer">Flyer Content</TabsTrigger>
        </TabsList>

        <TabsContent value="social" className="space-y-4">
          {data.generated_copy?.social_posts?.map((post: string, index: number) =>
            renderContentItem(post, "social", index, `Social Media Post ${index + 1}`),
          )}
        </TabsContent>

        <TabsContent value="description" className="space-y-4">
          {renderContentItem(
            data.generated_copy?.property_description || "Property description will appear here...",
            "description",
            0,
            "Property Description",
          )}
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          {renderContentItem(
            data.generated_copy?.email_campaign || "Email campaign content will appear here...",
            "email",
            0,
            "Email Campaign",
          )}
        </TabsContent>

        <TabsContent value="flyer" className="space-y-4">
          {renderContentItem(
            data.generated_copy?.flyer || "Flyer content will appear here...",
            "flyer",
            0,
            "Property Flyer Content",
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={onPrevious} disabled={isFirstStep}>
          Previous
        </Button>
        <Button onClick={onNext}>Continue to Preview</Button>
      </div>
    </div>
  )
}
