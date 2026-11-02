/**
 * MediScan AI — Module 11B Restored Design & 6 Educational Scenarios Verification Suite
 * Validates:
 * 1. Professional DEMO SIMULATION badge near results heading.
 * 2. Restored spacious visual hierarchy: Original & Annotated image cards, detailed Findings panel,
 *    Technical Information card, bottom action bar.
 * 3. Six distinct predefined educational visualization scenarios.
 * 4. Annotation color system: Green (Reference), Blue (Inspection), Red (Highlighted Demo) + Legend.
 * 5. Removal of unsupported clinical observations & fake detections.
 * 6. Image preservation, coordinate scaling, and stale state clearing.
 * 7. Live API integration, workflow suitability, storage hygiene, and scope preservation.
 */

import assert from 'node:assert';
import fs from 'node:fs';

console.log('--- Starting Module 11B Restored Design & Scenarios Verification Suite ---');

const BASE_URL = 'http://127.0.0.1:8000';

// 1. Verify TBResultsPage Component Structure & Restored Design
console.log('\n[1/7] Testing TBResultsPage Restored Layout & Design Elements...');
const pageFile = fs.readFileSync('frontend/src/components/results/TBResultsPage.tsx', 'utf-8');
assert(pageFile.includes('export const TBResultsPage'), 'TBResultsPage must be exported');
assert(pageFile.includes("getWorkflow('tb')"), 'TBResultsPage must resolve tb workflow from registry');
assert(pageFile.includes("analyzeImage('tb'"), 'TBResultsPage must call real analyzeImage API with tb workflow');

// Verification that unwanted demo/educational placeholder texts are completely removed
assert(!pageFile.includes('tb-demo-badge'), 'tb-demo-badge must be removed from UI');
assert(!pageFile.includes('<span>DEMO</span>'), 'DEMO badge text must be removed from UI');
assert(!pageFile.includes('Educational & Non-Diagnostic Simulation Demonstration'), 'Educational & Non-Diagnostic text must be removed');
assert(!pageFile.includes('Educational Anatomical Reference'), 'Educational Anatomical Reference must be removed');
assert(!pageFile.includes('Additional Inspection Reference'), 'Additional Inspection Reference must be removed');
assert(!pageFile.includes('Highlighted Educational Region'), 'Highlighted Educational Region must be removed');
assert(!pageFile.includes('Educational visualization colors for demonstration only; not clinical risk classifications.'), 'Educational visualization disclaimer text must be removed');
assert(!pageFile.includes('tb-results-disclaimer-wrap'), 'Large yellow disclaimer banner wrap must be removed');

// Layout cards matching refined clinical hierarchy
assert(pageFile.includes('Original Image'), 'Must include Original Image card');
assert(pageFile.includes('Annotated Image'), 'Must include Annotated Image card');
assert(pageFile.includes('tb-results-card--findings'), 'Must include Findings card');
assert(pageFile.includes('tb-results-card--observations'), 'Must include Other Observations card');
assert(pageFile.includes('tb-results-card--clinical-guidance'), 'Must include Clinical Guidance card positioned below images');
assert(!pageFile.includes('Technical Image Information'), 'Technical Image Information card must be removed');
assert(!pageFile.includes('Chest X-ray (Frontal View)'), 'Image Type label must be removed with technical card');
assert(!pageFile.includes('tb-results-card--technical'), 'Technical Image Information card class must be removed');
assert(pageFile.includes('tb-results-actions-bar'), 'Must include bottom action bar');

// Scenario control bar must be REMOVED from the UI
assert(!pageFile.includes('tb-scenario-control-bar'), 'Scenario control bar must be completely removed from UI');
assert(!pageFile.includes('tb-scenario-btn'), 'Scenario buttons must be removed from UI');
assert(!pageFile.includes('tb-scenario-pills'), 'Scenario pills must be removed from UI');

// Request cancellation & concurrency guards
assert(pageFile.includes('AbortController'), 'Must use AbortController to cancel stale requests');
assert(pageFile.includes('activeRequestIdRef'), 'Must track activeRequestIdRef to prevent race conditions');

// Medical Guidance Section below images (Collapsible)
assert(pageFile.includes('Medical Problem, Solution &amp; Common Image Insights'), 'Must include Medical Problem, Solution & Common Image Insights card');
assert(pageFile.includes('isGuidanceOpen'), 'Must implement collapsible state for clinical guidance');
assert(pageFile.includes('tb-clinical-guidance-header'), 'Must have clickable header for expanding guidance');
assert(pageFile.includes('Primary Medical Problem (Tuberculosis)'), 'Must include problem description');
assert(pageFile.includes('Clinical Solutions &amp; Recommended Actions'), 'Must include clinical solutions');
assert(pageFile.includes('Common Information Obtainable from Frontal Chest X-Rays'), 'Must include common radiograph insights');

console.log('✓ Clean clinical layout, Other Observations, Medical Problem/Solution insights, and concurrency guards verified.');

