# SupportAI

SupportAI is an AI-assisted IT support ticket system for small and medium-sized teams.

## Problem and solution

IT requests are often unstructured and slow to triage. Employees submit a ticket once, SupportAI recommends a category, priority, and summary, and support staff review the recommendation and track resolution.

## Main features

- Ticket submission and validation
- AI category, priority, and summary recommendations
- Ticket details and human approval view
- Status management: Open, In Progress, Resolved
- Dashboard statistics

## Technology and architecture

The frontend uses React, Vite, Tailwind CSS, React Router, and Axios. The backend uses FastAPI, SQLAlchemy, Pydantic, and Uvicorn. SQLite stores a flat `tickets` table. The frontend calls the REST API; AI keys remain on the backend and are never sent to the browser.

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/tickets` | Create a ticket |
| GET | `/api/tickets` | List tickets |
| GET | `/api/tickets/{id}` | View ticket details |
| PUT | `/api/tickets/{id}` | Update category, priority, status, or approval |
| POST | `/api/tickets/{id}/analyze` | Generate AI recommendations |
| GET | `/api/dashboard/stats` | View dashboard statistics |
| GET | `/api/health` | Health check |

## Installation and running

Backend (Windows PowerShell):

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn main:app --reload --port 8000
```

Frontend:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Use `python seed.py` from `backend` to load sample data. Run `npm run build` for the production frontend build.

## Testing

```powershell
cd backend; python -m pytest
cd frontend; npm run test
```

## Ticket submission (`features/tickets`)

Employees submit issues from `/submit` (`SubmitTicket.jsx` + `TicketForm.jsx`,
posting via `ticketApi.js`). Fields:

| Field       | Required | Rules                                  |
|-------------|----------|------------------------------------------|
| Name        | Yes      | 2–100 characters                         |
| Email       | Yes      | Valid email address                      |
| Issue Title | Yes      | 5–150 characters                         |
| Description | Yes      | 10–1000 characters                       |
| Category    | Yes      | One of: Hardware, Software, Network, Account Access, Security, Other |
| Device      | No       | Free text                                |
| Location    | No       | Free text                                |

Validation runs on the frontend (inline messages under each field) and is
re-checked by the backend (`TicketCreate` in `schemas.py`, returns `422` with
details on failure). On success, the ticket is created with `status="Open"`,
`human_approved=false`, and `ai_category`/`ai_priority`/`ai_summary` left
`null` until AI analysis runs (`features/ai`). The submitter's chosen
category is stored as the ticket's `category` right away; `ai_category` is
a separate, independent AI suggestion filled in later.

## API

| Method | Endpoint                     | Description                     |
|--------|-------------------------------|----------------------------------|
| POST   | `/api/tickets`                | Create a ticket                  |
| GET    | `/api/tickets`                | List tickets (supports `?search=wifi&category=Network&priority=High&status=Open`) |
| GET    | `/api/tickets/{id}`           | Get one ticket                   |
| POST   | `/api/tickets/{id}/analyze`   | Run AI analysis on a ticket      |
| PUT    | `/api/tickets/{id}`           | Update category/priority/status/approval |
| GET    | `/api/dashboard/stats`        | Ticket statistics (total, open, in_progress, resolved, high_priority) |

### Dashboard Statistics (`GET /api/dashboard/stats`)

Returns aggregated counts calculated from the database:

```json
{
  "total": 25,
  "open": 12,
  "in_progress": 5,
  "resolved": 8,
  "high_priority": 5
}
```

### Ticket Search & Filtering (`GET /api/tickets`)

Supports query parameters:
- `search`: Search across title, description, user name, and email (e.g. `?search=wifi`)
- `category`: Filter by `Hardware`, `Software`, `Network`, `Account Access`, `Security`, `Other`
- `priority`: Filter by `Low`, `Medium`, `High`, `Critical`
- `status`: Filter by `Open`, `In Progress`, `Resolved`

### Sample Seed Data (`backend/seed.py`)

Run `python seed.py` to populate the database with 8 realistic IT support tickets spanning diverse categories, priorities, and statuses. The seed operation is idempotent and checks for existing entries to avoid duplicate records.

```bash
cd backend
python seed.py
```

### Member 3 Dashboard Components (`frontend/src/features/dashboard`)

- `Dashboard.jsx`: Main SaaS command center view with header, state management, and debounced filters.
- `StatCards.jsx`: 5 key performance metric cards (Total, Open, In Progress, Resolved, High Priority).
- `TicketFilters.jsx`: Real-time search bar and dropdown filter controls.
- `TicketList.jsx`: Responsive support ticket listing with status/priority badges and navigation to `/tickets/:id`.
- `dashboardApi.js`: API client functions for dashboard stats and filtered ticket querying.

## AI triage feature

When a ticket is submitted, `POST /api/tickets/{id}/analyze` sends its title
and description to `ai_service.analyze_ticket` (OpenAI/Gemini, or a
keyword-based mock if no key is set). The response is validated against the
allowed categories/priorities before being saved as `ai_category`,
`ai_priority`, and `ai_summary` on the ticket.

The AI's suggestion is never the final word — it only pre-fills `category`
and `priority` if they're still empty. A human reviewer must:

- **Approve** — saves the AI's category/priority as the final decision and
  sets `human_approved = true`.
- **Modify** — lets the reviewer pick a different category/priority before
  saving, still setting `human_approved = true`.

Either way, `ai_category`/`ai_priority`/`ai_summary` are never overwritten,
so the ticket always shows both the original AI recommendation and the
final human decision. This UI lives in `frontend/src/features/ai/`
(`AIRecommendation.jsx`, `ApprovalPanel.jsx`, `aiApi.js`), wired into
`features/tickets/TicketDetailPage.jsx`.

**Failure handling:** if the AI call throws (bad key, network error, rate
limit, malformed response), `analyze_ticket` catches it and falls back to
the keyword-based mock rather than failing the request — a ticket can
always be triaged, by AI or manually, and the backend never crashes because
an AI provider is unavailable.

## Team ownership

| Member | Owns |
|--------|------|
| 1 | `features/tickets`, ticket creation backend, validation |
| 2 | `features/ai`, AI service, AI API integration |
| 3 | `features/dashboard`, dashboard API, seed data |
| 4 | `features/management`, ticket update/status API, README/deployment |

Only Member 1 should modify `App.jsx` and routing initially.
## Environment variables and deployment

Backend `.env` supports `DATABASE_URL`, `FRONTEND_ORIGIN`, `OPENAI_API_KEY`, and `GEMINI_API_KEY`. Keep `.env` files out of version control. CORS uses `FRONTEND_ORIGIN`.

Deploy the frontend to Vercel with `VITE_API_BASE_URL` set to the deployed Render backend URL. Deploy the backend to Render with build command `pip install -r requirements.txt` and start command `uvicorn main:app --host 0.0.0.0 --port $PORT`, plus the backend environment variables.

## Team contributions

| Member | Contribution |
| --- | --- |
| 1 | Ticket creation and validation |
| 2 | AI service and integration |
| 3 | Dashboard and seed data |
| 4 | Ticket details, status management, testing, documentation, and deployment support |
