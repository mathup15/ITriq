# SupportAI

**Smarter IT Support. Faster Resolution.**

AI-assisted IT support ticket management for SMEs. Employees submit issues,
AI recommends a category/priority/summary, and support staff review and
resolve tickets.

## Stack

- Frontend: React + Vite + Tailwind CSS + React Router + Axios
- Backend: FastAPI + SQLAlchemy + Pydantic + Uvicorn
- Database: SQLite
- AI: OpenAI or Gemini (called only from the backend, never exposed to the frontend)

## Project structure

```
project-root/
├── backend/
│   ├── app/
│   │   ├── routes/       # tickets.py, dashboard.py
│   │   ├── services/     # ai_service.py
│   │   ├── models.py     # SQLAlchemy Ticket model
│   │   ├── schemas.py    # Pydantic request/response schemas
│   │   └── database.py   # engine/session setup
│   ├── tests/
│   ├── seed.py           # sample ticket data
│   └── main.py           # FastAPI app + CORS
└── frontend/
    └── src/
        ├── features/
        │   ├── tickets/      # submission + detail pages
        │   ├── ai/           # AI-related UI
        │   ├── dashboard/    # dashboard page
        │   └── management/   # ticket update/status UI
        ├── components/       # Navbar, Loading, ErrorMessage, Button, Card
        ├── services/         # api.js (Axios client)
        ├── App.jsx
        └── main.jsx
```

## Getting started

### Backend

```bash
cd backend
python -m venv venv
source venv/Scripts/activate   # Windows Git Bash; use venv\Scripts\activate on cmd
pip install -r requirements.txt
cp .env.example .env
python seed.py                 # optional: adds sample tickets
uvicorn main:app --reload --port 8000
```

Backend runs at `http://localhost:8000`. Health check: `GET /api/health`.

To enable real AI analysis, set `OPENAI_API_KEY` or `GEMINI_API_KEY` in
`backend/.env`. Without a key, `/api/tickets/{id}/analyze` falls back to a
keyword-based mock so the app still works end-to-end.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs at `http://localhost:5173`.

### Tests

```bash
# backend
cd backend && source venv/Scripts/activate && pytest

# frontend
cd frontend && npm run test
```

## API

| Method | Endpoint                     | Description                     |
|--------|-------------------------------|----------------------------------|
| POST   | `/api/tickets`                | Create a ticket                  |
| GET    | `/api/tickets`                | List all tickets                 |
| GET    | `/api/tickets/{id}`           | Get one ticket                   |
| POST   | `/api/tickets/{id}/analyze`   | Run AI analysis on a ticket      |
| PUT    | `/api/tickets/{id}`           | Update category/priority/status/approval |
| GET    | `/api/dashboard/stats`        | Ticket statistics                |

## Team ownership

| Member | Owns |
|--------|------|
| 1 | `features/tickets`, ticket creation backend, validation |
| 2 | `features/ai`, AI service, AI API integration |
| 3 | `features/dashboard`, dashboard API, seed data |
| 4 | `features/management`, ticket update/status API, README/deployment |

Only Member 1 should modify `App.jsx` and routing initially.
