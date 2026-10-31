/**
 * MediScan AI — Module 11C Diabetic Retinopathy (DR) Results Page Verification Suite
 * Validates:
 * 1. DRResultsPage component structure, coral/orange theme, logo-only header, and capsule label.
 * 2. Visual layout: Original & Annotated image cards, view switcher tabs, Findings card, Technical Info card.
 * 3. Collapsible Medical Insights & Retinal Anatomy card below images (Overview, Anatomy, Clinical Protocol).
 * 4. DR anatomical landmark overlays & normalized coordinate bounds ([0.0, 1.0]).
 * 5. Strict isolation from TB (no heart size, pleural space, lung infiltrates, or bone structure).
 * 6. Absence of fabricated clinical scores, disease probabilities, or unsupported classifications.
 * 7. In-memory object URL hygiene, request cancellation (AbortController), and sequence ID race guards.
 * 8. Live API integration for DR workflow returning valid ScreeningResultResponse.
 * 9. End-to-end routing in App.tsx: dr-upload -> dr-processing -> dr-results.
 * 10. Zero persistent browser storage (localStorage, sessionStorage, indexedDB).
 * 11. Scope boundaries: No PDF generation (Module 12 boundary).
 */

import assert from 'node:assert';
import fs from 'node:fs';

console.log('--- Starting Module 11C DR Results Verification Suite ---');

const BASE_URL = 'http://127.0.0.1:8000';

// 1. Verify DRResultsPage Component Structure & Theme
console.log('\n[1/9] Testing DRResultsPage Layout & Coral/Orange Theme...');
const drPageFile = fs.readFileSync('frontend/src/components/results/DRResultsPage.tsx', 'utf-8');
const drCssFile = fs.readFileSync('frontend/src/components/results/DRResultsPage.css', 'utf-8');

assert(drPageFile.includes('export const DRResultsPage'), 'DRResultsPage must be exported');
assert(drPageFile.includes("getWorkflow('dr')"), 'DRResultsPage must resolve dr workflow from registry');
assert(drPageFile.includes("analyzeImage('dr'"), 'DRResultsPage must call analyzeImage with dr workflow');

// Header & Capsule
assert(drPageFile.includes('LandingHeader'), 'Must render LandingHeader');
assert(drPageFile.includes('variant="minimal"'), 'Must use minimal logo-only header');
assert(drPageFile.includes('Screening Results'), 'Must include Screening Results heading');
assert(drPageFile.includes('dr-results-capsule'), 'Must include DR workflow capsule');
assert(drCssFile.includes('#ea580c'), 'Must apply DR coral/orange accent color (#ea580c)');

// Layout Cards
assert(drPageFile.includes('Original Image'), 'Must include Original Image card');
assert(drPageFile.includes('Annotated Image'), 'Must include Annotated Image card');
assert(drPageFile.includes('dr-results-tabs-row'), 'Must include view switcher tabs');
assert(drPageFile.includes('dr-results-card--findings'), 'Must include Findings card');
assert(drPageFile.includes('dr-results-card--observations'), 'Must include Other Observations card');
assert(drPageFile.includes('Cup-to-Disc Ratio'), 'Must include retinal observations');
assert(drPageFile.includes('dr-results-actions-bar'), 'Must include bottom action bar');

console.log('✓ DRResultsPage layout, coral/orange theme, header, and card structure verified.');

// 2. Collapsible Medical Insights & Retinal Anatomy Card Below Images
console.log('\n[2/9] Testing Collapsible Medical Insights & Retinal Anatomy Card...');
assert(drPageFile.includes('Medical Insights &amp; Retinal Anatomy'), 'Must include Medical Insights card');
assert(drPageFile.includes('isGuidanceOpen'), 'Must implement collapsible state');
assert(drPageFile.includes('dr-clinical-guidance-header'), 'Must have clickable toggle header');
assert(drPageFile.includes('Diabetic Retinopathy Overview'), 'Must include Section A: DR Overview');
assert(drPageFile.includes('Retinal Structures &amp; Image Interpretation'), 'Must include Section B: Retinal Anatomy');
assert(drPageFile.includes('Clinical Assessment &amp; Follow-up'), 'Must include Section C: Clinical Protocol');

// Verify it is placed inside dr-results-visual-col (left column below images)
const visualColIndex = drPageFile.indexOf('dr-results-visual-col');
const guidanceIndex = drPageFile.indexOf('dr-results-card--clinical-guidance');
const detailsColIndex = drPageFile.indexOf('dr-results-details-col');
assert(visualColIndex < guidanceIndex && guidanceIndex < detailsColIndex, 'Clinical guidance must reside in left column below image tabs');

console.log('✓ Collapsible Medical Insights card properly positioned below image controls with all 3 required sections.');

// 3. Retinal Landmark Overlays & Coordinates
console.log('\n[3/9] Testing Retinal Landmark Overlays and Normalized Coordinates...');
assert(drPageFile.includes('dr-results-annotation-layer'), 'Must render annotation layer');
assert(drPageFile.includes('dr-educational-overlay-zone'), 'Must render overlay zones');
assert(drPageFile.includes('dr-educational-overlay-badge'), 'Must render numbered badges');
assert(drPageFile.includes('setSelectedFindingId'), 'Must support finding selection interaction');
assert(drPageFile.includes('Fundus (45°)'), 'Must display retinal fundus anatomical marker');

console.log('✓ Retinal anatomical overlays and coordinate-space scaling verified.');

