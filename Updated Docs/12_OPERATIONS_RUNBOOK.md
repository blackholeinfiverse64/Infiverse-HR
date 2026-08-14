# 12 — Operations Runbook

**Status:** ✅ Verified (health endpoints tested 2026-08-14; procedures compiled from verified configs)
**Owner:** Shashank Mishra

> Day-2 operations: monitoring, health, restart, troubleshooting, rollback. Read after
> `11_DEPLOYMENT.md`.

---

## 1. Service Health Endpoints

| Service | Local | Production (VM) |
|---------|-------|-----------------|
| Gateway | `http://localhost:8000/health` | `https://sampada.blackholeinfiverse.com/gateway/health` |
| Agent | `http://localhost:9000/health` | `https://sampada.blackholeinfiverse.com/agent/health` |
| LangGraph | `http://localhost:9001/health` | `https://sampada.blackholeinfiverse.com/langgraph/health` |
| Frontend | `http://localhost:3000` | `https://sampada.blackholeinfiverse.com/` |

Healthy response examples (verified 2026-08-14):
- Gateway: `{"status":"healthy","service":"BHIV HR Gateway","version":"4.2.0",...}`
- Agent: `{"status":"healthy","service":"BHIV AI Agent","version":"3.0.0",...}`
- LangGraph: `{"status":"healthy","uptime_seconds":...,"workflows_processed":...,"error_count":0,...}`

---

## 2. Monitoring

| Surface | Endpoint / Tool | Notes |
|---------|-----------------|-------|
| Prometheus metrics | `GET /metrics` (gateway) | Raw Prometheus format |
| Metrics dashboard | `GET /metrics/dashboard` | Aggregated JSON |
| Detailed health | `GET /health/detailed` | Dependency status |
| Audit trail | `audit_logs` collection + control-center audit APIs | Security + control center events |
| Logs | Container logs on VM: `docker compose -f backend/docker-compose.production.yml logs -f <service>` | `LOG_FORMAT=json` in production |
| Release history | `docs/RELEASE_HISTORY.md` (on VM) | Updated by CI deploy job |

Suggested poll cadence: gateway/agent/langgraph `/health` every 30 s (the frontend `ApiStatus`
component already does this client-side).

---

## 3. Start / Stop / Restart

### Local (developer)

```powershell
cd backend
.\run_with_venv.bat                 # or: python run_services.py
# single service:
python run_services.py gateway      # | agent | langgraph
cd ..\frontend
npm run dev
```

### Docker (VM / production)

```powershell
cd backend
docker compose -f docker-compose.production.yml up --build -d     # start
docker compose -f docker-compose.production.yml ps                # status
docker compose -f docker-compose.production.yml logs -f gateway   # tail logs
docker compose -f docker-compose.production.yml down              # stop
```

---

## 4. Failure Recovery

| Failure | Detection | Action |
|---------|-----------|--------|
| Service unhealthy on VM | `/health` non-200; CI health loop fails | `docker compose restart <service>`; check logs |
| Bad deploy | CI health loop fails after `up -d` | Automatic rollback job redeploys last `SUCCESS` SHA |
| Render cold sleep | First request 503 | Retry after cold start; or failover to VM |
| Gateway ↔ LangGraph lost | `/health/detailed` shows dependency down | Restart langgraph; verify `LANGGRAPH_SERVICE_URL` env |
| Workflow bridge down | Candidate Tasks page empty | Verify `WORKFLOW_API_BASE_URL` / `WORKFLOW_API_BASE_URL_DOCKER`; check bridge `/v1/candidate/workflow-bridge-health` |
| Rate-limited / blocked IP | `401/429` from gateway | Review `GET /v1/security/rate-limit-status`, `GET /v1/security/blocked-ips` |
| CSP violations | `/v1/security/csp-violations` | Review policy `/v1/security/csp-policies` |

---

## 5. Troubleshooting Quick Hits

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Port in use locally | Stale process | `netstat -ano \| findstr :8000` → `taskkill /PID <PID> /F` |
| 401/403 | Bad/missing token, wrong role, expired JWT | Check `backend/.env` secrets; re-login |
| Frontend network error | Wrong `VITE_API_BASE_URL` | Point to gateway URL (`.../gateway` in prod) |
| Agent slow/stuck first start | HF model download | Set `HF_TOKEN`; pre-pull model |
| Login returns `success:false` | Bad credentials (owner channel) | Owner updates demo account passwords |
| `docker compose` uses wrong file | Root template chosen | Always use `backend/docker-compose.production.yml` |

---

## 6. Rollback Procedure

1. **Automatic**: CI deploy failure → `rollback` job greps last `SUCCESS` SHA from
   `docs/RELEASE_HISTORY.md` → re-pulls and redeploys → records `ROLLBACK_SUCCESS` / `ROLLBACK_FAILED`.
2. **Manual (VM)**:
   ```powershell
   docker compose -f backend/docker-compose.production.yml pull <service>
   docker compose -f backend/docker-compose.production.yml up -d --force-recreate <service>
   ```
   Pin the previous image tag from the Release History if needed.
3. **Frontend failover**: switch `VITE_API_BASE_URL` between VM gateway and Render gateway, then
   rebuild/redeploy the frontend.

---

## 7. Backup & Restore

- **Primary**: MongoDB Atlas managed backups (Point-in-Time). Restore from Atlas console.
- **Pre-cleanup backups**: `scripts/cleanup_keep_latest_14_jobs.py` copies pruned jobs to the
  `job_cleanup_backups` collection before deletion.
- **No local Mongo**: do not rely on local data; `local-data/postgres/` is legacy/ignored.

---

## 8. Known Operational Caveats (see `15_KNOWN_ISSUES_ARCHIVE_INDEX.md` for full register)

1. Render URLs have changed across doc versions — confirm from the Render dashboard.
2. The client-login datetime bug (previously documented) was **not** reproduced on 2026-08-14 —
   treat as resolved/fixed.
3. `docs/RELEASE_HISTORY.md` lives on the VM, not in the repo.
4. Root `docker-compose.production.yml` is a broken legacy template (missing env files).

---

## 9. Next

→ `13_GOVERNANCE_CONTROL_CENTER.md`.
