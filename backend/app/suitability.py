"""
Workflow-Specific Image Suitability Stage for MediScan AI.

This module provides rule-based heuristic checks for screening workflows ('tb' and 'dr').
It operates AFTER generic technical image validation (format, size, raster decoding)
and BEFORE simulation or clinical result generation.

CRITICAL DISCLOSURE & LIMITATIONS:
1. What these checks CAN establish:
   - The image meets minimum spatial resolution thresholds necessary for visual examination.
   - The image has an aspect ratio compatible with standard radiograph or fundus photography framing.
   - Standard decoding and raster integrity are intact.

2. What these checks CANNOT establish:
   - These heuristic rules CANNOT reliably verify anatomical identity or image modality.
   - An image passing these rules is NOT guaranteed to be a human chest radiograph or retinal fundus.
   - Modality verification and diagnostic assessment require a trained, clinically validated model.
   - Heuristic suitability is never reported as confirmed clinical modality verification.
"""

from typing import Optional
from app.config import settings
from app.schemas import ValidationException


def check_image_suitability(
    workflow: str,
    width: int,
    height: int,
    color_mode: Optional[str] = None,
) -> None:
    """
    Evaluates workflow-specific image suitability constraints.

    Parameters:
    - workflow: 'tb' or 'dr'
    - width: Image width in pixels
    - height: Image height in pixels
    - color_mode: Detected color descriptor (e.g. 'RGB', 'grayscale')

    Raises:
    - ValidationException if the image fails dimensional or geometric suitability thresholds.
    """
    norm_workflow = workflow.strip().lower() if workflow else ""

    if norm_workflow == "tb":
        _check_tb_suitability(width, height, color_mode)
    elif norm_workflow == "dr":
        _check_dr_suitability(width, height, color_mode)
    else:
        raise ValidationException(
            status_code=400,
            code="INVALID_WORKFLOW",
            message=f"Unsupported workflow '{workflow}'. Supported workflows: tb, dr.",
        )


def _check_tb_suitability(width: int, height: int, color_mode: Optional[str] = None) -> None:
    """
    Evaluates suitability for Tuberculosis (Chest X-ray) screening demonstration.
    """
    # 1. Minimum Resolution Check
    if width < settings.tb_min_width or height < settings.tb_min_height:
        raise ValidationException(
            status_code=400,
            code="IMAGE_DIMENSIONS_TOO_SMALL",
            message=(
                f"Image dimensions ({width}×{height} px) are below the minimum required "
                f"({settings.tb_min_width}×{settings.tb_min_height} px) for chest X-ray screening demonstration."
            ),
        )

    # 2. Aspect Ratio Check (Chest radiographs are generally near-square or mildly portrait/landscape)
    aspect_ratio = width / height
    if aspect_ratio < settings.tb_min_aspect_ratio or aspect_ratio > settings.tb_max_aspect_ratio:
        raise ValidationException(
            status_code=400,
            code="UNSUITABLE_ASPECT_RATIO",
            message=(
                f"Image aspect ratio ({aspect_ratio:.2f}) is unsuitable for chest X-ray screening. "
                f"Expected aspect ratio between {settings.tb_min_aspect_ratio:.2f} and {settings.tb_max_aspect_ratio:.2f}."
            ),
        )


def _check_dr_suitability(width: int, height: int, color_mode: Optional[str] = None) -> None:
    """
    Evaluates suitability for Diabetic Retinopathy (Retinal Fundus) screening demonstration.
    """
    # 1. Minimum Resolution Check
    if width < settings.dr_min_width or height < settings.dr_min_height:
        raise ValidationException(
            status_code=400,
            code="IMAGE_DIMENSIONS_TOO_SMALL",
            message=(
                f"Image dimensions ({width}×{height} px) are below the minimum required "
                f"({settings.dr_min_width}×{settings.dr_min_height} px) for retinal fundus screening demonstration."
            ),
        )

    # 2. Aspect Ratio Check (Fundus photos are typically near-circular/square)
    aspect_ratio = width / height
    if aspect_ratio < settings.dr_min_aspect_ratio or aspect_ratio > settings.dr_max_aspect_ratio:
        raise ValidationException(
            status_code=400,
            code="UNSUITABLE_ASPECT_RATIO",
            message=(
                f"Image aspect ratio ({aspect_ratio:.2f}) is unsuitable for retinal fundus photography. "
                f"Expected aspect ratio between {settings.dr_min_aspect_ratio:.2f} and {settings.dr_max_aspect_ratio:.2f}."
            ),
        )
