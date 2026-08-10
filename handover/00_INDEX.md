# Sampada + SETU — Full System Handover Index

**Recipients:** Vijay Dhawan, Soham Kotkar (transfer recipients — no formal sign-off person)  
**Owner:** Shashank Mishra  
**Last updated:** 2026-08-08  
**Deployment model:** VM primary (path-based routing) · Render backup · Vercel alternate frontend

---

## Start Here

1. Read [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) — execution order, user decisions, access transfer, verification approach
2. Review [evidence/INDEX.md](evidence/INDEX.md) — proof artifacts registry
3. Work through deliverables 01–13 in order (or by phase in the plan)

---

## Deliverables (01–13)

| # | File | Title | Status | Evidence |
|---|------|-------|--------|----------|
| 01 | [01_EXECUTIVE_OVERVIEW.md](01_EXECUTIVE_OVERVIEW.md) | Executive Overview | ⏳ Pending | — |
| 02 | [02_ARCHITECTURE.md](02_ARCHITECTURE.md) | Complete Architecture Documentation | ⏳ Pending | — |
| 03 | [03_SOURCE_CODE_WALKTHROUGH.md](03_SOURCE_CODE_WALKTHROUGH.md) | Source Code Walkthrough | ⏳ Pending | — |
| 04 | [04_PRODUCTION_INFRASTRUCTURE.md](04_PRODUCTION_INFRASTRUCTURE.md) | Production Infrastructure | 🔄 In Progress | [EVD-001](evidence/health_checks_2026-08-08.md), [EVD-002](evidence/health-checks/vm-health-check-2026-08-08.md) |
| 05 | [05_DATABASE.md](05_DATABASE.md) | Database Documentation | ⏳ Pending | — |
| 06 | [06_API_DOCUMENTATION.md](06_API_DOCUMENTATION.md) | API Documentation | ⏳ Pending | — |
| 07 | [07_KNOWN_ISSUES.md](07_KNOWN_ISSUES.md) | Known Issues Register | ⏳ Pending | — |
| 08 | [08_OPERATIONAL_RUNBOOK.md](08_OPERATIONAL_RUNBOOK.md) | Operational Runbook | ⏳ Pending | — |
| 09 | [09_DEPENDENCY_MAP.md](09_DEPENDENCY_MAP.md) | Dependency Map | ⏳ Pending | — |
| 10 | [10_REPOSITORY_INVENTORY.md](10_REPOSITORY_INVENTORY.md) | Repository Inventory | 🔄 In Progress | — |
| 11 | [11_CREDENTIALS_REGISTER.md](11_CREDENTIALS_REGISTER.md) | Credentials & Configuration Register | 🔄 In Progress | — |
| 12 | [12_DEMO_SESSION.md](12_DEMO_SESSION.md) | Demo Session Guide | 🔄 In Progress | [EVD-002](evidence/health-checks/vm-health-check-2026-08-08.md) |
| 13 | [13_EXECUTIVE_ASSESSMENT.md](13_EXECUTIVE_ASSESSMENT.md) | Executive Assessment & Documentation Package | 🔄 In Progress | — |

**Legend:** ⏳ Pending · 🔄 In Progress · ✅ Complete

> **Note:** Legacy filename `12_DEMONSTRATION_SESSION.md` redirects to `12_DEMO_SESSION.md`.

---

## Existing Documentation (source material — do not duplicate blindly)

| Location | Use For |
|----------|---------|
| [Handover.md](../Handover.md) | Original assignment spec |
| [ECOSYSTEM_REPOSITORY_MAP.md](../ECOSYSTEM_REPOSITORY_MAP.md) | SETU partner repo map |
| [backend/handover/](../backend/handover/) | Legacy backend handover (API contracts, runbook, FAQ) |
| [docs/](../docs/) | Architecture, governance, control center docs |
| [SAMPADA_CURRENT_STATE.md](../SAMPADA_CURRENT_STATE.md) | Current system state snapshot |
| [REVIEW_PACKET.md](../REVIEW_PACKET.md) | Risk register and review history |

---

## Current Status (2026-08-08)

### VM URLs (primary production) — ✅ Verified

| Component | Public URL | Internal VM Port |
|-----------|------------|------------------|
| Frontend | `https://sampada.blackholeinfiverse.com/` | 3004 → 3000 |
| Gateway | `https://sampada.blackholeinfiverse.com/gateway` | 8003 → 8000 |
| Agent | `https://sampada.blackholeinfiverse.com/agent` | 9002 → 9000 |
| LangGraph | `https://sampada.blackholeinfiverse.com/langgraph` | 9003 → 9001 |

### Render URLs (backup failover) — ⚠️ Prior check 503

| Component | URL |
|-----------|-----|
| Gateway | `https://bhiv-hr-gateway-l0xp.onrender.com` |
| Agent | `https://bhiv-hr-agent-cato.onrender.com` |
| LangGraph | `https://bhiv-hr-langgraph-luy9.onrender.com` |

### Health status (2026-08-08, EVD-002)

- **VM:** All four services + gateway docs returned HTTP 200 ✅
- **Demo login:** Candidate ✅ · Recruiter ✅ · Client ⚠️ (server datetime bug)
- **Render:** All three returned HTTP 503 on prior check (likely sleeping) ⚠️
- **Vercel frontend:** HTTP 200 ✅ (prior check)

See [evidence/health-checks/vm-health-check-2026-08-08.md](evidence/health-checks/vm-health-check-2026-08-08.md).

### User decisions captured

| Topic | Decision |
|-------|----------|
| Git | `main` branch only |
| Secrets | No rotation — document locations only |
| Sign-off | Transfer model — Vijay/Soham continue from docs |
| Demo accounts | Provisional — owner updates before final handover |
| Scope *(added 2026-08-10)* | `gateway` + `agent` + `langgraph` + `frontend/` only — `candidate_portal`/`client_portal`/`portal` archived |

---

## Success Criteria

Vijay and Soham can independently understand, deploy, operate, troubleshoot, and continue development without verbal clarification from Shashank. Every claim is backed by evidence in `handover/evidence/`.
