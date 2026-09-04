"""AI triage tests (owned by Member 2 - features/ai).

The real AI API is never called here. Unit tests monkeypatch the internal
OpenAI caller to exercise ai_service's validation/fallback logic directly;
endpoint tests monkeypatch app.routes.tickets.analyze_ticket so the
/analyze route never reaches out to a real provider either.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import app.routes.tickets as tickets_route
from app.database import Base, get_db
from app.services import ai_service
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


@pytest.fixture(autouse=True)
def setup_db():
    # Re-applied per test (not just at import time) so this module's engine
    # stays the active one even when test_tickets.py's own module-level
    # override was the last one applied during collection. Restored after
    # each test so test_tickets.py's tests aren't left pointing at this
    # module's (by-then-dropped) tables.
    previous_override = app.dependency_overrides.get(get_db)
    app.dependency_overrides[get_db] = override_get_db
    Base.metadata.create_all(bind=engine)
    try:
        yield
    finally:
        Base.metadata.drop_all(bind=engine)
        if previous_override is not None:
            app.dependency_overrides[get_db] = previous_override
        else:
            app.dependency_overrides.pop(get_db, None)


client = TestClient(app)

VALID_TICKET = {
    "name": "John Perera",
    "email": "john@example.com",
    "title": "WiFi not working",
    "description": "Cannot connect to office WiFi today.",
}


def create_ticket():
    return client.post("/api/tickets", json=VALID_TICKET).json()


# ---------------------------------------------------------------------------
# 1. Valid AI response
# ---------------------------------------------------------------------------

def test_valid_ai_response_is_used_as_is(monkeypatch):
    monkeypatch.setattr(ai_service, "OPENAI_API_KEY", "fake-key")
    monkeypatch.setattr(
        ai_service,
        "_call_openai",
        lambda title, description: {
            "category": "Network",
            "priority": "High",
            "summary": "Office WiFi connectivity issue",
        },
    )

    result = ai_service.analyze_ticket("WiFi down", "Cannot connect to WiFi")

    assert result == {
        "category": "Network",
        "priority": "High",
        "summary": "Office WiFi connectivity issue",
    }


# ---------------------------------------------------------------------------
# 2. Invalid AI category
# ---------------------------------------------------------------------------

def test_invalid_ai_category_falls_back_to_other(monkeypatch):
    monkeypatch.setattr(ai_service, "OPENAI_API_KEY", "fake-key")
    monkeypatch.setattr(
        ai_service,
        "_call_openai",
        lambda title, description: {
            "category": "Not A Real Category",
            "priority": "High",
            "summary": "Something broke",
        },
    )

    result = ai_service.analyze_ticket("Issue", "Something is broken")

    assert result["category"] == "Other"
    assert result["priority"] == "High"


# ---------------------------------------------------------------------------
# 3. Invalid AI priority
# ---------------------------------------------------------------------------

def test_invalid_ai_priority_falls_back_to_medium(monkeypatch):
    monkeypatch.setattr(ai_service, "OPENAI_API_KEY", "fake-key")
    monkeypatch.setattr(
        ai_service,
        "_call_openai",
        lambda title, description: {
            "category": "Software",
            "priority": "Super Urgent",
            "summary": "App keeps crashing",
        },
    )

    result = ai_service.analyze_ticket("App crash", "The app keeps crashing")

    assert result["category"] == "Software"
    assert result["priority"] == "Medium"


# ---------------------------------------------------------------------------
# 4. AI API failure
# ---------------------------------------------------------------------------

def test_ai_provider_exception_falls_back_to_mock(monkeypatch):
    monkeypatch.setattr(ai_service, "OPENAI_API_KEY", "fake-key")

    def boom(title, description):
        raise RuntimeError("AI provider unreachable")

    monkeypatch.setattr(ai_service, "_call_openai", boom)

    result = ai_service.analyze_ticket(
        "WiFi not working", "Cannot connect to office WiFi today."
    )

    assert result["category"] in ai_service.VALID_CATEGORIES
    assert result["priority"] in ai_service.VALID_PRIORITIES
    assert result["summary"]


def test_analyze_endpoint_survives_ai_provider_failure(monkeypatch):
    """The ticket must remain usable even when the AI call blows up."""
    monkeypatch.setattr(ai_service, "OPENAI_API_KEY", "fake-key")

    def boom(title, description):
        raise RuntimeError("AI provider unreachable")

    monkeypatch.setattr(ai_service, "_call_openai", boom)

    created = create_ticket()
    response = client.post(f"/api/tickets/{created['id']}/analyze")

    assert response.status_code == 200
    data = response.json()
    assert data["ai_category"] in ai_service.VALID_CATEGORIES
    assert data["ai_priority"] in ai_service.VALID_PRIORITIES
    assert data["ai_summary"]


def test_non_dict_ai_response_does_not_crash(monkeypatch):
    """A malformed (non-object) AI response must not raise."""
    monkeypatch.setattr(ai_service, "OPENAI_API_KEY", "fake-key")
    monkeypatch.setattr(ai_service, "_call_openai", lambda title, description: ["oops"])

    result = ai_service.analyze_ticket("Issue", "Something is broken")

    assert result["category"] in ai_service.VALID_CATEGORIES
    assert result["priority"] in ai_service.VALID_PRIORITIES


# ---------------------------------------------------------------------------
# 5. Human approval
# ---------------------------------------------------------------------------

def test_human_approval_keeps_ai_values(monkeypatch):
    monkeypatch.setattr(
        tickets_route,
        "analyze_ticket",
        lambda title, description: {
            "category": "Software",
            "priority": "Medium",
            "summary": "App crash on export",
        },
    )
    created = create_ticket()
    client.post(f"/api/tickets/{created['id']}/analyze")

    response = client.put(
        f"/api/tickets/{created['id']}",
        json={"category": "Software", "priority": "Medium", "human_approved": True},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["ai_category"] == "Software"
    assert data["ai_priority"] == "Medium"
    assert data["category"] == "Software"
    assert data["priority"] == "Medium"
    assert data["human_approved"] is True


# ---------------------------------------------------------------------------
# 6. Human modification
# ---------------------------------------------------------------------------

def test_human_modification_overrides_final_values_but_keeps_ai_suggestion(monkeypatch):
    monkeypatch.setattr(
        tickets_route,
        "analyze_ticket",
        lambda title, description: {
            "category": "Software",
            "priority": "Medium",
            "summary": "App crash on export",
        },
    )
    created = create_ticket()
    client.post(f"/api/tickets/{created['id']}/analyze")

    response = client.put(
        f"/api/tickets/{created['id']}",
        json={"category": "Network", "priority": "High", "human_approved": True},
    )

    assert response.status_code == 200
    data = response.json()
    # AI's original suggestion must never be overwritten by the human decision.
    assert data["ai_category"] == "Software"
    assert data["ai_priority"] == "Medium"
    # Final human decision differs from the AI suggestion.
    assert data["category"] == "Network"
    assert data["priority"] == "High"
    assert data["human_approved"] is True
