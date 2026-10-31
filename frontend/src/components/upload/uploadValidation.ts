/**
 * MediScan AI — Shared File Upload Validation Utilities
 * 
 * Used across Tuberculosis (TB) and Diabetic Retinopathy (DR) upload workflows.
 * Enforces client-side validation rules:
 * - Empty file rejection (0 bytes)
 * - Maximum file size limit (10 MB)
 * - MIME type and file extension verification (JPEG, PNG, WebP)
 * - Workflow-specific user-friendly error messages
 */

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export type ScreeningWorkflow = 'tb' | 'dr';

export interface ValidateFileOptions {
  workflow: ScreeningWorkflow;
}

/**
 * Validates an uploaded medical image file before submission.
 */
export const validateUploadFile = (
  file: File,
  options: ValidateFileOptions
): ValidationResult => {
  if (!file) {
    return { isValid: false, error: 'No file selected.' };
  }

  const isDR = options.workflow === 'dr';
  const modalityNoun = isDR ? 'retinal fundus photograph' : 'chest radiograph';
  const modalityShort = isDR ? 'retinal fundus image' : 'chest X-ray';

  // 1. Reject empty files
  if (file.size === 0) {
    return {
      isValid: false,
      error: `The selected file is empty (0 bytes). Please upload a valid ${modalityNoun}.`,
    };
  }

  // 2. Reject files exceeding 10 MB limit
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `File size (${sizeMb} MB) exceeds the 10 MB maximum limit. Please select a smaller image.`,
    };
  }

  // 3. Inspect browser MIME type and extension
  const mimeType = file.type ? file.type.toLowerCase() : '';
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();

  const isMimeValid = mimeType ? ALLOWED_MIME_TYPES.includes(mimeType) : true;
  const isExtValid = ALLOWED_EXTENSIONS.includes(extension);

  if (mimeType && !ALLOWED_MIME_TYPES.includes(mimeType)) {
    return {
      isValid: false,
      error: `Unsupported file type (${mimeType}). Please upload a ${modalityShort} in JPEG, PNG, or WebP format.`,
    };
  }

  if (!isExtValid) {
    return {
      isValid: false,
      error: `Unsupported file extension (${extension}). Please upload a .jpg, .jpeg, .png, or .webp image.`,
    };
  }

  if (!isMimeValid) {
    return {
      isValid: false,
      error: 'Unsupported image format. Please select a valid JPEG, PNG, or WebP image.',
    };
  }

  return { isValid: true };
};

/**
 * Formats bytes into a human-readable string (B, KB, MB)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};
