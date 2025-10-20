"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Video, Mic, ImageIcon, File, X, Download } from "lucide-react"

interface FilePreviewProps {
  file: {
    name: string
    type: string
    size: number
    url?: string
  }
  onRemove?: () => void
  showRemove?: boolean
  isRTL?: boolean
}

export function FilePreview({ file, onRemove, showRemove = false, isRTL = false }: FilePreviewProps) {
  const getFileIcon = (type: string) => {
    if (type.startsWith("video/")) return <Video className="w-5 h-5 text-blue-500" />
    if (type.startsWith("audio/")) return <Mic className="w-5 h-5 text-green-500" />
    if (type.startsWith("image/")) return <ImageIcon className="w-5 h-5 text-purple-500" />
    if (type.includes("pdf") || type.includes("document")) return <FileText className="w-5 h-5 text-red-500" />
    return <File className="w-5 h-5 text-muted-foreground" />
  }

  const getFileTypeLabel = (type: string, isRTL: boolean) => {
    if (type.startsWith("video/")) return isRTL ? "فيديو" : "Video"
    if (type.startsWith("audio/")) return isRTL ? "صوت" : "Audio"
    if (type.startsWith("image/")) return isRTL ? "صورة" : "Image"
    if (type.includes("pdf")) return "PDF"
    if (type.includes("document")) return isRTL ? "مستند" : "Document"
    return isRTL ? "ملف" : "File"
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card className="p-3 bg-card border-border/40" dir={isRTL ? "rtl" : "ltr"}>
      <div className={`flex items-center space-x-3 ${isRTL ? "flex-row-reverse space-x-reverse" : ""}`}>
        <div className="flex-shrink-0">{getFileIcon(file.type)}</div>

        <div className="flex-1 min-w-0">
          <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
            <p className="text-sm font-medium truncate" title={file.name}>
              {file.name}
            </p>
            {showRemove && onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className={`flex items-center space-x-2 mt-1 ${isRTL ? "flex-row-reverse space-x-reverse" : ""}`}>
            <Badge variant="secondary" className="text-xs">
              {getFileTypeLabel(file.type, isRTL)}
            </Badge>
            <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
          </div>
        </div>

        {file.url && (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => window.open(file.url, "_blank")}>
            <Download className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  )
}
