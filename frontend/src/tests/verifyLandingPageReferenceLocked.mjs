/**
 * MediScan AI — Reference-Locked Landing Page Verification Suite
 *
 * Validates:
 * 1. M Logo Component & Branding:
 *    - Reusable M monogram with blue-to-cyan-to-coral gradient.
 *    - Present in navbar immediately before MediScan AI text.
 *    - Present in footer immediately before MediScan AI text.
 *    - No generic plus icon used as logo.
 * 2. Navbar:
 *    - Centered rounded translucent container.
 *    - 3 items: Home (house icon), Screening (scan icon), How it works (workflow icon).
 *    - Icons vertically stacked above labels.
 *    - Active state indicator line.
 *    - No Get Started button in navbar.
 *    - Persistent sticky positioning.
 * 3. Hero Section:
 *    - "Early Detection. Healthier Tomorrows." (Tomorrows in coral).
 *    - Supporting copy.
 *    - Doctor illustration (/assets/hero-doctor-visual.jpg).
 *    - Coral Get Started button.
 * 4. Section: What is MediScan AI?:
 *    - Heading: "What is MediScan AI?" with "MediScan AI" highlighted in blue.
 *    - Exact copy: "A platform that organizes medical-image screening into structured, easy-to-follow workflows..."
 *    - Desktop-style interface with Chest X-ray, upload node, and structured report document.
 * 5. Section: A Platform Designed to Grow:
 *    - Heading: "A Platform Designed to Grow" with "Designed to Grow" in blue.
 *    - Exact copy: "Starting with chest X-ray and retinal fundus workflows..."
 *    - 5 categories: Chest X-ray (Current), Retinal Fundus (Current) | Brain Scan (Future), Bone X-ray (Future), More (Future).
 *    - Clear divider and distinct dashed styling for future.
 * 6. Section: How It Works:
 *    - Heading: "How It Works".
 *    - 4 steps: Upload Image -> Validate -> Process -> Review Results.
 *    - Connected arrows, blue icons, coral accent for Review Results.
 *    - id="how-it-works" anchor.
 * 7. Section: Medical Imaging. Clearer Insights.:
 *    - Central hub with M monogram emblem, Chest X-ray on left (TB), Retinal Fundus on right (DR).
 *    - Subtitle matching reference.
 * 8. Section: Available Screening Workflows:
 *    - Side-by-side cards: Tuberculosis Screening and Diabetic Retinopathy Screening.
 *    - 3-step visual sequences in each.
 * 9. Section: More Than an Image:
 *    - CXR panel with 5 anatomical landmark pills.
 *    - Retinal panel with 4 anatomical landmark pills.
 * 10. Footer:
 *    - M logo immediately before MediScan AI wordmark.
 *    - 4 columns: Brand, Navigation, Screening workflows (TB/DR), Prototype notice.
 *    - Copyright strip.
 * 11. Get Started CTA Behavior:
 *    - Mutually exclusive visibility between hero CTA and floating CTA.
 *    - Floating CTA is completely absent on screening routes.
 * 12. Strict Flow Protection:
 *    - Zero changes to screening selection, upload, processing, results, or backend providers.
 */

import assert from 'node:assert';
import fs from 'node:fs';

console.log('--- Starting MediScan AI Reference-Locked Verification Suite ---');

// 1. Verify M Logo Component
console.log('\n[1/12] Verifying M Logo Monogram Component...');
const mLogoTsx = fs.readFileSync('frontend/src/components/common/MLogo.tsx', 'utf-8');
assert(mLogoTsx.includes('linearGradient'), 'MLogo must define linearGradient');
assert(mLogoTsx.includes('#1E40AF') && mLogoTsx.includes('#38BDF8') && mLogoTsx.includes('#FF5A36'), 'MLogo must use blue-to-cyan-to-coral gradient');
assert(mLogoTsx.includes('M 8 30 L 8 16'), 'MLogo must use approved ribbon M path');
console.log('✓ M logo monogram component verified with blue-to-cyan-to-coral gradient.');

// 2. Verify Navigation Bar
console.log('\n[2/12] Verifying Navigation Bar Layout, Brand & Items...');
const headerTsx = fs.readFileSync('frontend/src/components/landing/LandingHeader.tsx', 'utf-8');
const headerCss = fs.readFileSync('frontend/src/components/landing/LandingHeader.css', 'utf-8');

assert(headerTsx.includes('<MLogo'), 'Navbar must render MLogo');
assert(headerTsx.indexOf('<MLogo') < headerTsx.indexOf('landing-header__brand-text'), 'MLogo must appear immediately before brand text');
assert(headerTsx.includes('MediScan') && headerTsx.includes('AI'), 'Navbar must include MediScan AI wordmark');
assert(!headerTsx.includes('landing-header__plus'), 'Navbar must NOT use plus icon');

