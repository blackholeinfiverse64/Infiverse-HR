# 16 — Ecosystem Integration Reference

**Status:** ✅ Verified — comprehensive codebase inspection (2026-08-17)
**Owner:** Shashank Mishra

> Deep-dive reference for all 9 integrated repositories in the BHIV/SETU ecosystem. Covers
> technology stacks, entry points, API inventories, database models, integration methods,
> deployment configs, and operational status. Read after `15_KNOWN_ISSUES_ARCHIVE_INDEX.md`.

---

## 1. Integration Architecture Overview

The INFIVERSE-HR-PLATFORM (Sampada) sits at the center of a broader ecosystem. Partner repositories
are independently cloned git repos (not submodules), vendored for integration reference and runtime
orchestration. Each has its own `.git/` directory and version history.

### 1.1 Integration Data Flow

```text
                        [Browser / Client Apps]
                                |
                    +-----------+-----------+
                    |                       |
              [PRANA JS lib]          [Sampada Frontend]
           (cognitive signals)      (React 18 + Vite)
                    |                       |
                    v                       v
            [Bucket :8001]        [Sampada Gateway :8000]
           (append-only store)    (auth, jobs, candidates,
                    ^              governance, SETU)
                    |                       |
         +----------+----------+    +------+------+------+
         |          |          |    |             |      |
   [Karma]    [Artha]    [ai-crm]  [Agent]  [LangGraph]
   reads only  SETU sigs  SETU sigs :9000     :9001
   from Bucket to Gateway to Gateway  (AI match) (workflow,
         |          |          |               notifications,
         |          |          |               RL engine)
         +----------+----------+
                    |
         [workflow-blackhole]
         (Docker Compose orchestrator)
         starts: Bucket, PRANA, Karma, Redis, MongoDB
```

### 1.2 Dependency Chain

| Order | System | Depends On | Role |
|-------|--------|-----------|------|
| 1 | MongoDB Atlas / Redis | — | Data stores |
| 2 | bucket | MongoDB, Redis | Central storage bus |
| 3 | Prana | bucket (sends TO) | Browser signal capture |
| 4 | Karma-Tracker | bucket (reads FROM only) | Behavioral scoring |
| 5 | Sampada Gateway | MongoDB, Agent, LangGraph | API gateway |
| 6 | Sampada Agent | MongoDB | AI matching |
| 7 | Sampada LangGraph | MongoDB | Workflow orchestration |
| 8 | Artha | MongoDB, Redis, bucket, SETU | Financial systems |
| 9 | ai-crm | MongoDB, SETU, bucket, Niyantran | Logistics CRM |
| 10 | workflow-blackhole | bucket, PRANA, Karma, MongoDB, Redis | Workforce mgmt + orchestration |
| 11 | bhiv-registry | PostgreSQL | Metadata authority |
| 12 | bhiv-intelligence-samachar | MongoDB | News AI |
| 13 | bhiv-SVACS | bucket (verification) | Maritime CV |

---

## 2. Per-Repository Deep Profiles

---

### 2.1 Artha — India-Compliant Accounting System

| Attribute | Detail |
|-----------|--------|
| **Path** | `Artha/` |
| **Owner** | Ashmit |
| **Version** | v0.1 (July 10, 2026) |
| **Status** | Active, production-verified, governance enforced |

#### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend | Node.js 18+ / Express.js | ES modules |
| Database | MongoDB (Mongoose 8.x) + Redis 7+ | — |
| Frontend | React 18+ / Vite / Tailwind CSS / Recharts / Zustand | — |
| Finance | Decimal.js (precision), HMAC-SHA256 (hash-chain) | — |
| AI Platform | Python / FastAPI | — |
| Testing | Jest, Supertest | — |
| Containerization | Docker / Docker Compose | — |
| Monitoring | Sentry, PostHog, Prometheus | — |
| OCR | Tesseract.js | — |
| PDF | PDFKit | — |

#### Entry Points

