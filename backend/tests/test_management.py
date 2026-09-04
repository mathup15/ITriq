"""Isolated tests for ticket details and support-staff updates."""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from main import app

engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


client = TestClient(app)
TICKET = {"name": "Management Tester", "email": "manager@example.com", "title": "Cannot access printer", "description": "The office printer is unavailable from my workstation.", "category": "Hardware"}


@pytest.fixture(autouse=True)
def isolated_database():
    previous_override = app.dependency_overrides.get(get_db)
    app.dependency_overrides[get_db] = override_get_db
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    if previous_override:
        app.dependency_overrides[get_db] = previous_override
    else:
        app.dependency_overrides.pop(get_db, None)


def create_ticket():
    response = client.post("/api/tickets", json=TICKET)
    assert response.status_code == 201
    return response.json()["id"]


def test_get_existing_ticket():
    ticket_id = create_ticket()
    response = client.get(f"/api/tickets/{ticket_id}")
    assert response.status_code == 200
    assert response.json()["title"] == TICKET["title"]


def test_ticket_not_found():
    assert client.get("/api/tickets/404404").status_code == 404


def test_update_ticket_fields():
    ticket_id = create_ticket()
    response = client.put(f"/api/tickets/{ticket_id}", json={"category": "Hardware", "priority": "High", "human_approved": True})
    assert response.status_code == 200
    assert response.json()["category"] == "Hardware"
    assert response.json()["priority"] == "High"
    assert response.json()["human_approved"] is True


def test_change_status():
    ticket_id = create_ticket()
    response = client.put(f"/api/tickets/{ticket_id}", json={"status": "Resolved"})
    assert response.status_code == 200
    assert response.json()["status"] == "Resolved"


def test_invalid_status_returns_clear_bad_request():
    ticket_id = create_ticket()
    response = client.put(f"/api/tickets/{ticket_id}", json={"status": "Closed"})
    assert response.status_code == 400
    assert "status" in response.text


def test_invalid_category():
    ticket_id = create_ticket()
    assert client.put(f"/api/tickets/{ticket_id}", json={"category": "Unknown"}).status_code == 422


def test_invalid_priority():
    ticket_id = create_ticket()
    assert client.put(f"/api/tickets/{ticket_id}", json={"priority": "Urgent"}).status_code == 422