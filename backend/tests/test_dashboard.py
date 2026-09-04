"""Dashboard and ticket listing tests (owned by Member 3 - features/dashboard).

Tests:
1. Get tickets
2. Get dashboard statistics
3. Search tickets
4. Filter tickets
5. Empty ticket list
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.models import Ticket
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
    Base.metadata.create_all(bind=engine)
    prev = app.dependency_overrides.get(get_db)
    app.dependency_overrides[get_db] = override_get_db
    yield
    Base.metadata.drop_all(bind=engine)
    if prev is not None:
        app.dependency_overrides[get_db] = prev
    else:
        app.dependency_overrides.pop(get_db, None)


client = TestClient(app)


def create_sample_tickets():
    """Helper to populate database with distinct tickets for testing."""
    db = TestingSessionLocal()
    try:
        sample_data = [
            Ticket(
                name="Alice Walker",
                email="alice@example.com",
                title="Office WiFi not working",
                description="WiFi disconnects every 5 minutes in conference room.",
                category="Network",
                priority="High",
                status="Open",
            ),
            Ticket(
                name="Bob Smith",
                email="bob@example.com",
                title="Laptop running slowly",
                description="Boot takes 20 minutes and system lag is severe.",
                category="Hardware",
                priority="Low",
                status="In Progress",
            ),
            Ticket(
                name="Charlie Brown",
                email="charlie@example.com",
                title="Email account inaccessible",
                description="Cannot log into Outlook email on browser or phone.",
                category="Account Access",
                priority="Medium",
                status="Resolved",
            ),
            Ticket(
                name="Diana Prince",
                email="diana@example.com",
                title="Suspicious email received",
                description="Received fake invoice asking for credit card details.",
                category="Security",
                priority="Critical",
                status="Open",
            ),
            Ticket(
                name="Evan Wright",
                email="evan@example.com",
                title="Microsoft Word crashing",
                description="Word application crashes when saving large documents.",
                category="Software",
                priority="High",
                status="In Progress",
            ),
        ]
        for t in sample_data:
            db.add(t)
        db.commit()
    finally:
        db.close()


# 1. Test Get tickets
def test_get_tickets():
    create_sample_tickets()
    response = client.get("/api/tickets")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 5
    # Verify expected fields
    ticket = data[0]
    assert "id" in ticket
    assert "title" in ticket
    assert "category" in ticket
    assert "priority" in ticket
    assert "status" in ticket
    assert "created_at" in ticket


# 2. Test Get dashboard statistics
def test_get_dashboard_stats():
    create_sample_tickets()
    response = client.get("/api/dashboard/stats")
    assert response.status_code == 200
    stats = response.json()

    # Verify calculated stats match our sample dataset:
    # Total = 5
    # Open = 2 (Alice, Diana)
    # In Progress = 2 (Bob, Evan)
    # Resolved = 1 (Charlie)
    # High Priority (High + Critical) = 3 (Alice=High, Diana=Critical, Evan=High)
    assert stats["total"] == 5
    assert stats["open"] == 2
    assert stats["in_progress"] == 2
    assert stats["resolved"] == 1
    assert stats["high_priority"] == 3

    # Backward compatibility with total_tickets
    assert stats["total_tickets"] == 5
    assert stats["open_tickets"] == 2


# 3. Test Search tickets
def test_search_tickets():
    create_sample_tickets()

    # Search by title keyword (e.g. 'wifi')
    res_wifi = client.get("/api/tickets?search=wifi")
    assert res_wifi.status_code == 200
    data_wifi = res_wifi.json()
    assert len(data_wifi) == 1
    assert data_wifi[0]["title"] == "Office WiFi not working"

    # Search by description keyword
    res_desc = client.get("/api/tickets?search=conference")
    assert res_desc.status_code == 200
    data_desc = res_desc.json()
    assert len(data_desc) == 1
    assert data_desc[0]["name"] == "Alice Walker"

    # Search by submitter name
    res_name = client.get("/api/tickets?search=Diana")
    assert res_name.status_code == 200
    data_name = res_name.json()
    assert len(data_name) == 1
    assert data_name[0]["title"] == "Suspicious email received"

    # Search by submitter email
    res_email = client.get("/api/tickets?search=bob@example.com")
    assert res_email.status_code == 200
    data_email = res_email.json()
    assert len(data_email) == 1
    assert data_email[0]["title"] == "Laptop running slowly"

    # Search with no match
    res_nomatch = client.get("/api/tickets?search=nonexistentterm123")
    assert res_nomatch.status_code == 200
    assert len(res_nomatch.json()) == 0


# 4. Test Filter tickets
def test_filter_tickets():
    create_sample_tickets()

    # Filter by category
    res_cat = client.get("/api/tickets?category=Network")
    assert res_cat.status_code == 200
    assert len(res_cat.json()) == 1
    assert res_cat.json()[0]["category"] == "Network"

    # Filter by priority
    res_pri = client.get("/api/tickets?priority=High")
    assert res_pri.status_code == 200
    assert len(res_pri.json()) == 2
    for t in res_pri.json():
        assert t["priority"] == "High"

    # Filter by status
    res_status = client.get("/api/tickets?status=In Progress")
    assert res_status.status_code == 200
    assert len(res_status.json()) == 2
    for t in res_status.json():
        assert t["status"] == "In Progress"

    # Combined filters
    res_comb = client.get("/api/tickets?category=Software&status=In Progress&priority=High")
    assert res_comb.status_code == 200
    data_comb = res_comb.json()
    assert len(data_comb) == 1
    assert data_comb[0]["title"] == "Microsoft Word crashing"

    # Filter with 'All' option should not restrict results
    res_all = client.get("/api/tickets?category=All&priority=All&status=All")
    assert res_all.status_code == 200
    assert len(res_all.json()) == 5


# 5. Test Empty ticket list
def test_empty_ticket_list():
    # Verify ticket list is empty
    res_list = client.get("/api/tickets")
    assert res_list.status_code == 200
    assert res_list.json() == []

    # Verify search on empty returns empty
    res_search = client.get("/api/tickets?search=wifi")
    assert res_search.status_code == 200
    assert res_search.json() == []

    # Verify stats on empty DB
    res_stats = client.get("/api/dashboard/stats")
    assert res_stats.status_code == 200
    stats = res_stats.json()
    assert stats["total"] == 0
    assert stats["open"] == 0
    assert stats["in_progress"] == 0
    assert stats["resolved"] == 0
    assert stats["high_priority"] == 0
