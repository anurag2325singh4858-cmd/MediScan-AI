/**
 * MediScan AI — Results & Workflow Type Definitions
 *
 * Source of truth: Backend Pydantic schemas in backend/app/schemas.py
 * Matches ScreeningResultResponse, ImageValidationResponse, FindingItem, and FindingCoordinates.
 * Strictly no fabricated medical confidence scores, probabilities, or severity ratings.
 */

export type WorkflowId = 'tb' | 'dr' | string;

export interface ImageValidationMetadata {
  status: 'valid';
  workflow: 'tb' | 'dr';
  format: 'jpeg' | 'png' | 'webp';
  width: number;
  height: number;
  file_size_bytes: number;
  color_mode: string;
  pixel_decoding_status: 'success';
  suitability_verified?: boolean;
  suitability_note?: string;
}

export interface FindingCoordinates {
  x_min: number; // Normalized horizontal start (0.0 to 1.0)
  y_min: number; // Normalized vertical start (0.0 to 1.0)
  x_max: number; // Normalized horizontal end (0.0 to 1.0)
  y_max: number; // Normalized vertical end (0.0 to 1.0)
}

export interface FindingItem {
  id: string;
  title: string;
  description: string;
  coordinates?: FindingCoordinates | null;
  is_educational_reference?: boolean;
  category?: 'reference' | 'inspection' | 'highlighted';
}

export interface ObservationItem {
  label: string;
  value: string;
}

export interface ScreeningResultResponse {
  result_id: string;
  workflow: 'tb' | 'dr' | string;
  status: 'completed';
  provider_type: 'simulation' | 'model';
  is_simulated: boolean;
  disclaimer: string;
  technical_summary: ImageValidationMetadata | null;
  scenario_id?: string;
  scenario_name?: string;
  findings: FindingItem[];
  observations?: ObservationItem[];
  generated_at: string;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
}

export interface ApiErrorResponse {
  detail: ApiErrorDetail;
}

/**
 * Configuration definition for a screening workflow.
 * Enables modular registration of workflows without editing shared components.
 */
export interface WorkflowDefinition {
  id: WorkflowId;
  displayName: string;
  subtitle: string;
  imageTypeLabel: string;
  theme: 'tb' | 'dr' | string;
  themeClass: string;
  accentColor: string;
  bannerGradient: string;
  description: string;
  exampleImageFilename?: string;
  annotationConfig?: {
    primaryColor: string;
    secondaryColor: string;
    coordinateSpace: 'normalized';
  };
}