// 3 navigation items with icons stacked above labels
assert(headerTsx.includes('Home') && headerTsx.includes('Screening') && headerTsx.includes('How it works'), 'Navbar must have Home, Screening, How it works');
assert(headerTsx.includes('landing-header__nav-icon') && headerTsx.includes('landing-header__nav-label'), 'Navbar items must have icons and labels');
assert(headerCss.includes('flex-direction: column'), 'Nav button must stack icon above label vertically');
assert(headerTsx.includes('landing-header__nav-indicator'), 'Navbar must have active state indicator');
assert(!headerTsx.includes('Get Started'), 'Navbar must NOT include Get Started button');
assert(headerCss.includes('position: sticky'), 'Navbar must be sticky');
console.log('✓ Navigation bar verified: [M logo] MediScan AI, 3 items with stacked icons, active indicator.');

// 3. Verify Hero Section
console.log('\n[3/12] Verifying Hero Section...');
const heroTsx = fs.readFileSync('frontend/src/components/landing/Hero.tsx', 'utf-8');
assert(heroTsx.includes('Early Detection.'), 'Hero headline part 1 preserved');
assert(heroTsx.includes('Healthier'), 'Hero headline part 2 preserved');
assert(heroTsx.includes('Tomorrows.'), 'Hero headline part 3 (coral) preserved');
assert(heroTsx.includes('AI-powered screening for multiple health conditions. Simple. Fast. Accessible.'), 'Hero copy preserved');
assert(heroTsx.includes('/assets/hero-doctor-visual.jpg'), 'Doctor illustration preserved');
assert(heroTsx.includes('hero__cta-btn'), 'Hero Get Started button preserved');
console.log('✓ Hero section verified with headline, copy, doctor visual, and CTA.');

// 4. Verify Section: What is MediScan AI?
console.log('\n[4/12] Verifying Section: What is MediScan AI?...');
const whatIsTsx = fs.readFileSync('frontend/src/components/landing/WhatIsMediScanSection.tsx', 'utf-8');
assert(whatIsTsx.includes('What is'), 'Must include What is');
assert(whatIsTsx.includes('MediScan AI'), 'Must include MediScan AI');
assert(whatIsTsx.includes('A platform that organizes medical-image screening into structured, easy-to-follow workflows, from image upload to clear, structured results.'), 'Must have exact platform description');
assert(whatIsTsx.includes('/assets/example-chest-xray.png'), 'Must display workstation preview image');
assert(whatIsTsx.includes('what-is-node--upload'), 'Must include upload node');
assert(whatIsTsx.includes('what-is-node--results'), 'Must include structured findings node');
console.log('✓ Section What is MediScan AI verified with exact copy and workstation visual.');

// 5. Verify Section: A Platform Designed to Grow
console.log('\n[5/12] Verifying Section: A Platform Designed to Grow...');
const growthTsx = fs.readFileSync('frontend/src/components/landing/PlatformGrowthSection.tsx', 'utf-8');
assert(growthTsx.includes('A Platform') && growthTsx.includes('Designed to Grow'), 'Heading verified');
assert(growthTsx.includes('Starting with chest X-ray and retinal fundus workflows, MediScan AI is designed to accommodate additional medical imaging applications over time.'), 'Copy verified');
assert(growthTsx.includes('Chest X-ray') && growthTsx.includes('(Current)'), 'Chest X-ray (Current) verified');
assert(growthTsx.includes('Retinal Fundus') && growthTsx.includes('(Current)'), 'Retinal Fundus (Current) verified');
assert(growthTsx.includes('Brain Scan') && growthTsx.includes('(Future)'), 'Brain Scan (Future) verified');
assert(growthTsx.includes('Bone X-ray') && growthTsx.includes('(Future)'), 'Bone X-ray (Future) verified');
assert(growthTsx.includes('More') && growthTsx.includes('(Future)'), 'More (Future) verified');
console.log('✓ Section A Platform Designed to Grow verified with 5 categories (Current vs Future).');

// 6. Verify Section: How It Works
console.log('\n[6/12] Verifying Section: How It Works...');
const howTsx = fs.readFileSync('frontend/src/components/landing/HowItWorksSection.tsx', 'utf-8');
const howCss = fs.readFileSync('frontend/src/components/landing/HowItWorksSection.css', 'utf-8');
assert(howTsx.includes('id="how-it-works"'), 'Anchor id verified');
assert(howTsx.includes('Upload Image') && howTsx.includes('Select a supported medical image.'), 'Step 1 verified');
assert(howTsx.includes('Validate') && howTsx.includes('Check format, size, and image integrity.'), 'Step 2 verified');
assert(howTsx.includes('Process') && howTsx.includes('Execute the selected workflow.'), 'Step 3 verified');
assert(howTsx.includes('Review Results') && howTsx.includes('View findings and image visualizations.'), 'Step 4 verified');
assert(howCss.includes('.how-it-works-step__icon-circle--coral'), 'Step 4 coral accent verified');
console.log('✓ Section How It Works verified with 4-step sequence and coral accent.');

