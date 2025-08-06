"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Image, Video, X } from 'lucide-react'
import { useCampaignData } from "@/app/dashboard/campaigns/create/context"

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    // Handle file drop logic here
  }

  const removePhoto = (index: number) => {
    const updatedPhotos = data.photos.filter((_, i) => i !== index)
    updateData({ photos: updatedPhotos })
  }

  const removeVideo = (index: number) => {
    const updatedVideos = data.videos.filter((_, i) => i !== index)
    updateData({ videos: updatedVideos })
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Media Upload</h2>
        <p className="text-muted-foreground">
          Upload photos and videos to showcase your property's best features
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Photo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Property Photos
            </CardTitle>
            <CardDescription>
              Upload high-quality photos of your property (recommended: 10-20 photos)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Drop photos here</p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse files
              </p>
              <Button variant="outline">
                Choose Photos
              </Button>
            </div>

            {data.photos.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Uploaded Photos ({data.photos.length})</h4>
                <div className="grid grid-cols-3 gap-3">
                  {data.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo || "/placeholder.svg"}
                        alt={`Property photo ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
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
          </CardContent>
        </Card>

        {/* Video Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Property Videos
            </CardTitle>
            <CardDescription>
              Upload walkthrough videos or virtual tours (optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Drop videos here</p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse files
              </p>
              <Button variant="outline">
                Choose Videos
              </Button>
            </div>

            {data.videos.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Uploaded Videos ({data.videos.length})</h4>
                <div className="space-y-3">
                  {data.videos.map((video, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Video className="h-5 w-5 text-gray-500" />
                        <span className="text-sm">Video {index + 1}</span>
                      </div>
                      <button
                        onClick={() => removeVideo(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">📸 Photo Tips for Better Results</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Take photos during the day with natural lighting</li>
          <li>• Include exterior shots, all rooms, and key features</li>
          <li>• Use landscape orientation for better composition</li>
          <li>• Ensure photos are high resolution (at least 1920x1080)</li>
        </ul>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  )
}
