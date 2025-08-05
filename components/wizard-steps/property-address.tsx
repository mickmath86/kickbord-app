"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Loader2 } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardPropertyAddressProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardPropertyAddress({ onNext, onPrevious, isFirstStep }: WizardPropertyAddressProps) {
  const { data, updateData } = useCampaignData()
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteService = useRef<any>(null)

  useEffect(() => {
    // Initialize Google Places API
    if (typeof window !== "undefined" && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService()
    }
  }, [])

  // Add null check for data
  if (!data) {
    return <div>Loading...</div>
  }

  const handleAddressChange = async (value: string) => {
    updateData({ address: value })

    if (value.length > 2 && autocompleteService.current) {
      setIsLoading(true)
      try {
        const request = {
          input: value,
          types: ["address"],
          componentRestrictions: { country: "us" },
        }

        autocompleteService.current.getPlacePredictions(request, (predictions: any[], status: any) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions.slice(0, 5))
            setShowSuggestions(true)
          } else {
            setSuggestions([])
            setShowSuggestions(false)
          }
          setIsLoading(false)
        })
      } catch (error) {
        console.error("Error fetching address suggestions:", error)
        setIsLoading(false)
      }
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSuggestionSelect = (suggestion: any) => {
    updateData({ address: suggestion.description })
    setSuggestions([])
    setShowSuggestions(false)
  }

  const canProceed = (data.address || "").trim().length > 0 && data.property_type

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Property Address</span>
          </CardTitle>
          <CardDescription>Let's start with the property address and type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address">Property Address *</Label>
            <div className="relative">
              <Input
                ref={inputRef}
                id="address"
                placeholder="Enter the property address..."
                value={data.address || ""}
                onChange={(e) => handleAddressChange(e.target.value)}
                onFocus={() => setShowSuggestions(suggestions.length > 0)}
                className="pr-10"
              />
              {isLoading && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}

              {/* Address Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion.place_id}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium">{suggestion.structured_formatting?.main_text}</div>
                          <div className="text-xs text-gray-500">
                            {suggestion.structured_formatting?.secondary_text}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="property_type">Property Type *</Label>
            <Select value={data.property_type || ""} onValueChange={(value) => updateData({ property_type: value })}>
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
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
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
