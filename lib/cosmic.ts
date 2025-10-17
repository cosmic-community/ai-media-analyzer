import { createBucketClient } from '@cosmicjs/sdk'
import { MediaObject, AITextResponse, isCosmicError } from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

/**
 * Upload a file to Cosmic media library
 */
export async function uploadMedia(file: File): Promise<MediaObject> {
  try {
    const response = await cosmic.media.insertOne({
      media: file,
      folder: 'ai-uploads',
      metadata: {
        uploaded_by: 'ai-analyzer',
        upload_timestamp: new Date().toISOString(),
      }
    })
    
    return response.media as MediaObject
  } catch (error) {
    console.error('Error uploading media:', error)
    if (isCosmicError(error)) {
      throw new Error(`Upload failed: ${error.message}`)
    }
    throw new Error('Failed to upload media')
  }
}

/**
 * Analyze media using Cosmic AI
 */
export async function analyzeMedia(
  mediaUrl: string, 
  prompt: string
): Promise<AITextResponse> {
  try {
    const response = await cosmic.ai.generateText({
      prompt,
      media_url: mediaUrl,
      max_tokens: 1000
    })
    
    return response as AITextResponse
  } catch (error) {
    console.error('Error analyzing media:', error)
    if (isCosmicError(error)) {
      throw new Error(`Analysis failed: ${error.message}`)
    }
    throw new Error('Failed to analyze media')
  }
}

/**
 * Generate text with Cosmic AI (no media)
 */
export async function generateText(prompt: string): Promise<AITextResponse> {
  try {
    const response = await cosmic.ai.generateText({
      prompt,
      max_tokens: 500
    })
    
    return response as AITextResponse
  } catch (error) {
    console.error('Error generating text:', error)
    if (isCosmicError(error)) {
      throw new Error(`Text generation failed: ${error.message}`)
    }
    throw new Error('Failed to generate text')
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