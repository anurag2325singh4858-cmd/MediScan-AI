import io
import os
import pytest
from datetime import datetime
from fastapi.testclient import TestClient
from PIL import Image
from app.main import app
from app.config import settings
from app.schemas import (
    ScreeningResultResponse,
    ImageValidationResponse,
    ValidationException,
    SIMULATION_DISCLAIMER,
)
from app.providers import (
    BaseResultsProvider,
    TBSimulationProvider,
    DRSimulationProvider,
    get_results_provider,
    register_results_provider,
)

client = TestClient(app)


def create_in_memory_image(format: str = "PNG", width: int = 100, height: int = 100, color: str = "blue") -> bytes:
    """Helper generating in-memory test images without disk persistence."""
    buf = io.BytesIO()
    img = Image.new("RGB", (width, height), color=color)
    img.save(buf, format=format)
    buf.seek(0)
    return buf.getvalue()


# 1. Valid TB provider selection
def test_valid_tb_provider_selection():
    """Verify get_results_provider selects TBSimulationProvider for 'tb' workflow."""
    provider = get_results_provider("tb")
    assert isinstance(provider, TBSimulationProvider)
    assert provider.provider_type == "simulation"
    assert provider.is_simulated is True


# 2. Valid DR provider selection
def test_valid_dr_provider_selection():
    """Verify get_results_provider selects DRSimulationProvider for 'dr' workflow."""
    provider = get_results_provider("dr")
    assert isinstance(provider, DRSimulationProvider)
    assert provider.provider_type == "simulation"
    assert provider.is_simulated is True


# 3. Unsupported workflow rejection
@pytest.mark.parametrize("invalid_wf", ["cardiology", "oncology", "xray", "", "   ", None])
def test_unsupported_workflow_rejection(invalid_wf):
    """Verify get_results_provider rejects invalid or empty workflows with INVALID_WORKFLOW."""
    with pytest.raises(ValidationException) as exc_info:
        get_results_provider(invalid_wf)
    assert exc_info.value.status_code == 400
    assert exc_info.value.code == "INVALID_WORKFLOW"


# 4. Shared result schema validation & direct generation
@pytest.mark.anyio
async def test_tb_provider_direct_generation():
    """Verify TBSimulationProvider generates valid ScreeningResultResponse schema."""
    provider = TBSimulationProvider()
    result = await provider.generate_result("tb")
    assert isinstance(result, ScreeningResultResponse)
    assert result.workflow == "tb"
    assert result.status == "completed"
    assert result.provider_type == "simulation"
    assert result.is_simulated is True
    assert result.result_id.startswith("tb_sim_")
    assert len(result.findings) >= 1
    # Verify ISO 8601 timestamp parsable
    assert datetime.fromisoformat(result.generated_at) is not None


@pytest.mark.anyio
async def test_dr_provider_direct_generation():
    """Verify DRSimulationProvider generates valid ScreeningResultResponse schema."""
    provider = DRSimulationProvider()
    result = await provider.generate_result("dr")
    assert isinstance(result, ScreeningResultResponse)
    assert result.workflow == "dr"
    assert result.status == "completed"
    assert result.provider_type == "simulation"
    assert result.is_simulated is True
    assert result.result_id.startswith("dr_sim_")
    assert len(result.findings) >= 1
    assert datetime.fromisoformat(result.generated_at) is not None


# 5. Presence of prominent simulation disclaimer
@pytest.mark.anyio
async def test_simulation_disclaimer_presence():
    """Verify mandatory simulation disclaimer is present in results."""
    tb_provider = TBSimulationProvider()
    dr_provider = DRSimulationProvider()
    tb_result = await tb_provider.generate_result("tb")
    dr_result = await dr_provider.generate_result("dr")

    for res in [tb_result, dr_result]:
        assert res.disclaimer == SIMULATION_DISCLAIMER
        assert "DEMONSTRATION ONLY" in res.disclaimer
        assert "NOT constitute clinical diagnosis" in res.disclaimer


