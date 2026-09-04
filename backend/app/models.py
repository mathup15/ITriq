"""SQLAlchemy models. One main Ticket table, kept intentionally flat."""
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text

from app.database import Base


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)

    # Human-set (or human-approved) values.
    category = Column(String(50), nullable=True)
    priority = Column(String(20), nullable=True)

    # AI-suggested values, kept separate so the original recommendation is preserved.
    ai_category = Column(String(50), nullable=True)
    ai_priority = Column(String(20), nullable=True)
    ai_summary = Column(Text, nullable=True)

    status = Column(String(20), nullable=False, default="Open")
    human_approved = Column(Boolean, nullable=False, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