| Component | File | Port |
|-----------|------|------|
| Backend API | `backend/src/server.js` | 5000 |
| Frontend | `frontend/` (Vite dev) | 5173 |
| Docker | `docker-compose.yml` | 5000 |
| Render | `render.yaml` (ai-uploader-agent) | — |

#### Database Models (35 total)

| Category | Count | Examples |
|----------|-------|---------|
| Core Accounting | 8 | Account, JournalEntry, Invoice, Expense, Payment |
| Compliance | 7 | GSTFiling, TDSRecord, ComplianceReport |
| Audit/Traceability | 4 | AuditLog, ProvenanceChain, TamperEvidence |
| BHIV Governance | 4 | CapabilityRegistry, GovernanceEnvelope, CircuitBreaker |
| Integration | 6 | SETUPipeline, SampadaAdapter, BucketAdapter |
| Financial Period | 3 | FiscalYear, PeriodClose, BalanceCarryForward |
| Analytics | 3 | CashFlowReport, ProfitLossReport, BalanceSheet |

#### Key Services (47 total)

| Category | Count | Notable |
|----------|-------|---------|
| Core Accounting | 10 | Double-entry ledger, invoice lifecycle, expense management |
| Compliance | 5 | GST GSTR-1/GSTR-3B, TDS Section 194A/194C/194H, Form 26Q |
| BHIV Governance | 9 | 30+ governance endpoints, deterministic replay, circuit breakers |
| Integration | 11 | SETU pipeline, Sampada Adapter, Bucket Lineage, Sovereign Routing |
| Runtime | 6 | Hash-chain verification, tamper detection, provenance anchoring |
| Infrastructure | 6 | Sentry, PostHog, Prometheus, health checks |
| Media | 2 | OCR extraction, PDF generation |

#### Integration Method

- **SETU Pipeline**: `sampada_adapter.py` maps Artha signals to `SetuSignalIngest` envelopes → `POST /v1/setu/signals/{signal_type}` on Sampada Gateway
- **Bucket Lineage**: Anchors provenance records to `bucket` at `/bucket/artifacts/write`
- **GC Shakti**: Calls constitutional validation at `https://shakti-gc-infra.onrender.com/governance/validate`
- **Docker Compose**: Standalone deployment; Render deploy as `ai-uploader-agent`

#### API Surface (30+ governance endpoints + standard REST)

| Category | Endpoints |
|----------|-----------|
| Ledger | `/api/v1/ledger/*` — journals, accounts, balances |
| Invoices | `/api/v1/invoices/*` — CRUD, lifecycle, PDF |
| GST | `/api/v1/gst/*` — GSTR-1, GSTR-3B, calculation |
| TDS | `/api/v1/tds/*` — section tracking, Form 26Q |
| Reports | `/api/v1/reports/*` — P&L, balance sheet, cash flow |
| Governance | `/api/v1/governance/*` — 30+ endpoints (capability registry, provenance, replay, circuit breakers, adversarial testing) |

---

### 2.2 ai-crm — Logistics & Inventory AI CRM

| Attribute | Detail |
|-----------|--------|
| **Path** | `ai-crm/` |
| **Owner** | Soham Kotkar & Vijay Dhawan |
| **Status** | Active, production-ready, MongoDB-migrated |

#### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend (Node) | Node.js 18+ / Express.js / MongoDB (Mongoose 8.x) | — |
| Backend (Python) | Python 3 / FastAPI | — |
| Frontend | React 18 / Vite 5 / Tailwind CSS / Recharts | — |
| Auth | JWT + bcryptjs | — |
| Email | Nodemailer | — |
| Real-time | socket.io-client | — |
| Deployment | Render (`pratham-setu-ai-crm`) | — |

#### Entry Points

| Component | File | Port |
|-----------|------|------|
| Node Backend | `backend-nodejs/src/server.js` | 8000 (standalone) |
| Python Backend | `backend/` (FastAPI) | 8001 |
| Frontend | `frontend/` (Vite) | 5173 |
| Docker | `render.yaml` | — |

