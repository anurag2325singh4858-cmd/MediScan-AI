# MediScan AI — Landing Page Design Proposals & Architecture Specification

**Document Version:** 1.0.0  
**Status:** Under Review  
**Date:** October 2026  
**Context:** Monorepo (`frontend/`, `backend/`, `docs/`)

---

## 1. Executive Summary & Design Authority

This specification defines the design, content hierarchy, and interaction architecture for the **MediScan AI** landing page. It establishes three concrete design alternatives to finalize the layout and content below the existing hero section prior to code implementation.

### 1.1 Approved Visual Baseline (Preserved Unconditionally)
The following approved elements represent the established visual baseline and are preserved without modification:
- **Hero Section Composition:** Dark navy heading typography (`#0D1B3E`), clean off-white canvas, doctor visual illustration with floating clinical assets (`hero-doctor-visual.jpg`), and supportive subtitle copy.
- **Brand Identity & Header:** Stylized vector gradient "M" logo (`#1E40AF` $\rightarrow$ `#0284C7` $\rightarrow$ `#38BDF8` $\rightarrow$ `#FB7185` $\rightarrow$ `#FF5A36`), bold navy "MediScan", vivid blue "AI", and the centered 3-item icon-led vertical navigation (Home, Screening, How it works).
- **Primary CTA:** Coral-orange "Get Started $\rightarrow$" CTA button (`#FF5A36`).
- **Core Color Palette:**
  - Base: Clean white (`#FFFFFF`) and subtle off-white page background (`#F8FAFC`).
  - Dark Navy Typography: `#0D1B3E` (Headings) and `#475569` (Body).
  - Tuberculosis (TB) Modality: Blue palette (`#0284C7`, `#E0F2FE`, `#BAE6FD`).
  - Diabetic Retinopathy (DR) Modality: Coral/Orange palette (`#EA580C` / `#FF5A36`, `#FFF7ED`, `#FED7AA`).

---

## 2. Two-Flow Application Architecture

As established in the architectural reference, **MediScan AI** is strictly bifurcated into two distinct operational flows:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ FLOW 1: LANDING PAGE (Scroll-Based Public Experience)                         │
│ • Sticky Navbar (Home, Screening, How it works)                               │
│ • Hero Section with Primary "Get Started" CTA                                 │
│ • Content Sections (About, Workflows, How It Works, Responsible AI, Scope)   │
│ • Floating "Get Started ↑" CTA (Active only when hero button is out of view)  │
└──────────────────────────────────────┬────────────────────────────────────────┘
                                       │ Clicking "Get Started"
                                       ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│ FLOW 2: SCREENING APPLICATION (Non-Scroll, Multi-Page Clinical Workflow)      │
│                                                                               │
│ ┌───────────────────────────────────────────────────────────────────────────┐ │
│ │ 2.1 Screening Type Selection Screen ("Upload. Analyse. Get Insights.")    │ │
│ │     • Card A: Tuberculosis Screening (Chest X-ray) ──► "Choose →"         │ │
│ │     • Card B: Diabetic Retinopathy Screening (Retinal) ──► "Choose →"     │ │
│ └───────────────────────────────┬───────────────────────────┬───────────────┘ │
│                                 │                           │                 │
│         Select Tuberculosis     ▼                           ▼   Select DR     │
│ ┌─────────────────────────────────────────┐   ┌─────────────────────────────┐ │
│ │ 2.2 TB Screening Flow (Blue Theme)      │   │ 2.3 DR Screening Flow       │ │
│ │  1. Upload Image (Chest X-ray)          │   │  1. Upload Image (Fundus)   │ │
│ │  2. Processing (Simulation In-Progress) │   │  2. Processing (Simulation) │ │
│ │  3. Results (Annotated + Findings)      │   │  3. Results (Annotations)   │ │
│ │  4. Report (Download PDF Summary)       │   │  4. Report (Download PDF)   │ │
│ └─────────────────────────────────────────┘   └─────────────────────────────┘ │
│                                                                               │
│ * Invariant Rule: NO "Get Started" button appears anywhere inside Flow 2.    │
└───────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Key Interaction Invariants
1. **CTA Exclusivity:** The "Get Started" CTA exists **exclusively** within Flow 1 (Landing Page). It serves solely as the gateway transition into Flow 2. No "Get Started" button exists inside Screen 2.1, 2.2, or 2.3.
2. **Floating CTA Logic:** On the landing page, a floating bottom-right CTA button appears **only** after the primary hero button has scrolled out of the viewport. It never renders concurrently with the hero button.
3. **Workflow Theme Scoping:** Selecting TB opens a lung-themed workspace with blue accents. Selecting DR opens an eye-themed workspace with coral accents.
4. **Non-Clinical Simulation Boundary:** Medical findings in both flows are powered by the backend simulation engine. All UI copy must preserve explicit disclaimers that results are non-diagnostic demonstration outputs.

