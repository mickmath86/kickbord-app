"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Upload, X, Image, Video } from 'lucide-react'
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardMediaUploadProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

interface MediaFile {
  id: string
  name: string
  type: 'image' | 'video'
  url: string
  size: number
}

export function WizardMediaUpload({ onNext, onPrevious }: WizardMediaUploadProps) {
  const { data, updateData } = useCampaignData()
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = (files: File[]) => {
    const newFiles: MediaFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type.startsWith('video/') ? 'video' : 'image',
      url: URL.createObjectURL(file),
      size: file.size
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleNext = () => {
    const photos = uploadedFiles.filter(f => f.type === 'image').map(f => f.url)
    const videos = uploadedFiles.filter(f => f.type === 'video').map(f => f.url)
    
    updateData({ photos, videos })
    onNext()
  }

  const imageCount = uploadedFiles.filter(f => f.type === 'image').length
  const videoCount = uploadedFiles.filter(f => f.type === 'video').length

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Camera className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle>Media Upload</CardTitle>
          <CardDescription>
            Upload photos and videos to showcase your property (optional)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {isDragging ? 'Drop files here' : 'Upload Property Media'}
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop files here, or click to browse
            </p>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <Button asChild variant="outline">
              <label htmlFor="file-upload" className="cursor-pointer">
                Choose Files
              </label>
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Supports: JPG, PNG, MP4, MOV (Max 10MB each)
            </p>
          </div>

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Uploaded Files</h4>
                <div className="flex gap-2">
                  {imageCount > 0 && (
                    <Badge variant="secondary">
                      <Image className="h-3 w-3 mr-1" />
                      {imageCount} photo{imageCount !== 1 ? 's' : ''}
                    </Badge>
                  )}
                  {videoCount > 0 && (
                    <Badge variant="secondary">
                      <Video className="h-3 w-3 mr-1" />
                      {videoCount} video{videoCount !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="p-2 bg-gray-100 rounded">
                      {file.type === 'image' ? (
                        <Image className="h-4 w-4" />
                      ) : (
                        <Video className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-medium mb-2">📸 Photo Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Include exterior shots, key rooms, and unique features</li>
              <li>• Use good lighting and clean, staged spaces</li>
              <li>• High-resolution images work best for marketing materials</li>
            </ul>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onPrevious}>
              Back
            </Button>
            <Button onClick={handleNext}>
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
