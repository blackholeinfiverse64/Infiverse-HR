# Registration / Re-login Fixes and Docker Rebuild

**Date:** January 30, 2026  
**Scope:** Fix console errors and warnings during candidate registration; ensure re-login continues to work; document Docker rebuild.

---

## 1. Analysis of Console Errors and Warnings

### 1.1 What Happened During Registration

1. **"🔐 Auto-logging in after successful registration..."** – AuthContext correctly triggered auto-login after signup.
2. **Dashboard mounted and fired API calls immediately** – `getCandidateDashboardStats`, `getCandidateApplications`, `getInterviews` ran from the Candidate Dashboard’s `useEffect`.
3. **Race condition:** Those requests were sent **before** `auth_token` was written to `localStorage` (or before the write was visible to the next synchronous read). So:
   - Many **warnings:** `⚠️ No auth_token found in localStorage for request: /v1/candidate/...` and `⚠️ Token missing but user is authenticated for request: ...`
   - **401 Unauthorized** on `/v1/candidate/stats/...`, `/v1/candidate/applications/...`, `/v1/interviews?candidate_id=...` because the `Authorization` header was missing or not yet set.
4. **Later:** `authService.login` and AuthContext finished storing the token; some later requests saw "Token exists but was rejected" (either still in the same race window or React Strict Mode double-mount).
5. **Result:** 60 errors and 30 warnings, but registration and auto-login ultimately succeeded; the UI redirected to the dashboard while many requests had already failed with 401.

### 1.2 Why Re-login Worked

On re-login, the user clicks **Sign In** → `authService.login` runs → token is stored → AuthContext returns → **then** `navigate(...)` runs. So when the Dashboard mounts, `auth_token` is already in `localStorage` and the API interceptor adds `Authorization: Bearer <token>`. All candidate API calls get 200 and no auth warnings.

### 1.3 Root Cause

- **Frontend race:** After signup, auto-login runs and stores the token, but the app navigates to the dashboard and the Dashboard’s `useEffect` runs so quickly that some (or all) of the first batch of requests are sent **before** `auth_token` is reliably available in `localStorage`.
- **No backend or database bug:** Candidate login uses `CANDIDATE_JWT_SECRET_KEY`; gateway `get_auth` accepts that token. No schema or sync issue identified.

---

## 2. Fixes Implemented

### 2.1 AuthContext (`frontend/src/context/AuthContext.tsx`)

- **Store `backend_candidate_id` / `candidate_id` from registration** as soon as we have `result.user.id` (candidate/recruiter), so the dashboard has a candidate id even before login completes.
- **After storing the token in `handleSignUp` (auto-login):**
  - Verify that `localStorage.getItem('auth_token') === token` immediately.
  - If not, return an error and do not navigate.
  - `await new Promise((r) => setTimeout(r, 0))` to yield one tick so any pending layout/effects see the stored token.
  - Verify again that the token is still in `localStorage`; if not, return an error.
- **Effect:** SignUp only returns success after the token is confirmed in storage and one tick has passed, so navigation happens only when the token is ready.

### 2.2 Candidate Dashboard (`frontend/src/pages/candidate/Dashboard.tsx`)

- **`authReady` state:** Initialized from `!!localStorage.getItem('auth_token')`; also set to `true` when `user` from AuthContext updates (covers post-registration redirect).
- **Data fetch only when auth is ready:** `useEffect` that calls `loadDashboardData()` now depends on `authReady` and `candidateId`. It runs only when both are truthy, so we do not fire candidate API requests until the token is present.
- **Guard inside `loadDashboardData`:** At the start of `loadDashboardData`, check `localStorage.getItem('auth_token')`; if missing, return without calling the API.

### 2.3 API Interceptor (`frontend/src/services/api.ts`)

- **No warning for `/health`:** When there is no token, we do not log a warning for requests whose URL includes `/health` (expected for unauthenticated health checks).
- **Optional logging:** "Adding Authorization header" is now logged only in development (`import.meta.env.DEV`) to reduce console noise.

