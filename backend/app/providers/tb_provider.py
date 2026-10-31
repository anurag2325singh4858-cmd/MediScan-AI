import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from app.providers.base import BaseResultsProvider
from app.schemas import (
    FindingCoordinates,
    FindingItem,
    ImageValidationResponse,
    ScreeningResultResponse,
    SIMULATION_DISCLAIMER,
    ValidationException,
)

# ---------------------------------------------------------------------------
# Six Predefined Educational Visualization Scenarios for TB Screening Demo
# Strictly for interface and visual layout demonstration:
# - No disease detection or clinical inference.
# - No normal / abnormal / safe / low-risk / high-risk categorization.
# - Color roles:
#   * reference (Green): Educational anatomical reference region
#   * inspection (Blue): Additional inspection reference region
#   * highlighted (Red): Highlighted demonstration region
# ---------------------------------------------------------------------------

TB_EDUCATIONAL_SCENARIOS: List[Dict[str, Any]] = [
    {
        "id": "scenario_1",
        "name": "Bilateral Apical & Costophrenic Overview",
        "description": "Two-marker layout demonstrating upper apical and lower lateral thoracic landmarks.",
        "findings": [
            FindingItem(
                id="TB-SIM-101",
                title="Apical Infiltration",
                description=(
                    "Increased hazy opacity in the right pulmonary apex. Upper-lobe predilection is a classic "
                    "radiographic indicator of secondary pulmonary tuberculosis. Clinical Solution: Sputum "
                    "GeneXpert MTB/RIF assay and 3-sample AFB smear microscopy; consult pulmonology."
                ),
                coordinates=FindingCoordinates(x_min=0.58, y_min=0.16, x_max=0.76, y_max=0.34),
                is_educational_reference=True,
                category="highlighted",  # Red
            ),
            FindingItem(
                id="TB-SIM-102",
                title="Costophrenic Angle",
                description=(
                    "Sharp and clear left costophrenic angle. Excludes pleural effusion or reactive blunting "
                    "(>150 mL fluid accumulation) in the dependent pleural space."
                ),
                coordinates=FindingCoordinates(x_min=0.18, y_min=0.68, x_max=0.34, y_max=0.82),
                is_educational_reference=True,
                category="reference",  # Green
            ),
        ],
    },
    {
        "id": "scenario_2",
        "name": "Quad-Zone Pulmonary Evaluation",
        "description": "Four-marker layout matching standard multi-quadrant thoracic evaluation.",
        "findings": [
            FindingItem(
                id="TB-SIM-201",
                title="Possible Infiltration",
                description=(
                    "Increased opacity in the upper lung region which can be a sign of tuberculosis. "
                    "Clinical Solution: High-priority sputum smear microscopy (AFB) and GeneXpert molecular testing."
                ),
                coordinates=FindingCoordinates(x_min=0.55, y_min=0.16, x_max=0.74, y_max=0.34),
                is_educational_reference=True,
                category="highlighted",  # Red
            ),
            FindingItem(
                id="TB-SIM-202",
                title="Consolidation Area",
                description=(
                    "Patchy opacity in the mid-lung zone suggestive of active parenchymal infection. "
                    "Clinical Solution: Correlate with clinical symptoms (fever, persistent cough); "
                    "physician evaluation for antimicrobial or anti-TB therapy."
                ),
                coordinates=FindingCoordinates(x_min=0.60, y_min=0.44, x_max=0.84, y_max=0.64),
                is_educational_reference=True,
                category="inspection",  # Blue
            ),
            FindingItem(
                id="TB-SIM-203",
                title="Lung Markings",
                description=(
                    "Normal lung markings visible. No obvious abnormality in this contralateral zone, "
                    "confirming preserved peripheral bronchovascular architecture."
                ),
                coordinates=FindingCoordinates(x_min=0.22, y_min=0.22, x_max=0.38, y_max=0.36),
                is_educational_reference=True,
                category="reference",  # Green
            ),
            FindingItem(
                id="TB-SIM-204",
                title="Diaphragm",
                description=(
                    "Clear and well-defined diaphragm. Normal smooth contour with sharp costodiaphragmatic recess."
                ),
                coordinates=FindingCoordinates(x_min=0.15, y_min=0.70, x_max=0.48, y_max=0.86),
                is_educational_reference=True,
                category="reference",  # Green
            ),
        ],
    },
    {
        "id": "scenario_3",
        "name": "Central Mediastinal & Perihilar Assessment",
        "description": "Two-marker layout centered on midline tracheobronchial and right hilar orientation.",
        "findings": [
            FindingItem(
                id="TB-SIM-301",
                title="Tracheobronchial Mediastinal Axis",
                description=(
                    "Midline tracheal air column intact with symmetric superior mediastinal contour. "
                    "Evaluates absence of tracheal shift (seen in volume loss or tension pneumothorax) "
                    "and paratracheal adenopathy."
                ),
                coordinates=FindingCoordinates(x_min=0.42, y_min=0.16, x_max=0.58, y_max=0.38),
                is_educational_reference=True,
                category="inspection",  # Blue
            ),
            FindingItem(
                id="TB-SIM-302",
                title="Right Hilar Pulmonary Complex",
                description=(
                    "Right hilar vascular and bronchial division displays normal density without lymphadenopathy. "
                    "Clinical Solution: Contrast-enhanced chest CT indicated if hilar lymph node enlargement "
                    "or primary complex is clinically suspected."
                ),
                coordinates=FindingCoordinates(x_min=0.58, y_min=0.36, x_max=0.75, y_max=0.52),
                is_educational_reference=True,
                category="reference",  # Green
            ),
        ],
    },
    {
        "id": "scenario_4",
        "name": "Lower Thoracic & Retrocardiac Focus",
        "description": "Three-marker layout demonstrating basal, retrocardiac, and diaphragmatic zones.",
        "findings": [
            FindingItem(
                id="TB-SIM-401",
                title="Basal Parenchymal Opacity",
                description=(
                    "Focal attenuation in the retrocardiac lower lung zone suggestive of dependent consolidation "
                    "or lower-lobe pneumonia. Clinical Solution: Lateral projection radiograph and microbiological "
                    "culture advised."
                ),
                coordinates=FindingCoordinates(x_min=0.25, y_min=0.58, x_max=0.48, y_max=0.78),
                is_educational_reference=True,
                category="highlighted",  # Red
            ),
            FindingItem(
                id="TB-SIM-402",
                title="Right Costophrenic Sulcus",
                description=(
                    "Acute, sharp lateral costophrenic angle confirming clear pleural recesses "
                    "without reactive pleural thickening or effusion."
                ),
                coordinates=FindingCoordinates(x_min=0.64, y_min=0.68, x_max=0.82, y_max=0.84),
                is_educational_reference=True,
                category="reference",  # Green
            ),
            FindingItem(
                id="TB-SIM-403",
                title="Subdiaphragmatic Gastric Space",
                description=(
                    "Normal anatomical position of gastric air bubble beneath the left hemidiaphragm; "
                    "confirms intact diaphragmatic barrier without subdiaphragmatic free air."
                ),
                coordinates=FindingCoordinates(x_min=0.18, y_min=0.76, x_max=0.35, y_max=0.90),
                is_educational_reference=True,
                category="inspection",  # Blue
            ),
        ],
    },
    {
        "id": "scenario_5",
        "name": "Upper Infraclavicular & Peripheral Margin",
        "description": "Three-marker layout illustrating apical, infraclavicular, and axillary peripheral zones.",
        "findings": [
            FindingItem(
                id="TB-SIM-501",
                title="Infraclavicular Opacity",
                description=(
                    "Patchy infiltration in the right infraclavicular zone (Assmann focus), characteristic of "
                    "early pulmonary tuberculosis. Clinical Solution: Sputum bacteriology testing and "
                    "clinical household contact screening."
                ),
                coordinates=FindingCoordinates(x_min=0.55, y_min=0.22, x_max=0.78, y_max=0.36),
                is_educational_reference=True,
                category="highlighted",  # Red
            ),
            FindingItem(
                id="TB-SIM-502",
                title="Left Apical Apex",
                description=(
                    "Clear left pulmonary apex with normal parenchymal aeration and no fibrocalcific scars "
                    "or apical pleural capping."
                ),
                coordinates=FindingCoordinates(x_min=0.22, y_min=0.12, x_max=0.38, y_max=0.28),
                is_educational_reference=True,
                category="reference",  # Green
            ),
            FindingItem(
                id="TB-SIM-503",
                title="Lateral Pleural Boundary",
                description=(
                    "Smooth visceral-parietal pleural interface along the lateral thoracic chest wall; "
                    "rules out peripheral pneumothorax line."
                ),
                coordinates=FindingCoordinates(x_min=0.72, y_min=0.36, x_max=0.88, y_max=0.56),
                is_educational_reference=True,
                category="inspection",  # Blue
            ),
        ],
    },
    {
        "id": "scenario_6",
        "name": "Baseline Demonstration View (Unannotated)",
        "description": "Clean baseline view displaying an unannotated radiograph for visual comparison.",
        "findings": [],  # Empty overlay state
    },
]

