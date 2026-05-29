# 🧪 BHIV HR Platform — Convergence Review Packet

**Status**: ✅ All 10 categories COMPLETE
**Evidence Collected**: 2026-05-26T13:35:50Z (live against Docker containers)
**Docs Updated**: 2026-05-26T13:38:00Z (this session)
**Maintained by**: Shashank (Sampada, Support Builder)
**For Acceptance Review By**: Rishabh Yadav

> **Note**: Docker services are fully online and healthy. Evidence was successfully collected/re-run in the current session against live running containers.

### Supporting Documentation
- [SHASHANK_REENTRY_ALIGNMENT.md](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/docs/SHASHANK_REENTRY_ALIGNMENT.md) — All 6 named roles, constitutional boundaries, architecture understanding
- [SAMPADA_CURRENT_STATE.md](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/docs/SAMPADA_CURRENT_STATE.md) — 12-section developer handover document
- [EXECUTION_UNDERSTANDING_SUMMARY.md](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/docs/EXECUTION_UNDERSTANDING_SUMMARY.md) — Sprint priorities and proof requirements
- [CONVERGENCE_SUPPORT_LOG.md](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/docs/CONVERGENCE_SUPPORT_LOG.md) — Timestamped work log across all 3 sessions
- [ALIGNMENT_SYNC_NOTES.md](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/docs/ALIGNMENT_SYNC_NOTES.md) — Team alignment decisions and open questions

---

## 1. Entry Points
The system enforces a strict **triple-authentication model** separating administrator, tenant, and self-service scopes.

* **API Key (System Admin Scope)**:
  - **Secret**: `prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o`
  - **Usage**: Administrative statistics, direct matching query, and service-to-service communication.
  - **Evidence File**: [api-key-sample.txt](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/entry-points/api-key-sample.txt)
* **Client JWT (Tenant Scope)**:
  - **Token**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiJURUNIMDAxIiwiZW1haWwiOiJ0ZWNoMDAxQHRlc3QuY29tIiwicm9sZSI6ImNsaWVudCJ9.dMbImh6FoyaNH6u2w0C-FTVwQbCkJCfz7o50GtW4iVk` (signed via `JWT_SECRET_KEY` for client `TECH001`).
  - **Usage**: Scoped to view own jobs, candidate matches, and tenant metrics.
  - **Evidence File**: [client-jwt-sample.txt](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/entry-points/client-jwt-sample.txt)
* **Candidate JWT (Self-Service Scope)**:
  - **Token**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjYW5kaWRhdGVfaWQiOiJ0ZXN0X2NhbmRfMDAxIiwiZW1haWwiOiJjYW5kQHRlc3QuY29tIiwicm9sZSI6ImNhbmRpZGF0ZSJ9.X8vRN6MqG0tybaUa6Cw0Xn0jS3_FFBhn2sPELJCNFHE` (signed via `CANDIDATE_JWT_SECRET_KEY` for candidate `test_cand_001`).
  - **Usage**: Candidate profile update, job browsing, and self-application submissions.
  - **Evidence File**: [candidate-jwt-sample.txt](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/entry-points/candidate-jwt-sample.txt)

Authentication implementation rules are verified in `backend/services/gateway/jwt_auth.py`. 
Reproducible CLI commands are documented in [curl-examples.sh](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/entry-points/curl-examples.sh).

---

## 2. Live Execution Flow
We executed an end-to-end recruitment lifecycle scenario showing seamless operation:

1. **Job Creation**: Client A (`TECH001`) posted a "Staff AI Engineer" position to `/v1/jobs`. Received `job_id`: `6a15a13f0caf5b91bd0e9de4`.
2. **AI Semantic Matching**: The API Gateway requested matching from the AI Agent service at `/v1/match/6a15a13f0caf5b91bd0e9de4/top` (computing similarity against 240 database candidates).
3. **Candidate Apply**: Candidate `test_cand_001` applied for the newly created job posting via `/v1/candidate/apply`.
4. **LangGraph Automation Trigger**: Gateway triggered the candidate application workflow via the webhook `/api/v1/webhooks/candidate-applied`.
5. **Workflow Status Check**: The state machine status was queried at `/api/v1/workflow/status/{id}` returning `running`.

The captured payloads, response codes, and step sequences are recorded in [request-trace.log](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/trace-continuity/request-trace.log).

---

## 3. Real Trace Continuity
Request correlation was verified end-to-end using a unique request correlation ID (`trace_conv_17_257502`). The trace was successfully propagated through the microservice hops:

* **Hop 1: Job Creation** — Gateway POST `/v1/jobs` (Client JWT)
  - *Timestamp*: `2026-05-26T13:33:51.776Z` | *Correlation ID*: `trace_conv_17_257502` | *Latency*: `47ms`
* **Hop 2: AI Matching** — Gateway GET `/v1/match/{id}/top` requests semantic calculation from Agent.
  - *Timestamp*: `2026-05-26T13:35:21.828Z` | *Correlation ID*: `trace_conv_17_257502` | *Latency*: `90052ms`
* **Hop 3: Application Creation** — Gateway POST `/v1/candidate/apply` (Candidate JWT)
  - *Timestamp*: `2026-05-26T13:35:21.846Z` | *Correlation ID*: `trace_conv_17_257502` | *Latency*: `18ms`
* **Hop 4: Workflow Trigger** — Gateway POST `/api/v1/webhooks/candidate-applied` calls LangGraph service.
  - *Timestamp*: `2026-05-26T13:35:21.963Z` | *Correlation ID*: `trace_conv_17_257502` | *Workflow ID*: `d5df0069-1bfd-4402-a9cc-f13e2e7a8e29` | *Latency*: `117ms`
