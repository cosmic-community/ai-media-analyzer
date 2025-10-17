import { MediaObject, AITextResponse } from '@/types'

/**
 * Upload a file to Cosmic media library via API route
 */
export async function uploadMedia(file: File): Promise<MediaObject> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Upload failed')
    }

    return data.media as MediaObject
  } catch (error) {
    console.error('Error uploading media:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to upload media')
  }
}

/**
 * Analyze media using Cosmic AI via API route
 */
export async function analyzeMedia(
  mediaUrl: string, 
  prompt: string
): Promise<AITextResponse> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mediaUrl,
        prompt,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Analysis failed')
    }

    return data.analysis as AITextResponse
  } catch (error) {
    console.error('Error analyzing media:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze media')
  }
}

/**
 * Generate text with Cosmic AI (no media) via API route
 */
export async function generateText(prompt: string): Promise<AITextResponse> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mediaUrl: null,
        prompt,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Text generation failed')
    }

    return data.analysis as AITextResponse
  } catch (error) {
    console.error('Error generating text:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to generate text')
  }
}

/**
 * Check if a URL is a valid media URL
 */
export function isValidMediaUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.includes('cosmicjs.com') || 
           urlObj.hostname.includes('imgix.cosmicjs.com')
  } catch {
    return false
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Get file type icon based on MIME type
 */
export function getFileTypeIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼️'
  if (mimeType.includes('pdf')) return '📄'
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊'
  if (mimeType.includes('document') || mimeType.includes('word')) return '📝'
  if (mimeType.includes('text')) return '📋'
  return '📁'
}