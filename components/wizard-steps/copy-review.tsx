"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Edit3, CheckCircle } from "lucide-react"
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

export function WizardCopyReview({ onNext, onPrevious }: WizardCopyReviewProps) {
  const { data, updateData } = useCampaignData()
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({})
  const [feedback, setFeedback] = useState<Record<string, Record<number, string>>>({})
  const [showFeedback, setShowFeedback] = useState<Record<string, number | null>>({})

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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Copy Output Review & Feedback</h2>
        <p className="text-muted-foreground">
          Review the generated copy options and select your favorites. Provide feedback to improve any options.
        </p>
      </div>

      <div className="space-y-8">
        {copyTypes.map((copyType) => {
          const options = data.generated_copy[copyType.key] || []

          return (
            <div key={copyType.key}>
              <h3 className="text-lg font-semibold mb-4">{copyType.label}</h3>

              <div className="space-y-4">
                {options.map((option: any, index: number) => {
                  const isSelected = selectedOptions[copyType.key] === index
                  const showFeedbackBox = showFeedback[copyType.key] === index

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
                          <div className="border-t pt-3">
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">
                              What would you like to change?
                            </label>
                            <Textarea
                              placeholder="Provide your feedback here..."
                              value={feedback[copyType.key]?.[index] || ""}
                              onChange={(e) => updateFeedback(copyType.key, index, e.target.value)}
                              rows={3}
                            />
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

      <div className="flex justify-between pt-6">
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
