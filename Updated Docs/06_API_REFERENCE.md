# 06 — API Reference

**Status:** ✅ Verified — generated from the **live** `/openapi.json` of each service (2026-08-14), expanded via direct codebase inspection (2026-08-17)
**Owner:** Shashank Mishra

> Authoritative endpoint inventory. Counts were parsed from the production VM at
> `https://sampada.blackholeinfiverse.com` on 2026-08-14. This document supersedes all earlier
> endpoint lists (which cited 108 / 111 / 112 / ~130 inconsistently).

---

## 1. Live Surface Summary (Verified 2026-08-14)

| Service | OpenAPI source | Operations |
|---------|----------------|-----------|
| Gateway | `/gateway/openapi.json` | **172** (GET 87 · POST 80 · PUT 2 · PATCH 1 · DELETE 2) |
| Agent | `/agent/openapi.json` | **6** (GET 4 · POST 2) |
| LangGraph | `/langgraph/openapi.json` | **26** (GET 10 · POST 16) |
| **Total** | | **204** |

Base URLs (production): `https://sampada.blackholeinfiverse.com/gateway`,
`.../agent`, `.../langgraph`. Local: `http://localhost:8000|9000|9001`.

Interactive docs: `/docs` (Swagger) on every service.

---

## 2. Gateway — Core & Monitoring

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | Read root (service info, version) |
| GET | `/health` | Health check |
| GET | `/health/detailed` | Detailed health |
| GET | `/metrics` | Prometheus metrics |
| GET | `/metrics/dashboard` | Metrics dashboard payload |
| GET | `/docs` | Swagger UI |
| GET | `/openapi.json` | OpenAPI spec |
| GET | `/v1/test-candidates` | Test candidates DB |

## 3. Gateway — Jobs

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/v1/jobs` | Create job |
| GET | `/v1/jobs` | List jobs |
| GET | `/v1/jobs/autocomplete` | Jobs autocomplete |
| GET | `/v1/jobs/skills/autocomplete` | Job skills autocomplete |
| GET | `/v1/jobs/locations/autocomplete` | Job locations autocomplete |
| GET | `/v1/jobs/{job_id}` | Get job by ID |
| PUT | `/v1/jobs/{job_id}` | Update job |
| DELETE | `/v1/jobs/{job_id}` | Delete job |
| POST | `/v1/jobs/{job_id}/shortlist` | Shortlist candidate for job |
| POST | `/v1/jobs/{job_id}/reject` | Reject candidate for job |

## 4. Gateway — Candidates

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/v1/candidates` | Get all candidates |
| GET | `/v1/candidates/stats` | Candidate stats (protected) |
| GET | `/v1/candidates/autocomplete` | Candidates autocomplete |
| GET | `/v1/candidates/search` | Search candidates |
| GET | `/v1/candidates/job/{job_id}` | Candidates by job |
| GET | `/v1/candidates/{candidate_id}` | Candidate by ID |
| POST | `/v1/candidates/parse-pdf` | Parse PDF candidates |
| POST | `/v1/candidates/check-duplicates` | Check duplicate candidates |
| POST | `/v1/candidates/bulk` | Bulk upload candidates |

## 5. Gateway — Candidate Portal (auth & profile)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/v1/candidate/register` | Candidate register |
| POST | `/v1/candidate/login` | Candidate login |
| GET | `/v1/candidate/profile/{candidate_id}` | Get candidate profile |
| PUT | `/v1/candidate/profile/{candidate_id}` | Update candidate profile |
| POST | `/v1/candidate/apply` | Apply for job |
| GET | `/v1/candidate/stats/{candidate_id}` | Candidate stats |
| GET | `/v1/candidate/applications/{candidate_id}` | Candidate applications |
| POST | `/v1/candidate/applications/{application_id}/documents/{document_type}` | Upload application document (resume/nda) |

