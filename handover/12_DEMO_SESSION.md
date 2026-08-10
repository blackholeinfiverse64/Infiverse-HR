# 12 — Demo Session Guide

**Status:** In Progress (provisional credentials; client login issue pending fix)  
**Owner:** Shashank Mishra  
**Audience:** Vijay Dhawan, Soham Kotkar  
**Last updated:** 2026-08-08  
**Production URL:** `https://sampada.blackholeinfiverse.com/`

---

## Demo Environment

| Component | URL | Status |
|-----------|-----|--------|
| Frontend | `https://sampada.blackholeinfiverse.com/` | ✅ Verified EVD-002 |
| Gateway API | `https://sampada.blackholeinfiverse.com/gateway` | ✅ Verified |
| Gateway docs | `https://sampada.blackholeinfiverse.com/gateway/docs` | ✅ Verified |
| Agent | `https://sampada.blackholeinfiverse.com/agent` | ✅ Verified |
| LangGraph | `https://sampada.blackholeinfiverse.com/langgraph` | ✅ Verified |

---

## Demo Credentials (Provisional)

> **⚠️ PROVISIONAL — owner will update before final handover.**  
> Passwords are intentionally not documented here — request current values through the owner's secure channel before the demo. See [11_CREDENTIALS_REGISTER.md](11_CREDENTIALS_REGISTER.md) (corrected 2026-08-10 to remove a derivation pattern that had been noted there).

| Role | Email | Portal Route (UI) | API Login |
|------|-------|-------------------|-----------|
| Candidate | `shashankmishra33@gmail.com` | `/candidate/login` (or portal selector) | `POST /gateway/v1/candidate/login` |
| Recruiter | `nikhilpawar07@gmail.com` | `/recruiter/login` (or portal selector) | `POST /gateway/v1/candidate/login` |
| Client | `vinayaktiwari27@gmail.com` | `/client/login` | `POST /gateway/v1/client/login` |

### Login verification status (2026-08-08, EVD-002)

| Role | Result | Notes |
|------|--------|-------|
| Candidate | ✅ Success | JWT token returned |
| Recruiter | ✅ Success | Uses candidate login endpoint; role=`recruiter` from DB |
| Client | ⚠️ Fail | Server error: datetime comparison bug — fix before demo |

---

## Login Flows by Role

### 1. Candidate

1. Open `https://sampada.blackholeinfiverse.com/`
2. Navigate to Candidate portal / login page
3. Enter provisional email and password (see register)
4. Expected: redirect to candidate dashboard — profile, job applications, assessments

**API test (no password in logs):**
```bash
curl -X POST "https://sampada.blackholeinfiverse.com/gateway/v1/candidate/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"<candidate-email>","password":"<password>"}'
```
Expected: `"success": true` with JWT `token`.

### 2. Recruiter

1. Open frontend → Recruiter portal / login
2. Enter provisional recruiter email and password
3. Expected: recruiter dashboard — jobs, applicants, stats (`/v1/recruiter/*` APIs)

**Note:** Recruiters use the **same API endpoint** as candidates (`/v1/candidate/login`). The gateway reads `role` from the MongoDB `candidates` collection.

### 3. Client

1. Open frontend → Client portal / login
2. Enter provisional client email and password
3. Expected: client dashboard — job postings, candidate pipeline

**Known issue:** Client login currently fails with a server-side datetime error (EVD-002). Resolve before recording demo session.

**API payload:** `{"email": "<client-email>", "password": "<password>"}` or `{"client_id": "...", "password": "..."}`

---

## Suggested Demo Agenda

| # | Topic | Duration | Notes |
|---|-------|----------|-------|
| 1 | Architecture overview | 10 min | VM path routing, Render backup |
| 2 | Health checks | 5 min | `/gateway/health`, `/agent/health`, `/langgraph/health` |
| 3 | Candidate flow | 10 min | Login → profile → apply to job |
| 4 | Recruiter flow | 10 min | Login → view applicants → stats |
| 5 | Client flow | 10 min | Login → post job → review pipeline *(blocked until client login fix)* |
| 6 | Control Center / governance | 10 min | If access available |
| 7 | CI/CD deploy walkthrough | 10 min | GitHub Actions → VM |
| 8 | SETU signal flow | 10 min | If partner services available |
| 9 | Q&A | 15 min | — |

---

## Pre-Demo Checklist

- [ ] Owner confirms final demo credentials (replace provisional)
- [ ] Client login bug fixed and re-verified
- [ ] VM health checks pass (run EVD-002 commands)
- [ ] Screen recording tool ready
- [ ] Vijay and Soham have frontend access (no admin required for UI demo)

---

## Recording

Store recording outside repo or link in evidence index:

- Target: `handover/evidence/EVD-050` (see [evidence/INDEX.md](evidence/INDEX.md))
- Include timestamps matching agenda above

---

## Source Material

- [backend/handover/DEMO_RUNBOOK.md](../backend/handover/DEMO_RUNBOOK.md)
- [11_CREDENTIALS_REGISTER.md](11_CREDENTIALS_REGISTER.md)
- [04_PRODUCTION_INFRASTRUCTURE.md](04_PRODUCTION_INFRASTRUCTURE.md)
- [docs/CONTROL_CENTER_E2E_TEST_FRAMEWORK.md](../docs/CONTROL_CENTER_E2E_TEST_FRAMEWORK.md)

---

## Evidence Links

- [EVD-002 — Health + login smoke test](evidence/health-checks/vm-health-check-2026-08-08.md)
