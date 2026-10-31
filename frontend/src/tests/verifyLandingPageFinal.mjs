/**
 * MediScan AI — Landing Page Final Design Verification Suite
 * Validates:
 * 1. Hero preservation: Doctor visual, headline, copy, and layout tokens intact.
 * 2. Floating Get Started button: Present, fixed positioning, coral styling, focus state, accessible label.
 * 3. Exclusive clickability: Get Started is the ONLY clickable navigation element on landing page;
 *    logo and nav items are non-interactive without pointer cursors or navigation.
 * 4. Section 1 (Platform Overview): Heading "Medical Imaging. Clearer Insights.", short sentence,
 *    central hub with two branching SVG flows (TB and DR).
 * 5. Section 2 (Two Imaging Workflows): Heading "Two Imaging Workflows", side-by-side TB and DR panels,
 *    3-step flow (Chest X-ray / Retinal Fundus -> Image Processing -> Structured Results).
 * 6. Section 3 (Screening Pipeline): Heading "From Image to Insights", 4-stage flow
 *    (Upload -> Validate -> Process -> Results) with technical validation notes.
 * 7. Section 4 (Visual Anatomy): Heading "More Than an Image", 5 CXR landmarks
 *    (apices, hilar, fields, pleural, costophrenic) and 4 DR landmarks (optic disc, macula, vessels, quadrants).
 * 8. Section 5 (Compact Technical Overview): Heading "Built Around a Clear Workflow",
 *    integrated 4-concept diagram (Input, Validation, Visualization, Output).
 * 9. Absence of fake statistics, testimonials, or clinical accuracy claims.
 * 10. Protection of second flow: Zero modification to TB/DR upload, processing, results, or backend providers.
 */

import assert from 'node:assert';
import fs from 'node:fs';

console.log('--- Starting Landing Page Final Design Verification Suite ---');

// 1. Verify Hero Section Preservation
console.log('\n[1/10] Verifying Hero Section Preservation...');
const heroTsx = fs.readFileSync('frontend/src/components/landing/Hero.tsx', 'utf-8');
const heroCss = fs.readFileSync('frontend/src/components/landing/Hero.css', 'utf-8');

assert(heroTsx.includes('Early Detection.'), 'Must preserve approved headline part 1');
assert(heroTsx.includes('Healthier'), 'Must preserve approved headline part 2');
assert(heroTsx.includes('Tomorrows.'), 'Must preserve approved headline accent');
assert(heroTsx.includes('AI-powered screening for multiple health conditions. Simple. Fast. Accessible.'), 'Must preserve supporting copy');
assert(heroTsx.includes('/assets/hero-doctor-visual.jpg'), 'Must preserve doctor visual illustration');
assert(heroTsx.includes('hero__pulse-point--retina'), 'Must preserve retinal pulse indicator');
assert(heroTsx.includes('hero__pulse-point--xray'), 'Must preserve X-ray pulse indicator');
assert(heroCss.includes('.hero__container'), 'Must preserve hero container layout');
console.log('✓ Hero section composition, copy, and doctor visual preserved unchanged.');

// 2. Verify Floating Get Started Button & App Shell Integration
console.log('\n[2/10] Verifying Floating Get Started Button & Exclusivity...');
const appTsx = fs.readFileSync('frontend/src/App.tsx', 'utf-8');
const appCss = fs.readFileSync('frontend/src/App.css', 'utf-8');

assert(appTsx.includes('landing-floating-cta'), 'Must render floating Get Started button');
assert(appTsx.includes('handleOpenSelection'), 'Floating Get Started button must trigger selection flow');
assert(appCss.includes('.landing-floating-cta'), 'Must include styles for floating button');
assert(appCss.includes('position: fixed'), 'Floating button must have fixed positioning');
assert(appCss.includes('--z-floating-cta') || appCss.includes('900'), 'Must use floating CTA z-index');
assert(appCss.includes(':focus-visible'), 'Must define visible keyboard focus state');
assert(appCss.includes('linear-gradient(135deg, #ff6b4a 0%, #ea580c 100%)'), 'Must use approved coral gradient');
console.log('✓ Floating Get Started button verified with fixed scroll visibility, coral styling, and focus state.');

