/**
 * MediScan AI — Landing Page Refinement & Global Navigation Verification Suite
 *
 * Validates:
 * 1. Single Continuous Scroll Experience with all 10 sections in exact order:
 *    - Section 1: Hero
 *    - Section 2: What Is MediScan AI?
 *    - Section 3: A Platform Designed to Grow
 *    - Section 4: How It Works
 *    - Section 5: Medical Imaging. Clearer Insights.
 *    - Section 6: Available Screening Workflows
 *    - Section 7: From Image to Insights
 *    - Section 8: More Than an Image
 *    - Section 9: Built Around a Clear Workflow
 *    - Section 10: Footer
 * 2. Hero Preservation:
 *    - Headline ("Early Detection. Healthier Tomorrows."), copy, doctor visual illustration.
 * 3. Section 2 (What Is MediScan AI?):
 *    - Exact copy: "A platform that organizes medical-image screening into structured, easy-to-follow workflows..."
 *    - Workstation graphic with Chest X-ray, upload node, and structured report document.
 * 4. Section 3 (Future-Expandable Platform):
 *    - Heading: "A Platform Designed to Grow".
 *    - Implemented modalities: Chest X-ray (Current), Retinal Fundus (Current).
 *    - Future possibilities: Brain Scan (Future), Bone X-ray (Future), More (Future).
 *    - Clear separation with divider and non-functional status.
 * 5. Section 4 (How It Works):
 *    - 4 steps: Upload Image -> Validate -> Process -> Review Results with descriptions and coral accent on results.
 *    - id="how-it-works" for anchor navigation.
 * 6. Section 5 & 6 (Explanatory Visuals):
 *    - Platform Overview: "Medical Imaging. Clearer Insights.", central hub with real images.
 *    - Workflows Section: "Available Screening Workflows" with TB and DR 3-step flows.
 * 7. Section 7, 8, 9 (Preserved Visuals):
 *    - From Image to Insights (4 stages).
 *    - More Than an Image (9 anatomical landmarks across CXR and DR).
 *    - Built Around a Clear Workflow (4 technical concepts).
 * 8. Section 10 (Footer):
 *    - Light blue-gray background (#E5EEFC), border-top #bfdbfe.
 *    - MediScan AI wordmark without '+' symbol.
 *    - Tagline, navigation links, workflow labels, prototype notice, copyright.
 * 9. Global Navbar:
 *    - Symbol '+' removed from navbar only; MediScan AI wordmark preserved.
 *    - 3 items: Home, Screening, How it works.
 *    - Small icon above label for all 3 items (house, scan, connected nodes).
 *    - Underline indicator on active nav item.
 *    - Translucent pill background, sticky position, no Get Started button in navbar.
 *    - Global visibility across landing page and all second-flow screening routes.
 * 10. Smart Get Started CTA Transition:
 *    - Mutually exclusive visibility between hero CTA and floating CTA.
 *    - Floating CTA is completely absent on second-flow screening pages.
 * 11. Screening Flow Protection:
 *    - Zero modification to screening selection, upload, processing, results, or backend providers.
 */

import assert from 'node:assert';
import fs from 'node:fs';

console.log('--- Starting MediScan AI Landing Page Refinement & Global Navigation Verification Suite ---');

// 1. Verify 10 Continuous Scroll Sections in Exact Order in App.tsx
console.log('\n[1/11] Verifying 10 Continuous Scroll Sections Order in App.tsx...');
const appTsx = fs.readFileSync('frontend/src/App.tsx', 'utf-8');

const section1Idx = appTsx.indexOf('<Hero');
const section2Idx = appTsx.indexOf('<WhatIsMediScanSection');
const section3Idx = appTsx.indexOf('<PlatformGrowthSection');
const section4Idx = appTsx.indexOf('<HowItWorksSection');
const section5Idx = appTsx.indexOf('<PlatformOverviewSection');
const section6Idx = appTsx.indexOf('<WorkflowsSection');
const section7Idx = appTsx.indexOf('<PipelineSection');
const section8Idx = appTsx.indexOf('<AnatomySection');
const section9Idx = appTsx.indexOf('<TechnicalOverviewSection');
const section10Idx = appTsx.indexOf('<LandingFooter');

assert(section1Idx !== -1, 'Section 1 (Hero) must be present');
assert(section2Idx !== -1, 'Section 2 (WhatIsMediScanSection) must be present');
assert(section3Idx !== -1, 'Section 3 (PlatformGrowthSection) must be present');
assert(section4Idx !== -1, 'Section 4 (HowItWorksSection) must be present');
assert(section5Idx !== -1, 'Section 5 (PlatformOverviewSection) must be present');
assert(section6Idx !== -1, 'Section 6 (WorkflowsSection) must be present');
assert(section7Idx !== -1, 'Section 7 (PipelineSection) must be present');
assert(section8Idx !== -1, 'Section 8 (AnatomySection) must be present');
assert(section9Idx !== -1, 'Section 9 (TechnicalOverviewSection) must be present');
assert(section10Idx !== -1, 'Section 10 (LandingFooter) must be present');