# Retain backward-compatible alias for existing imports
TB_DEMONSTRATION_FINDINGS: List[FindingItem] = TB_EDUCATIONAL_SCENARIOS[0]["findings"]


class TBSimulationProvider(BaseResultsProvider):
    """
    Deterministic simulation provider for the Tuberculosis screening demonstration.
    Generates synthetic illustrative findings across six predefined educational visualization scenarios
    without executing genuine medical inference or clinical risk scoring.
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
        Generates simulated TB screening findings with explicit demonstration labeling.
        Selects deterministically from the 6 predefined educational scenarios.
        """
        if workflow != "tb":
            raise ValidationException(
                status_code=400,
                code="INVALID_WORKFLOW",
                message=f"TBSimulationProvider only supports 'tb' workflow, got '{workflow}'.",
            )

        # Determine scenario index (0 to 5)
        if scenario is not None and 1 <= scenario <= 6:
            scenario_idx = scenario - 1
        elif technical_metadata is not None:
            # Deterministic selection based on image technical properties:
            # The SAME image uploaded repeatedly produces the EXACT SAME scenario.
            scenario_idx = (
                technical_metadata.width * 31
                + technical_metadata.height * 17
                + technical_metadata.file_size_bytes
            ) % 6
        else:
            scenario_idx = 0

        selected_scenario = TB_EDUCATIONAL_SCENARIOS[scenario_idx]
        instance_id = f"tb_sim_{uuid.uuid4().hex[:12]}"
        now_utc = datetime.now(timezone.utc).isoformat()

        return ScreeningResultResponse(
            result_id=instance_id,
            workflow="tb",
            status="completed",
            provider_type=self.provider_type,
            is_simulated=self.is_simulated,
            disclaimer=SIMULATION_DISCLAIMER,
            technical_summary=technical_metadata,
            scenario_id=selected_scenario["id"],
            scenario_name=selected_scenario["name"],
            findings=[item.model_copy() for item in selected_scenario["findings"]],
            generated_at=now_utc,
        )
