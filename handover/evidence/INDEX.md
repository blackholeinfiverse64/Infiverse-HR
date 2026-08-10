# Evidence Index — Sampada + SETU Handover

**Purpose:** Central registry of proof artifacts. Every deliverable claim must link to an entry here.

---

## How to Add Evidence

For each artifact, create a row using this template:

| ID | Date | Deliverable | Artifact Type | File / Link | Verified By | Status |
|----|------|-------------|---------------|-------------|-------------|--------|
| EVD-001 | YYYY-MM-DD | 04 Production Infrastructure | Health check log | `evidence/health_checks_YYYY-MM-DD.md` | Name | ✅ Verified |

### Artifact Types

- **Health check log** — curl/HTTP status output (no secrets)
- **Screenshot** — UI, dashboard, deployment console
- **API validation** — Postman export, curl transcript, test runner output
- **Deployment log** — CI/CD run, docker compose ps, release history
- **Database proof** — schema dump, collection counts (no PII)
- **Architecture diagram** — PNG/SVG or mermaid source
- **Access transfer receipt** — confirmation that recipient received credentials (not the secrets themselves)
- **Recording** — demo session video link

### Naming Convention

```
handover/evidence/
  health_checks_YYYY-MM-DD.md
  deploy_logs_YYYY-MM-DD.txt
  api_smoke_YYYY-MM-DD.json
  screenshots/
    control_center_YYYY-MM-DD.png
  access_transfer/
    github_invite_confirmation.png
```

---

## Current Evidence (Phase 0)

| ID | Date | Deliverable | Artifact Type | File / Link | Verified By | Status |
|----|------|-------------|---------------|-------------|-------------|--------|
| EVD-001 | 2026-08-08 | 04 Production Infrastructure | Health check log | [health_checks_2026-08-08.md](health_checks_2026-08-08.md) | Handover agent | ✅ VM primary healthy; Render 503 |
| EVD-002 | 2026-08-08 | 04, 11, 12 | Health check + login smoke | [health-checks/vm-health-check-2026-08-08.md](health-checks/vm-health-check-2026-08-08.md) | Handover agent | ✅ VM all 200; Candidate/Recruiter login OK; Client login server error |
| EVD-003 | 2026-08-10 | 07, 11, IMPLEMENTATION_PLAN | Code-level audit of this `handover/` folder | [audit-2026-08-10.md](audit-2026-08-10.md) | Claude (sandboxed, no VM/Atlas access) | ⚠️ Found and fixed: password pattern disclosure, scope overclaim, KI-003 verified (29 files), new KI-005 found + fixed in code |

---

## Pending Evidence (required before transfer completion)

| ID | Deliverable | What's Needed |
|----|-------------|---------------|
| EVD-010 | 04 Production Infrastructure | Render backup re-check after wake-up (503 → 200?) |
| EVD-011 | 04 Production Infrastructure | VM nginx/reverse-proxy config capture |
| EVD-012 | 04 Production Infrastructure | GitHub Actions deploy run screenshot |
| EVD-020 | 06 API Documentation | Postman collection run against VM gateway |
| EVD-030 | 08 Operational Runbook | Manual restart + rollback drill on VM |
| EVD-040 | 11 Credentials Register | Access transfer receipts for Vijay/Soham |
| EVD-050 | 12 Demonstration Session | Recorded walkthrough link |

_EVD-060 (Niyantran/Artha/CRM live signal proof) removed 2026-08-10 — partner systems are out of scope per the confirmed scope decision (see `IMPLEMENTATION_PLAN.md` § Ecosystem Scope). Sampada's own `/v1/setu/*` route behavior is still coverable under EVD-020._

---

## Cross-References to Existing Evidence

Legacy evidence from prior sprints lives outside this folder:

| Location | Contents |
|----------|----------|
| `evidence/live_workforce_governance_setu/` | SETU signal capture, partner live runs |
| `evidence/workforce_runtime/` | Workforce governance runtime proof |
| `evidence/phase_iv_tier1/` | Phase IV tier-1 captures |
| `backend/handover/postman/` | Postman collection + test scripts |

When migrating claims into deliverables 01–13, copy or link — do not duplicate large JSON blobs.
