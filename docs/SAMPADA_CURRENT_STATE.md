# SAMPADA CURRENT STATE — Developer Handover Document
**Last Updated**: 2026-05-26 | **Maintained by**: Shashank (Sampada, Support Builder)
**System Owner**: Rishabh Yadav | **Status**: Active Convergence Sprint

> This document enables a completely new developer to enter the system with minimal verbal explanation.
> Read every section before writing a single line of code.

---

## 1. Product Purpose

**INFIVERSE-HR (codename: Sampada / BHIV)** is an enterprise-grade AI-enabled multi-tenant recruitment platform.

### What It Does
The platform manages the complete hiring lifecycle for multiple client companies (tenants) from a single system:
- **Job Posting & Management**: Client companies post roles; recruiters manage hiring pipelines.
- **Candidate Sourcing & Matching**: AI-powered semantic matching scores candidates against job descriptions using sentence transformers.
- **Application Lifecycle**: Candidates apply, move through review → shortlist → interview → offer stages.
- **Workflow Automation**: Every lifecycle event (apply, shortlist, schedule, offer) triggers automated notifications via Email, WhatsApp, and Telegram.
- **Multi-Tenant Isolation**: Each client company's data is isolated — Client A cannot see Client B's jobs or candidates.
- **External Workflow Integration**: Candidate task assignments sync with the Complete-Infiverse external workflow system.

### Who Uses It
| Portal | Users | Core Actions |
|--------|-------|-------------|
| **Candidate Portal** | Job seekers | Apply, track status, upload docs, view tasks |
| **Recruiter Console** | Internal HR staff | Post jobs, review applicants, schedule, shortlist |
| **Client Portal** | Hiring companies | View pipeline, approve candidates, request documents |

### Scale & Volume
- **111 operational API endpoints** across 3 microservices
- **240 candidates** in the database (as of last verified run: 2026-05-26)
- **25 active jobs** across multiple tenants
- **14+ MongoDB collections** for persistence

---

## 2. Constitutional Position

### The Locked Separation Model

The system enforces a **strict 3-layer authority model**. This is not a design preference — it is a constitutional boundary that governs every contribution to the system.

```
LAYER 3 — EXECUTION (State Authority)
  Gateway + LangGraph + Agent Services
  → Who can do this? Backend service owners under Rishabh Yadav
  → What is allowed? State mutations, workflow triggers, authorization decisions

        ↑ approval gate ↑

LAYER 2 — APPROVAL / PARTICIPATION (SETU)
  Downstream signal receivers, approval workflows
  → Who can do this? SETU role participants
  → What is allowed? Evaluate signals, recommend actions (NOT execute them)

        ↑ signal flow ↑

LAYER 1 — VISIBILITY / INTELLIGENCE (SAMPADA)
  Dashboards, traces, audit logs, observability
  → Who can do this? Shashank (Sampada, Support Builder)
  → What is allowed? READ-ONLY observation, documentation, evidence gathering
```

### Sampada's Constitutional Position
- **What Sampada IS**: Intelligence layer — provides signals, traces, visibility
- **What Sampada is NOT**: An executor, orchestrator, architect, or authority holder
- **The Key Rule**: `Visibility ≠ Execution Authority`

### Non-Negotiable Boundaries (Locked — Do Not Re-Litigate)
1. Sampada cannot mutate system state
2. Sampada cannot override execution decisions
3. Sampada cannot create parallel signal channels
4. Sampada cannot expand scope beyond convergence needs
5. All architecture decisions remain with Rishabh Yadav

---

## 3. Ownership Matrix

| Area | Owner | Authority Level | Contact |
|------|-------|----------------|---------|
| **System Architecture & Design** | Rishabh Yadav | Full — all decisions | System Owner |
| **Backend Microservices (Gateway, Agent, LangGraph)** | Rishabh Yadav | Full execution authority | System Owner |
| **Acceptance Criteria & Convergence** | Rishabh Yadav | Final approval | System Owner |
| **Frontend / Dashboard UI** | Nikhil | Interface wiring, API consumption | Frontend Dev |
| **Infrastructure / Deployment** | Vinayak | Container management, uptime | DevOps |
| **Infra Support / Network** | Raj | Port mappings, DNS, cluster health | Infra Support |
| **Observability & Documentation** | Shashank (Sampada) | Read-only on execution; docs & traces | Support Builder |

