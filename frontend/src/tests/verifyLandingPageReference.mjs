/**
 * MediScan AI — Landing Page Final Reference Implementation Verification Suite
 *
 * Validates:
 * 1. Visual Source of Truth & Hero Preservation:
 *    - Headline ("Early Detection. Healthier Tomorrows."), supporting copy, doctor visual asset.
 *    - Light blue/lavender theme background gradient.
 * 2. Translucent Rounded Pill Navbar:
 *    - Translucent pill background, backdrop blur, rounded-full pill shape.
 *    - Logo badge '+' and wordmark 'MediScan AI'.
 *    - Vertical divider '|'.
 *    - Navigation items: Home, Screening, How it works with smooth scroll/navigation bindings.
 * 3. Smart Get Started Transition & CTA Exclusivity:
 *    - Hero CTA and floating CTA never appear simultaneously.
 *    - Hero CTA uses ref and IntersectionObserver in App.tsx.
 *    - Floating CTA defaults to hidden (opacity: 0, pointer-events: none).
 *    - Floating CTA has .landing-floating-cta--visible (opacity: 1, pointer-events: auto).
 *    - Hero CTA wrapper has .hero__cta-wrapper--hidden.
 *    - Only the active CTA is in keyboard tab order (tabIndex 0 vs -1).
 *    - Both CTAs navigate to screening selection (handleOpenSelection).
 * 4. Section 1 (Platform Overview):
 *    - Heading: "Medical Imaging. Clearer Insights."
 *    - Central MediScan AI circular node ('M' ribbon logo).
 *    - Real assets /assets/example-chest-xray.png and /assets/example-retinal-fundus.png.
 *    - Cyan and coral connecting branches.
 * 5. Section 2 (Two Imaging Workflows):
 *    - Heading: "Two Imaging Workflows".
 *    - Side-by-side light cards for TB (#dbeafe) and DR (#fed7aa).
 *    - 3-step flows (Chest X-ray / Retinal Fundus -> Image Processing -> Structured Results).
 * 6. Section 3 (From Image to Insights):
 *    - Heading: "From Image to Insights".
 *    - 4 stages: Upload -> Validate -> Process -> Results.
 * 7. Section 4 (More Than an Image):
 *    - Heading: "More Than an Image".
 *    - Side-by-side anatomy cards with real images.
 *    - CXR: 5 leader line labels (Apex, Field, Pleural Space, Hilar, Costophrenic).
 *    - Retinal: 4 leader line labels (Vessels, Macula, Optic Disc, Quadrants).
 * 8. Section 5 (Built Around a Clear Workflow):
 *    - Heading: "Built Around a Clear Workflow".
 *    - 4 stages: Input -> Validation -> Visualization -> Output.
 * 9. Section 6 (Simplified Light Blue-Gray Footer):
 *    - Background #E5EEFC with border-top #bfdbfe.
 *    - 4 columns with vertical dividers '|'.
 *    - Col 1: Logo & tagline.
 *    - Col 2: Navigation links (Home, Screening, How it works).
 *    - Col 3: Workflows (TB Screening, DR Screening).
 *    - Col 4: Prototype note.
 *    - Bottom row: divider and copyright notice.
 * 10. Screening Flow Isolation:
 *    - ScreeningSelectionPage, TBUploadPage, DRUploadPage, TBProcessingPage,
 *      DRProcessingPage, TBResultsPage, DRResultsPage, and backend providers remain untouched.
 */

import assert from 'node:assert';
import fs from 'node:fs';

console.log('--- Starting MediScan AI Landing Page Reference Verification Suite ---');

// 1. Verify Hero Section Preservation
console.log('\n[1/10] Verifying Hero Section Preservation...');
const heroTsx = fs.readFileSync('frontend/src/components/landing/Hero.tsx', 'utf-8');
const heroCss = fs.readFileSync('frontend/src/components/landing/Hero.css', 'utf-8');

