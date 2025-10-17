'use client'

import { useState } from 'react'
import { MediaObject, AnalysisResult } from '@/types'
import { uploadMedia, analyzeMedia } from '@/lib/cosmic'
import FileDropzone from '@/components/FileDropzone'
import AnalysisForm from '@/components/AnalysisForm'
import AnalysisResultDisplay from '@/components/AnalysisResultDisplay'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<MediaObject | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (file: File) => {
    setError(null)
    setIsUploading(true)
    setAnalysisResult(null)

    try {
      const media = await uploadMedia(file)
      setUploadedFile(media)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }

  const handleAnalysis = async (prompt: string) => {
    if (!uploadedFile) return

    setError(null)
    setIsAnalyzing(true)

    try {
      const analysis = await analyzeMedia(uploadedFile.url, prompt)
      
      const result: AnalysisResult = {
        media: uploadedFile,
        analysis: analysis.text,
        prompt,
        usage: analysis.usage,
        timestamp: new Date().toISOString(),
      }

      setAnalysisResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze media')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleClearAll = () => {
    setUploadedFile(null)
    setAnalysisResult(null)
    setError(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧠 AI Media Analyzer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload any media file and ask questions to get AI-powered insights and analysis
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-500 text-xl">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <span className="sr-only">Dismiss</span>
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Step 1: File Upload */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Upload Media File
              </h2>
              <p className="text-gray-600">
                Upload images, PDFs, Excel files, Word documents, or other media files
              </p>
            </div>
            <div className="card-content">
              <FileDropzone
                onFileSelect={handleFileUpload}
                isUploading={isUploading}
                uploadedFile={uploadedFile}
              />
            </div>
          </div>

          {/* Step 2: Analysis Form */}
          {uploadedFile && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  Ask Questions About Your File
                </h2>
                <p className="text-gray-600">
                  Enter a prompt to analyze your uploaded file with AI
                </p>
              </div>
              <div className="card-content">
                <AnalysisForm
                  uploadedFile={uploadedFile}
                  onAnalyze={handleAnalysis}
                  isAnalyzing={isAnalyzing}
                />
              </div>
            </div>
          )}

          {/* Step 3: Results Display */}
          {analysisResult && (
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="card-title flex items-center gap-2">
                    <span className="bg-success text-success-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </span>
                    Analysis Results
                  </h2>
                  <button
                    onClick={handleClearAll}
                    className="btn btn-secondary px-4 py-2"
                  >
                    Start Over
                  </button>
                </div>
                <p className="text-gray-600">
                  AI analysis of your uploaded file
                </p>
              </div>
              <div className="card-content">
                <AnalysisResultDisplay
                  result={analysisResult}
                  onClear={handleClearAll}
                />
              </div>
            </div>
          )}

          {/* Loading State */}
          {(isUploading || isAnalyzing) && (
            <div className="card">
              <div className="card-content">
                <LoadingSpinner
                  message={
                    isUploading 
                      ? 'Uploading your file to Cosmic...' 
                      : 'AI is analyzing your file...'
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm">
            Powered by{' '}
            <a 
              href="https://www.cosmicjs.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Cosmic AI
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}