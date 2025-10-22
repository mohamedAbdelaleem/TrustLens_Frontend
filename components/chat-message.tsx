import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, Clock, FileText, Video, Mic } from "lucide-react"
import { format } from "date-fns"
import { useRTL } from "@/hooks/use-rtl"

interface VerificationResult {
  status: "true" | "false" | "partially-false" | "unverified"
  confidence: number
  sources: string[]
}

interface FileAttachment {
  name: string
  type: string
  size: number
}

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
  language: "en" | "ar" | "he"
  verificationResult?: VerificationResult
  fileAttachment?: FileAttachment
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  
  const isRTL = useRTL(message.content) || message.language === "ar" || message.language === "he"

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case "true":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "false":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "partially-false":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "true":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "false":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "partially-false":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getVerificationLabel = (status: string, isRTL: boolean) => {
    if (isRTL) {
      switch (status) {
        case "true":
          return "صحيح"
        case "false":
          return "خاطئ"
        case "partially-false":
          return "مضلل جزئياً"
        default:
          return "غير محقق"
      }
    }
    return status.replace("-", " ")
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("video/")) return <Video className="w-4 h-4" />
    if (type.startsWith("audio/")) return <Mic className="w-4 h-4" />
    return <FileText className="w-4 h-4" />
  }

  return (
    <div
      className={`flex ${message.isUser ? (isRTL ? "justify-start" : "justify-end") : isRTL ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[80%] md:max-w-[60%] ${isRTL ? "text-right" : "text-left"}`}>
        <Card
          className={`p-4 ${
            message.isUser ? "bg-primary text-primary-foreground ml-auto" : "bg-card border-border/40"
          }`}
        >
          {/* File Attachment */}
          {message.fileAttachment && (
            <div
              className={`flex items-center space-x-2 mb-3 p-2 bg-muted/50 rounded-lg ${isRTL ? "flex-row-reverse space-x-reverse" : ""}`}
            >
              {getFileIcon(message.fileAttachment.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{message.fileAttachment.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(message.fileAttachment.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}

          {/* Message Content */}
          <div
            className={`prose prose-sm max-w-none ${
              message.isUser ? "prose-invert" : "prose-neutral dark:prose-invert"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>

          {/* Verification Result */}
          {message.verificationResult && (
            <div className="mt-4 space-y-3">
              <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                <Badge
                  variant="outline"
                  className={`${getVerificationColor(message.verificationResult.status)} border ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  {getVerificationIcon(message.verificationResult.status)}
                  <span className={`${isRTL ? "mr-1" : "ml-1"} capitalize`}>
                    {getVerificationLabel(message.verificationResult.status, isRTL)}
                  </span>
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {isRTL
                    ? `%${message.verificationResult.confidence} ثقة`
                    : `${message.verificationResult.confidence}% confidence`}
                </div>
              </div>

              {message.verificationResult.sources.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">{isRTL ? "المصادر: " : "Sources: "}</span>
                  {message.verificationResult.sources.join(", ")}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Timestamp */}
        <div
          className={`mt-1 text-xs text-muted-foreground ${
            message.isUser ? (isRTL ? "text-left" : "text-right") : isRTL ? "text-right" : "text-left"
          }`}
        >
          {format(message.timestamp, "HH:mm")}
        </div>
      </div>
    </div>
  )
}