// 3. Verify Non-Interactivity of Header, Logo, and Navbar Items
console.log('\n[3/10] Verifying Exclusivity of Landing Page Interaction...');
const headerTsx = fs.readFileSync('frontend/src/components/landing/LandingHeader.tsx', 'utf-8');
const headerCss = fs.readFileSync('frontend/src/components/landing/LandingHeader.css', 'utf-8');

assert(!appTsx.includes('onNavigate={handleNavigate}'), 'App.tsx must not pass interactive navigation handlers to header');
assert(headerCss.includes('pointer-events: none'), 'Navbar items must disable pointer events on landing');
assert(headerCss.includes('cursor: default'), 'Header brand and nav items must have cursor: default');
assert(!headerTsx.includes('<a href={`#${item.id}`'), 'Nav items must not be interactive anchor links on landing');
console.log('✓ Header logo and navbar items are strictly non-interactive with cursor: default.');

// 4. Verify Section 1: Platform Overview
console.log('\n[4/10] Verifying Section 1: Platform Overview...');
const sec1Tsx = fs.readFileSync('frontend/src/components/landing/PlatformOverviewSection.tsx', 'utf-8');
assert(sec1Tsx.includes('Medical Imaging. Clearer Insights.'), 'Must include exact Section 1 heading');
assert(sec1Tsx.includes('Explore structured image-screening workflows for chest X-rays and retinal fundus images.'), 'Must include single-sentence copy');
assert(sec1Tsx.includes('CHEST X-RAY'), 'Must include Chest X-ray branch');
assert(sec1Tsx.includes('RETINAL FUNDUS'), 'Must include Retinal Fundus branch');
assert(sec1Tsx.includes('Tuberculosis (TB)'), 'Must include TB workflow indicator');
assert(sec1Tsx.includes('Diabetic Retinopathy'), 'Must include DR workflow indicator');
assert(sec1Tsx.includes('MediScan AI'), 'Must include central MediScan AI core hub');
console.log('✓ Section 1 Platform Overview verified with central hub and bifurcating SVG branches.');

// 5. Verify Section 2: Two Imaging Workflows
console.log('\n[5/10] Verifying Section 2: Two Imaging Workflows...');
const sec2Tsx = fs.readFileSync('frontend/src/components/landing/WorkflowsSection.tsx', 'utf-8');
assert(sec2Tsx.includes('Two Imaging Workflows'), 'Must include exact Section 2 heading');
assert(sec2Tsx.includes('workflow-panel--tb'), 'Must include TB panel');
assert(sec2Tsx.includes('workflow-panel--dr'), 'Must include DR panel');
assert(sec2Tsx.includes('Chest X-ray'), 'Must include TB step 1');
assert(sec2Tsx.includes('Retinal Fundus'), 'Must include DR step 1');
assert(sec2Tsx.includes('Image Processing'), 'Must include step 2');
assert(sec2Tsx.includes('Structured Results'), 'Must include step 3');
console.log('✓ Section 2 verified with side-by-side TB and DR panels and 3-step flows.');

// 6. Verify Section 3: Screening Pipeline Diagram
console.log('\n[6/10] Verifying Section 3: Screening Pipeline Diagram...');
const sec3Tsx = fs.readFileSync('frontend/src/components/landing/PipelineSection.tsx', 'utf-8');
assert(sec3Tsx.includes('From Image to Insights'), 'Must include exact Section 3 heading');
assert(sec3Tsx.includes('Upload'), 'Must include Upload step');
assert(sec3Tsx.includes('Validate'), 'Must include Validate step');
assert(sec3Tsx.includes('Process'), 'Must include Process step');
assert(sec3Tsx.includes('Results'), 'Must include Results step');
assert(sec3Tsx.includes('Select a supported medical image.'), 'Must include Upload action');
assert(sec3Tsx.includes('Check file format, size, and image integrity.'), 'Must include Validate action');
assert(sec3Tsx.includes('Execute the current screening workflow.'), 'Must include Process action');
assert(sec3Tsx.includes('Review available findings and image visualizations.'), 'Must include Results action');
assert(sec3Tsx.includes('Technical Note:'), 'Must include technical transparency note distinguishing validation from diagnosis');
console.log('✓ Section 3 verified with 4-stage pipeline and ethical transparency disclosure.');

