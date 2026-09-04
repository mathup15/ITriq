"""Pydantic schemas: request/response shapes and validation rules."""
from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, ConfigDict


class Category(str, Enum):
    hardware = "Hardware"
    software = "Software"
    network = "Network"
    account_access = "Account Access"
    security = "Security"
    other = "Other"


class Priority(str, Enum):
    low = "Low"
    medium = "Medium"
    high = "High"
    critical = "Critical"


class Status(str, Enum):
    open = "Open"
    in_progress = "In Progress"
    resolved = "Resolved"


class TicketCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    title: str = Field(..., min_length=5, max_length=150)
    description: str = Field(..., min_length=10, max_length=1000)


class TicketUpdate(BaseModel):
    """All fields optional: PUT applies whichever fields are provided."""
    category: Optional[Category] = None
    priority: Optional[Priority] = None
    status: Optional[Status] = None
    human_approved: Optional[bool] = None


class TicketResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    title: str
    description: str
    category: Optional[Category] = None
    priority: Optional[Priority] = None
    ai_category: Optional[Category] = None
    ai_priority: Optional[Priority] = None
    ai_summary: Optional[str] = None
    status: Status
    human_approved: bool
    created_at: datetime
    updated_at: datetime


class DashboardStats(BaseModel):
    total_tickets: int
    open_tickets: int
    in_progress_tickets: int
    resolved_tickets: int
    by_category: dict[str, int]
    by_priority: dict[str, int]
    pending_ai_approval: int
