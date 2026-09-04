"""Ticket creation tests (owned by Member 1 - features/tickets).

Covers POST /api/tickets: valid creation plus the validation rules for
name, email, title, description, and category. Uses the isolated
in-memory test database from conftest.py, so these tests never touch
supportai.db and never call a real AI API (creation does not invoke
the AI service).
"""
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

VALID_TICKET = {
    "name": "John Perera",
    "email": "john@example.com",
    "title": "WiFi not working in office",
    "description": "Cannot connect to office WiFi since this morning.",
    "category": "Network",
    "device": "Dell Laptop",
    "location": "Colombo Office",
}


def test_valid_ticket_creation():
    response = client.post("/api/tickets", json=VALID_TICKET)
    assert response.status_code == 201

    data = response.json()
    assert data["name"] == VALID_TICKET["name"]
    assert data["email"] == VALID_TICKET["email"]
    assert data["title"] == VALID_TICKET["title"]
    assert data["description"] == VALID_TICKET["description"]
    assert data["category"] == VALID_TICKET["category"]
    assert data["device"] == VALID_TICKET["device"]
    assert data["location"] == VALID_TICKET["location"]
    assert data["status"] == "Open"
    assert data["human_approved"] is False
    assert data["ai_category"] is None
    assert data["ai_priority"] is None
    assert data["ai_summary"] is None


def test_missing_name():
    payload = {**VALID_TICKET}
    del payload["name"]

    response = client.post("/api/tickets", json=payload)
    assert response.status_code == 422


def test_invalid_email():
    response = client.post("/api/tickets", json={**VALID_TICKET, "email": "not-an-email"})
    assert response.status_code == 422


def test_short_title():
    response = client.post("/api/tickets", json={**VALID_TICKET, "title": "Bad"})
    assert response.status_code == 422


def test_short_description():
    response = client.post("/api/tickets", json={**VALID_TICKET, "description": "short"})
    assert response.status_code == 422


def test_invalid_category():
    response = client.post("/api/tickets", json={**VALID_TICKET, "category": "Not A Real Category"})
    assert response.status_code == 422
