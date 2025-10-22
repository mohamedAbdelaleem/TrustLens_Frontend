"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, HelpCircle, ExternalLink, Clock } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from "react-markdown"
import { processMarkdownText } from "@/lib/markdown-utils"

interface Claim {
  text: string
  judgment: "True" | "False" | "Unsure"
  explanation: string
  start_time?: number
  end_time?: number
}

interface Source {
  title: string
  url: string
}

interface ClaimsAnalysisModalProps {
  claims: Claim[]
  sources: Source[]
  inputType: "text" | "audio" | "video"
  mediaUrl?: string
  isOpen: boolean
  onClose: () => void
  isRTL?: boolean
}

export function ClaimsAnalysisModal({
  claims,
  sources,
  inputType,
  mediaUrl,
  isOpen,
  onClose,
  isRTL = false,
}: ClaimsAnalysisModalProps) {
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null)
  const mediaContainerRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [playbackEndTime, setPlaybackEndTime] = useState<number | null>(null)

  const getVerdictIcon = (judgment: string) => {
    switch (judgment) {
      case "True":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "False":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <HelpCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getVerdictColor = (judgment: string) => {
    switch (judgment) {
      case "True":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "False":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    }
  }

  const getVerdictLabel = (judgment: string, isRTL: boolean) => {
    if (isRTL) {
      switch (judgment) {
        case "True":
          return "صحيح"
        case "False":
          return "خاطئ"
        default:
          return "غير متأكد"
      }
    }
    return judgment
  }

  const seekToTimestamp = (time: number, claimIndex: number) => {
    console.log("[v0] seekToTimestamp called with time:", time, "claimIndex:", claimIndex)

    if (mediaRef.current) {
      mediaRef.current.currentTime = time
      mediaRef.current.play()

      // Set the end time for this specific claim
      const claim = claims[claimIndex]
      if (claim?.end_time !== undefined) {
        console.log("[v0] Setting playbackEndTime to:", claim.end_time)
        setPlaybackEndTime(claim.end_time)
      }

      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }

    }

    // if (mediaContainerRef.current) {
    //   setTimeout(() => {
    //     console.log("[v0] Attempting to scroll to media container")

    //     // Find the scrollable parent (ScrollArea viewport)
    //     let scrollableParent = mediaContainerRef.current?.parentElement
    //     while (scrollableParent) {
    //       const hasScroll = scrollableParent.scrollHeight > scrollableParent.clientHeight
    //       console.log("[v0] Checking parent:", scrollableParent.className, "hasScroll:", hasScroll)
    //       if (hasScroll) {
    //         console.log("[v0] Found scrollable parent")
    //         break
    //       }
    //       scrollableParent = scrollableParent.parentElement
    //     }

    //     if (scrollableParent && mediaContainerRef.current) {
    //       const mediaTop = mediaContainerRef.current.offsetTop
    //       const parentTop = scrollableParent.offsetTop
    //       const scrollOffset = mediaTop - parentTop - 10

    //       console.log("[v0] Media offsetTop:", mediaTop)
    //       console.log("[v0] Parent offsetTop:", parentTop)
    //       console.log("[v0] Scroll offset:", scrollOffset)
    //       console.log("[v0] Current scroll position:", scrollableParent.scrollTop)

    //       scrollableParent.scrollTo({
    //         top: scrollOffset,
    //         behavior: "smooth",
    //       })

    //       console.log("[v0] After scroll position:", scrollableParent.scrollTop)
    //     } else {
    //       console.log("[v0] Could not find scrollable parent")
    //     }
    //   }, 50)
    // }

//     if (mediaContainerRef.current) {
//   setTimeout(() => {
//     // Find the Radix ScrollArea viewport
//     const viewport = mediaContainerRef.current?.closest(
//       "[data-slot='scroll-area-viewport']"
//     ) as HTMLElement | null

//     if (viewport) {
//       viewport.scrollTo({
//         top: 0, // scroll to top of modal (media preview)
//         behavior: "smooth",
//       })
//     } else {
//       console.warn("[v0] Could not find scroll-area viewport to scroll")
//     }
//   }, 50)
// }

  }

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const hasMedia = (inputType === "video" || inputType === "audio") && mediaUrl
  const scrollHeight = hasMedia ? "max-h-[70vh]" : "max-h-[82vh]"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className={isRTL ? "text-right" : "text-left"}>
            {isRTL ? "تحليل المطالبات" : "Claims Analysis"}
          </DialogTitle>
          <DialogDescription className={isRTL ? "text-right" : "text-left"}>
            {isRTL
              ? `تم العثور على ${claims.length} مطالبة في المحتوى المقدم`
              : `Found ${claims.length} claim${claims.length !== 1 ? "s" : ""} in the provided content`}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className={`${scrollHeight} pr-4`} ref={scrollAreaRef}>
          <div className="space-y-2 mt-4">
            {hasMedia && (
              <Card ref={mediaContainerRef} className="p-4 border-border/40 bg-accent/5">
                <h4 className={`text-sm font-semibold text-foreground mb-3 ${isRTL ? "text-right" : "text-left"}`}>
                  {isRTL ? "معاينة الوسائط" : "Media Preview"}
                </h4>
                {inputType === "video" ? (
                  <video
                    ref={mediaRef as React.RefObject<HTMLVideoElement>}
                    src={mediaUrl}
                    controls
                    className="w-full rounded-lg"
                    onTimeUpdate={(e) => {
                      const currentTime = e.currentTarget.currentTime
                      setCurrentTime(currentTime)
                      if (playbackEndTime !== null && currentTime >= playbackEndTime) {
                        e.currentTarget.pause()
                        setPlaybackEndTime(null)
                      }
                    }}
                  />
                ) : (
                  <audio
                    ref={mediaRef as React.RefObject<HTMLAudioElement>}
                    src={mediaUrl}
                    controls
                    className="w-full"
                    onTimeUpdate={(e) => {
                      const currentTime = e.currentTarget.currentTime
                      setCurrentTime(currentTime)
                      if (playbackEndTime !== null && currentTime >= playbackEndTime) {
                        e.currentTarget.pause()
                        setPlaybackEndTime(null)
                      }
                    }}
                  />
                )}
              </Card>
            )}

            {claims.map((claim, index) => (
              <Card key={index} className="p-3 border-border/40">
                <div className="space-y-2">
                  <div className={`flex items-start justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {isRTL ? `المطالبة ${index + 1}` : `Claim ${index + 1}`}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${getVerdictColor(claim.judgment)} border flex items-center space-x-1`}
                    >
                      {getVerdictIcon(claim.judgment)}
                      <span className="ml-1 capitalize">{getVerdictLabel(claim.judgment, isRTL)}</span>
                    </Badge>
                  </div>

                  {(claim.start_time !== undefined || claim.end_time !== undefined) &&
                    (inputType === "audio" || inputType === "video") && (
                      <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div className="flex items-center gap-2">
                          {claim.start_time !== undefined && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs font-mono text-primary hover:text-primary hover:bg-primary/10"
                              onClick={() => {
                                seekToTimestamp(claim.start_time!, index)
                              }}
                            >
                              {formatTimestamp(claim.start_time)}
                            </Button>
                          )}
                          {claim.start_time !== undefined && claim.end_time !== undefined && (
                            <span className="text-muted-foreground">-</span>
                          )}
                          {claim.end_time !== undefined && (
                            <span className="text-xs font-mono text-muted-foreground">
                              {formatTimestamp(claim.end_time)}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                  <div
                    className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    <ReactMarkdown>{processMarkdownText(claim.text)}</ReactMarkdown>
                  </div>

                  <div
                    className="prose prose-sm max-w-none dark:prose-invert text-muted-foreground whitespace-pre-wrap"
                    dir={isRTL ? "rtl" : "ltr"}
                  >
                    <ReactMarkdown>{processMarkdownText(claim.explanation)}</ReactMarkdown>
                  </div>
                </div>
              </Card>
            ))}

            {sources.length > 0 && (
              <Card className="p-4 border-border/40 bg-accent/5">
                <h4 className={`text-sm font-semibold text-foreground mb-3 ${isRTL ? "text-right" : "text-left"}`}>
                  {isRTL ? "المصادر" : "Sources"}
                </h4>
                <div className="space-y-2">
                  {sources.map((source, index) => (
                    <a
                      key={index}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 hover:underline transition-colors group"
                    >
                      <ExternalLink className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      <span className="break-all">{source.title}</span>
                    </a>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
