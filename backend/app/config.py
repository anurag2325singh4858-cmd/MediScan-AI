import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings for MediScan AI.
    Values can be overridden by environment variables or an optional .env file.
    """
    app_name: str = "MediScan AI"
    app_version: str = "0.1.0"
    environment: str = "development"
    host: str = "0.0.0.0"
    port: int = 8000
    allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    max_upload_size_bytes: int = 10 * 1024 * 1024  # 10 MB max upload limit
    max_decoded_pixels: int = 25_000_000  # 25 Megapixels (safety limit for uncompressed raster decoding)
    chunk_size_bytes: int = 64 * 1024  # 64 KB read buffer
    supported_workflows: List[str] = ["tb", "dr"]
    supported_image_formats: List[str] = ["jpeg", "png", "webp"]

    # Workflow-specific image suitability settings (configurable)
    tb_min_width: int = 32
    tb_min_height: int = 32
    tb_min_aspect_ratio: float = 0.25  # 1:4 maximum tallness
    tb_max_aspect_ratio: float = 4.0   # 4:1 maximum wideness

    dr_min_width: int = 32
    dr_min_height: int = 32
    dr_min_aspect_ratio: float = 0.33  # 1:3 maximum tallness
    dr_max_aspect_ratio: float = 3.0   # 3:1 maximum wideness

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def cors_origins(self) -> List[str]:
        """
        Parses the comma-separated allowed_origins string into a list of origins.
        Ensures trailing slashes are removed and empty entries are filtered out.
        """
        if not self.allowed_origins:
            return []
        return [
            origin.strip().rstrip("/")
            for origin in self.allowed_origins.split(",")
            if origin.strip()
        ]


settings = Settings()
