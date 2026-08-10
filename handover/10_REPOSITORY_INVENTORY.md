# 10 — Repository Inventory

**Status:** In Progress  
**Owner:** Shashank Mishra  
**Last updated:** 2026-08-08

---

## Primary Repository

| Field | Value | Verification |
|-------|-------|--------------|
| **GitHub** | `https://github.com/BHIV-Engineering-Exchange/bhiv-Infiverse-HR.git` | ✅ Confirmed Phase 0 |
| **Production branch** | **`main` only** | ✅ Owner confirmed — no other production branches |
| **Latest commit (Phase 0)** | `1df1df0` — "added the deployment stack for VM deployment" | ✅ |
| **Remote sync** | Clean sync with `origin/main` | ✅ (as of Phase 0) |

### Branch policy

| Branch | Role | Status |
|--------|------|--------|
| `main` | **Production** — sole deploy branch | Active |
| Other branches | None used for production | N/A |

CI/CD (`.github/workflows/deploy.yml`) deploys on push to `main` only.

---

## Workspace Layout

| Path | Git? | Notes |
|------|------|-------|
| `bhiv-Infiverse-HR/` (workspace root) | No | Cursor workspace — contains `backend/`, `frontend/`, `docs/`, `handover/` |
| `bhiv-Infiverse-HR/bhiv-Infiverse-HR/` | Yes (if present) | Possible nested duplicate — verify before git operations |

**Recommendation:** Confirm which path holds `.git` before handover. Document in evidence if nested duplicate is flattened.

---

## Repository Contents (high level)

| Directory | Purpose |
|-----------|---------|
| `backend/` | Gateway, Agent, LangGraph services, tests, legacy `backend/handover/` |
| `frontend/` | Vite/React SPA |
| `handover/` | This documentation package (01–13) |
| `docs/` | Architecture, governance, control center docs |
| `.github/workflows/` | CI/CD (deploy to VM) |
| `docker-compose.production.template.yml` | VM production stack template |

---

## Partner / Ecosystem Repositories (local, gitignored)

These are **not** in the main repo but integrate via SETU signals and env vars. See [ECOSYSTEM_REPOSITORY_MAP.md](../ECOSYSTEM_REPOSITORY_MAP.md).

| System | Local folder | Integration |
|--------|--------------|-------------|
| Niyantran (workflow) | `workflow-blackhole` | `WORKFLOW_API_BASE_URL` |
| Artha (payroll) | `Artha` / `AI-Artha` | SETU signals |
| CRM + Logistics | `ai-crm` | Partner signals |
| Bucket, PRANA, InsightFlow, Karma | Per ecosystem map | SETU participation |

Access to partner repos requires separate transfer — not covered by main repo handover alone.

---

## CI/CD Workflows

| File | Trigger | Action |
|------|---------|--------|
| `.github/workflows/deploy.yml` | Push to `main` | Build Docker images → push to Docker Hub → SSH deploy to VM |

---

## Verification Still Needed (Phase 1)

- [ ] Confirm canonical git root path (nested duplicate resolution)
- [ ] List all remote branches (expect `main` as production)
- [ ] Confirm partner repo folders present on handover machine
- [ ] Inventory `.github/workflows/` and recent CI run status
- [ ] Document GitHub org permissions for Vijay/Soham

---

## Source Material

- [ECOSYSTEM_REPOSITORY_MAP.md](../ECOSYSTEM_REPOSITORY_MAP.md)
- [CONTRIBUTION_LOG.md](../CONTRIBUTION_LOG.md)
- [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)

---

## Evidence Links

_None yet — branch listing and CI screenshot pending Phase 1._
