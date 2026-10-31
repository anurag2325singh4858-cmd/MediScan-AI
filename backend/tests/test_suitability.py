"""
Unit and integration tests for Workflow Image Suitability Stage in MediScan AI.

Verifies:
1. Dimensional minimum boundaries for TB and DR.
2. Geometric aspect ratio bounds.
3. Separation of technical validity from workflow suitability.
4. Honest limitation reporting (suitability_verified=False, suitability_note present).
5. Standardized error codes (IMAGE_DIMENSIONS_TOO_SMALL, UNSUITABLE_ASPECT_RATIO).
6. Resource safety: zero persistent disk files.
"""

import io
import os
import pytest
from fastapi.testclient import TestClient
from PIL import Image
from app.main import app
from app.config import settings

client = TestClient(app)


def create_in_memory_image(width: int = 128, height: int = 128, format: str = "PNG") -> bytes:
    """Helper creating memory buffer image with specified dimensions."""
    img = Image.new("RGB", (width, height), color=(100, 149, 237))
    buf = io.BytesIO()
    img.save(buf, format=format)
    return buf.getvalue()


# 1. Valid Technical Image Passes Suitability
def test_valid_image_passes_suitability_checks():
    """Verify standard resolution image passes both technical and suitability checks."""
    img_bytes = create_in_memory_image(width=256, height=256, format="JPEG")
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "tb"},
        files={"file": ("test.jpg", img_bytes, "image/jpeg")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "valid"
    assert data["workflow"] == "tb"
    assert data["suitability_verified"] is False
    assert "heuristic" in data["suitability_note"].lower() or "modality" in data["suitability_note"].lower()


# 2. TB Workflow Minimum Dimension Boundary Checks
def test_tb_dimension_below_minimum_rejected():
    """Verify images below configurable minimum dimensions are rejected with IMAGE_DIMENSIONS_TOO_SMALL."""
    # Settings default for TB is 32x32
    img_bytes = create_in_memory_image(width=31, height=32)
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "tb"},
        files={"file": ("tiny_width.png", img_bytes, "image/png")},
    )
    assert response.status_code == 400
    data = response.json()
    assert data["detail"]["code"] == "IMAGE_DIMENSIONS_TOO_SMALL"
    assert "below the minimum required" in data["detail"]["message"].lower()


def test_tb_dimension_exact_minimum_passes():
    """Verify boundary case: exact minimum dimensions (32x32) passes."""
    img_bytes = create_in_memory_image(width=settings.tb_min_width, height=settings.tb_min_height)
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "tb"},
        files={"file": ("boundary.png", img_bytes, "image/png")},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "valid"


# 3. DR Workflow Minimum Dimension Boundary Checks
def test_dr_dimension_below_minimum_rejected():
    """Verify DR images below dr_min_width/dr_min_height are rejected."""
    # Settings default for DR is 32x32
    img_bytes = create_in_memory_image(width=31, height=32)
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "dr"},
        files={"file": ("tiny_dr.png", img_bytes, "image/png")},
    )
    assert response.status_code == 400
    data = response.json()
    assert data["detail"]["code"] == "IMAGE_DIMENSIONS_TOO_SMALL"


def test_dr_dimension_exact_minimum_passes():
    """Verify DR boundary case: exact minimum dimensions (32x32) passes."""
    img_bytes = create_in_memory_image(width=settings.dr_min_width, height=settings.dr_min_height)
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "dr"},
        files={"file": ("boundary_dr.png", img_bytes, "image/png")},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "valid"


# 4. Aspect Ratio Suitability Constraints
def test_tb_extreme_aspect_ratio_rejected():
    """Verify ribbon or banner shaped image (e.g. 500x20, aspect ratio 25) is rejected."""
    img_bytes = create_in_memory_image(width=500, height=80)  # aspect ratio 6.25 > 4.0
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "tb"},
        files={"file": ("wide_banner.png", img_bytes, "image/png")},
    )
    assert response.status_code == 400
    data = response.json()
    assert data["detail"]["code"] == "UNSUITABLE_ASPECT_RATIO"
    assert "aspect ratio" in data["detail"]["message"].lower()


def test_tb_extreme_tall_aspect_ratio_rejected():
    """Verify vertically thin strip image (e.g. 80x500, aspect ratio 0.16) is rejected."""
    img_bytes = create_in_memory_image(width=80, height=500)  # aspect ratio 0.16 < 0.25
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "tb"},
        files={"file": ("tall_strip.png", img_bytes, "image/png")},
    )
    assert response.status_code == 400
    data = response.json()
    assert data["detail"]["code"] == "UNSUITABLE_ASPECT_RATIO"


def test_dr_extreme_aspect_ratio_rejected():
    """Verify DR rejects aspect ratios exceeding dr_max_aspect_ratio."""
    img_bytes = create_in_memory_image(width=300, height=80)  # aspect ratio 3.75 > 3.0
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "dr"},
        files={"file": ("dr_banner.png", img_bytes, "image/png")},
    )
    assert response.status_code == 400
    assert response.json()["detail"]["code"] == "UNSUITABLE_ASPECT_RATIO"


# 5. Full Analyze Pipeline Rejects Unsuitable Image
def test_analyze_pipeline_enforces_suitability():
    """Verify POST /api/v1/analyze rejects unsuitable images before invoking results provider."""
    img_bytes = create_in_memory_image(width=30, height=30)
    response = client.post(
        "/api/v1/analyze",
        data={"workflow": "tb"},
        files={"file": ("too_small.png", img_bytes, "image/png")},
    )
    assert response.status_code == 400
    assert response.json()["detail"]["code"] == "IMAGE_DIMENSIONS_TOO_SMALL"


# 6. Honest Reporting: Heuristics do not confirm medical modality
def test_honest_suitability_disclosure_in_response():
    """Verify the response explicitly acknowledges modality remains unverified without a model."""
    img_bytes = create_in_memory_image(width=128, height=128)
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "tb"},
        files={"file": ("honest.png", img_bytes, "image/png")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["suitability_verified"] is False
    assert "not verify anatomical or medical modality" in data["suitability_note"].lower()


# 7. Zero Persistent Files Created
def test_suitability_checks_leave_no_disk_files():
    """Verify rejection paths do not leak temporary files onto filesystem."""
    files_before = set(os.listdir("."))
    img_bytes = create_in_memory_image(width=20, height=20)
    client.post(
        "/api/v1/validate",
        data={"workflow": "tb"},
        files={"file": ("temp.png", img_bytes, "image/png")},
    )
    files_after = set(os.listdir("."))
    assert files_before == files_after
