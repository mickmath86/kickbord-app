import { BarChart3, Users, TrendingUp, Activity } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { ensureProfile } from "@/app/auth/actions"
import { redirect } from "next/navigation"
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
import { DashboardContent } from "@/components/dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  // Ensure profile exists and get it
  const profileResult = await ensureProfile()

  if (profileResult.error) {
    console.error("Profile error:", profileResult.error)
    // Continue with basic user data if profile creation fails
  }

  const profile = profileResult.profile

  // Create user display data with fallbacks
  const userData = {
    name:
      profile?.full_name ||
      profile?.first_name ||
      user.user_metadata?.first_name ||
      user.email?.split("@")[0] ||
      "User",
    email: user.email || "",
    firstName: profile?.first_name || user.user_metadata?.first_name || "",
    lastName: profile?.last_name || user.user_metadata?.last_name || "",
    avatar: profile?.avatar_url || "/placeholder.svg?height=40&width=40",
  }

  const stats = [
    {
      title: "Total Users",
      value: "2,543",
      change: "+12%",
      icon: Users,
      trend: "up",
    },
    {
      title: "Revenue",
      value: "$45,231",
      change: "+8%",
      icon: TrendingUp,
      trend: "up",
    },
    {
      title: "Active Sessions",
      value: "1,234",
      change: "-3%",
      icon: Activity,
      trend: "down",
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+0.5%",
      icon: BarChart3,
      trend: "up",
    },
  ]

  const recentActivity = [
    { id: 1, action: "New user registered", time: "2 minutes ago", type: "user" },
    { id: 2, action: "Payment received", time: "5 minutes ago", type: "payment" },
    { id: 3, action: "System backup completed", time: "1 hour ago", type: "system" },
    { id: 4, action: "New feature deployed", time: "2 hours ago", type: "deployment" },
  ]

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
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <DashboardContent user={user} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
