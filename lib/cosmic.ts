import { MediaObject, AITextResponse } from '@/types'

/**
 * Upload a file to Cosmic media library via API route
 */
export async function uploadMedia(file: File): Promise<MediaObject> {
  try {
    console.log('Starting file upload:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Upload API error:', {
        status: response.status,
        statusText: response.statusText,
        error: data.error,
        details: data.details,
        type: data.type
      })
      
      // Provide detailed error message based on error type
      let errorMessage = data.error || 'Upload failed'
      
      if (data.details) {
        errorMessage += `: ${data.details}`
      }
      
      if (data.type === 'cosmic_api_error') {
        errorMessage = `Cosmic API Error - ${errorMessage}`
      } else if (data.type === 'network_error') {
        errorMessage = `Network Error - ${errorMessage}. Please check your internet connection.`
      } else if (data.type === 'file_processing_error') {
        errorMessage = `File Processing Error - ${errorMessage}. Please try a different file.`
      }
      
      throw new Error(errorMessage)
    }

    console.log('Upload successful:', data.media.name)
    return data.media as MediaObject
  } catch (error) {
    console.error('Client-side upload error:', {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    // Re-throw with preserved error message for user display
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
    console.log('Starting media analysis:', {
      mediaUrl,
      promptLength: prompt.length
    })

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
      console.error('Analysis API error:', {
        status: response.status,
        statusText: response.statusText,
        error: data.error,
        details: data.details
      })
      
      let errorMessage = data.error || 'Analysis failed'
      if (data.details) {
        errorMessage += `: ${data.details}`
      }
      
      throw new Error(errorMessage)
    }

    console.log('Analysis successful')
    return data.analysis as AITextResponse
  } catch (error) {
    console.error('Client-side analysis error:', error)
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
      console.error('Text generation API error:', {
        status: response.status,
        error: data.error,
        details: data.details
      })
      
      let errorMessage = data.error || 'Text generation failed'
      if (data.details) {
        errorMessage += `: ${data.details}`
      }
      
      throw new Error(errorMessage)
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