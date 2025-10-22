"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import type { WebSocketRequest, WebSocketResponse, PresignedUrlResponse, VerificationResult } from "@/lib/types"

export const useWebSocket = (url: string) => {
  const ws = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false)
  const requestCallbacks = useRef<Map<string, (response: WebSocketResponse) => void>>(new Map())
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5

  const getWebSocketUrl = useCallback((baseUrl: string): string => {
    if (baseUrl.startsWith("ws://") || baseUrl.startsWith("wss://")) {
      return baseUrl
    }
    try {
      const urlObj = new URL(baseUrl)
      const protocol = urlObj.protocol === "https:" ? "wss:" : "ws:"
      return `${protocol}//${urlObj.host}${urlObj.pathname}`
    } catch {
      // If URL parsing fails, assume it's already a WebSocket URL
      return baseUrl
    }
  }, [])

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return

    try {
      const wsUrl = getWebSocketUrl(url)
      console.log("[v0] Attempting WebSocket connection to:", wsUrl)
      ws.current = new WebSocket(wsUrl)

      ws.current.onopen = () => {
        console.log("[v0] WebSocket connected successfully")
        setIsConnected(true)
        setIsDevelopmentMode(false)
        reconnectAttemptsRef.current = 0

        // Start ping every 100 seconds
        pingIntervalRef.current = setInterval(() => {
          if (ws.current?.readyState === WebSocket.OPEN) {
            send({ action: "ping" })
          }
        }, 100000)
      }

      ws.current.onmessage = (event) => {
        try {
          const response: WebSocketResponse = JSON.parse(event.data)
          console.log("[v0] WebSocket message received:", response.status)

          // Call the appropriate callback if one exists
          console.log("#### Before")
          const requestId = response.requestId
          console.log("##### Request ID: ", requestId)
          if (requestId && requestCallbacks.current.has(requestId)) {
            const callback = requestCallbacks.current.get(requestId)
            callback?.(response)
            requestCallbacks.current.delete(requestId)
          }
        } catch (error) {
          console.error("[v0] Failed to parse WebSocket message:", error)
        }
      }

      ws.current.onerror = (error) => {
        console.error("[v0] WebSocket error event:", {
          type: error.type,
          message: error.message,
          readyState: ws.current?.readyState,
          url: wsUrl,
        })
      }

      ws.current.onclose = () => {
        console.log("[v0] WebSocket disconnected")
        setIsConnected(false)

        // Clear ping interval
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current)
        }

        reconnectAttemptsRef.current += 1
        if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.warn("[v0] Max reconnection attempts reached. Switching to development mode.")
          setIsDevelopmentMode(true)
          return
        }

        // Attempt to reconnect after 3 seconds
        const delay = Math.min(3000 * reconnectAttemptsRef.current, 30000)
        console.log(`[v0] Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`)
        setTimeout(() => {
          connect()
        }, delay)
      }
    } catch (error) {
      console.error("[v0] Failed to create WebSocket:", error)
      setIsDevelopmentMode(true)
    }
  }, [url, getWebSocketUrl])

  // Send message through WebSocket
  const send = useCallback((request: WebSocketRequest): Promise<WebSocketResponse> => {
    return new Promise((resolve, reject) => {
      if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
        reject(new Error("WebSocket is not connected"))
        return
      }

      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Set up callback for this request
      requestCallbacks.current.set(requestId, (response) => {
        resolve(response)
      })

      // Send request with ID
      const message = { ...request, requestId }
      ws.current.send(JSON.stringify(message))

      // Timeout after 2000 seconds
      setTimeout(() => {
        if (requestCallbacks.current.has(requestId)) {
          requestCallbacks.current.delete(requestId)
          reject(new Error("WebSocket request timeout"))
        }
      }, 2_000_000)
    })
  }, [])

  // Get presigned URL for file upload
  const getPresignedUrl = useCallback(
    async (filename: string, contentType: string): Promise<PresignedUrlResponse> => {
      const response = await send({
        action: "create_presigned_url",
        filename,
        content_type: contentType,
      })

      if (response.presigned_url_data) {
        return response.presigned_url_data
      }
      throw new Error("Failed to get presigned URL")
    },
    [send],
  )

  // Verify content
  const verify = useCallback(
    async (prompt: string): Promise<VerificationResult> => {
      const response = await send({
        action: "verify",
        prompt,
      })

      if (response.status === "verification_completed" && response.result) {
        console.log(response.result, response.requestId)
        return response.result
      }
      throw new Error(response.error || "Verification failed")
    },
    [send],
  )

  // Connect on mount
  useEffect(() => {
    connect()

    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current)
      }
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [connect])

  return {
    isConnected,
    isDevelopmentMode,
    send,
    getPresignedUrl,
    verify,
  }
}