---

## 3. Detailed Landing-Page Layout Proposals

Below are three distinct, production-ready proposals for the landing page below the hero.

---

### Proposal A — Minimal & Focused

#### Concept Overview
A compact, rapid-scan landing page that keeps the hero as the primary focal point and introduces only essential explanatory content before funneling the user into Flow 2. It closely mirrors the direct visual hierarchy of the architectural reference sheet.

#### Section Order & Specifications

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. HERO SECTION (Approved Baseline — Unchanged)                 │
├─────────────────────────────────────────────────────────────────┤
│ 2. WHAT IS MEDISCAN AI? (Platform Overview & UI Reader Preview) │
├─────────────────────────────────────────────────────────────────┤
│ 3. SCREENING MODALITIES (Active Dual Cards + Roadmap Badge Row) │
├─────────────────────────────────────────────────────────────────┤
│ 4. HOW IT WORKS (Horizontal 4-Step Process Bar)                 │
├─────────────────────────────────────────────────────────────────┤
│ 5. CLOSING CALLOUT & DISCLAIMER ("Better Insights Tomorrow")   │
└─────────────────────────────────────────────────────────────────┘
```

1. **Section 1 — Hero Section (Existing)**:
   - Preserved exactly as currently implemented.
2. **Section 2 — What is MediScan AI?**:
   - **Purpose:** Provide a 30-second explanation of the assistive screening concept.
   - **Heading:** `What is MediScan AI?`
   - **Body Copy:** "MediScan AI is an assistive medical-imaging demonstration platform. We illustrate how automated computer-vision algorithms can pre-screen clinical images, detect subtle physiological markers, and support frontline healthcare workers with immediate diagnostic triage."
   - **Visual Asset:** A styled clinical image reader card showing a chest radiograph inside a simulated medical viewer UI with subtle status badges (`Quality Conforming`, `No Latency`).
3. **Section 3 — Multiple Screening Types**:
   - **Purpose:** Present the two active screening workflows while showing future platform versatility.
   - **Heading:** `Multiple Screening Types`
   - **Subheading:** "Targeted screening pipelines tailored for specific anatomical modalities."
   - **Card A (Active — TB):** Blue theme, lung icon, title "Chest X-ray (Tuberculosis)", badge "Active Simulation", action "Select Workflow $\rightarrow$".
   - **Card B (Active — DR):** Coral theme, retinal eye icon, title "Retinal Image (Diabetic Retinopathy)", badge "Active Simulation", action "Select Workflow $\rightarrow$".
   - **Future Concept Pills:** Inactive horizontal icon strip: Brain Scan, Skin Lesion, Bone Radiograph, More (+), with clear "Roadmap Concept" muted badges.
4. **Section 4 — How It Works**:
   - **Purpose:** Present the workflow sequence in 4 clear, bite-sized steps.
   - **Heading:** `How It Works`
   - **4 Steps (Horizontal Row):**
     - `Step 1 — Upload Image:` Select supported CXR or retinal fundus photograph.
     - `Step 2 — AI Analysis:` Simulated multi-layer feature detection and validation.
     - `Step 3 — Get Insights:` Localized heatmap annotations and confidence indices.
     - `Step 4 — Take Action:` Download structured clinical PDF summary report.
5. **Section 5 — Closing Callout & Ethics Banner**:
   - **Heading:** `Better Insights for a Healthier Tomorrow`
   - **Copy:** "Engineered for primary healthcare demonstration. All findings are generated by a deterministic simulation engine for workflow evaluation."
   - **Floating CTA:** Coral-orange floating pill `Get Started ↑` positioned at bottom right, visible only after scrolling past the hero.

#### Technical Characteristics
- **Page Length:** Compact (~2 to 2.5 viewports).
- **Navigation Mapping:**
  - `Home` $\rightarrow$ Hero top.
  - `Screening` $\rightarrow$ Section 3 (Screening Types).
  - `How it works` $\rightarrow$ Section 4 (How It Works).
- **Animation Strategy:** Minimal entrance fades (`opacity` + `translateY(12px)` on scroll). Zero loop animations except for the floating CTA subtle entrance.

#### Advantages & Disadvantages
- **Advantages:**
  - Matches the architectural reference visual structure almost 1:1.
  - Lowest cognitive load; fastest path to launching Flow 2.
  - Cleanest mobile layout with zero scrolling fatigue.
- **Disadvantages:**
  - Provides limited depth on responsible AI, data privacy, and clinical limitations.
  - Does not preview the deep explainability features (e.g., heatmaps or bounding annotations).

---

### Proposal B — Visual & Interactive (Technical Storytelling)

#### Concept Overview
A visually rich, technically authoritative landing page engineered for hackathon evaluation and technical judges. It uses interactive SVG medical schematics, animated scanlines, and deep architectural breakdowns to demonstrate clinical credibility and responsible software design.

#### Section Order & Specifications

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. HERO SECTION (Approved Baseline — Unchanged)                 │
├─────────────────────────────────────────────────────────────────┤
│ 2. ABOUT & THE DIAGNOSTIC GAP (Dual Column: Mission + Pipeline) │
├─────────────────────────────────────────────────────────────────┤
│ 3. DUAL SCREENING WORKFLOWS (Detailed TB Blue & DR Coral Cards) │
├─────────────────────────────────────────────────────────────────┤
│ 4. STEP-BY-STEP SEQUENCE (3-Step Connected Flow + Guardrails)   │
├─────────────────────────────────────────────────────────────────┤
│ 5. PRIVACY & RESPONSIBLE USE (2x2 Ethics & Disclaimers Grid)    │
├─────────────────────────────────────────────────────────────────┤
│ 6. FUTURE SCREENING HORIZONS (4 Conceptual Roadmap Cards)       │
└─────────────────────────────────────────────────────────────────┘
```

