import { Suspense } from "react"
import { createClient } from "@/utils/supabase/server"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, TrendingUp, Users, DollarSign, Eye } from "lucide-react"
import Link from "next/link"

async function getCampaignStats() {
  const supabase = await createClient()

  try {
    // Get total campaigns
    const { count: totalCampaigns } = await supabase.from("campaigns").select("*", { count: "exact", head: true })

    // Get active campaigns
    const { count: activeCampaigns } = await supabase
      .from("campaigns")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")

    // Get total views (sum of all campaign views)
    const { data: viewsData } = await supabase.from("campaigns").select("views")

    const totalViews = viewsData?.reduce((sum, campaign) => sum + (campaign.views || 0), 0) || 0

    // Get total leads (sum of all campaign leads)
    const { data: leadsData } = await supabase.from("campaigns").select("leads")

    const totalLeads = leadsData?.reduce((sum, campaign) => sum + (campaign.leads || 0), 0) || 0

    return {
      totalCampaigns: totalCampaigns || 0,
      activeCampaigns: activeCampaigns || 0,
      totalViews,
      totalLeads,
    }
  } catch (error) {
    console.error("Error fetching campaign stats:", error)
    return {
      totalCampaigns: 0,
      activeCampaigns: 0,
      totalViews: 0,
      totalLeads: 0,
    }
  }
}

async function getRecentCampaigns() {
  const supabase = await createClient()

  try {
    const { data: campaigns, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(5)

    if (error) throw error
    return campaigns || []
  } catch (error) {
    console.error("Error fetching recent campaigns:", error)
    return []
  }
}

function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: {
  title: string
  value: string | number
  description: string
  icon: any
  trend?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {trend && <span className="text-green-600">{trend}</span>} {description}
        </p>
      </CardContent>
    </Card>
  )
}

function RecentCampaignsList({ campaigns }: { campaigns: any[] }) {
  if (campaigns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
          <CardDescription>Your most recently updated campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No campaigns yet</p>
            <Link href="/dashboard/campaigns/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Campaign
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Campaigns</CardTitle>
          <CardDescription>Your most recently updated campaigns</CardDescription>
        </div>
        <Link href="/dashboard/campaigns/all">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">{campaign.property_address || "Untitled Campaign"}</h3>
                  <Badge
                    variant={
                      campaign.status === "active" ? "default" : campaign.status === "draft" ? "secondary" : "outline"
                    }
                  >
                    {campaign.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {campaign.property_type} • ${campaign.property_price?.toLocaleString()} • {campaign.bedrooms}bd/
                  {campaign.bathrooms}ba
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Updated {new Date(campaign.updated_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {campaign.views || 0}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {campaign.leads || 0}
                </div>
                <Link href={`/dashboard/campaigns/${campaign.id}`}>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default async function CampaignsPage() {
  const [stats, recentCampaigns] = await Promise.all([getCampaignStats(), getRecentCampaigns()])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Campaigns Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex-1 space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Campaigns Overview</h1>
              <p className="text-muted-foreground">Manage and track your marketing campaigns</p>
            </div>
            <Link href="/dashboard/campaigns/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Campaigns"
              value={stats.totalCampaigns}
              description="campaigns created"
              icon={TrendingUp}
            />
            <StatsCard
              title="Active Campaigns"
              value={stats.activeCampaigns}
              description="currently running"
              icon={TrendingUp}
              trend="+12%"
            />
            <StatsCard
              title="Total Views"
              value={stats.totalViews.toLocaleString()}
              description="across all campaigns"
              icon={Eye}
              trend="+8%"
            />
            <StatsCard
              title="Total Leads"
              value={stats.totalLeads}
              description="generated this month"
              icon={Users}
              trend="+23%"
            />
          </div>

          {/* Recent Campaigns */}
          <Suspense fallback={<div>Loading campaigns...</div>}>
            <RecentCampaignsList campaigns={recentCampaigns} />
          </Suspense>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link href="/dashboard/campaigns/create">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Campaign
                  </CardTitle>
                  <CardDescription>Start a new marketing campaign for your property</CardDescription>
                </CardHeader>
              </Link>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link href="/dashboard/campaigns/all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    View All Campaigns
                  </CardTitle>
                  <CardDescription>See all your campaigns and their performance</CardDescription>
                </CardHeader>
              </Link>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Analytics
                </CardTitle>
                <CardDescription>View detailed performance metrics and insights</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
