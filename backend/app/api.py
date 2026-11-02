import logging
import time
from typing import Optional
from fastapi import APIRouter, File, Form, Request, UploadFile, status
from app.schemas import ImageValidationResponse, ScreeningResultResponse, ErrorResponse
from app.validator import validate_medical_image
from app.providers import get_results_provider

logger = logging.getLogger("mediscan.api")
router = APIRouter(tags=["Screening & Validation"])


@router.post(
    "/api/v1/validate",
    response_model=ImageValidationResponse,
    status_code=status.HTTP_200_OK,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid workflow, empty file, corrupted image, or bad parameters"},
        413: {"model": ErrorResponse, "description": "File exceeds maximum upload size of 10 MB or pixel limit"},
        415: {"model": ErrorResponse, "description": "Unsupported image format"},
        422: {"model": ErrorResponse, "description": "Missing required form fields"},
    },
    summary="Validate medical image for screening workflow",
    description="Validates image encoding, dimensions, format, and size for TB or DR screening without saving to disk or executing clinical inference.",
)
async def validate_image_v1(
    request: Request,
    workflow: Optional[str] = Form(None, description="Target screening workflow ('tb' or 'dr')"),
    file: Optional[UploadFile] = File(None, description="Uploaded image file (JPEG, PNG, or WebP up to 10 MB)"),
) -> ImageValidationResponse:
    """
    Validates uploaded image file against specified workflow criteria.
    Accepts multipart/form-data with 'workflow' and 'file' parameters.
    """
    return await validate_medical_image(workflow=workflow, file=file, request=request)


# Provide alias route at /api/validate for flexible API consumers
@router.post(
    "/api/validate",
    response_model=ImageValidationResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
async def validate_image_alias(
    request: Request,
    workflow: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
) -> ImageValidationResponse:
    return await validate_medical_image(workflow=workflow, file=file, request=request)


@router.post(
    "/api/v1/analyze",
    response_model=ScreeningResultResponse,
    status_code=status.HTTP_200_OK,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid workflow, empty file, corrupted image, or bad parameters"},
        413: {"model": ErrorResponse, "description": "File exceeds maximum upload size of 10 MB or pixel limit"},
        415: {"model": ErrorResponse, "description": "Unsupported image format"},
        422: {"model": ErrorResponse, "description": "Missing required form fields"},
    },
    summary="Generate screening result for medical image",
    description="Performs technical validation and returns typed, simulated demonstration screening results.",
)
async def analyze_image_v1(
    request: Request,
    workflow: Optional[str] = Form(None, description="Target screening workflow ('tb' or 'dr')"),
    file: Optional[UploadFile] = File(None, description="Uploaded image file (JPEG, PNG, or WebP up to 10 MB)"),
    scenario: Optional[int] = Form(None, description="Optional educational visualization scenario index (1-6)"),
) -> ScreeningResultResponse:
    """
    Performs full pipeline: safe image decoding and technical inspection (Module 8 & 9),
    followed by dispatch to the appropriate workflow results provider (Module 10).
    """
    t_start = time.perf_counter()
    # 1. Technical validation & full raster pixel integrity check
    tech_metadata = await validate_medical_image(workflow=workflow, file=file, request=request)
    t_val = time.perf_counter()

    # 2. Select appropriate workflow results provider
    provider = get_results_provider(tech_metadata.workflow)

    # 3. Generate structured results
    result = await provider.generate_result(
        workflow=tech_metadata.workflow,
        technical_metadata=tech_metadata,
        scenario=scenario,
    )
    t_end = time.perf_counter()
    logger.info(
        f"[TIMING] Workflow={tech_metadata.workflow} | "
        f"Validation={((t_val - t_start) * 1000):.2f}ms | "
        f"ResultGeneration={((t_end - t_val) * 1000):.2f}ms | "
        f"TotalServerTime={((t_end - t_start) * 1000):.2f}ms"
    )
    return result


# Provide alias route at /api/analyze
@router.post(
    "/api/analyze",
    response_model=ScreeningResultResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
async def analyze_image_alias(
    request: Request,
    workflow: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    scenario: Optional[int] = Form(None),
) -> ScreeningResultResponse:
    return await analyze_image_v1(request=request, workflow=workflow, file=file, scenario=scenario)


@router.post(
    "/api/v1/results/simulate",
    response_model=ScreeningResultResponse,
    status_code=status.HTTP_200_OK,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid or unsupported workflow"},
        422: {"model": ErrorResponse, "description": "Missing workflow parameter"},
    },
    summary="Simulate screening result without image upload",
    description="Direct endpoint returning synthetic demonstration findings for UI visualization without file transmission.",
)
async def simulate_result_v1(
    workflow: Optional[str] = Form(None, description="Target screening workflow ('tb' or 'dr')"),
    scenario: Optional[int] = Form(None, description="Optional educational visualization scenario index (1-6)"),
) -> ScreeningResultResponse:
    """
    Simulates screening demonstration findings directly for the requested workflow.
    """
    provider = get_results_provider(workflow)
    norm_workflow = workflow.strip().lower() if workflow else ""
    return await provider.generate_result(
        workflow=norm_workflow,
        technical_metadata=None,
        scenario=scenario,
    )