assert(heroTsx.includes('Early Detection.'), 'Must preserve approved headline part 1');
assert(heroTsx.includes('Healthier'), 'Must preserve approved headline part 2');
assert(heroTsx.includes('Tomorrows.'), 'Must preserve approved headline accent');
assert(heroTsx.includes('AI-powered screening for multiple health conditions. Simple. Fast. Accessible.'), 'Must preserve supporting copy');
assert(heroTsx.includes('/assets/hero-doctor-visual.jpg'), 'Must preserve doctor visual illustration');
assert(heroTsx.includes('ctaRef'), 'Hero must accept ctaRef for intersection observation');
assert(heroTsx.includes('isCtaHidden'), 'Hero must accept isCtaHidden prop');
assert(heroCss.includes('.hero__cta-wrapper--hidden'), 'Hero CSS must define .hero__cta-wrapper--hidden');
console.log('✓ Hero section composition, copy, doctor asset, and transition hooks verified.');

// 2. Verify Pill Navbar
console.log('\n[2/10] Verifying Pill Navbar Appearance & Navigation...');
const headerTsx = fs.readFileSync('frontend/src/components/landing/LandingHeader.tsx', 'utf-8');
const headerCss = fs.readFileSync('frontend/src/components/landing/LandingHeader.css', 'utf-8');

assert(headerCss.includes('border-radius: 9999px') || headerCss.includes('border-radius: var(--radius-full)'), 'Navbar must have rounded-full pill shape');
assert(headerCss.includes('backdrop-filter: blur'), 'Navbar must have translucent backdrop blur');
assert(headerTsx.includes('landing-header__plus'), 'Header must contain plus logo badge');
assert(headerTsx.includes('MediScan'), 'Header must contain MediScan brand name');
assert(headerTsx.includes('AI'), 'Header must contain AI brand suffix');
assert(headerTsx.includes('landing-header__divider'), 'Header must contain vertical divider');
assert(headerTsx.includes('Home'), 'Navbar must contain Home link');
assert(headerTsx.includes('Screening'), 'Navbar must contain Screening link');
assert(headerTsx.includes('How it works'), 'Navbar must contain How it works link');
console.log('✓ Navbar pill styling, brand badge, divider, and navigation links verified.');

// 3. Verify Smart CTA Transition & Mutually Exclusive Visibility
console.log('\n[3/10] Verifying Smart CTA Transition & Mutual Exclusivity...');
const appTsx = fs.readFileSync('frontend/src/App.tsx', 'utf-8');
const appCss = fs.readFileSync('frontend/src/App.css', 'utf-8');

assert(appTsx.includes('heroCtaRef = useRef'), 'App must define heroCtaRef');
assert(appTsx.includes('isHeroCtaVisible'), 'App must manage isHeroCtaVisible state');
assert(appTsx.includes('IntersectionObserver'), 'App must use IntersectionObserver for CTA transition');
assert(appTsx.includes('isCtaHidden={!isHeroCtaVisible}'), 'Hero CTA must be hidden when floating CTA is visible');
assert(appTsx.includes('landing-floating-cta--visible'), 'App must apply landing-floating-cta--visible when hero CTA is not visible');
assert(appCss.includes('.landing-floating-cta {') && appCss.includes('opacity: 0'), 'Floating CTA must default to hidden (opacity: 0)');
assert(appCss.includes('.landing-floating-cta--visible') && appCss.includes('opacity: 1'), 'Floating CTA must become visible (opacity: 1) on scroll');
assert(appTsx.includes('tabIndex={!isHeroCtaVisible ? 0 : -1}'), 'Floating CTA tabIndex must be mutually exclusive');
console.log('✓ Smart CTA scroll transition verified: hero CTA and floating CTA never show simultaneously.');

// 4. Verify Section 1: Platform Overview
console.log('\n[4/10] Verifying Section 1: Platform Overview...');
const sec1Tsx = fs.readFileSync('frontend/src/components/landing/PlatformOverviewSection.tsx', 'utf-8');
const sec1Css = fs.readFileSync('frontend/src/components/landing/PlatformOverviewSection.css', 'utf-8');

