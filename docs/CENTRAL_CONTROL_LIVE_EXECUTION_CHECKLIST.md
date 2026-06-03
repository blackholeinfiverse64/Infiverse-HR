# Central Control Live Execution Checklist

Status: implementation completed, rollout pending environment validation
Date: 2026-06-02

## A) Technical Requirements

- [x] Removed mock/static production data path in central control KPI cards.
- [x] Added typed API adapters for gateway dashboard metrics and candidate stats with metadata.
- [x] Added bounded polling + manual refresh path.
- [x] Added source and refresh metadata display in UI.
- [x] Added partial-failure surface without fabricated fallback values.

## B) API Security and Protection

- [x] Protected control-center route in frontend with authenticated `ProtectedRoute`.
- [x] Restricted control-center visibility to command-center roles (`client`, `recruiter`, `admin`).
- [x] Enforced backend auth and role checks on `GET /metrics/dashboard`.
- [x] Enforced backend auth and role checks on `GET /v1/candidates/stats`.
- [x] Kept direct service calls read-only to `/health` probes.

## C) Governance Compliance

- [x] Added visible governance-stage separation (observe, assess, recommend, decision, execute).
- [x] Preserved advisory-only semantics in command center language.
- [x] Tagged source and metric type context in card sublabels.
- [x] Wired replay section to live scoped audit API (`GET /v1/control-center/audit-replay`); advisory-only semantics retained.
- [x] Preserved read-only dashboard boundary (no mutating controls added).

## D) Human Safety Compliance

- [x] No individual-level coercive ranking introduced.
- [x] Kept growth and org visuals aggregated.
- [x] Added clear explainability context for metrics source and type.
- [x] Preserved challenge/review-oriented language and bounded authority statements.

## E) Traceability and Audit Logging

- [x] Added correlation ID propagation middleware on gateway responses.
- [x] Added control-center audit ingestion endpoint: `POST /v1/control-center/audit-events`.
- [x] Added audit read/replay endpoints: `GET /v1/control-center/audit-events`, `GET /v1/control-center/audit-replay`.
- [x] Added backend-driven aggregates: `GET /v1/control-center/dashboard-aggregates`.
- [x] Added frontend audit event emission for view and refresh outcomes.
- [x] Added correlation ID display in dashboard for replay/investigation support.

## F) Verification

- [x] Frontend typecheck passed (`npm run lint` in `frontend`).
- [x] Gateway syntax validation passed (`python -m py_compile backend/services/gateway/app/main.py`).
- [x] Localhost live wiring (2026-06-03): all Control Center UI paths return 200 with platform API key; health on `:8000`, `:9000`, `:9001`.
- [x] E2E runner: `cd backend && set API_KEY_SECRET=... && python tests/e2e/control_center/run_control_center_e2e.py` — 8 passed, 2 skipped (JWT secrets unset).
- [x] Offline + governance unit tests: `test_control_center_offline.py`, `test_task19_control_center_governance.py` — 10 passed.
- [ ] Staging integration test with real service URLs and real role tokens (JWT role matrix).
- [ ] Production canary rollout validation with monitored logs.

### Live wiring verification (2026-06-03)

See `docs/CENTRAL_CONTROL_API_CONTRACT_FREEZE.md` (table: UI function → method/path → verified) and `docs/CONTROL_CENTER_E2E_TEST_FRAMEWORK.md` (E2E command + endpoint list).

Frontend env names (must match `frontend/src/services/api.ts` / `vite-env.d.ts`):

- `VITE_API_BASE_URL`, `VITE_AGENT_SERVICE_URL`, `VITE_LANGGRAPH_SERVICE_URL`, `VITE_ENABLE_CONTROL_CENTER=true`

## G) Rollout Steps (Pending)

1. Configure environment URLs and auth secrets in staging.
2. Start Gateway/Agent/LangGraph and verify health endpoints.
3. Validate role matrix: candidate denied, recruiter/client/admin allowed.
4. Validate `X-Correlation-ID` in metrics and stats responses.
5. Validate `audit_logs` writes for access/refresh events.
6. Run scoped canary before broad rollout.