1. **Section 1 — Hero Section (Existing)**:
   - Preserved exactly as currently implemented.
2. **Section 2 — About MediScan AI & The Diagnostic Gap**:
   - **Heading:** `Accessible AI-Assisted Medical Screening`
   - **Left Column (Clinical Need):** Explains specialist shortages in primary care, latency in traditional radiology reporting, and the role of assistive AI triage in early detection.
   - **Right Column (Interactive Pipeline Schematic):** 3-stage visual diagram (*Image Ingestion & Conformance* $\rightarrow$ *Feature Extraction Simulation* $\rightarrow$ *Clinician Decision Support*) with animated glowing pulse lines.
3. **Section 3 — Targeted Screening Workflows**:
   - **Heading:** `Intelligent Medical Screening Workflows`
   - **Subheading:** "Deep inspection pipelines tailored for pulmonary and ophthalmic pathology."
   - **Card A (Tuberculosis CXR):**
     - Custom SVG of thoracic cavity and bronchial tree with an active sweep scanline.
     - Simulated apical infiltrate bounding box with confidence badge (`TB Infiltrate 89%`).
     - Technical checklist (Modality: PA/AP Chest Radiographs; Analysis: Cavitation & consolidation detection; Pre-flight: Exposure verification).
     - Action: Full-width button `Explore TB Screening →`.
   - **Card B (Diabetic Retinopathy Fundus):**
     - Custom SVG of retinal fundus with optic disc, macula, and vascular arcades with an active sweep scanline.
     - Simulated hard exudate bounding box (`Exudates / DR 94%`).
     - Technical checklist (Modality: Color Retinal Fundus; Analysis: Microaneurysms & exudates; Pre-flight: Illumination & blur guardrails).
     - Action: Full-width button `Explore DR Screening →`.