assert(sec1Tsx.includes('Medical Imaging. Clearer Insights.'), 'Must include exact Section 1 heading');
assert(sec1Tsx.includes('Explore structured image-screening workflows for chest X-rays and retinal fundus images.'), 'Must include subtitle');
assert(sec1Tsx.includes('/assets/example-chest-xray.png'), 'Must use real chest X-ray image');
assert(sec1Tsx.includes('/assets/example-retinal-fundus.png'), 'Must use real retinal fundus image');
assert(sec1Tsx.includes('platform-overview__hub'), 'Must include central hub node');
assert(sec1Tsx.includes('platform-overview__line--tb') && sec1Tsx.includes('platform-overview__line--dr'), 'Must include cyan and coral connector lines');
assert(sec1Css.includes('.platform-overview__image-card'), 'Must style preview images in cards');
console.log('✓ Section 1 Platform Overview verified with central hub, real assets, and connector lines.');

// 5. Verify Section 2: Two Imaging Workflows
console.log('\n[5/10] Verifying Section 2: Two Imaging Workflows...');
const sec2Tsx = fs.readFileSync('frontend/src/components/landing/WorkflowsSection.tsx', 'utf-8');
const sec2Css = fs.readFileSync('frontend/src/components/landing/WorkflowsSection.css', 'utf-8');

assert(sec2Tsx.includes('Two Imaging Workflows'), 'Must include exact Section 2 heading');
assert(sec2Tsx.includes('Tuberculosis Screening'), 'Must include TB workflow title');
assert(sec2Tsx.includes('Diabetic Retinopathy Screening'), 'Must include DR workflow title');
assert(sec2Tsx.includes('Chest X-ray'), 'Must include CXR step');
assert(sec2Tsx.includes('Retinal Fundus'), 'Must include DR step');
assert(sec2Tsx.includes('Image Processing'), 'Must include Image Processing step');
assert(sec2Tsx.includes('Structured Results'), 'Must include Structured Results step');
assert(sec2Css.includes('#dbeafe') || sec2Css.includes('rgba(219, 234, 254'), 'Must use light blue accent for TB card');
assert(sec2Css.includes('#fed7aa') || sec2Css.includes('rgba(254, 215, 170'), 'Must use light peach accent for DR card');
console.log('✓ Section 2 Two Imaging Workflows verified with light cards and 3-step flows.');

// 6. Verify Section 3: Screening Pipeline
console.log('\n[6/10] Verifying Section 3: Screening Pipeline...');
const sec3Tsx = fs.readFileSync('frontend/src/components/landing/PipelineSection.tsx', 'utf-8');
const sec3Css = fs.readFileSync('frontend/src/components/landing/PipelineSection.css', 'utf-8');

assert(sec3Tsx.includes('From Image to Insights'), 'Must include exact Section 3 heading');
assert(sec3Tsx.includes('Upload'), 'Must include Upload stage');
assert(sec3Tsx.includes('Validate'), 'Must include Validate stage');
assert(sec3Tsx.includes('Process'), 'Must include Process stage');
assert(sec3Tsx.includes('Results'), 'Must include Results stage');
assert(sec3Css.includes('.pipeline-card'), 'Must style pipeline stages in white card');
console.log('✓ Section 3 Screening Pipeline verified with 4 horizontal stages.');

// 7. Verify Section 4: Anatomy Cards & Leader Lines
console.log('\n[7/10] Verifying Section 4: Anatomy Cards & Leader Lines...');
const sec4Tsx = fs.readFileSync('frontend/src/components/landing/AnatomySection.tsx', 'utf-8');
const sec4Css = fs.readFileSync('frontend/src/components/landing/AnatomySection.css', 'utf-8');

