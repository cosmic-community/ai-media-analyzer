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

    // Upload to Cosmic media library
    const response = await cosmic.media.insertOne({
      media: file,
      folder: 'ai-uploads',
      metadata: {
        uploaded_by: 'ai-analyzer',
        upload_timestamp: new Date().toISOString(),
      }
    })

    const media = response.media as MediaObject

    return NextResponse.json({ media })
  } catch (error) {
    console.error('Error uploading media:', error)
    
    if (isCosmicError(error)) {
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to upload media' },
      { status: 500 }
    )
  }
}