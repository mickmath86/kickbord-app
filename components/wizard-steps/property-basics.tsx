"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, DollarSign } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardPropertyBasicsProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const propertyTypes = ["Single-Family", "Condo", "Duplex", "Triplex", "4-Unit", "Apartment", "Commercial"]

export function WizardPropertyBasics({ onNext, onPrevious, isFirstStep }: WizardPropertyBasicsProps) {
  const { data, updateData } = useCampaignData()
  const [priceInput, setPriceInput] = useState(data.price ? formatPrice(data.price) : "")

  function formatPrice(value: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  function parsePriceInput(input: string): number | null {
    const numericValue = input.replace(/[^0-9]/g, "")
    return numericValue ? Number.parseInt(numericValue) : null
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setPriceInput(input)

    const numericValue = parsePriceInput(input)
    updateData({ price: numericValue })

    if (numericValue) {
      setPriceInput(formatPrice(numericValue))
    }
  }

  const isFormValid = () => {
    return data.property_type && data.price && data.bedrooms && data.bathrooms && data.square_feet
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Home className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Property Basics</h2>
        <p className="text-lg text-muted-foreground">Tell us the essential details about your property</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Property Type & Price */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Type & Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="property-type">Property Type *</Label>
              <Select value={data.property_type} onValueChange={(value) => updateData({ property_type: value })}>
                <SelectTrigger className="text-lg py-3">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Listing Price *</Label>
              <Input
                id="price"
                placeholder="$500,000"
                value={priceInput}
                onChange={handlePriceChange}
                className="text-lg py-3"
              />
            </div>
          </CardContent>
        </Card>

        {/* Property Specs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Property Specifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  placeholder="3"
                  value={data.bedrooms || ""}
                  onChange={(e) => updateData({ bedrooms: Number.parseInt(e.target.value) || null })}
                  className="text-lg py-3"
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms *</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  step="0.5"
                  placeholder="2.5"
                  value={data.bathrooms || ""}
                  onChange={(e) => updateData({ bathrooms: Number.parseFloat(e.target.value) || null })}
                  className="text-lg py-3"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="square-feet">Square Footage *</Label>
              <Input
                id="square-feet"
                type="number"
                placeholder="2,000"
                value={data.square_feet || ""}
                onChange={(e) => updateData({ square_feet: Number.parseInt(e.target.value) || null })}
                className="text-lg py-3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lot-size">Lot Size</Label>
                <Input
                  id="lot-size"
                  placeholder="0.25 acres"
                  value={data.lot_size}
                  onChange={(e) => updateData({ lot_size: e.target.value })}
                  className="text-lg py-3"
                />
              </div>
              <div>
                <Label htmlFor="year-built">Year Built</Label>
                <Input
                  id="year-built"
                  type="number"
                  placeholder="2020"
                  value={data.year_built || ""}
                  onChange={(e) => updateData({ year_built: Number.parseInt(e.target.value) || null })}
                  className="text-lg py-3"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={onPrevious} disabled={isFirstStep} size="lg">
          Previous
        </Button>
        <Button onClick={onNext} disabled={!isFormValid()} size="lg">
          Next: Features & Details
        </Button>
      </div>
    </div>
  )
}
