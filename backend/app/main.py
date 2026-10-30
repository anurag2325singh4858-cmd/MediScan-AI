from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Backend service for MediScan AI simulation screening platform",
)

# Explicit CORS configuration based on environment configuration
# Wildcard '*' is disallowed by default
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/health", tags=["Health"])
def health_check():
    """
    Health check endpoint returning service status.
    Indicates that the backend is active and operational.
    """
    return {
        "status": "ok",
        "service": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
    }