### 2.4 Backend / Database

- **No code or config changes required.** Candidate register and login already return the correct payload; gateway uses `CANDIDATE_JWT_SECRET_KEY` for candidate tokens and `get_auth` accepts them. Ensure `CANDIDATE_JWT_SECRET_KEY` and `JWT_SECRET_KEY` are set in `.env` and in Docker (see below).

---

## 3. Configuration and Environment

### 3.1 Backend `.env` (e.g. `backend/.env`)

Ensure at least:

```env
JWT_SECRET_KEY=<your-secret>
CANDIDATE_JWT_SECRET_KEY=<your-candidate-secret>
DATABASE_URL=<mongodb-uri>
MONGODB_DB_NAME=bhiv_hr
API_KEY_SECRET=<your-api-key>
```

Use strong, distinct values for `JWT_SECRET_KEY` and `CANDIDATE_JWT_SECRET_KEY`.

### 3.2 Docker Compose

`docker-compose.production.yml` already passes these into the gateway. No file changes needed; ensure the same env vars are set where you run Compose (e.g. in `.env` next to the compose file or in the shell).

---

## 4. Docker Rebuild Sequence

Run these from the **backend** directory (where `docker-compose.production.yml` lives).

### 4.1 Stop current containers

```bash
cd c:\Infiverse-HR\backend
docker-compose -f docker-compose.production.yml down
```

Optional: remove volumes if you want a clean DB (only if you do **not** need to keep data):

```bash
docker-compose -f docker-compose.production.yml down -v
```

(Usually you should **not** use `-v` so MongoDB data is preserved.)

### 4.2 Rebuild and start

```bash
docker-compose -f docker-compose.production.yml up -d --build
```

### 4.3 Verify

- **Containers:**  
  `docker-compose -f docker-compose.production.yml ps`  
  All services (gateway, agent, langgraph, portal, client_portal, candidate_portal) should be **Up** and **healthy**.

- **Gateway health:**  
  `curl http://localhost:8000/health`  
  Expect 200 and a healthy payload.

- **Frontend:**  
  The frontend is not part of this Compose file; run it separately (e.g. `npm run dev` in `frontend/`).  
  - Register a new candidate → you should see no 401s and no "No auth_token" warnings for candidate APIs.  
  - Log out and re-login with the same credentials → login and dashboard should still work with green ticks and no auth errors.

---

## 5. Verification Checklist After Rebuild

1. **Backend**
   - All containers up and healthy.
   - `GET http://localhost:8000/health` returns 200.

2. **Registration**
   - Create a new candidate account (Sign Up → Role: Candidate → Create Account).
   - Console: no 401s for `/v1/candidate/...` or `/v1/interviews?...`; no "No auth_token" for those URLs; at most minimal/expected logs.
   - Redirect to candidate dashboard and dashboard loads (stats/applications/interviews load successfully or empty, not 401).

3. **Re-login**
   - Log out, then sign in with the same candidate email/password.
   - Console: "Adding Authorization header" (if DEV) and successful API responses; no 401s.
   - Dashboard and other candidate pages work as before.

4. **Optional**
   - Repeat registration with recruiter and client; confirm no auth-related console errors and redirects work.

---

## 6. Summary

| Issue | Cause | Fix |
|-------|--------|-----|
| 401 and "No auth_token" during registration | Dashboard requested data before token was in localStorage | AuthContext: confirm token in localStorage and yield one tick before returning from signUp; Dashboard: fetch only when `auth_token` is present |
| "Token missing but user is authenticated" | Same race | Same fixes; plus no warning for `/health` |
| Re-login already worked | Token stored before navigate | No change; fixes ensure registration path matches that behavior |

Backend and database required no code changes; only frontend auth flow and dashboard data-loading were updated. Docker rebuild steps are above; after applying them and the frontend changes, registration and re-login should both complete without auth-related console errors.
