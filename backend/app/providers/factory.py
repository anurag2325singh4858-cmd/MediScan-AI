from typing import Dict, Optional, Type
from app.providers.base import BaseResultsProvider
from app.providers.tb_provider import TBSimulationProvider
from app.providers.dr_provider import DRSimulationProvider
from app.schemas import ValidationException

# Default workflow-to-provider mappings
_PROVIDER_REGISTRY: Dict[str, Type[BaseResultsProvider]] = {
    "tb": TBSimulationProvider,
    "dr": DRSimulationProvider,
}


def register_results_provider(workflow: str, provider_cls: Type[BaseResultsProvider]) -> None:
    """
    Extension point: Registers or overrides a provider class for a specific screening workflow.
    Enables future genuine ML model providers to be plugged in seamlessly.
    """
    _PROVIDER_REGISTRY[workflow.lower().strip()] = provider_cls


def get_results_provider(workflow: Optional[str]) -> BaseResultsProvider:
    """
    Factory function resolving the results provider instance for a workflow.

    Raises:
    - ValidationException (400, INVALID_WORKFLOW) if workflow is missing, empty, or unsupported.
    """
    if not workflow or not isinstance(workflow, str) or not workflow.strip():
        raise ValidationException(
            status_code=400,
            code="INVALID_WORKFLOW",
            message="A workflow identifier is required. Supported workflows: tb, dr.",
        )

    norm_workflow = workflow.strip().lower()
    provider_cls = _PROVIDER_REGISTRY.get(norm_workflow)
    if provider_cls is None:
        raise ValidationException(
            status_code=400,
            code="INVALID_WORKFLOW",
            message=f"Unsupported workflow '{workflow}'. Supported workflows: tb, dr.",
        )

    return provider_cls()