#### Database Models (5 collections)

| Collection | Purpose |
|-----------|---------|
| `users` | User accounts (Admin, Manager, Customer roles) |
| `products` | Product catalog with inventory tracking |
| `orders` | Order lifecycle (placed → dispatched → delivered) |
| `inventory_logs` | Stock movement audit trail |
| `restock_requests` | Automated threshold-based restock triggers |

#### API Endpoints (40+)

| Category | Endpoints |
|----------|-----------|
| Auth | `/api/auth/login`, `/api/auth/register`, `/api/auth/me` |
| Users | `/api/users/*` — CRUD, role management |
| Products | `/api/products/*` — CRUD, search, categories |
| Orders | `/api/orders/*` — place, dispatch, deliver, history |
| Inventory | `/api/inventory/*` — stock levels, alerts, adjustments |
| Restock | `/api/restock/*` — requests, approval, automation |
| Dashboard | `/api/dashboard/*` — stats, analytics, charts |

#### Integration Method

- **SETU Pipeline**: Has dedicated `setu/` directory with `sampada_dispatcher.py`, `bucket_lineage_adapter.py`, `sovereign_routing_adapter.py`, `niyantran_integration_adapter.py`
- **Bucket Lineage**: `bucket_lineage_adapter.js` for artifact writes
- **Sovereign Routing**: `sovereign_routing_adapter.js` for data sovereignty compliance
- **Niyantran**: `niyantran_integration_adapter.js` for task telemetry forwarding
- **Environment**: `SETU_MITRA_API_KEY` env var connects to SETU integration layer

---

### 2.3 Karma-Tracker — Vedic Karma Scoring System

| Attribute | Detail |
|-----------|--------|
| **Path** | `Karma-Tracker/` |
| **Owner** | Transferred to BHIV Task Bank (Jan 5, 2026) |
| **Version** | KarmaChain v2.3 |
| **Status** | Active, **passive observation mode** |

#### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend | Python 3.12 / FastAPI / Uvicorn | — |
| Database | MongoDB (pymongo + dnspython) | — |
| ML/AI | NumPy, NetworkX, Matplotlib | — |
| Security | cryptography library | — |
| Testing | pytest, pytest-asyncio, pytest-cov | — |
| Containerization | Docker / Docker Compose | — |

#### Entry Points

| Component | File | Port |
|-----------|------|------|
| Main API | `karma-tracker/main.py` | 8003 (standalone) / 8030 (Docker ecosystem) |
| Health | `/health` | — |

#### API Modules

| Category | Endpoints |
|----------|-----------|
| Karma Lifecycle | Birth, death, rebirth, prarabdha simulation |
| Karma Accounting | Balance, redeem, policy evaluation |
| Rnanubandhan | Karmic debt relationship tracking |
| Agami Karma | Future karma prediction |
| Behavioral Normalization | Multi-module input unification |
| Karmic Feedback | Net karmic influence computation |
| Karmic Analytics | Trend data, chart generation, weekly exports |
| STP Bridge | Secure telemetry forwarding (Unreal Engine, InsightFlow) |
| Event Bus | Real-time event broadcasting |

#### Data Model (Dual-Ledger)

| Token Type | Description |
|-----------|-------------|
| DharmaPoints | Righteous action score |
| SevaPoints | Service/selflessness score |
| PunyaTokens | Merit accumulation |
| PaapTokens | Demerit accumulation |
| DridhaKarma | Fixed/destined karma balance |

#### Integration Method

- **Sovereign Isolation Lockdown**: Consumes events **ONLY from Bucket endpoints** — all direct application-facing APIs are disabled
- **Emits**: KarmaSignal **ONLY to Bucket** at `/bucket/artifacts/write`
- **PRANA Flow**: `PRANA → Bucket → Karma` (passive observation, no scoring yet)
- **Docker**: Started as `niyantran_karma` in workflow-blackhole's Docker Compose
- **Dependency**: Requires `bhiv-bucket` service healthy (B7 authorization constraint)