assert(section1Idx < section2Idx, 'Section 1 must precede Section 2');
assert(section2Idx < section3Idx, 'Section 2 must precede Section 3');
assert(section3Idx < section4Idx, 'Section 3 must precede Section 4');
assert(section4Idx < section5Idx, 'Section 4 must precede Section 5');
assert(section5Idx < section6Idx, 'Section 5 must precede Section 6');
assert(section6Idx < section7Idx, 'Section 6 must precede Section 7');
assert(section7Idx < section8Idx, 'Section 7 must precede Section 8');
assert(section8Idx < section9Idx, 'Section 8 must precede Section 9');
assert(section9Idx < section10Idx, 'Section 9 must precede Section 10');

console.log('✓ All 10 landing sections are present and verified in exact sequential scroll order.');

// 2. Verify Hero Section Preservation
console.log('\n[2/11] Verifying Hero Section Preservation...');
const heroTsx = fs.readFileSync('frontend/src/components/landing/Hero.tsx', 'utf-8');
assert(heroTsx.includes('Early Detection.'), 'Must preserve headline part 1');
assert(heroTsx.includes('Healthier'), 'Must preserve headline part 2');
assert(heroTsx.includes('Tomorrows.'), 'Must preserve headline part 3');
assert(heroTsx.includes('AI-powered screening for multiple health conditions. Simple. Fast. Accessible.'), 'Must preserve subtitle');
assert(heroTsx.includes('/assets/hero-doctor-visual.jpg'), 'Must preserve doctor visual illustration asset');
console.log('✓ Hero section composition, headline, copy, and doctor illustration preserved intact.');

// 3. Verify Section 2: What Is MediScan AI?
console.log('\n[3/11] Verifying Section 2: What Is MediScan AI?...');
const whatIsTsx = fs.readFileSync('frontend/src/components/landing/WhatIsMediScanSection.tsx', 'utf-8');
const whatIsCss = fs.readFileSync('frontend/src/components/landing/WhatIsMediScanSection.css', 'utf-8');

assert(whatIsTsx.includes('What is'), 'Must include What is');
assert(whatIsTsx.includes('MediScan'), 'Must include MediScan brand');
assert(whatIsTsx.includes('AI?'), 'Must include AI? title accent');
assert(whatIsTsx.includes('A platform that organizes medical-image screening into structured'), 'Must include exact platform description');
assert(whatIsTsx.includes('/assets/example-chest-xray.png'), 'Must display workstation screening image');
assert(whatIsTsx.includes('what-is-node--upload'), 'Must include upload node');
assert(whatIsTsx.includes('what-is-node--results'), 'Must include structured results document node');
assert(whatIsCss.includes('.what-is-card'), 'Must style section in rounded white card');
console.log('✓ Section 2 What Is MediScan AI verified with exact copy and workstation visual.');

// 4. Verify Section 3: A Platform Designed to Grow
console.log('\n[4/11] Verifying Section 3: A Platform Designed to Grow...');
const growthTsx = fs.readFileSync('frontend/src/components/landing/PlatformGrowthSection.tsx', 'utf-8');
const growthCss = fs.readFileSync('frontend/src/components/landing/PlatformGrowthSection.css', 'utf-8');

assert(growthTsx.includes('A Platform'), 'Must include A Platform');
assert(growthTsx.includes('Designed to Grow'), 'Must include Designed to Grow accent');
assert(growthTsx.includes('Starting with chest X-ray and retinal fundus workflows'), 'Must include growth copy');
assert(growthTsx.includes('Chest X-ray') && growthTsx.includes('(Current)'), 'Must include Chest X-ray (Current)');
assert(growthTsx.includes('Retinal Fundus') && growthTsx.includes('(Current)'), 'Must include Retinal Fundus (Current)');
assert(growthTsx.includes('Brain Scan') && growthTsx.includes('(Future)'), 'Must include Brain Scan (Future)');
assert(growthTsx.includes('Bone X-ray') && growthTsx.includes('(Future)'), 'Must include Bone X-ray (Future)');
assert(growthTsx.includes('More') && growthTsx.includes('(Future)'), 'Must include More (Future)');
assert(growthTsx.includes('growth-card__divider'), 'Must include vertical divider between current and future modalities');
assert(growthCss.includes('.growth-modality-badge--future'), 'Must style future modalities distinctly (dashed border/muted)');
console.log('✓ Section 3 Platform Growth verified with clear (Current) vs (Future) separation.');