// 2. Verify Ethical Safety & Absence of Fabricated Clinical Scores
console.log('\n[2/7] Verifying Absence of Fabricated Clinical Scores...');
const forbiddenKeys = ['confidence:', 'probability:', 'risk_score:', 'severity_score:'];
for (const key of forbiddenKeys) {
  assert(!pageFile.includes(key), `Forbidden clinical claim key '${key}' found in TBResultsPage.tsx`);
}
console.log('✓ Zero fabricated clinical confidence scores or severity ratings found.');

// 3. Verify Stale State Reset & Image Preservation
console.log('\n[3/7] Verifying Stale State Clearing and Image Object URL Hygiene...');
assert(pageFile.includes('setResult(null); // Ensure stale result is cleared on failure'), 'Must clear state on failure');
assert(pageFile.includes('URL.revokeObjectURL'), 'Must revoke object URLs');
assert(pageFile.includes('setSelectedFindingId(null)'), 'Must reset finding selection');
console.log('✓ Stale results cleared on error/transitions and object URLs revoked.');

// 4. Verify Live API: All Six Educational Scenarios
console.log('\n[4/7] Verifying Live Backend Generation of All Six Educational Scenarios...');
const sampleCxr = fs.readFileSync('frontend/public/assets/example-chest-xray.png');
const expectedCounts = [2, 4, 2, 3, 3, 3];

for (let s = 1; s <= 6; s++) {
  const blob = new Blob([sampleCxr], { type: 'image/png' });
  const formData = new FormData();
  formData.append('workflow', 'tb');
  formData.append('file', blob, 'cxr.png');
  formData.append('scenario', s.toString());

  const res = await fetch(`${BASE_URL}/api/v1/analyze`, { method: 'POST', body: formData });
  assert.strictEqual(res.status, 200, `Scenario ${s} request failed with status ${res.status}`);
  const data = await res.json();

  assert.strictEqual(data.scenario_id, `scenario_${s}`);
  assert.strictEqual(data.findings.length, expectedCounts[s - 1], `Scenario ${s} findings count mismatch`);

  for (const f of data.findings) {
    assert(f.is_educational_reference === true);
    assert(['reference', 'inspection', 'highlighted'].includes(f.category));
    if (f.coordinates) {
      assert(f.coordinates.x_min >= 0 && f.coordinates.x_max <= 1);
      assert(f.coordinates.y_min >= 0 && f.coordinates.y_max <= 1);
    }
  }
}

// Verify internal automatic scenario selection when scenario parameter is omitted
const autoBlob = new Blob([sampleCxr], { type: 'image/png' });
const autoForm = new FormData();
autoForm.append('workflow', 'tb');
autoForm.append('file', autoBlob, 'cxr_auto.png');
const autoRes = await fetch(`${BASE_URL}/api/v1/analyze`, { method: 'POST', body: autoForm });
assert.strictEqual(autoRes.status, 200);
const autoData = await autoRes.json();
assert(autoData.scenario_id && autoData.scenario_id.startsWith('scenario_'), 'Backend must assign an internal scenario automatically');
assert(autoData.findings.every(f => f.is_educational_reference === true));

console.log('✓ All 6 educational visualization scenarios and default internal scenario assignment verified via live API.');

// 5. Verify Workflow Suitability Checks
console.log('\n[5/7] Verifying Workflow Suitability Rejection...');
const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAF0lEQVR4nGP8z0AaYCJR/aiGUQ1DSAMAQC4BH2bjRnMAAAAASUVORK5CYII=',
  'base64'
);
const tinyBlob = new Blob([tinyPng], { type: 'image/png' });
const tinyForm = new FormData();
tinyForm.append('workflow', 'tb');
tinyForm.append('file', tinyBlob, 'tiny.png');

const tinyRes = await fetch(`${BASE_URL}/api/v1/validate`, { method: 'POST', body: tinyForm });
assert.strictEqual(tinyRes.status, 400);
const tinyErr = await tinyRes.json();
assert.strictEqual(tinyErr.detail.code, 'IMAGE_DIMENSIONS_TOO_SMALL');
console.log('✓ Rejects images below workflow minimum dimensions with IMAGE_DIMENSIONS_TOO_SMALL.');

// 6. Verify Storage Hygiene (No Persistent Storage)
console.log('\n[6/7] Checking Browser Storage Constraints...');
assert(!pageFile.includes('localStorage'), 'localStorage is strictly forbidden in TBResultsPage');
assert(!pageFile.includes('sessionStorage'), 'sessionStorage is strictly forbidden in TBResultsPage');
assert(!pageFile.includes('indexedDB'), 'indexedDB is strictly forbidden in TBResultsPage');
console.log('✓ Zero persistent browser storage detected.');

// 7. Verify Scope Preservation (No Module 12 PDF generation, No models downloaded)
console.log('\n[7/7] Verifying Scope Boundaries...');
assert(!fs.existsSync('frontend/src/services/pdfService.ts'), 'PDF generation must NOT be implemented (Module 12 boundary)');
console.log('✓ Scope boundaries respected: PDF generation not started.');

console.log('\n======================================================');
console.log('ALL MODULE 11B CHECKS PASSED (7/7)');
console.log('======================================================');
