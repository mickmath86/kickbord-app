"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, Image, Video, X, CheckCircle } from 'lucide-react'
import { useCampaignData } from "@/app/dashboard/campaigns/create/context"

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
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const simulateUpload = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const fileId = Math.random().toString(36).substr(2, 9)
      let progress = 0
      
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          setUploadProgress(prev => {
            const newProgress = { ...prev }
            delete newProgress[fileId]
            return newProgress
          })
          resolve(`/placeholder.svg?height=300&width=400&text=${encodeURIComponent(file.name)}`)
        }
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }))
      }, 200)
    })
  }

  const handleFiles = async (files: FileList) => {
    const newFiles: MediaFile[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const fileId = Math.random().toString(36).substr(2, 9)
        
        try {
          const url = await simulateUpload(file)
          const mediaFile: MediaFile = {
            id: fileId,
            name: file.name,
            type: file.type.startsWith('image/') ? 'image' : 'video',
            url,
            size: file.size
          }
          newFiles.push(mediaFile)
        } catch (error) {
          console.error('Upload failed:', error)
        }
      }
    }
    
    setUploadedFiles(prev => [...prev, ...newFiles])
    setIsDragging(false)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    handleFiles(files)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id))
  }

  const handleNext = () => {
    const photos = uploadedFiles.filter(f => f.type === 'image').map(f => f.url)
    const videos = uploadedFiles.filter(f => f.type === 'video').map(f => f.url)
    
    updateData({ photos, videos })
    onNext()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Upload Media</h2>
        <p className="text-muted-foreground">
          Add photos and videos to showcase your property
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Files
            </CardTitle>
            <CardDescription>
              Drag and drop files or click to browse. Supports images and videos.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
              <h3 className="text-lg font-semibold mb-2">
                {isDragging ? 'Drop files here' : 'Upload your media'}
              </h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop files here, or click to select files
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
            </div>
          </CardContent>
        </Card>

        {Object.keys(uploadProgress).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Uploading...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(uploadProgress).map(([fileId, progress]) => (
                <div key={fileId} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading file...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {uploadedFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Uploaded Files ({uploadedFiles.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {file.type === 'image' ? (
                        <img
                          src={file.url || "/placeholder.svg"}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="mt-2">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium mb-2">📸 Media Tips</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Use high-quality images with good lighting</li>
            <li>• Include exterior, interior, and key feature shots</li>
            <li>• Videos can showcase the flow and feel of the space</li>
            <li>• Aim for 10-20 photos for best results</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button onClick={handleNext}>
          Continue
        </Button>
      </div>
    </div>
  )
}
