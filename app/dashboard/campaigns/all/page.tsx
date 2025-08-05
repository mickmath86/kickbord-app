"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, MoreHorizontal, Eye, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function AllCampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const [campaigns] = useState([
    {
      id: 1,
      address: "123 Oak Street, Beverly Hills, CA",
      status: "active",
      created: "2024-01-15",
      views: 1250,
      leads: 8,
      price: 1250000,
      type: "single-family",
    },
    {
      id: 2,
      address: "456 Pine Avenue, Santa Monica, CA",
      status: "generating",
      created: "2024-01-14",
      views: 0,
      leads: 0,
      price: 850000,
      type: "condo",
    },
    {
      id: 3,
      address: "789 Maple Drive, West Hollywood, CA",
      status: "completed",
      created: "2024-01-12",
      views: 2100,
      leads: 15,
      price: 975000,
      type: "townhouse",
    },
    {
      id: 4,
      address: "321 Sunset Boulevard, Hollywood, CA",
      status: "active",
      created: "2024-01-10",
      views: 890,
      leads: 5,
      price: 1100000,
      type: "single-family",
    },
    {
      id: 5,
      address: "654 Ocean Drive, Malibu, CA",
      status: "paused",
      created: "2024-01-08",
      views: 3200,
      leads: 22,
      price: 2500000,
      type: "single-family",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "generating":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "paused":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Campaigns</h1>
          <p className="text-muted-foreground">View and manage all your listing campaigns</p>
        </div>
        <Link href="/dashboard/campaigns/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns by address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="generating">Generating</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <CardTitle>Campaigns ({filteredCampaigns.length})</CardTitle>
          <CardDescription>Click on any campaign to view details and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <Link key={campaign.id} href={`/dashboard/campaigns/${campaign.id}`}>
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{campaign.address}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm text-muted-foreground">${campaign.price.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground capitalize">{campaign.type.replace("-", " ")}</p>
                          <p className="text-sm text-muted-foreground">
                            Created {new Date(campaign.created).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{campaign.views.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">views</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{campaign.leads}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">leads</p>
                    </div>
                    <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No campaigns found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
