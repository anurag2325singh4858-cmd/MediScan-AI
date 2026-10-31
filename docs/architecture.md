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

## 3. Implemented API Endpoints (Module 8 Foundation)

### 3.1 Health Check
- **Route**: `GET /health`
- **Response**:
  ```json
  {
    "status": "ok",
    "service": "MediScan AI",
    "version": "0.1.0",
    "environment": "development"
  }
  ```

### 3.2 Server-Side Medical Image Validation & Technical Inspection (Module 9 & Suitability Stage)
- **Primary Route**: `POST /api/v1/validate`
- **Alias Route**: `POST /api/validate`
- **Content-Type**: `multipart/form-data`
- **Request Parameters**:
  - `workflow` (string, required): Explicit workflow identifier — strictly `"tb"` (Tuberculosis Chest X-ray) or `"dr"` (Diabetic Retinopathy Retinal Fundus).
  - `file` (binary, required): Image file payload.
- **Constraints & Enforcements**:
  - **Upload Limit**: 10 MB (`10,485,760` bytes) maximum. Stream-safe chunked reading prevents unbounded memory consumption regardless of missing or spoofed `Content-Length` headers.
  - **Supported Encodings**: `JPEG`, `PNG`, and `WebP` verified by Pillow stream inspection (content-based decoding, not trusting file extensions or client-declared MIME types).
  - **Non-Empty Requirement**: Rejects 0-byte uploads (`EMPTY_FILE`).
  - **Decoded Pixel Resource Protection**: Limits maximum uncompressed raster dimensions to 25,000,000 pixels (`max_decoded_pixels = 25_000_000`), shielding server workers against memory exhaustion from decompression bombs. Checked in $O(1)$ time from parsed dimensions before allocating raster buffers.
  - **Decompression Bomb Guard**: Traps Pillow's `Image.DecompressionBombWarning` and `Image.DecompressionBombError`, rejecting risky payloads with `413 Payload Too Large` (`PIXEL_LIMIT_EXCEEDED`).
  - **Safe Full-Raster Pixel Decoding**: Calling `img.load()` executes complete pixel raster decoding in memory to verify that scanlines are complete and uncorrupted, preventing truncated or malformed files with valid headers from silently passing inspection.
  - **Workflow-Specific Suitability Checks**:
    - **TB Workflow**: Enforces configurable minimum dimensions (`tb_min_width`, `tb_min_height`) and geometric aspect ratio boundaries (`tb_min_aspect_ratio` to `tb_max_aspect_ratio`).
    - **DR Workflow**: Enforces configurable minimum dimensions (`dr_min_width`, `dr_min_height`) and geometric aspect ratio boundaries (`dr_min_aspect_ratio` to `dr_max_aspect_ratio`).
    - Standardized errors: `IMAGE_DIMENSIONS_TOO_SMALL`, `UNSUITABLE_ASPECT_RATIO`.
  - **Suitability Limitation & Honest Reporting**:
    - Heuristics only establish technical viability and geometric plausibility; they CANNOT establish anatomical or modality identity (e.g. verifying an image is actually a human lung or retina).
    - `suitability_verified` is explicitly set to `false`, with an honest `suitability_note` confirming that modality verification is unverified without a classification model.
  - **Color Mode Flexibility**: Supports `grayscale`, `RGB`, and `RGBA` color modes, appropriately accommodating both grayscale/color chest radiographs and retinal fundus photographs without false rejections.
  - **Privacy Guarantee**: Operates completely in memory with strict buffer cleanup (`bytearray.clear()`). No uploaded files, patient records, or images are written to disk, database, or persistent storage.
- **Success Response (HTTP 200 OK)**:
  ```json
  {
    "status": "valid",
    "workflow": "tb",
    "format": "png",
    "width": 512,
    "height": 512,
    "file_size_bytes": 132850,
    "color_mode": "grayscale",
    "pixel_decoding_status": "success",
    "suitability_verified": false,
    "suitability_note": "Basic technical and dimensional checks passed. Heuristics do not verify anatomical or medical modality suitability."
  }
  ```
