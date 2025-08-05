"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, ImageIcon, X, Camera } from "lucide-react"
import type { CampaignData } from "@/components/campaign-wizard"
import { useState, useRef } from "react"

interface WizardMediaUploadProps {
  data: CampaignData
  updateData: (updates: Partial<CampaignData>) => void
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export function WizardMediaUpload({ data, updateData, onNext, onPrevious }: WizardMediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newUrls: string[] = []
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        // In a real app, you'd upload to storage and get back URLs
        // For now, we'll create object URLs for preview
        const url = URL.createObjectURL(file)
        newUrls.push(url)
      }
    })

    updateData({ media_urls: [...data.media_urls, ...newUrls] })
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

  const removeImage = (index: number) => {
    const newUrls = data.media_urls.filter((_, i) => i !== index)
    updateData({ media_urls: newUrls })
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Media Upload</h2>
        <p className="text-muted-foreground">
          Upload photos of your property to enhance your marketing materials (optional)
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload Area */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Property Photos</h3>

          <Card
            className={`border-2 border-dashed transition-colors cursor-pointer ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={openFileDialog}
          >
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <div className="text-center">
                <p className="text-lg font-medium mb-2">Drop photos here or click to upload</p>
                <p className="text-sm text-muted-foreground mb-4">Support for JPG, PNG, WebP files up to 10MB each</p>
                <Button variant="outline" size="sm">
                  <Camera className="mr-2 h-4 w-4" />
                  Choose Files
                </Button>
              </div>
            </CardContent>
          </Card>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Photo Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Include exterior shots, key rooms, and unique features</p>
              <p>• Use good lighting and avoid blurry images</p>
              <p>• Wide-angle shots work best for rooms</p>
              <p>• Consider professional photography for luxury listings</p>
            </CardContent>
          </Card>
        </div>

        {/* Preview Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Uploaded Photos</h3>
            {data.media_urls.length > 0 && <Badge variant="secondary">{data.media_urls.length} photos</Badge>}
          </div>

          {data.media_urls.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No photos uploaded yet
                  <br />
                  <span className="text-sm">Photos will appear here once uploaded</span>
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {data.media_urls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`Property photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {data.media_urls.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">Ready for Generation</h4>
              <p className="text-green-800 text-sm">
                Your photos will be used to create visual mockups and enhance your marketing materials.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700">
          Next: Review & Submit
        </Button>
      </div>
    </div>
  )
}
