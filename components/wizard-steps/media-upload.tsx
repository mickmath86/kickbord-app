"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, ImageIcon, Video, X, Camera } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardMediaUploadProps {
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardMediaUpload({ onNext, onPrevious, isFirstStep }: WizardMediaUploadProps) {
  const { data, updateData } = useCampaignData()
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFiles = (files: FileList) => {
    const newPhotos: string[] = []
    const newVideos: string[] = []

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      if (file.type.startsWith("image/")) {
        newPhotos.push(url)
      } else if (file.type.startsWith("video/")) {
        newVideos.push(url)
      }
    })

    updateData({
      photos: [...data.photos, ...newPhotos],
      videos: [...data.videos, ...newVideos],
    })
  }

  const removePhoto = (index: number) => {
    const newPhotos = data.photos.filter((_, i) => i !== index)
    updateData({ photos: newPhotos })
  }

  const removeVideo = (index: number) => {
    const newVideos = data.videos.filter((_, i) => i !== index)
    updateData({ videos: newVideos })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Upload Property Media</h2>
        <p className="text-lg text-muted-foreground">Add photos and videos to showcase your property's best features</p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Photos & Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">Drag and drop your files here</p>
            <p className="text-muted-foreground mb-4">or click to browse</p>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer bg-transparent">
                Choose Files
              </Button>
            </label>
            <p className="text-sm text-muted-foreground mt-4">Supports JPG, PNG, MP4, MOV files up to 50MB each</p>
          </div>
        </CardContent>
      </Card>

      {/* Photos Grid */}
      {data.photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Photos ({data.photos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo || "/placeholder.svg"}
                    alt={`Property photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {index === 0 && <Badge className="absolute bottom-2 left-2 bg-blue-600">Primary</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Videos Grid */}
      {data.videos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Videos ({data.videos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.videos.map((video, index) => (
                <div key={index} className="relative group">
                  <video src={video} className="w-full h-48 object-cover rounded-lg" controls />
                  <button
                    onClick={() => removeVideo(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-medium text-blue-900 mb-3">Tips for Great Property Photos</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use natural lighting when possible</li>
          <li>• Include exterior shots, main living areas, and unique features</li>
          <li>• Take photos from multiple angles</li>
          <li>• Ensure rooms are clean and well-staged</li>
          <li>• The first photo will be used as the primary image</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={onPrevious} disabled={isFirstStep} size="lg">
          Previous
        </Button>
        <Button onClick={onNext} size="lg">
          Next: Marketing Preferences
        </Button>
      </div>
    </div>
  )
}
