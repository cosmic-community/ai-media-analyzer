'use client'

import { AnalysisResultProps } from '@/types'
import { getFileTypeIcon, formatFileSize } from '@/lib/cosmic'

export default function AnalysisResultDisplay({ result, onClear }: AnalysisResultProps) {
  const formatTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString()
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Analysis copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* File Info Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {getFileTypeIcon(result.media.type)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {result.media.original_name}
            </h3>
            <p className="text-sm text-gray-600">
              {formatFileSize(result.media.size)} • Analyzed {formatTimestamp(result.timestamp)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open(result.media.url, '_blank')}
            className="btn btn-secondary px-3 py-1 text-sm"
          >
            View File
          </button>
        </div>
      </div>

      {/* Prompt Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">
          ❓ Your Question:
        </h4>
        <p className="text-blue-800 italic">"{result.prompt}"</p>
      </div>

      {/* AI Analysis */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            🤖 AI Analysis
          </h4>
          <button
            onClick={() => copyToClipboard(result.analysis)}
            className="btn btn-secondary px-3 py-1 text-sm"
            title="Copy analysis to clipboard"
          >
            📋 Copy
          </button>
        </div>
        
        <div className="prose prose-gray max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {result.analysis}
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">📊 Usage Statistics</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {result.usage.input_tokens}
            </div>
            <div className="text-sm text-gray-600">Input Tokens</div>
          </div>
          <div className="bg-white rounded p-3 text-center">
            <div className="text-2xl font-bold text-green-600">
              {result.usage.output_tokens}
            </div>
            <div className="text-sm text-gray-600">Output Tokens</div>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-500 text-center">
          Total tokens used: {result.usage.input_tokens + result.usage.output_tokens}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onClear}
          className="btn btn-secondary px-6 py-2"
        >
          🔄 Analyze Another File
        </button>
      </div>
    </div>
  )
}