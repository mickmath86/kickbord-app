"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
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

export function WizardPropertyBasics({ onNext, onPrevious }: WizardPropertyBasicsProps) {
  const { data, updateData } = useCampaignData()
  const [price, setPrice] = useState(data?.price?.toString() || "")
  const [propertyType, setPropertyType] = useState(data?.property_type || "")
  const [bedrooms, setBedrooms] = useState(data?.bedrooms?.toString() || "")
  const [bathrooms, setBathrooms] = useState(data?.bathrooms?.toString() || "")
  const [squareFootage, setSquareFootage] = useState(data?.square_footage?.toString() || "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const formatPrice = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "")
    if (numericValue) {
      return Number.parseInt(numericValue).toLocaleString()
    }
    return ""
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPrice(e.target.value)
    setPrice(formatted)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!price) {
      newErrors.price = "Price is required"
    } else {
      const numericPrice = Number.parseInt(price.replace(/[^0-9]/g, ""))
      if (numericPrice < 1000) {
        newErrors.price = "Please enter a valid price"
      }
    }

    if (!propertyType) {
      newErrors.propertyType = "Property type is required"
    }

    if (!bedrooms) {
      newErrors.bedrooms = "Number of bedrooms is required"
    } else if (Number.parseInt(bedrooms) < 0 || Number.parseInt(bedrooms) > 20) {
      newErrors.bedrooms = "Please enter a valid number of bedrooms"
    }

    if (!bathrooms) {
      newErrors.bathrooms = "Number of bathrooms is required"
    } else if (Number.parseFloat(bathrooms) < 0 || Number.parseFloat(bathrooms) > 20) {
      newErrors.bathrooms = "Please enter a valid number of bathrooms"
    }

    if (squareFootage && (Number.parseInt(squareFootage) < 100 || Number.parseInt(squareFootage) > 50000)) {
      newErrors.squareFootage = "Please enter a valid square footage"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      updateData({
        price: Number.parseInt(price.replace(/[^0-9]/g, "")),
        property_type: propertyType,
        bedrooms: Number.parseInt(bedrooms),
        bathrooms: Number.parseFloat(bathrooms),
        square_footage: squareFootage ? Number.parseInt(squareFootage) : undefined,
      })
      onNext()
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Property Basics
          </CardTitle>
          <CardDescription>Tell us about the key details of your property</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price">Listing Price *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  placeholder="750,000"
                  value={price}
                  onChange={handlePriceChange}
                  className={`pl-10 ${errors.price ? "border-red-500" : ""}`}
                />
              </div>
              {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type *</Label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className={errors.propertyType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single_family">Single Family Home</SelectItem>
                  <SelectItem value="condo">Condominium</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="duplex">Duplex</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="land">Land/Lot</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.propertyType && <p className="text-sm text-red-600">{errors.propertyType}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms *</Label>
                <Select value={bedrooms} onValueChange={setBedrooms}>
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
                    <SelectItem value="6">6+ Bedrooms</SelectItem>
                  </SelectContent>
                </Select>
                {errors.bedrooms && <p className="text-sm text-red-600">{errors.bedrooms}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms *</Label>
                <Select value={bathrooms} onValueChange={setBathrooms}>
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
                    <SelectItem value="4">4+ Bathrooms</SelectItem>
                  </SelectContent>
                </Select>
                {errors.bathrooms && <p className="text-sm text-red-600">{errors.bathrooms}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="squareFootage">Square Footage (optional)</Label>
              <Input
                id="squareFootage"
                placeholder="2,500"
                value={squareFootage}
                onChange={(e) => setSquareFootage(e.target.value.replace(/[^0-9]/g, ""))}
                className={errors.squareFootage ? "border-red-500" : ""}
              />
              {errors.squareFootage && <p className="text-sm text-red-600">{errors.squareFootage}</p>}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">✨ Marketing Boost</h4>
            <p className="text-sm text-green-700">
              Accurate property details help us create more targeted and effective marketing content. The more specific
              you are, the better we can highlight your property's unique selling points.
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onPrevious}>
              Previous
            </Button>
            <Button onClick={handleNext}>Next: Property Features</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