## 6. Gateway — Client Portal

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/v1/client/register` | Client register |
| POST | `/v1/client/login` | Client login |
| GET | `/v1/client/profile` | Get client profile |
| GET | `/v1/client/by-connection/{connection_id}` | Client by connection |
| GET | `/v1/client/connected-recruiter` | Client's connected recruiter |
| GET | `/v1/client/connection-events` | Client connection events (SSE) |
| GET | `/v1/client/jobs` | Client jobs |
| GET | `/v1/client/stats` | Client stats |
| GET | `/v1/client/applicants` | Client applicants |
| POST | `/v1/client/applications/{application_id}/required-documents` | Set required documents |
| GET | `/v1/client/applications/{application_id}/documents/{document_type}` | Get application document |

## 7. Gateway — Recruiter Portal

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/v1/recruiter/jobs` | Recruiter jobs |
| GET | `/v1/recruiter/applicants` | Recruiter applicants |
| POST | `/v1/recruiter/applications/{application_id}/required-documents` | Set required documents |
| GET | `/v1/recruiter/applications/{application_id}/documents/{document_type}` | Get application document |
| GET | `/v1/recruiter/stats` | Recruiter stats |
| POST | `/v1/recruiter/confirm-connection` | Confirm connection |
| POST | `/v1/recruiter/disconnect` | Disconnect |
| GET | `/v1/recruiter/current-connection` | Current connection |
| GET | `/v1/recruiter/connection-events` | Recruiter connection events (SSE) |
| POST | `/v1/connection/health-check` | Connection health check |

## 8. Gateway — Matching, Interviews, Feedback, Offers, Reports

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/v1/match/{job_id}/top` | Get top matches |
| POST | `/v1/match/batch` | Batch match jobs |
| GET | `/v1/interviews` | Get interviews |
| POST | `/v1/interviews` | Schedule interview |
| GET | `/v1/feedback` | Get all feedback |
| POST | `/v1/feedback` | Submit feedback |
| GET | `/v1/offers` | Get all offers |
| POST | `/v1/offers` | Create job offer |
| GET | `/v1/database/schema` | Get database schema |
| GET | `/v1/reports/job/{job_id}/export.csv` | Export job report (CSV) |

## 9. Gateway — Notifications, Automation, Portal Notifications

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/v1/notifications/health` | Notification service health |
| GET | `/v1/notifications/history/{candidate_id}` | Notification history |
| POST | `/v1/notifications/send` | Send notification |
| POST | `/v1/notifications/test-sequence` | Test notification sequence |
| POST | `/v1/notifications/preview` | Get notification preview |
| POST | `/v1/notifications/bulk` | Send bulk notifications |
| POST | `/v1/notifications/send-grouped-by-candidate` | Send grouped notifications |
| POST | `/v1/notifications/send-per-job` | Send per-job notifications |
| POST | `/v1/automation/trigger` | Trigger automation |
| GET | `/v1/portal/notifications` | Portal notifications (bell feed) |
| POST | `/v1/portal/notifications/{notification_id}/read` | Mark notification read |
| POST | `/v1/portal/notifications/read-all` | Mark all read |

## 10. Gateway — Auth, 2FA, Password & Security

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/v1/auth/2fa/setup` | Setup 2FA |
| POST | `/v1/auth/2fa/verify` | Verify 2FA |
| POST | `/v1/auth/2fa/login` | 2FA login |
| GET | `/v1/auth/2fa/status/{user_id}` | 2FA status |
| POST | `/v1/auth/2fa/disable` | Disable 2FA |
| POST | `/v1/auth/2fa/backup-codes` | Generate backup codes |
| POST | `/v1/auth/2fa/test-token` | Test 2FA token |
| GET | `/v1/auth/2fa/qr/{user_id}` | QR code (PNG) |
| POST | `/v1/auth/password/validate` | Validate password |
| GET | `/v1/auth/password/generate` | Generate password |
| GET | `/v1/auth/password/policy` | Password policy |
| POST | `/v1/auth/password/change` | Change password |
| POST | `/v1/auth/password/strength` | Test password strength |
| GET | `/v1/auth/password/security-tips` | Security tips |
| GET | `/v1/security/rate-limit-status` | Rate-limit status |
| GET | `/v1/security/blocked-ips` | Blocked IPs |
| POST | `/v1/security/test-input-validation` | Test input validation (XSS/SQLi) |
| POST | `/v1/security/validate-email` | Validate email |
| POST | `/v1/security/test-email-validation` | Test email validation |
| POST | `/v1/security/validate-phone` | Validate phone |
| POST | `/v1/security/test-phone-validation` | Test phone validation |
| GET | `/v1/security/test-headers` | Test security headers |
| GET | `/v1/security/security-headers-test` | Test security headers (legacy) |
| POST | `/v1/security/penetration-test` | Penetration test |
| GET | `/v1/security/test-auth` | Test authentication |
| GET | `/v1/security/penetration-test-endpoints` | Penetration test endpoints |
| POST | `/v1/security/csp-report` | CSP violation reporting |
| GET | `/v1/security/csp-violations` | View CSP violations |
| GET | `/v1/security/csp-policies` | Current CSP policies |
| POST | `/v1/security/test-csp-policy` | Test CSP policy |

## 11. Gateway — Control Center

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/v1/control-center/audit-events` | Create control-center audit event |
| GET | `/v1/control-center/audit-events` | Get audit events |
| GET | `/v1/control-center/audit-replay` | Audit replay |
| GET | `/v1/control-center/dashboard-aggregates` | Dashboard aggregates |

