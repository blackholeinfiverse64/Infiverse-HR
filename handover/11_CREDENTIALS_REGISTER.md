# 11 — Credentials & Configuration Register

**Status:** In Progress  
**Owner:** Shashank Mishra  
**Recipients:** Vijay Dhawan, Soham Kotkar  
**Last updated:** 2026-08-08

---

## Policy (Owner Decision)

| Topic | Policy |
|-------|--------|
| **Secret rotation** | **None** — environment stays as-is at handover |
| **Documentation scope** | Locations and access transfer only — **never expose secret values** in this register |
| **Demo accounts** | Provisional credentials listed in dedicated section below (owner will update before final handover) |
| **Access transfer** | Vijay and Soham receive credentials/access via secure channel; evidence receipts in `evidence/access_transfer/` |

---

## Configuration Locations

| Location | Contains | Who Needs Access |
|----------|----------|------------------|
| `backend/.env` | MongoDB URI, API keys, JWT secrets, Gmail, Twilio, Gemini | Dev + deploy |
| `backend/gateway.env` | Gateway service env on VM | Deploy (from GitHub secret) |
| `backend/agent.env` | Agent service env on VM | Deploy (from GitHub secret) |
| `backend/langgraph.env` | LangGraph service env on VM | Deploy (from GitHub secret) |
| `frontend/.env` | `VITE_*` URLs, feature flags | Frontend dev + deploy |
| GitHub Actions secrets | See table below | Org admin + deploy |
| Render dashboard | Backup service env vars | Ops |
| Vercel dashboard | Frontend env vars | Ops |
| MongoDB Atlas | Database credentials | Ops + dev |

---

## GitHub Actions Secrets (names only)

| Secret Name | Purpose |
|-------------|---------|
| `VM_IP` | VM host address |
| `VM_PORT` | SSH port |
| `VM_USERNAME` | SSH username |
| `VM_PASSWORD` | SSH password |
| `MONGODB_URI` | Database connection string |
| `DOCKER_USERNAME` | Docker Hub login |
| `DOCKER_PASSWORD` | Docker Hub token |
| `GATEWAY_ENV_FILE` | Gateway env file content for VM |
| `AGENT_ENV_FILE` | Agent env file content for VM |
| `LANGGRAPH_ENV_FILE` | LangGraph env file content for VM |

Full list to be confirmed from GitHub org settings during Phase 1 access transfer.

---

## Demo Accounts (Provisional)

> **⚠️ PROVISIONAL — owner will update before final handover.**  
> Used for demo session and smoke testing only. Do not treat as permanent production accounts.

| Role | Email | Password | Login Endpoint | Verified |
|------|-------|----------|----------------|----------|
| Candidate | `shashankmishra33@gmail.com` | Stored in owner's secure channel | `POST /gateway/v1/candidate/login` | ✅ EVD-002 |
| Recruiter | `nikhilpawar07@gmail.com` | Stored in owner's secure channel | `POST /gateway/v1/candidate/login` | ✅ EVD-002 |
| Client | `vinayaktiwari27@gmail.com` | Stored in owner's secure channel | `POST /gateway/v1/client/login` | ⚠️ EVD-002 — server error |

**Password handling — corrected 2026-08-10:** this table previously stated the derivation pattern ("capitalize the email local-part"). That's removed. Handover.md is explicit that password/secret *values* must not be exposed, and a stated derivation rule is not meaningfully different from the value once the email is sitting in the same row — anyone reading this page could compute the real password. Request current values through the owner's secure channel at handover/demo time; don't restate a pattern here or in `12_DEMO_SESSION.md` even as a "provisional" note.

Recruiters authenticate via the **candidate login endpoint** — role is read from a `role` field on the database record. Worth a one-line explanation in `02_ARCHITECTURE.md` or `06_API_DOCUMENTATION.md` so Vijay/Soham aren't confused about why a "recruiter" account lives in a collection named `candidates`.

---

## Access Transfer Checklist (Vijay / Soham)

| System | Access Needed | Transfer Action | Status |
|--------|---------------|-----------------|--------|
| GitHub repo | Read/Write on `BHIV-Engineering-Exchange/bhiv-Infiverse-HR` | Org admin invites recipients | ⏳ Pending |
| GitHub Actions secrets | View/manage org secrets | Org admin grants or documents handoff | ⏳ Pending |
| VM SSH | `VM_*` secrets | Secure channel transfer (no rotation) | ⏳ Pending |
| MongoDB Atlas | Cluster access | Create scoped users or transfer admin | ⏳ Pending |
| Docker Hub | `bhiv/*` image pulls | Add collaborators | ⏳ Pending |
| Render dashboard | l0xp/cato/luy9 services | Invite team members | ⏳ Pending |
| Vercel project | `infiverse-hr` | Invite team members | ⏳ Pending |
| Domain/DNS | `blackholeinfiverse.com` | Document registrar access | ⏳ Pending |

**Evidence:** Screenshot or email confirmation for each → `handover/evidence/access_transfer/`

---

## Known Secrets-in-Repo Risk Locations

**Verified 2026-08-10** (previously listed as unconfirmed — now checked directly against the code): it's the *same literal key* in every location below, prefixed `prod_api_key_...`. Treat this as one incident, not four independent ones — see `07_KNOWN_ISSUES.md` KI-003 for full detail and why it matters despite the no-rotation policy.

| Location | Risk | Verified |
|----------|------|----------|
| `evidence/entry-points/curl-examples.sh` | Hardcoded prod API key + 2 sample JWTs (client + candidate scope) | ✅ Confirmed |
| `backend/tools/utilities/verify_changes.py` | Same key, as a module-level `API_KEY` constant | ✅ Confirmed |
| `backend/tests/**/*.py` | Same key, as a fallback default — **27 files**, not a one-off | ✅ Confirmed (27 files) |
| `backend/services/portal/auth_manager.py` | Fallback default API key | Not re-checked this pass — `portal` is archived/out of scope per the 2026-08-10 scope decision |

Run `backend/tools/utilities/find_exposed_keys.py` before granting broad repo access — the sweep above was a targeted grep, not exhaustive.

---

## Verification Still Needed (Phase 1)

- [ ] Complete access transfer with evidence receipts
- [ ] Confirm full GitHub secret name list from org settings
- [ ] Update demo credentials to final values before demo session
- [ ] Resolve client login datetime bug before relying on client demo account

---

## Source Material

- [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) — Access Transfer section
- [backend/.env.example](../backend/.env.example)
- [frontend/.env.example](../frontend/.env.example)
- [12_DEMO_SESSION.md](12_DEMO_SESSION.md) — login flows per role

---

## Evidence Links

- [EVD-002 — Demo login smoke test](evidence/health-checks/vm-health-check-2026-08-08.md)
