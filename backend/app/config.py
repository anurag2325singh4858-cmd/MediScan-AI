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