### Escalation Path
```
Operational question → Shashank documents it
Architecture decision needed → Escalate to Rishabh
Frontend wiring issue → Nikhil
Container/deployment issue → Vinayak / Raj
Acceptance criteria question → Rishabh only
```

---

## 4. Architecture Map

### Service Topology
```
┌─────────────────────────────────────────────────┐
│           FRONTEND  (port :3000)                │
│         React 18 + Vite + TypeScript            │
│   ┌───────────┐ ┌──────────┐ ┌───────────────┐  │
│   │ Candidate │ │Recruiter │ │ Client Portal │  │
│   │  Portal   │ │ Console  │ │               │  │
│   └───────────┘ └──────────┘ └───────────────┘  │
└─────────────────────────────────────────────────┘
                      │ HTTPS + JWT
                      ▼
┌─────────────────────────────────────────────────┐
│          GATEWAY SERVICE  (port :8000)          │
│              FastAPI v4.2.0                     │
│  ┌─────────────────────────────────────────┐    │
│  │  Triple-Layer Authentication             │    │
│  │  • API Key (admin/system scope)         │    │
│  │  • Client JWT (tenant scope)            │    │
│  │  • Candidate JWT (self-service scope)   │    │
│  ├─────────────────────────────────────────┤    │
│  │  80 Core Endpoints                      │    │
│  │  • /v1/jobs (CRUD)                      │    │
│  │  • /v1/candidates (search, profile)     │    │
│  │  • /v1/candidate/apply                  │    │
│  │  • /v1/client/stats                     │    │
│  │  • /v1/match/{job_id}/top               │    │
│  │  • /v1/security/* (CSP, validation)     │    │
│  │  • /v1/auth/* (login, 2FA, password)    │    │
│  │  • /api/v1/webhooks/*                   │    │
│  │  • /api/v1/workflow/status/{id}         │    │
│  │  • /health, /health/detailed            │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
         │                      │
         ▼                      ▼
┌─────────────────┐    ┌─────────────────────────┐
│   AI AGENT      │    │   LANGGRAPH SERVICE     │
│  (port :9000)   │    │     (port :9001)        │
│                 │    │                         │
│  FastAPI v3.0.0 │    │  FastAPI v1.0.0         │
│                 │    │                         │
│  Semantic match │    │  State machine mgmt     │
│  Sentence       │    │  Webhook processing     │
│  transformers   │    │  Notification dispatch  │
│  6 endpoints    │    │  RL feedback loop       │
│                 │    │  25 endpoints           │
│                 │    │                         │
│                 │    │  Channels:              │
│                 │    │  • Email (Gmail SMTP)   │
│                 │    │  • WhatsApp (Twilio)    │
│                 │    │  • Telegram             │
└─────────────────┘    └─────────────────────────┘
         │                      │
         └──────────┬───────────┘
                    ▼
         ┌──────────────────────┐
         │    MongoDB Atlas     │
         │   Primary Database   │
         │                      │
         │  Collections (14+):  │
         │  • candidates        │
         │  • jobs              │
         │  • job_applications  │
         │  • interviews        │
         │  • offers            │
         │  • audit_logs        │
         │  • workflow_states   │
         │  • notifications     │
         │  • rl_feedback       │
         │  • security_csp      │
         │  • users             │
         │  • clients           │
         │  • tokens            │
         │  • tasks             │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Complete-Infiverse  │
         │  (External Workflow) │
         │  EMS Task Sync       │
         └──────────────────────┘
```

### Deployment Mode (Current: Docker)
```
Host Windows Machine
└── Docker Desktop
    ├── backend-gateway-1     (image: backend-gateway,   :8000)
    ├── backend-agent-1       (image: backend-agent,     :9000)
    └── backend-langgraph-1   (image: backend-langgraph, :9001)
```
Frontend runs **outside** Docker via `npm run dev` on the host.

---

## 5. Signal Flow

### Operational Signal Flow (State Transitions)
```
Candidate applies for job
  → POST /v1/candidate/apply (Gateway)
    → job_applications collection updated (MongoDB)
      → Webhook POST /api/v1/webhooks/candidate-applied (Gateway → LangGraph)
        → LangGraph state machine activates
          → Notification sent (Email + WhatsApp)
            → rl_feedback entry created
              → audit_log entry written
                → Sampada observes in dashboard/trace
```

