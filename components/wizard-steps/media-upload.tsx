"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageIcon, Upload, X, Video, Plus } from "lucide-react"
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
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newPhotos: string[] = []
    const newVideos: string[] = []

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file)
        newPhotos.push(url)
      } else if (file.type.startsWith("video/")) {
        const url = URL.createObjectURL(file)
        newVideos.push(url)
      }
    })

    updateData({
      photos: [...data.photos, ...newPhotos],
      videos: [...data.videos, ...newVideos],
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const removePhoto = (index: number) => {
    const newPhotos = data.photos.filter((_, i) => i !== index)
    updateData({ photos: newPhotos })
  }

  const removeVideo = (index: number) => {
    const newVideos = data.videos.filter((_, i) => i !== index)
    updateData({ videos: newVideos })
  }

  const totalMedia = data.photos.length + data.videos.length

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ImageIcon className="h-5 w-5" />
            <span>Property Media</span>
          </CardTitle>
          <CardDescription>Upload photos and videos of your property (optional but recommended)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Drag and drop your files here</p>
              <p className="text-sm text-muted-foreground">or click to browse your files</p>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Media Preview */}
          {totalMedia > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Uploaded Media</h3>
                <span className="text-sm text-muted-foreground">
                  {totalMedia} file{totalMedia !== 1 ? "s" : ""} uploaded
                </span>
              </div>

              {/* Photos */}
              {data.photos.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center space-x-2">
                    <ImageIcon className="h-4 w-4" />
                    <span>Photos ({data.photos.length})</span>
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {data.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`Property photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {data.videos.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center space-x-2">
                    <Video className="h-4 w-4" />
                    <span>Videos ({data.videos.length})</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {data.videos.map((video, index) => (
                      <div key={index} className="relative group">
                        <video src={video} className="w-full h-24 object-cover rounded-lg border" controls={false} />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                          <Video className="h-6 w-6 text-white" />
                        </div>
                        <button
                          onClick={() => removeVideo(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {totalMedia === 0 && (
            <div className="text-center py-8">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="text-muted-foreground">
                No media uploaded yet. You can skip this step and add media later.
              </p>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onPrevious}>
              Previous
            </Button>
            <Button onClick={onNext}>{totalMedia > 0 ? "Continue with Media" : "Skip for Now"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
