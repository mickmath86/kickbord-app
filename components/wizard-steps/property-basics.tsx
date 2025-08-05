"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home, DollarSign } from "lucide-react"

interface WizardPropertyBasicsProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
  data: any
  updateData: (data: any) => void
}

export function WizardPropertyBasics({ onNext, onPrevious, isFirstStep, data, updateData }: WizardPropertyBasicsProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const formatPrice = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "")
    if (!numericValue) return ""
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number.parseInt(numericValue))
  }

  const handlePriceChange = (value: string) => {
    const formatted = formatPrice(value)
    updateData({ price: formatted })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!data.propertyType) newErrors.propertyType = "Property type is required"
    if (!data.price) newErrors.price = "Price is required"
    if (!data.bedrooms) newErrors.bedrooms = "Number of bedrooms is required"
    if (!data.bathrooms) newErrors.bathrooms = "Number of bathrooms is required"
    if (!data.squareFootage) newErrors.squareFootage = "Square footage is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Home className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Property Basics</h2>
        <p className="text-lg text-muted-foreground">Tell us about the key details of your property</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Type & Price</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select value={data.propertyType || ""} onValueChange={(value) => updateData({ propertyType: value })}>
                  <SelectTrigger className={errors.propertyType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single-family">Single Family Home</SelectItem>
                    <SelectItem value="condo">Condominium</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="multi-family">Multi-Family</SelectItem>
                    <SelectItem value="land">Land/Lot</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
                {errors.propertyType && <p className="text-sm text-red-500 mt-1">{errors.propertyType}</p>}
              </div>

              <div>
                <Label htmlFor="price">Listing Price *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    placeholder="Enter price"
                    value={data.price || ""}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    className={`pl-10 ${errors.price ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Property Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <Select value={data.bedrooms || ""} onValueChange={(value) => updateData({ bedrooms: value })}>
                  <SelectTrigger className={errors.bedrooms ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Studio</SelectItem>
                    <SelectItem value="1">1 Bedroom</SelectItem>
                    <SelectItem value="2">2 Bedrooms</SelectItem>
                    <SelectItem value="3">3 Bedrooms</SelectItem>
                    <SelectItem value="4">4 Bedrooms</SelectItem>
                    <SelectItem value="5">5 Bedrooms</SelectItem>
                    <SelectItem value="6+">6+ Bedrooms</SelectItem>
                  </SelectContent>
                </Select>
                {errors.bedrooms && <p className="text-sm text-red-500 mt-1">{errors.bedrooms}</p>}
              </div>

              <div>
                <Label htmlFor="bathrooms">Bathrooms *</Label>
                <Select value={data.bathrooms || ""} onValueChange={(value) => updateData({ bathrooms: value })}>
                  <SelectTrigger className={errors.bathrooms ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Bathroom</SelectItem>
                    <SelectItem value="1.5">1.5 Bathrooms</SelectItem>
                    <SelectItem value="2">2 Bathrooms</SelectItem>
                    <SelectItem value="2.5">2.5 Bathrooms</SelectItem>
                    <SelectItem value="3">3 Bathrooms</SelectItem>
                    <SelectItem value="3.5">3.5 Bathrooms</SelectItem>
                    <SelectItem value="4">4 Bathrooms</SelectItem>
                    <SelectItem value="4+">4+ Bathrooms</SelectItem>
                  </SelectContent>
                </Select>
                {errors.bathrooms && <p className="text-sm text-red-500 mt-1">{errors.bathrooms}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="squareFootage">Square Footage *</Label>
                <Input
                  id="squareFootage"
                  type="number"
                  placeholder="e.g. 2500"
                  value={data.squareFootage || ""}
                  onChange={(e) => updateData({ squareFootage: e.target.value })}
                  className={errors.squareFootage ? "border-red-500" : ""}
                />
                {errors.squareFootage && <p className="text-sm text-red-500 mt-1">{errors.squareFootage}</p>}
              </div>

              <div>
                <Label htmlFor="lotSize">Lot Size (sq ft)</Label>
                <Input
                  id="lotSize"
                  type="number"
                  placeholder="e.g. 8000"
                  value={data.lotSize || ""}
                  onChange={(e) => updateData({ lotSize: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="yearBuilt">Year Built</Label>
              <Input
                id="yearBuilt"
                type="number"
                placeholder="e.g. 2010"
                value={data.yearBuilt || ""}
                onChange={(e) => updateData({ yearBuilt: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={onPrevious} disabled={isFirstStep} size="lg">
          Previous
        </Button>
        <Button onClick={handleNext} size="lg">
          Next: Features & Details
        </Button>
      </div>
    </div>
  )
}
