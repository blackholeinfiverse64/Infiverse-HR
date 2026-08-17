# 15 — Known Issues & Archive Index

**Status:** ✅ Verified (2026-08-14)
**Owner:** Shashank Mishra

> The known-issues register and the complete archive map for all superseded documentation.
> This is the final document in the linear reading path — everything after this loops back to
> `Updated Docs/README.md`.

---

## 1. Known Issues & Gaps

| ID | Issue | Status (2026-08-14) |
|----|-------|---------------------|
| KI-001 | Demo account passwords not stored in repo (owner's secure channel) | Open — by design |
| KI-002 | External (partner-side) SETU participation unproven — blocked on partner integration | Open — blocked |
| KI-003 | Render backup URLs historically return 503 (cold sleep); URL subdomains changed across doc versions | Open — confirm from Render dashboard |
| KI-004 | `backend/gateway.env`, `agent.env`, `langgraph.env` referenced by root compose do not exist | Open — root compose is legacy; use `backend/docker-compose.production.yml` |
| KI-005 | Client-login datetime bug (offset-naive/aware) previously recorded in `handover/07` | **Not reproduced 2026-08-14** — treat as fixed |
| KI-006 | Frontend references routes absent from live OpenAPI: `POST /v1/client/shortlist`, `POST /v1/client/review/{candidateId}`, `GET /v1/analytics/skills`, `GET /v1/analytics/funnel`, `GET /v1/tasks` | Open — stale frontend references (`src/services/api.ts`) |
| KI-007 | `frontend/src/routes.tsx` redundant/unused (use `App.tsx`) | Open — cleanup |
| KI-008 | Empty stub pages: `frontend/src/pages/hr/*` (3), `frontend/src/pages/auth/HRAuth.tsx` | Open — stubs |
| KI-009 | `test_gateway_imports.py` returns values instead of asserting (pytest warning) | Open — minor refactor |
| KI-010 | Frontend bundle >500 kB chunk warning | Open — code-splitting recommended |
| KI-011 | `docs/RELEASE_HISTORY.md` only exists on the VM, not in the repo | Open — by design |
| KI-012 | `handover/12_DEMONSTRATION_SESSION.md` duplicate of `12_DEMO_SESSION.md` | Resolved — archived; index note added |
| KI-013 | Streamlit portals (`portal`, `client_portal`, `candidate_portal`) marked LEGACY | Open — retained for reference |
| KI-014 | No tests in CI/CD pipeline — broken code deploys directly to production (`deploy.yml` has zero `pytest` or `npm test` steps) | Open — critical gap |
| KI-015 | No automated frontend tests (no Jest, Vitest, Playwright, or Cypress configured) | Open — `npm run build` (type-check) is only verification |
| KI-016 | No database migration framework — schema changes use ad-hoc scripts (`migrate_mongodb_schema.py`, `migrate_interview_dates.py`) | Open — no versioned migration tool |
| KI-017 | No `pytest.ini` at `backend/` root (only exists under `tests/e2e/control_center/`); running `pytest` from `backend/` produces `PytestUnknownMarkWarning` | Open — config gap |
| KI-018 | Ecosystem start script (`scripts/start_all_ecosystem_services.ps1`) requires all 9 partner repos cloned locally — no graceful degradation if a partner folder is missing | Open — hardcoded paths |
| KI-019 | No `CODEOWNERS` or branch protection configuration — no automated code review assignment | Open — repo governance gap |
| KI-020 | No `.env.example` at project root (only in `backend/` and `frontend/`) — new developers must know where to look | Open — developer experience |
| KI-021 | `RELEASE_HISTORY.md` exists only on VM (`/var/tmp/SAMPADA/`), not in the repo — rollback history invisible to local developers | Open — by design, but limits visibility |
| KI-022 | Stale `package-lock.json` at root (real lockfile is at `frontend/package-lock.json`) | Open — minor cleanup |

---

## 2. Documentation Discrepancies Fixed by This Update

| Previous claim | Fixed value |
|----------------|-------------|
| "111 operational API endpoints" | 204 total live (gateway 172 · agent 6 · langgraph 26) |
| Endpoint counts inconsistent (108/111/112/~130) | Single authoritative source: live `/openapi.json` |
| `README.md` dead `file:///c:/Users/Shani/...` links | Relative links; primary reference → `Updated Docs/README.md` |
| Stale `C:\Users\Shani\.gemini\...` scratch paths in README | Removed; pointed to verified test harnesses |
| `Handover.md` links to non-existent files | Replaced by `Updated Docs` + archive index |
| Render URL subdomain inconsistency | Documented as "confirm from dashboard"; VM is verified primary |

---

## 3. Archive Map (outdated docs → `Updated Docs/archived/`)

All originals remain on disk (non-destructive); obsolete source paths are appended to `.gitignore`.

| Source location | Archived copy |
|-----------------|---------------|
| Root `*.md` (README, QUICK_START, Handover, REVIEW_PACKET, SAMPADA_CURRENT_STATE, ECOSYSTEM_REPOSITORY_MAP, CONTRIBUTION_LOG, PARTNER_SETU_LIVE_RUNBOOK, VANA_* ) | `archived/root/` |
| `docs/` (30 files + schemas/postman/requests) | `archived/docs/` |
| `handover/` (00–13, IMPLEMENTATION_PLAN, evidence/) | `archived/handover/` |
| `backend/docs/` (8 subfolders) | `archived/backend-docs/` |
| `backend/handover/` (21 files) | `archived/backend-handover/` |
| `frontend/README.md`, `AUTHENTICATION_STRUCTURE.md`, `VERCEL_DEPLOYMENT.md` | `archived/frontend/` |

**131 files archived.** Keep `evidence/` live (it is proof artifacts, not superseded docs).

---

## 4. .gitignore Changes (appended 2026-08-14)

Preserved all prior entries, then appended the superseded documentation paths so they stop being
tracked while remaining on disk:

```text
# Archived documentation (superseded by "Updated Docs/") — 2026-08-14
Updated Docs/archived/root/
Updated Docs/archived/docs/
Updated Docs/archived/handover/
Updated Docs/archived/backend-docs/
Updated Docs/archived/backend-handover/
Updated Docs/archived/frontend/
```

> Note: the archived copies live **inside** `Updated Docs/` so the archive is self-contained; the
> `.gitignore` entry for the source locations (e.g. `docs/`, `handover/`, `backend/docs/`,
> `backend/handover/`) is applied so the *originals* are no longer committed.

---

## 5. Document Map (this documentation set)

| Doc | Purpose |
|-----|---------|
| `00_VERIFICATION_REPORT.md` | What was tested (live + local) and results |
| `01_PROJECT_OVERVIEW.md` | Product, roles, scale, stack |
| `02_REPOSITORY_STRUCTURE.md` | Full verified folder map |
| `03_ARCHITECTURE.md` | Services, ports, data flows |
| `04_SETUP_AND_RUN.md` | Local setup + run steps |
| `05_BACKEND_REFERENCE.md` | Service internals + env inventory |
| `06_API_REFERENCE.md` | Live endpoint inventory (204 ops) |
| `07_AUTHENTICATION_AND_SECURITY.md` | Triple-auth, 2FA, security controls |
| `08_DATABASE.md` | Mongo collections, schemas, seed |
| `09_FRONTEND_REFERENCE.md` | Routes, pages, services, contexts |
| `10_TESTING_AND_EVIDENCE.md` | Test suites + evidence artifacts |
| `11_DEPLOYMENT.md` | Docker, CI/CD, VM/Render/Vercel |
| `12_OPERATIONS_RUNBOOK.md` | Monitoring, health, rollback |
| `13_GOVERNANCE_CONTROL_CENTER.md` | Governance/workforce/control-center |
| `14_SCOPE_SPRINTS_VANA.md` | SETU, sprints, VANA, partners |
| `15_KNOWN_ISSUES_ARCHIVE_INDEX.md` | Gaps + archive map (this doc) |

**Reading path is strictly linear** (00 → 15 → back to `README.md`); no document references a later
document except the explicit "Next" pointers, which form a single forward chain with no loops.

---

## 6. Final Recommendations

1. Remove/replace stale frontend route references (KI-006) in a future code task.
2. Confirm Render service names and update `11_DEPLOYMENT.md` when verified.
3. Complete partner SETU integration (KI-002) to unblock external participation.
4. Optionally code-split the frontend bundle (KI-010).
5. Refactor `test_gateway_imports.py` asserts (KI-009).
6. **Add test execution to CI/CD pipeline** (KI-014) — even a basic smoke test gate would prevent broken deploys.
7. **Add frontend test framework** (KI-015) — Vitest or Playwright for critical user flows.
8. **Add `pytest.ini` to `backend/` root** (KI-017) with proper marker registration.
9. **Add root `.env.example`** (KI-020) pointing to `backend/.env.example` and `frontend/.env.example`.
10. **Remove stale root `package-lock.json`** (KI-022).
11. **Add graceful degradation** to ecosystem launcher (KI-018) — skip missing partner repos instead of failing.

---

## 7. End of Linear Path

→ **Return to the master index: [`README.md`](README.md)**
