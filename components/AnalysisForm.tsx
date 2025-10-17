'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AnalysisFormProps } from '@/types'
import { getFileTypeIcon } from '@/lib/cosmic'

interface FormData {
  prompt: string
}

export default function AnalysisForm({ 
  uploadedFile, 
  onAnalyze, 
  isAnalyzing 
}: AnalysisFormProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<string>('')
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      prompt: ''
    }
  })

  const watchedPrompt = watch('prompt')

  // Predefined prompts based on file type
  const getPromptSuggestions = (fileType: string): string[] => {
    if (fileType.startsWith('image/')) {
      return [
        'Describe this image in detail and suggest a caption for social media',
        'What objects, people, or scenes do you see in this image?',
        'What colors, style, and mood does this image convey?',
        'Identify any text or writing visible in this image',
        'What would be a good alt text description for accessibility?'
      ]
    }
    
    if (fileType.includes('pdf') || fileType.includes('document')) {
      return [
        'Summarize the key points from this document',
        'What are the main topics covered in this document?',
        'Extract any important dates, numbers, or statistics',
        'What action items or recommendations are mentioned?',
        'Create a brief executive summary of this document'
      ]
    }
    
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return [
        'What trends do you see in this data?',
        'Summarize the key metrics and values',
        'What insights can you extract from this spreadsheet?',
        'Identify any patterns or outliers in the data',
        'What was the highest/lowest performing category or time period?'
      ]
    }
    
    return [
      'Analyze the content of this file',
      'Summarize the key information',
      'What insights can you provide about this file?',
      'Describe what you observe in this file',
      'Extract the most important details'
    ]
  }

  const suggestions = getPromptSuggestions(uploadedFile.type)

  const onSubmit = async (data: FormData) => {
    if (!data.prompt.trim()) return
    await onAnalyze(data.prompt.trim())
  }

  const handleSuggestionClick = (suggestion: string) => {
    setValue('prompt', suggestion)
    setSelectedPrompt(suggestion)
  }

  return (
    <div className="space-y-6">
      {/* File Preview */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <div className="text-2xl">
          {getFileTypeIcon(uploadedFile.type)}
        </div>
        <div>
          <p className="font-medium text-gray-900">
            {uploadedFile.original_name}
          </p>
          <p className="text-sm text-gray-600">
            Ready for AI analysis
          </p>
        </div>
      </div>

      {/* Prompt Suggestions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          💡 Suggested Questions
        </h3>
        <div className="grid gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={`text-left p-3 rounded-lg border transition-colors ${
                selectedPrompt === suggestion
                  ? 'border-primary bg-blue-50 text-primary'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-sm">{suggestion}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Prompt Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-lg font-semibold text-gray-900 mb-2">
            ✏️ Or Ask Your Own Question
          </label>
          <textarea
            id="prompt"
            rows={4}
            placeholder="Enter your question or prompt about the uploaded file..."
            className="textarea w-full"
            {...register('prompt', { 
              required: 'Please enter a prompt',
              minLength: {
                value: 10,
                message: 'Prompt must be at least 10 characters long'
              }
            })}
          />
          {errors.prompt && (
            <p className="text-sm text-red-600 mt-1">{errors.prompt.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {watchedPrompt.length > 0 && (
              <span>{watchedPrompt.length} characters</span>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isAnalyzing || !watchedPrompt.trim()}
            className={`btn px-6 py-3 text-base font-semibold ${
              isAnalyzing || !watchedPrompt.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                🔍 Analyze with AI
              </>
            )}
          </button>
        </div>
      </form>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for better results:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be specific about what you want to know</li>
          <li>• Ask for details, insights, or specific information</li>
          <li>• Use clear, descriptive language in your prompts</li>
          <li>• Try different angles or questions for varied insights</li>
        </ul>
      </div>
    </div>
  )
}