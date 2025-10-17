import { NextRequest, NextResponse } from 'next/server'
import { createBucketClient } from '@cosmicjs/sdk'
import { MediaObject, isCosmicError } from '@/types'

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 50MB' },
        { status: 400 }
      )
    }

    // Validate environment variables
    if (!process.env.COSMIC_BUCKET_SLUG || !process.env.COSMIC_READ_KEY || !process.env.COSMIC_WRITE_KEY) {
      return NextResponse.json(
        { 
          error: 'Server configuration error: Missing required environment variables',
          details: 'COSMIC_BUCKET_SLUG, COSMIC_READ_KEY, or COSMIC_WRITE_KEY not configured'
        },
        { status: 500 }
      )
    }

    console.log('Attempting to upload file:', {
      name: file.name,
      type: file.type,
      size: file.size,
    })

    // Enhanced file processing to prevent "e.on is not a function" error
    let buffer: Buffer
    try {
      const arrayBuffer = await file.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
      
      // Validate buffer was created successfully
      if (!buffer || buffer.length === 0) {
        throw new Error('Failed to process file: Empty buffer created')
      }

      // Additional validation for buffer integrity
      if (buffer.length !== file.size) {
        console.warn('Buffer size mismatch:', {
          originalSize: file.size,
          bufferSize: buffer.length
        })
      }
    } catch (bufferError) {
      console.error('Buffer creation error:', bufferError)
      return NextResponse.json(
        { 
          error: 'File processing error - unable to read file contents',
          details: bufferError instanceof Error ? bufferError.message : 'Unknown buffer error',
          type: 'file_processing_error'
        },
        { status: 400 }
      )
    }
    
    // Upload to Cosmic media library with enhanced error handling
    const response = await cosmic.media.insertOne({
      media: {
        buffer: buffer,
        originalname: file.name,
        mimetype: file.type,
      },
      folder: 'ai-uploads',
      metadata: {
        uploaded_by: 'ai-analyzer',
        upload_timestamp: new Date().toISOString(),
        original_name: file.name,
        content_type: file.type,
        file_size: file.size
      }
    })

    console.log('Upload successful:', response.media.name)
    return NextResponse.json({ media: response.media })

  } catch (error) {
    console.error('Upload error details:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    })
    
    // Handle Cosmic-specific errors
    if (isCosmicError(error)) {
      const errorDetails = {
        message: error.message,
        status: error.status,
        code: error.code,
      }
      
      console.error('Cosmic API error details:', errorDetails)
      
      return NextResponse.json(
        { 
          error: `Cosmic API error: ${error.message}`,
          details: errorDetails,
          type: 'cosmic_api_error'
        },
        { status: error.status || 500 }
      )
    }

    // Handle network/connection errors
    if (error instanceof Error && error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          error: 'Network error while connecting to Cosmic API',
          details: error.message,
          type: 'network_error'
        },
        { status: 503 }
      )
    }

    // Handle file processing errors (including the "e.on is not a function" error)
    if (error instanceof Error && (
      error.message.includes('FormData') || 
      error.message.includes('e.on is not a function') ||
      error.message.includes('stream') ||
      error.message.includes('pipe') ||
      error.message.includes('buffer') ||
      error.message.includes('media must be')
    )) {
      return NextResponse.json(
        { 
          error: 'File processing error - incompatible file format or SDK issue',
          details: `${error.message}. Please try a different file or format.`,
          type: 'file_processing_error',
          suggestions: [
            'Try converting the file to a more common format (JPG, PNG for images)',
            'Ensure the file is not corrupted',
            'Try reducing the file size',
            'Check that the file type is supported'
          ]
        },
        { status: 400 }
      )
    }

    // Generic error with full details for debugging
    return NextResponse.json(
      { 
        error: 'Upload failed',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'server_error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}