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

> Comprehensive profiles are in `16_ECOSYSTEM_INTEGRATION_REFERENCE.md`. Summary below.

| Repo | Technology | Purpose | Connection Method |
|------|------------|---------|-------------------|
| **Artha** | Node.js 18+ / Express / MongoDB (Mongoose 8.x) / Redis 7+ (backend) + React/Vite (frontend) + Python/FastAPI (AI platform) | India-compliant accounting: double-entry HMAC hash-chain ledger (35 models, 47 services), GST GSTR-1/GSTR-3B, TDS (194A/194C/194H), invoicing, expense management, 30+ BHIV governance endpoints. | Port 5000. SETU Pipeline + `sampada_adapter.py` → signals to Gateway. Bucket Lineage anchoring. GC Shakti constitutional validation. Render deploy: `ai-uploader-agent`. |
| **ai-crm** | Node.js/Express/MongoDB (Mongoose 8.x) + Python/FastAPI + React/Vite | Logistics/inventory AI CRM: product catalog (5 collections, 40+ endpoints), order lifecycle, inventory tracking, threshold-based restock automation. | Ports 8001 (Python) / 8002 (Node.js). SETU Pipeline + `bucket_lineage_adapter.py` + `sovereign_routing_adapter.py` + `niyantran_integration_adapter.py`. Render deploy: `pratham-setu-ai-crm`. |
| **Karma-Tracker** | Python 3.12 / FastAPI / Uvicorn + MongoDB + NumPy + NetworkX | KarmaChain v2.3: dual-ledger karma accounting (DharmaPoints, SevaPoints, PunyaTokens, PaapTokens, DridhaKarma), Q-Learning adaptive scoring, 7 cognitive states, lifecycle simulation. | Port 8030 (Docker). **Passive mode** — consumes ONLY from Bucket. Emits KarmaSignal ONLY to Bucket. STP Bridge for telemetry forwarding. |
| **Prana** | Vanilla JS ES modules (4 files, browser-only) | Cognitive state capture engine: focus, keystrokes, mouse, scroll, hover, idle, dwell signals. Evaluates into 7 states (ON_TASK through DEEP_FOCUS). Truth packets every 5s. | Client-side → `POST /api/v1/bucket/prana/ingest` (Bucket). Batch size 5, retry w/ backoff, offline queue in localStorage. Kill switch: `window.PRANA_DISABLED = true`. |
| **bucket** | Python 3.11 / FastAPI + MongoDB + Redis | Append-only immutable storage ("system memory, never system decision"). 50+ governance endpoints, SHA-256 chained artifacts, PRANA ingest, 12 AI agent registry, basket execution system. | Port 8001 (Docker ecosystem). Central storage bus — all modules write/read artifacts here. |
| **bhiv-registry** | Python 3.12 / FastAPI + PostgreSQL 16 (async SQLAlchemy 2.0) + Alembic | Federated dataset metadata registry (MDU). 45 endpoints, canonical ID enforcement, trust classification, append-only provenance, RBAC (4 roles), GC Shakti validation. | Port 8020. Live: `https://bhiv-mdu-api.onrender.com`. Central metadata authority for TANTRA ecosystem. |
| **bhiv-intelligence-samachar** | Python/FastAPI + Next.js 14 + OpenAI/Grok/Gemini/Ollama + MongoDB | News AI platform: unified-workflow (scrape → vet → summarize → video), credibility scoring (0-100), multi-model LLM fallback, TTS (gTTS). Sub-systems: Noopur, Sankalp, Seeya. | Render deploy: `news-ai-backend` + `news-ai-frontend`. Independent service, no runtime exchange with Sampada HR. |
| **bhiv-SVACS** | Python/FastAPI + PyTorch 2.6 (CPU) + YOLOv8 + EasyOCR + React/Vite | Maritime vessel detection & classification: EfficientNet classifier, YOLOv8 object detection, OCR capabilities. | Render deploy: `bhiv-svacs` + `bhiv-svacs-1` (static). Independent CV service with Bucket verification. |
| **workflow-blackhole** | Node.js/Express 5.1/MongoDB (Mongoose 8.14)/Socket.IO 4.8 + React 19/Vite 6.3/Tailwind 4.1 | Core workforce management (tasks, attendance, salary, leave, monitoring, AI optimization). **Orchestration hub** — Docker Compose starts Bucket, PRANA, Karma, Redis, MongoDB. | Port 5000 (backend) / 80 (frontend via Nginx). 6-service Docker stack on `niyantran` network. Contains embedded build contexts for Bucket, PRANA, Karma. |

Canonical repo map: `ECOSYSTEM_REPOSITORY_MAP.md` (archived → `Updated Docs/archived/root/`). Full profiles: `16_ECOSYSTEM_INTEGRATION_REFERENCE.md`.

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
