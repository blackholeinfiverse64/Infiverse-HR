# SAMPADA CURRENT STATE

1. Product Purpose

- INFIVERSE-HR (Sampada/BHIV) is an AI-enabled recruitment platform that provides job/candidate lifecycle management, semantic matching, multi-channel notifications and workflow automation for enterprise tenants.

2. Constitutional Position

- Sampada: Support Builder (visibility, intelligence, signals). Read-only on execution authority. Owned/led by Rishabh; Shashank contributes in support capacity.

3. Ownership Matrix

- System Owner / Architecture: Rishabh Yadav
- Frontend / Dashboard: Nikhil
- Infra / Deployment: Vinayak / Raj
- Support Builder (docs/observability): Shashank (Sampada)

4. Architecture Map

- Layered model: Visibility (Sampada) → Approval/Participation (SETU) → Execution (Gateway + LangGraph + Agent)
- Key services: Gateway (8000), Agent (9000), LangGraph (9001), MongoDB Atlas

5. Signal Flow

- Operational signals: state transitions (apply, schedule, offer)
- Intelligence signals: AI match recommendations, RL feedback
- Visibility signals: traces, audit logs, metrics shown in dashboard

6. Integration Map

- Frontend (3000) → Gateway (8000)
- Gateway → Agent (9000) for matching
- Gateway → LangGraph (9001) for workflow automation
- Gateway → Complete-Infiverse for external task sync
- All services persist to MongoDB Atlas

7. Active Components

- Gateway service: backend/services/gateway
- Agent service: backend/services/agent
- LangGraph service: backend/services/langgraph
- Frontend: frontend/ (React + Vite)

8. Current Proof Status

- Implemented: triple-auth (API Key, Client JWT, Candidate JWT), core endpoints and workflows, audit logging.
- Pending / Partial: tenant isolation automation, internal HR authentication, RL model retraining, tenant-specific encryption.

9. Open Risks

- Cross-tenant data leakage due to manual filtering per-endpoint
- Mocked RL endpoints may produce non-deterministic acceptance evidence
- Lack of internal HR auth may require workaround via API keys for testing

10. Open Tasks

- Prove trace continuity end-to-end
- Produce replay reconstruction scripts and evidence
- Execute enforcement (RBAC, tenant isolation) negative tests
- Collect failure observability artifacts

11. Near-Term Roadmap

- Short-term (this sprint): finish convergence proof artifacts (trace, replay, enforcement, failure observability)
- Medium-term: address tenant isolation automation and internal HR auth (not in scope for Sampada unless prioritized by Rishabh)

12. Developer Entry Guide

- Quick start (local):
  1. Backend: `cd backend` → run `setup_venv.bat` then `run_with_venv.bat` or `python run_services.py` (gateway/agent/langgraph)
  2. Frontend: `cd frontend` → `npm install` → `npm run dev`
  3. Verify health endpoints: `http://localhost:8000/health`, `http://localhost:9000/health`, `http://localhost:9001/health`
- Key files to inspect:
  - `backend/handover/ROLE_MATRIX.md`
  - `backend/handover/SYSTEM_BEHAVIOR.md`
  - `backend/handover/architecture/ARCHITECTURE.md`
  - `backend/services/gateway/jwt_auth.py`
  - `backend/docs/api/API_DOCUMENTATION.md`

Notes:
- Preserve constitutional boundaries when making changes; for execution-level changes, always coordinate with Rishabh.
