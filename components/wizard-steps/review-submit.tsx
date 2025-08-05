"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Home, Users, ImageIcon, Loader2 } from "lucide-react"
import type { CampaignData } from "@/components/campaign-wizard"
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

interface WizardReviewSubmitProps {
  data: CampaignData
  updateData: (updates: Partial<CampaignData>) => void
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardReviewSubmit({ data, onPrevious, onClose }: WizardReviewSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const supabase = createClient()

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error("User not authenticated")
      }

      // Insert campaign into database
      const { data: campaign, error: campaignError } = await supabase
        .from("campaigns")
        .insert({
          user_id: user.id,
          property_address: data.property_address,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          square_feet: data.square_feet,
          price: data.price,
          property_type: data.property_type,
          year_built: data.year_built,
          lot_size: data.lot_size,
          hoa_info: data.hoa_info,
          features: data.features,
          keywords: data.keywords,
          neighborhood_info: data.neighborhood_info,
          cta_preference: data.cta_preference,
          tone: data.tone,
          media_urls: data.media_urls,
          status: "generating",
        })
        .select()
        .single()

      if (campaignError) {
        throw campaignError
      }

      // Simulate generation process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update status to completed
      await supabase.from("campaigns").update({ status: "completed" }).eq("id", campaign.id)

      setIsComplete(true)

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard/campaigns/listings")
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Error creating campaign:", error)
      alert("Failed to create campaign. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isComplete) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-96">
        <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Campaign Created Successfully!</h2>
        <p className="text-muted-foreground text-center mb-6">
          Your listing campaign has been created and marketing materials are being generated.
        </p>
        <div className="text-sm text-muted-foreground">Redirecting to campaigns...</div>
      </div>
    )
  }

  const toneLabels: Record<string, string> = {
    luxury: "Luxury",
    "first-time-buyer": "First-Time Buyer",
    "investor-focused": "Investor-Focused",
    "family-oriented": "Family-Oriented",
    "urban-professional": "Urban Professional",
    commercial: "Commercial",
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review & Submit</h2>
        <p className="text-muted-foreground">Review your campaign details before generating marketing materials</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Property Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium">{data.property_address}</p>
              <p className="text-sm text-muted-foreground">{data.property_type}</p>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Bedrooms</p>
                <p className="font-medium">{data.bedrooms || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Bathrooms</p>
                <p className="font-medium">{data.bathrooms || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Square Feet</p>
                <p className="font-medium">{data.square_feet?.toLocaleString() || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Price</p>
                <p className="font-medium">${data.price?.toLocaleString() || "N/A"}</p>
              </div>
            </div>
            {data.features.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Features</p>
                  <div className="flex flex-wrap gap-1">
                    {data.features.slice(0, 6).map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {data.features.length > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{data.features.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Marketing Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Marketing Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Target Tone</p>
              <p className="font-medium">{toneLabels[data.tone] || data.tone}</p>
            </div>
            {data.keywords.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Keywords</p>
                  <div className="flex flex-wrap gap-1">
                    {data.keywords.slice(0, 6).map((keyword) => (
                      <Badge key={keyword} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                    {data.keywords.length > 6 && (
                      <Badge variant="secondary" className="text-xs">
                        +{data.keywords.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>
              </>
            )}
            {data.cta_preference && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Call-to-Action</p>
                  <p className="font-medium">{data.cta_preference}</p>
                </div>
              </>
            )}
            {data.neighborhood_info && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Neighborhood</p>
                  <p className="text-sm">{data.neighborhood_info.slice(0, 100)}...</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Media */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5" />
              <span>Media</span>
            </CardTitle>
            <CardDescription>
              {data.media_urls.length > 0
                ? `${data.media_urls.length} photos uploaded`
                : "No photos uploaded - we'll use placeholder images"}
            </CardDescription>
          </CardHeader>
          {data.media_urls.length > 0 && (
            <CardContent>
              <div className="grid grid-cols-6 gap-2">
                {data.media_urls.slice(0, 6).map((url, index) => (
                  <img
                    key={index}
                    src={url || "/placeholder.svg"}
                    alt={`Property photo ${index + 1}`}
                    className="w-full h-16 object-cover rounded border"
                  />
                ))}
                {data.media_urls.length > 6 && (
                  <div className="w-full h-16 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground">
                    +{data.media_urls.length - 6}
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* What will be generated */}
      <Card>
        <CardHeader>
          <CardTitle>What You'll Get</CardTitle>
          <CardDescription>Your complete marketing kit will include:</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Facebook & Instagram ad copy</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">TikTok video script</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Professional landing page</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Social media graphics</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Print-ready PDF flyer</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Email marketing template</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious} disabled={isSubmitting}>
          Previous
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Campaign...
            </>
          ) : (
            "Create Campaign"
          )}
        </Button>
      </div>
    </div>
  )
}
