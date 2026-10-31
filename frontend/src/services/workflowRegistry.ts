import { WorkflowDefinition } from '../types/results';

/**
 * Built-in workflow definitions for Tuberculosis and Diabetic Retinopathy.
 */
export const TB_WORKFLOW_DEFINITION: WorkflowDefinition = {
  id: 'tb',
  displayName: 'Tuberculosis Screening',
  subtitle: 'Chest X-ray Analysis',
  imageTypeLabel: 'Chest Radiograph (PA View)',
  theme: 'tb',
  themeClass: 'theme-tb',
  accentColor: '#0284c7',
  bannerGradient: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(56, 189, 248, 0.04) 100%)',
  description: 'Chest X-ray screening demonstration simulating pulmonary reference assessment.',
  exampleImageFilename: 'example-chest-xray.png',
  annotationConfig: {
    primaryColor: '#0284c7',
    secondaryColor: '#38bdf8',
    coordinateSpace: 'normalized',
  },
};

export const DR_WORKFLOW_DEFINITION: WorkflowDefinition = {
  id: 'dr',
  displayName: 'Diabetic Retinopathy Screening',
  subtitle: 'Retinal Fundus Analysis',
  imageTypeLabel: 'Retinal Fundus Photograph',
  theme: 'dr',
  themeClass: 'theme-dr',
  accentColor: '#ea580c',
  bannerGradient: 'linear-gradient(135deg, rgba(234, 88, 12, 0.08) 0%, rgba(251, 146, 60, 0.04) 100%)',
  description: 'Retinal fundus photography screening demonstration simulating anatomical reference assessment.',
  exampleImageFilename: 'example-retinal-fundus.png',
  annotationConfig: {
    primaryColor: '#ea580c',
    secondaryColor: '#f97316',
    coordinateSpace: 'normalized',
  },
};

/**
 * Workflow Registry storage map.
 */
const registry: Map<string, WorkflowDefinition> = new Map([
  ['tb', TB_WORKFLOW_DEFINITION],
  ['dr', DR_WORKFLOW_DEFINITION],
]);

/**
 * Extension Point: Register or override a screening workflow configuration.
 * Allows future screening workflows to be added without modifying existing workflow code.
 */
export function registerWorkflow(definition: WorkflowDefinition): void {
  if (!definition.id || typeof definition.id !== 'string') {
    throw new Error('Workflow definition must provide a valid string ID');
  }
  registry.set(definition.id.toLowerCase().trim(), definition);
}

/**
 * Retrieve a registered workflow definition by workflow identifier.
 */
export function getWorkflow(id: string): WorkflowDefinition | undefined {
  if (!id) return undefined;
  return registry.get(id.toLowerCase().trim());
}

/**
 * Retrieve all registered workflow definitions.
 */
export function getAllWorkflows(): WorkflowDefinition[] {
  return Array.from(registry.values());
}

/**
 * Check whether a workflow ID is registered.
 */
export function isWorkflowRegistered(id: string): boolean {
  if (!id) return false;
  return registry.has(id.toLowerCase().trim());
}