4. **Section 4 — How MediScan AI Operates**:
   - **Heading:** `How MediScan AI Operates`
   - **3-Step Sequence with Animated Connector Line:**
     - `01. Pre-flight Validation:` Conformance checks for image resolution, blur, and aspect ratio.
     - `02. Simulated AI Inference:` Multi-pattern segmentation and risk confidence index modeling.
     - `03. Review & PDF Report:` Interactive heatmap viewer and clinical report export.
5. **Section 5 — Privacy & Responsible Use**:
   - **Heading:** `Privacy & Responsible Use`
   - **2x2 Grid of Authoritative Safeguards:**
     - *Ephemeral Memory Processing:* Zero persistent disk storage; images discarded immediately after session.
     - *No Patient History Archiving:* Zero EHR connectivity; no patient records stored.
     - *Simulated Findings Boundary:* Explicit notice that results demonstrate UI workflows, not real pathology.
     - *Non-Clinical Medical Disclaimer:* Clear notice that software is not an FDA/CE cleared medical device.
6. **Section 6 — Future Screening Horizons**:
   - **Heading:** `Future Screening Horizons`
   - **4 Conceptual Roadmap Cards:** Extended Pulmonary Radiography, Glaucoma & AMD Triage, DICOMweb PACS Interoperability, and Offline Edge WebAssembly Inference.

#### Technical Characteristics
- **Page Length:** Comprehensive (~4 to 4.5 viewports).
- **Navigation Mapping:**
  - `Home` $\rightarrow$ Hero top.
  - `Screening` $\rightarrow$ Section 3 (Screening Workflows).
  - `How it works` $\rightarrow$ Section 4 (How MediScan AI Operates).
- **Animation Strategy:** Native `IntersectionObserver` scroll reveals, staggered card entrances (`0.1s`–`0.3s`), SVG scanline sweeps, and hover elevation (`translateY(-4px)`). Fully disabled when `prefers-reduced-motion` is enabled.

#### Advantages & Disadvantages
- **Advantages:**
  - Demonstrates maximum technical depth, clinical realism, and engineering rigor.
  - Unambiguously covers data privacy, ethical boundaries, and medical disclaimers.
  - Highly engaging interactive visuals that stand out in hackathon presentations.
- **Disadvantages:**
  - Longer scroll depth; takes longer for users to reach the bottom CTA.
  - Requires maintaining more copy and UI assets.

---

### Proposal C — Product Showcase (Hybrid & Balanced) ★ Recommended

#### Concept Overview
The optimal balanced architecture. It combines the clean conciseness of Proposal A with the technical credibility and medical SVGs of Proposal B. Instead of separating "What is it", "Screening", and "How it works" into multiple sparse sections, it organizes the page into **three high-impact thematic blocks** below the hero:
1. An **Active Workflow Spotlight** that showcases TB and DR side-by-side.
2. A **Unified "How It Works & Technology"** section that pairs the 4-step sequence with a preview of the interactive annotation viewer.
3. A **Compact Trust & Roadmap Banner** that combines responsible AI safeguards with future capabilities.

