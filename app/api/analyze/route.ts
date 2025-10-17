import { NextRequest, NextResponse } from 'next/server'
import { createBucketClient } from '@cosmicjs/sdk'
import { AITextResponse, isCosmicError } from '@/types'

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

export async function POST(request: NextRequest) {
  try {
    const { mediaUrl, prompt } = await request.json()

    if (!mediaUrl || !prompt) {
      return NextResponse.json(
        { error: 'Media URL and prompt are required' },
        { status: 400 }
      )
    }

    // Analyze media using Cosmic AI
    const response = await cosmic.ai.generateText({
      prompt,
      media_url: mediaUrl,
      max_tokens: 1000
    })

    const analysis = response as AITextResponse

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Error analyzing media:', error)
    
    if (isCosmicError(error)) {
      return NextResponse.json(
        { error: `Analysis failed: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to analyze media' },
      { status: 500 }
    )
  }
}