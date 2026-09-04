"""Ticket routes (owned by Member 1 - creation/validation, Member 4 - update).

POST   /api/tickets            create a ticket
GET    /api/tickets            list all tickets
GET    /api/tickets/{id}       get one ticket
POST   /api/tickets/{id}/analyze   run AI analysis on a ticket
PUT    /api/tickets/{id}       update category/priority/status/approval
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Ticket
from app.schemas import TicketCreate, TicketResponse, TicketUpdate
from app.services.ai_service import analyze_ticket

router = APIRouter(prefix="/api/tickets", tags=["tickets"])


def _get_ticket_or_404(ticket_id: int, db: Session) -> Ticket:
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@router.post("", response_model=TicketResponse, status_code=201)
def create_ticket(payload: TicketCreate, db: Session = Depends(get_db)):
    ticket = Ticket(
        name=payload.name,
        email=payload.email,
        title=payload.title,
        description=payload.description,
        device=payload.device,
        location=payload.location,
        category=payload.category.value,
        status="Open",
        human_approved=False,
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket


@router.get("", response_model=list[TicketResponse])
def list_tickets(db: Session = Depends(get_db)):
    return db.query(Ticket).order_by(Ticket.created_at.desc()).all()


@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    return _get_ticket_or_404(ticket_id, db)


@router.post("/{ticket_id}/analyze", response_model=TicketResponse)
def analyze(ticket_id: int, db: Session = Depends(get_db)):
    ticket = _get_ticket_or_404(ticket_id, db)

    result = analyze_ticket(ticket.title, ticket.description)

    ticket.ai_category = result["category"]
    ticket.ai_priority = result["priority"]
    ticket.ai_summary = result["summary"]

    # Pre-fill the human-editable fields with the AI suggestion so a
    # reviewer can simply approve, or override before saving.
    if not ticket.category:
        ticket.category = result["category"]
    if not ticket.priority:
        ticket.priority = result["priority"]

    db.commit()
    db.refresh(ticket)
    return ticket


@router.put("/{ticket_id}", response_model=TicketResponse)
def update_ticket(ticket_id: int, payload: TicketUpdate, db: Session = Depends(get_db)):
    ticket = _get_ticket_or_404(ticket_id, db)

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(ticket, field, value.value if hasattr(value, "value") else value)

    db.commit()
    db.refresh(ticket)
    return ticket
