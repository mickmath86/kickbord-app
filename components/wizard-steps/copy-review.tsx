"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, MessageSquare, Globe, Mail } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardCopyReviewProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const sampleCopy = {
  social_media: {
    facebook:
      "🏡 JUST LISTED! Stunning 3BR/2.5BA home in prime location! This beautiful property features modern updates, spacious living areas, and a gorgeous backyard perfect for entertaining. Don't miss out on this incredible opportunity! #JustListed #RealEstate #DreamHome",
    instagram:
      "✨ NEW LISTING ALERT ✨\n\n📍 Beautiful 3BR/2.5BA home\n🏡 Modern updates throughout\n🌳 Gorgeous backyard oasis\n💰 Priced to sell fast!\n\nDM for private showing 📩\n\n#NewListing #RealEstate #HomeForSale #DreamHome",
  },
  landing_page: {
    headline: "Your Dream Home Awaits",
    description:
      "Discover this stunning 3-bedroom, 2.5-bathroom home featuring modern updates, spacious living areas, and a beautiful backyard perfect for entertaining. Located in a desirable neighborhood with easy access to schools, shopping, and dining.",
    features: [
      "Modern kitchen with stainless steel appliances",
      "Spacious master suite with walk-in closet",
      "Beautiful hardwood floors throughout",
      "Private backyard with mature landscaping",
    ],
  },
  email_template: {
    subject: "Exclusive Preview: Stunning Home Just Hit the Market",
    body: "I'm excited to share this incredible opportunity with you! This beautiful 3-bedroom, 2.5-bathroom home just came on the market and won't last long. With its modern updates, spacious layout, and prime location, it's everything you've been looking for in your next home.",
  },
}

export function WizardCopyReview({ onNext, onPrevious, isFirstStep }: WizardCopyReviewProps) {
  const { data, updateData } = useCampaignData()

  const handleCopyEdit = (material: string, field: string, value: string) => {
    const updatedCopy = {
      ...data.selected_copy,
      [material]: {
        ...data.selected_copy?.[material],
        [field]: value,
      },
    }
    updateData({ selected_copy: updatedCopy })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Review & Edit Your Copy</h2>
        <p className="text-lg text-muted-foreground">
          Review the generated marketing copy and make any adjustments needed
        </p>
      </div>

      <Tabs defaultValue="social_media" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="social_media" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Social Media
          </TabsTrigger>
          <TabsTrigger value="landing_page" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Landing Page
          </TabsTrigger>
          <TabsTrigger value="email_template" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="print_flyer" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Print Flyer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="social_media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Social Media Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">Facebook</Badge>
                </div>
                <Textarea
                  value={sampleCopy.social_media.facebook}
                  onChange={(e) => handleCopyEdit("social_media", "facebook", e.target.value)}
                  rows={4}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">Instagram</Badge>
                </div>
                <Textarea
                  value={sampleCopy.social_media.instagram}
                  onChange={(e) => handleCopyEdit("social_media", "instagram", e.target.value)}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="landing_page" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Landing Page Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Headline</label>
                <Textarea
                  value={sampleCopy.landing_page.headline}
                  onChange={(e) => handleCopyEdit("landing_page", "headline", e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={sampleCopy.landing_page.description}
                  onChange={(e) => handleCopyEdit("landing_page", "description", e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email_template" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Template
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Subject Line</label>
                <Textarea
                  value={sampleCopy.email_template.subject}
                  onChange={(e) => handleCopyEdit("email_template", "subject", e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email Body</label>
                <Textarea
                  value={sampleCopy.email_template.body}
                  onChange={(e) => handleCopyEdit("email_template", "body", e.target.value)}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="print_flyer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Print Flyer Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <p>
                  Print flyer design will be generated automatically based on your property details and selected copy.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={onPrevious} disabled={isFirstStep} size="lg">
          Previous
        </Button>
        <Button onClick={onNext} size="lg">
          Finalize Campaign
        </Button>
      </div>
    </div>
  )
}