---

### 2.4 Prana — Cognitive State Signal Engine

| Attribute | Detail |
|-----------|--------|
| **Path** | `Prana/` |
| **Type** | Browser-only client-side library (4 JS files) |
| **Status** | Active, integrated |

#### Technology Stack

| Layer | Technology |
|-------|-----------|
| Runtime | JavaScript (browser, ES modules) |
| Framework | None (vanilla JS, singleton pattern) |
| Storage | localStorage (offline queue persistence) |

#### Files

| File | Purpose |
|------|---------|
| `signals.js` | Raw signal capture (focus, visibility, keystrokes, mouse, scroll, hover, idle, dwell, rapid clicks, app switches) |
| `prana_state_engine.js` | Evaluates raw signals into 7 cognitive states every 1 second |
| `prana_packet_builder.js` | Builds unified truth packets every 5 seconds |
| `bucket_bridge.js` | Reliable delivery to Bucket with batch processing, retry, offline queue |

#### Cognitive States

| State | Description |
|-------|-------------|
| `ON_TASK` | Active, focused work |
| `THINKING` | Paused but engaged |
| `IDLE` | No significant input |
| `DISTRACTED` | Erratic input patterns |
| `AWAY` | No input for extended period |
| `OFF_TASK` | Active but non-productive patterns |
| `DEEP_FOCUS` | Sustained focused work (>15s continuous) |

#### Truth Packet Schema (every 5 seconds)

```json
{
  "user_id": "string",
  "session_id": "string",
  "cognitive_state": "ON_TASK|THINKING|IDLE|DISTRACTED|AWAY|OFF_TASK|DEEP_FOCUS",
  "time_accounting": { "active": "float", "idle": "float", "away": "float" },
  "focus_score": "0-100 (deterministic)",
  "raw_signals": { "keystrokes": "int", "mouse_events": "int", "scroll_depth": "float", "..." }
}
```

#### Integration Method

- **Endpoint**: `POST /api/v1/bucket/prana/ingest` (Bucket service)
- **Batch size**: 5 packets per batch
- **Retry**: Exponential backoff, max 3 retries
- **Offline**: Queue persisted to localStorage, drained on reconnect
- **Kill switch**: `window.PRANA_DISABLED = true`
- **Global namespace**: `window.PRANA.init(config)`
- **Systems**: Supports both Gurukul (education) and EMS (employee management) types

---

### 2.5 Bucket — Append-Only Immutable Data Storage

| Attribute | Detail |
|-----------|--------|
| **Path** | `bucket/` |
| **Role** | Central storage bus — "System memory, never system decision" |
| **Status** | Active, foundational infrastructure |

#### Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.11 / FastAPI / Uvicorn |
| Database | MongoDB (pymongo) + Redis |
| Real-time | python-socketio, websockets |
| HTTP | httpx, aiohttp |
| Logging | structlog |
| Deployment | Render |

#### Entry Points

| Component | File | Port |
|-----------|------|------|
| Main API | `main.py` | 3000 (local) / 8001 (Docker ecosystem) |
| Health | `/health` | — |
| Docker | Render deploy | — |

#### Core Capabilities

| Feature | Description |
|---------|-------------|
| Append-Only Storage | Cryptographically chained artifacts with SHA-256 deterministic hashes |
| Artifact Envelope | Strict schema: `artifact_id, trace_id, timestamp_utc, schema_version, source_module_id, artifact_type, parent_hash, payload` |
| Agent Framework | Registry + Runner for 12 AI agents (law_agent, cashflow_analyzer, financial_coordinator, fuel_efficiency, goal_recommender, gurukul, sanskrit_parser, vedic_quiz_agent, vehicle_maintenance, workflow, textToJson, auto_diagnostics) |
| Basket System | Agent baskets with sequential/parallel execution strategies |
| PRANA Ingest | Dedicated `/api/v1/bucket/prana/ingest` for browser cognitive signals |
| Governance | 50+ `/governance/*` endpoints (integration gates, executor lanes, escalation protocols, owner principles, artifact admission, provenance, retention policies for GDPR/legal hold/DSAR) |
| Audit Middleware | Full audit trail for all operations |
| Socket.IO | Event forwarding to real-time clients |

