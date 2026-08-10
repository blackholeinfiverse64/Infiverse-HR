# Implementation Plan — Sampada + SETU Full Ecosystem Handover

**Owner:** Shashank Mishra  
**Recipients:** Vijay Dhawan, Soham Kotkar (receive docs to continue as transfer — no formal sign-off person)  
**Last updated:** 2026-08-08  
**Approach:** Verification-first — test before document, evidence for every claim

---

## User Decisions (Handover Clarifications — 2026-08-08)

| Decision | Detail | Verification |
|----------|--------|--------------|
| **Primary production** | VM path-based routing on `sampada.blackholeinfiverse.com` | ✅ EVD-002 — all services HTTP 200 |
| **Backup production** | Render `l0xp` / `cato` / `luy9` onrender.com (already documented) | ⚠️ 503 on prior check — re-test in Phase 1 |
| **Git branches** | **`main` only** — no other production branches | Documented in `10_REPOSITORY_INVENTORY.md` |
| **Secrets policy** | **No rotation** — env stays as-is; document locations only | `11_CREDENTIALS_REGISTER.md` |
| **Sign-off model** | **No formal sign-off person** — Vijay/Soham receive docs and continue as transfer | `13_EXECUTIVE_ASSESSMENT.md` |
| **Demo credentials** | Provisional — owner will update before final handover | `11_CREDENTIALS_REGISTER.md`, `12_DEMO_SESSION.md` |
| **Scope (added 2026-08-10)** | **Primary focus: `gateway` + `agent` + `langgraph` + `frontend/`.** `candidate_portal`, `client_portal`, `portal` (all under `backend/services/`) are archived — out of scope for this handover. | See "Ecosystem Scope" below, updated to match |

---

## Deployment Model

```
                    ┌─────────────────────────────────────┐
                    │         End Users / Browsers         │
                    └──────────────┬──────────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │ PRIMARY (VM)       │ BACKUP (Render)     │ ALT (Vercel)
              ▼                    ▼                     ▼
    sampada.blackholeinfiverse.com   *.onrender.com    infiverse-hr.vercel.app
    /  /gateway  /agent  /langgraph  l0xp/cato/luy9    (frontend only)
              │                    │
              └────────┬───────────┘
                       ▼
              MongoDB Atlas (shared)
              GitHub Actions → Docker Hub → VM SSH deploy
```

### VM Production URLs (PRIMARY)

| Component | Public URL | Internal VM Port |
|-----------|------------|------------------|
| Frontend | `https://sampada.blackholeinfiverse.com/` | 3004 → 3000 |
| Gateway | `https://sampada.blackholeinfiverse.com/gateway` | 8003 → 8000 |
| Agent | `https://sampada.blackholeinfiverse.com/agent` | 9002 → 9000 |
| LangGraph | `https://sampada.blackholeinfiverse.com/langgraph` | 9003 → 9001 |

Health endpoints: `/gateway/health`, `/agent/health`, `/langgraph/health`. Gateway API docs: `/gateway/docs`.

### Render Backup URLs

| Component | URL |
|-----------|-----|
| Gateway | `https://bhiv-hr-gateway-l0xp.onrender.com` |
| Agent | `https://bhiv-hr-agent-cato.onrender.com` |
| LangGraph | `https://bhiv-hr-langgraph-luy9.onrender.com` |

| Layer | Primary | Backup | Notes |
|-------|---------|--------|-------|
| Frontend | VM `sampada.blackholeinfiverse.com/` | Vercel `infiverse-hr.vercel.app` | Vercel env may still point at Render URLs |
| Gateway | VM path `/gateway` | `bhiv-hr-gateway-l0xp.onrender.com` | Render 503 on 2026-08-08 — re-verify |
| Agent | VM path `/agent` | `bhiv-hr-agent-cato.onrender.com` | Same |
| LangGraph | VM path `/langgraph` | `bhiv-hr-langgraph-luy9.onrender.com` | Same |
| CI/CD | `.github/workflows/deploy.yml` → VM SSH | Manual Render dashboard | Render not in CI pipeline |
| Database | MongoDB Atlas | Same cluster | Single source of truth |
| Git | **`main` branch only** | — | No other production branches |

**Failover procedure (to document in 04 + 08):**
1. Confirm VM unhealthy
2. Wake Render services (or ensure paid tier always-on)
3. Update frontend `VITE_*_URL` env vars to Render hosts
4. Redeploy frontend (VM or Vercel)
5. Verify health + smoke tests
6. Record in `evidence/`

---

## Ecosystem Scope

**Corrected 2026-08-10 — narrowed per owner decision.** This previously said the handover covers "the full BHIV ecosystem." It doesn't, and can't: the partner systems below live in separate, gitignored local folders that aren't part of this repo or this zip. This handover can only document and verify what's actually here — **Sampada's `gateway` + `agent` + `langgraph` + `frontend/`** — plus Sampada's *side* of each integration point (the env var, the calling code, the route), not the partner systems themselves.

