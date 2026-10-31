/**
 * MediScan AI — Module 11A Verification Script
 * Validates Workflow Registry, Backend Schema Compatibility,
 * Disclaimer presence, Absence of fabricated clinical scores, and Component Exports.
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('--- Starting Module 11A Verification Suite ---');

// 1. Verify Workflow Registry Definitions
console.log('\n[1/5] Testing Workflow Registry...');
const registryFile = fs.readFileSync('frontend/src/services/workflowRegistry.ts', 'utf-8');
assert(registryFile.includes("id: 'tb'"), 'TB workflow definition must be present');
assert(registryFile.includes("id: 'dr'"), 'DR workflow definition must be present');
assert(registryFile.includes('registerWorkflow'), 'Workflow registration extension point must exist');
assert(registryFile.includes('getWorkflow'), 'getWorkflow function must exist');
console.log('✓ Workflow Registry contains TB and DR configurations with extension point.');

// 2. Verify TypeScript Interfaces match Backend Pydantic Schemas
console.log('\n[2/5] Testing TypeScript Contract definitions...');
const typesFile = fs.readFileSync('frontend/src/types/results.ts', 'utf-8');
const requiredFields = [
  'result_id: string',
  "workflow: 'tb' | 'dr' | string",
  "status: 'completed'",
  "provider_type: 'simulation' | 'model'",
  'is_simulated: boolean',
  'disclaimer: string',
  'technical_summary: ImageValidationMetadata | null',
  'findings: FindingItem[]',
  'generated_at: string',
  'x_min: number',
  'y_min: number',
  'x_max: number',
  'y_max: number',
];

for (const field of requiredFields) {
  assert(typesFile.includes(field), `Types definition must include '${field}'`);
}

// Ensure no fabricated scores in types
const forbiddenTypes = ['confidence:', 'probability:', 'risk_percentage:', 'severity:'];
for (const term of forbiddenTypes) {
  assert(!typesFile.includes(term), `Forbidden clinical claim '${term}' found in types/results.ts`);
}
console.log('✓ TypeScript result schema matches backend contract with 0 fabricated clinical fields.');

// 3. Verify Live API Integration & Contract Match against running Backend
console.log('\n[3/5] Verifying Live Backend Contract Match...');
const simRes = await fetch('http://127.0.0.1:8000/api/v1/results/simulate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ workflow: 'tb' }),
});

assert.strictEqual(simRes.status, 200, `Expected 200 OK from simulate endpoint, got ${simRes.status}`);
const simData = await simRes.json();

assert(typeof simData.result_id === 'string' && simData.result_id.length > 0, 'result_id must be non-empty string');
assert.strictEqual(simData.workflow, 'tb');
assert.strictEqual(simData.status, 'completed');
assert.strictEqual(simData.provider_type, 'simulation');
assert.strictEqual(simData.is_simulated, true);
assert(simData.disclaimer.includes('DEMONSTRATION ONLY'), 'Disclaimer must contain DEMONSTRATION ONLY');
assert(simData.disclaimer.includes('NOT constitute clinical diagnosis'), 'Disclaimer must declare non-clinical diagnosis');
assert(Array.isArray(simData.findings) && simData.findings.length >= 1, 'Findings must be a non-empty array');

// Check that findings contain no clinical scores
for (const f of simData.findings) {
  assert(f.id.startsWith('TB-SIM-'), `Finding ID must start with TB-SIM-, got ${f.id}`);
  assert(!('confidence' in f), 'Finding must not contain confidence score');
  assert(!('probability' in f), 'Finding must not contain probability');
  assert(!('severity' in f), 'Finding must not contain severity score');
  if (f.coordinates) {
    assert(f.coordinates.x_min >= 0 && f.coordinates.x_max <= 1);
    assert(f.coordinates.y_min >= 0 && f.coordinates.y_max <= 1);
  }
}
console.log('✓ Live simulated screening response strictly adheres to contract & safety requirements.');

// 4. Verify Shared Components Implementation
console.log('\n[4/5] Verifying Shared Components Implementation...');
const componentFiles = [
  'frontend/src/components/results/ResultsLayout.tsx',
  'frontend/src/components/results/OriginalImageViewer.tsx',
  'frontend/src/components/results/FindingsPanel.tsx',
  'frontend/src/components/results/SimulationDisclaimer.tsx',
  'frontend/src/components/results/TechnicalSummaryCard.tsx',
  'frontend/src/components/results/index.ts',
];

for (const comp of componentFiles) {
  assert(fs.existsSync(comp), `Component file must exist: ${comp}`);
}

const disclaimerCode = fs.readFileSync('frontend/src/components/results/SimulationDisclaimer.tsx', 'utf-8');
assert(disclaimerCode.includes('SIMULATED DEMONSTRATION'), 'Disclaimer component must display visual simulation badge');
assert(disclaimerCode.includes('hasSafetyAnomaly'), 'Disclaimer component must handle safety status mismatches');

const viewerCode = fs.readFileSync('frontend/src/components/results/OriginalImageViewer.tsx', 'utf-8');
assert(viewerCode.includes('data-coordinate-space="normalized"'), 'Viewer must provide normalized coordinate space abstraction');

const findingsCode = fs.readFileSync('frontend/src/components/results/FindingsPanel.tsx', 'utf-8');
assert(findingsCode.includes('onSelectFinding'), 'Findings panel must provide finding selection callback hook');
assert(findingsCode.includes('findings.length === 0'), 'Findings panel must support empty state');

console.log('✓ All 5 shared components implemented with required props, safety states, and hooks.');

// 5. Verify Storage Hygiene (No localStorage / sessionStorage)
console.log('\n[5/5] Checking Privacy and Storage Constraints...');
const resultSrcDir = 'frontend/src/components/results';
const serviceSrcDir = 'frontend/src/services';

for (const dir of [resultSrcDir, serviceSrcDir]) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), 'utf-8');
    assert(!content.includes('localStorage'), `localStorage forbidden in ${file}`);
    assert(!content.includes('sessionStorage'), `sessionStorage forbidden in ${file}`);
    assert(!content.includes('indexedDB'), `indexedDB forbidden in ${file}`);
  }
}
console.log('✓ Zero persistent browser storage detected across results components and services.');

console.log('\n======================================================');
console.log('ALL MODULE 11A CHECKS PASSED SUCCESSFULLY (5/5)');
console.log('======================================================');
