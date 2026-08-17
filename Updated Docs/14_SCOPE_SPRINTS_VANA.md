# 14 — Scope, Sprints & Reusability (SETU / VANA)

**Status:** ✅ Summarized from verified source docs (2026-08-14)
**Owner:** Shashank Mishra

> The SETU ecosystem, the Sampada+SETU convergence sprints, the VANA reusability audits, and the
> partner runbooks. Read after `13_GOVERNANCE_CONTROL_CENTER.md`.

---

## 1. The SETU Ecosystem

SETU is the unified operational ecosystem that aggregates cross-domain intelligence. Sampada
participates **additively** — it posts signals to `POST /v1/setu/signals/{signal_type}` and never
takes ownership of partner execution.

| System | Owner | Role in SETU | Port |
|--------|-------|--------------|------|
| Sampada (this platform) | Soham Kotkar & Vijay Dhawan | Hiring + workforce intelligence, HR visibility | 8000/9000/9001 |
| Niyantran | Rudra | Tasking, reviews, testing, execution telemetry, payroll participation | 5001 |
| Artha | Ashmit | Financial systems, payroll truth | 5000 |
| Logistics | Soham Kotkar & Vijay Dhawan | Logistics systems | — |
| CRM | Soham Kotkar & Vijay Dhawan | Relationship intelligence | 8001/8002 |
| SETU | Soham Kotkar & Vijay Dhawan | Aggregation, cross-domain intelligence, unified operational visibility | — |

### Integration Repository Details

| Repo | Technology | Purpose | Connection Method |
|------|------------|---------|-------------------|
| **Artha** | Node.js 18+ / Express / MongoDB 7+ / Redis 7+ (backend) + React/Vite (frontend) + Python/FastAPI (AI platform) | India-compliant accounting: double-entry ledger (HMAC hash chain), GST/TDS compliance, invoicing, expense management. Has `Sampada Adapter` that maps Artha signals to `SetuSignalIngest` envelopes. | Port 5000. SETU Pipeline + Sampada Adapter → signals to Gateway. Render deploy: `ai-uploader-agent`. |
| **ai-crm** | Node.js/Express + Python/FastAPI + React/Vite | Logistics/inventory AI CRM: product catalog, order management, inventory tracking, supplier management, restock automation. Has dedicated `setu/` directory with `sampada_dispatcher.py`, `bucket_lineage_adapter.py`, `sovereign_routing_adapter.py`, `niyantran_integration_adapter.py`. | Ports 8001 (Python) / 8002 (Node.js). SETU Pipeline + Bucket Lineage + Sovereign Routing + Niyantran adapter. Render deploy: `pratham-setu-ai-crm`. |
| **Karma-Tracker** | Python/FastAPI/Uvicorn + MongoDB + numpy + networkx | KarmaChain v2.3: Vedic-inspired karma scoring (DharmaPoints, SevaPoints, PunyaTokens, PaapTokens), Q-Learning integration, behavioral state normalization, lifecycle simulation (Birth/Life/Death/Rebirth). | Port 8030. **Passive mode** for PRANA integration — consumes PRANA packets ONLY from Bucket (never directly from PRANA). Emits KarmaSignal ONLY to Bucket. Has STP Bridge for secure telemetry forwarding. |
| **Prana** | Pure JavaScript ES modules (4 files, browser-only) | Browser cognitive state engine: captures focus, attention, mouse, keyboard, scroll signals. Evaluates into cognitive states (ON_TASK, THINKING, IDLE, DISTRACTED, AWAY, OFF_TASK, DEEP_FOCUS). Builds truth packets every 5 seconds. | Client-side library. Sends packets to Bucket via `bucket_bridge.js` → `POST localhost:8010/api/v1/bucket/prana/ingest`. Global `window.PRANA` namespace. Kill switch: `window.PRANA_DISABLED = true`. |
| **bhiv-intelligence-samachar** | Next.js 14 (App Router) + Python/FastAPI + SQLAlchemy + PostgreSQL + MongoDB. AI: OpenAI, Groq, Gemini, Ollama. | AI news analysis ("Noopur"/"Sankalp"/"Seeya"): ingests live news, verifies credibility, summarizes, discovers video coverage. Also has educational backend with task/project management. | Tier-2 Render deploy: `news-ai-backend` + `news-ai-frontend`. Bucket integration + Karma tracker integration. CORS allows multiple BHIV domains. |
| **bhiv-registry** | PostgreSQL | InsightFlow registry. One-time setup via `scripts/setup_insightflow_postgres.ps1`. | Port 8020. Local PostgreSQL (`bhiv_registry` database). |
| **bucket** | — | Lineage anchoring / data store. Central hub for all SETU signals and Prana packets. | Port 8010. Receives Prana packets, Karma signals, and all partner dispatches. |

Canonical repo map: `ECOSYSTEM_REPOSITORY_MAP.md` (archived → `Updated Docs/archived/root/`).

---

## 2. SETU Live Runbook (`PARTNER_SETU_LIVE_RUNBOOK.md` — archived)

- 9-section closeout runbook: per-partner behaviour, per-system deployment checklist, individual +
  integrated test procedures.
- Partner dispatch flow: Niyantran / Artha / CRM / Logistics → `POST /v1/setu/signals/{signal_type}`
  on the live gateway.
