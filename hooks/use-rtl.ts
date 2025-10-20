"use client"

import { useMemo } from "react"

// Arabic Unicode ranges for RTL detection
const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/

// Hebrew Unicode range
const HEBREW_REGEX = /[\u0590-\u05FF]/

// Combined RTL detection
const RTL_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0590-\u05FF]/

export function useRTL(text: string) {
  return useMemo(() => {
    if (!text) return false

    // Check if text contains RTL characters
    const hasRTL = RTL_REGEX.test(text)

    // Calculate RTL character percentage
    const rtlMatches = text.match(RTL_REGEX) || []
    const totalChars = text.replace(/\s/g, "").length
    const rtlPercentage = totalChars > 0 ? (rtlMatches.length / totalChars) * 100 : 0

    // Consider text RTL if it has more than 30% RTL characters
    return hasRTL && rtlPercentage > 30
  }, [text])
}

export function detectLanguage(text: string): "ar" | "he" | "en" {
  if (ARABIC_REGEX.test(text)) return "ar"
  if (HEBREW_REGEX.test(text)) return "he"
  return "en"
}

export function getRTLClasses(isRTL: boolean) {
  return {
    container: isRTL ? "rtl" : "ltr",
    text: isRTL ? "text-right" : "text-left",
    flexReverse: isRTL ? "flex-row-reverse space-x-reverse" : "",
    marginReverse: isRTL ? "ml-auto mr-0" : "mr-auto ml-0",
    paddingReverse: isRTL ? "pl-0 pr-4" : "pr-0 pl-4",
  }
}
