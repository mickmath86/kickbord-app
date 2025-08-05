"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, ImageIcon, Video, ExternalLink } from "lucide-react"
import { useCampaignData } from "@/components/campaign-wizard"

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
  const photoInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
    handlePhotoFiles(files)
  }

  const handlePhotoFiles = (files: File[]) => {
    // In a real app, you would upload these files and get URLs back
    const newPhotoUrls = files.map((file) => URL.createObjectURL(file))
    updateData({ photos: [...data.photos, ...newPhotoUrls].slice(0, 10) })
  }

  const handleVideoFiles = (files: File[]) => {
    // In a real app, you would upload these files and get URLs back
    const newVideoUrls = files.map((file) => URL.createObjectURL(file))
    updateData({ videos: [...data.videos, ...newVideoUrls] })
  }

  const removePhoto = (index: number) => {
    const updatedPhotos = data.photos.filter((_, i) => i !== index)
    updateData({ photos: updatedPhotos })
  }

  const removeVideo = (index: number) => {
    const updatedVideos = data.videos.filter((_, i) => i !== index)
    updateData({ videos: updatedVideos })
  }

  const isFormValid = () => {
    return data.photos.length >= 1
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Upload Media</h2>
        <p className="text-muted-foreground">
          Add photos and videos to showcase your property (minimum 1 photo required)
        </p>
      </div>

      {/* Photo Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Photos (1-10 required)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handlePhotoDrop}
          >
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">Drop photos here or click to upload</p>
            <p className="text-sm text-muted-foreground mb-4">Supports JPG, PNG, WebP (max 10 photos)</p>
            <Button variant="outline" onClick={() => photoInputRef.current?.click()}>
              Choose Photos
            </Button>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  handlePhotoFiles(Array.from(e.target.files))
                }
              }}
            />
          </div>

          {/* Photo Preview */}
          {data.photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {data.photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo || "/placeholder.svg"}
                    alt={`Property photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Video Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Videos (optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Video className="h-10 w-10 mx-auto text-gray-400 mb-3" />
            <p className="font-medium mb-2">Add video clips</p>
            <p className="text-sm text-muted-foreground mb-4">Supports MP4, MOV, AVI</p>
            <Button variant="outline" onClick={() => videoInputRef.current?.click()}>
              Choose Videos
            </Button>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  handleVideoFiles(Array.from(e.target.files))
                }
              }}
            />
          </div>

          {/* Video Preview */}
          {data.videos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {data.videos.map((video, index) => (
                <div key={index} className="relative group">
                  <video src={video} className="w-full h-32 object-cover rounded border" controls />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeVideo(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Need Help Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900">Need visuals?</h3>
              <p className="text-sm text-blue-700">
                Don't have professional photos? We can help you find a local photographer.
              </p>
            </div>
            <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 bg-transparent">
              <ExternalLink className="h-4 w-4 mr-2" />
              Find a Photographer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={onNext} disabled={!isFormValid()}>
          Next: Ad Preferences
        </Button>
      </div>
    </div>
  )
}