- Evidence: `evidence/live_workforce_governance_setu/partner_live/20260702T073708Z/` (Tier-2
  dispatcher invoked directly; partner servers not booted).

---

## 3. Sampada + SETU Convergence (Product Owner / Sprint Docs)

Sprint folder: `Sampada + SETU Product Owner (Convergence And Production Transition Lead)/` and the
master sprint file
`Live WO, GE & SETU Participation Sprint (Sampada Convergence and Expansion Builder).md` (374 lines).

| Element | Detail |
|---------|--------|
| Sprint title | Live WO / GE / SETU Participation (Sampada Convergence and Expansion Builder) |
| Workflow | 12-step table with harness entry points, Tier definitions |
| Deliverables | 16-item registry |
| Verification | Workforce/governance/SETU runtime exercised end-to-end (2026-06-27): one employee threaded through Created→Assigned→Transferred→Promoted→Moved→Offboarding→Replay under a single correlation id |

All sprint docs are gitignored at the repo root (see `.gitignore`) — treat them as working
artifacts, not canonical docs.

---

## 4. Live WO / GE / SETU Evidence Summary

- Live runtime evidence captured 2026-06-27 (`evidence/live_workforce_governance_setu/SUMMARY.md`).
- Partner-initiated live SETU dispatch (Tier 2) captured 2026-07-02.
- External (partner-side) SETU participation remains **unproven** — blocked on external owner
  integration. Treat as open blocker (also in `15_KNOWN_ISSUES_ARCHIVE_INDEX.md`).

---

## 5. VANA Reusability Audits

### Sampada (`VANA_REUSABILITY_SAMPADA.md` — archived)

- AST metrics: **391 modules / 276 classes / 2239 functions / 125 test files**.
- 9-point reusability matrix; per-folder AST table; evidence: 32 passed tests.
- Purpose: assess which parts of Sampada can be reused by other BHIV platforms.

### Samachar (`VANA_REUSABILITY_SAMACHAR.md` — archived)

- Audit of `bhiv-intelligence-samachar`: unified-news-workflow, authenticity check, LLM fallback
  router, TTS engine — **zero blockers**.

Both repos (`bhiv-SVACS/`, `bhiv-intelligence-samachar/`) are gitignored working copies.

---

## 6. Partner Repositories (gitignored — reference only)

All integration repos are independently cloned git repos (not submodules). Each has its own `.git/`
directory and version history. They are vendored for integration reference and are **out of scope**
for this documentation set.

| Repo | Key Endpoints | Integration File(s) in Repo |
|------|---------------|----------------------------|
| `Artha/` | `/api/v1/ledger/*`, `/api/v1/invoices/*`, `/api/v1/gst/*`, `/api/v1/tds/*`, `/api/v1/reports/*`, `/api/v1/governance/*` (30+ BHIV governance endpoints) | `INTEGRATION.md`, `render.yaml`, `docker-compose.yml` |
| `ai-crm/` | `/api/auth/*`, `/api/products/*`, `/api/orders/*`, `/api/inventory/*`, `/api/restock/*` | `backend/setu/sampada_dispatcher.py`, `integration/bucket_lineage_adapter.js`, `integration/sovereign_routing_adapter.js` |
| `Karma-Tracker/` | `POST /v1/karma/event`, `GET /api/v1/karma/{user_id}`, `POST /api/v1/feedback_signal`, `GET /api/v1/analytics/karma_trends`, `POST /v1/karma/lifecycle/simulate` | `karma-tracker/main.py`, `context_weights.json` |
| `Prana/` | N/A (client-side library, no server) | `signals.js`, `prana_state_engine.js`, `prana_packet_builder.js`, `bucket_bridge.js` |
| `bhiv-intelligence-samachar/` | Unified tools backend (FastAPI) + main backend (FastAPI/SQLAlchemy) | `unified_tools_backend/main.py`, `BUCKET_INTEGRATION_COMPLETE.md` |
| `bhiv-registry/` | PostgreSQL-based registry | `setup_insightflow_postgres.ps1` |
| `bhiv-SVACS/` | Present in root, integration reference | — |
| `workflow-blackhole/` | Present in root, integration reference | — |
| `bucket/` | Lineage anchoring hub | Central hub for all SETU signals |

---

## 7. Handover Recipients & Ownership

- Handover prepared for **Vijay Dhawan** and **Soham Kotkar** (transfer model — no formal sign-off
  person; "transfer recipients continue from docs").
- Owner: Shashank Mishra. System Owners: Soham Kotkar & Vijay Dhawan (Sampada), Rudra (Niyantran), Ashmit (Artha).
- User decisions (from archived `handover/00_INDEX.md`): git `main` only; no secret rotation
  (document locations only); scope = `gateway + agent + langgraph + frontend/`
  (`candidate_portal`/`client_portal`/`portal` archived).

---

## 8. Contribution Log

`CONTRIBUTION_LOG.md` (archived) records 2026-05-26 → 07-02 history, the architectural
contributions table, and open blockers: partner contacts, Artha payroll API, sign-off.

---

## 9. Next

→ `15_KNOWN_ISSUES_ARCHIVE_INDEX.md` (final document — closes the linear path back to the index).
