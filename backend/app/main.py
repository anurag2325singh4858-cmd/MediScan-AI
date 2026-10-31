from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.schemas import ValidationException
from app.api import router as api_router

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


@app.exception_handler(ValidationException)
async def validation_exception_handler(request: Request, exc: ValidationException):
    """
    Standardized handler for application validation exceptions.
    Ensures safe, predictable JSON error contracts without stack traces or path disclosures.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": {"code": exc.code, "message": exc.message}},
    )


@app.exception_handler(RequestValidationError)
async def request_validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Standardized handler for FastAPI / Pydantic request validation errors.
    Returns safe error details for missing or malformed multipart form fields.
    """
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": {
                "code": "MISSING_OR_INVALID_FIELD",
                "message": "Required request parameter or multipart field is missing or invalid.",
            }
        },
    )


# Mount image validation routes
app.include_router(api_router)


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
