# 07 — Authentication & Security

**Status:** ✅ Verified (2026-08-14)
**Owner:** Shashank Mishra

> The triple-layer authentication model, role-based access, 2FA, password policy, and the input /
> transport security controls. Read after `06_API_REFERENCE.md`.

---

## 1. Authentication Model (Gateway `jwt_auth.py`)

The gateway uses a **triple-layer** authentication scheme resolved by `get_auth`:

| Layer | Credential | Signing secret | Implied role |
|-------|-----------|----------------|--------------|
| 1 — API key | `Authorization: Bearer <API_KEY_SECRET>` | `API_KEY_SECRET` | `admin` |
| 2 — Candidate JWT | `Authorization: Bearer <JWT>` | `CANDIDATE_JWT_SECRET_KEY` (HS256) | `candidate` / `recruiter` |
| 3 — Client JWT | `Authorization: Bearer <JWT>` | `JWT_SECRET_KEY` (HS256) | `client` / `hr` |

Role guards (imported from `dependencies.py`):
- `get_candidate_auth`, `get_recruiter_auth`, `get_client_auth`, `get_admin_auth`,
  `get_optional_auth`, `require_role(...)`.
- Audience-validation fallbacks included for token compatibility.

### Client vs candidate login flows (verified)

| Portal | Endpoint | Response |
|--------|----------|----------|
| Client | `POST /v1/client/login` | `access_token` (client JWT) |
| Candidate / Recruiter | `POST /v1/candidate/login` | JWT with role; recruiter registrations carry a `role` field |

Live check: both endpoints reachable; invalid credentials → `{"success":false,"error":"Invalid credentials"}`
(HTTP 200 with error body).

---

## 2. Frontend Auth Flow (`frontend/src/context/AuthContext.tsx`, `services/authService.ts`)

```text
AuthPage.tsx ─▶ AuthContext.signIn/signUp ─▶ authService.login/register
                                                │
                          /v1/client/login  or  /v1/candidate/login
                                                ▼
                                     token + user_data stored
                                                ▼
                     axios interceptor adds  Authorization: Bearer <token>
```

- **Storage**: sessionStorage-first, localStorage fallback. Keys: `auth_token`, `user_data`,
  `user_role`, `user_email`, `user_name`, `isAuthenticated`, `candidate_id`,
  `backend_candidate_id`, `client_id`, `candidate_profile_data`.
- **Restore**: `AuthContext` decodes the JWT payload (`atob(token.split('.')[1])`), checks `exp`,
  derives role with priority **JWT payload → user_data → user_role → default `candidate`**.
- **Route protection**: `ProtectedRoute` (roles `candidate|recruiter|client|admin`) gates pages;
  `PublicRoute` redirects logged-in users away from `/auth`. Wrong-role access redirects to the
  correct dashboard.
- **Logout**: clears all keys and the `Authorization` header.

---

## 3. Role-Based Access (frontend route gates)

| Role | Routes (verified in `App.tsx`) |
|------|--------------------------------|
| `candidate` | `/candidate/dashboard`, `/profile`, `/jobs`, `/applied-jobs`, `/interviews`, `/tasks`, `/tasks/:taskId`, `/feedback` |
| `recruiter` | `/recruiter` (+ create-job, upload-candidates, jobs, candidate-search, screening, applicants/:jobId, schedule-interview, values-assessment, feedback/:candidateId, export-reports, client-jobs, batch-operations, automation, reports) |
| `client` | `/client` (+ dashboard, jobs, candidates, matches, live-monitoring, reports) |
| `client\|recruiter\|admin` | `/control` (Control Center) |

---

## 4. 2FA (TOTP)

Endpoints: `/v1/auth/2fa/*` — setup, verify, login, status, disable, backup-codes, test-token, QR.
- QR code generation via `qrcode[pil]`; OTP verification via `pyotp`.
- Backup codes are stored/validated server-side.

---

## 5. Password Policy Engine

- `POST /v1/auth/password/validate` → strength score 0–100 + feedback list.
- `GET /v1/auth/password/policy` → `min_length` etc.
- Weak-password rejections are part of the security test suite.

---

## 6. Input & Transport Security

| Control | Implementation |
|---------|----------------|
| XSS / SQLi blocking | `POST /v1/security/test-input-validation` + gateway input validation |
| Email validation | `POST /v1/security/validate-email`, `test-email-validation` |
| Phone validation | `POST /v1/security/validate-phone`, `test-phone-validation` |
| CSP | violation reporting `POST /v1/security/csp-report`, view `GET /v1/security/csp-violations`, policies `GET /v1/security/csp-policies` |
| Security headers | `GET /v1/security/test-headers` (+ legacy variant) |
| Rate limiting | `GET /v1/security/rate-limit-status`; `rate_limits` collection with TTL expiry |
| Blocked IPs | `GET /v1/security/blocked-ips` |
| Penetration test helpers | `POST /v1/security/penetration-test`, `GET /v1/security/test-auth` |
| Prometheus metrics | `GET /metrics` (no PII) |

---

## 7. Multi-Tenant Isolation

- Client-scoped access rules enforced in the gateway domain handlers.
- Workforce documents carry `tenant_id` scoping via the `LineageEnvelope`
  (`app/lineage_envelope.py`) plus `write_workforce_audit` hooks.
- Tenant isolation verification suites: `backend/tests/gateway/test_tenant_isolation_workforce.py`.

---

## 8. Security Hygiene (do not violate)

- **Never commit** `.env` files or any real secret to the repository. `.gitignore` covers
  `.env`, `.env.local`, `.env.production`.
- Do not log tokens, passwords, or PII. `LOG_FORMAT=json` is the production logging standard.
- Do not weaken the auth guards (`get_auth`, role guards) to make testing easier.
- Secrets live in the owner's secure channel (see archived
  `handover/11_CREDENTIALS_REGISTER.md`); the repository stores only placeholders.

---

## 9. Verification Evidence (2026-08-14)

- Unauthenticated protected endpoints returned **401** (candidate stats, langgraph workflows).
- Invalid-credential logins returned `success:false` (auth guards functional).
- Security test suites exist under `backend/tests/security/` (9 files) — see `10_TESTING_AND_EVIDENCE.md`.

---

## 10. Next

→ `08_DATABASE.md`.
