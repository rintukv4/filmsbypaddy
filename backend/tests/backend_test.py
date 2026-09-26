import os
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")


def test_portfolio_returns_six_projects():
    response = requests.get(f"{BASE_URL}/api/portfolio", timeout=15)
    assert response.status_code == 200
    data = response.json()
    assert len(data["projects"]) == 6
    assert {project["slug"] for project in data["projects"]} >= {
        "unmaad-iim-bangalore", "pravega-iisc", "rhapsody-iisc"
    }


def test_enquiry_accepts_valid_payload_and_returns_id():
    payload = {
        "name": "TEST Portfolio Visitor",
        "organization": "TEST Live Events",
        "email": "test-portfolio@example.com",
        "phone": "+919999999999",
        "event_artist": "TEST Festival",
        "event_date": "2026-12-31",
        "event_location": "Bengaluru, venue",
        "coverage": ["Photography"],
        "deliverables": "Edited selects and a short reel",
        "budget": "Let's discuss",
        "website": "",
        "message": "TEST enquiry for regression coverage",
        "honeypot": "",
    }
    response = requests.post(f"{BASE_URL}/api/enquiries", json=payload, timeout=15)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "received"
    assert isinstance(data["id"], str) and len(data["id"]) > 0


def test_enquiry_rejects_missing_required_fields():
    response = requests.post(f"{BASE_URL}/api/enquiries", json={}, timeout=15)
    assert response.status_code == 422
    assert "detail" in response.json()