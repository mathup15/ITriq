"""SupportAI backend entry point."""
import os

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routes import dashboard, ticket_management, tickets

# Creates supportai.db and the tickets table on first run if they don't exist.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SupportAI API")

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
ALLOWED_ORIGINS = list({
    FRONTEND_ORIGIN,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
})

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tickets.router)
app.include_router(ticket_management.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {
        "name": "SupportAI API",
        "status": "ok",
        "docs": "/docs",
        "frontend": "http://127.0.0.1:5173/",
    }


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
