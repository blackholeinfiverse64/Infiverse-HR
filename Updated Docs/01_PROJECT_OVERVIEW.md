# 01 — Project Overview

**Status:** ✅ Verified (2026-08-14)
**Owner:** Shashank Mishra
**System Owner:** Rishabh Yadav

> This is the single-source-of-truth overview of **INFIVERSE-HR (codename: Sampada / BHIV)**.
> Read this document first, then continue linearly through `02_REPOSITORY_STRUCTURE.md` → `15_*`.

---

## 1. What It Is

INFIVERSE-HR is an enterprise-grade, AI-enabled, **multi-tenant Workforce Intelligence + HR
Operations Platform**. It manages the complete hiring lifecycle for multiple client companies
(tenants) from one system, and additionally provides workforce operations, governance,
observability, and an executive control center.

**Portals & main user roles (verified in `frontend/src/App.tsx`):**

| Portal | Users | Core actions |
|--------|-------|--------------|
| Candidate | Job seekers | Apply, track application status, upload documents (CV/Resume/NDA), view tasks, interviews, feedback |
| Recruiter | Internal HR staff | Post jobs, review/shortlist applicants, AI matching, schedule interviews, batch upload, automation, reports |
| Client | Hiring companies | View pipelines, approve/shortlist candidates, request documents, live monitoring, reports |
| Control Center | Executives (`client`/`recruiter`/`admin` roles) | Observability dashboards — executive, hiring, workforce, growth, org, governance, replay |

---

## 2. Verified Scale Numbers (2026-08-14)

| Metric | Value | Source |
|--------|-------|--------|
| Gateway API operations (live) | **172** | Live `/gateway/openapi.json` |
| Agent API operations (live) | **6** | Live `/agent/openapi.json` |
| LangGraph API operations (live) | **26** | Live `/langgraph/openapi.json` |
| Total live API operations | **204** | — |
| Gateway service version | **4.2.0** | Live `/gateway/health` |
| Agent service version | **3.0.0** | Live `/agent/health` |
| MongoDB database | `bhiv_hr` (MongoDB Atlas) | `backend/.env` |
| Collection count (source-extracted) | **33** | `backend/services/*` |
| Seed data (per `seed_mongodb.py`) | 5 jobs, 20 candidates, 15 applications, 3 clients, 3 users, interviews, feedback, workflows, offers, RL data | `backend/seed_mongodb.py` |

> Earlier docs claimed "111 operational API endpoints"; that figure is stale. The live counts above
> are authoritative.

---

## 3. The Four Verified Runtime Services

| Service | Port | Framework | Purpose |
|---------|------|-----------|---------|
| **Gateway** | 8000 | FastAPI (uvicorn `app.main:app`) | Main API: auth (triple-layer), jobs, candidates, applications, documents, notifications, client/recruiter portals, control center, workforce governance, SETU signals, workflow bridge |
| **Agent** | 9000 | FastAPI (uvicorn `app:app`) | AI candidate-job semantic matching (sentence-transformers) |
| **LangGraph** | 9001 | FastAPI (uvicorn `app.main:app`) | Workflow orchestration (LangGraph state machine), RL engine, notifications (Email/WhatsApp/Telegram) |
| **Frontend** | 3000 (dev) | React 18 + Vite + TypeScript | SPA "Sampada — HR Recruitment System" |

Legacy Streamlit portals (`portal:8501`, `client_portal:8502`, `candidate_portal:8503`) still exist
in source but are marked **LEGACY** in the production compose file (see `05_BACKEND_REFERENCE.md`).

---

## 4. Core Technology Stack

### Frontend
- React 18.2, TypeScript 5.3 (strict), Vite 7.3
- Vanilla CSS + Tailwind CSS 3.3 (shadcn-style HSL tokens), `tailwindcss-animate`, `framer-motion`
- `react-router-dom` 6, `axios` (auth interceptors), `react-hot-toast`, `xlsx` (batch uploads)

### Backend (FastAPI microservices)
- **Gateway** — triple-layer auth (API key, candidate JWT, client JWT), XSS/SQLi input
  validation, multi-tenant isolation, Prometheus metrics, Motor (async MongoDB).
