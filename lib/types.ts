export interface Claim {
  text: string
  judgment: "True" | "False" | "Unsure"
  explanation: string
  start_time?: number
  end_time?: number
}

export interface Source {
  title: string
  url: string
}

export interface ResponseSchema {
  input_type: "audio" | "video" | "text"
  report: string
  media_uri?: string
  claims: Claim[]
  sources: Source[]
  suggestions: string
}

export interface OrchestratorAgentOutput {
  response_type: "structured_report" | "message"
  output: ResponseSchema | string
}

export interface APIResponse {
  timestamp: string
  output: OrchestratorAgentOutput
}

export interface WebSocketRequest {
  action: "ping" | "create_presigned_url" | "verify"
  filename?: string
  content_type?: string
  prompt?: string
  requestId?: string

}

export interface PresignedUrlResponse {
  presigned_url: string
  object_key: string
  s3_uri: string
}

export interface VerificationResult {
  timestamp: string
  result: OrchestratorAgentOutput
}

export interface WebSocketResponse {
  status: "verification_completed" | "verification_failed" | "presigned_url_generated" | "pong"
  result?: VerificationResult
  presigned_url_data?: PresignedUrlResponse
  error?: string
  requestId?: string
}
