from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class ImageValidationResponse(BaseModel):
    """
    Standard successful validation response.
    Contains essential technical metadata without leaking sensitive internal details.
    """
    status: Literal["valid"] = Field(
        default="valid",
        description="Validation status confirmation",
    )
    workflow: Literal["tb", "dr"] = Field(
        description="Screening workflow identifier (tb or dr)",
    )
    format: Literal["jpeg", "png", "webp"] = Field(
        description="Verified image encoding format",
    )
    width: int = Field(
        gt=0,
        description="Image width in pixels",
    )
    height: int = Field(
        gt=0,
        description="Image height in pixels",
    )
    file_size_bytes: int = Field(
        gt=0,
        description="Total verified image file size in bytes",
    )
    color_mode: str = Field(
        description="Detected color mode (e.g. RGB, RGBA, grayscale)",
    )
    pixel_decoding_status: Literal["success"] = Field(
        default="success",
        description="Status confirmation of safe raster pixel decoding",
    )
    suitability_verified: bool = Field(
        default=False,
        description="False: Heuristic suitability checks passed, but anatomical modality cannot be verified without a classifier.",
    )
    suitability_note: Optional[str] = Field(
        default="Basic technical and dimensional checks passed. Heuristics do not verify anatomical or medical modality suitability.",
        description="Honest disclosure of suitability heuristic limitations.",
    )


class FindingCoordinates(BaseModel):
    """
    Normalized visual coordinates [0.0, 1.0] relative to image dimensions.
    Resolution-independent and strictly bounded.
    """
    x_min: float = Field(ge=0.0, le=1.0, description="Normalized left bound (0.0 to 1.0)")
    y_min: float = Field(ge=0.0, le=1.0, description="Normalized top bound (0.0 to 1.0)")
    x_max: float = Field(ge=0.0, le=1.0, description="Normalized right bound (0.0 to 1.0)")
    y_max: float = Field(ge=0.0, le=1.0, description="Normalized bottom bound (0.0 to 1.0)")


class FindingItem(BaseModel):
    """
    Individual illustrative finding or demonstration marker.
    Contains no medical confidence scores, probabilities, or severity ratings.
    """
    id: str = Field(description="Unique, stable finding/marker identifier")
    title: str = Field(description="Short illustrative title of the demonstration marker")
    description: str = Field(description="Brief educational explanation of marker")
    coordinates: Optional[FindingCoordinates] = Field(
        default=None,
        description="Optional normalized visual overlay coordinates [0.0, 1.0]",
    )
    is_educational_reference: bool = Field(
        default=True,
        description="Flag confirming this finding is an educational anatomical reference, not a disease detection",
    )
    category: Literal["reference", "inspection", "highlighted"] = Field(
        default="reference",
        description="Educational visualization marker category: reference (green), inspection (blue), highlighted (red)",
    )


SIMULATION_DISCLAIMER: str = (
    "DEMONSTRATION ONLY: These findings are synthetic illustrative simulations "
    "generated for interface demonstration purposes. They do NOT constitute clinical diagnosis, "
    "medical opinion, or an actual assessment of the uploaded medical image."
)


class ScreeningResultResponse(BaseModel):
    """
    Unified result response contract for screening workflows.
    Explicitly identifies simulated demonstration status and disclaims diagnostic validity.
    """
    result_id: str = Field(
        description="Unique identifier for this screening result instance",
    )
    workflow: Literal["tb", "dr"] = Field(
        description="Target screening workflow identifier",
    )
    status: Literal["completed"] = Field(
        default="completed",
        description="Processing completion status",
    )
    provider_type: Literal["simulation", "model"] = Field(
        default="simulation",
        description="Category of the results engine (simulation vs genuine model)",
    )
    is_simulated: bool = Field(
        default=True,
        description="Explicit flag confirming that findings are synthetic demonstration data",
    )
    disclaimer: str = Field(
        default=SIMULATION_DISCLAIMER,
        description="Mandatory medical disclaimer stating results are not clinical diagnosis",
    )
    technical_summary: Optional[ImageValidationResponse] = Field(
        default=None,
        description="Verified technical image inspection metadata from Module 9",
    )
    scenario_id: Optional[str] = Field(
        default=None,
        description="Identifier of the educational visualization scenario (e.g. scenario_1 through scenario_6)",
    )
    scenario_name: Optional[str] = Field(
        default=None,
        description="Descriptive title of the educational visualization scenario",
    )
    findings: List[FindingItem] = Field(
        default_factory=list,
        description="Structured list of illustrative demonstration findings",
    )
    generated_at: str = Field(
        description="ISO 8601 UTC timestamp of result generation",
    )


class ErrorDetail(BaseModel):
    """
    Machine-readable error code and human-readable message.
    """
    code: str = Field(description="Standardized error code")
    message: str = Field(description="Safe, descriptive error message")


class ErrorResponse(BaseModel):
    """
    Standardized error payload wrapper.
    """
    detail: ErrorDetail


class ValidationException(Exception):
    """
    Application exception for client validation failures.
    Yields standardized HTTP status codes and predictable error responses.
    """
    def __init__(self, status_code: int, code: str, message: str):
        self.status_code = status_code
        self.code = code
        self.message = message
        super().__init__(message)