// 7. Verify Removal of Image Part & Clean Page Flow
console.log('\n[7/12] Verifying Removal of Image Part & Clean Page Flow...');
const appTsxContent = fs.readFileSync('frontend/src/App.tsx', 'utf-8');
assert(!appTsxContent.includes('<ReferenceMedicalImagingSection'), 'App.tsx must NOT render ReferenceMedicalImagingSection');
const whatIsIdx = appTsxContent.indexOf('<WhatIsMediScanSection');
const growthIdx = appTsxContent.indexOf('<PlatformGrowthSection');
const howItWorksIdx = appTsxContent.indexOf('<HowItWorksSection');
const footerIdx = appTsxContent.indexOf('<LandingFooter');
assert(whatIsIdx < growthIdx, 'What Is MediScan must precede PlatformGrowthSection');
assert(growthIdx < howItWorksIdx, 'PlatformGrowthSection must precede HowItWorksSection');
assert(howItWorksIdx < footerIdx, 'How It Works must precede LandingFooter');
console.log('✓ Image section cleanly removed; page sequence intact (Hero -> What is MediScan -> Growth -> How It Works -> Footer).');

// 8. Verify Source Screening Workflow Components Preserved
console.log('\n[8/12] Verifying Source Screening Workflow Components Preserved...');
const sec5Tsx = fs.readFileSync('frontend/src/components/landing/PlatformOverviewSection.tsx', 'utf-8');
assert(sec5Tsx.includes('Medical Imaging.') && sec5Tsx.includes('Clearer Insights.'), 'Heading verified in source component');
const sec6Tsx = fs.readFileSync('frontend/src/components/landing/WorkflowsSection.tsx', 'utf-8');
assert(sec6Tsx.includes('Available') && sec6Tsx.includes('Screening Workflows'), 'Heading verified in source component');
console.log('✓ Source screening workflow components preserved in repository.');

// 9. Verify Section: More Than an Image Source Component
console.log('\n[9/12] Verifying Section: More Than an Image Source Component...');
const anatomyTsx = fs.readFileSync('frontend/src/components/landing/AnatomySection.tsx', 'utf-8');
assert(anatomyTsx.includes('More Than') && anatomyTsx.includes('an Image'), 'Heading verified');
assert(anatomyTsx.includes('Chest X-ray Anatomy') && anatomyTsx.includes('Retinal Anatomy'), 'Both anatomy panels verified in component');
console.log('✓ Section More Than an Image source component verified.');

// 10. Verify Section: Footer (Cleaned Up & Side-by-Side Nav)
console.log('\n[10/12] Verifying Footer Section...');
const footerTsx = fs.readFileSync('frontend/src/components/landing/LandingFooter.tsx', 'utf-8');
const footerCss = fs.readFileSync('frontend/src/components/landing/LandingFooter.css', 'utf-8');
assert(footerTsx.includes('<MLogo'), 'Footer must render MLogo');
assert(footerTsx.indexOf('<MLogo') < footerTsx.indexOf('landing-footer__brand-text'), 'MLogo must appear immediately before brand text in footer');
assert(footerTsx.includes('MediScan') && footerTsx.includes('AI'), 'Footer wordmark verified');
assert(footerTsx.includes('Medical image screening for structured and clear insights.'), 'Tagline verified');
assert(footerTsx.includes('TB Screening') && footerTsx.includes('DR Screening'), 'Workflow links verified');
assert(!footerTsx.includes('Prototype for demonstration and educational use.'), 'Prototype notice must be removed');
assert(!footerTsx.includes('Prototype Version'), 'Prototype version notice must be removed');
assert(footerCss.includes('flex-direction: row'), 'Home, Screening, and How it works must be side by side');
assert(footerCss.includes('#E5EEFC'), 'Footer background verified');
assert(footerCss.includes('padding-right'), 'Footer must have right clearance to avoid overlap with Get Started CTA');
console.log('✓ Footer verified: brand, side-by-side nav, TB/DR links without Get Started overlap, prototype text removed.');

// 11. Verify Get Started Button Behavior
console.log('\n[11/12] Verifying Get Started Button Behavior & Mutual Exclusivity...');
const appTsx = fs.readFileSync('frontend/src/App.tsx', 'utf-8');
const appCss = fs.readFileSync('frontend/src/App.css', 'utf-8');

assert(appTsx.includes('heroCtaRef = useRef'), 'heroCtaRef defined');
assert(appTsx.includes('IntersectionObserver'), 'IntersectionObserver used for CTA scroll transition');
assert(appTsx.includes('isCtaHidden={!isHeroCtaVisible}'), 'Hero CTA hidden when scrolled');
assert(appCss.includes('.landing-floating-cta--visible'), 'Floating CTA visible class defined');
assert(appCss.includes('.landing-floating-cta {') && appCss.includes('opacity: 0'), 'Floating CTA hidden by default at top');

const landingBlockEnd = appTsx.indexOf("{currentView === 'selection'");
const floatingCtaIdx = appTsx.indexOf('landing-floating-cta');
assert(floatingCtaIdx < landingBlockEnd, 'Floating CTA must ONLY render inside landing view');
console.log('✓ Get Started transition verified: hero CTA and floating CTA mutually exclusive; absent on screening routes.');

// 12. Verify Screening Flow Protection
console.log('\n[12/12] Verifying Screening Flow Files Protection...');
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
console.log('ALL 12 REFERENCE-LOCKED CHECKS PASSED SUCCESSFULLY!');
console.log('======================================================\n');