`candidate_portal`, `client_portal`, and `portal` (all under `backend/services/`) are **archived — out of scope**, per the same decision.

| System | Repo / Location | Integration Point | In scope here? |
|--------|-----------------|-------------------|-----------------|
| **Sampada** (HR platform) | `bhiv-Infiverse-HR` — gateway, agent, langgraph, frontend | Primary deliverable | ✅ Yes |
| **SETU** (signal ingestion) | Routes live inside the Sampada gateway | `/v1/setu/*` routes | ✅ Yes — it's Sampada code |
| **Niyantran** (workflow) | `workflow-blackhole` (local, gitignored — not in this repo) | `WORKFLOW_API_BASE_URL` | ⚠️ Sampada's calling code only |
| **Artha** (payroll) | `Artha` / `AI-Artha` (local, gitignored — not in this repo) | SETU signals | ⚠️ Sampada's calling code only |
| **CRM + Logistics** | `ai-crm` (local, gitignored — not in this repo) | Partner signals | ⚠️ Sampada's calling code only |
| **Bucket, PRANA, InsightFlow, Karma** | Local folders per `ECOSYSTEM_REPOSITORY_MAP.md` | SETU participation | ⚠️ Sampada's calling code only |
| `candidate_portal` / `client_portal` / `portal` | `backend/services/{candidate_portal,client_portal,portal}` | Standalone Streamlit portals | ❌ Archived |

See [ECOSYSTEM_REPOSITORY_MAP.md](../ECOSYSTEM_REPOSITORY_MAP.md) if a future handover expands scope back out to the full ecosystem.

---

## Access Transfer (Recipients Have No Admin Access Yet)

Recipients **cannot** operate production until access is transferred. Document every item; do not embed secret values. **No secret rotation required** — transfer existing access as-is.

| System | Access Needed | Current Owner | Transfer Action | Status |
|--------|---------------|---------------|-----------------|--------|
| GitHub repo | Read/Write on `BHIV-Engineering-Exchange/bhiv-Infiverse-HR` | Shashank / org admins | Invite Vijay + Soham; confirm branch protection on `main` | ⏳ Pending |
| GitHub Actions secrets | `VM_*`, `DOCKER_*`, `MONGODB_URI`, env file secrets | Org secrets | Org admin adds recipients or documents handoff to new owner | ⏳ Pending |
| VM SSH | `VM_IP`, `VM_PORT`, `VM_USERNAME`, `VM_PASSWORD` | GitHub secrets only | Provide via secure channel (no rotation) | ⏳ Pending |
| MongoDB Atlas | Cluster admin / read-write user | Owner TBD | Create scoped users for recipients; document connection string location | ⏳ Pending |
| Docker Hub | `bhiv/*` image pulls | Org account | Add collaborators or document read-only token location | ⏳ Pending |
| Render dashboard | l0xp/cato/luy9 services | Owner TBD | Invite as team members | ⏳ Pending |
| Vercel project | `infiverse-hr` | Owner TBD | Invite as team members | ⏳ Pending |
| Domain/DNS | `blackholeinfiverse.com` | Owner TBD | Document registrar + DNS records for nginx | ⏳ Pending |
| Partner repos | workflow-blackhole, ai-crm, Artha, etc. | Various | Map owners per repo; separate access requests | ⏳ Pending |

**Evidence required:** Screenshot or email confirmation for each transfer → `handover/evidence/access_transfer/`

---

## Repository & Git Findings (Phase 0)

### Canonical repo path

