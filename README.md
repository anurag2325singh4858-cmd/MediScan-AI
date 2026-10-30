# MediScan AI

MediScan AI is a full-stack demonstration platform for medical image screening workflows, featuring:
1. **Tuberculosis (TB) Screening** using chest X-ray images.
2. **Diabetic Retinopathy (DR) Screening** using retinal fundus photographs.

> **Note**: Current version is **Module 1 (Project Foundation)**. Diagnostic processing is designed around a backend simulation engine (no real diagnostic AI models or heavy weights are included).

---

## Prerequisites

- **Python**: Version 3.9 or higher (Python 3.9, 3.10, or 3.11 recommended)
- **Node.js**: Version 18.0 or higher (LTS recommended)
- **npm**: Version 9.0 or higher
- **Git**

---

## Project Structure

```
mediscan-ai/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py         # Application configuration & CORS settings
│   │   └── main.py           # FastAPI entrypoint with GET /health
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_health.py    # Health endpoint automated tests
│   ├── .env.example          # Sample backend environment variables
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # Foundation startup component
│   │   ├── App.css           # Foundation component styling
│   │   ├── main.tsx          # React application entrypoint
│   │   └── vite-env.d.ts     # TypeScript environment definitions
│   ├── index.html            # HTML entry point
│   ├── package.json          # Frontend dependencies & npm scripts
│   ├── tsconfig.json         # TypeScript configuration
│   ├── tsconfig.node.json    # Vite TypeScript configuration
│   ├── vite.config.ts        # Vite configuration
│   └── .env.example          # Sample frontend environment variables
├── docs/
│   └── architecture.md       # Architecture & workflow documentation
├── .gitignore                # Root gitignore rules
└── README.md                 # Project documentation
```

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/mediscan-ai.git
cd mediscan-ai
```

### 2. Backend Setup

```bash
cd backend

# Create a Python virtual environment
python3 -m venv .venv

# Activate the virtual environment
# On macOS / Linux:
source .venv/bin/activate
# On Windows (cmd):
# .venv\Scripts\activate.bat
# On Windows (PowerShell):
# .venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# (Optional) Copy example environment configuration
cp .env.example .env
```

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend

# Install Node dependencies
npm install

# (Optional) Copy example environment configuration
cp .env.example .env
```

---

## Running the Services Locally

### Start the Backend Service

From the `backend` directory (with virtual environment activated):

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend API will be available at:
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)
- **Interactive API Docs (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)

### Start the Frontend Application

From the `frontend` directory:

```bash
npm run dev
```

The frontend development server will launch at:
- **Application URL**: [http://localhost:5173](http://localhost:5173)

---

## Verification & Testing

### Run Backend Automated Tests

From the `backend` directory (with virtual environment activated):

```bash
pytest
```

To run with verbose output:

```bash
pytest -v
```

### Run Frontend Production Build Check

From the `frontend` directory:

```bash
npm run build
```

This compiles TypeScript and builds production assets into `frontend/dist`.

---

## Configuration & Environment Variables

### Backend (`backend/.env`)

| Variable | Default Value | Description |
|---|---|---|
| `HOST` | `0.0.0.0` | Host IP interface to bind |
| `PORT` | `8000` | Port to bind (Render dynamically assigns this via `$PORT`) |
| `ENVIRONMENT` | `development` | Deployment environment name |
| `ALLOWED_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Comma-delimited list of allowed CORS origins |

### Frontend (`frontend/.env`)

| Variable | Default Value | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | Base URL of the MediScan AI backend service |

---

## Render Deployment Guide

Both services are configured for seamless deployment to [Render](https://render.com):

### 1. Backend Web Service

- **Repository**: Connected GitHub repository
- **Root Directory**: `backend`
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  - `ALLOWED_ORIGINS`: Set to your deployed frontend domain (e.g. `https://mediscan-frontend.onrender.com`).
  - `ENVIRONMENT`: `production`

*Note: Render automatically injects the `$PORT` environment variable, which Uvicorn binds to.*

### 2. Frontend Static Site

- **Repository**: Connected GitHub repository
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: Set to your deployed backend domain (e.g. `https://mediscan-backend.onrender.com`).

---

## Module Roadmap

- [x] **Module 1**: Project Foundation & Environment Setup
- [ ] **Module 2**: Technical Image Validation & Upload Pipeline
- [ ] **Module 3**: Screening Simulation Engine (TB & DR scenarios)
- [ ] **Module 4**: Interactive Annotation Interface
- [ ] **Module 5**: On-Demand Clinical PDF Report Export
