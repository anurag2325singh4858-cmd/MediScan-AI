# MediScan AI — Architecture Documentation

## 1. System Overview

**MediScan AI** is a full-stack medical demonstration platform designed to showcase two screening workflows:
1. **Tuberculosis (TB) Screening**: Analysis of posterior-anterior chest X-ray (CXR) images.
2. **Diabetic Retinopathy (DR) Screening**: Analysis of retinal fundus photographs.

The application serves as a reference architecture and clinical demonstration tool. In accordance with project requirements, the diagnostic inference is powered by a **backend simulation engine** rather than genuine diagnostic machine learning models, ensuring reliable, reproducible demonstration scenarios without requiring massive model weights or clinical device certification.

---

## 2. Monorepo Organization & Component Boundaries

The project is structured as a modular monorepo cleanly divided into `frontend/` and `backend/`:

```
mediscan-ai/
├── backend/                  # FastAPI application & simulation services
│   ├── app/                  # Application source code
│   │   ├── config.py         # Centralized configuration (pydantic-settings)
│   │   └── main.py           # Application entrypoint & CORS middleware
│   ├── tests/                # Automated pytest suite
│   ├── .env.example          # Backend environment template
│   └── requirements.txt      # Python dependencies
├── frontend/                 # React + Vite + TypeScript application
│   ├── src/                  # React components & startup page
│   ├── index.html            # Single-page application entry HTML
│   ├── package.json          # Node dependencies & build scripts
│   ├── tsconfig.json         # TypeScript strict configuration
│   ├── vite.config.ts        # Vite build tool configuration
│   └── .env.example          # Frontend environment template
├── docs/                     # Architectural & design specifications
│   └── architecture.md       # This document
├── .gitignore                # Comprehensive ignore rules
└── README.md                 # Setup, testing, and deployment instructions
```

### Decoupling Principles
- **Strict Separation of Concerns**: Frontend components are strictly presentational. No diagnostic rules, simulation math, or parsing logic resides in the client layer.
- **RESTful API Contract**: The backend exposes stateless, versioned endpoints (`/health`, and future `/api/v1/...`). All communication happens via JSON payloads over HTTP.
- **Environment Isolation**: The frontend interacts with the backend strictly through configured URLs (`VITE_API_URL`), avoiding hardcoded localhost references to support cloud deployment.
- **CORS Protection**: Origin-based cross-origin resource sharing is strictly governed by environment variables (`ALLOWED_ORIGINS`).

---

## 3. Future Analysis Interface & Workflow Lifecycle

Future modules will introduce an end-to-end interactive workflow for both TB and DR screening:

```
[User / Browser]
       │
       ▼ (1) Upload Image (CXR / Fundus)
[Frontend Client]
       │
       ▼ (2) POST /api/v1/analyze (multipart/form-data)
[FastAPI Backend]
       ├──> Technical Image Validation (Format, dimensions, integrity)
       ├──> Simulation Engine (Scenario mapping: Normal / Mild / Moderate / Severe)
       └──> Response Formulation (JSON payload)
       │
       ▼ (3) JSON Response (Findings, confidence score, annotation coordinates)
[Frontend Client]
       ├──> Interactive Image Viewer (Overlay bounding boxes, heatmaps, lesion markers)
       └──> Clinical Summary Card (Findings & recommendation presentation)
       │
       ▼ (4) User clicks "Generate Report"
[Backend / Frontend Report Generator]
       └──> On-demand PDF Summary Report (Clinical snapshot, findings, metadata)
```

### Key Components of Future Analysis:
1. **Technical Image Validation**:
   - Verification of file type (JPEG, PNG, DICOM simulation), minimum dimension requirements, and file integrity before dispatching to the simulation engine.
2. **Backend Simulation Engine**:
   - Deterministic or scenario-driven simulation that yields clinical findings, confidence scores, abnormal region coordinates, and recommendations.
3. **Interactive Annotation Canvas**:
   - The frontend will render interactive overlays on the displayed image (e.g. bounding boxes around infiltrates in TB or microaneurysms/hemorrhages in DR) derived from backend coordinate data.
4. **On-Demand PDF Reports**:
   - Server-side or client-side generation of standardized screening summary reports containing patient context placeholders, findings, confidence metrics, and annotated image snapshots.

---

## 4. Deployment Architecture (Render)

Both services are tailored for independent or coupled hosting on **Render**:

- **Backend Service (Render Web Service)**:
  - Runtime: Python 3.9+ / 3.11
  - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
  - Dynamic port binding: The backend reads the `$PORT` environment variable assigned by Render.
  - Environment variables: `PORT`, `ALLOWED_ORIGINS` (pointing to the frontend production domain).

- **Frontend Service (Render Static Site or Web Service)**:
  - Build command: `npm run build`
  - Publish directory: `frontend/dist`
  - Environment variables: `VITE_API_URL` (pointing to the Render backend service URL).