- **Error Response Contract**:
  All error responses strictly conform to the `{ "detail": { "code": string, "message": string } }` schema:
  | Status Code | Code | Description |
  |---|---|---|
  | `400 Bad Request` | `INVALID_WORKFLOW` | Unsupported or missing workflow identifier. |
  | `400 Bad Request` | `MISSING_FILE` | File parameter omitted in multipart payload. |
  | `400 Bad Request` | `EMPTY_FILE` | Uploaded file contains 0 bytes. |
  | `400 Bad Request` | `CORRUPTED_IMAGE` | Image cannot be parsed or contains malformed data. |
  | `400 Bad Request` | `DECODING_FAILED` | Raster scanline decoding failed (truncated, incomplete, or damaged pixel data). |
  | `400 Bad Request` | `IMAGE_DIMENSIONS_TOO_SMALL` | Image resolution falls below minimum workflow thresholds. |
  | `400 Bad Request` | `UNSUITABLE_ASPECT_RATIO` | Image aspect ratio violates workflow framing criteria. |
  | `413 Payload Too Large` | `FILE_TOO_LARGE` | Compressed file exceeds the 10 MB maximum upload limit. |
  | `413 Payload Too Large` | `PIXEL_LIMIT_EXCEEDED` | Decoded raster exceeds 25 MP or triggers decompression bomb protection. |
  | `415 Unsupported Media` | `UNSUPPORTED_FORMAT` | Format is not JPEG, PNG, or WebP (e.g. BMP, TIFF, PDF). |
  | `422 Unprocessable` | `MISSING_OR_INVALID_FIELD` | Malformed multipart structure or missing parameters. |

### 3.3 Results Provider Architecture & Simulated Screening Results (Module 10)
- **Primary Routes**:
  - `POST /api/v1/analyze` (Primary multipart pipeline: validation + results provider)
  - `POST /api/analyze` (Alias route)
  - `POST /api/v1/results/simulate` (Direct simulation route without file payload)
- **Design Philosophy**:
  MediScan AI implements a pluggable provider pattern separating technical validation from results generation. This architecture establishes a strict boundary between:
  1. **File Validation & Safe Pixel Decoding**: Performed in memory via Module 8 & 9 guards (`validate_medical_image`).
  2. **Technical Metadata Summary**: Verified dimensions, color modes, and byte lengths.
  3. **Results Provider Interface (`BaseResultsProvider`)**: Pluggable protocol returning structured findings.
  4. **Simulation Labeling**: Machine-readable `is_simulated: true`, `provider_type: "simulation"`, and prominent human-readable disclaimers.
  5. **Future Model Adapter**: Extension point (`register_results_provider`) allowing genuine ML model adapters to be plugged in without modifying API contracts or presentation schemas.
- **Shared Result Schema (`ScreeningResultResponse`)**:
  ```json
  {
    "result_id": "tb_sim_938d710a8fb4",
    "workflow": "tb",
    "status": "completed",
    "provider_type": "simulation",
    "is_simulated": true,
    "disclaimer": "DEMONSTRATION ONLY: These findings are synthetic illustrative simulations generated for interface demonstration purposes. They do NOT constitute clinical diagnosis, medical opinion, or an actual assessment of the uploaded medical image.",
    "technical_summary": {
      "status": "valid",
      "workflow": "tb",
      "format": "png",
      "width": 110,
      "height": 78,
      "file_size_bytes": 13285,
      "color_mode": "RGB",
      "pixel_decoding_status": "success"
    },
    "findings": [
      {
        "id": "TB-SIM-001",
        "title": "Simulated Apical Zone Reference",
        "description": "Illustrative demonstration marker positioned in the right upper thoracic field. This synthetic marker is provided solely for interface demonstration and does not represent genuine pulmonary abnormality detection or active tuberculosis screening.",
        "coordinates": {
          "x_min": 0.58,
          "y_min": 0.18,
          "x_max": 0.74,
          "y_max": 0.34
        }
      }
    ],
    "generated_at": "2026-10-30T21:42:09.376337+00:00"
  }
  ```
- **Strict Clinical Boundaries**:
  - **No Fabricated Confidence Scores**: The schema explicitly omits confidence scores, probabilities, and severity ratings to eliminate any misleading clinical appearance.
  - **Normalized Bounding Coordinates**: Coordinates are strictly normalized `[0.0, 1.0]` relative to image dimensions (`x_min`, `y_min`, `x_max`, `y_max`), ensuring resolution independence without fabricating clinical heatmaps.
  - **Separation of Workflows**: `tb` (chest radiograph apical and costophrenic references) and `dr` (retinal fundus optic disc and macular references) are encapsulated in dedicated providers (`TBSimulationProvider` and `DRSimulationProvider`).
- **Future Model Adapter Boundary**:
  A genuine inference model implements `BaseResultsProvider` and sets `is_simulated = False` and `provider_type = "model"`. It receives verified `technical_metadata` and the image stream. Crucially, implementing this interface does **not** imply clinical certification or medical device validation.
