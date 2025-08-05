import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, TrendingUp, Activity } from "lucide-react"

export function DashboardContent({ user }: { user: any }) {
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
    <>
      {/* Welcome Section */}
      <div className="rounded-xl bg-muted/50 p-6">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user.email?.split("@")[0] || "User"}!</h2>
        <p className="text-muted-foreground">Here's what's happening with your account today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-1 text-xs">
                <Badge
                  variant={stat.trend === "up" ? "default" : "secondary"}
                  className={stat.trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {stat.change}
                </Badge>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chart Placeholder */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>Performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Chart will be displayed here</p>
                <p className="text-sm text-muted-foreground/60">Connect your analytics service</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
