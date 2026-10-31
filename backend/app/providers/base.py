from abc import ABC, abstractmethod
from typing import Optional
from app.schemas import ImageValidationResponse, ScreeningResultResponse


class BaseResultsProvider(ABC):
    """
    Abstract interface for screening result providers.
    Enables pluggable simulation providers and future genuine ML inference adapters
    without modifying API routes, client contracts, or results rendering logic.
    """

    @property
    @abstractmethod
    def provider_type(self) -> str:
        """Category identifier for the provider (e.g. 'simulation', 'model')."""
        pass

    @property
    @abstractmethod
    def is_simulated(self) -> bool:
        """Boolean flag indicating whether the output is synthetic demonstration data."""
        pass

    @abstractmethod
    async def generate_result(
        self,
        workflow: str,
        technical_metadata: Optional[ImageValidationResponse] = None,
        scenario: Optional[int] = None,
    ) -> ScreeningResultResponse:
        """
        Generate screening result conforming to the unified ScreeningResultResponse schema.

        Parameters:
        - workflow: Target workflow ('tb' or 'dr')
        - technical_metadata: Optional verified technical inspection data from Module 9

        Returns:
        - ScreeningResultResponse instance
        """
        pass
