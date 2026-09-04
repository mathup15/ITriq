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

## API

| Method | Endpoint                     | Description                     |
|--------|-------------------------------|----------------------------------|
| POST   | `/api/tickets`                | Create a ticket                  |
| GET    | `/api/tickets`                | List all tickets                 |
| GET    | `/api/tickets/{id}`           | Get one ticket                   |
| POST   | `/api/tickets/{id}/analyze`   | Run AI analysis on a ticket      |
| PUT    | `/api/tickets/{id}`           | Update category/priority/status/approval |
| GET    | `/api/dashboard/stats`        | Ticket statistics                |

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
