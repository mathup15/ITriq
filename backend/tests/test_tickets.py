"""Smoke tests for the ticket API (extend in features/tickets ownership)."""
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

TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


client = TestClient(app)

VALID_TICKET = {
    "name": "John Perera",
    "email": "john@example.com",
    "title": "WiFi not working",
    "description": "Cannot connect to office WiFi today.",
}


def test_create_ticket():
    response = client.post("/api/tickets", json=VALID_TICKET)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == VALID_TICKET["title"]
    assert data["status"] == "Open"
    assert data["human_approved"] is False


def test_create_ticket_validation_error():
    response = client.post("/api/tickets", json={**VALID_TICKET, "name": "J"})
    assert response.status_code == 422


def test_list_and_get_ticket():
    created = client.post("/api/tickets", json=VALID_TICKET).json()

    listed = client.get("/api/tickets")
    assert listed.status_code == 200
    assert len(listed.json()) == 1

    fetched = client.get(f"/api/tickets/{created['id']}")
    assert fetched.status_code == 200
    assert fetched.json()["id"] == created["id"]


def test_get_ticket_not_found():
    response = client.get("/api/tickets/999")
    assert response.status_code == 404


def test_analyze_ticket():
    created = client.post("/api/tickets", json=VALID_TICKET).json()
    response = client.post(f"/api/tickets/{created['id']}/analyze")
    assert response.status_code == 200
    data = response.json()
    assert data["ai_category"] is not None
    assert data["ai_priority"] is not None
    assert data["ai_summary"] is not None


def test_update_ticket():
    created = client.post("/api/tickets", json=VALID_TICKET).json()
    response = client.put(
        f"/api/tickets/{created['id']}",
        json={"status": "In Progress", "human_approved": True},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "In Progress"
    assert data["human_approved"] is True


def test_dashboard_stats():
    client.post("/api/tickets", json=VALID_TICKET)
    response = client.get("/api/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["total_tickets"] == 1
    assert data["open_tickets"] == 1
