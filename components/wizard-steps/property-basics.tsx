"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign, Home, Bath, Bed, Square, Calendar } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardPropertyBasicsProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardPropertyBasics({ onNext, onPrevious }: WizardPropertyBasicsProps) {
  const { data, updateData } = useCampaignData()

  const formatPrice = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "")
    if (numericValue === "") return ""
    return new Intl.NumberFormat("en-US").format(Number.parseInt(numericValue))
  }

  const handlePriceChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "")
    updateData({ price: numericValue ? Number.parseInt(numericValue) : null })
  }

  const handleSquareFeetChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "")
    updateData({ square_feet: numericValue ? Number.parseInt(numericValue) : null })
  }

  const handleYearBuiltChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "")
    if (
      numericValue === "" ||
      (Number.parseInt(numericValue) >= 1800 && Number.parseInt(numericValue) <= new Date().getFullYear())
    ) {
      updateData({ year_built: numericValue ? Number.parseInt(numericValue) : null })
    }
  }

  const canProceed = data.price !== null && data.price > 0

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
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <div className="relative">
                <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  max="20"
                  placeholder="0"
                  value={data.bedrooms || ""}
                  onChange={(e) => updateData({ bedrooms: e.target.value ? Number.parseInt(e.target.value) : null })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <div className="relative">
                <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  placeholder="0"
                  value={data.bathrooms || ""}
                  onChange={(e) => updateData({ bathrooms: e.target.value ? Number.parseFloat(e.target.value) : null })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="square_feet">Square Feet</Label>
              <div className="relative">
                <Square className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="square_feet"
                  placeholder="0"
                  value={data.square_feet ? data.square_feet.toLocaleString() : ""}
                  onChange={(e) => handleSquareFeetChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year_built">Year Built</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="year_built"
                  placeholder="YYYY"
                  value={data.year_built || ""}
                  onChange={(e) => handleYearBuiltChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lot_size">Lot Size</Label>
            <Input
              id="lot_size"
              placeholder="e.g., 0.25 acres, 10,000 sq ft"
              value={data.lot_size}
              onChange={(e) => updateData({ lot_size: e.target.value })}
            />
          </div>

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onPrevious}>
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
