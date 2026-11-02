import uuid
from datetime import datetime, timezone
from typing import Optional, List
from app.providers.base import BaseResultsProvider
from app.schemas import (
    FindingCoordinates,
    FindingItem,
    ImageValidationResponse,
    ObservationItem,
    ScreeningResultResponse,
    SIMULATION_DISCLAIMER,
    ValidationException,
)

# Deterministic demonstration findings for Diabetic Retinopathy screening visualization.
# Strictly illustrative: educational anatomical references only covering key retinal landmarks:
# optic disc, macula, retinal vessels, and retinal quadrants.
# Zero clinical diagnostic claims, pathology detections, confidence ratings, or probabilities.
DR_DEMONSTRATION_FINDINGS: List[FindingItem] = [
    FindingItem(
        id="DR-SIM-001",
        title="Optic Disc Landmark",
        description=(
            "Illustrative anatomical marker indicating nasal optic nerve head margin and neuroretinal rim orientation. "
            "Provided for interface overlay alignment demonstration; not an evaluation for papilledema or cupping."
        ),
        coordinates=FindingCoordinates(
            x_min=0.22,
            y_min=0.42,
            x_max=0.36,
            y_max=0.58,
        ),
        is_educational_reference=True,
        category="reference",  # Green
    ),
    FindingItem(
        id="DR-SIM-002",
        title="Macular Central Field",
        description=(
            "Educational reference marker indicating foveal / macular central zone placement "
            "for layout inspection. Does not evaluate macular edema or foveal reflex."
        ),
        coordinates=FindingCoordinates(
            x_min=0.48,
            y_min=0.44,
            x_max=0.62,
            y_max=0.58,
        ),
        is_educational_reference=True,
        category="inspection",  # Blue
    ),
    FindingItem(
        id="DR-SIM-003",
        title="Superior Temporal Vascular Arcade",
        description=(
            "Educational marker highlighting major retinal arteriolar and venular vessel pathways "
            "across the superior temporal retinal quadrant."
        ),
        coordinates=FindingCoordinates(
            x_min=0.35,
            y_min=0.24,
            x_max=0.55,
            y_max=0.38,
        ),
        is_educational_reference=True,
        category="highlighted",  # Red
    ),
    FindingItem(
        id="DR-SIM-004",
        title="Inferior Retinal Quadrant Boundary",
        description=(
            "Illustrative reference marker designating the inferior peripheral retinal quadrant sector "
            "for multi-zone visual framing demonstration."
        ),
        coordinates=FindingCoordinates(
            x_min=0.40,
            y_min=0.68,
            x_max=0.60,
            y_max=0.82,
        ),
        is_educational_reference=True,
        category="reference",  # Green
    ),
]


class DRSimulationProvider(BaseResultsProvider):
    """
    Deterministic simulation provider for the Diabetic Retinopathy screening demonstration.
    Generates synthetic illustrative findings without executing genuine medical inference.
    """

    @property
    def provider_type(self) -> str:
        return "simulation"

    @property
    def is_simulated(self) -> bool:
        return True

    async def generate_result(
        self,
        workflow: str,
        technical_metadata: Optional[ImageValidationResponse] = None,
        scenario: Optional[int] = None,
    ) -> ScreeningResultResponse:
        """
        Generates simulated DR screening findings with explicit demonstration labeling.
        """
        if workflow != "dr":
            raise ValidationException(
                status_code=400,
                code="INVALID_WORKFLOW",
                message=f"DRSimulationProvider only supports 'dr' workflow, got '{workflow}'.",
            )

        # Deterministic findings list with a unique response instance ID
        instance_id = f"dr_sim_{uuid.uuid4().hex[:12]}"
        now_utc = datetime.now(timezone.utc).isoformat()

        dr_observations = [
            ObservationItem(label="Optic Disc", value="Sharp disc margins with physiological neuroretinal rim contour."),
            ObservationItem(label="Macular Field", value="Foveal avascular zone centered without gross exudative distortion."),
            ObservationItem(label="Vascular Arcade", value="Major retinal arteriolar and venular branching patterns visualized."),
        ]

        return ScreeningResultResponse(
            result_id=instance_id,
            workflow="dr",
            status="completed",
            provider_type=self.provider_type,
            is_simulated=self.is_simulated,
            disclaimer=SIMULATION_DISCLAIMER,
            technical_summary=technical_metadata,
            findings=[item.model_copy() for item in DR_DEMONSTRATION_FINDINGS],
            observations=dr_observations,
            generated_at=now_utc,
        )