### Recruiter Signal Flow
```
Recruiter shortlists candidate
  → POST /api/v1/webhooks/candidate-shortlisted (Gateway)
    → LangGraph triggers shortlist notification loop
      → Candidate notified (Email + WhatsApp + Telegram)
        → Interview scheduling flow activated
```

### Intelligence Signal Flow (Sampada Layer)
```
GET /v1/match/{job_id}/top (API Key)
  → Gateway forwards to AI Agent :9000
    → Agent computes semantic similarity scores
      → Returns ranked candidate list with match %, skills_match, reasoning
        → Sampada displays in dashboard (READ ONLY)
          → Recruiter/Client makes decision (NOT Sampada)
```

### Constitutional Signal Rule
```
Signals FROM Sampada:  ADVISORY only (suggestions, scores, anomaly flags)
Signals TO Execution:  Must pass through SETU approval gate
Commands FROM Sampada: NONE — Sampada does not issue commands
```

---

## 6. Integration Map

| Integration | Direction | Protocol | Auth | Purpose |
|-------------|-----------|----------|------|---------|
| Frontend → Gateway | Outbound | HTTPS REST | Client/Candidate JWT | UI data fetching |
| Gateway → AI Agent | Internal | HTTP REST | Service-to-service | Semantic matching |
| Gateway → LangGraph | Internal | HTTP REST | API Key | Workflow triggers |
| LangGraph → Gmail | Outbound | SMTP | OAuth2/App Password | Email notifications |
| LangGraph → Twilio | Outbound | HTTPS API | API Key/Token | WhatsApp alerts |
| LangGraph → Telegram | Outbound | HTTPS API | Bot Token | Telegram messages |
| Gateway → MongoDB Atlas | Outbound | pymongo/motor | Connection string | All persistence |
| Gateway → Complete-Infiverse | Outbound | HTTPS REST | API Key | Candidate task sync |

### Key Environment Variables (backend/.env)
```
DATABASE_URL=<mongodb+srv connection string>
API_KEY_SECRET=<admin api key>
JWT_SECRET_KEY=<client jwt signing secret>
CANDIDATE_JWT_SECRET_KEY=<candidate jwt signing secret>
GATEWAY_SECRET_KEY=<internal service auth>
TWILIO_ACCOUNT_SID=<twilio sid>
TWILIO_AUTH_TOKEN=<twilio token>
GMAIL_APP_PASSWORD=<gmail app password>
TELEGRAM_BOT_TOKEN=<telegram bot token>
WORKFLOW_API_BASE_URL=<complete-infiverse base url>
```

---

## 7. Active Components

### Running Services (Docker)
| Service | Container | Port | Version | Status |
|---------|-----------|------|---------|--------|
| API Gateway | backend-gateway-1 | :8000 | 4.2.0 | Healthy |
| AI Agent | backend-agent-1 | :9000 | 3.0.0 | Healthy |
| LangGraph | backend-langgraph-1 | :9001 | 1.0.0 | Healthy |
| Frontend | npm dev (host) | :3000 | — | Runs separately |

### Key Source Files
| File | Purpose |
|------|---------|
| `backend/services/gateway/app/main.py` | All 80 gateway endpoints (6481 lines) |
| `backend/services/gateway/app/jwt_auth.py` | Triple-layer authentication implementation |
| `backend/services/agent/app.py` | Semantic matching service |
| `backend/services/langgraph/app/main.py` | Workflow automation service |
| `backend/services/gateway/app/monitoring.py` | AdvancedMonitor class, Prometheus hooks |
| `backend/docker-compose.production.yml` | Docker service orchestration |
| `backend/services/gateway/app/db_helpers.py` | MongoDB query helpers |

### Monitoring Capabilities
- `GET /health` — Basic service liveness
- `GET /health/detailed` — CPU, memory, DB connection, service metrics
- `GET /v1/candidates/stats` — Candidate pipeline statistics
- `GET /v1/client/stats` — Tenant-specific pipeline metrics
- `GET /v1/security/csp-violations` — Browser security event log
- `GET /v1/database/schema` — MongoDB schema introspection
- Docker logs: `docker logs backend-gateway-1 --tail 50`

---

## 8. Current Proof Status

### Convergence Evidence Collected (2026-05-26)