#### API Surface (50+ governance endpoints + core CRUD)

| Category | Endpoints |
|----------|-----------|
| Core Storage | `/bucket/artifacts/write`, `/bucket/artifacts/read`, `/bucket/latest-hash` |
| Agent API | `/run-agent`, `/run-basket`, `/create-basket`, `/agents`, `/baskets` |
| PRANA Ingest | `/api/v1/bucket/prana/ingest` |
| Governance | 50+ `/governance/*` — info, snapshot, artifacts, provenance, retention, integration gates, executor lanes, escalation protocols, owner principles |

#### Integration Method

- **Central hub**: All modules write/read artifacts here
- **PRANA → Bucket**: Browser signals ingested at `/api/v1/bucket/prana/ingest`
- **Karma ← Bucket**: Reads artifacts only (sovereign isolation)
- **Artha → Bucket**: Anchors lineage records
- **SVACS → Bucket**: Verification artifacts
- **Docker**: Started as `niyantran_bucket` on port 8001 in workflow-blackhole's Compose

---

### 2.6 bhiv-registry — Federated Dataset Metadata Registry (MDU)

| Attribute | Detail |
|-----------|--------|
| **Path** | `bhiv-registry/` |
| **Registry ID** | BHIV-IDU-REGISTRY-V1 |
| **Status** | Active, deployed on Render |

#### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| API | Python 3.12 / FastAPI | 0.115.0 |
| Database | PostgreSQL 16 (async) | — |
| ORM | SQLAlchemy 2.0 | asyncpg driver |
| Migrations | Alembic | 1.14.0 |
| Validation | Pydantic | 2.10.0 |
| Auth | API Key + RBAC middleware | — |
| Containerization | Docker / Docker Compose | — |
| Hosting | Render (Singapore region) | — |

#### Entry Points

| Component | File | Port |
|-----------|------|------|
| API | `backend/app/main.py` | 8000 (standalone) / 8020 (ecosystem) |
| Health | `/health`, `/` | — |
| Seed | `seed_api_keys.py`, `full_ecosystem_seed.py` | — |

#### API Surface (45 Endpoints)

| Category | Count | Endpoints |
|----------|-------|-----------|
| Datasets | 10 | Register, list, get, update, delete, search, by-domain, by-trust |
| Schemas | 5 | Register, list, get, validate, version |
| Relationships | 4 | Create, list, get, delete |
| Discovery | 8 | Search, by-tag, by-domain, by-trust, recommended, related, stats, export |
| Onboarding | 5 | Validate, register, status, batch, preview |
| Artifacts | 8 | Register, list, get, update, delete, by-type, by-source, provenance |
| Audit | 3 | Log, list, export |
| Health | 2 | Health, readiness |

#### Data Model

- Canonical ID format: `BHIV-DS-{DOMAIN}-{NAME}-{NUMBER}`
- Trust classification with lifecycle doctrine
- Append-only provenance tracking
- Canonical artifact registries: Semantic, Doctrine, Decision, Capability, Ontology, Authority, Contract

#### Integration Method

- **Central metadata authority** for the TANTRA ecosystem
- **GC Shakti**: Calls constitutional validation at `https://shakti-gc-infra.onrender.com/governance/validate`
- **Consumers**: bhiv-intelligence-samachar (registry_mapping_rules.md), Artha, other modules
- **RBAC**: VIEWER, CONTRIBUTOR, GOVERNANCE_REVIEWER, REGISTRY_ADMIN
- **Live**: `https://bhiv-mdu-api.onrender.com`

---

### 2.7 bhiv-intelligence-samachar — News AI Platform

