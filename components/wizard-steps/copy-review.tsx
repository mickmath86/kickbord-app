"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit3, Eye } from "lucide-react"
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
  const [editingContent, setEditingContent] = useState<string | null>(null)
  const [editedContent, setEditedContent] = useState("")

  const generatedCopy = data?.generated_copy || {}

  const handleEdit = (contentKey: string, currentContent: string) => {
    setEditingContent(contentKey)
    setEditedContent(currentContent)
  }

  const handleSaveEdit = () => {
    if (editingContent) {
      updateData({
        generated_copy: {
          ...generatedCopy,
          [editingContent]: editedContent,
        },
      })
      setEditingContent(null)
      setEditedContent("")
    }
  }

  const handleCancelEdit = () => {
    setEditingContent(null)
    setEditedContent("")
  }

  const handleNext = () => {
    onNext()
  }

  if (!data || !generatedCopy) {
    return <div>Loading generated content...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Review & Edit Your Marketing Copy
          </CardTitle>
          <CardDescription>
            Review the generated content and make any adjustments before finalizing your campaign
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="social" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="description">Property Description</TabsTrigger>
              <TabsTrigger value="email">Email Campaign</TabsTrigger>
              <TabsTrigger value="landing">Landing Page</TabsTrigger>
            </TabsList>

            {/* Social Media Posts */}
            <TabsContent value="social" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Social Media Posts</h3>
                <Badge variant="secondary">{generatedCopy.social_posts?.length || 0} posts</Badge>
              </div>

              {generatedCopy.social_posts?.map((post: string, index: number) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">Post {index + 1}</Label>
                        {editingContent === `social_posts_${index}` ? (
                          <div className="mt-2 space-y-3">
                            <Textarea
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                              rows={4}
                              className="w-full"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleSaveEdit}>
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2">
                            <p className="text-sm bg-muted p-3 rounded-md">{post}</p>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="mt-2"
                              onClick={() => handleEdit(`social_posts_${index}`, post)}
                            >
                              <Edit3 className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Property Description */}
            <TabsContent value="description" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Property Description</h3>
                <Badge variant="secondary">Marketing Copy</Badge>
              </div>

              <Card>
                <CardContent className="p-4">
                  {editingContent === "property_description" ? (
                    <div className="space-y-3">
                      <Label>Property Description</Label>
                      <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        rows={6}
                        className="w-full"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Label>Property Description</Label>
                      <p className="text-sm bg-muted p-4 rounded-md leading-relaxed">
                        {generatedCopy.property_description}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit("property_description", generatedCopy.property_description)}
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit Description
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Email Campaign */}
            <TabsContent value="email" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Email Campaign</h3>
                <Badge variant="secondary">Professional Template</Badge>
              </div>

              <div className="grid gap-4">
                <Card>
                  <CardContent className="p-4">
                    {editingContent === "email_subject" ? (
                      <div className="space-y-3">
                        <Label>Email Subject Line</Label>
                        <input
                          type="text"
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveEdit}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Label>Email Subject Line</Label>
                        <p className="text-sm bg-muted p-3 rounded-md font-medium">{generatedCopy.email_subject}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit("email_subject", generatedCopy.email_subject)}
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit Subject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    {editingContent === "email_body" ? (
                      <div className="space-y-3">
                        <Label>Email Body</Label>
                        <Textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          rows={6}
                          className="w-full"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveEdit}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Label>Email Body</Label>
                        <p className="text-sm bg-muted p-4 rounded-md leading-relaxed">{generatedCopy.email_body}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit("email_body", generatedCopy.email_body)}
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit Body
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Landing Page */}
            <TabsContent value="landing" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Landing Page Content</h3>
                <Badge variant="secondary">Web Copy</Badge>
              </div>

              <div className="grid gap-4">
                <Card>
                  <CardContent className="p-4">
                    {editingContent === "landing_page_headline" ? (
                      <div className="space-y-3">
                        <Label>Main Headline</Label>
                        <input
                          type="text"
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveEdit}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Label>Main Headline</Label>
                        <p className="text-lg font-semibold bg-muted p-3 rounded-md">
                          {generatedCopy.landing_page_headline}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit("landing_page_headline", generatedCopy.landing_page_headline)}
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit Headline
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    {editingContent === "landing_page_subheading" ? (
                      <div className="space-y-3">
                        <Label>Subheading</Label>
                        <Textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          rows={3}
                          className="w-full"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveEdit}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Label>Subheading</Label>
                        <p className="text-sm bg-muted p-3 rounded-md">{generatedCopy.landing_page_subheading}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit("landing_page_subheading", generatedCopy.landing_page_subheading)}
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit Subheading
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={onPrevious}>
              Previous
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview All
              </Button>
              <Button onClick={handleNext}>Next: Final Review</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
