"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home, DollarSign } from 'lucide-react'
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
  const [formData, setFormData] = useState({
    property_type: data.property_type || "",
    price: data.price?.toString() || "",
    bedrooms: data.bedrooms?.toString() || "",
    bathrooms: data.bathrooms?.toString() || "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    updateData({
      property_type: formData.property_type,
      price: formData.price ? parseFloat(formData.price.replace(/,/g, '')) : null,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
    })
    onNext()
  }

  const formatPrice = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '')
    if (!numericValue) return ''
    return parseInt(numericValue).toLocaleString()
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPrice(e.target.value)
    handleInputChange('price', formatted)
  }

  const canProceed = formData.property_type && formData.price && formData.bedrooms && formData.bathrooms

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Home className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle>Property Basics</CardTitle>
          <CardDescription>
            Tell us the essential details about your property
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="property_type">Property Type</Label>
              <Select value={formData.property_type} onValueChange={(value) => handleInputChange('property_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-family">Single Family Home</SelectItem>
                  <SelectItem value="condo">Condominium</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="duplex">Duplex</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="land">Land/Lot</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Listing Price</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  placeholder="500,000"
                  value={formData.price}
                  onChange={handlePriceChange}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Select value={formData.bedrooms} onValueChange={(value) => handleInputChange('bedrooms', value)}>
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

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Select value={formData.bathrooms} onValueChange={(value) => handleInputChange('bathrooms', value)}>
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
          </div>

          {formData.property_type && formData.price && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-1">Property Summary</h4>
              <p className="text-green-700">
                {formData.bedrooms} bed, {formData.bathrooms} bath {formData.property_type.replace('-', ' ')} 
                listed at ${formData.price}
              </p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onPrevious}>
              Back
            </Button>
            <Button onClick={handleNext} disabled={!canProceed}>
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
