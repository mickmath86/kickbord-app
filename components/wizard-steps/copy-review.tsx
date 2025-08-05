"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Edit, Check, RefreshCw } from "lucide-react"
import { useCampaignData } from "@/components/campaign-wizard"

// Mock generated content - in real app this would come from AI generation
const MOCK_CONTENT = {
  social_media: {
    title: "Social Media Post",
    content:
      "🏡 JUST LISTED! Stunning 3BR/2BA home in prime location! ✨\n\n💰 $750,000\n📍 Beautiful neighborhood\n🌟 Move-in ready with modern updates\n\n#JustListed #RealEstate #DreamHome #NewListing",
  },
  listing_description: {
    title: "MLS Listing Description",
    content:
      "Welcome to this beautifully maintained 3-bedroom, 2-bathroom home featuring modern updates throughout. The open-concept living area flows seamlessly into the updated kitchen with stainless steel appliances. The master suite offers a private retreat with walk-in closet and en-suite bathroom. Additional highlights include hardwood floors, a cozy fireplace, and a private backyard perfect for entertaining. Located in a desirable neighborhood with easy access to schools, shopping, and dining. This move-in ready home won't last long!",
  },
  email_template: {
    title: "Client Email Template",
    content:
      "Subject: New Listing Alert - Your Dream Home Awaits!\n\nHi [Client Name],\n\nI'm excited to share this incredible new listing that just hit the market! This stunning 3-bedroom, 2-bathroom home offers everything you've been looking for:\n\n• Modern updates throughout\n• Open-concept living space\n• Updated kitchen with stainless appliances\n• Private backyard for entertaining\n• Prime location near schools and amenities\n\nPriced at $750,000, this home is sure to generate significant interest. I'd love to schedule a private showing for you this week.\n\nLet me know your availability!\n\nBest regards,\n[Your Name]",
  },
}

export function WizardCopyReview() {
  const { data, updateData, nextStep, prevStep } = useCampaignData()
  const [editingContent, setEditingContent] = useState<{ [key: string]: string }>({})
  const [activeTab, setActiveTab] = useState("social_media")

  if (!data) {
    return <div>Loading...</div>
  }

  const selectedMaterials = data.marketing_materials || []
  const availableContent = Object.entries(MOCK_CONTENT).filter(([key]) => selectedMaterials.includes(key))

  const handleEdit = (contentType: string, newContent: string) => {
    setEditingContent((prev) => ({
      ...prev,
      [contentType]: newContent,
    }))
  }

  const handleSave = (contentType: string) => {
    // In real app, save the edited content
    setEditingContent((prev) => {
      const updated = { ...prev }
      delete updated[contentType]
      return updated
    })
  }

  const handleRegenerate = (contentType: string) => {
    // In real app, trigger AI regeneration
    console.log(`Regenerating content for ${contentType}`)
  }

  const handleNext = () => {
    // Save any edited content to campaign data
    updateData({ generated_content: { ...MOCK_CONTENT, ...editingContent } })
    nextStep()
  }

  const isEditing = (contentType: string) => contentType in editingContent

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Review & Edit Content</h2>
        <p className="text-muted-foreground mt-2">Review the generated marketing content and make any adjustments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generated Marketing Content
          </CardTitle>
          <CardDescription>Click edit to modify any content, or regenerate for new versions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              {availableContent.map(([key, content]) => (
                <TabsTrigger key={key} value={key} className="text-xs">
                  {content.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {availableContent.map(([contentType, content]) => (
              <TabsContent key={contentType} value={contentType} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{content.title}</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleRegenerate(contentType)}>
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Regenerate
                    </Button>
                    {!isEditing(contentType) ? (
                      <Button variant="outline" size="sm" onClick={() => handleEdit(contentType, content.content)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleSave(contentType)}>
                        <Check className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    )}
                  </div>
                </div>

                {isEditing(contentType) ? (
                  <Textarea
                    value={editingContent[contentType]}
                    onChange={(e) => handleEdit(contentType, e.target.value)}
                    rows={8}
                    className="font-mono text-sm"
                  />
                ) : (
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="whitespace-pre-wrap text-sm">{content.content}</pre>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{content.content.length} characters</Badge>
                  <Badge variant="outline">Ready to use</Badge>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Content Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Review for accuracy and brand voice consistency</li>
          <li>• Customize with specific details about your market</li>
          <li>• Add your contact information where needed</li>
          <li>• Test different versions to see what performs best</li>
        </ul>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
          Approve Content
        </Button>
      </div>
    </div>
  )
}
