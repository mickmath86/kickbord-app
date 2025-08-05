import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  DollarSign,
  Square,
  Bed,
  Bath,
  Facebook,
  Instagram,
  Globe,
  FileText,
  Download,
  Share,
  Edit,
} from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { redirect, notFound } from "next/navigation"

export default async function CampaignDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  // Get campaign details
  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (campaignError || !campaign) {
    notFound()
  }

  const materialIcons: Record<string, any> = {
    facebook: Facebook,
    instagram: Instagram,
    google: Globe,
    pdf: FileText,
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard/campaigns">Campaigns</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Campaign Details</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{campaign.property_address}</h1>
              <p className="text-muted-foreground">Created on {new Date(campaign.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant={
                  campaign.status === "completed"
                    ? "default"
                    : campaign.status === "generating"
                      ? "secondary"
                      : "outline"
                }
                className={
                  campaign.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : campaign.status === "generating"
                      ? "bg-yellow-100 text-yellow-800"
                      : ""
                }
              >
                {campaign.status}
              </Badge>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Property Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Home className="h-5 w-5" />
                    <span>Property Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">{campaign.property_address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Property Type</p>
                        <p className="font-medium">{campaign.property_type}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Bedrooms</p>
                          <div className="flex items-center space-x-1">
                            <Bed className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{campaign.bedrooms || "N/A"}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Bathrooms</p>
                          <div className="flex items-center space-x-1">
                            <Bath className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{campaign.bathrooms || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-lg">{campaign.price?.toLocaleString()}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Square Feet</p>
                        <div className="flex items-center space-x-1">
                          <Square className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{campaign.square_feet?.toLocaleString() || "N/A"}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Year Built</p>
                          <p className="font-medium">{campaign.year_built || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Lot Size</p>
                          <p className="font-medium">{campaign.lot_size || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {campaign.features && campaign.features.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Features</p>
                        <div className="flex flex-wrap gap-2">
                          {campaign.features.map((feature: string) => (
                            <Badge key={feature} variant="secondary">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {campaign.keywords && campaign.keywords.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Keywords</p>
                        <div className="flex flex-wrap gap-2">
                          {campaign.keywords.map((keyword: string) => (
                            <Badge key={keyword} variant="outline">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Generated Copy */}
              {campaign.generated_copy && (
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Marketing Copy</CardTitle>
                    <CardDescription>AI-generated content for your campaign</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(campaign.generated_copy).map(([copyType, options]: [string, any]) => (
                      <div key={copyType} className="border-l-2 border-blue-600 pl-4">
                        <h4 className="font-medium capitalize mb-2">{copyType.replace(/([A-Z])/g, " $1").trim()}</h4>
                        <div className="space-y-2">
                          {Array.isArray(options) &&
                            options.map((option: any, index: number) => (
                              <div key={index} className="p-3 bg-muted/50 rounded text-sm">
                                {copyType === "amenities" ? (
                                  <ul className="list-disc list-inside space-y-1">
                                    {option.map((amenity: string, i: number) => (
                                      <li key={i}>{amenity}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p>{option}</p>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Campaign Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <Badge
                      variant={campaign.status === "completed" ? "default" : "secondary"}
                      className={
                        campaign.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Created</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Updated</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(campaign.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Media */}
              {campaign.media_urls && campaign.media_urls.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Property Photos</CardTitle>
                    <CardDescription>{campaign.media_urls.length} photos uploaded</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {campaign.media_urls.slice(0, 4).map((url: string, index: number) => (
                        <img
                          key={index}
                          src={url || "/placeholder.svg"}
                          alt={`Property photo ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                      ))}
                      {campaign.media_urls.length > 4 && (
                        <div className="w-full h-20 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground">
                          +{campaign.media_urls.length - 4} more
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Marketing Materials */}
              <Card>
                <CardHeader>
                  <CardTitle>Marketing Materials</CardTitle>
                  <CardDescription>Generated assets ready for use</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {["facebook", "instagram", "google", "pdf"].map((material) => {
                    const Icon = materialIcons[material]
                    return (
                      <div key={material} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5 text-blue-600" />
                          <span className="font-medium capitalize">
                            {material === "pdf" ? "PDF Brochure" : `${material} Ad`}
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full bg-transparent" variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Campaign
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    <Share className="mr-2 h-4 w-4" />
                    Share Campaign
                  </Button>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Download className="mr-2 h-4 w-4" />
                    Download All Assets
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
