import {
  ScreeningResultResponse,
  ImageValidationMetadata,
  ApiErrorResponse,
} from '../types/results';

/**
 * Standardized API Error class capturing machine-readable codes and user-safe messages.
 */
export class ApiError extends Error {
  public readonly code: string;
  public readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Resolves the backend API base URL from Vite environment or localhost default.
 */
export function getApiBaseUrl(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname === '127.0.0.1') {
    return 'http://127.0.0.1:8000';
  }
  return 'http://localhost:8000';
}

/**
 * Parses response errors safely into an ApiError instance without disclosing raw traces.
 */
async function parseErrorResponse(response: Response): Promise<ApiError> {
  const status = response.status;
  try {
    const errorJson: ApiErrorResponse = await response.json();
    if (errorJson && errorJson.detail && typeof errorJson.detail.code === 'string') {
      return new ApiError(errorJson.detail.code, errorJson.detail.message, status);
    }
  } catch {
    // Non-JSON response or parse error
  }

  // Fallback messages based on HTTP status
  switch (status) {
    case 400:
      return new ApiError('BAD_REQUEST', 'Invalid request parameters or malformed data.', status);
    case 413:
      return new ApiError('PAYLOAD_TOO_LARGE', 'The uploaded file or resolution exceeds safety limits.', status);
    case 415:
      return new ApiError('UNSUPPORTED_MEDIA_TYPE', 'Unsupported image file format.', status);
    case 422:
      return new ApiError('UNPROCESSABLE_ENTITY', 'Required form parameters were missing or invalid.', status);
    case 500:
    case 502:
    case 503:
      return new ApiError('SERVER_ERROR', 'The screening service is currently unavailable. Please try again.', status);
    default:
      return new ApiError('UNKNOWN_ERROR', `Request failed with status code ${status}.`, status);
  }
}

/**
 * Executes full analysis pipeline on an uploaded medical image.
 * Calls POST /api/v1/analyze with multipart/form-data.
 *
 * Privacy guarantee: In-memory only. No persistence to storage, IndexedDB, or logs.
 */
export async function analyzeImage(
  workflow: string,
  file: File,
  signal?: AbortSignal,
  scenario?: number
): Promise<ScreeningResultResponse> {
  if (!workflow || !workflow.trim()) {
    throw new ApiError('INVALID_WORKFLOW', 'Workflow identifier is required.', 400);
  }
  if (!file) {
    throw new ApiError('MISSING_FILE', 'An image file is required for analysis.', 400);
  }

  const formData = new FormData();
  formData.append('workflow', workflow.trim().toLowerCase());
  formData.append('file', file);
  if (typeof scenario === 'number' && scenario >= 1 && scenario <= 6) {
    formData.append('scenario', scenario.toString());
  }

  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/api/v1/analyze`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      signal,
    });

    if (!response.ok) {
      throw await parseErrorResponse(response);
    }

    const data: ScreeningResultResponse = await response.json();
    return data;
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    }
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('ABORTED', 'The analysis request was cancelled.', 0);
    }
    const message = err instanceof Error ? err.message : 'Network error communicating with screening service.';
    throw new ApiError('NETWORK_ERROR', message, 0);
  }
}

/**
 * Requests simulated screening results directly without uploading an image.
 * Calls POST /api/v1/results/simulate with multipart form data.
 */
export async function simulateResult(
  workflow: string,
  signal?: AbortSignal,
  scenario?: number
): Promise<ScreeningResultResponse> {
  if (!workflow || !workflow.trim()) {
    throw new ApiError('INVALID_WORKFLOW', 'Workflow identifier is required.', 400);
  }

  const formData = new FormData();
  formData.append('workflow', workflow.trim().toLowerCase());
  if (typeof scenario === 'number' && scenario >= 1 && scenario <= 6) {
    formData.append('scenario', scenario.toString());
  }

  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/api/v1/results/simulate`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      signal,
    });

    if (!response.ok) {
      throw await parseErrorResponse(response);
    }

    const data: ScreeningResultResponse = await response.json();
    return data;
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    }
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('ABORTED', 'The simulation request was cancelled.', 0);
    }
    const message = err instanceof Error ? err.message : 'Network error communicating with screening service.';
    throw new ApiError('NETWORK_ERROR', message, 0);
  }
}

/**
 * Validates medical image format and technical raster integrity.
 * Calls POST /api/v1/validate with multipart/form-data.
 */
export async function validateImage(
  workflow: string,
  file: File,
  signal?: AbortSignal
): Promise<ImageValidationMetadata> {
  if (!workflow || !workflow.trim()) {
    throw new ApiError('INVALID_WORKFLOW', 'Workflow identifier is required.', 400);
  }
  if (!file) {
    throw new ApiError('MISSING_FILE', 'An image file is required for validation.', 400);
  }

  const formData = new FormData();
  formData.append('workflow', workflow.trim().toLowerCase());
  formData.append('file', file);

  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/api/v1/validate`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      signal,
    });

    if (!response.ok) {
      throw await parseErrorResponse(response);
    }

    const data: ImageValidationMetadata = await response.json();
    return data;
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    }
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('ABORTED', 'The validation request was cancelled.', 0);
    }
    const message = err instanceof Error ? err.message : 'Network error communicating with validation service.';
    throw new ApiError('NETWORK_ERROR', message, 0);
  }
}
