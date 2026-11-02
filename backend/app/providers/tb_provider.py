import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
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

# ---------------------------------------------------------------------------
# Six Predefined Educational Visualization Scenarios for TB Screening Demo
# Strictly for interface and visual layout demonstration:
# - No disease detection or clinical inference.
# - No normal / abnormal / safe / low-risk / high-risk categorization.
# - Color roles:
#   * reference (Green): Educational anatomical reference region
#   * inspection (Orange/Blue): Additional inspection reference region
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
        "observations": [
            {"label": "Thoracic Symmetry", "value": "Symmetric lung expansion and thoracic cage contour."},
            {"label": "Pleural Recesses", "value": "Left costophrenic sulcus clear; no reactive blunting."},
            {"label": "Cardiomediastinal Contour", "value": "Trachea midline; cardiac silhouette within normal ratio."},
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
                category="inspection",  # Orange/Blue
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
        "observations": [
            {"label": "Parenchymal Symmetry", "value": "Contralateral left lung parenchyma demonstrates preserved vascular branching."},
            {"label": "Diaphragmatic Contour", "value": "Smooth hemidiaphragms with sharp lateral costophrenic angles."},
            {"label": "Tracheobronchial Axis", "value": "Midline tracheal orientation without lateral deviation."},
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
                category="inspection",  # Orange/Blue
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
        "observations": [
            {"label": "Mediastinum", "value": "Normal superior mediastinal width; tracheal air column central."},
            {"label": "Hilar Angles", "value": "Right hilum visible without gross lymph node enlargement."},
            {"label": "Costophrenic Angles", "value": "Both costophrenic sulci well visualized without fluid levels."},
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
                category="inspection",  # Orange/Blue
            ),
        ],
        "observations": [
            {"label": "Lower Lung Zones", "value": "Retrocardiac density noted in lower zone; right basal aeration preserved."},
            {"label": "Pleural Space", "value": "Right costophrenic angle clear; left costophrenic recess sharp."},
            {"label": "Subdiaphragmatic Contour", "value": "Intact diaphragmatic profile with normal gastric air bubble."},
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
                category="inspection",  # Orange/Blue
            ),
        ],
        "observations": [
            {"label": "Apical Zones", "value": "Left apex clear; right infraclavicular parenchymal opacity noted."},
            {"label": "Pleural Boundaries", "value": "Peripheral visceral pleural line normal without pneumothorax."},
            {"label": "Thoracic Skeleton", "value": "Visualized clavicles and ribs intact without focal osteolytic lesions."},
        ],
    },
    {
        "id": "scenario_6",
        "name": "Upper-Lobe Cavitary & Apical Opacity Demonstration",
        "description": "Demonstration layout featuring right apical parenchymal opacity with suspected cavitary lucency.",
        "findings": [
            FindingItem(
                id="TB-SIM-601",
                title="Apical Infiltration & Cavitary Lucency",
                description=(
                    "Focal parenchymal consolidation in the right upper pulmonary apex with an internal radiolucent "
                    "area, suggestive of post-primary cavitary morphology. Educational Reference: Cavitary changes are "
                    "characteristic of secondary tuberculosis with high infectiousness. Clinical Solution: Immediate sputum "
                    "GeneXpert MTB/RIF assay, AFB smear microscopy, and respiratory isolation precautions."
                ),
                coordinates=FindingCoordinates(x_min=0.56, y_min=0.14, x_max=0.78, y_max=0.34),
                is_educational_reference=True,
                category="highlighted",  # Red
            ),
            FindingItem(
                id="TB-SIM-602",
                title="Pericavitary Satellite Densities",
                description=(
                    "Subtle patchy nodular attenuation surrounding the right apical consolidation margin, illustrative "
                    "of early bronchogenic dissemination pattern in active pulmonary TB demonstration."
                ),
                coordinates=FindingCoordinates(x_min=0.52, y_min=0.34, x_max=0.68, y_max=0.46),
                is_educational_reference=True,
                category="inspection",  # Orange/Blue
            ),
            FindingItem(
                id="TB-SIM-603",
                title="Contralateral Base & Costophrenic Angle",
                description=(
                    "Clear left mid and lower lung zones; acute costophrenic angle confirming absent reactive pleural "
                    "effusion in the dependent pleural recess."
                ),
                coordinates=FindingCoordinates(x_min=0.16, y_min=0.68, x_max=0.36, y_max=0.84),
                is_educational_reference=True,
                category="reference",  # Green
            ),
        ],
        "observations": [
            {"label": "Apical Parenchyma", "value": "Right apical opacity with internal lucency; left apex aerated."},
            {"label": "Pleural Recesses", "value": "Bilateral costophrenic angles sharp without fluid accumulation."},
            {"label": "Cardiothoracic Ratio", "value": "Cardiac silhouette and mediastinum within expected physiological limits."},
        ],
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
            ) % len(TB_EDUCATIONAL_SCENARIOS)
        else:
            scenario_idx = 0

        selected_scenario = TB_EDUCATIONAL_SCENARIOS[scenario_idx]
        instance_id = f"tb_sim_{uuid.uuid4().hex[:12]}"
        now_utc = datetime.now(timezone.utc).isoformat()

        raw_observations = selected_scenario.get("observations", [])
        observation_items = [
            ObservationItem(label=obs["label"], value=obs["value"])
            for obs in raw_observations
        ]

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
            observations=observation_items,
            generated_at=now_utc,
        )
