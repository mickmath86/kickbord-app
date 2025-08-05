"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, ImageIcon, Video, X, Plus } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardMediaUploadProps {
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardMediaUpload({ onNext, onPrevious, isFirstStep }: WizardMediaUploadProps) {
  const { data, updateData } = useCampaignData()
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Add null check for data
  if (!data) {
    return <div>Loading...</div>
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (file.type.startsWith("image/")) {
          updateData({ photos: [...data.photos, result] })
        } else if (file.type.startsWith("video/")) {
          updateData({ videos: [...data.videos, result] })
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const removePhoto = (index: number) => {
    updateData({ photos: data.photos.filter((_, i) => i !== index) })
  }

  const removeVideo = (index: number) => {
    updateData({ videos: data.videos.filter((_, i) => i !== index) })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Media Upload</span>
          </CardTitle>
          <CardDescription>
            Upload photos and videos of your property. High-quality images help create better marketing materials.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Property Media</h3>
            <p className="text-gray-500 mb-4">Drag and drop your photos and videos here, or click to browse</p>
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Plus className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
          </div>

          {/* Photos Grid */}
          {data.photos.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Photos ({data.photos.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Property photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos Grid */}
          {data.videos.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Video className="h-5 w-5" />
                Videos ({data.videos.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.videos.map((video, index) => (
                  <div key={index} className="relative group">
                    <video src={video} className="w-full h-48 object-cover rounded-lg" controls />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                      onClick={() => removeVideo(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Tips for better results:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use high-resolution images (at least 1920x1080)</li>
              <li>• Include exterior shots, interior rooms, and unique features</li>
              <li>• Ensure good lighting and clear, uncluttered spaces</li>
              <li>• Videos should be under 100MB for best performance</li>
            </ul>
          </div>

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={onPrevious} disabled={isFirstStep}>
              Previous
            </Button>
            <Button onClick={onNext}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
