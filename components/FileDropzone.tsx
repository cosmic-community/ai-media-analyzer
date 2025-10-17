'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileDropzoneProps } from '@/types'
import { formatFileSize, getFileTypeIcon } from '@/lib/cosmic'

export default function FileDropzone({ 
  onFileSelect, 
  isUploading, 
  uploadedFile 
}: FileDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Changed: Add proper bounds checking for array access
    if (acceptedFiles.length > 0 && acceptedFiles[0]) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 50 * 1024 * 1024, // 50MB
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
    }
  })

  if (uploadedFile) {
    return (
      <div className="p-6 border-2 border-green-200 bg-green-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl">
              {getFileTypeIcon(uploadedFile.type)}
            </div>
            <div>
              <h3 className="font-semibold text-green-900">
                {uploadedFile.original_name}
              </h3>
              <p className="text-sm text-green-700">
                {formatFileSize(uploadedFile.size)} • {uploadedFile.type}
              </p>
              <p className="text-xs text-green-600 mt-1">
                ✅ Uploaded successfully
              </p>
            </div>
          </div>
          <div className="text-green-600 text-2xl">
            ✅
          </div>
        </div>
        
        <div className="mt-4">
          <button
            onClick={() => window.open(uploadedFile.url, '_blank')}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            View uploaded file
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`p-12 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-primary bg-blue-50'
          : isUploading
          ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
          : 'border-gray-300 hover:border-primary hover:bg-blue-50'
      }`}
    >
      <input {...getInputProps()} disabled={isUploading} />
      
      <div className="space-y-4">
        <div className="text-6xl">
          {isUploading ? (
            <div className="animate-bounce">⬆️</div>
          ) : isDragActive ? (
            '📁'
          ) : (
            '🗂️'
          )}
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isUploading
              ? 'Uploading...'
              : isDragActive
              ? 'Drop your file here'
              : 'Upload Media File'
            }
          </h3>
          
          {!isUploading && (
            <>
              <p className="text-gray-600 mb-4">
                {isDragActive
                  ? 'Release to upload your file'
                  : 'Drag and drop a file here, or click to select'
                }
              </p>
              
              <div className="text-sm text-gray-500 space-y-1">
                <p><strong>Supported formats:</strong></p>
                <p>📸 Images: PNG, JPG, JPEG, GIF, WebP</p>
                <p>📄 Documents: PDF, Word (.docx), Excel (.xlsx, .xls)</p>
                <p>📋 Text: TXT, CSV</p>
                <p><strong>Max size:</strong> 50MB</p>
              </div>
            </>
          )}
        </div>
        
        {isUploading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  )
}