* **Hop 5: Status Query** — Gateway GET `/api/v1/workflow/status/{id}` queries LangGraph.
  - *Timestamp*: `2026-05-26T13:35:22.014Z` | *Correlation ID*: `trace_conv_17_257502` | *Latency*: `51ms`

Detailed step metrics and latency analyses are in [trace-analysis.txt](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/trace-continuity/trace-analysis.txt).

---

## 4. Real Downstream Participation
To prove downstream workflow engagement, recruiter signals were injected to release notification loops and evaluate decisions in LangGraph:

1. **Shortlisted Webhook**: Called `/api/v1/webhooks/candidate-shortlisted` to simulate recruiter shortlisting. This triggers LangGraph to send notifications via Email and WhatsApp (via Twilio).
2. **Interview Scheduled Webhook**: Called `/api/v1/webhooks/interview-scheduled` to trigger calendar event creation and notifications.

Downstream service responses are saved in [downstream-participation.log](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/tests/downstream-participation.log).

---

## 5. Enforcement Proof
We verified role-based access control (RBAC) and tenant isolation through systematic negative tests:

* **Authentication Enforcement**: 
  - Accessing `/v1/client/stats` without headers returned `401 Unauthorized`.
  - Accessing with a corrupt/invalid token returned `401 Unauthorized` with detail `"Invalid authentication token"`.
* **RBAC Role Constraints**: 
  - Candidate JWT trying to view client stats returned `403 Forbidden` (`"This endpoint is only available for clients"`).
  - Recruiter JWT trying to view client stats returned `403 Forbidden` (`"This endpoint is only available for clients"`).
  - Candidate `test_cand_001` querying the stats of candidate `test_cand_999` returned `403 Forbidden` (`"You can only view your own stats"`).
* **Multi-Tenant Isolation**: 
  - Client B (`STARTUP01`) attempted to query the job details of a job created by Client A (`TECH001`) via GET `/v1/jobs/6a15a13f0caf5b91bd0e9de4`.
  - **Result**: Request was blocked with `403 Forbidden` and details: `{"detail":"You can only view your own jobs"}`.

Test results are logged in [rbac-results.log](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/enforcement/rbac-results.log) and [tenant-isolation-results.log](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/enforcement/tenant-isolation-results.log).

---

## 6. Replay Reconstruction
Workflows are deterministic and can be recovered from database audit logs. We wrote a replay engine [replay_script.js](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/replay/replay_script.js) that:
1. Reads chronological audit events (Job creation → Candidate apply → Interview scheduled → Feedback submitted → Offer extended).
2. Sequentially rebuilds the state machine.
3. Compares the final state with the expected state.

**Result**: State validation completed successfully, proving deterministic lifecycle transitions.
Execution output is available in [replay-output.log](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/replay/replay-output.log).

---

## 7. Failure Observability
The platform handles failures gracefully without crashes and logs detailed diagnostic context:

* **Weak Credentials**: Posting a simple password to password validator returns `is_valid: false` and a feedback array listing specific unmet rules.
* **XSS Attack Injection**: Malicious script payloads sent to `/v1/security/test-input-validation` are flagged as `BLOCKED` with detailed threat context logged.
* **MFA Failures**: Bad TOTP verification codes return `401 Unauthorized` with clear reason details.
* **Resource Absence**: Requesting missing ObjectId strings returns `404 Not Found` with resource class details.

Scenario details and logs are collected in [failure-observability.log](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/failure/failure-observability.log) and [failure-scenarios.md](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/failure/failure-scenarios.md).

---

## 8. Constitutional Boundaries
To enforce the locked separation model, visibility actions must be read-only and never trigger state changes or execution tasks:

- GET endpoints (/health/detailed, /v1/jobs, /v1/candidates/stats) only retrieve database snapshots and CPU/memory metrics.
- Verified in tests that candidate counts and job tables remain unchanged during repeated visibility queries.

Verification details are logged in [boundaries-verification.txt](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/boundaries/boundaries-verification.txt).

---

## 9. Ownership Matrix
System ownership boundaries are strictly mapped to prevent scope creep:

| Area | Owner | Role | Authority |
| :--- | :--- | :--- | :--- |
| **System & Architecture** | Rishabh Yadav | Owner / Leader | State mutation, prioritizations, acceptance approval |
| **Frontend UI** | Nikhil | Collaborator | Interface wiring, API mapping, data display |
| **Infra & DevOps** | Vinayak / Raj | Collaborator | Port mappings, container lifecycles, cluster uptime |
| **Observability & Docs** | Shashank (Sampada) | Support Builder | Trace evidence, replay verification, handbook steward |

Refer to [SAMPADA_CURRENT_STATE.md](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/docs/SAMPADA_CURRENT_STATE.md) for the complete state documentation. The signed copy is saved in [ownership_matrix.md](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/ownership/ownership_matrix.md).

---

## 10. Proof / Screenshots / Logs
All convergence logs and scripts are stored in the following folder structures under the project root:

- [evidence/entry-points/](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/entry-points) — Sample tokens and curl commands.
- [evidence/trace-continuity/](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/trace-continuity) — Core workflow trace and correlation logs.
- [evidence/enforcement/](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/enforcement) — RBAC test runs and tenant isolation verification.
- [evidence/replay/](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/replay) — State reconstruction script and output logs.
- [evidence/failure/](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/failure) — Observability checks and scenario documents.
- [evidence/boundaries/](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/boundaries) — Visibility vs execution boundaries verification.
- [evidence/ownership/](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/ownership) — System ownership and responsibility matrix file.
- [evidence/general/](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/general) — General verification summaries.
- [evidence/tests/](file:///c:/Users/Shani/Downloads/INFIVERSE-HR-PLATFORM-main/evidence/tests) — Overall health check summaries and downstream participation logs.
