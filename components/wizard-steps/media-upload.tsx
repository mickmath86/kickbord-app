"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, ImageIcon, X, Camera } from "lucide-react"
import { useCampaignData } from "@/app/dashboard/campaigns/create/page"

interface WizardMediaUploadProps {
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

interface UploadedFile {
  id: string
  file: File
  preview: string
  type: "exterior" | "interior" | "other"
}

export function WizardMediaUpload({ onNext, onPrevious }: WizardMediaUploadProps) {
  const { data, updateData } = useCampaignData()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
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
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))

    imageFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: e.target?.result as string,
          type: "other",
        }
        setUploadedFiles((prev) => [...prev, newFile])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const updateFileType = (id: string, type: "exterior" | "interior" | "other") => {
    setUploadedFiles((prev) => prev.map((file) => (file.id === id ? { ...file, type } : file)))
  }

  const handleNext = () => {
    updateData({
      uploaded_photos: uploadedFiles.map((file) => ({
        name: file.file.name,
        type: file.type,
        size: file.file.size,
      })),
    })
    onNext()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Upload Property Photos
          </CardTitle>
          <CardDescription>Add high-quality photos to showcase your property</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Drag and drop your photos here</h3>
            <p className="text-muted-foreground mb-4">or click to browse your files</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer bg-transparent">
                <ImageIcon className="h-4 w-4 mr-2" />
                Choose Photos
              </Button>
            </label>
            <p className="text-xs text-muted-foreground mt-2">Supports JPG, PNG, WebP up to 10MB each</p>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Uploaded Photos ({uploadedFiles.length})</h4>
                <Badge variant="secondary">
                  {uploadedFiles.length} photo{uploadedFiles.length !== 1 ? "s" : ""}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={file.preview || "/placeholder.svg"}
                        alt={file.file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>

                    {/* Type Selector */}
                    <div className="mt-2 space-y-1">
                      <p className="text-xs font-medium truncate">{file.file.name}</p>
                      <select
                        value={file.type}
                        onChange={(e) => updateFileType(file.id, e.target.value as any)}
                        className="w-full text-xs border rounded px-2 py-1"
                      >
                        <option value="other">General</option>
                        <option value="exterior">Exterior</option>
                        <option value="interior">Interior</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-amber-900 mb-2">📸 Photo Tips</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Use natural lighting when possible</li>
              <li>• Include both exterior and interior shots</li>
              <li>• Highlight key features and selling points</li>
              <li>• Ensure photos are high resolution and well-composed</li>
            </ul>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onPrevious}>
              Previous
            </Button>
            <Button onClick={handleNext}>
              {uploadedFiles.length > 0 ? "Next: Marketing Preferences" : "Skip Photos"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