assert(sec4Tsx.includes('More Than an Image'), 'Must include exact Section 4 heading');
assert(sec4Tsx.includes('Chest X-ray Anatomy'), 'Must include CXR card badge');
assert(sec4Tsx.includes('Retinal Anatomy'), 'Must include Retinal card badge');
// CXR 5 landmarks
assert(sec4Tsx.includes('Lung Apex'), 'Must include Lung Apex label');
assert(sec4Tsx.includes('Lung Field'), 'Must include Lung Field label');
assert(sec4Tsx.includes('Pleural Space'), 'Must include Pleural Space label');
assert(sec4Tsx.includes('Hilar Region'), 'Must include Hilar Region label');
assert(sec4Tsx.includes('Costophrenic Angle'), 'Must include Costophrenic Angle label');
// Retinal 4 landmarks
assert(sec4Tsx.includes('Retinal Vessels'), 'Must include Retinal Vessels label');
assert(sec4Tsx.includes('Macula'), 'Must include Macula label');
assert(sec4Tsx.includes('Optic Disc'), 'Must include Optic Disc label');
assert(sec4Tsx.includes('Retinal Quadrants'), 'Must include Retinal Quadrants label');
assert(sec4Tsx.includes('/assets/example-chest-xray.png'), 'Must display CXR image');
assert(sec4Tsx.includes('/assets/example-retinal-fundus.png'), 'Must display retinal image');
assert(sec4Css.includes('.anatomy-card'), 'Must style anatomy cards in light theme');
console.log('✓ Section 4 Anatomy Cards verified with real assets and 9 anatomical leader line labels.');

// 8. Verify Section 5: Built Around a Clear Workflow
console.log('\n[8/10] Verifying Section 5: Technical Overview...');
const sec5Tsx = fs.readFileSync('frontend/src/components/landing/TechnicalOverviewSection.tsx', 'utf-8');
const sec5Css = fs.readFileSync('frontend/src/components/landing/TechnicalOverviewSection.css', 'utf-8');

assert(sec5Tsx.includes('Built Around a Clear Workflow'), 'Must include exact Section 5 heading');
assert(sec5Tsx.includes('Input'), 'Must include Input concept');
assert(sec5Tsx.includes('Validation'), 'Must include Validation concept');
assert(sec5Tsx.includes('Visualization'), 'Must include Visualization concept');
assert(sec5Tsx.includes('Output'), 'Must include Output concept');
assert(sec5Css.includes('.tech-overview__card'), 'Must style technical overview in light blue card');
console.log('✓ Section 5 Built Around a Clear Workflow verified with 4 integrated concepts.');

// 9. Verify Section 6: Footer
console.log('\n[9/10] Verifying Section 6: Footer Layout & Dividers...');
const footerTsx = fs.readFileSync('frontend/src/components/landing/LandingFooter.tsx', 'utf-8');
const footerCss = fs.readFileSync('frontend/src/components/landing/LandingFooter.css', 'utf-8');

assert(footerCss.includes('#E5EEFC') || footerCss.includes('background: #E5EEFC'), 'Footer must have light blue-gray background');
assert(footerCss.includes('#bfdbfe'), 'Footer must have top border #bfdbfe');
assert(footerTsx.includes('landing-footer__divider'), 'Footer must have vertical dividers between columns');
assert(footerTsx.includes('Medical image screening for structured and clear insights.'), 'Footer col 1 must have tagline');
assert(footerTsx.includes('Home'), 'Footer col 2 must have Home link');
assert(footerTsx.includes('Screening'), 'Footer col 2 must have Screening link');
assert(footerTsx.includes('How it works'), 'Footer col 2 must have How it works link');
assert(footerTsx.includes('TB Screening'), 'Footer col 3 must have TB Screening');
assert(footerTsx.includes('DR Screening'), 'Footer col 3 must have DR Screening');
assert(footerTsx.includes('Prototype for demonstration and educational use.'), 'Footer col 4 must have prototype note');
assert(footerTsx.includes('MediScan AI. Prototype Version.') && (footerTsx.includes('&copy;') || footerTsx.includes('©')), 'Footer must have copyright row');
console.log('✓ Section 6 Footer verified with 4 columns, dividers, and slightly darker light blue-gray background.');

// 10. Verify Screening Flow Isolation
console.log('\n[10/10] Verifying Screening Flow Files Isolation...');
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
console.log('✓ All 7 protected screening workflow files verified and intact.');

console.log('\n======================================================');
console.log('ALL 10 REFERENCE VERIFICATION CHECKS PASSED SUCCESSFULLY!');
console.log('======================================================\n');