- **Agent** — PyMongo, `sentence-transformers`, scikit-learn, torch, Prometheus.
- **LangGraph** — `langgraph>=0.2`, `langchain`, `google-generativeai` (Gemini),
  `twilio` (WhatsApp), `python-telegram-bot`, RL engine (`rl_integration/`).

### Database
- MongoDB Atlas (primary datastore), db `bhiv_hr`. PostgreSQL fully retired (legacy references only).

### External Systems
- **Complete-Infiverse / EMS** — downstream candidate-task bridge via `workflow_proxy.py`
  (`WORKFLOW_API_BASE_URL`).
- **SETU ecosystem** — additive outbound dispatchers post signals to `POST /v1/setu/signals/{signal_type}`.

### Deployment
- **VM (primary, verified live)**: `https://sampada.blackholeinfiverse.com` with path-based routing
  (`/gateway`, `/agent`, `/langgraph`).
- **Render (backup)**: `bhiv-hr-gateway-*.onrender.com`, `bhiv-hr-agent-*.onrender.com`,
  `bhiv-hr-langgraph-*.onrender.com` (subdomain names have changed across doc versions).
- **Vercel (alternate frontend)**: `infiverse-hr.vercel.app` / `sampada.blackholeinfiverse.com`.
- **Docker**: `bhiv/hr-gateway`, `bhiv/hr-agent`, `bhiv/hr-lang-graph`, `bhiv/hr-frontend` images.

---

## 5. What It Does (feature surface, verified)

- **Job posting & management** — clients post roles; recruiters manage pipelines (`/v1/jobs`).
- **Candidate sourcing & matching** — semantic scores from sentence transformers (`/v1/match`).
- **Application lifecycle** — apply → review → shortlist → interview → offer.
- **Workflow automation** — lifecycle events trigger Email/WhatsApp/Telegram via LangGraph.
- **Multi-tenant isolation** — Client A cannot see Client B's jobs/candidates.
- **External workflow integration** — candidate tasks sync with Complete-Infiverse.
- **Workforce operations** — org hierarchy (organizations → divisions → units → departments →
  employees) with lineage envelopes and audit (`/v1/workforce/*`).
- **Policy & governance** — policy definitions/evaluations/overrides, governance challenges &
  reviews, decision ledger (`/v1/policies/*`, `/v1/governance/*`, `/v1/decisions`).
- **SETU participation** — additive signal dispatchers (`/v1/setu/signals/*`).
- **Executive control center** — observability dashboards and audit replay
  (`/v1/control-center/*`), frontend route `/control`.
- **2FA & security** — TOTP 2FA, password policy engine, CSP reporting, rate limiting, XSS/SQLi
  blocking (`/v1/security/*`, `/v1/auth/2fa/*`, `/v1/auth/password/*`).

---

## 6. Ecosystem & Related Repositories

| Repo / Folder | Relationship | Tracked in git |
|---------------|--------------|----------------|
| `ai-crm`, `Artha`, `Prana`, `Karma-Tracker`, `bhiv-registry`, `bhiv-SVACS`, `bhiv-intelligence-samachar`, `bucket`, `workflow-blackhole` | Partner / external repos vendored locally for integration reference | **No** — gitignored |
| `backend/` | This platform's backend | Yes |
| `frontend/` | This platform's frontend | Yes |

The canonical map of the SETU partner ecosystem is `ECOSYSTEM_REPOSITORY_MAP.md` (archived copy in
`archived/root/`); see `14_SCOPE_SPRINTS_VANA.md`.

---

## 7. Operating Boundaries (Constitutional Alignment)

As a developer working on the **Sampada** scope:
- **Visibility only**: Dashboard and intelligence features are strictly read-only on execution
  authority. Do not introduce parallel orchestration frameworks or state-mutating handlers.
- **System boundaries**: Escalation authority, database schema mutations, security-authorization
  overrides, and final prioritization remain with System Owner **Rishabh Yadav**.
- **Non-destructive workflow**: archive rather than delete; never commit secrets.

---

## 8. Where to Go Next

Continue reading in order:

1. `02_REPOSITORY_STRUCTURE.md` — where everything lives
2. `03_ARCHITECTURE.md` — how services interact
3. `04_SETUP_AND_RUN.md` — get it running locally in 15 minutes
