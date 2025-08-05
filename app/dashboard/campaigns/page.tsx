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
import { Plus, Megaphone, Users, TrendingUp, Calendar, Home, ArrowRight } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { CampaignWizardTrigger } from "@/components/campaign-wizard-trigger"
import Link from "next/link"

export default async function CampaignsPage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  // Get user's campaigns
  const { data: campaigns, error: campaignsError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const campaignsList = campaigns || []

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
                <BreadcrumbItem>
                  <BreadcrumbPage>Campaigns</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
              <p className="text-muted-foreground">Create and manage your marketing campaigns</p>
            </div>
            <CampaignWizardTrigger>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
            </CampaignWizardTrigger>
          </div>

          {/* Campaign Types */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Home className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Listing Campaigns</CardTitle>
                    <CardDescription>Generate marketing materials for property listings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Create professional marketing materials including social media copy, landing pages, and print
                    materials for your property listings.
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">{campaignsList.length}</span> campaigns created
                    </div>
                    <div className="flex space-x-2">
                      <Link href="/dashboard/campaigns/listings">
                        <Button variant="outline" size="sm">
                          View All
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <CampaignWizardTrigger>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="mr-2 h-4 w-4" />
                          Create
                        </Button>
                      </CampaignWizardTrigger>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="opacity-60">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Users className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <CardTitle>Lead Generation</CardTitle>
                    <CardDescription>Coming soon - Automated lead nurturing campaigns</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Automated email sequences and follow-up campaigns to nurture leads and convert prospects into
                    clients.
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Available soon</div>
                    <Button variant="outline" size="sm" disabled>
                      Coming Soon
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                <Megaphone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaignsList.length}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    campaignsList.filter(
                      (c) => new Date(c.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    ).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">New campaigns</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {campaignsList.length > 0
                    ? Math.round(
                        campaignsList.reduce((sum, c) => sum + (c.price || 0), 0) / campaignsList.length,
                      ).toLocaleString()
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">Average listing price</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Generated Assets</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaignsList.filter((c) => c.status === "completed").length * 4}
                </div>
                <p className="text-xs text-muted-foreground">Marketing materials</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Campaigns */}
          {campaignsList.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Campaigns</CardTitle>
                    <CardDescription>Your latest marketing campaigns</CardDescription>
                  </div>
                  <Link href="/dashboard/campaigns/listings">
                    <Button variant="outline" size="sm">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaignsList.slice(0, 3).map((campaign) => (
                    <div
                      key={campaign.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                          <Home className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{campaign.property_address}</h3>
                          <p className="text-sm text-muted-foreground">
                            {campaign.bedrooms}BR • {campaign.bathrooms}BA • ${campaign.price?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {new Date(campaign.created_at).toLocaleDateString()}
                          </p>
                        </div>
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
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