| Proof Category | Status | Evidence File |
|---------------|--------|--------------|
| **Entry Points** (3 auth types) | ✅ Complete | `evidence/entry-points/` |
| **Live Execution Flow** (E2E lifecycle) | ✅ Complete | `evidence/trace-continuity/request-trace.log` |
| **Real Trace Continuity** (correlation IDs) | ✅ Complete | `evidence/trace-continuity/trace-analysis.txt` |
| **Real Downstream Participation** (webhooks) | ✅ Complete | `evidence/tests/downstream-participation.log` |
| **Enforcement Proof** (RBAC + isolation) | ✅ Complete | `evidence/enforcement/` |
| **Replay Reconstruction** (audit replay) | ✅ Complete | `evidence/replay/` |
| **Failure Observability** (8 scenarios) | ✅ Complete | `evidence/failure/` |
| **Constitutional Boundaries** | ✅ Complete | `evidence/boundaries/` |
| **Ownership Matrix** | ✅ Complete | `evidence/ownership/ownership_matrix.md` |
| **Proof/Logs Summary** | ✅ Complete | `evidence/general/verification_summary.md` |

### Live Test Results (Last Run: 2026-05-26T13:35Z)
- **Trace ID**: `trace_conv_17_257502`
- **Workflow ID**: `d5df0069-1bfd-4402-a9cc-f13e2e7a8e29`
- **Job Created**: `6a15a13f0caf5b91bd0e9de4`
- **Resilience Tests**: 8/8 PASSED
- **RBAC Negative Tests**: 5/5 PASSED (401/403 enforced correctly)
- **Tenant Isolation Test**: PASSED (Client B blocked from Client A's job)
- **Replay Reconstruction**: SUCCESS ✅

### Known Gaps / Pending
| Gap | Risk | Mitigation |
|-----|------|-----------|
| Internal HR user authentication not implemented | Medium | API keys used as workaround for testing |
| Tenant isolation is per-endpoint manual filtering | High | Systematic negative testing catches gaps |
| RL model training is mocked | Low | Document as accepted limitation for sprint |
| Tenant-specific encryption missing | Medium | Shared keys — document security consideration |

---

## 9. Open Risks

### Risk Register
| # | Risk | Likelihood | Impact | Owner | Mitigation |
|---|------|-----------|--------|-------|-----------|
| R1 | Cross-tenant data leakage via manual endpoint filtering | Medium | Critical | Rishabh | Systematic RBAC + isolation tests every sprint |
| R2 | Mocked RL endpoints produce non-deterministic replay evidence | Low | Medium | Backend team | Document as known limitation; don't use for convergence proof |
| R3 | Docker service unavailability breaks all backend testing | Medium | High | Vinayak | Restart procedures documented; monitor container health |
| R4 | Missing internal HR auth creates security surface | Low | High | Rishabh | API key workaround for testing; HR auth on roadmap |
| R5 | Shared JWT secrets across environments | Low | High | Rishabh | Rotate secrets before production; use secrets manager |
| R6 | MongoDB Atlas IP allowlist blocks testing from new networks | Medium | Medium | Vinayak/Raj | Add development IPs to Atlas allowlist |
| R7 | LangGraph state machine doesn't persist across container restarts | Medium | Medium | Backend team | Evidence replay covers recovery; documented in replay section |
| R8 | Twilio/Gmail credentials expire/are rate-limited | Low | Low | Rishabh | Monitor; fallback to logged notifications |

---

## 10. Open Tasks

### Sprint Tasks (Active)
- [x] Collect all 10 evidence categories for REVIEW_PACKET.md
- [x] Prove trace continuity end-to-end with correlation IDs
- [x] Execute RBAC negative tests (wrong roles → 403)
- [x] Execute tenant isolation tests (Client B → Client A denied)
- [x] Build and validate replay reconstruction script
- [x] Document failure observability (8 scenarios)
- [x] Update all 5 docs/ files to full quality
- [x] Restart Docker after server downtime and re-verify health endpoints
- [ ] Get acceptance sign-off from Rishabh Yadav on REVIEW_PACKET.md

### Backlog Tasks (Post-Sprint)
- [ ] Implement internal HR user authentication (owned by Rishabh)
- [ ] Automate tenant isolation enforcement at middleware level (not per-endpoint)
- [ ] Integrate real RL model training pipeline (currently mocked)
- [ ] Add tenant-specific encryption for data at rest
- [ ] Implement proper secrets management (HashiCorp Vault or AWS Secrets Manager)
- [ ] Dashboard wiring for live trace view (Phase 4, if requested by Rishabh)
- [ ] Add automated E2E test suite to CI/CD pipeline

---

## 11. Near-Term Roadmap

### Current Sprint (Week of 2026-05-26)
- **Goal**: Convergence proof hardening — complete all 10 REVIEW_PACKET categories
- **Owner**: Rishabh Yadav (lead) + Shashank (support builder)
- **Deliverables**: All evidence collected ✅, REVIEW_PACKET.md complete ✅, docs refreshed ✅

### Next Sprint (Planned)
- **Goal**: Docker deployment stabilization + acceptance review
- **Focus**: Rishabh's formal acceptance sign-off on convergence evidence
- **Nikhil**: Dashboard wiring for operational visibility (if Phase 4 triggered)
- **Vinayak/Raj**: Production deployment hardening

### Medium Term (1-2 months)
- Internal HR auth implementation
- Automated tenant isolation middleware
- RL model training pipeline (real training, not mocked)
- CI/CD pipeline with automated test suite

### Long Term (3+ months)
- Secrets management infrastructure
- Tenant-specific encryption
- Advanced observability (distributed tracing with OpenTelemetry)
- Multi-region deployment strategy

---

## 12. Developer Entry Guide

### Prerequisites Checklist
```
[ ] Git installed
[ ] Python 3.11+ installed (3.12 recommended)
[ ] Node.js 18+ and npm installed
[ ] Docker Desktop installed
[ ] MongoDB Atlas connection string (ask Rishabh or team lead)
[ ] Internet access to MongoDB Atlas cluster
```

### Step 1: Clone and Configure
```powershell
# Clone the repo
git clone <repo-url>
cd INFIVERSE-HR-PLATFORM-main

# Configure backend environment
cd backend
copy .env.example .env
# Edit backend/.env — fill in all required values:
# DATABASE_URL, API_KEY_SECRET, JWT_SECRET_KEY, CANDIDATE_JWT_SECRET_KEY
```

### Step 2: Start Backend (Choose one method)

**Method A — Docker (Recommended for backend)**
```powershell
cd backend
docker compose -f docker-compose.production.yml up --build -d
# Verify: docker ps  (should show 3 healthy containers)
```

**Method B — Python venv (Windows)**
```powershell
cd backend
.\setup_venv.bat
.\run_with_venv.bat
```

**Method C — Manual Python**
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Linux/Mac
pip install -r requirements.txt
python run_services.py
```

### Step 3: Start Frontend
```powershell
cd frontend
npm install
npm run dev
# Opens at http://localhost:3000
```

### Step 4: Verify Everything Is Running
```powershell
# Check all 3 backend services
curl http://localhost:8000/health   # Gateway: should return {"status":"healthy"}
curl http://localhost:9000/health   # Agent: should return {"status":"healthy"}
curl http://localhost:9001/health   # LangGraph: should return {"status":"healthy"}

# Check detailed health (needs API Key)
curl -H "Authorization: Bearer <YOUR_API_KEY>" http://localhost:8000/health/detailed
```

### Step 5: Understand the Code Structure
```
backend/services/gateway/app/main.py    ← Read this first (all endpoints)
backend/services/gateway/app/jwt_auth.py ← Auth implementation
backend/handover/ROLE_MATRIX.md         ← Who can do what
backend/handover/SYSTEM_BEHAVIOR.md     ← Architecture contracts
backend/docs/api/API_DOCUMENTATION.md   ← Full API reference
```

### Troubleshooting Quick Reference
| Problem | Solution |
|---------|---------|
| Docker containers not starting | `docker compose down` then `docker compose up --build -d` |
| MongoDB connection refused | Check Atlas IP allowlist; check `DATABASE_URL` in `.env` |
| Port 8000/9000/9001 in use | `netstat -ano \| findstr :8000` then `taskkill /PID <pid> /F` |
| Frontend can't reach backend | Verify `VITE_API_BASE_URL` in frontend env points to `http://localhost:8000` |
| JWT auth failing | Regenerate tokens using correct secret keys from `.env` |
| Docker not found | Open Docker Desktop application; wait for engine to start |

### Key Contacts
- **Architecture questions**: Rishabh Yadav (System Owner)
- **Frontend questions**: Nikhil (Frontend Developer)
- **Deployment questions**: Vinayak / Raj (Infra)
- **Documentation / Observability**: Shashank (Sampada, Support Builder)

---

*This document is maintained by the Sampada Support Builder role. Updates must not change execution-layer configurations or architecture decisions — those require Rishabh Yadav's approval.*
