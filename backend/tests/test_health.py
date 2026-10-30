from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check_status_code():
    """Verify that GET /health responds with HTTP 200 OK."""
    response = client.get("/health")
    assert response.status_code == 200


def test_health_check_payload():
    """Verify that GET /health returns expected status and service identity."""
    response = client.get("/health")
    data = response.json()
    assert data.get("status") == "ok"
    assert data.get("service") == "MediScan AI"
    assert "version" in data
    assert "environment" in data


def test_health_check_cors_headers():
    """Verify that CORS headers are present for configured allowed origin."""
    response = client.get(
        "/health",
        headers={"Origin": "http://localhost:5173"},
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"