# 6. Absence of fabricated confidence scores, probabilities, or severity
@pytest.mark.anyio
async def test_absence_of_fabricated_clinical_scores():
    """Verify response schema contains no confidence scores, probabilities, or clinical ratings."""
    tb_result = await TBSimulationProvider().generate_result("tb")
    dr_result = await DRSimulationProvider().generate_result("dr")

    forbidden_keys = {"confidence", "probability", "risk_percentage", "severity", "score"}

    for res in [tb_result, dr_result]:
        res_dict = res.model_dump()
        for key in forbidden_keys:
            assert key not in res_dict, f"Forbidden clinical claim key '{key}' found in response root"

        for finding in res.findings:
            f_dict = finding.model_dump()
            for key in forbidden_keys:
                assert key not in f_dict, f"Forbidden key '{key}' found in finding {finding.id}"


# 7. Separation of TB and DR provider behavior
@pytest.mark.anyio
async def test_separation_of_tb_and_dr_behavior():
    """Verify TB and DR providers have strictly separate finding IDs, content, and workflow checks."""
    tb_res = await TBSimulationProvider().generate_result("tb")
    dr_res = await DRSimulationProvider().generate_result("dr")

    tb_ids = {f.id for f in tb_res.findings}
    dr_ids = {f.id for f in dr_res.findings}

    # Finding IDs must be strictly disjoint
    assert len(tb_ids.intersection(dr_ids)) == 0
    assert all(fid.startswith("TB-") for fid in tb_ids)
    assert all(fid.startswith("DR-") for fid in dr_ids)

    # Cross-workflow rejection
    with pytest.raises(ValidationException) as exc1:
        await TBSimulationProvider().generate_result("dr")
    assert exc1.value.code == "INVALID_WORKFLOW"

    with pytest.raises(ValidationException) as exc2:
        await DRSimulationProvider().generate_result("tb")
    assert exc2.value.code == "INVALID_WORKFLOW"


# 8. Deterministic simulation output
@pytest.mark.anyio
async def test_deterministic_simulation_output():
    """Verify repeated provider invocations return deterministic illustrative findings."""
    tb_provider = TBSimulationProvider()
    res1 = await tb_provider.generate_result("tb")
    res2 = await tb_provider.generate_result("tb")

    assert len(res1.findings) == len(res2.findings)
    for f1, f2 in zip(res1.findings, res2.findings):
        assert f1.id == f2.id
        assert f1.title == f2.title
        assert f1.description == f2.description
        assert f1.coordinates == f2.coordinates


# 9. Finding coordinates validity
@pytest.mark.anyio
async def test_finding_coordinates_within_normalized_bounds():
    """Verify coordinate bounding boxes strictly reside within [0.0, 1.0]."""
    for provider, wf in [(TBSimulationProvider(), "tb"), (DRSimulationProvider(), "dr")]:
        res = await provider.generate_result(wf)
        for f in res.findings:
            if f.coordinates:
                assert 0.0 <= f.coordinates.x_min < f.coordinates.x_max <= 1.0
                assert 0.0 <= f.coordinates.y_min < f.coordinates.y_max <= 1.0


