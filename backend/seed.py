"""Seed the database with sample tickets for demo purposes (owned by Member 3).

Usage: python seed.py
"""
from app.database import Base, SessionLocal, engine
from app.models import Ticket

Base.metadata.create_all(bind=engine)

SAMPLE_TICKETS = [
    {
        "name": "John Perera",
        "email": "john@example.com",
        "title": "WiFi not working in office",
        "description": "Cannot connect to office WiFi since this morning, other devices seem fine.",
        "category": "Network",
        "priority": "High",
        "ai_category": "Network",
        "ai_priority": "High",
        "ai_summary": "Office WiFi connectivity issue",
        "status": "Open",
        "human_approved": True,
    },
    {
        "name": "Nimali Silva",
        "email": "nimali@example.com",
        "title": "Cannot log into email account",
        "description": "Password reset link is not arriving in my inbox, tried three times.",
        "category": "Account Access",
        "priority": "Medium",
        "ai_category": "Account Access",
        "ai_priority": "Medium",
        "ai_summary": "Password reset email not received",
        "status": "In Progress",
        "human_approved": True,
    },
    {
        "name": "Kasun Fernando",
        "email": "kasun@example.com",
        "title": "Laptop screen flickering",
        "description": "Screen flickers randomly and sometimes goes black for a few seconds.",
        "category": "Hardware",
        "priority": "Medium",
        "ai_category": "Hardware",
        "ai_priority": "Medium",
        "ai_summary": "Laptop screen flickering intermittently",
        "status": "Open",
        "human_approved": False,
    },
    {
        "name": "Dilani Jayasuriya",
        "email": "dilani@example.com",
        "title": "Suspicious phishing email received",
        "description": "Received an email asking to confirm bank details, looks like phishing.",
        "category": "Security",
        "priority": "Critical",
        "ai_category": "Security",
        "ai_priority": "Critical",
        "ai_summary": "Possible phishing email reported",
        "status": "Resolved",
        "human_approved": True,
    },
    {
        "name": "Ruwan Bandara",
        "email": "ruwan@example.com",
        "title": "Accounting software crashes on export",
        "description": "The accounting app crashes every time I try to export a report to PDF.",
        "category": "Software",
        "priority": "High",
        "ai_category": "Software",
        "ai_priority": "High",
        "ai_summary": "Accounting software crashes on PDF export",
        "status": "Open",
        "human_approved": False,
    },
]


def seed():
    db = SessionLocal()
    try:
        if db.query(Ticket).count() > 0:
            print("Tickets already exist, skipping seed.")
            return

        for data in SAMPLE_TICKETS:
            db.add(Ticket(**data))
        db.commit()
        print(f"Seeded {len(SAMPLE_TICKETS)} tickets.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
