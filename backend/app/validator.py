import io
import warnings
from typing import Optional
from fastapi import UploadFile, Request
from PIL import Image, UnidentifiedImageError
from app.config import settings
from app.schemas import ImageValidationResponse, ValidationException
from app.suitability import check_image_suitability

# Human-readable color mode descriptors
COLOR_MODE_NAMES = {
    "L": "grayscale",
    "RGB": "RGB",
    "RGBA": "RGBA",
    "P": "palette",
    "CMYK": "CMYK",
    "1": "monochrome",
    "YCbCr": "YCbCr",
    "I": "grayscale_32bit",
    "F": "grayscale_float",
    "LA": "grayscale_alpha",
}


async def validate_medical_image(
    workflow: Optional[str],
    file: Optional[UploadFile],
    request: Optional[Request] = None,
) -> ImageValidationResponse:
    """
    Validates an uploaded medical image for technical integrity, supported encoding,
    decoded-pixel resource safety, and actual pixel raster decode viability.

    Parameters:
    - workflow: Must be 'tb' or 'dr'
    - file: The uploaded multipart image file
    - request: The incoming HTTP request (for early Content-Length inspection)

    Returns:
    - ImageValidationResponse containing verified technical inspection metadata.

    Raises:
    - ValidationException on workflow, size, format, decompression-bomb, or decoding violations.
    """
    # 1. Validate Workflow Identifier
    if not workflow or not isinstance(workflow, str) or not workflow.strip():
        raise ValidationException(
            status_code=400,
            code="INVALID_WORKFLOW",
            message="A workflow identifier is required. Supported workflows: tb, dr.",
        )

    norm_workflow = workflow.strip().lower()
    if norm_workflow not in settings.supported_workflows:
        raise ValidationException(
            status_code=400,
            code="INVALID_WORKFLOW",
            message=f"Unsupported workflow '{workflow}'. Supported workflows: tb, dr.",
        )

    # 2. Validate File Presence
    if file is None or not hasattr(file, "read"):
        raise ValidationException(
            status_code=400,
            code="MISSING_FILE",
            message="An image file is required.",
        )

    # 3. Early Content-Length Check (if client supplied Content-Length header)
    if request is not None:
        header_len_str = request.headers.get("content-length")
        if header_len_str and header_len_str.isdigit():
            header_len = int(header_len_str)
            if header_len > settings.max_upload_size_bytes:
                max_mb = settings.max_upload_size_bytes // (1024 * 1024)
                raise ValidationException(
                    status_code=413,
                    code="FILE_TOO_LARGE",
                    message=f"Uploaded file exceeds maximum limit of {max_mb} MB.",
                )

    # 4. Stream-Safe Chunked Reading (Protects memory from spoofed/missing Content-Length)
    buffer = bytearray()
    total_bytes = 0

    try:
        while True:
            chunk = await file.read(settings.chunk_size_bytes)
            if not chunk:
                break
            total_bytes += len(chunk)
            if total_bytes > settings.max_upload_size_bytes:
                max_mb = settings.max_upload_size_bytes // (1024 * 1024)
                raise ValidationException(
                    status_code=413,
                    code="FILE_TOO_LARGE",
                    message=f"Uploaded file exceeds maximum limit of {max_mb} MB.",
                )
            buffer.extend(chunk)

        # 5. Check for Empty Upload
        if total_bytes == 0:
            raise ValidationException(
                status_code=400,
                code="EMPTY_FILE",
                message="The uploaded file is empty (0 bytes).",
            )

        # 6. Safe In-Memory Image Verification and Actual Pixel Decoding
        stream = io.BytesIO(buffer)
        try:
            # Trap decompression-bomb warnings deliberately
            with warnings.catch_warnings(record=True) as caught_warnings:
                warnings.simplefilter("always", Image.DecompressionBombWarning)

                try:
                    with Image.open(stream) as img:
                        detected_format = img.format
                        if not detected_format:
                            raise ValidationException(
                                status_code=400,
                                code="UNSUPPORTED_FORMAT",
                                message="Unable to detect a supported image format in the uploaded file.",
                            )

                        norm_format = detected_format.lower()
                        if norm_format not in settings.supported_image_formats:
                            raise ValidationException(
                                status_code=415,
                                code="UNSUPPORTED_FORMAT",
                                message=(
                                    f"Unsupported image format '{norm_format}'. "
                                    f"Supported formats: {', '.join(settings.supported_image_formats)}."
                                ),
                            )

                        width, height = img.size
                        if width <= 0 or height <= 0:
                            raise ValidationException(
                                status_code=400,
                                code="INVALID_DIMENSIONS",
                                message="Image dimensions must be positive integers.",
                            )

                        # Decoded-image resource protection: check pixel count before rasterizing
                        pixel_count = width * height
                        if pixel_count > settings.max_decoded_pixels:
                            raise ValidationException(
                                status_code=413,
                                code="PIXEL_LIMIT_EXCEEDED",
                                message=(
                                    f"Image resolution ({width}x{height} = {pixel_count:,} pixels) "
                                    f"exceeds the maximum safety limit of {settings.max_decoded_pixels:,} pixels."
                                ),
                            )

                        # Check if a DecompressionBombWarning was triggered
                        for w in caught_warnings:
                            if issubclass(w.category, Image.DecompressionBombWarning):
                                raise ValidationException(
                                    status_code=413,
                                    code="PIXEL_LIMIT_EXCEEDED",
                                    message="Image exceeds safety threshold for decompression bomb protection.",
                                )

                        # 7. Actual Pixel Decoding (Verifies full raster integrity)
                        try:
                            img.load()
                        except (OSError, ValueError, SyntaxError, RuntimeError):
                            raise ValidationException(
                                status_code=400,
                                code="DECODING_FAILED",
                                message="Failed to decode image pixel raster data. The image may be corrupt, truncated, or malformed.",
                            )

                        raw_mode = img.mode
                        color_mode = COLOR_MODE_NAMES.get(raw_mode, raw_mode)

                        # 8. Workflow Suitability Checks (Dimensional & Aspect Ratio Heuristics)
                        check_image_suitability(
                            workflow=norm_workflow,
                            width=width,
                            height=height,
                            color_mode=color_mode,
                        )

                        return ImageValidationResponse(
                            status="valid",
                            workflow=norm_workflow,
                            format=norm_format,
                            width=width,
                            height=height,
                            file_size_bytes=total_bytes,
                            color_mode=color_mode,
                            pixel_decoding_status="success",
                            suitability_verified=False,
                            suitability_note=(
                                "Basic technical and dimensional checks passed. "
                                "Heuristics do not verify anatomical or medical modality suitability."
                            ),
                        )

                except Image.DecompressionBombError:
                    raise ValidationException(
                        status_code=413,
                        code="PIXEL_LIMIT_EXCEEDED",
                        message="Image exceeds maximum safety resolution limits (potential decompression bomb).",
                    )

        except ValidationException:
            raise
        except UnidentifiedImageError:
            raise ValidationException(
                status_code=400,
                code="CORRUPTED_IMAGE",
                message="The uploaded file cannot be parsed as a valid image.",
            )
        except Exception:
            raise ValidationException(
                status_code=400,
                code="CORRUPTED_IMAGE",
                message="The uploaded image data is corrupted, malformed, or incomplete.",
            )
        finally:
            stream.close()

    finally:
        # Guarantee buffer memory release
        buffer.clear()
        await file.close()
