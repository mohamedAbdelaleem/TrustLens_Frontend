"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { X, Upload } from "lucide-react"

interface UploadProgressProps {
  fileName: string
  progress: number
  onCancel?: () => void
  isRTL?: boolean
}

export function UploadProgress({ fileName, progress, onCancel, isRTL = false }: UploadProgressProps) {
  return (
    <Card className="p-4 bg-card border-border/40" dir={isRTL ? "rtl" : "ltr"}>
      <div className={`flex items-center space-x-3 ${isRTL ? "flex-row-reverse space-x-reverse" : ""}`}>
        <div className="flex-shrink-0">
          <Upload className="w-5 h-5 text-accent animate-pulse" />
        </div>

        <div className="flex-1 min-w-0">
          <div className={`flex items-center justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <p className="text-sm font-medium truncate" title={fileName}>
              {fileName}
            </p>
            {onCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
            <div className={`flex justify-between text-xs text-muted-foreground ${isRTL ? "flex-row-reverse" : ""}`}>
              <span>{isRTL ? "جاري الرفع..." : "Uploading..."}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