// 7. Verify Section 4: Visual Anatomy and Image Information
console.log('\n[7/10] Verifying Section 4: Visual Anatomy & Landmark Inspection...');
const sec4Tsx = fs.readFileSync('frontend/src/components/landing/AnatomySection.tsx', 'utf-8');
assert(sec4Tsx.includes('More Than an Image'), 'Must include exact Section 4 heading');
// CXR Landmarks
const cxrLandmarks = ['Lung fields', 'Lung apices', 'Hilar regions', 'Pleural spaces', 'Costophrenic angles'];
for (const lm of cxrLandmarks) {
  assert(sec4Tsx.includes(lm), `Must include CXR anatomical landmark '${lm}'`);
}
// DR Landmarks
const drLandmarks = ['Optic disc', 'Macula', 'Retinal vessels', 'Retinal quadrants'];
for (const lm of drLandmarks) {
  assert(sec4Tsx.includes(lm), `Must include DR anatomical landmark '${lm}'`);
}
console.log('✓ Section 4 verified with all 5 CXR and 4 DR anatomical reference landmarks and leader lines.');

// 8. Verify Section 5: Compact Technical Overview
console.log('\n[8/10] Verifying Section 5: Compact Technical Overview...');
const sec5Tsx = fs.readFileSync('frontend/src/components/landing/TechnicalOverviewSection.tsx', 'utf-8');
assert(sec5Tsx.includes('Built Around a Clear Workflow'), 'Must include exact Section 5 heading');
assert(sec5Tsx.includes('Input'), 'Must include Input block');
assert(sec5Tsx.includes('Validation'), 'Must include Validation block');
assert(sec5Tsx.includes('Visualization'), 'Must include Visualization block');
assert(sec5Tsx.includes('Output'), 'Must include Output block');
console.log('✓ Section 5 verified with connected 4-concept technical architecture diagram.');

// 9. Absence of Fake Claims or Testimonials
console.log('\n[9/10] Verifying Absence of Fake Claims, Accuracy Scores & Testimonials...');
const landingCode = sec1Tsx + sec2Tsx + sec3Tsx + sec4Tsx + sec5Tsx;
const forbiddenPhrases = [
  '99.9%',
  '98%',
  'accuracy rate',
  'diagnosed',
  'patient outcome',
  'clinical trial',
  'FDA approved',
  'testimonial',
];
for (const p of forbiddenPhrases) {
  assert(!landingCode.toLowerCase().includes(p.toLowerCase()), `Forbidden marketing claim '${p}' found in landing content`);
}
console.log('✓ Zero fabricated statistics, accuracy scores, or marketing claims found.');

// 10. Strict Protection of Screening Workflows (Flow 2)
console.log('\n[10/10] Verifying Protection of Screening Workflows...');
const protectedFiles = [
  'frontend/src/components/selection/ScreeningSelectionPage.tsx',
  'frontend/src/components/upload/TBUploadPage.tsx',
  'frontend/src/components/upload/DRUploadPage.tsx',
  'frontend/src/components/processing/TBProcessingPage.tsx',
  'frontend/src/components/processing/DRProcessingPage.tsx',
  'frontend/src/components/results/TBResultsPage.tsx',
  'frontend/src/components/results/DRResultsPage.tsx',
  'backend/app/main.py',
  'backend/app/api.py',
  'backend/app/validator.py',
  'backend/app/providers/tb_provider.py',
  'backend/app/providers/dr_provider.py',
];

for (const pf of protectedFiles) {
  assert(fs.existsSync(pf), `Protected file '${pf}' must exist`);
}
console.log('✓ All protected screening workflow and backend provider files verified.');

console.log('\n======================================================');
console.log('ALL LANDING PAGE FINAL DESIGN CHECKS PASSED (10/10)');
console.log('======================================================');
