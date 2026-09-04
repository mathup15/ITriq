"""Support staff routes for viewing and updating individual tickets."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.database import get_db
from app.routes.tickets import _get_ticket_or_404
from app.schemas import TicketResponse, TicketUpdate

router = APIRouter(prefix="/api/tickets", tags=["ticket management"])


@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket_details(ticket_id: int, db: Session = Depends(get_db)):
    return _get_ticket_or_404(ticket_id, db)


@router.put("/{ticket_id}", response_model=TicketResponse)
def update_ticket(ticket_id: int, payload: dict, db: Session = Depends(get_db)):
    ticket = _get_ticket_or_404(ticket_id, db)

    try:
        validated = TicketUpdate.model_validate(payload)
    except ValidationError as error:
        fields = {str(item["loc"][0]) for item in error.errors() if item["loc"]}
        status_code = 400 if "status" in fields else 422
        raise HTTPException(status_code=status_code, detail=error.errors()) from error

    for field, value in validated.model_dump(exclude_unset=True).items():
        setattr(ticket, field, value)

    db.commit()
    db.refresh(ticket)
    return ticket