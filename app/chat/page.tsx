"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Send, Paperclip, Shield } from "lucide-react"
import { ChatMessage } from "@/components/chat-message"
import { VerificationResponse } from "@/components/verification-response"
import { FileUpload } from "@/components/file-upload"
import { UploadProgress } from "@/components/upload-progress"
import { useRTL, detectLanguage } from "@/hooks/use-rtl"
import { ThemeToggle } from "@/components/theme-toggle"
import { useWebSocket } from "@/hooks/use-websocket"
import { mediaStorage } from "@/lib/media-storage"

const mockMessages = [
  {
    id: "1",
    content:
      "Hello! I'm TrustLens, your AI fact-verification assistant. I can help you verify the accuracy of text, audio, and video content. What would you like me to analyze today?",
    isUser: false,
    timestamp: new Date(Date.now() - 300000),
    language: "en" as const,
  },
  {
    id: "2",
    content: 'Can you verify this claim: "The Earth is flat and NASA has been hiding this from us."',
    isUser: true,
    timestamp: new Date(Date.now() - 240000),
    language: "en" as const,
  },
  {
    id: "3",
    isUser: false,
    timestamp: new Date(Date.now() - 180000),
    language: "en" as const,
    orchestratorResponse: {
      response_type: "structured_report" as const,
      output: {
        input_type: "text" as const,
        report: `After thorough analysis of the claim "The Earth is flat and NASA has been hiding this from us," our multi-agent verification system has determined this to be FALSE with high confidence.

**Key Findings:**

The claim contradicts overwhelming scientific evidence from multiple independent sources including satellite imagery, physics principles, and observable phenomena. The spherical nature of Earth has been documented through:

• Direct satellite imagery showing Earth's curvature
• Physics of gravity explaining why large celestial bodies form spheres
• Ships disappearing over the horizon due to Earth's curvature
• Different star constellations visible from different latitudes
• Time zone differences consistent with a rotating sphere

This claim has been thoroughly debunked by the scientific community and represents a conspiracy theory without credible evidence.`,
        claims: [
          {
            text: "The Earth is flat",
            judgment: "False" as const,
            explanation:
              "Overwhelming scientific evidence from satellite imagery, physics, and observable phenomena confirms Earth is an oblate spheroid. Multiple independent space agencies and centuries of scientific research support this.",
          },
          {
            text: "NASA has been hiding the flat Earth truth",
            judgment: "False" as const,
            explanation:
              "This conspiracy theory lacks any credible evidence. NASA's findings are consistent with observations from other space agencies worldwide, independent researchers, and even amateur astronomers.",
          },
        ],
        sources: [
          { title: "NASA - Earth Observations", url: "https://www.nasa.gov/topics/earth/index.html" },
          { title: "ESA - Earth Science", url: "https://www.esa.int/Applications/Observing_the_Earth" },
          {
            title: "Scientific American - Earth Shape Evidence",
            url: "https://www.scientificamerican.com/article/earth-is-round/",
          },
        ],
        suggestions:
          "Cross-reference claims with multiple credible scientific sources. Be skeptical of conspiracy theories that require massive global coordination. Look for peer-reviewed research and reproducible experiments.",
      },
    },
  },
  {
    id: "4",
    content: "Can you analyze this audio about Python programming?",
    isUser: true,
    timestamp: new Date(Date.now() - 120000),
    language: "en" as const,
  },
  {
    id: "5",
    isUser: false,
    timestamp: new Date(Date.now() - 60000),
    language: "en" as const,
    mediaUrl:
      "https://my-audio-transcribe-bucket-12345.s3.us-east-1.amazonaws.com/audio.mp3?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQDBmnKhtzUjonIXYdBouLP%2FhryXc5F%2B%2FnPBE0xTcZIxqgIhAOUMzTYijCx93Geh5XQ5Ttu65NX%2B5qxjbf0Ecwi0woamKsIDCIv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMMDI2MDkwNTU1MzE2IgyQgM6sGq7%2FfvgRrVQqlgObSmPIu%2BOwzYBD3nUF71fdQYpZmSEZi2hmwJmXqqdImPB6z5wom2vfnow41kS2RlVZsneiziWajr9XJVKW%2FGZrqQKQyodiil2s75lodQ9HF%2FmL%2Bv4ZOiilACgaj60cUO%2Ben7KC4yyD1IOXQA25a43rK6sf7ZKGjDqfdUoXJnZ1dUVZJzcZ8EyGgmho%2FSy%2FrpE9EYvnVhvKJQ6Vkug3c9Ojrv2dIju8IjgCkQFBvS0agPQWUZZ0jaVfTUtFXH9u%2BnzcQZRyFJ3K8Ze6gChXlw5WGDqS0FzZ3UihENNd0hsxombSpkMbC%2FLWGg6S9%2BkduEsHfC2dx4TzlwparB1Bp0hZmu2xBgCJt%2FJxiAcrVGAjpbeAhY67Q00C9GcG8ZQCEtjETbXtzfuC23zv41Niv65t4gz%2FfUwNxliNSFoevg6jMJgLGnf%2FSns2hjGtwZqh6jTvkxDE0TPw4JS31t%2B1QcQchxO3vJxykRMgClfkroCyCAbfJitWFWfem9yRgn3W3rUoT7CHiZrrlsyYAGX81YmkggnJycysMKrYwscGOt0CDlmz0jxVmIM0ThbhNkV%2BcoJLEMniNr2wdNcLSe7rcgrxRm72jB1Xfvr76H%2BPDYG0995yWX9azi5TFw3LIAzoQTQL0phO1ErpfGV61KgjRDJ5ZkhyXXgTvIfWacgYnrpfJLVBjWEKBL5EC2mcfuTaHTLoKf8fptlF%2Bs5LK8A5sD9Pg3HwnT2ObOxJTb1Xjk4sh6EDv6T4KYOAcdgy58nsybNtk7lg7VWCMxNjKjIY2%2FFQV%2B6ksPCTgqA1QFIlbt9Tqr8XjlG5PL2dfDXx8y4mBtZUmz6KD7Sq802xUaY3tSJdzGzL57mEavOEuzEERa855QUbkb0r34lkm9n9taYvkbSwV0XPdkQ8laqBjDCks2BJcpTG9slpPuLXg4InQToXhBsZTdzJqC%2B8Tso8DALNOBXIRLR1bawK%2Bb%2Fjzi2%2FQNde2v5qIN%2FPVhsbnWwRuDM5akHEj6E83MIKu8GXUg%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAQMEY6I62PSMPERXG%2F20251016%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251016T092803Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=8bb51a82b24cc1fc4a1a462c1715f108f73f9c14bf27a9947aa915290a22fe3f",
    orchestratorResponse: {
      response_type: "structured_report" as const,
      output: {
        input_type: "audio" as const,
        report: `Analysis of the Python programming audio reveals accurate technical information with some minor simplifications. Our multi-agent system has identified 3 key claims made throughout the 10-minute audio.

**Overall Assessment:**

The audio presents legitimate Python programming concepts with clear explanations. Most technical details are accurate, though some advanced topics are simplified for beginner understanding.

**Verification Confidence:** 85.2%`,
        claims: [
          {
            text: "Python is an interpreted language that executes code line by line",
            judgment: "True" as const,
            explanation:
              "This is accurate. Python uses an interpreter to execute code sequentially, which is one of its defining characteristics and contributes to its ease of use for beginners.",
            start_time: 125.5,
            end_time: 148.3,
          },
          {
            text: "Python is the fastest programming language for data processing",
            judgment: "False" as const,
            explanation:
              "This is misleading. While Python is popular for data processing due to its libraries and ease of use, compiled languages like C++ and Rust are generally faster. Python's strength is in developer productivity, not raw execution speed.",
            start_time: 285.8,
            end_time: 312.1,
          },
          {
            text: "List comprehensions are more memory efficient than traditional loops",
            judgment: "Unsure" as const,
            explanation:
              "This depends on the specific use case. List comprehensions can be more efficient in some scenarios but may use more memory when creating large lists. Generator expressions are typically more memory efficient than both.",
            start_time: 456.4,
            end_time: 489.9,
          },
        ],
        sources: [
          { title: "Python Official Documentation", url: "https://docs.python.org/3/" },
          { title: "Real Python - Python Speed", url: "https://realpython.com/python-speed/" },
          {
            title: "Python Performance Tips",
            url: "https://wiki.python.org/moin/PythonSpeed/PerformanceTips",
          },
          { title: "List Comprehensions Guide", url: "https://realpython.com/list-comprehension-python/" },
        ],
        suggestions:
          "When learning programming concepts, verify technical claims against official documentation. Be cautious of absolute statements about performance without benchmarks. Consider the context and use case when evaluating best practices.",
      },
    },
  },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<typeof mockMessages>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ fileName: string; progress: number } | null>(null)
  const [baseUrl] = useState(process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8000")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { isConnected, isDevelopmentMode, verify, getPresignedUrl } = useWebSocket(baseUrl)

  const isInputRTL = useRTL(inputValue)
  const inputLanguage = detectLanguage(inputValue)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, uploadProgress])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !isConnected) return

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
      language: inputLanguage,
    }

    setMessages((prev) => [...prev, userMessage])
    const messageContent = inputValue
    setInputValue("")
    setIsLoading(true)

    try {
      const verificationResult = await verify(messageContent)

      const botResponse = {
        id: (Date.now() + 1).toString(),
        isUser: false,
        timestamp: new Date(verificationResult.timestamp || Date.now()),
        language: inputLanguage,
        orchestratorResponse: verificationResult.result,
      }

      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      console.error("[v0] Verification failed:", error)
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        content: isInputRTL
          ? "عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى."
          : "Sorry, an error occurred while processing your request. Please try again.",
        isUser: false,
        timestamp: new Date(),
        language: inputLanguage,
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = async (file: File) => {
    setShowFileUpload(false)
    setUploadProgress({ fileName: file.name, progress: 0 })

    try {
      setUploadProgress({ fileName: file.name, progress: 10 })
      const presignedData = await getPresignedUrl(file.name, file.type)

      setUploadProgress({ fileName: file.name, progress: 30 })
      const uploadResponse = await fetch(presignedData.presigned_url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error("File upload failed")
      }

      setUploadProgress({ fileName: file.name, progress: 60 })

      const fileMessage = {
        id: Date.now().toString(),
        content: isInputRTL
          ? `تم رفع الملف: ${file.name}. جاري تحليل المحتوى...`
          : `File uploaded: ${file.name}. Analyzing content...`,
        isUser: true,
        timestamp: new Date(),
        language: isInputRTL ? ("ar" as const) : ("en" as const),
        fileAttachment: {
          name: file.name,
          type: file.type,
          size: file.size,
        },
      }
      setMessages((prev) => [...prev, fileMessage])
      setUploadProgress({ fileName: file.name, progress: 70 })

      const mediaId = mediaStorage.store(file)
      const mediaUrl = mediaStorage.getUrl(mediaId)

      setUploadProgress(null)

      const verificationResult = await verify(presignedData.s3_uri)

      const analysisResponse = {
        id: (Date.now() + 1).toString(),
        isUser: false,
        timestamp: new Date(verificationResult.timestamp || Date.now()),
        language: isInputRTL ? ("ar" as const) : ("en" as const),
        mediaUrl: mediaUrl,
        orchestratorResponse: verificationResult.result,
      }

      setMessages((prev) => [...prev, analysisResponse])
    } catch (error) {
      console.error("[v0] File upload/analysis failed:", error)
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        content: isInputRTL
          ? "عذراً، حدث خطأ أثناء تحليل الملف. يرجى المحاولة مرة أخرى."
          : "Sorry, an error occurred while analyzing the file. Please try again.",
        isUser: false,
        timestamp: new Date(),
        language: isInputRTL ? ("ar" as const) : ("en" as const),
      }
      setMessages((prev) => [...prev, errorResponse])
      setUploadProgress(null)
    }
  }

  const handleCancelUpload = () => {
    setUploadProgress(null)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="text-lg font-semibold text-foreground">TrustLens</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <div className="flex items-center space-x-1">
                <div
                  className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : isDevelopmentMode ? "bg-yellow-500" : "bg-red-500"}`}
                ></div>
                <span className="text-xs text-muted-foreground">
                  {isConnected ? "Connected" : isDevelopmentMode ? "Dev Mode" : "Connecting..."}
                </span>
              </div>
              {isInputRTL && (
                <Badge variant="outline" className="text-xs">
                  العربية
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                Multi-Agent Verification
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id}>
                {message.orchestratorResponse ? (
                  <div className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[85%]">
                      <VerificationResponse
                        response={message.orchestratorResponse}
                        mediaUrl={message.mediaUrl}
                        isRTL={message.language === "ar" || message.language === "he"}
                      />
                      {/* Timestamp */}
                      <div className="mt-1 text-xs text-muted-foreground text-left">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <ChatMessage message={message} />
                )}
              </div>
            ))}

            {/* Upload Progress */}
            {uploadProgress && (
              <div className={`flex ${isInputRTL ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[80%] md:max-w-[60%]">
                  <UploadProgress
                    fileName={uploadProgress.fileName}
                    progress={uploadProgress.progress}
                    onCancel={handleCancelUpload}
                    isRTL={isInputRTL}
                  />
                </div>
              </div>
            )}

            {isLoading && (
              <div className={`flex ${isInputRTL ? "justify-end" : "justify-start"}`}>
                <Card className="bg-card border-border/40 p-4 max-w-xs">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-accent rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-accent rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {isInputRTL ? "جاري التحليل..." : "Analyzing..."}
                    </span>
                  </div>
                </Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className={`flex items-end space-x-2 ${isInputRTL ? "flex-row-reverse space-x-reverse" : ""}`}>
            <div className="flex-1">
              <div className={`relative ${isInputRTL ? "text-right" : "text-left"}`}>
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isInputRTL ? "اكتب رسالتك هنا..." : "Type your message here..."}
                  className={`pr-12 min-h-[50px] resize-none ${isInputRTL ? "text-right" : "text-left"}`}
                  dir={isInputRTL ? "rtl" : "ltr"}
                  disabled={!!uploadProgress || !isConnected}
                />
                <div
                  className={`absolute top-1/2 transform -translate-y-1/2 flex items-center space-x-1 ${isInputRTL ? "left-3" : "right-3"}`}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFileUpload(!showFileUpload)}
                    className="h-8 w-8 p-0"
                    disabled={!!uploadProgress || !isConnected}
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* File Upload Options */}
              {showFileUpload && (
                <FileUpload
                  onFileSelect={handleFileUpload}
                  onClose={() => setShowFileUpload(false)}
                  isRTL={isInputRTL}
                />
              )}
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || !!uploadProgress || !isConnected}
              className="h-[50px] px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className={`mt-2 text-xs text-muted-foreground text-center ${isInputRTL ? "rtl" : "ltr"}`}>
            {isInputRTL
              ? "يمكن لـ TrustLens تحليل النصوص والصوت والفيديو. ارفع الملفات أو الصق المحتوى للتحقق."
              : "TrustLens can analyze text, audio, and video content. Upload files or paste content to verify."}
          </div>
        </div>
      </div>
    </div>
  )
}
