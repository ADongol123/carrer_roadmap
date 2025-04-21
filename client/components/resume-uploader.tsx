"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, File, X, CheckCircle } from "lucide-react"

interface ResumeUploaderProps {
  onUploadComplete: () => void
}

export function ResumeUploader({ onUploadComplete }: ResumeUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      if (isValidFileType(droppedFile)) {
        setFile(droppedFile)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      if (isValidFileType(selectedFile)) {
        setFile(selectedFile)
      }
    }
  }

  const isValidFileType = (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    return allowedTypes.includes(file.type)
  }

  const handleUpload = () => {
    if (!file) return

    setIsUploading(true)

    // Simulate file upload - in a real app, this would call an API
    setTimeout(() => {
      setIsUploading(false)
      setUploadComplete(true)
      onUploadComplete()
    }, 2000)
  }

  const removeFile = () => {
    setFile(null)
    setUploadComplete(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        } ${file ? "bg-muted/50" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!file ? (
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Drag and drop your resume</h3>
              <p className="text-sm text-muted-foreground">Supports PDF, DOC, DOCX (Max 5MB)</p>
            </div>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              Browse Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-primary/10 p-2">
                <File className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={removeFile} disabled={isUploading}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {file && !uploadComplete && (
        <Button className="w-full" onClick={handleUpload} disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload Resume"}
        </Button>
      )}

      {uploadComplete && (
        <Card className="flex items-center justify-between p-4 bg-green-50">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="font-medium text-green-800">Resume uploaded successfully!</p>
          </div>
          <Button variant="outline" size="sm" onClick={removeFile}>
            Upload Another
          </Button>
        </Card>
      )}
    </div>
  )
}