#### Section Order & Specifications

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. HERO SECTION (Approved Baseline — Unchanged)                 │
├─────────────────────────────────────────────────────────────────┤
│ 2. ACTIVE SCREENING WORKFLOWS (Dual TB & DR Visual Cards)       │
├─────────────────────────────────────────────────────────────────┤
│ 3. THE SCREENING PIPELINE (Interactive 3-Step Walkthrough)       │
├─────────────────────────────────────────────────────────────────┤
│ 4. TRUST, ETHICS & ROADMAP (Compact 2-Column Split Card)         │
├─────────────────────────────────────────────────────────────────┤
│ 5. LAUNCH CALLOUT (Direct Transition to Flow 2)                 │
└─────────────────────────────────────────────────────────────────┘
```

1. **Section 1 — Hero Section (Existing)**:
   - Preserved exactly as currently implemented.
2. **Section 2 — Active Screening Workflows (TB & DR Spotlight)**:
   - **Purpose:** Immediately satisfy user curiosity regarding the two primary capabilities right below the hero fold.
   - **Heading:** `Targeted Screening Workflows`
   - **Subheading:** "MediScan AI demonstrates assistive computer-vision pipelines for pulmonary and retinal health conditions."
   - **Layout:** 2 equal-width cards:
     - **TB Card (Blue Theme):** Includes the thoracic radiograph illustration with the simulated apical infiltrate bounding box, modality tag (`Chest X-Ray`), bullet highlights (Cavity detection, exposure quality checks), and an active button: `Explore TB Screening →`.
     - **DR Card (Coral Theme):** Includes the retinal fundus illustration with microaneurysm/exudate markers, modality tag (`Retinal Fundus`), bullet highlights (Macular edema risk, sharpness guardrails), and an active button: `Explore DR Screening →`.
   - **Direct Flow Transition:** Clicking either button directly launches Flow 2 (`2.1 Selection Screen` with that workflow pre-selected).
3. **Section 3 — The Screening Pipeline (How It Works)**:
   - **Purpose:** Demystify the user experience from upload to PDF report.
   - **Heading:** `From Image Upload to Clinical Summary`
   - **Subheading:** "A structured three-step protocol designed for rapid triage in community health centers."
   - **Layout:** 3 connected cards with clean numbered badges (`01 Upload`, `02 Analyze`, `03 Review`):
     - `01. Pre-Flight Conformance:` Automated verification of image resolution, blur, and aspect ratio.
     - `02. Simulated Inference:` Convolutional feature segmentation and condition probability scoring.
     - `03. Clinical Report:` Localized visual heatmaps and downloadable standardized PDF summary.
4. **Section 4 — Trust, Ethics & Roadmap (Unified 2-Column Card)**:
   - **Purpose:** Present all essential disclaimers, data privacy guarantees, and future vision in a single compact, high-density block without bloating page height.
   - **Left Column (Responsible AI & Privacy):**
     - Heading: `Responsible AI & Patient Privacy`
     - Bullets: Ephemeral in-memory processing (zero disk storage), no EHR tracking or patient history retention, and explicit non-diagnostic medical device disclaimer.
   - **Right Column (Future Expansion):**
     - Heading: `Future Screening Horizons`
     - Subtle badge strip: Extended Chest Radiography (Pneumonia, Cardiomegaly), Glaucoma Cup-to-Disc Triage, Hospital DICOMweb PACS Ingestion, and Offline Mobile Edge Inference.
5. **Section 5 — Closing Callout & Flow Gateway**:
   - **Purpose:** Final launchpad at the foot of the page.
   - **Heading:** `Experience MediScan AI`
   - **Copy:** "Start an interactive screening demonstration with sample medical imaging datasets."
   - **Button:** Coral-orange `Launch Screening Demo →` (mirrors the Hero CTA to enter Flow 2).
   - **Floating CTA:** Coral-orange floating button (`Get Started ↑`), active during scroll.

#### Technical Characteristics
- **Page Length:** Moderate (~3 to 3.5 viewports). Perfect balance between depth and velocity.
- **Navigation Mapping:**
  - `Home` $\rightarrow$ Hero top (`#home`).
  - `Screening` $\rightarrow$ Section 2 (`#screening`).
  - `How it works` $\rightarrow$ Section 3 (`#how-it-works`).
- **Animation Strategy:** Smooth CSS entrance reveals, subtle SVG scanline animations on the TB and DR illustrations, and clean hover elevations. Fully compliant with `prefers-reduced-motion`.

#### Advantages & Disadvantages
- **Advantages:**
  - Direct bridge between Landing Page (Flow 1) and Screening Flow (Flow 2).
  - Maximizes visual interest with the custom TB and DR illustrations while keeping total page height under control.
  - Combines privacy, ethics, and future scope into a single unified card, avoiding empty vertical sprawl.
  - Directly fulfills all requirements from both Reference images.
- **Disadvantages:**
  - Requires balanced 2-column styling in Section 4 to maintain clean typography on smaller tablet screens.

---

## 4. Comprehensive Evaluation Matrix

