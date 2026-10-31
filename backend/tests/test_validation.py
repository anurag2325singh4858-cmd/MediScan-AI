import io
import os
import pytest
from fastapi.testclient import TestClient
from PIL import Image
from app.main import app
from app.config import settings

client = TestClient(app)


def create_test_image(
    format: str,
    width: int = 64,
    height: int = 64,
    color: str = "red",
    mode: str = "RGB",
) -> bytes:
    """Helper to generate valid in-memory test images without persisting to disk."""
    buf = io.BytesIO()
    img = Image.new(mode, (width, height), color=color if mode != "L" else 128)
    img.save(buf, format=format)
    buf.seek(0)
    return buf.getvalue()


# 1. Health endpoint preservation (contract verification)
def test_health_check_preserved():
    """Verify /health is preserved and operational."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "MediScan AI"
    assert "version" in data
    assert "environment" in data


# 2. Valid JPEG image (TB & DR workflows)
def test_valid_jpeg_tb_workflow():
    """Verify valid JPEG file passes validation for TB workflow."""
    img_bytes = create_test_image(format="JPEG", width=128, height=128, color="blue")
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "tb"},
        files={"file": ("chest_xray.jpg", img_bytes, "image/jpeg")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "valid"
    assert data["workflow"] == "tb"
    assert data["format"] == "jpeg"
    assert data["width"] == 128
    assert data["height"] == 128
    assert data["file_size_bytes"] == len(img_bytes)
    assert data["color_mode"] == "RGB"
    assert data["pixel_decoding_status"] == "success"


def test_valid_jpeg_dr_workflow():
    """Verify valid JPEG file passes validation for DR workflow."""
    img_bytes = create_test_image(format="JPEG", width=200, height=150, color="orange")
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "dr"},
        files={"file": ("fundus.jpeg", img_bytes, "image/jpeg")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "valid"
    assert data["workflow"] == "dr"
    assert data["format"] == "jpeg"
    assert data["width"] == 200
    assert data["height"] == 150
    assert data["color_mode"] == "RGB"
    assert data["pixel_decoding_status"] == "success"


# 3. Valid PNG image
def test_valid_png_image():
    """Verify valid PNG file passes validation."""
    img_bytes = create_test_image(format="PNG", width=80, height=90, color="gray")
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "tb"},
        files={"file": ("radiograph.png", img_bytes, "image/png")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "valid"
    assert data["format"] == "png"
    assert data["width"] == 80
    assert data["height"] == 90
    assert data["color_mode"] == "RGB"
    assert data["pixel_decoding_status"] == "success"


# 4. Valid WebP image
def test_valid_webp_image():
    """Verify valid WebP file passes validation."""
    img_bytes = create_test_image(format="WEBP", width=60, height=60, color="green")
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "dr"},
        files={"file": ("retina.webp", img_bytes, "image/webp")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "valid"
    assert data["format"] == "webp"
    assert data["width"] == 60
    assert data["height"] == 60
    assert data["color_mode"] == "RGB"
    assert data["pixel_decoding_status"] == "success"


# 5. Empty upload (0 bytes)
def test_empty_file_rejected():
    """Verify 0-byte upload is rejected with 400 and EMPTY_FILE code."""
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "tb"},
        files={"file": ("empty.jpg", b"", "image/jpeg")},
    )
    assert response.status_code == 400
    data = response.json()
    assert data["detail"]["code"] == "EMPTY_FILE"
    assert "empty" in data["detail"]["message"].lower()


# 6. Corrupted or undecodable image
def test_corrupted_image_rejected():
    """Verify arbitrary binary noise is rejected as corrupted image."""
    corrupt_bytes = b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00RANDOM_CORRUPT_BYTES_XYZ"
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "tb"},
        files={"file": ("corrupt.jpg", corrupt_bytes, "image/jpeg")},
    )
    assert response.status_code == 400
    data = response.json()
    assert data["detail"]["code"] == "CORRUPTED_IMAGE"


# 7. Unsupported file format (e.g. BMP / GIF / TIFF)
def test_unsupported_format_rejected():
    """Verify BMP image format is rejected with UNSUPPORTED_FORMAT code."""
    bmp_bytes = create_test_image(format="BMP", width=32, height=32)
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "dr"},
        files={"file": ("scan.bmp", bmp_bytes, "image/bmp")},
    )
    assert response.status_code == 415
    data = response.json()
    assert data["detail"]["code"] == "UNSUPPORTED_FORMAT"
    assert "bmp" in data["detail"]["message"].lower()


# 8. Misleading filename or MIME type
def test_misleading_filename_and_mime():
    """Verify a text file labeled as image/png is rejected upon content decoding."""
    text_payload = b"Plain text payload pretending to be a radiograph."
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "tb"},
        files={"file": ("fake_xray.png", text_payload, "image/png")},
    )
    assert response.status_code == 400
    data = response.json()
    assert data["detail"]["code"] == "CORRUPTED_IMAGE"


# 9. Upload exceeding 10 MB limit
def test_oversized_content_length_rejected():
    """Verify early rejection when Content-Length header exceeds 10 MB."""
    fake_large_size = 15 * 1024 * 1024  # 15 MB
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "tb"},
        files={"file": ("huge.jpg", b"small-content", "image/jpeg")},
        headers={"Content-Length": str(fake_large_size)},
    )
    assert response.status_code == 413
    data = response.json()
    assert data["detail"]["code"] == "FILE_TOO_LARGE"
    assert "10 mb" in data["detail"]["message"].lower()


def test_oversized_stream_rejected():
    """Verify chunked stream exceeding 10 MB is stopped and rejected."""
    # Create payload slightly exceeding 10 MB (10 MB + 128 KB)
    oversized_bytes = b"0" * (settings.max_upload_size_bytes + 128 * 1024)
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "dr"},
        files={"file": ("oversized.jpg", oversized_bytes, "image/jpeg")},
    )
    assert response.status_code == 413
    data = response.json()
    assert data["detail"]["code"] == "FILE_TOO_LARGE"


# 10. Invalid workflow identifier
def test_invalid_workflow_rejected():
    """Verify unsupported workflow string is rejected with 400 and INVALID_WORKFLOW."""
    img_bytes = create_test_image(format="JPEG")
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "cardiology"},
        files={"file": ("test.jpg", img_bytes, "image/jpeg")},
    )
    assert response.status_code == 400
    data = response.json()
    assert data["detail"]["code"] == "INVALID_WORKFLOW"
    assert "unsupported workflow" in data["detail"]["message"].lower()


# 11. Missing required request fields
def test_missing_workflow_field():
    """Verify missing workflow field returns standardized error."""
    img_bytes = create_test_image(format="JPEG")
    response = client.post(
        "/api/v1/validate",
        files={"file": ("test.jpg", img_bytes, "image/jpeg")},
    )
    assert response.status_code == 400
    data = response.json()
    assert data["detail"]["code"] == "INVALID_WORKFLOW"


def test_missing_file_field():
    """Verify missing file field returns standardized error."""
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "tb"},
    )
    assert response.status_code == 400
    data = response.json()
    assert data["detail"]["code"] == "MISSING_FILE"


# 12. Malformed / unsupported requests handled gracefully
def test_empty_multipart_body():
    """Verify empty POST request returns clean client error without crashing."""
    response = client.post("/api/v1/validate")
    assert response.status_code in [400, 422]
    data = response.json()
    assert "detail" in data
    assert "code" in data["detail"]


# 13. Consistent error response contract
def test_error_response_contract_consistency():
    """Verify that all error responses strictly follow the {detail: {code, message}} schema."""
    error_cases = [
        client.post("/api/v1/validate", data={"workflow": "invalid"}),
        client.post("/api/v1/validate", data={"workflow": "tb"}, files={"file": ("e.jpg", b"", "image/jpeg")}),
        client.post("/api/v1/validate", data={"workflow": "tb"}, files={"file": ("c.jpg", b"bad", "image/jpeg")}),
    ]
    for resp in error_cases:
        assert resp.status_code >= 400
        payload = resp.json()
        assert "detail" in payload
        assert isinstance(payload["detail"], dict)
        assert "code" in payload["detail"]
        assert "message" in payload["detail"]
        assert isinstance(payload["detail"]["code"], str)
        assert isinstance(payload["detail"]["message"], str)


# 14. Resource cleanup & absence of persistent files
def test_no_persistent_files_created(tmp_path):
    """Verify validation runs entirely in memory without creating temporary artifact files."""
    initial_cwd_files = set(os.listdir("."))
    img_bytes = create_test_image(format="JPEG")
    
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "tb"},
        files={"file": ("radiograph.jpg", img_bytes, "image/jpeg")},
    )
    assert response.status_code == 200

    after_cwd_files = set(os.listdir("."))
    new_files = after_cwd_files - initial_cwd_files
    # Only pytest caches / pyc files should ever exist; no uploaded images
    image_artifacts = [f for f in new_files if f.endswith((".jpg", ".jpeg", ".png", ".webp", ".tmp"))]
    assert len(image_artifacts) == 0, f"Detected leaked image files: {image_artifacts}"


# 15. Alias route verification (/api/validate)
def test_alias_route_operational():
    """Verify the /api/validate alias route behaves identically to /api/v1/validate."""
    img_bytes = create_test_image(format="PNG", width=40, height=40)
    response = client.post(
        "/api/validate",
        data={"workflow": "dr"},
        files={"file": ("fundus.png", img_bytes, "image/png")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "valid"
    assert data["workflow"] == "dr"
    assert data["format"] == "png"
    assert data["color_mode"] == "RGB"
    assert data["pixel_decoding_status"] == "success"


# 16. Technical image checks: Grayscale radiograph mode
def test_valid_grayscale_radiograph():
    """Verify grayscale (L) radiograph maps to 'grayscale' color_mode and decodes successfully."""
    img_bytes = create_test_image(format="PNG", width=120, height=120, mode="L")
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "tb"},
        files={"file": ("cxr_gray.png", img_bytes, "image/png")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "valid"
    assert data["workflow"] == "tb"
    assert data["color_mode"] == "grayscale"
    assert data["pixel_decoding_status"] == "success"


# 17. Technical image checks: RGBA color mode
def test_valid_rgba_image():
    """Verify RGBA image maps to 'RGBA' color_mode and decodes successfully."""
    img_bytes = create_test_image(format="PNG", width=100, height=100, mode="RGBA")
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "dr"},
        files={"file": ("fundus_rgba.png", img_bytes, "image/png")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "valid"
    assert data["workflow"] == "dr"
    assert data["color_mode"] == "RGBA"
    assert data["pixel_decoding_status"] == "success"


# 18. Technical image checks: Truncated pixel scanlines fail decoding
def test_truncated_image_fails_decoding():
    """Verify image with intact headers but truncated raster scanlines is rejected with DECODING_FAILED."""
    valid_bytes = create_test_image(format="JPEG", width=128, height=128, color="purple")
    # Truncate end scanlines so headers are intact but pixel loading encounters EOF
    truncated_bytes = valid_bytes[:-20]
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "tb"},
        files={"file": ("truncated_cxr.jpg", truncated_bytes, "image/jpeg")},
    )
    assert response.status_code == 400
    data = response.json()
    assert data["detail"]["code"] == "DECODING_FAILED"
    assert "decode image pixel" in data["detail"]["message"].lower()


# 19. Technical image checks: Decoded pixel resolution limit exceeded
def test_pixel_limit_exceeded_rejected():
    """Verify image exceeding max_decoded_pixels (25 MP) is rejected with 413 and PIXEL_LIMIT_EXCEEDED."""
    # 6000 x 5000 = 30,000,000 pixels (exceeds 25,000,000 threshold), compressed size ~3.7 KB
    buf = io.BytesIO()
    img = Image.new("1", (6000, 5000), color=0)
    img.save(buf, format="PNG")
    huge_bytes = buf.getvalue()

    response = client.post(
        "/api/v1/validate",
        data={"workflow": "tb"},
        files={"file": ("30mp_chest.png", huge_bytes, "image/png")},
    )
    assert response.status_code == 413
    data = response.json()
    assert data["detail"]["code"] == "PIXEL_LIMIT_EXCEEDED"
    assert "25,000,000 pixels" in data["detail"]["message"]


# 20. Technical image checks: Pillow DecompressionBomb protection
def test_decompression_bomb_handling(monkeypatch):
    """Verify Pillow DecompressionBombWarning/Error triggers PIXEL_LIMIT_EXCEEDED."""
    import warnings
    # Temporarily set Pillow's MAX_IMAGE_PIXELS very low to trigger DecompressionBombWarning
    monkeypatch.setattr(Image, "MAX_IMAGE_PIXELS", 5000)
    img_bytes = create_test_image(format="PNG", width=100, height=100)  # 10,000 pixels > 5,000
    response = client.post(
        "/api/v1/validate",
        data={"workflow": "dr"},
        files={"file": ("bomb.png", img_bytes, "image/png")},
    )
    assert response.status_code == 413
    data = response.json()
    assert data["detail"]["code"] == "PIXEL_LIMIT_EXCEEDED"

