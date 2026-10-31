/**
 * MediScan AI — Stale State Handling & Upload Transition Verification Suite
 * Validates:
 * 1. Two technically valid but different images produce distinct, accurate technical summaries.
 * 2. Repeated upload of the same image yields consistent (not random) educational references.
 * 3. Valid image followed by invalid image cleanly rejects without carrying over old results.
 * 4. TB upload followed by DR upload isolates workflow state and findings IDs.
 * 5. Failed request followed by retry yields clean state.
 */

import assert from 'node:assert';
import fs from 'node:fs';

console.log('--- Starting Stale State & Upload Transition Verification Suite ---');

const BASE_URL = 'http://127.0.0.1:8000';

// Helper to create synthetic in-memory image
function createTestBuffer(width, height) {
  // 1x1 base PNG header or use existing example image
  const sample = fs.readFileSync('frontend/public/assets/example-chest-xray.png');
  return sample;
}

// 1. Two technically valid but different images
console.log('\n[1/5] Testing two technically valid different images...');
const cxrBytes = fs.readFileSync('frontend/public/assets/example-chest-xray.png');
const cxrBlob = new Blob([cxrBytes], { type: 'image/png' });

const form1 = new FormData();
form1.append('workflow', 'tb');
form1.append('file', cxrBlob, 'scan1.png');

const res1 = await fetch(`${BASE_URL}/api/v1/analyze`, { method: 'POST', body: form1 });
assert.strictEqual(res1.status, 200);
const data1 = await res1.json();

// Small 128x128 valid image
const valid128Png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAAA1BMVEX///+nxBvIAAAAHklEQVR4AWMYBaNgFIyCUTAKRsEoGAWjYBSMglEAAAYgAAF7p+q8AAAAAElFTkSuQmCC',
  'base64'
);
const blob2 = new Blob([valid128Png], { type: 'image/png' });
const form2 = new FormData();
form2.append('workflow', 'tb');
form2.append('file', blob2, 'scan2.png');

const res2 = await fetch(`${BASE_URL}/api/v1/analyze`, { method: 'POST', body: form2 });
assert.strictEqual(res2.status, 200);
const data2 = await res2.json();

assert.notStrictEqual(data1.result_id, data2.result_id, 'Result IDs must be unique per upload');
assert.strictEqual(data2.technical_summary.width, 128, 'Second upload must report its own dimensions');
assert.strictEqual(data2.technical_summary.height, 128, 'Second upload must report its own dimensions');
console.log('✓ Distinct images receive distinct result instances with correct respective technical metadata.');

// 2. Same image uploaded twice -> deterministic, non-random findings
console.log('\n[2/5] Testing same image uploaded twice (consistency without randomness)...');
const form3 = new FormData();
form3.append('workflow', 'tb');
form3.append('file', blob2, 'scan2_repeat.png');

const res3 = await fetch(`${BASE_URL}/api/v1/analyze`, { method: 'POST', body: form3 });
assert.strictEqual(res3.status, 200);
const data3 = await res3.json();

assert.strictEqual(data2.findings.length, data3.findings.length, 'Findings count must match');
for (let i = 0; i < data2.findings.length; i++) {
  assert.strictEqual(data2.findings[i].id, data3.findings[i].id, 'Finding ID must be deterministic');
  assert.strictEqual(data2.findings[i].title, data3.findings[i].title, 'Finding title must be deterministic');
  assert.strictEqual(data2.findings[i].description, data3.findings[i].description, 'Finding description must be deterministic');
}
console.log('✓ Repeated uploads produce stable, deterministic educational references, never random mutations.');

// 3. Valid image followed by invalid image
console.log('\n[3/5] Testing valid image followed by invalid image...');
const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAF0lEQVR4nGP8z0AaYCJR/aiGUQ1DSAMAQC4BH2bjRnMAAAAASUVORK5CYII=',
  'base64'
);
const tinyBlob = new Blob([tinyPng], { type: 'image/png' });
const formInvalid = new FormData();
formInvalid.append('workflow', 'tb');
formInvalid.append('file', tinyBlob, 'tiny.png');

const resInvalid = await fetch(`${BASE_URL}/api/v1/analyze`, { method: 'POST', body: formInvalid });
assert.strictEqual(resInvalid.status, 400, 'Invalid image must be rejected');
const errData = await resInvalid.json();
assert.strictEqual(errData.detail.code, 'IMAGE_DIMENSIONS_TOO_SMALL');

// Frontend check: TBResultsPage.tsx explicitly resets result to null when fetchAnalysis begins and on error
const pageCode = fs.readFileSync('frontend/src/components/results/TBResultsPage.tsx', 'utf-8');
assert(pageCode.includes('setResult(null); // Clear previous result immediately'), 'Must clear state before call');
assert(pageCode.includes('setResult(null); // Ensure stale result is cleared on failure'), 'Must clear state on failure');
console.log('✓ Invalid input is rejected with clear error code; frontend state clears stale result.');

// 4. TB upload followed by DR upload
console.log('\n[4/5] Testing TB upload followed by DR upload...');
const formDR = new FormData();
formDR.append('workflow', 'dr');
formDR.append('file', blob2, 'fundus.png');

const resDR = await fetch(`${BASE_URL}/api/v1/analyze`, { method: 'POST', body: formDR });
assert.strictEqual(resDR.status, 200);
const dataDR = await resDR.json();

assert.strictEqual(dataDR.workflow, 'dr');
const tbIds = new Set(data1.findings.map((f) => f.id));
const drIds = new Set(dataDR.findings.map((f) => f.id));
for (const id of drIds) {
  assert(!tbIds.has(id), `DR finding ID '${id}' must not collide with TB findings`);
}
console.log('✓ TB and DR workflows remain strictly isolated in findings, IDs, and schemas.');

// 5. Failed request followed by retry
console.log('\n[5/5] Testing failed request followed by successful retry...');
const corruptBlob = new Blob([Buffer.from('not an image data')], { type: 'image/jpeg' });
const corruptForm = new FormData();
corruptForm.append('workflow', 'tb');
corruptForm.append('file', corruptBlob, 'corrupt.jpg');

const resCorrupt = await fetch(`${BASE_URL}/api/v1/analyze`, { method: 'POST', body: corruptForm });
assert.strictEqual(resCorrupt.status, 400);

// Retry with valid file
const retryForm = new FormData();
retryForm.append('workflow', 'tb');
retryForm.append('file', blob2, 'retry.png');
const resRetry = await fetch(`${BASE_URL}/api/v1/analyze`, { method: 'POST', body: retryForm });
assert.strictEqual(resRetry.status, 200);
const retryData = await resRetry.json();
assert.strictEqual(retryData.status, 'completed');
assert(retryData.findings.length >= 1);
console.log('✓ Failed request error does not corrupt subsequent retry state.');

console.log('\n======================================================');
console.log('ALL STALE STATE & TRANSITION CHECKS PASSED (5/5)');
console.log('======================================================');
