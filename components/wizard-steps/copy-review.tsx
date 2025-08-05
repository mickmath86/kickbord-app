"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit3, CheckCircle, RefreshCw } from "lucide-react"
import { useCampaignData } from "@/components/campaign-wizard"
import { useState } from "react"

interface WizardCopyReviewProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const copyTypes = [
  { key: "headline", label: "Headline" },
  { key: "eyebrow", label: "Eyebrow" },
  { key: "subCopy", label: "Sub Copy" },
  { key: "fullBio", label: "Full Listing Bio" },
  { key: "amenities", label: "Amenities" },
  { key: "cta", label: "Call To Action" },
]

const materialTabs = [
  { id: "facebook", label: "Facebook", icon: "📘" },
  { id: "instagram", label: "Instagram", icon: "📷" },
  { id: "google", label: "Google", icon: "🌐" },
  { id: "pdf", label: "PDF", icon: "📄" },
  { id: "landing", label: "Landing Page", icon: "🏠" },
]

export function WizardCopyReview({ onNext, onPrevious }: WizardCopyReviewProps) {
  const { data, updateData } = useCampaignData()
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({})
  const [feedback, setFeedback] = useState<Record<string, Record<number, string>>>({})
  const [showFeedback, setShowFeedback] = useState<Record<string, number | null>>({})
  const [activeTab, setActiveTab] = useState("facebook")
  const [regeneratingCopy, setRegeneratingCopy] = useState<string | null>(null)

  const selectOption = (copyType: string, optionIndex: number) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [copyType]: optionIndex,
    }))
  }

  const toggleFeedback = (copyType: string, optionIndex: number) => {
    setShowFeedback((prev) => ({
      ...prev,
      [copyType]: prev[copyType] === optionIndex ? null : optionIndex,
    }))
  }

  const updateFeedback = (copyType: string, optionIndex: number, feedbackText: string) => {
    setFeedback((prev) => ({
      ...prev,
      [copyType]: {
        ...prev[copyType],
        [optionIndex]: feedbackText,
      },
    }))
  }

  const regenerateCopy = async (copyType: string, optionIndex: number) => {
    setRegeneratingCopy(`${copyType}-${optionIndex}`)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate new copy based on feedback
    const feedbackText = feedback[copyType]?.[optionIndex] || ""
    const currentCopy = data.generated_copy[copyType][optionIndex]

    // Mock regeneration - in real app this would call AI API
    const newCopy = `${currentCopy} (Updated based on feedback: ${feedbackText})`

    const updatedCopy = { ...data.generated_copy }
    updatedCopy[copyType][optionIndex] = newCopy

    updateData({ generated_copy: updatedCopy })
    setRegeneratingCopy(null)
  }

  const lockCopy = () => {
    updateData({
      selected_copy: selectedOptions,
      feedback: feedback,
    })
    onNext()
  }

  const hasSelections = Object.keys(selectedOptions).length > 0

  if (!data.generated_copy) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <p className="text-muted-foreground">No generated copy available</p>
      </div>
    )
  }

  // Get selected copy for preview
  const getSelectedCopy = (copyType: string) => {
    const selectedIndex = selectedOptions[copyType]
    if (selectedIndex !== undefined && data.generated_copy[copyType]) {
      return data.generated_copy[copyType][selectedIndex]
    }
    return data.generated_copy[copyType]?.[0] || ""
  }

  const AdPreview = ({ type }: { type: string }) => {
    const headline = getSelectedCopy("headline")
    const eyebrow = getSelectedCopy("eyebrow")
    const subCopy = getSelectedCopy("subCopy")
    const cta = getSelectedCopy("cta")

    switch (type) {
      case "facebook":
        return (
          <div className="bg-white border rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                A
              </div>
              <div>
                <p className="font-semibold text-sm">Agent Name</p>
                <p className="text-xs text-gray-500">Sponsored</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-blue-600 font-medium">{eyebrow}</p>
              <h3 className="font-bold text-lg">{headline}</h3>
              <p className="text-sm text-gray-600">{subCopy}</p>
              <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500">Property Image</span>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm">{cta}</Button>
            </div>
          </div>
        )
      case "instagram":
        return (
          <div className="bg-white border rounded-lg max-w-md mx-auto">
            <div className="flex items-center space-x-2 p-3 border-b">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm">
                A
              </div>
              <p className="font-semibold text-sm">agent_name</p>
            </div>
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Property Image</span>
            </div>
            <div className="p-3 space-y-2">
              <p className="text-xs text-purple-600 font-medium">{eyebrow}</p>
              <h3 className="font-bold">{headline}</h3>
              <p className="text-sm text-gray-600">{subCopy}</p>
              <Button variant="outline" className="w-full text-sm bg-transparent">
                {cta}
              </Button>
            </div>
          </div>
        )
      case "google":
        return (
          <div className="bg-white border rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-start space-x-3">
              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-gray-500">Image</span>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs text-green-600">Ad • agent-website.com</p>
                <h3 className="text-blue-600 font-medium text-lg hover:underline cursor-pointer">{headline}</h3>
                <p className="text-sm text-gray-600">{subCopy}</p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  {cta}
                </Button>
              </div>
            </div>
          </div>
        )
      case "pdf":
        return (
          <div className="bg-white border rounded-lg p-6 max-w-md mx-auto">
            <div className="text-center space-y-4">
              <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">{eyebrow}</p>
              <h1 className="text-2xl font-bold">{headline}</h1>
              <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500">Property Image</span>
              </div>
              <p className="text-sm text-gray-600">{subCopy}</p>
              <div className="border-t pt-4">
                <p className="font-semibold">{cta}</p>
                <p className="text-xs text-gray-500">Contact: (555) 123-4567</p>
              </div>
            </div>
          </div>
        )
      case "landing":
        return (
          <div className="bg-white border rounded-lg p-6 max-w-md mx-auto">
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">{eyebrow}</p>
                <h1 className="text-3xl font-bold mt-2">{headline}</h1>
              </div>
              <div className="w-full h-40 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500">Hero Image</span>
              </div>
              <p className="text-center text-gray-600">{subCopy}</p>
              <div className="space-y-2">
                <input className="w-full p-2 border rounded" placeholder="Your Name" />
                <input className="w-full p-2 border rounded" placeholder="Email Address" />
                <input className="w-full p-2 border rounded" placeholder="Phone Number" />
                <Button className="w-full bg-blue-600 hover:bg-blue-700">{cta}</Button>
              </div>
            </div>
          </div>
        )
      default:
        return <div>Preview not available</div>
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Copy Output Review & Feedback</h2>
        <p className="text-muted-foreground">
          Review the generated copy options and select your favorites. See how they look in real-time on the left.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Side - Ad Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Live Preview</h3>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              {materialTabs
                .filter((tab) => data.materials_to_generate.includes(tab.id) || tab.id === "landing")
                .map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
                    <span className="mr-1">{tab.icon}</span>
                    {tab.label}
                  </TabsTrigger>
                ))}
            </TabsList>
            {materialTabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="mt-4">
                <AdPreview type={tab.id} />
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Right Side - Copy Options */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Copy Options</h3>

          {copyTypes.map((copyType) => {
            const options = data.generated_copy[copyType.key] || []

            return (
              <div key={copyType.key}>
                <h4 className="font-medium mb-3">{copyType.label}</h4>

                <div className="space-y-3">
                  {options.map((option: any, index: number) => {
                    const isSelected = selectedOptions[copyType.key] === index
                    const showFeedbackBox = showFeedback[copyType.key] === index
                    const isRegenerating = regeneratingCopy === `${copyType.key}-${index}`

                    return (
                      <Card
                        key={index}
                        className={`cursor-pointer transition-all ${
                          isSelected ? "ring-2 ring-green-600 bg-green-50" : "hover:shadow-md"
                        }`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1" onClick={() => selectOption(copyType.key, index)}>
                              {copyType.key === "amenities" ? (
                                <ul className="list-disc list-inside space-y-1">
                                  {option.map((amenity: string, i: number) => (
                                    <li key={i} className="text-sm">
                                      {amenity}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm">{option}</p>
                              )}
                            </div>

                            <div className="flex items-center space-x-2 ml-4">
                              {isSelected && (
                                <Badge className="bg-green-600">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Selected
                                </Badge>
                              )}
                              <Button variant="ghost" size="sm" onClick={() => toggleFeedback(copyType.key, index)}>
                                <Edit3 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>

                        {showFeedbackBox && (
                          <CardContent className="pt-0">
                            <div className="border-t pt-3 space-y-3">
                              <label className="text-sm font-medium text-muted-foreground block">
                                What would you like to change?
                              </label>
                              <Textarea
                                placeholder="Provide your feedback here..."
                                value={feedback[copyType.key]?.[index] || ""}
                                onChange={(e) => updateFeedback(copyType.key, index, e.target.value)}
                                rows={3}
                              />
                              <Button
                                size="sm"
                                onClick={() => regenerateCopy(copyType.key, index)}
                                disabled={isRegenerating || !feedback[copyType.key]?.[index]}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                {isRegenerating ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Regenerating...
                                  </>
                                ) : (
                                  <>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Regenerate with Feedback
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={lockCopy} disabled={!hasSelections} className="bg-blue-600 hover:bg-blue-700">
          Lock Copy
        </Button>
      </div>
    </div>
  )
}
