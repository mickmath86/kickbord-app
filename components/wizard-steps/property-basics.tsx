"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home, DollarSign } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardPropertyBasicsProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardPropertyBasics({ onNext, onPrevious, isFirstStep }: WizardPropertyBasicsProps) {
  const { data, updateData } = useCampaignData()

  // Add null check for data
  if (!data) {
    return <div>Loading...</div>
  }

  const formatPrice = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")
    if (!digits) return ""

    // Convert to number and format with commas
    const number = Number.parseInt(digits)
    return number.toLocaleString()
  }

  const handlePriceChange = (value: string) => {
    const digits = value.replace(/\D/g, "")
    const numericValue = digits ? Number.parseInt(digits) : null
    updateData({ price: numericValue })
  }

  const canProceed = data.price !== null && data.bedrooms !== null && data.bathrooms !== null

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Home className="h-5 w-5" />
            <span>Property Basics</span>
          </CardTitle>
          <CardDescription>Tell us about the key details of your property</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="price">Listing Price *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="price"
                placeholder="0"
                value={data.price ? formatPrice(data.price.toString()) : ""}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms *</Label>
              <Select
                value={data.bedrooms?.toString() || ""}
                onValueChange={(value) => updateData({ bedrooms: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Studio</SelectItem>
                  <SelectItem value="1">1 Bedroom</SelectItem>
                  <SelectItem value="2">2 Bedrooms</SelectItem>
                  <SelectItem value="3">3 Bedrooms</SelectItem>
                  <SelectItem value="4">4 Bedrooms</SelectItem>
                  <SelectItem value="5">5 Bedrooms</SelectItem>
                  <SelectItem value="6">6+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms *</Label>
              <Select
                value={data.bathrooms?.toString() || ""}
                onValueChange={(value) => updateData({ bathrooms: Number.parseFloat(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Bathroom</SelectItem>
                  <SelectItem value="1.5">1.5 Bathrooms</SelectItem>
                  <SelectItem value="2">2 Bathrooms</SelectItem>
                  <SelectItem value="2.5">2.5 Bathrooms</SelectItem>
                  <SelectItem value="3">3 Bathrooms</SelectItem>
                  <SelectItem value="3.5">3.5 Bathrooms</SelectItem>
                  <SelectItem value="4">4+ Bathrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="square_feet">Square Feet</Label>
              <Input
                id="square_feet"
                placeholder="e.g., 2,500"
                value={data.square_feet ? data.square_feet.toLocaleString() : ""}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "")
                  const numericValue = digits ? Number.parseInt(digits) : null
                  updateData({ square_feet: numericValue })
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year_built">Year Built</Label>
              <Input
                id="year_built"
                placeholder="e.g., 2020"
                value={data.year_built?.toString() || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "")
                  const numericValue = value ? Number.parseInt(value) : null
                  updateData({ year_built: numericValue })
                }}
                maxLength={4}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lot_size">Lot Size</Label>
            <Input
              id="lot_size"
              placeholder="e.g., 0.25 acres, 10,000 sq ft"
              value={data.lot_size || ""}
              onChange={(e) => updateData({ lot_size: e.target.value })}
            />
          </div>

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onPrevious} disabled={isFirstStep}>
              Previous
            </Button>
            <Button onClick={onNext} disabled={!canProceed}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
