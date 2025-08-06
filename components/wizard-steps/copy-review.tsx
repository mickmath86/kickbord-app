"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown, Edit, FileText, Mail, Printer, Share2 } from 'lucide-react'
import { useCampaignData } from "@/app/dashboard/campaigns/create/context"

interface WizardCopyReviewProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardCopyReview({ onNext, onPrevious }: WizardCopyReviewProps) {
  const { data, updateData } = useCampaignData()
  const [activeTab, setActiveTab] = useState("description")
  const [editingContent, setEditingContent] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Record<string, string>>({})

  const mockContent = {
    description: "Discover your dream home in this stunning 3-bedroom, 2.5-bathroom residence nestled in a desirable neighborhood. This beautifully maintained property features an open-concept living space with hardwood floors, a gourmet kitchen with granite countertops, and a spacious master suite. The private backyard is perfect for entertaining, complete with a deck and mature landscaping. Located within walking distance of top-rated schools and parks, this home offers the perfect blend of comfort and convenience.",
    social_posts: [
      "🏡 NEW LISTING ALERT! Stunning 3BR/2.5BA home in prime location. Open concept living, gourmet kitchen, private backyard. Perfect for families! #JustListed #DreamHome #RealEstate",
      "✨ OPEN HOUSE THIS WEEKEND! Don't miss this beautifully maintained home with hardwood floors and updated kitchen. Saturday 1-3pm. See you there! #OpenHouse #HomeForSale"
    ],
    email_template: "Subject: New Listing - Your Dream Home Awaits!\n\nDear [Name],\n\nI'm excited to share this exceptional property that just hit the market. This stunning 3-bedroom home offers everything you've been looking for...\n\nKey Features:\n• Open concept living space\n• Gourmet kitchen with granite counters\n• Private backyard with deck\n• Top-rated school district\n\nI'd love to schedule a private showing. Are you available this weekend?\n\nBest regards,\n[Your Name]",
    flyer_content: "JUST LISTED\n$750,000\n\n3 Bedrooms | 2.5 Bathrooms | 2,000 sq ft\n\n✓ Open Concept Living\n✓ Gourmet Kitchen\n✓ Hardwood Floors\n✓ Private Backyard\n✓ Top Schools Nearby\n\nContact [Agent Name] for private showing\n[Phone] | [Email]"
  }

  const contentTypes = [
    { id: "description", label: "Property Description", icon: FileText, content: mockContent.description },
    { id: "social", label: "Social Media", icon: Share2, content: mockContent.social_posts },
    { id: "email", label: "Email Template", icon: Mail, content: mockContent.email_template },
    { id: "flyer", label: "Print Flyer", icon: Printer, content: mockContent.flyer_content }
  ]

  const handleApprove = (contentType: string) => {
    updateData({
      selected_copy: {
        ...data.selected_copy,
        [contentType]: "approved"
      }
    })
  }

  const handleReject = (contentType: string) => {
    updateData({
      selected_copy: {
        ...data.selected_copy,
        [contentType]: "rejected"
      }
    })
  }

  const handleEdit = (contentType: string) => {
    setEditingContent(contentType)
  }

  const handleSaveEdit = (contentType: string) => {
    setEditingContent(null)
    updateData({
      selected_copy: {
        ...data.selected_copy,
        [contentType]: "edited"
      }
    })
  }

  const handleFeedbackChange = (contentType: string, feedbackText: string) => {
    setFeedback(prev => ({
      ...prev,
      [contentType]: feedbackText
    }))
    updateData({
      feedback: {
        ...data.feedback,
        [contentType]: feedbackText
      }
    })
  }

  const getStatusBadge = (contentType: string) => {
    const status = data.selected_copy?.[contentType]
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Needs Revision</Badge>
      case "edited":
        return <Badge className="bg-blue-100 text-blue-800">Edited</Badge>
      default:
        return <Badge variant="outline">Pending Review</Badge>
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Review Your Marketing Content</h2>
        <p className="text-muted-foreground">
          Review and approve the generated marketing materials, or request changes
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          {contentTypes.map((type) => {
            const Icon = type.icon
            return (
              <TabsTrigger key={type.id} value={type.id} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{type.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {contentTypes.map((type) => (
          <TabsContent key={type.id} value={type.id}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <type.icon className="h-5 w-5" />
                      {type.label}
                    </CardTitle>
                    <CardDescription>
                      Review the generated content and provide feedback
                    </CardDescription>
                  </div>
                  {getStatusBadge(type.id)}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {type.id === "social" ? (
                    <div className="space-y-4">
                      {(type.content as string[]).map((post, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium mb-2">Social Post {index + 1}</h4>
                          {editingContent === `${type.id}-${index}` ? (
                            <Textarea
                              value={post}
                              onChange={() => {}}
                              rows={3}
                            />
                          ) : (
                            <p className="text-sm">{post}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      {editingContent === type.id ? (
                        <Textarea
                          value={type.content as string}
                          onChange={() => {}}
                          rows={8}
                        />
                      ) : (
                        <pre className="whitespace-pre-wrap text-sm font-mono">
                          {type.content as string}
                        </pre>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => handleApprove(type.id)}
                    variant={data.selected_copy?.[type.id] === "approved" ? "default" : "outline"}
                    className="flex items-center gap-2"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(type.id)}
                    variant={data.selected_copy?.[type.id] === "rejected" ? "destructive" : "outline"}
                    className="flex items-center gap-2"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    Request Changes
                  </Button>
                  <Button
                    onClick={() => editingContent === type.id ? handleSaveEdit(type.id) : handleEdit(type.id)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    {editingContent === type.id ? "Save" : "Edit"}
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Feedback or Revision Notes</label>
                  <Textarea
                    placeholder="Any specific changes you'd like to see..."
                    value={feedback[type.id] || ""}
                    onChange={(e) => handleFeedbackChange(type.id, e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button onClick={onNext}>
          Continue to Final Preview
        </Button>
      </div>
    </div>
  )
}
