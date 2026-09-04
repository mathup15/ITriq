"""Dashboard stats route (owned by Member 3 - features/dashboard).

GET /api/dashboard/stats
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Ticket
from app.schemas import DashboardStats

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
def get_stats(db: Session = Depends(get_db)):
    tickets = db.query(Ticket).all()

    by_category: dict[str, int] = {}
    by_priority: dict[str, int] = {}

    for ticket in tickets:
        if ticket.category:
            by_category[ticket.category] = by_category.get(ticket.category, 0) + 1
        if ticket.priority:
            by_priority[ticket.priority] = by_priority.get(ticket.priority, 0) + 1

    return DashboardStats(
        total_tickets=len(tickets),
        open_tickets=sum(1 for t in tickets if t.status == "Open"),
        in_progress_tickets=sum(1 for t in tickets if t.status == "In Progress"),
        resolved_tickets=sum(1 for t in tickets if t.status == "Resolved"),
        by_category=by_category,
        by_priority=by_priority,
        pending_ai_approval=sum(1 for t in tickets if t.ai_summary and not t.human_approved),
    )