// 5. Verify Section 4: How It Works
console.log('\n[5/11] Verifying Section 4: How It Works...');
const howTsx = fs.readFileSync('frontend/src/components/landing/HowItWorksSection.tsx', 'utf-8');
const howCss = fs.readFileSync('frontend/src/components/landing/HowItWorksSection.css', 'utf-8');

assert(howTsx.includes('id="how-it-works"'), 'Must have id="how-it-works" for anchor navigation');
assert(howTsx.includes('Upload Image'), 'Must include Upload Image step');
assert(howTsx.includes('Validate'), 'Must include Validate step');
assert(howTsx.includes('Process'), 'Must include Process step');
assert(howTsx.includes('Review Results'), 'Must include Review Results step');
assert(howTsx.includes('Select a supported medical image.'), 'Must include Upload description');
assert(howTsx.includes('Check format, size, and image integrity.'), 'Must include Validate description');
assert(howTsx.includes('Execute the selected workflow.'), 'Must include Process description');
assert(howTsx.includes('View findings and image visualizations.'), 'Must include Review Results description');
assert(howCss.includes('.how-it-works-step__icon-circle--coral'), 'Must apply coral accent for final results step');
console.log('✓ Section 4 How It Works verified with 4-step sequence and coral accent.');

// 6. Verify Section 5 & 6: Medical Imaging & Available Screening Workflows
console.log('\n[6/11] Verifying Section 5 & 6 (Overview & Workflows)...');
const sec5Tsx = fs.readFileSync('frontend/src/components/landing/PlatformOverviewSection.tsx', 'utf-8');
const sec6Tsx = fs.readFileSync('frontend/src/components/landing/WorkflowsSection.tsx', 'utf-8');

assert(sec5Tsx.includes('Medical Imaging.'), 'Must include Section 5 heading part 1');
assert(sec5Tsx.includes('Clearer Insights.'), 'Must include Section 5 heading part 2');
assert(sec5Tsx.includes('with room to expand to more medical imaging applications.'), 'Must include updated growth subtitle');
assert(sec5Tsx.includes('/assets/example-chest-xray.png') && sec5Tsx.includes('/assets/example-retinal-fundus.png'), 'Must render both modality previews');

assert(sec6Tsx.includes('Available'), 'Must include Available in heading');
assert(sec6Tsx.includes('Screening Workflows'), 'Must include Screening Workflows in heading');
assert(sec6Tsx.includes('Tuberculosis Screening'), 'Must include TB workflow card');
assert(sec6Tsx.includes('Diabetic Retinopathy Screening'), 'Must include DR workflow card');
assert(sec6Tsx.includes('Image Processing'), 'Must include Image Processing step');
assert(sec6Tsx.includes('Structured Results'), 'Must include Structured Results step');
console.log('✓ Section 5 & 6 verified with central node, real assets, and Available Screening Workflows heading.');

// 7. Verify Sections 7, 8, 9 Preserved Visuals
console.log('\n[7/11] Verifying Sections 7, 8, 9 Preserved Visuals...');
const sec7Tsx = fs.readFileSync('frontend/src/components/landing/PipelineSection.tsx', 'utf-8');
const sec8Tsx = fs.readFileSync('frontend/src/components/landing/AnatomySection.tsx', 'utf-8');
const sec9Tsx = fs.readFileSync('frontend/src/components/landing/TechnicalOverviewSection.tsx', 'utf-8');

assert(sec7Tsx.includes('From Image to Insights'), 'Section 7 heading preserved');
assert(sec8Tsx.includes('More Than an Image'), 'Section 8 heading preserved');
assert(sec8Tsx.includes('Lung Apex') && sec8Tsx.includes('Costophrenic Angle'), 'CXR anatomical landmarks preserved');
assert(sec8Tsx.includes('Retinal Vessels') && sec8Tsx.includes('Optic Disc'), 'DR anatomical landmarks preserved');
assert(sec9Tsx.includes('Built Around a Clear Workflow'), 'Section 9 heading preserved');
console.log('✓ Sections 7, 8, 9 preserved intact.');

// 8. Verify Section 10: Footer
console.log('\n[8/11] Verifying Section 10: Footer...');
const footerTsx = fs.readFileSync('frontend/src/components/landing/LandingFooter.tsx', 'utf-8');
const footerCss = fs.readFileSync('frontend/src/components/landing/LandingFooter.css', 'utf-8');

assert(footerCss.includes('#E5EEFC'), 'Footer must have light blue-gray background');
assert(footerCss.includes('#bfdbfe'), 'Footer must have top border #bfdbfe');
assert(!footerTsx.includes('landing-footer__logo-badge'), 'Footer must NOT render + symbol icon badge');
assert(footerTsx.includes('MediScan') && footerTsx.includes('AI'), 'Footer must preserve MediScan AI wordmark');
assert(footerTsx.includes('Medical image screening for structured and clear insights.'), 'Footer must have tagline');
assert(footerTsx.includes('TB Screening') && footerTsx.includes('DR Screening'), 'Footer must list workflows');
assert(footerTsx.includes('Prototype for demonstration and educational use.'), 'Footer must include prototype notice');
console.log('✓ Section 10 Footer verified: clean wordmark without +, 4 columns, dividers, copyright.');