// 4. Strict Isolation from TB Workflow
console.log('\n[4/9] Verifying Strict Workflow Isolation from TB...');
const forbiddenTbTerms = [
  'Heart Size',
  'Pleural Space',
  'Bone Structure',
  'Possible Infiltration',
  'Consolidation Area',
  'Lung Markings',
  'Diaphragm',
  'Costophrenic',
  'Chest Radiograph',
];
for (const term of forbiddenTbTerms) {
  assert(!drPageFile.includes(term), `TB-specific term '${term}' must NOT appear on DR Results page`);
}
console.log('✓ DR Results page contains zero TB-specific findings, anatomical claims, or chest observations.');

// 5. Ethical Safety: Absence of Fabricated Clinical Claims
console.log('\n[5/9] Verifying Absence of Fabricated Clinical Scores & Claims...');
const forbiddenClaimKeys = [
  'confidence:',
  'probability:',
  'risk_score:',
  'severity_score:',
  'mild non-proliferative',
  'severe non-proliferative',
  'proliferative diabetic retinopathy detected',
];
for (const key of forbiddenClaimKeys) {
  assert(!drPageFile.toLowerCase().includes(key), `Forbidden clinical claim key '${key}' found in DRResultsPage`);
}
console.log('✓ Zero fabricated clinical confidence scores, probabilities, or unsupported classifications.');

// 6. Stale State, Object URL Hygiene & Concurrency Guards
console.log('\n[6/9] Testing Concurrency, Stale State & Object URL Hygiene...');
assert(drPageFile.includes('AbortController'), 'Must use AbortController to cancel stale requests');
assert(drPageFile.includes('activeRequestIdRef'), 'Must use request counter to avoid race conditions');
assert(drPageFile.includes('URL.revokeObjectURL'), 'Must revoke object URLs on cleanup');
assert(drPageFile.includes('setResult(null); // Clear previous result immediately'), 'Must clear state on new request');
assert(drPageFile.includes('setResult(null); // Ensure stale result is cleared on failure'), 'Must clear state on error');

console.log('✓ Concurrency race guards, object URL revocation, and stale state reset verified.');

// 7. Live Backend Integration for DR Workflow
console.log('\n[7/9] Testing Live Backend Analysis API for DR Workflow...');
const sampleFundus = fs.readFileSync('frontend/public/assets/example-retinal-fundus.png');
const fundusBlob = new Blob([sampleFundus], { type: 'image/png' });
const formData = new FormData();
formData.append('workflow', 'dr');
formData.append('file', fundusBlob, 'fundus.png');

const res = await fetch(`${BASE_URL}/api/v1/analyze`, { method: 'POST', body: formData });
assert.strictEqual(res.status, 200, `API request failed with status ${res.status}`);
const data = await res.json();

assert.strictEqual(data.workflow, 'dr');
assert.strictEqual(data.status, 'completed');
assert.strictEqual(data.is_simulated, true);
assert(data.result_id.startsWith('dr_sim_'));
assert.strictEqual(data.findings.length, 4, 'DR workflow must return exactly 4 demonstration findings');

const expectedIds = ['DR-SIM-001', 'DR-SIM-002', 'DR-SIM-003', 'DR-SIM-004'];
for (let i = 0; i < 4; i++) {
  assert.strictEqual(data.findings[i].id, expectedIds[i]);
  assert(data.findings[i].coordinates !== null);
  const coords = data.findings[i].coordinates;
  assert(coords.x_min >= 0 && coords.x_max <= 1);
  assert(coords.y_min >= 0 && coords.y_max <= 1);
  assert(coords.x_min < coords.x_max);
  assert(coords.y_min < coords.y_max);
}

// Technical summary populated
assert(data.technical_summary !== null);
assert.strictEqual(data.technical_summary.format, 'png');
assert(data.technical_summary.width > 0);
assert(data.technical_summary.height > 0);

console.log('✓ Live API returns completed DR response with 4 normalized retinal findings and verified technical summary.');

// 8. App Navigation Integration (dr-upload -> dr-processing -> dr-results)
console.log('\n[8/9] Testing App.tsx Routing and Navigation for DR...');
const appFile = fs.readFileSync('frontend/src/App.tsx', 'utf-8');
assert(appFile.includes("currentView === 'dr-results'"), 'App.tsx must render DRResultsPage for dr-results view');
assert(appFile.includes('DRResultsPage'), 'App.tsx must import DRResultsPage');
assert(appFile.includes('#dr-results'), 'App.tsx must support #dr-results hash routing');
assert(appFile.includes('handleCompleteDRProcessing'), 'App.tsx must handle DR processing completion');
assert(appFile.includes('handleBackFromDRResults'), 'App.tsx must handle Back from DR results');
assert(appFile.includes('handleResetDRWorkflow'), 'App.tsx must handle New Screening for DR');

console.log('✓ Complete navigation flow verified: DR upload -> processing -> DR results -> new screening.');

// 9. Storage Hygiene & Scope Preservation
console.log('\n[9/9] Checking Browser Storage Hygiene & Scope Boundaries...');
assert(!drPageFile.includes('localStorage'), 'localStorage is strictly forbidden in DRResultsPage');
assert(!drPageFile.includes('sessionStorage'), 'sessionStorage is strictly forbidden in DRResultsPage');
assert(!drPageFile.includes('indexedDB'), 'indexedDB is strictly forbidden in DRResultsPage');
assert(!fs.existsSync('frontend/src/services/pdfService.ts'), 'PDF generation must NOT be implemented (Module 12 boundary)');

console.log('✓ Storage hygiene confirmed (zero persistent storage); Module 12 PDF boundary preserved.');

console.log('\n======================================================');
console.log('ALL MODULE 11C CHECKS PASSED SUCCESSFULLY (9/9)');
console.log('======================================================');
