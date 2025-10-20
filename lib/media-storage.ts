interface StoredMedia {
  id: string
  blob: Blob
  url: string
  createdAt: number
  expiresAt: number
}

const STORAGE_DURATION = 2 * 60 * 60 * 1000 // 2 hours in milliseconds
const mediaStore = new Map<string, StoredMedia>()

export const mediaStorage = {
  // Store media with internal ID
  store: (blob: Blob): string => {
    const id = `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const url = URL.createObjectURL(blob)
    const now = Date.now()

    mediaStore.set(id, {
      id,
      blob,
      url,
      createdAt: now,
      expiresAt: now + STORAGE_DURATION,
    })

    // Cleanup expired media
    mediaStore.forEach((media, key) => {
      if (Date.now() > media.expiresAt) {
        URL.revokeObjectURL(media.url)
        mediaStore.delete(key)
      }
    })

    return id
  },

  // Retrieve stored media by ID
  get: (id: string): StoredMedia | undefined => {
    const media = mediaStore.get(id)
    if (media && Date.now() > media.expiresAt) {
      URL.revokeObjectURL(media.url)
      mediaStore.delete(id)
      return undefined
    }
    return media
  },

  // Get URL for stored media
  getUrl: (id: string): string | undefined => {
    return mediaStorage.get(id)?.url
  },

  // Clear all stored media
  clear: () => {
    mediaStore.forEach((media) => {
      URL.revokeObjectURL(media.url)
    })
    mediaStore.clear()
  },
}
