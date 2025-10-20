"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Video, Mic, Upload, X } from "lucide-react"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onClose: () => void
  isRTL?: boolean
}

export function FileUpload({ onFileSelect, onClose, isRTL = false }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("video/") || file.type.startsWith("audio/")) {
        onFileSelect(file)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type.startsWith("video/") || file.type.startsWith("audio/")) {
        onFileSelect(file)
      }
    }
  }

  const onButtonClick = (accept: string) => {
    if (inputRef.current) {
      inputRef.current.accept = accept
      inputRef.current.click()
    }
  }

  return (
    <Card
      className="absolute bottom-full left-0 right-0 mb-2 p-4 bg-card border-border/40 shadow-lg"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className={`flex items-center justify-between mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
        <h3 className="text-sm font-medium">{isRTL ? "رفع ملف" : "Upload File"}</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onButtonClick("video/*")}
          className="flex flex-col items-center p-3 h-auto"
        >
          <Video className="w-5 h-5 mb-1" />
          <span className="text-xs">{isRTL ? "فيديو" : "Video"}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onButtonClick("audio/*")}
          className="flex flex-col items-center p-3 h-auto"
        >
          <Mic className="w-5 h-5 mb-1" />
          <span className="text-xs">{isRTL ? "صوت" : "Audio"}</span>
        </Button>
      </div>

      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">
          {isRTL ? "اسحب وأفلت ملفك هنا، أو انقر للتصفح" : "Drag and drop your file here, or click to browse"}
        </p>
        <Button variant="outline" size="sm" onClick={() => onButtonClick("video/*,audio/*")}>
          {isRTL ? "اختر ملف" : "Choose File"}
        </Button>
      </div>

      <input ref={inputRef} type="file" className="hidden" onChange={handleChange} />

      <p className="text-xs text-muted-foreground mt-2">
        {isRTL
          ? "الصيغ المدعومة: MP4, AVI, MOV, MP3, WAV, AAC (حد أقصى 50 ميجابايت)"
          : "Supported formats: MP4, AVI, MOV, MP3, WAV, AAC (Max 50MB)"}
      </p>
    </Card>
  )
}