| Attribute | Detail |
|-----------|--------|
| **Path** | `bhiv-intelligence-samachar/` |
| **Sub-systems** | Noopur (backend), Sankalp (intelligence), Seeya (vision/analytics) |
| **Status** | Active, deployed on Render |

#### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend | Python 3.11 / FastAPI / Uvicorn | — |
| Frontend | Next.js 14 (App Router) / TypeScript / Tailwind CSS | — |
| AI | OpenAI, Grok (Grok SDK), Ollama/Llama (local), Google Gemini | — |
| Scraping | BeautifulSoup4, httpx | — |
| TTS | gTTS (Google Text-to-Speech) | — |
| Database | MongoDB (via Mongoose in Next.js) | — |
| Deployment | Render (two services: backend + frontend) | — |

#### Entry Points

| Component | File | Port |
|-----------|------|------|
| Backend API | `unified_tools_backend/main.py` | 8000 |
| Frontend | `blackhole-frontend/` (Next.js) | 3000 |
| Render Backend | `news-ai-backend` | — |
| Render Frontend | `news-ai-frontend` | — |
| Start | `start-all.bat` | — |

#### Core Workflow

1. **Ingestion**: Live article scraping via unified web scraper (BeautifulSoup + Selenium fallback)
2. **Vetting**: Authenticity scoring (0-100, multi-factor credibility calculator)
3. **Summarization**: Multi-model LLM fallback (Blackhole → Grok → OpenAI → Ollama → Heuristic)
4. **Video Discovery**: YouTube integration with iframe management
5. **Storage**: MongoDB persistence with saved news feed

#### API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/unified-news-workflow` | Full pipeline: scrape → vet → summarize |
| `POST /api/authenticity-check` / `POST /api/vet` | Credibility scoring |
| `POST /api/summarize` | Content summarization |
| `POST /api/agents/task` | Agent task dispatch |
| `ws://localhost:3001` | WebSocket streaming |

#### Reusable Assets (for Vana)

1. Authenticity Vetting Engine (zero-dependency multi-factor credibility calculator)
2. Multi-Model LLM Fallback Router
3. Self-Correcting LangGraph Agent Loop (auto re-summarization if reward < 0.6)
4. Vaani Standalone TTS Engine (portable audio generation)
5. Unified Web Scraper (BeautifulSoup + Selenium fallback)

#### Integration Method

- **Independent service**: No runtime data exchange with Sampada HR platform
- **Registry alignment**: `registry_mapping_rules.md` for bhiv-registry alignment
- **CORS**: Configured for localhost:3000 and wildcard for dev
- **Key Metric**: E2E pipeline test: 10 mixed-category stories in 0.83s (deterministic mode)

---

### 2.8 bhiv-SVACS — Maritime Vessel Classification System

| Attribute | Detail |
|-----------|--------|
| **Path** | `bhiv-SVACS/` |
| **Full Name** | Smart Vessel Automatic Classification System |
| **Status** | Active, deployed on Render |

#### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend | Python 3 / FastAPI / Uvicorn | — |
| ML/CV | PyTorch (CPU-only) | 2.6.0 |
| Object Detection | YOLOv8 (ultralytics) | — |
| OCR | EasyOCR | — |
| Classification | EfficientNet (torchvision) | — |
| Frontend | React 18 / Vite 5 / TypeScript / Tailwind CSS / Zustand / Recharts | — |
| Deployment | Render (backend + static frontend) | — |

#### Entry Points

| Component | File | Port |
|-----------|------|------|
| Backend API | `backend/app/main.py` | 8000 |
| Frontend | `frontend/` (Vite) | 5173 |
| Render Backend | `bhiv-svacs` | — |
| Render Frontend | `bhiv-svacs-1` (static) | — |

#### Core Capabilities

| Feature | Description |
|---------|-------------|
| Vessel Classification | Trained EfficientNet model (`efficientnet_vessel_best.pth`) |
| Object Detection | YOLOv8 for vessel detection in images |
| OCR | Text extraction from vessel images (currently disabled) |
| Training Pipeline | `train_model.py`, `train_classifier.py`, `evaluate_model.py` |
| Auto-labeling | `auto_label.py` for dataset preparation |

