"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, X, ExternalLink } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardMediaUploadProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardMediaUpload({ onNext, onPrevious }: WizardMediaUploadProps) {
  const { data, updateData } = useCampaignData()
  const [dragOver, setDragOver] = useState(false)

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    const newPhotos = Array.from(files).map((file) => {
      return URL.createObjectURL(file)
    })

    updateData({ photos: [...data.photos, ...newPhotos] })
  }

  const removePhoto = (index: number) => {
    const updatedPhotos = data.photos.filter((_, i) => i !== index)
    updateData({ photos: updatedPhotos })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const isFormValid = () => {
    return data.photos.length >= 1
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Media Upload</h2>
        <p className="text-lg text-muted-foreground">Upload photos and videos to showcase your property</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Photo Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Property Photos *</CardTitle>
            <p className="text-sm text-muted-foreground">Upload 1-10 high-quality photos of your property</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium">Drop photos here or click to upload</p>
                <p className="text-sm text-muted-foreground">PNG, JPG, JPEG up to 10MB each</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="photo-upload"
              />
              <Label htmlFor="photo-upload">
                <Button variant="outline" className="mt-4 bg-transparent" asChild>
                  <span>Choose Files</span>
                </Button>
              </Label>
            </div>

            {/* Photo Preview */}
            {data.photos.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {data.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Property photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Video Upload & Help */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Videos (Optional)</CardTitle>
              <p className="text-sm text-muted-foreground">Upload walkthrough videos or virtual tours</p>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                <p className="text-sm font-medium mb-2">Upload videos</p>
                <p className="text-xs text-muted-foreground mb-3">MP4, MOV up to 100MB each</p>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      const newVideos = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
                      updateData({ videos: [...data.videos, ...newVideos] })
                    }
                  }}
                  className="hidden"
                  id="video-upload"
                />
                <Label htmlFor="video-upload">
                  <Button variant="outline" size="sm" asChild>
                    <span>Choose Videos</span>
                  </Button>
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Professional Photos?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                High-quality photos can significantly improve your listing's performance. Consider hiring a professional
                photographer.
              </p>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <ExternalLink className="h-4 w-4 mr-2" />
                Find a Local Photographer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={onPrevious} size="lg">
          Previous
        </Button>
        <Button onClick={onNext} disabled={!isFormValid()} size="lg">
          Next: Ad Preferences
        </Button>
      </div>
    </div>
  )
}
