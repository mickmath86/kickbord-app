"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, Bed, Bath, Square } from "lucide-react"
import { useCampaignData } from "@/components/campaign-wizard"

export function WizardPropertyBasics() {
  const { data, updateData, nextStep, prevStep } = useCampaignData()

  if (!data) {
    return <div>Loading...</div>
  }

  const handlePriceChange = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, "")
    const price = Number.parseFloat(numericValue) || 0
    updateData({ price })
  }

  const formatPrice = (price: number) => {
    return price ? `$${price.toLocaleString()}` : ""
  }

  const handleNext = () => {
    if (data.price && data.bedrooms && data.bathrooms) {
      nextStep()
    }
  }

  const canProceed = data.price && data.bedrooms && data.bathrooms

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Property Basics</h2>
        <p className="text-muted-foreground mt-2">Tell us about the key features of your property</p>
      </div>

      <div className="grid gap-6">
        {/* Price */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Listing Price
            </CardTitle>
            <CardDescription>Enter the asking price for this property</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                placeholder="750000"
                value={data.price ? data.price.toString() : ""}
                onChange={(e) => handlePriceChange(e.target.value)}
              />
              {data.price && <p className="text-sm text-muted-foreground">{formatPrice(data.price)}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Bedrooms & Bathrooms */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bed className="h-5 w-5" />
                Bedrooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Number of Bedrooms *</Label>
                <Select
                  value={data.bedrooms?.toString() || ""}
                  onValueChange={(value) => updateData({ bedrooms: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Bedroom</SelectItem>
                    <SelectItem value="2">2 Bedrooms</SelectItem>
                    <SelectItem value="3">3 Bedrooms</SelectItem>
                    <SelectItem value="4">4 Bedrooms</SelectItem>
                    <SelectItem value="5">5 Bedrooms</SelectItem>
                    <SelectItem value="6">6+ Bedrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bath className="h-5 w-5" />
                Bathrooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Number of Bathrooms *</Label>
                <Select
                  value={data.bathrooms?.toString() || ""}
                  onValueChange={(value) => updateData({ bathrooms: Number.parseFloat(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bathrooms" />
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
            </CardContent>
          </Card>
        </div>

        {/* Square Footage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Square className="h-5 w-5" />
              Square Footage
            </CardTitle>
            <CardDescription>Optional - helps create more accurate marketing copy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="sqft">Square Feet</Label>
              <Input
                id="sqft"
                placeholder="2500"
                value={data.square_feet?.toString() || ""}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value) || 0
                  updateData({ square_feet: value || undefined })
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!canProceed} className="bg-blue-600 hover:bg-blue-700">
          Continue
        </Button>
      </div>
    </div>
  )
}
