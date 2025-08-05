"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, ImageIcon, X, Camera, Video, ExternalLink } from "lucide-react"
import { useCampaignData } from "@/components/campaign-wizard"
import { useState, useRef } from "react"

interface WizardMediaUploadProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardMediaUpload({ onNext, onPrevious }: WizardMediaUploadProps) {
  const { data, updateData } = useCampaignData()
  const [isDragging, setIsDragging] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null, type: "photos" | "videos") => {
    if (!files) return

    const newUrls: string[] = []
    Array.from(files).forEach((file) => {
      const isValidType = type === "photos" ? file.type.startsWith("image/") : file.type.startsWith("video/")

      if (isValidType) {
        const url = URL.createObjectURL(file)
        newUrls.push(url)
      }
    })

    if (type === "photos") {
      updateData({ photos: [...data.photos, ...newUrls].slice(0, 10) }) // Max 10 photos
    } else {
      updateData({ videos: [...data.videos, ...newUrls] })
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    // Check if files are images or videos
    const files = Array.from(e.dataTransfer.files)
    const photos = files.filter((f) => f.type.startsWith("image/"))
    const videos = files.filter((f) => f.type.startsWith("video/"))

    if (photos.length > 0) {
      const photoList = new DataTransfer()
      photos.forEach((f) => photoList.items.add(f))
      handleFileSelect(photoList.files, "photos")
    }

    if (videos.length > 0) {
      const videoList = new DataTransfer()
      videos.forEach((f) => videoList.items.add(f))
      handleFileSelect(videoList.files, "videos")
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const removeMedia = (index: number, type: "photos" | "videos") => {
    if (type === "photos") {
      const newPhotos = data.photos.filter((_, i) => i !== index)
      updateData({ photos: newPhotos })
    } else {
      const newVideos = data.videos.filter((_, i) => i !== index)
      updateData({ videos: newVideos })
    }
  }

  const openFileDialog = (type: "photos" | "videos") => {
    if (type === "photos") {
      photoInputRef.current?.click()
    } else {
      videoInputRef.current?.click()
    }
  }

  const hasMinPhotos = data.photos.length >= 1

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Media Upload</h2>
        <p className="text-muted-foreground">Upload photos and videos to enhance your marketing materials</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Photos</h3>
            <Badge variant={hasMinPhotos ? "default" : "secondary"}>
              {data.photos.length}/10 {hasMinPhotos ? "✓" : "(min 1)"}
            </Badge>
          </div>

          <Card
            className={`border-2 border-dashed transition-colors cursor-pointer ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => openFileDialog("photos")}
          >
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Upload className="h-8 w-8 text-muted-foreground mb-3" />
              <div className="text-center">
                <p className="font-medium mb-1">Drop photos here or click to upload</p>
                <p className="text-sm text-muted-foreground mb-3">JPG, PNG, WebP up to 10MB each</p>
                <Button variant="outline" size="sm">
                  <Camera className="mr-2 h-4 w-4" />
                  Choose Photos
                </Button>
              </div>
            </CardContent>
          </Card>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Video Clips (Optional)</h3>
              <Badge variant="secondary">{data.videos.length}</Badge>
            </div>

            <Card
              className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer"
              onClick={() => openFileDialog("videos")}
            >
              <CardContent className="flex flex-col items-center justify-center py-6">
                <Video className="h-6 w-6 text-muted-foreground mb-2" />
                <p className="text-sm font-medium mb-1">Upload video clips</p>
                <p className="text-xs text-muted-foreground">MP4, MOV up to 50MB</p>
              </CardContent>
            </Card>
          </div>

          {/* No Assets Section */}
          {data.photos.length === 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Need visuals?</h4>
                <p className="text-blue-800 text-sm mb-3">
                  Professional photos can significantly improve your marketing results.
                </p>
                <Button variant="outline" size="sm" className="text-blue-700 border-blue-300 bg-transparent">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Find a local photographer
                </Button>
              </CardContent>
            </Card>
          )}

          <input
            ref={photoInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files, "photos")}
          />

          <input
            ref={videoInputRef}
            type="file"
            multiple
            accept="video/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files, "videos")}
          />
        </div>

        {/* Preview Area */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Uploaded Media</h3>

          {/* Photos Preview */}
          {data.photos.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Photos</h4>
              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                {data.photos.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Property photo ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <button
                      onClick={() => removeMedia(index, "photos")}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos Preview */}
          {data.videos.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Videos</h4>
              <div className="space-y-2">
                {data.videos.map((url, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <Video className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Video {index + 1}</span>
                    </div>
                    <button onClick={() => removeMedia(index, "videos")} className="text-red-500 hover:text-red-700">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.photos.length === 0 && data.videos.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No media uploaded yet
                  <br />
                  <span className="text-sm">Media will appear here once uploaded</span>
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={onNext} disabled={!hasMinPhotos} className="bg-blue-600 hover:bg-blue-700">
          Next: Ad Preferences
        </Button>
      </div>
    </div>
  )
}
