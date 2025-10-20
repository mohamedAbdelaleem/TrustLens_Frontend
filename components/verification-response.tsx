"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Shield } from "lucide-react"
import { ClaimsAnalysisModal } from "@/components/claims-analysis-modal"
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

interface ResponseSchema {
  input_type: "audio" | "video" | "text"
  report: string
  media_uri?: string
  claims: Claim[]
  sources: Source[]
  suggestions: string
}

interface OrchestratorAgentOutput {
  response_type: "structured_report" | "message"
  output: ResponseSchema | string
}

interface VerificationResponseProps {
  response: OrchestratorAgentOutput
  mediaUrl?: string
  isRTL?: boolean
}

export function VerificationResponse({ response, mediaUrl, isRTL = false }: VerificationResponseProps) {
  const [showClaimsModal, setShowClaimsModal] = useState(false)

  if (response.response_type === "message" || typeof response.output === "string") {
    const message = typeof response.output === "string" ? response.output : ""
    return (
      <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className="flex-shrink-0 pt-1">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
        </div>
        <Card className="bg-card border-border/40 p-5 flex-1">
          <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap" dir={isRTL ? "rtl" : "ltr"}>
            <ReactMarkdown>{processMarkdownText(message)}</ReactMarkdown>
          </div>
        </Card>
      </div>
    )
  }

  const output = response.output as ResponseSchema
  const finalMediaUrl = mediaUrl || output.media_uri

  return (
    <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
      <div className="flex-shrink-0 pt-1">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <Card className="bg-card border-border/40 p-5">
          <div
            className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap mb-4"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <ReactMarkdown>{processMarkdownText(output.report)}</ReactMarkdown>
          </div>

          {output.claims.length > 0 && (
            <div className="pt-4 border-t border-border/40">
              <Button variant="outline" size="sm" onClick={() => setShowClaimsModal(true)} className="w-full sm:w-auto">
                <ExternalLink className="w-4 h-4 mr-2" />
                {isRTL ? "عرض تحليل المطالبات" : "See the claims analysis"}
              </Button>
            </div>
          )}

          {output.suggestions && (
            <div className="pt-4 mt-4 border-t border-border/40">
              <h4 className="font-semibold text-foreground mb-3 flex items-center">
                <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></span>
                {isRTL ? "اقتراحات" : "Suggestions"}
              </h4>
              <div
                className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <ReactMarkdown>{processMarkdownText(output.suggestions)}</ReactMarkdown>
              </div>
            </div>
          )}
        </Card>

        <ClaimsAnalysisModal
          claims={output.claims}
          sources={output.sources}
          inputType={output.input_type}
          mediaUrl={finalMediaUrl}
          isOpen={showClaimsModal}
          onClose={() => setShowClaimsModal(false)}
          isRTL={isRTL}
        />
      </div>
    </div>
  )
}
