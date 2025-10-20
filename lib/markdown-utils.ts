export function processMarkdownText(text: string): string {
  if (!text) return ""
  // Replace literal backslash-n with actual newlines
  return text.replace(/\\n/g, "\n")
}