| Path | `.git`? | Role |
|------|---------|------|
| `c:\Users\shash\Downloads\bhiv-Infiverse-HR\` | **No** | Workspace root (Cursor project) — contains `backend/`, `frontend/`, `docs/` |
| `c:\Users\shash\Downloads\bhiv-Infiverse-HR\bhiv-Infiverse-HR\` | **Yes** (if nested) | May exist as nested duplicate — see `10_REPOSITORY_INVENTORY.md` |

**Production branch:** `main` only. No other production branches.

### Git remote status

```
Remote:  https://github.com/BHIV-Engineering-Exchange/bhiv-Infiverse-HR.git
Branch:  main (tracking origin/main)
HEAD:    1df1df0 — "added the deployment stack for VM deployment"
Status:  Clean sync with origin/main (as of Phase 0 check)
```

---

## Secrets Policy (No Rotation)

Per owner decision: **do not rotate secrets at handover**. Document **locations only** in `11_CREDENTIALS_REGISTER.md`.

| Location | Contains | Action |
|----------|----------|--------|
| `backend/.env` | MongoDB URI, API keys, JWT secrets, Gmail, Twilio, Gemini | Gitignored; document location; transfer access |
| `frontend/.env` | VITE_* URLs, feature flags | Gitignored; document location |
| GitHub Actions secrets | `VM_*`, `DOCKER_*`, `MONGODB_URI`, `*_ENV_FILE` | Document secret **names** only |
| Render / Vercel dashboards | Backup service env vars | Document dashboard access |
| MongoDB Atlas | Database credentials | Document cluster access |

**Known secrets-in-repo risk locations** — verified 2026-08-10, full detail and file counts in `11_CREDENTIALS_REGISTER.md` and `07_KNOWN_ISSUES.md` (KI-003). It's one key, committed in at least 29 files:

| Location | Risk |
|----------|------|
| `evidence/entry-points/curl-examples.sh` | Hardcoded prod API key + 2 JWT samples |
| `backend/tools/utilities/verify_changes.py` | Same key, module-level constant |
| `backend/tests/**/*.py` | Same key, fallback default — 27 files |
| `backend/services/portal/auth_manager.py` | Fallback default API key — not re-checked (portal archived) |

---

## Verification-First Workflow

For every deliverable:

1. **Identify** — what must be true for the claim
2. **Test** — curl, pytest, manual UI, deploy dry-run
3. **Capture** — log to `handover/evidence/` with EVD-xxx ID
4. **Document** — write deliverable referencing evidence ID
5. **Review** — recipient can reproduce from evidence alone

---

## Phase Execution Order

### Phase 0 — Discovery & Scaffold ✅

- [x] Find VM vs Render URLs in env files, docker configs, docs
- [x] Health-check live VM endpoints (EVD-001, EVD-002)
- [x] Create `handover/` scaffold (00_INDEX, IMPLEMENTATION_PLAN, 01–13 stubs, evidence INDEX)
- [x] Document repo path, git remote, secrets locations
- [x] Incorporate user clarifications (VM URLs, demo creds, main-only, no rotation, transfer model)
- [x] Demo login smoke test (Candidate ✅, Recruiter ✅, Client ⚠️ server error)

### Phase 1 — Production Infrastructure & Access (04, 08, 11)

1. Re-test Render backup after wake-up; document failover switch
2. SSH to VM (requires access) — capture `docker compose ps`, nginx config, `docs/RELEASE_HISTORY.md`
3. Document GitHub Actions deploy pipeline (`.github/workflows/deploy.yml`)
4. Complete access transfer checklist with evidence
5. Fill `04_PRODUCTION_INFRASTRUCTURE.md`, `11_CREDENTIALS_REGISTER.md`
6. Fix or document client login datetime bug (EVD-002 finding)

### Phase 2 — Architecture & Code (01, 02, 03, 09, 10)

1. Consolidate from `backend/handover/`, `docs/`, `SAMPADA_CURRENT_STATE.md`
2. Document Sampada's side of SETU partner integrations (`/v1/setu/*` routes, env vars, calling code) — partner systems themselves are out of scope, see "Ecosystem Scope" above
3. Document folder structure and module purposes for gateway, agent, langgraph, and frontend
4. Resolve nested-repo duplication in inventory

### Phase 3 — APIs, Database, Issues (05, 06, 07)

1. Migrate/consolidate `backend/handover/api_contract/*`
2. MongoDB schema from `backend/services/db/` + live collection audit
3. Merge `KNOWN_GAPS.md`, `ISSUES_AND_LIMITATIONS.md`, `REVIEW_PACKET.md`

### Phase 4 — Operations, Demo, Assessment (08, 12, 13)

1. Operational runbook: deploy, restart, rollback, logs, monitoring
2. Record demonstration session (update provisional demo credentials first)
3. Executive assessment: maturity, risks, remaining work
4. Transfer completion checklist for Vijay/Soham (no formal sign-off)

---

## Recommended Next Step (Phase 1)

1. **Obtain admin access** for VM, GitHub, Render (or coordinate with current owner)
2. **SSH to VM** — capture `docker compose ps`, nginx path-routing config, release history
3. **Re-test Render** health (503 → 200 after wake-up)
4. **Investigate client login bug** — datetime comparison error on `/v1/client/login`
5. **Complete access transfer** with evidence receipts for Vijay/Soham

Until access is transferred, recipients should use this plan + Phase 0 evidence as the roadmap.

---

## Key Source Files for Phase 1

| File | Contents |
|------|----------|
| `frontend/.env` | VM URL comments, Render backup URLs (commented) |
| `backend/.env` | CORS origins, VM path comments |
| `docker-compose.production.template.yml` | VM host port mappings (8003/9002/9003/3004) |
| `.github/workflows/deploy.yml` | CI/CD → VM SSH deploy pipeline |
| `frontend/VERCEL_DEPLOYMENT.md` | Render URLs for Vercel env |
| `docs/GOVERNANCE_PANEL_APPROVAL_RECORD.md` | Production URL confirmation |
