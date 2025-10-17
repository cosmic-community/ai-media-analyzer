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

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Validate environment variables
    if (!process.env.COSMIC_BUCKET_SLUG || !process.env.COSMIC_READ_KEY || !process.env.COSMIC_WRITE_KEY) {
      console.error('Missing environment variables for analysis:', {
        bucketSlug: !!process.env.COSMIC_BUCKET_SLUG,
        readKey: !!process.env.COSMIC_READ_KEY,
        writeKey: !!process.env.COSMIC_WRITE_KEY
      })
      return NextResponse.json(
        { 
          error: 'Server configuration error: Missing required environment variables',
          details: 'COSMIC_BUCKET_SLUG, COSMIC_READ_KEY, or COSMIC_WRITE_KEY not configured'
        },
        { status: 500 }
      )
    }

    console.log('Starting AI analysis:', {
      hasMediaUrl: !!mediaUrl,
      promptLength: prompt.length,
      bucketSlug: process.env.COSMIC_BUCKET_SLUG
    })

    // Analyze media using Cosmic AI
    const response = await cosmic.ai.generateText({
      prompt,
      media_url: mediaUrl,
      max_tokens: 1000
    })

    console.log('Analysis successful:', {
      inputTokens: response.usage?.input_tokens,
      outputTokens: response.usage?.output_tokens
    })

    const analysis = response as AITextResponse

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Detailed analysis error:', {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    })
    
    // Handle Cosmic-specific errors
    if (isCosmicError(error)) {
      const errorDetails = {
        message: error.message,
        status: error.status,
        code: error.code,
      }
      
      console.error('Cosmic AI error details:', errorDetails)
      
      return NextResponse.json(
        { 
          error: `Cosmic AI error: ${error.message}`,
          details: errorDetails,
          type: 'cosmic_ai_error'
        },
        { status: error.status || 500 }
      )
    }

    // Handle network/connection errors
    if (error instanceof Error && error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          error: 'Network error while connecting to Cosmic AI',
          details: error.message,
          type: 'network_error'
        },
        { status: 503 }
      )
    }

    // Generic error with full details for debugging
    return NextResponse.json(
      { 
        error: 'Analysis failed with server error',
        details: error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'server_error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}