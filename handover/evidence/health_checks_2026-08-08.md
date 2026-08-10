# Live Service Health Checks — 2026-08-08

**Captured by:** Handover Phase 0 verification  
**Method:** `Invoke-WebRequest` (PowerShell) against public endpoints  
**Note:** No secrets used. Response snippets truncated to 300 chars.

---

## VM Primary (sampada.blackholeinfiverse.com)

| Service | URL | Status | Response Snippet |
|---------|-----|--------|----------------|
| Frontend | `https://sampada.blackholeinfiverse.com/` | **200** | `<!DOCTYPE html>...` (Vite SPA shell) |
| Gateway | `https://sampada.blackholeinfiverse.com/gateway/health` | **200** | `{"status":"healthy","service":"BHIV HR Gateway","version":"4.2.0",...}` |
| Agent | `https://sampada.blackholeinfiverse.com/agent/health` | **200** | `{"status":"healthy","service":"BHIV AI Agent","version":"3.0.0",...}` |
| LangGraph | `https://sampada.blackholeinfiverse.com/langgraph/health` | **200** | `{"status":"healthy","service":"langgraph-orchestrator","version":"1.0.0",...}` |

---

## Render Backup (l0xp / cato / luy9)

| Service | URL | Status | Notes |
|---------|-----|--------|-------|
| Gateway | `https://bhiv-hr-gateway-l0xp.onrender.com/health` | **503** | Server Unavailable — likely cold-start or service sleeping (Render free tier) |
| Agent | `https://bhiv-hr-agent-cato.onrender.com/health` | **503** | Server Unavailable |
| LangGraph | `https://bhiv-hr-langgraph-luy9.onrender.com/health` | **503** | Server Unavailable |

**Follow-up:** Re-test after wake-up; document failover switch procedure in `04_PRODUCTION_INFRASTRUCTURE.md`.

---

## Alternate Frontend (Vercel)

| Service | URL | Status | Response Snippet |
|---------|-----|--------|----------------|
| Frontend | `https://infiverse-hr.vercel.app/` | **200** | `<!DOCTYPE html>...` (Vite SPA shell) |

---

## VM vs Render URL Mapping

| Role | VM (primary) | Render (backup) |
|------|--------------|-----------------|
| Frontend | `https://sampada.blackholeinfiverse.com/` | `https://infiverse-hr.vercel.app/` |
| Gateway API | `https://sampada.blackholeinfiverse.com/gateway` | `https://bhiv-hr-gateway-l0xp.onrender.com` |
| Agent API | `https://sampada.blackholeinfiverse.com/agent` | `https://bhiv-hr-agent-cato.onrender.com` |
| LangGraph API | `https://sampada.blackholeinfiverse.com/langgraph` | `https://bhiv-hr-langgraph-luy9.onrender.com` |

**Path-prefix model (VM):** Nginx/reverse proxy routes `/gateway`, `/agent`, `/langgraph` to internal Docker ports (8003, 9002, 9003 on host).

**Direct-port model (Render):** Each service has its own subdomain; no path prefix.