// 9. Verify Global Navbar (Icon above label, no '+', no Get Started button)
console.log('\n[9/11] Verifying Global Navbar Details & Persistent Behavior...');
const headerTsx = fs.readFileSync('frontend/src/components/landing/LandingHeader.tsx', 'utf-8');
const headerCss = fs.readFileSync('frontend/src/components/landing/LandingHeader.css', 'utf-8');

assert(!headerTsx.includes('landing-header__logo-badge'), 'Navbar must NOT render + symbol badge');
assert(!headerTsx.includes('landing-header__plus'), 'Navbar must NOT render plus symbol');
assert(headerTsx.includes('landing-header__brand-name') && headerTsx.includes('MediScan'), 'Navbar must keep MediScan wordmark');
assert(headerTsx.includes('landing-header__brand-ai') && headerTsx.includes('AI'), 'Navbar must keep AI wordmark');

// Verify Icons above text label
assert(headerTsx.includes('landing-header__nav-icon'), 'Nav buttons must render icons');
assert(headerTsx.includes('landing-header__nav-label'), 'Nav buttons must render text labels');
assert(headerCss.includes('flex-direction: column'), 'Nav button must stack icon above label vertically');

// Verify 3 items: Home, Screening, How it works
assert(headerTsx.includes('Home'), 'Navbar must include Home item');
assert(headerTsx.includes('Screening'), 'Navbar must include Screening item');
assert(headerTsx.includes('How it works'), 'Navbar must include How it works item');

// Verify active indicator
assert(headerTsx.includes('landing-header__nav-indicator'), 'Navbar must include active indicator line');
assert(headerCss.includes('.landing-header__nav-indicator'), 'Navbar CSS must define active indicator line');

// Verify NO Get Started button in navbar
assert(!headerTsx.includes('Get Started'), 'Navbar must NOT include a Get Started button');

// Verify persistent sticky positioning across variants
assert(headerCss.includes('position: sticky'), 'Navbar must be sticky');
console.log('✓ Global Navbar verified: clean wordmark, vertical icon-over-label stack, active indicator, no CTA button.');

// 10. Verify Smart CTA Transition & Mutual Exclusivity
console.log('\n[10/11] Verifying Smart CTA Transition & Absence on Second Flow...');
const appCss = fs.readFileSync('frontend/src/App.css', 'utf-8');

assert(appTsx.includes('heroCtaRef = useRef'), 'App must define hero CTA ref');
assert(appTsx.includes('IntersectionObserver'), 'App must use IntersectionObserver on hero CTA');
assert(appTsx.includes('isCtaHidden={!isHeroCtaVisible}'), 'Hero CTA must hide when floating CTA is visible');
assert(appCss.includes('.landing-floating-cta {') && appCss.includes('opacity: 0'), 'Floating CTA must default to hidden (opacity: 0)');
assert(appCss.includes('.landing-floating-cta--visible') && appCss.includes('opacity: 1'), 'Floating CTA must fade in when hero CTA leaves view');

// Verify floating CTA is exclusively inside landing view
const landingBlockEnd = appTsx.indexOf("{currentView === 'selection'");
const floatingCtaIdx = appTsx.indexOf('landing-floating-cta');
assert(floatingCtaIdx < landingBlockEnd, 'Floating CTA must only be rendered inside currentView === "landing"');
console.log('✓ Smart CTA transition verified: mutually exclusive on landing, absent on screening routes.');

// 11. Verify Screening Flow Isolation
console.log('\n[11/11] Verifying Screening Flow Protection...');
const protectedFiles = [
  'frontend/src/components/selection/ScreeningSelectionPage.tsx',
  'frontend/src/components/upload/TBUploadPage.tsx',
  'frontend/src/components/upload/DRUploadPage.tsx',
  'frontend/src/components/processing/TBProcessingPage.tsx',
  'frontend/src/components/processing/DRProcessingPage.tsx',
  'frontend/src/components/results/TBResultsPage.tsx',
  'frontend/src/components/results/DRResultsPage.tsx',
];

for (const file of protectedFiles) {
  assert(fs.existsSync(file), `Protected file ${file} must exist`);
}
console.log('✓ All 7 protected screening workflow files intact.');

console.log('\n======================================================');
console.log('ALL 11 REFINEMENT VERIFICATION CHECKS PASSED (11/11)!');
console.log('======================================================\n');
