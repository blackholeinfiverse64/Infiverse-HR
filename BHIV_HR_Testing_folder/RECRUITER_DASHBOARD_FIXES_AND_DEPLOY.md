# Recruiter Dashboard Errors – Analysis and Fixes

**Date:** January 30, 2026  
**Scope:** Console errors after recruiter registration/login; `/v1/match/{jobId}/top` timeouts; deployment sequence.

---

## 1. Analysis of Console Errors

### 1.1 What You Observed

- **Registration:** Recruiter account created → auto-login → redirect to recruiter dashboard. Auth works.
- **Re-login:** Sign in with same credentials → green ticks → redirect to recruiter dashboard. Auth works.
- **After a few minutes:** Many console errors:
  - `Network Error: Unable to reach API at http://localhost:8000/v1/match/{jobId}/top`
  - `timeout of 15000ms exceeded` (AxiosError, code: ECONNABORTED)
  - `Error fetching candidates:` from `getCandidatesByJob` → `loadDashboardData` (Recruiter Dashboard)

### 1.2 Root Cause

1. **Endpoint:** The recruiter dashboard (and `JobTableWithStats`) calls **`GET /v1/match/{jobId}/top`** for each job to get applicant/match counts.
2. **Gateway behavior:** The gateway forwards this to the **Agent service** (`POST {AGENT_SERVICE_URL}/match`) with a **60s** timeout. If the agent is slow (e.g. cold start, ML) or unreachable, the gateway waits up to 60s before falling back to database matching.
3. **Frontend timeout:** The frontend axios instance uses a **15s** global timeout. Match requests were using that 15s, so the browser gave up at 15s while the gateway was still waiting for the agent (30–60s for AI/ML) → user saw "timeout of 15000ms exceeded" and "Network Error".
4. **Volume:** With 27 jobs, the dashboard and `JobTableWithStats` triggered many `/v1/match/{jobId}/top` calls (including on 30s refresh). Each could hit the 15s timeout → hundreds of errors over time.

### 1.3 What Was Not Wrong

- **Authentication:** Registration and login (including token storage and redirect) work.
- **Other endpoints:** `/v1/jobs`, `/v1/recruiter/stats`, `/v1/interviews`, `/v1/offers` succeed (no errors in logs for these).
- **MongoDB:** Jobs and stats load (e.g. Total Jobs: 27). The issue is only with the **match** endpoint (agent call + timeout), not with DB connectivity or collections.

---

## 2. Fixes Implemented

### 2.1 Backend – Gateway (`backend/services/gateway/app/main.py`)

- **Change:** Agent HTTP client timeout for `GET /v1/match/{job_id}/top` is **configurable via `AGENT_MATCH_TIMEOUT`** (default **20s**).
- **Reason:** A shorter default (20s) makes the gateway fall back to DB quickly when the agent is slow or degraded after extended run, so responses return in ~20s + fallback time instead of 60s. Set **`AGENT_MATCH_TIMEOUT=60`** (or 90) if you want full AI/ML time when the agent is healthy.
- **Coordination:** The frontend uses a **70s** timeout for match requests so it receives either AI results or gateway fallback (works with both 20s and 60s gateway timeout).

### 2.2 Frontend – API (`frontend/src/services/api.ts`)

- **Change:** **`getCandidatesByJob`** and **`getTopMatches`** use a **per-request timeout of 70s** (`MATCH_REQUEST_TIMEOUT_MS`) for `GET /v1/match/{jobId}/top`.
- **Change:** **`getCandidatesByJob`** **returns `[]`** on any error (timeout, network, 5xx) instead of **throwing**, so the dashboard still loads and failed jobs show 0 applicants.
- **Logging:** In development, a single **warning** is logged per failed job instead of repeated errors.

### 2.3 Frontend – Recruiter Dashboard (`frontend/src/pages/recruiter/Dashboard.tsx`)

- **Change:** **JobTableWithStats** now loads match stats only for the **first 10 jobs** (`jobs.slice(0, 10)`), not all 27.
- **Change:** **Auto-refresh** runs every **60s** (was 30s) and **skips** if the previous load is still in progress (`loadingRef`), so overlapping match requests do not pile up during extended operation.
- **Reason:** Cuts match calls per load and avoids overlapping loads that overload the agent after prolonged runtime.
- **Effect:** First 10 jobs show applicant/shortlisted counts; remaining jobs can show 0 or "—". Extended run no longer causes "timeout of 65000ms exceeded" buildup.

---

## 3. Configuration and Environment

- **Backend:** Optional env var **`AGENT_MATCH_TIMEOUT`** (seconds, default **20**) for how long the gateway waits for the agent before falling back to DB. Use **20** for extended operation (fail fast when agent is slow). Set **60** (or 90) for full AI/ML time when the agent is healthy. Ensure `AGENT_SERVICE_URL` is set (e.g. in Docker: `http://agent:9000`).
- **MongoDB:** Gateway fallback uses `jobs` and `candidates` collections. If you use Atlas, ensure `DATABASE_URL` and `MONGODB_DB_NAME` are correct so the gateway can read these collections.
- **Frontend:** No config changes. Uses existing `VITE_API_BASE_URL` (or default `http://localhost:8000` in dev).