#### Configuration

- Classifier model: `efficientnet_vessel_best.pth` (committed to git)
- Minimum confidence threshold: 0.60
- OCR: currently disabled
- Frontend API URL: `https://bhiv-svacs.onrender.com`

#### Integration Method

- **Independent CV service**: No runtime data exchange with Sampada HR platform
- **Bucket**: Uses Bucket for artifact storage and verification
- **Deployment**: CPU-only PyTorch optimized for Render free tier (~400MB disk)
- **Documentation**: Has review packets, data audit reports, coverage matrices

---

### 2.9 workflow-blackhole — Core Workforce Management System

| Attribute | Detail |
|-----------|--------|
| **Path** | `workflow-blackhole/` |
| **Version** | 1.0.0 |
| **Status** | Active, most operational module — central orchestration hub |

#### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend | Node.js / Express 5.1 / MongoDB (Mongoose 8.14) | — |
| Real-time | Socket.IO | 4.8 |
| Frontend | React 19.1 / Vite 6.3 / Tailwind CSS 4.1 / Shadcn-UI / Framer Motion | — |
| AI | Google Generative AI, Groq SDK, Gemini AI | — |
| OCR | Tesseract.js 6.0, screenshot-desktop | — |
| Image | Sharp, Canvas | — |
| PDF | PDFKit, jsPDF | — |
| Email | Nodemailer | — |
| Cloud | Cloudinary | — |
| Geolocation | Geolib | — |
| Database | MongoDB 6 (Docker) + Redis 7 | — |

#### Entry Points

| Component | File | Port |
|-----------|------|------|
| Server | `server/index.js` | 5000 |
| Client | `client/` (Vite) | 5173 (dev) / 80 (Nginx prod) |
| Docker | `docker-compose.yml` | 6 services |

#### Docker Compose Architecture (6 services)

| Service | Container Name | Port | Description |
|---------|---------------|------|-------------|
| `database` | — | (internal) | MongoDB 6.0 |
| `redis` | — | 6379 (internal) | Redis 7.0 (Bucket caching) |
| `bhiv-bucket` | `niyantran_bucket` | 8001 | BHIV Bucket storage |
| `bhiv-prana` | `niyantran_prana` | 8002 | BHIV PRANA signal forwarding |
| `karma-tracker` | `niyantran_karma` | 8003 | Karma-Tracker scoring |
| `backend` | — | 5000 | Express backend |
| `frontend` | — | 80 | React frontend (via Nginx) |

This Docker Compose is the **orchestration hub** — it starts the entire BHIV runtime stack on a single machine.

#### Core Modules

| Module | Description |
|--------|-------------|
| User Management | Multi-role (Admin, Manager, User), JWT authentication |
| Task Management | Creation, assignment, dependencies, progress tracking |
| Attendance | Real-time tracking, geolocation, biometric Excel upload, auto end-day |
| Salary | Automated attendance-based calculations, allowances, deductions, tax |
| Leave | Digital requests, approval workflows, balance tracking |
| Employee Monitoring | Screen capture with OCR, activity tracking, website monitoring |
| AI Optimization | Workflow optimization, predictive analytics, productivity scoring |
| Real-time Comms | Socket.IO live updates, push notifications |
| Reporting | Dashboards, charts, PDF/Excel export |

#### Integration Method

- **Orchestration hub**: Its Docker Compose starts Bucket, PRANA, and Karma-Tracker
- **Backend ↔ Bucket**: Communicates with `bhiv-bucket` (port 8001) for artifact storage
- **Backend ↔ PRANA**: Communicates with `bhiv-prana` (port 8002) for signal forwarding
- **Embedded builds**: Contains `bhiv-bucket/`, `bhiv_prana/`, `Karma-Tracker/` as Docker build contexts
- **Sub-directories**: Contains `TANTRA Integration/`, `SETU Deployment/`, `YOTTA` deployment configs
- **Network**: `niyantran` Docker network for inter-service communication

