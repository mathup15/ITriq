"""Seed the database with sample tickets for demo purposes (owned by Member 3).

Usage: python seed.py [--force]
"""
import sys
from app.database import Base, SessionLocal, engine
from app.models import Ticket

Base.metadata.create_all(bind=engine)

SAMPLE_TICKETS = [
    {
        "name": "John Perera",
        "email": "john@example.com",
        "title": "Office WiFi not working",
        "description": "Cannot connect to the primary office WiFi network from meeting room 3. Signal drops constantly.",
        "category": "Network",
        "priority": "High",
        "ai_category": "Network",
        "ai_priority": "High",
        "ai_summary": "Office WiFi connectivity issue in meeting room 3",
        "status": "Open",
        "human_approved": True,
    },
    {
        "name": "Sarah Jenkins",
        "email": "sarah.j@example.com",
        "title": "Laptop running slowly",
        "description": "My MacBook takes over 15 minutes to boot and applications freeze frequently when multitasking.",
        "category": "Hardware",
        "priority": "Low",
        "ai_category": "Hardware",
        "ai_priority": "Low",
        "ai_summary": "Slow system performance and boot latency",
        "status": "Open",
        "human_approved": False,
    },
    {
        "name": "Nimali Silva",
        "email": "nimali@example.com",
        "title": "Email account inaccessible",
        "description": "Locked out of corporate Outlook account after multiple failed password attempts. Password reset link is not arriving.",
        "category": "Account Access",
        "priority": "Medium",
        "ai_category": "Account Access",
        "ai_priority": "Medium",
        "ai_summary": "Account lockout and missing password reset link",
        "status": "In Progress",
        "human_approved": True,
    },
    {
        "name": "Alex Wong",
        "email": "alex.wong@example.com",
        "title": "Printer not working",
        "description": "Second-floor color printer shows a paper jam error, but the paper tray is completely clear.",
        "category": "Hardware",
        "priority": "Low",
        "ai_category": "Hardware",
        "ai_priority": "Low",
        "ai_summary": "Phantom paper jam on second-floor printer",
        "status": "Resolved",
        "human_approved": True,
    },
    {
        "name": "Dilani Jayasuriya",
        "email": "dilani@example.com",
        "title": "Suspicious email received",
        "description": "Received an urgent email purporting to be from our CEO asking for wire transfer verification to an unfamiliar offshore account.",
        "category": "Security",
        "priority": "Critical",
        "ai_category": "Security",
        "ai_priority": "Critical",
        "ai_summary": "Potential executive impersonation and phishing attempt",
        "status": "Open",
        "human_approved": True,
    },
    {
        "name": "Ruwan Bandara",
        "email": "ruwan@example.com",
        "title": "Microsoft Word crashing",
        "description": "Microsoft Word crashes with an unhandled exception every time I try to save or export documents with embedded tables.",
        "category": "Software",
        "priority": "Medium",
        "ai_category": "Software",
        "ai_priority": "Medium",
        "ai_summary": "MS Word crash during document save/export",
        "status": "In Progress",
        "human_approved": False,
    },
    {
        "name": "Marcus Vance",
        "email": "marcus.v@example.com",
        "title": "VPN connection failed",
        "description": "Unable to connect to company corporate VPN gateway from home network. Error code 800: Remote connection was not made.",
        "category": "Network",
        "priority": "High",
        "ai_category": "Network",
        "ai_priority": "High",
        "ai_summary": "Remote VPN authentication and connection failure (Error 800)",
        "status": "Open",
        "human_approved": True,
    },
    {
        "name": "Emily Chen",
        "email": "emily.chen@example.com",
        "title": "Computer will not start",
        "description": "Desktop workstation will not power on at all. Power supply LED is completely dead and fans do not spin.",
        "category": "Hardware",
        "priority": "Critical",
        "ai_category": "Hardware",
        "ai_priority": "Critical",
        "ai_summary": "Workstation failure to power on, potential power supply failure",
        "status": "Open",
        "human_approved": False,
    },
]


def seed(force: bool = False):
    db = SessionLocal()
    try:
        existing_count = db.query(Ticket).count()
        if existing_count > 0 and not force:
            print(f"Database already has {existing_count} tickets. Checking for missing sample tickets...")
            added = 0
            for data in SAMPLE_TICKETS:
                exists = db.query(Ticket).filter(Ticket.title == data["title"]).first()
                if not exists:
                    db.add(Ticket(**data))
                    added += 1
            if added > 0:
                db.commit()
                print(f"Added {added} new sample tickets.")
            else:
                print("All sample tickets already present, skipping.")
            return

        for data in SAMPLE_TICKETS:
            exists = db.query(Ticket).filter(Ticket.title == data["title"]).first()
            if not exists:
                db.add(Ticket(**data))
        db.commit()
        print(f"Successfully seeded {len(SAMPLE_TICKETS)} sample tickets.")
    finally:
        db.close()


if __name__ == "__main__":
    force_seed = "--force" in sys.argv
    seed(force=force_seed)
