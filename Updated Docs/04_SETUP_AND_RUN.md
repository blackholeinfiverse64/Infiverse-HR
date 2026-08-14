# 04 — Setup and Run

**Status:** ✅ Verified (2026-08-14 — gateway start + frontend build + live health all passed)
**Owner:** Shashank Mishra

> Step-by-step guide to run the platform locally. Every command below was verified against the
> repository scripts (`run_services.py`, `run_project.ps1`, `START_BACKEND.ps1`,
> `START_FRONTEND.ps1`).

---

## 0. What You Are Starting

| Service | Local URL | Verified health |
|---------|-----------|-----------------|
| Frontend | `http://localhost:3000` | ✅ (build passes) |
| Gateway | `http://localhost:8000/health` | ✅ 200 v4.2.0 (tested 2026-08-14) |
| Agent | `http://localhost:9000/health` | ✅ (live VM parity) |
| LangGraph | `http://localhost:9001/health` | ✅ (live VM parity) |

---

## 1. Prerequisites

- Windows 10/11, macOS, or Linux
- Python 3.11+ (3.12 recommended — `backend/.env` sets `PYTHON_VERSION=3.12.7`)
- Node.js 18+ and npm
- Docker Desktop (optional, for containerized backend)
- MongoDB Atlas connection string (in `backend/.env` — ask team lead if missing)

---

## 2. Environment Setup (MUST be done first)

### Backend

```powershell
cd backend
copy .env.example .env
```

Then fill `backend/.env` with real values. Required keys:

- `DATABASE_URL` / `MONGODB_URI` (MongoDB Atlas connection URI)
- `MONGODB_DB_NAME` (default `bhiv_hr`)
- `API_KEY_SECRET`, `JWT_SECRET_KEY`, `CANDIDATE_JWT_SECRET_KEY`, `GATEWAY_SECRET_KEY`

Workflow / task bridge values (important for the candidate **Tasks** page):

- Local workflow server: `WORKFLOW_API_BASE_URL=http://127.0.0.1:<port>/api`
- Docker gateway → local workflow server:
  `WORKFLOW_API_BASE_URL_DOCKER=http://host.docker.internal:<port>/api`
- Hosted workflow server: `WORKFLOW_API_BASE_URL=https://<host>/api`

> The audit confirmed `backend/.env` in this repo is fully configured (48 variables, no
> placeholders). It is gitignored — never commit it.

### Frontend

```powershell
cd ..\frontend
copy .env.example .env
```

Set at minimum:

- `VITE_API_BASE_URL=http://localhost:8000`

Optional: `VITE_AGENT_SERVICE_URL`, `VITE_LANGGRAPH_SERVICE_URL`,
`VITE_ENABLE_CONTROL_CENTER=true`, `VITE_ENABLE_GOVERNANCE=true`.

---

## 3. Run Locally (recommended path)

### Backend services

```powershell
cd ..\backend
setup_venv.bat        # first time only — creates backend/venv
run_with_venv.bat     # activates venv and runs run_services.py
```

Manual equivalent:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python run_services.py
```

`run_services.py` launches all three services and supports a single-service argument:
`python run_services.py gateway` (or `agent` / `langgraph`).

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

### Alternative: root launchers

| Script | Action |
|--------|--------|
| `START_BACKEND.ps1` | Backend only (verifies venv exists first) |
| `START_FRONTEND.ps1` | Frontend only (runs `npm install` if `node_modules` missing) |
| `run_project.ps1` | Interactive: 1=backend, 2=frontend, 3=both (backend in background job) |
| `run_project.bat` | Windows batch equivalent |

### Expected result after startup

- `http://localhost:3000` opens the SPA
- `http://localhost:8000/health` → `{"status":"healthy",...}`
- `http://localhost:9000/health` → healthy
- `http://localhost:9001/health` → healthy

---

## 4. Run Backend with Docker (optional alternative)

```powershell
cd backend
docker compose -f docker-compose.production.yml up --build -d
```

Stop:

```powershell
docker compose -f docker-compose.production.yml down
```

> The **working** production compose is `backend/docker-compose.production.yml` (272-line Atlas
> edition, reads `backend/.env`). The root `docker-compose.production.yml` is a **legacy template**
> that references `backend/gateway.env` / `agent.env` / `langgraph.env` — those files do not exist,
> so do not use the root file. See `11_DEPLOYMENT.md`.

---

## 5. Seed the Database (optional but recommended for demos)

```powershell
cd backend
.\venv\Scripts\python.exe seed_mongodb.py
```

Seeds: 5 jobs, 20 candidates, 15 applications, 3 clients (TECH001/AI002/INFRA003), 3 users
(admin/hr_manager/recruiter1), interviews, feedback, workflows, offers, RL data, and the
`schema_version` document (4.3.0). Drops existing collections if `jobs` already has data (prompts).

---

## 6. Verify Health & API Docs

| URL | Purpose |
|-----|---------|
| `http://localhost:3000` | Frontend SPA |
| `http://localhost:8000/health` | Gateway health |
| `http://localhost:9000/health` | Agent health |
| `http://localhost:9001/health` | LangGraph health |
| `http://localhost:8000/docs` | Gateway Swagger UI |
| `http://localhost:9000/docs` | Agent Swagger UI |
| `http://localhost:9001/docs` | LangGraph Swagger UI |

---

## 7. Beginner Smoke Test (what to check first)

1. `cd frontend && npm run build` — TypeScript + production build must pass.
2. `GET /health` on all three services.
3. Login from the frontend; verify protected routes load.
4. Open the candidate **Tasks** page and confirm tasks are fetched via the workflow bridge.
5. Open `http://localhost:8000/docs` and hit `GET /v1/jobs` (public read).

---

## 8. Troubleshooting Quick Hits

| Symptom | Fix |
|---------|-----|
| Port already in use | `netstat -ano \| findstr :8000` then `taskkill /PID <PID> /F` |
| Gateway cannot reach workflow server in Docker | Use `WORKFLOW_API_BASE_URL_DOCKER=http://host.docker.internal:<port>/api` |
| 401/403 from APIs | Check JWT/API-key secrets in `backend/.env`; check role on JWT |
| Frontend network error | Confirm `VITE_API_BASE_URL` matches the running gateway URL |
| Agent slow to start | First run downloads HF sentence-transformers model (set `HF_TOKEN`) |
| `.env` not loaded | Ensure `.env` is at `backend/.env` (not nested deeper) |

---

## 9. Next

→ `05_BACKEND_REFERENCE.md` — deep dive into each backend service.