---

## 3. Technology Distribution Matrix

| Technology | Sampada | Artha | ai-crm | Karma | Prana | Bucket | Registry | Samachar | SVACS | workflow-bh |
|-----------|---------|-------|--------|-------|-------|--------|----------|----------|-------|-------------|
| Python/FastAPI | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | — |
| Node.js/Express | — | ✓ | ✓ | — | — | — | — | — | — | ✓ |
| React | ✓ | ✓ | ✓ | — | — | — | — | — | ✓ | ✓ |
| Next.js | — | — | — | — | — | — | — | ✓ | — | — |
| MongoDB | ✓ | ✓ | ✓ | ✓ | — | ✓ | — | ✓ | — | ✓ |
| PostgreSQL | — | — | — | — | — | — | ✓ | — | — | — |
| Redis | — | ✓ | — | — | — | ✓ | — | — | — | ✓ |
| Docker | ✓ | ✓ | — | ✓ | — | — | ✓ | — | — | ✓ |
| PyTorch/ML | ✓ | — | — | ✓ | — | — | — | — | ✓ | — |
| LangGraph | ✓ | — | — | — | — | — | — | — | — | — |
| JWT Auth | ✓ | ✓ | ✓ | — | — | — | ✓ | — | — | ✓ |
| Socket.IO | — | — | ✓ | — | — | ✓ | — | — | — | ✓ |
| Render | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ | ✓ | — |

---

## 4. Known Integration Gaps

| ID | Gap | Severity | Detail |
|----|-----|----------|--------|
| IG-01 | External SETU partner dispatch unproven | High | Tier-2 dispatch works locally; partner servers not live (KI-002) |
| IG-02 | Complete-Infiverse workflow bridge | Medium | Configured for `http://127.0.0.1:5000/api`; requires separate platform |
| IG-03 | Karma-Tracker PRANA passive mode | Low | No scoring/feedback loops active; passive observation only |
| IG-04 | bhiv-SVACS no runtime exchange | Low | Independent CV service; no live data flow with Sampada HR |
| IG-05 | bhiv-intelligence-samachar isolation | Low | Independent news AI; no runtime data exchange with HR platform |
| IG-06 | root docker-compose.production.yml broken | Medium | References non-existent env files (KI-004) |
| IG-07 | No tests in CI/CD pipeline | High | Code deploys directly to production without test gates (KI-014) |
| IG-08 | Windows-only launcher scripts | Low | No cross-platform bash/zsh scripts for ecosystem startup |

---

## 5. Deployment Topology

| System | Primary Deploy | Backup Deploy | Container |
|--------|---------------|---------------|-----------|
| Sampada Gateway | Render (Docker) | VM (Docker) | `bhiv/hr-gateway` |
| Sampada Agent | Render (Docker) | VM (Docker) | `bhiv/hr-agent` |
| Sampada LangGraph | Render (Docker) | VM (Docker) | `bhiv/hr-lang-graph` |
| Sampada Frontend | Vercel | Render (Docker) | `bhiv/hr-frontend` |
| Artha | Render + Docker | — | Custom |
| ai-crm | Render | — | `pratham-setu-ai-crm` |
| Bucket | Render | Docker (workflow-bh) | `niyantran_bucket` |
| Karma-Tracker | Docker (workflow-bh) | — | `niyantran_karma` |
| bhiv-registry | Render (Docker, Singapore) | — | Custom |
| bhiv-intelligence-samachar | Render (2 services) | — | `news-ai-backend/frontend` |
| bhiv-SVACS | Render (2 services) | — | `bhiv-svacs` / `bhiv-svacs-1` |
| workflow-blackhole | Docker Compose (local/VM) | — | 6-service stack |

---

## 6. Next

→ End of linear path. Return to `Updated Docs/README.md` for the master index.