| Architectural Criterion | Proposal A (Minimal) | Proposal B (Visual & Deep) | Proposal C (Product Showcase) ★ |
|---|---|---|---|
| **Visual Harmony with Hero** | Good (Simple) | Excellent (High-End) | **Outstanding (Balanced)** |
| **Alignment with Reference B** | High (Matches left column) | Moderate (Extends concepts) | **Highest (Direct bridge to Flow 2)** |
| **Page Length & Scroll Depth** | ~2.5 viewports | ~4.5 viewports | **~3.2 viewports (Ideal)** |
| **Workflow Card Prominence** | Medium (Small icons) | Very High (Large cards) | **Very High (Actionable cards)** |
| **Explanation of 2 Modalities** | Summary only | Deep technical breakdown | **Clear, balanced clinical bullets** |
| **Privacy & Disclaimer Depth** | Minimal banner | Full 2x2 dedicated grid | **Compact high-density trust block** |
| **Future Scope Clarity** | Inactive icon row | 4 detailed roadmap cards | **Structured roadmap badge list** |
| **User Journey to Flow 2** | Fast | Slower (More reading) | **Fast & Contextual (Dual entrypoints)** |
| **Mobile Responsiveness** | Trivial | Requires extensive collapse | **Clean single-column collapse** |

---

## 5. Architectural Recommendation

### Recommendation: Proposal C (Product Showcase)
**Proposal C** is strongly recommended as the definitive landing page design for MediScan AI.

**Key Justifications:**
1. **Seamless Flow 1 $\rightarrow$ Flow 2 Bridge:** Unlike Proposal A (which relies solely on the hero CTA) or Proposal B (which delays the workflow transition behind extensive text), Proposal C empowers the user to either click the global "Get Started" button OR click directly on "Explore TB Screening" or "Explore DR Screening", immediately transporting them into the desired workflow in Flow 2.
2. **Preserves Visual Quality without Bloat:** It incorporates the custom SVG illustrations of the chest radiograph and retinal fundus (with their animated scanlines and localized detection boxes) directly inside Section 2, delivering instant visual gratification below the hero fold.
3. **Consolidated Trust & Safeguards:** By merging Ethics, Privacy, Disclaimers, and Roadmap into a unified 2-column card (Section 4), it rigorously satisfies medical software compliance disclosures without creating an uncomfortably long scrolling experience.
4. **Complete Respect of Two-Flow Invariants:** It respects the strict rule that "Get Started" is exclusive to Flow 1, uses the floating CTA conditionally, and leaves the page-based screening application (Flow 2) completely unencumbered by landing-page artifacts.

---

## 6. Open Decisions for User Alignment

Before initiating implementation of the approved proposal, the following 4 tactical decisions require user confirmation:

1. **Floating CTA Placement & Visibility Threshold:**
   - *Option 1 (Recommended):* The floating coral CTA (`Get Started ↑`) remains completely hidden while the Hero section is on screen, smoothly fading in at bottom-right only after the user scrolls 500px down.
   - *Option 2:* Omit the floating CTA entirely and rely on the sticky header and hero CTA to keep the viewport clean.
2. **Screening Card Button Action:**
   - *Option 1 (Recommended):* Clicking "Explore TB Screening" or "Explore DR Screening" in Section 2 directly navigates the user into Flow 2 with that specific workflow already active (`2.2` or `2.3`).
   - *Option 2:* Clicking either button opens the general Screening Selection screen (`2.1`) where the user makes the final choice.
3. **Future Modalities Representation:**
   - *Option 1 (Recommended):* Display future modalities as clean, compact conceptual tags with "Roadmap Concept" badges (Brain Scan, Skin Lesion, Orthopedic Radiography) within the Trust & Roadmap card.
   - *Option 2:* Display a dedicated icon grid matching the exact 6 icons in Reference B left column.
4. **Interactive Scanline Animations:**
   - *Option 1 (Recommended):* Keep subtle, continuous CSS vertical sweep scanlines on the SVG X-ray and Retinal illustrations, with automatic suppression under `prefers-reduced-motion`.
   - *Option 2:* Use static illustrations with no animation to maintain a 100% still display.

---

*End of Specification — Awaiting User Approval of Preferred Proposal (A, B, or C).*