- **Privacy Guarantee**:
  - Processing remains strictly transient and in-memory.
  - Zero database records, user accounts, report storage, or persistent image files.

### 3.4 Frontend Shared Results Architecture & Workflow Registry (Module 11A)
The frontend establishes a reusable, typed results architecture (`frontend/src/components/results/` and `frontend/src/services/`):
- **Typed Result Contract (`frontend/src/types/results.ts`)**:
  - Matches the backend's `ScreeningResultResponse` 1:1.
  - Fields: `result_id`, `workflow`, `status`, `provider_type`, `is_simulated`, `disclaimer`, `technical_summary`, `findings`, and `generated_at`.
  - Coordinate system: `FindingCoordinates` strictly normalized $[0.0, 1.0]$ (`x_min`, `y_min`, `x_max`, `y_max`), resolution-independent.
  - Strictly **no** fabricated confidence scores, disease probabilities, risk percentages, or clinical severity indicators.
- **Workflow Registry (`frontend/src/services/workflowRegistry.ts`)**:
  - Configuration-driven architecture separating workflow metadata from rendering logic.
  - Built-in registrations: `tb` (Tuberculosis / Chest X-ray) and `dr` (Diabetic Retinopathy / Fundus Image).
  - Extension point: `registerWorkflow(definition: WorkflowDefinition)` enables future workflows to plug in their theme, icons, labels, and annotation configurations without altering shared components.
- **Shared Components**:
  - `ResultsLayout`: Standard internal results page shell with logo-only `LandingHeader` (no marketing nav or Get Started CTA), theme-responsive styling, hero capsule, disclaimer row, and responsive grid.
  - `OriginalImageViewer`: Renders the uploaded medical image in deep dark-room contrast background, establishes `data-coordinate-space="normalized"` container, handles load/error states, and exposes `children` slot for Module 11D annotation layers without altering the image source.
  - `FindingsPanel`: Renders structured findings (`FindingItem[]`) with stable IDs, title, educational description, and empty state fallback. Exposes `onSelectFinding` callback hook for interactive marker cross-selection.
  - `SimulationDisclaimer`: Prominently renders the backend simulation disclaimer with `SIMULATED DEMONSTRATION` badge and safety fallback warning for unverified states.
  - `TechnicalSummaryCard`: Collapsible card displaying verified technical image inspection metadata (resolution, format, color mode, byte size, raster integrity).
- **Typed API Client (`frontend/src/services/analysisApi.ts`)**:
  - `analyzeImage(workflow, file)`: Multipart submission to `POST /api/v1/analyze`.
  - `simulateResult(workflow)`: Direct submission to `POST /api/v1/results/simulate`.
  - `validateImage(workflow, file)`: Direct validation to `POST /api/v1/validate`.
  - Standardized `ApiError` class with HTTP status, code, and safe messages.
- **Privacy & Storage Hygiene**:
  - Zero `localStorage`, `sessionStorage`, `IndexedDB`, or cookies.
  - Ephemeral in-memory data lifetimes.

---

## 4. End-to-End Workflow Lifecycle

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
       ├──> Workflow Suitability Validation (Resolution, aspect ratio limits)
       ├──> Simulation Engine (Educational reference findings & normalized landmarks)
       └──> Response Formulation (JSON payload)
       │
       ▼ (3) JSON Response (Educational findings, simulation disclaimer, metadata)
[Frontend Client]
       ├──> Educational Reference Image Viewer (Overlay normalized landmark boxes)
       └──> Findings & Technical Summary Cards (Educational presentation)
       │
       ▼ (4) User clicks "Download Report"
[Backend / Frontend Report Generator (Module 12)]
       └──> On-demand PDF Summary Report (Clinical snapshot, findings, metadata)
```

### Key Components of Workflow Analysis:
1. **Technical Image Validation & Suitability**:
   - Verification of file type (JPEG, PNG, WebP), minimum dimension requirements, and file integrity before dispatching to the simulation engine.
2. **Backend Simulation Engine**:
   - Deterministic demonstration findings yielding educational anatomical references without fabricated clinical confidence scores or severity ratings.
3. **Interactive Annotation Canvas**:
   - The frontend renders educational reference overlays on the displayed image derived from backend coordinate data.
4. **On-Demand PDF Reports (Module 12)**:
   - Server-side or client-side generation of standardized screening summary reports containing patient context placeholders, educational findings, and technical image metadata.

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
