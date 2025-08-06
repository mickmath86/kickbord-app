"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Edit, Check, RefreshCw } from 'lucide-react'
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
  const [editingContent, setEditingContent] = useState<{[key: string]: string}>({})
  const [activeTab, setActiveTab] = useState("social")

  const generatedContent = data.generated_copy || {}

  const handleEdit = (contentType: string, value: string) => {
    setEditingContent(prev => ({ ...prev, [contentType]: value }))
  }

  const handleSave = (contentType: string) => {
    const updatedContent = {
      ...generatedContent,
      [contentType]: editingContent[contentType]
    }
    updateData({ generated_copy: updatedContent })
    setEditingContent(prev => {
      const updated = { ...prev }
      delete updated[contentType]
      return updated
    })
  }

  const handleRegenerate = (contentType: string) => {
    // Simulate regeneration
    const regeneratedContent = {
      ...generatedContent,
      [contentType]: `[Regenerated] ${generatedContent[contentType]}`
    }
    updateData({ generated_copy: regeneratedContent })
  }

  const isEditing = (contentType: string) => contentType in editingContent

  const getDisplayContent = (contentType: string) => {
    return isEditing(contentType) ? editingContent[contentType] : generatedContent[contentType]
  }

  const handleNext = () => {
    // Save any pending edits
    const finalContent = { ...generatedContent }
    Object.keys(editingContent).forEach(key => {
      finalContent[key] = editingContent[key]
    })
    updateData({ generated_copy: finalContent })
    onNext()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Review & Edit Your Content</CardTitle>
          <CardDescription>
            Review the generated marketing materials and make any adjustments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="social">Social Posts</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="landing">Landing Page</TabsTrigger>
            </TabsList>

            <TabsContent value="social" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Social Media Posts</h3>
                  <Badge variant="secondary">2 posts generated</Badge>
                </div>
                
                {generatedContent.social_posts?.map((post: string, index: number) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium">Post {index + 1}</h4>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(`social_post_${index}`, post)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRegenerate(`social_post_${index}`)}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Regenerate
                          </Button>
                        </div>
                      </div>
                      
                      {isEditing(`social_post_${index}`) ? (
                        <div className="space-y-3">
                          <Textarea
                            value={getDisplayContent(`social_post_${index}`)}
                            onChange={(e) => handleEdit(`social_post_${index}`, e.target.value)}
                            rows={4}
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleSave(`social_post_${index}`)}>
                              <Check className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setEditingContent(prev => {
                                const updated = { ...prev }
                                delete updated[`social_post_${index}`]
                                return updated
                              })}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{post}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Email Marketing</h3>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium">Subject Line</h4>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit('email_subject', generatedContent.email_subject)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRegenerate('email_subject')}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Regenerate
                        </Button>
                      </div>
                    </div>
                    
                    {isEditing('email_subject') ? (
                      <div className="space-y-3">
                        <Textarea
                          value={getDisplayContent('email_subject')}
                          onChange={(e) => handleEdit('email_subject', e.target.value)}
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSave('email_subject')}>
                            <Check className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setEditingContent(prev => {
                              const updated = { ...prev }
                              delete updated.email_subject
                              return updated
                            })}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm font-medium">{generatedContent.email_subject}</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium">Email Body</h4>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit('email_body', generatedContent.email_body)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRegenerate('email_body')}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Regenerate
                        </Button>
                      </div>
                    </div>
                    
                    {isEditing('email_body') ? (
                      <div className="space-y-3">
                        <Textarea
                          value={getDisplayContent('email_body')}
                          onChange={(e) => handleEdit('email_body', e.target.value)}
                          rows={6}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSave('email_body')}>
                            <Check className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setEditingContent(prev => {
                              const updated = { ...prev }
                              delete updated.email_body
                              return updated
                            })}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{generatedContent.email_body}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="description" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Property Description</h3>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium">Listing Description</h4>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit('property_description', generatedContent.property_description)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRegenerate('property_description')}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Regenerate
                        </Button>
                      </div>
                    </div>
                    
                    {isEditing('property_description') ? (
                      <div className="space-y-3">
                        <Textarea
                          value={getDisplayContent('property_description')}
                          onChange={(e) => handleEdit('property_description', e.target.value)}
                          rows={6}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSave('property_description')}>
                            <Check className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setEditingContent(prev => {
                              const updated = { ...prev }
                              delete updated.property_description
                              return updated
                            })}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{generatedContent.property_description}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="landing" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Landing Page Content</h3>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium">Headline</h4>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit('landing_page_headline', generatedContent.landing_page_headline)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRegenerate('landing_page_headline')}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Regenerate
                        </Button>
                      </div>
                    </div>
                    
                    {isEditing('landing_page_headline') ? (
                      <div className="space-y-3">
                        <Textarea
                          value={getDisplayContent('landing_page_headline')}
                          onChange={(e) => handleEdit('landing_page_headline', e.target.value)}
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSave('landing_page_headline')}>
                            <Check className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setEditingContent(prev => {
                              const updated = { ...prev }
                              delete updated.landing_page_headline
                              return updated
                            })}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-lg font-semibold">{generatedContent.landing_page_headline}</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium">Subheading</h4>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit('landing_page_subheading', generatedContent.landing_page_subheading)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRegenerate('landing_page_subheading')}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Regenerate
                        </Button>
                      </div>
                    </div>
                    
                    {isEditing('landing_page_subheading') ? (
                      <div className="space-y-3">
                        <Textarea
                          value={getDisplayContent('landing_page_subheading')}
                          onChange={(e) => handleEdit('landing_page_subheading', e.target.value)}
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSave('landing_page_subheading')}>
                            <Check className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setEditingContent(prev => {
                              const updated = { ...prev }
                              delete updated.landing_page_subheading
                              return updated
                            })}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">{generatedContent.landing_page_subheading}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onPrevious}>
              Back
            </Button>
            <Button onClick={handleNext}>
              Continue to Preview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
