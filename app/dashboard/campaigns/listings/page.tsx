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
import { Plus, Home, Calendar, TrendingUp, Eye } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { CampaignWizardTrigger } from "@/components/campaign-wizard-trigger"
import Link from "next/link"

export default async function CampaignListingsPage() {
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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard/campaigns">Campaigns</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Listing Campaigns</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Listing Campaigns</h1>
              <p className="text-muted-foreground">
                Generate professional marketing materials for your property listings
              </p>
            </div>
            <CampaignWizardTrigger>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                New Listing Campaign
              </Button>
            </CampaignWizardTrigger>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaignsList.length}</div>
                <p className="text-xs text-muted-foreground">Active listing campaigns</p>
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
                <p className="text-xs text-muted-foreground">New campaigns created</p>
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
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {campaignsList.filter((c) => c.status === "completed").length * 4}
                </div>
                <p className="text-xs text-muted-foreground">Marketing materials created</p>
              </CardContent>
            </Card>
          </div>

          {/* Campaigns List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Listing Campaigns</CardTitle>
              <CardDescription>Manage and track your property marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              {campaignsList.length === 0 ? (
                <div className="text-center py-12">
                  <Home className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first listing campaign to generate professional marketing materials
                  </p>
                  <CampaignWizardTrigger>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Campaign
                    </Button>
                  </CampaignWizardTrigger>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaignsList.map((campaign) => (
                    <Link key={campaign.id} href={`/dashboard/campaigns/${campaign.id}`}>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                            <Home className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{campaign.property_address}</h3>
                            <p className="text-sm text-muted-foreground">
                              {campaign.bedrooms}BR • {campaign.bathrooms}BA • {campaign.square_feet?.toLocaleString()}{" "}
                              sq ft
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">${campaign.price?.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground capitalize">{campaign.tone} tone</p>
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
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
