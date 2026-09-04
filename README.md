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