## 12. Gateway — Workforce Governance (45 routes)

### Organizations / hierarchy
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/v1/workforce/organizations` | Create organization |
| GET | `/v1/workforce/organizations` | List organizations |
| GET | `/v1/workforce/organizations/{org_id}` | Get organization |
| GET | `/v1/workforce/organizations/{org_id}/hierarchy` | Org hierarchy |

### Divisions / units / departments
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/v1/workforce/divisions` | Create division |
| GET | `/v1/workforce/divisions` | List divisions |
| POST | `/v1/workforce/units` | Create unit |
| GET | `/v1/workforce/units` | List units |
| POST | `/v1/workforce/departments` | Create department |
| GET | `/v1/workforce/departments` | List departments |

### Employees & lifecycle
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/v1/workforce/employees` | Create employee |
| GET | `/v1/workforce/employees` | List employees |
| GET | `/v1/workforce/employees/{employee_id}` | Get employee |
| POST | `/v1/workforce/employees/{employee_id}/lifecycle/onboard` | Onboard |
| POST | `/v1/workforce/employees/{employee_id}/lifecycle/onboard-complete` | Complete onboarding |
| POST | `/v1/workforce/employees/{employee_id}/lifecycle/role-move` | Role move |
| POST | `/v1/workforce/employees/{employee_id}/lifecycle/department-transfer` | Department transfer |
| PATCH | `/v1/workforce/employees/{employee_id}/lifecycle/status` | Status change |
| POST | `/v1/workforce/employees/{employee_id}/lifecycle/offboard-prepare` | Offboard prepare |
| GET | `/v1/workforce/trace-replay` | Workforce trace replay |

### Policies
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/v1/policies/seed` | Seed policies |
| GET | `/v1/policies/definitions` | List policy definitions |
| POST | `/v1/policies/definitions` | Create policy definition |
| POST | `/v1/policies/evaluate` | Evaluate policy |
| POST | `/v1/policies/overrides` | Policy override |

### Governance
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/v1/governance/challenges` | List challenges |
| POST | `/v1/governance/challenges` | Create challenge |
| POST | `/v1/governance/reviews` | Assign review |
| POST | `/v1/governance/reviews/{review_id}/complete` | Complete review |
| POST | `/v1/governance/reviews/{review_id}/decision` | Decision from review |
| POST | `/v1/governance/overrides` | Workflow override |
| POST | `/v1/governance/overrides/{override_id}/apply` | Apply override |

### Decisions
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/v1/decisions` | Create decision |
| GET | `/v1/decisions` | List decisions |
| GET | `/v1/decisions/replay` | Decision replay |
| GET | `/v1/decisions/{decision_id}` | Get decision |

### SETU signals
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/v1/setu/signals/{signal_type}` | Submit SETU signal |
| GET | `/v1/setu/signals` | List SETU signals |
| GET | `/v1/setu/trace/{trace_id}` | SETU trace |

## 13. Gateway — Mounted Router Endpoints (`/api/v1`)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/v1/test-communication` | Test communication system |
| POST | `/api/v1/gemini/analyze` | Analyze with Gemini |
| POST | `/api/v1/workflow/trigger` | Trigger workflow |
| GET | `/api/v1/workflow/status/{workflow_id}` | Workflow status |
| GET | `/api/v1/workflow/list` | List workflows |
| GET | `/api/v1/workflows` | List workflows (alt) |
| GET | `/api/v1/workflow/health` | LangGraph health |
| POST | `/api/v1/webhooks/candidate-applied` | Webhook — candidate applied |
| POST | `/api/v1/webhooks/candidate-shortlisted` | Webhook — candidate shortlisted |
| POST | `/api/v1/webhooks/interview-scheduled` | Webhook — interview scheduled |
| POST | `/api/v1/rl/predict` | RL predict match |
| POST | `/api/v1/rl/feedback` | Submit RL feedback |
| GET | `/api/v1/rl/analytics` | RL analytics |
| GET | `/api/v1/rl/performance` | RL performance |

