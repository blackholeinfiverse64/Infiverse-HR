# VM Production Health Checks — 2026-08-08

**Captured by:** Handover Phase 0 update (user clarifications session)  
**Method:** `Invoke-WebRequest` (PowerShell) against public VM endpoints  
**Primary domain:** `https://sampada.blackholeinfiverse.com`  
**Note:** No secrets logged. Response snippets truncated to ~200 chars.

---

## Summary

| Category | Result |
|----------|--------|
| VM frontend | ✅ HTTP 200 |
| VM gateway | ✅ HTTP 200 (`/health`, `/docs`, `/`) |
| VM agent | ✅ HTTP 200 (`/health`, `/`) |
| VM langgraph | ✅ HTTP 200 (`/health`, `/`) |
| Demo login — Candidate | ✅ Success (HTTP 200, `success: true`) |
| Demo login — Recruiter | ✅ Success (HTTP 200, `success: true`) |
| Demo login — Client | ⚠️ Fail (HTTP 200 body error — see below) |

---

## VM Primary Endpoints

| Service | URL | Status | Response Snippet |
|---------|-----|--------|------------------|
| Frontend | `https://sampada.blackholeinfiverse.com/` | **200** | `<!DOCTYPE html>...` (Vite SPA shell) |
| Gateway health | `https://sampada.blackholeinfiverse.com/gateway/health` | **200** | `{"status":"healthy","service":"BHIV HR Gateway","version":"4.2.0",...}` |
| Gateway docs | `https://sampada.blackholeinfiverse.com/gateway/docs` | **200** | Swagger UI HTML |
| Gateway root | `https://sampada.blackholeinfiverse.com/gateway/` | **200** | `{"message":"BHIV HR Platform API Gateway","version":"4.2.0","status":"healthy",...}` |
| Agent health | `https://sampada.blackholeinfiverse.com/agent/health` | **200** | `{"status":"healthy","service":"BHIV AI Agent","version":"3.0.0",...}` |
| Agent root | `https://sampada.blackholeinfiverse.com/agent/` | **200** | `{"service":"BHIV AI Agent","version":"3.0.0",...}` |
| LangGraph health | `https://sampada.blackholeinfiverse.com/langgraph/health` | **200** | `{"status":"healthy","service":"langgraph-orchestrator","version":"1.0.0",...}` |
| LangGraph root | `https://sampada.blackholeinfiverse.com/langgraph/` | **200** | `{"message":"BHIV LangGraph Orchestrator","version":"1.0.0","status":"healthy",...}` |
| Root `/health` | `https://sampada.blackholeinfiverse.com/health` | **200** | Returns frontend SPA (not a backend health probe) |

**Verification status:** ✅ All backend health endpoints confirmed healthy on 2026-08-08.

---

## Path-Based Routing Architecture (confirmed)

Single domain with nginx path prefixes:

| Path prefix | Internal VM port | Container port |
|-------------|------------------|----------------|
| `/` (frontend) | 3004 | 3000 |
| `/gateway` | 8003 | 8000 |
| `/agent` | 9002 | 9000 |
| `/langgraph` | 9003 | 9001 |

Health check pattern: append `/health` to each backend path (e.g. `/gateway/health`).

---

## Demo Login Smoke Test (provisional credentials)

**Endpoint base:** `https://sampada.blackholeinfiverse.com/gateway`  
**Passwords not logged** — see `11_CREDENTIALS_REGISTER.md` § Demo Accounts (Provisional).

| Role | Endpoint | HTTP | Result | Notes |
|------|----------|------|--------|-------|
| Candidate | `POST /v1/candidate/login` | 200 | ✅ Success | JWT token returned |
| Recruiter | `POST /v1/candidate/login` | 200 | ✅ Success | Recruiters use candidate login endpoint; role from DB |
| Client | `POST /v1/client/login` | 200 | ⚠️ Fail | Body error: `Authentication error: can't compare offset-naive and offset-aware datetimes` — likely server-side bug in account lock check, not invalid credentials |

**Follow-up:** Investigate client login datetime bug before demo session; document fix in `07_KNOWN_ISSUES.md`.

---

## Render Backup (not re-tested this session)

Previous check (2026-08-08 Phase 0): all three Render services returned **503** (likely sleeping).

| Service | URL |
|---------|-----|
| Gateway | `https://bhiv-hr-gateway-l0xp.onrender.com/health` |
| Agent | `https://bhiv-hr-agent-cato.onrender.com/health` |
| LangGraph | `https://bhiv-hr-langgraph-luy9.onrender.com/health` |

See also: [health_checks_2026-08-08.md](../health_checks_2026-08-08.md) (EVD-001).

---

## Evidence ID

**EVD-002** — VM health + demo login smoke test (2026-08-08)
