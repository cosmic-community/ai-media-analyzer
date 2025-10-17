// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Media object interface
export interface MediaObject {
  id: string;
  name: string;
  original_name: string;
  size: number;
  folder?: string;
  type: string;
  bucket: string;
  created_at: string;
  url: string;
  imgix_url: string;
  alt_text?: string;
  metadata?: Record<string, any>;
}

// AI text generation response
export interface AITextResponse {
  text: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

// AI image generation response
export interface AIImageResponse {
  media: MediaObject;
  revised_prompt: string;
}

// Upload form data interface
export interface UploadFormData {
  file: FileList;
  prompt: string;
}

// Analysis result interface
export interface AnalysisResult {
  media: MediaObject;
  analysis: string;
  prompt: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
  timestamp: string;
}

// Component prop interfaces
export interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
  uploadedFile?: MediaObject | null; // Changed: Allow both null and undefined
}

export interface AnalysisFormProps {
  uploadedFile: MediaObject;
  onAnalyze: (prompt: string) => Promise<void>;
  isAnalyzing: boolean;
}

export interface AnalysisResultProps {
  result: AnalysisResult;
  onClear: () => void;
}

// Error interface
export interface CosmicError extends Error {
  status?: number;
  code?: string;
}

// Type guard for Cosmic errors
export function isCosmicError(error: unknown): error is CosmicError {
  return error instanceof Error && 'status' in error;
}

// Utility types
export type FileTypes = 
  | 'image/jpeg'
  | 'image/jpg'
  | 'image/png'
  | 'image/gif'
  | 'image/webp'
  | 'application/pdf'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'application/vnd.ms-excel'
  | 'text/plain'
  | 'text/csv';

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
export type AnalysisStatus = 'idle' | 'analyzing' | 'success' | 'error';