---

## 3.1 Extended Operation (Why Issues Reappear After Prolonged Runtime)

After running the application for an extended period, the same match timeouts and "Network Error" / "timeout of 65000ms exceeded" can reappear because:

1. **Agent degradation:** The agent service can become slow or unresponsive over time (e.g. memory pressure, cold/unresponsive after idle, restarts). With a 60s gateway timeout, each request waits up to 60s before fallback, so many in-flight requests pile up and the frontend hits its 65s timeout.
2. **Overlapping refreshes:** The dashboard was refreshing every 30s. If a full load (jobs + up to 10 match calls) takes longer than 30s, the next refresh starts while the previous is still running, so multiple match requests run concurrently and overload the agent/gateway.
3. **Backlog:** With many concurrent match requests, the agent (or gateway) can only handle a few at a time; the rest wait and eventually time out.

**Fixes for extended operation:**

- **Gateway:** Default **`AGENT_MATCH_TIMEOUT`** is now **20s** (was 60s). When the agent is slow or degraded, the gateway falls back to DB in 20s so responses return in ~20s + fallback time instead of 60s. Set **`AGENT_MATCH_TIMEOUT=60`** (or 90) in env if you want full AI/ML time when the agent is healthy.
- **Frontend – Recruiter Dashboard:** Auto-refresh runs every **60s** (was 30s) and **skips** if the previous load is still in progress (`loadingRef`), so overlapping loads do not pile up match requests during extended run.

---

## 4. Deployment Sequence

Use this order so backend (gateway) and frontend both use the new behavior.

### 4.1 Backend (Docker) – Rebuild and Run

Run from the directory that contains `docker-compose.production.yml` (e.g. `backend` or repo root):

```bash
# 1. Stop current containers
docker-compose -f docker-compose.production.yml down

# 2. Rebuild and start (gateway image will include the 10s agent timeout)
docker-compose -f docker-compose.production.yml up -d --build
```

Optional: verify gateway and agent are up:

```bash
docker-compose -f docker-compose.production.yml ps
curl -s http://localhost:8000/health
```

### 4.2 Frontend – Re-deploy or Restart

- **Local dev:** Restart the dev server so it picks up `api.ts` and Recruiter Dashboard changes:
  ```bash
  cd frontend
  npm run dev
  ```
- **Production (e.g. Vercel):** Commit and push the frontend changes; trigger your usual deploy (e.g. Vercel auto-deploy from `main`).

### 4.3 Verification After Deploy

1. **Recruiter registration / login**  
   Create a recruiter (or log in) → you should still be redirected to the recruiter dashboard with no auth errors.

2. **Recruiter dashboard**  
   - No flood of "timeout of 15000ms exceeded" or "Network Error" for `/v1/match/.../top`.  
   - Total Jobs / Total Applicants (or similar) load; first 10 jobs show applicant counts (or 0 if match still fails but no timeout).  
   - Refresh and 30s auto-refresh do not fill the console with errors.

3. **Optional**  
   - In DevTools Network tab, check a few `GET .../v1/match/{jobId}/top` requests: they should complete within ~15s (either 200 with matches or 200 from gateway fallback).  
   - If the agent is down, responses should still be 200 with fallback data (or empty matches) instead of the frontend timing out.

---

## 5. Summary

| Issue | Cause | Fix |
|-------|--------|-----|
| "timeout of 15000ms exceeded" for `/v1/match/{jobId}/top` | Frontend used 15s global timeout; gateway/agent need time for AI/ML | Frontend: 70s timeout only for match requests; gateway: 20s default agent timeout (configurable via `AGENT_MATCH_TIMEOUT`) so client gets either AI or fallback |
| Hundreds of console errors after login | Every job (e.g. 27) called match endpoint; each could timeout and throw | Frontend: `getCandidatesByJob` returns `[]` on error; dashboard shows 0 for failed jobs |
| Dashboard slow / many requests | Stats loaded for all jobs (e.g. 27 match calls per load + 30s refresh) | Recruiter Dashboard: load match stats only for first 10 jobs |
| "timeout of 65000ms exceeded" after extended run | Agent slow/degraded after long run; 30s refresh overlapped previous load; gateway waited 60s per request | Gateway: default 20s agent timeout (fail fast); Dashboard: 60s refresh, skip if previous load still in progress |

**Backend/frontend re-deploy:**  
- **Backend:** Rebuild and run Docker as in §4.1.  
- **Frontend:** Restart dev server or redeploy production (e.g. push and let Vercel build).  
No database migrations or new collections are required; MongoDB is used as before for gateway fallback matching.