# 10. API Integration: Full analysis pipeline (/api/v1/analyze)
def test_api_analyze_tb_workflow():
    """Verify POST /api/v1/analyze executes validation and returns simulated TB result."""
    img_bytes = create_in_memory_image(format="JPEG", width=256, height=256)
    response = client.post(
        "/api/v1/analyze",
        data={"workflow": "tb"},
        files={"file": ("cxr.jpg", img_bytes, "image/jpeg")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["workflow"] == "tb"
    assert data["status"] == "completed"
    assert data["is_simulated"] is True
    assert data["provider_type"] == "simulation"
    assert "DEMONSTRATION ONLY" in data["disclaimer"]
    assert len(data["findings"]) >= 1
    # Check technical summary populated from Module 9 inspection
    assert data["technical_summary"] is not None
    assert data["technical_summary"]["width"] == 256
    assert data["technical_summary"]["height"] == 256
    assert data["technical_summary"]["pixel_decoding_status"] == "success"


def test_api_analyze_dr_workflow():
    """Verify POST /api/v1/analyze executes validation and returns simulated DR result."""
    img_bytes = create_in_memory_image(format="PNG", width=180, height=180)
    response = client.post(
        "/api/v1/analyze",
        data={"workflow": "dr"},
        files={"file": ("fundus.png", img_bytes, "image/png")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["workflow"] == "dr"
    assert data["status"] == "completed"
    assert data["is_simulated"] is True
    assert data["provider_type"] == "simulation"
    assert data["technical_summary"]["format"] == "png"


def test_api_analyze_alias_route():
    """Verify alias route /api/analyze behaves identically."""
    img_bytes = create_in_memory_image(format="PNG", width=80, height=80)
    response = client.post(
        "/api/analyze",
        data={"workflow": "tb"},
        files={"file": ("cxr.png", img_bytes, "image/png")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["workflow"] == "tb"
    assert data["is_simulated"] is True


# 11. API Integration: Direct simulation endpoint (/api/v1/results/simulate)
def test_api_direct_simulate_endpoint():
    """Verify direct simulation route without file payload."""
    response = client.post(
        "/api/v1/results/simulate",
        data={"workflow": "dr"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["workflow"] == "dr"
    assert data["is_simulated"] is True
    assert data["technical_summary"] is None
    assert len(data["findings"]) >= 1


# 12. Consistent Error Responses on /api/v1/analyze
def test_api_analyze_unsupported_workflow_rejected():
    """Verify unsupported workflow returns 400 INVALID_WORKFLOW."""
    img_bytes = create_in_memory_image()
    response = client.post(
        "/api/v1/analyze",
        data={"workflow": "neurology"},
        files={"file": ("scan.jpg", img_bytes, "image/jpeg")},
    )
    assert response.status_code == 400
    data = response.json()
    assert data["detail"]["code"] == "INVALID_WORKFLOW"


def test_api_analyze_missing_file_rejected():
    """Verify missing file parameter returns 400 MISSING_FILE."""
    response = client.post(
        "/api/v1/analyze",
        data={"workflow": "tb"},
    )
    assert response.status_code == 400
    data = response.json()
    assert data["detail"]["code"] == "MISSING_FILE"


def test_api_analyze_corrupt_file_rejected():
    """Verify corrupt image data returns 400 CORRUPTED_IMAGE."""
    response = client.post(
        "/api/v1/analyze",
        data={"workflow": "tb"},
        files={"file": ("corrupt.jpg", b"NOT_AN_IMAGE", "image/jpeg")},
    )
    assert response.status_code == 400
    data = response.json()
    assert data["detail"]["code"] == "CORRUPTED_IMAGE"


def test_api_analyze_oversized_file_rejected():
    """Verify file exceeding 10 MB returns 413 FILE_TOO_LARGE."""
    oversized = b"0" * (settings.max_upload_size_bytes + 1024)
    response = client.post(
        "/api/v1/analyze",
        data={"workflow": "tb"},
        files={"file": ("huge.jpg", oversized, "image/jpeg")},
    )
    assert response.status_code == 413
    data = response.json()
    assert data["detail"]["code"] == "FILE_TOO_LARGE"


def test_api_analyze_pixel_limit_exceeded_rejected():
    """Verify image exceeding max_decoded_pixels (25 MP) returns 413 PIXEL_LIMIT_EXCEEDED."""
    buf = io.BytesIO()
    img = Image.new("1", (6000, 5000), color=0)
    img.save(buf, format="PNG")
    response = client.post(
        "/api/v1/analyze",
        data={"workflow": "tb"},
        files={"file": ("30mp.png", buf.getvalue(), "image/png")},
    )
    assert response.status_code == 413
    data = response.json()
    assert data["detail"]["code"] == "PIXEL_LIMIT_EXCEEDED"


def test_api_analyze_truncated_image_rejected():
    """Verify truncated image returns 400 DECODING_FAILED."""
    valid_bytes = create_in_memory_image(format="JPEG", width=128, height=128)
    truncated = valid_bytes[:-20]
    response = client.post(
        "/api/v1/analyze",
        data={"workflow": "dr"},
        files={"file": ("trunc.jpg", truncated, "image/jpeg")},
    )
    assert response.status_code == 400
    data = response.json()
    assert data["detail"]["code"] == "DECODING_FAILED"


# 13. Clean Extension Point: Pluggable provider registration
def test_future_model_provider_registration():
    """Verify external / future model providers can be registered via extension point."""
    class FutureTBModelProvider(BaseResultsProvider):
        @property
        def provider_type(self) -> str:
            return "model"

        @property
        def is_simulated(self) -> bool:
            return False

        async def generate_result(self, workflow: str, technical_metadata=None):
            return ScreeningResultResponse(
                result_id="future_model_001",
                workflow="tb",
                status="completed",
                provider_type=self.provider_type,
                is_simulated=self.is_simulated,
                disclaimer="Model inference demonstration",
                technical_summary=technical_metadata,
                findings=[],
                generated_at=datetime.utcnow().isoformat(),
            )

    # Register custom provider
    register_results_provider("tb_model_demo", FutureTBModelProvider)
    resolved = get_results_provider("tb_model_demo")
    assert isinstance(resolved, FutureTBModelProvider)
    assert resolved.provider_type == "model"
    assert resolved.is_simulated is False


# 14. Resource cleanup: No persistent files created
def test_no_persistent_files_created_by_analysis():
    """Verify /api/v1/analyze leaves no temporary or uploaded files on disk."""
    initial_files = set(os.listdir("."))
    img_bytes = create_in_memory_image(format="PNG", width=64, height=64)
    response = client.post(
        "/api/v1/analyze",
        data={"workflow": "tb"},
        files={"file": ("test.png", img_bytes, "image/png")},
    )
    assert response.status_code == 200
    after_files = set(os.listdir("."))
    diff = after_files - initial_files
    artifacts = [f for f in diff if f.endswith((".png", ".jpg", ".tmp", ".dat"))]
    assert len(artifacts) == 0, f"Detected leaked files on disk: {artifacts}"


# 15. Six Predefined Educational Visualization Scenarios
@pytest.mark.anyio
async def test_all_six_educational_scenarios():
    """Verify each of the 6 predefined educational scenarios can be generated correctly."""
    provider = TBSimulationProvider()
    expected_counts = [2, 4, 2, 3, 3, 0]  # Scenario 1..6 marker counts

    for i in range(1, 7):
        res = await provider.generate_result("tb", scenario=i)
        assert res.workflow == "tb"
        assert res.is_simulated is True
        assert res.scenario_id == f"scenario_{i}"
        assert res.scenario_name is not None
        assert len(res.findings) == expected_counts[i - 1], f"Scenario {i} expected {expected_counts[i-1]} findings"

        # Verify findings attributes
        for finding in res.findings:
            assert finding.is_educational_reference is True
            assert finding.category in {"reference", "inspection", "highlighted"}
            if finding.coordinates:
                assert 0.0 <= finding.coordinates.x_min < finding.coordinates.x_max <= 1.0
                assert 0.0 <= finding.coordinates.y_min < finding.coordinates.y_max <= 1.0


def test_api_scenario_selection_query_param():
    """Verify POST /api/v1/analyze respects the scenario form parameter."""
    img_bytes = create_in_memory_image(format="JPEG", width=256, height=256)

    # Request Scenario 6 (Baseline, 0 markers)
    res_empty = client.post(
        "/api/v1/analyze",
        data={"workflow": "tb", "scenario": 6},
        files={"file": ("cxr.jpg", img_bytes, "image/jpeg")},
    )
    assert res_empty.status_code == 200
    data_empty = res_empty.json()
    assert data_empty["scenario_id"] == "scenario_6"
    assert len(data_empty["findings"]) == 0

    # Request Scenario 2 (Quad-Zone, 4 markers)
    res_quad = client.post(
        "/api/v1/analyze",
        data={"workflow": "tb", "scenario": 2},
        files={"file": ("cxr.jpg", img_bytes, "image/jpeg")},
    )
    assert res_quad.status_code == 200
    data_quad = res_quad.json()
    assert data_quad["scenario_id"] == "scenario_2"
    assert len(data_quad["findings"]) == 4
    categories = {f["category"] for f in data_quad["findings"]}
    assert "highlighted" in categories
    assert "inspection" in categories
    assert "reference" in categories

