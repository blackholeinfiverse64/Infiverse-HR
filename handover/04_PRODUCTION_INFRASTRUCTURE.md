# 04 — Production Infrastructure

**Status:** In Progress (VM health verified; SSH/nginx capture pending)  
**Owner:** Shashank Mishra  
**Last updated:** 2026-08-08  
**Verification:** EVD-001, EVD-002

---

## Production Architecture Overview

Sampada runs on a **single VM** behind nginx with **path-based routing** on one domain. Render services provide **backup failover** on separate subdomains. Vercel hosts an alternate frontend.

```
Browser
   │
   ▼
https://sampada.blackholeinfiverse.com  (nginx + SSL)
   │
   ├── /              → Frontend container  (host :3004 → :3000)
   ├── /gateway/*   → Gateway container   (host :8003 → :8000)
   ├── /agent/*     → Agent container     (host :9002 → :9000)
   └── /langgraph/* → LangGraph container (host :9003 → :9001)
```

---

## VM Primary URLs (verified 2026-08-08)

| Service | Public URL | Health Check | Status |
|---------|------------|--------------|--------|
| Frontend | `https://sampada.blackholeinfiverse.com/` | `/` (SPA) | ✅ 200 |
| Gateway | `https://sampada.blackholeinfiverse.com/gateway` | `/gateway/health` | ✅ 200 |
| Gateway API docs | `https://sampada.blackholeinfiverse.com/gateway/docs` | — | ✅ 200 |
| Agent | `https://sampada.blackholeinfiverse.com/agent` | `/agent/health` | ✅ 200 |
| LangGraph | `https://sampada.blackholeinfiverse.com/langgraph` | `/langgraph/health` | ✅ 200 |

**Note:** Root `/health` returns the frontend SPA, not a backend probe. Use path-prefixed health endpoints.

### Internal port mapping (from `docker-compose.production.template.yml`)

| Service | Host Port | Container Port |
|---------|-----------|----------------|
| Frontend | 3004 | 3000 |
| Gateway | 8003 | 8000 |
| Agent | 9002 | 9000 |
| LangGraph | 9003 | 9001 |

Deploy path on VM: `~/SAMPADA` (to confirm via SSH in Phase 1).

---

## Render Backup (Failover)

| Service | URL | Health Endpoint | Last Status |
|---------|-----|-----------------|-------------|
| Gateway | `https://bhiv-hr-gateway-l0xp.onrender.com` | `/health` | ⚠️ 503 (2026-08-08 — likely sleeping) |
| Agent | `https://bhiv-hr-agent-cato.onrender.com` | `/health` | ⚠️ 503 |
| LangGraph | `https://bhiv-hr-langgraph-luy9.onrender.com` | `/health` | ⚠️ 503 |

**Render model:** Each service has its own subdomain (no path prefix). Frontend env vars must be updated to point at Render hosts during failover.

### Failover procedure (draft)

1. Confirm VM unhealthy (health checks fail)
2. Wake Render services (dashboard or first request cold-start)
3. Update frontend `VITE_*_URL` env vars to Render hosts
4. Redeploy frontend (VM or Vercel)
5. Verify health + smoke tests
6. Record in `evidence/`

---

## Alternate Frontend (Vercel)

| URL | Status |
|-----|--------|
| `https://infiverse-hr.vercel.app/` | ✅ 200 (prior check) |

Vercel env may still reference Render URLs — verify during Phase 1.

---

## CI/CD Pipeline

| Step | Mechanism | Source |
|------|-----------|--------|
| Trigger | Push to `main` | `.github/workflows/deploy.yml` |
| Build | Docker images → Docker Hub (`bhiv/*`) | GitHub Actions |
| Deploy | SSH to VM, pull images, `docker compose up` | GitHub Actions secrets (`VM_*`) |

**Git policy:** `main` branch only — no other production branches.

---

## Database

- **MongoDB Atlas** — shared cluster for VM and Render deployments
- Connection string location: `backend/.env` (local), GitHub Actions secret `MONGODB_URI` (CI/CD)
- Per-service env on VM: `gateway.env`, `agent.env`, `langgraph.env` (from GitHub secrets)

---

## Environment Variables (names only)

See [11_CREDENTIALS_REGISTER.md](11_CREDENTIALS_REGISTER.md) for full location map. **No rotation at handover** — env stays as-is.

Key frontend vars (Vite):
- `VITE_GATEWAY_URL`, `VITE_AGENT_URL`, `VITE_LANGGRAPH_URL` — point at VM paths or Render hosts

Key backend vars:
- `MONGODB_URI`, `JWT_SECRET_KEY`, `CANDIDATE_JWT_SECRET_KEY`, `API_KEY_SECRET`
- `CORS_ORIGINS` — includes `sampada.blackholeinfiverse.com`

---

## Verification Still Needed (Phase 1)

- [ ] SSH to VM: `docker compose ps`, container logs
- [ ] Capture nginx/reverse-proxy config (path routing rules)
- [ ] Document SSL certificate provider and renewal
- [ ] GitHub Actions deploy run screenshot
- [ ] Re-test Render backup after wake-up (503 → 200?)
- [ ] Failover procedure test (VM down → Render)
- [ ] Fix client login datetime bug (see EVD-002)

---

## Source Material

- [docker-compose.production.template.yml](../docker-compose.production.template.yml)
- [.github/workflows/deploy.yml](../.github/workflows/deploy.yml)
- [frontend/VERCEL_DEPLOYMENT.md](../frontend/VERCEL_DEPLOYMENT.md)
- [backend/docs/guides/DEPLOYMENT_GUIDE.md](../backend/docs/guides/DEPLOYMENT_GUIDE.md)

---

## Evidence Links

- [EVD-001 — Health checks 2026-08-08](evidence/health_checks_2026-08-08.md)
- [EVD-002 — VM health + demo login 2026-08-08](evidence/health-checks/vm-health-check-2026-08-08.md)