## 14. Gateway — Workflow Bridge (Complete-Infiverse)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/v1/candidate/workflow-bridge-health` | Bridge health |
| GET | `/v1/candidate/workflow-link-status` | Link status |
| POST | `/v1/candidate/workflow-link` | Save workflow link |
| DELETE | `/v1/candidate/workflow-link` | Delete workflow link |
| GET | `/v1/candidate/workflow-tasks` | List tasks |
| GET | `/v1/candidate/workflow-tasks/{task_id}` | Task detail |
| POST | `/v1/candidate/workflow-tasks/{task_id}/submit` | Submit task |

---

## 15. Agent Service (Port 9000) — 6 Operations

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/` | Root info |
| GET | `/health` | Health (v3.0.0) |
| GET | `/test-db` | DB connectivity |
| POST | `/match` | Match candidate-job |
| POST | `/batch-match` | Batch match |
| GET | `/analyze/{candidate_id}` | Candidate analysis |

## 16. LangGraph Service (Port 9001) — 26 Operations

### Workflow
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/workflows/application/start` | Start application workflow |
| GET | `/workflows/{workflow_id}/status` | Workflow status |
| POST | `/workflows/{workflow_id}/resume` | Resume workflow |
| WS | `/ws/{workflow_id}` | Workflow websocket |
| GET | `/workflows` | List workflows |
| GET | `/workflows/stats` | Workflow stats |

### Automation / notifications
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/automation/notifications/send` | Send notification |
| POST | `/automation/test/email` | Test email |
| POST | `/automation/test/whatsapp` | Test WhatsApp |
| POST | `/automation/test/telegram` | Test Telegram |
| POST | `/automation/test/whatsapp-buttons` | Test WhatsApp buttons |
| POST | `/automation/test/sequence` | Test sequence |
| POST | `/automation/workflows/trigger` | Trigger automation workflow |
| POST | `/automation/notifications/bulk` | Bulk notifications |
| POST | `/automation/notifications/preview` | Preview notification |
| POST | `/automation/webhooks/whatsapp` | WhatsApp webhook |

### RL engine
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/rl/predict` | Predict |
| POST | `/rl/feedback` | Feedback |
| GET | `/rl/analytics` | Analytics |
| GET | `/rl/performance/{model_version}` | Performance by model version |
| GET | `/rl/history/{candidate_id}` | Candidate history |
| POST | `/rl/retrain` | Retrain |
| POST | `/rl/start-monitoring` | Start monitoring |

### Misc
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Health (governance advisory) |
| GET | `/test-integration` | Integration test |

---

## 17. Authentication Notes Per Endpoint

- **Public reads**: `GET /health`, `GET /docs`, `GET /openapi.json`, `GET /v1/jobs`,
  `GET /v1/jobs/autocomplete`, login/register endpoints.
- **Protected**: everything else — via `get_auth` (API key or JWT) or role guards
  (`get_candidate_auth`, `get_recruiter_auth`, `get_client_auth`, `get_admin_auth`).
- Verified live: `GET /v1/candidates/stats` → 401 unauthenticated; `GET /langgraph/workflows`
  → 401 unauthenticated.

> Full auth model in `07_AUTHENTICATION_AND_SECURITY.md`.

---

## 18. Frontend-Referenced Routes Not Present in Live OpenAPI

The frontend `src/services/api.ts` references a small set of paths that do **not** appear in the
live gateway OpenAPI (likely renamed/removed): `POST /v1/client/shortlist`,
`POST /v1/client/review/{candidateId}`, `GET /v1/analytics/skills`, `GET /v1/analytics/funnel`,
`GET /v1/tasks`. These are documented in `15_KNOWN_ISSUES_ARCHIVE_INDEX.md` as stale frontend
references, not active API routes.

---

## 19. Next

→ `07_AUTHENTICATION_AND_SECURITY.md`.

---

## Appendix A. Verification Notes (2026-08-17)

The endpoint inventory above was cross-verified through:

1. **Live OpenAPI** (2026-08-14): Parsed from production VM `/openapi.json` — 204 operations total.
2. **Code inspection** (2026-08-17): Direct source code analysis confirmed all endpoints in sections
   10–14 are present in `backend/services/gateway/app/main.py` and its mounted routers. No new
   endpoints were found beyond the 204 already documented.
3. **Frontend cross-check**: `src/services/api.ts` (2293 lines) references all documented endpoints
   plus 4 stale paths noted in section 18 (known issues).
