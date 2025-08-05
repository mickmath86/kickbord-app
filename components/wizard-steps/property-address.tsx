"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Search } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardPropertyAddressProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

declare global {
  interface Window {
    google: any
    initAutocomplete: () => void
  }
}

export function WizardPropertyAddress({ onNext, onPrevious, isFirstStep }: WizardPropertyAddressProps) {
  const { data, updateData } = useCampaignData()
  const [isLoaded, setIsLoaded] = useState(false)
  const autocompleteRef = useRef<HTMLInputElement>(null)
  const autocompleteInstance = useRef<any>(null)

  useEffect(() => {
    // Load Google Places API
    if (!window.google) {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initAutocomplete`
      script.async = true
      script.defer = true

      window.initAutocomplete = () => {
        setIsLoaded(true)
        initializeAutocomplete()
      }

      document.head.appendChild(script)
    } else {
      setIsLoaded(true)
      initializeAutocomplete()
    }

    return () => {
      if (autocompleteInstance.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteInstance.current)
      }
    }
  }, [])

  const initializeAutocomplete = () => {
    if (!autocompleteRef.current || !window.google) return

    autocompleteInstance.current = new window.google.maps.places.Autocomplete(autocompleteRef.current, {
      types: ["address"],
      componentRestrictions: { country: "us" },
    })

    autocompleteInstance.current.addListener("place_changed", () => {
      const place = autocompleteInstance.current.getPlace()
      if (place.formatted_address) {
        updateData({ address: place.formatted_address })
      }
    })
  }

  const handleManualInput = (value: string) => {
    updateData({ address: value })
  }

  const isFormValid = () => {
    return data.address.trim().length > 0
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold mb-4">What's the property address?</h2>
        <p className="text-lg text-muted-foreground">
          Enter the full address of the property you want to create marketing materials for
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Property Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Full Address *</Label>
            <Input
              ref={autocompleteRef}
              id="address"
              placeholder="Start typing the property address..."
              value={data.address}
              onChange={(e) => handleManualInput(e.target.value)}
              className="text-lg py-3"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {isLoaded ? "Start typing and we'll help you find the exact address" : "Loading address suggestions..."}
            </p>
          </div>

          {data.address && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Selected Address:</p>
                  <p className="text-green-700">{data.address}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Why do we need this?</h3>
        <p className="text-sm text-blue-700">
          The property address helps us create location-specific marketing copy and ensures accuracy in your listing
          materials.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={onPrevious} disabled={isFirstStep} size="lg">
          Previous
        </Button>
        <Button onClick={onNext} disabled={!isFormValid()} size="lg">
          Next: Property Details
        </Button>
      </div>
    </div>
  )
}
