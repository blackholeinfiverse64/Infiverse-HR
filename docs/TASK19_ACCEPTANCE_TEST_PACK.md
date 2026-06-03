# Task19 Acceptance Test Pack

Executable checks for runtime governance hardening. Run from repository root.

## 0. Control Center E2E suite (localhost pipeline)

Full data-flow validation (baseline → pipeline → final → compare) with JSON report:

```bash
cd backend
# export API_KEY_SECRET=...  (and optional JWT/MONGODB_URI)
python tests/e2e/control_center/run_control_center_e2e.py
```

See **`docs/CONTROL_CENTER_E2E_TEST_FRAMEWORK.md`** for environment variables, offline vs live runs, and expected output.

Offline helpers only:

```bash
cd backend
python -m pytest tests/e2e/control_center/test_control_center_offline.py -v
```

## 1. Unit tests (policy scope + audit mapping)

```bash
cd backend
python -m pytest tests/gateway/test_task19_control_center_governance.py -v
```

**Covers:** scope resolution, role gate, audit trace mapping, scoped empty stats.

## 2. Gateway compile check

```bash
python -m py_compile services/gateway/app/main.py services/gateway/app/control_center_governance.py
```

## 3. Authz — control center endpoints (manual, staging)

Use a JWT for `client`, `recruiter`, or `admin` and `VITE_API_BASE_URL` / Gateway URL.

| Check | Command | Expected |
|-------|---------|----------|
| Metrics dashboard allowed | `curl -H "Authorization: Bearer $TOKEN" $GATEWAY/metrics/dashboard` | 200 + `policy_scope` |
| Candidate denied (candidate role) | Bearer candidate token → `/metrics/dashboard` | 403 |
| Audit replay live | `curl -H "Authorization: Bearer $TOKEN" $GATEWAY/v1/control-center/audit-replay` | 200, `source: audit_logs` |
| Dashboard aggregates | `curl -H "Authorization: Bearer $TOKEN" $GATEWAY/v1/control-center/dashboard-aggregates` | 200, `hiring_funnel` array |
| Correlation header | `-i` on any above | `X-Correlation-ID` present |

## 4. Scope isolation

1. Log in as **client A**, open Command Center, note scoped stats.
2. Log in as **client B**, confirm different `policy_scope.scope_label` and stats (when data exists).
3. Admin sees `scope: platform` in `policy_scope`.

## 5. Governance separation (UI)

1. Set `VITE_ENABLE_CONTROL_CENTER=true` on frontend.
2. Open `/control` as client/recruiter/admin — governance stage strip visible; no execute actions.
3. Replay zone shows advisory note; events from `audit_logs` only.

## 6. Traceability

1. Refresh control center → `control_center_refresh` audit row in MongoDB `audit_logs`.
2. Agent/LangGraph `/health` returns `correlation_id` when `X-Correlation-ID` sent.

## 7. LangGraph RL retrain protection

```bash
curl -X POST $LANGGRAPH/rl/retrain
# Expected: 401/403 without API key
curl -X POST -H "Authorization: Bearer $API_KEY" $LANGGRAPH/rl/retrain
# Expected: 200 or business validation response
```

## 8. Frontend lint

```bash
cd frontend && npm run lint
```

## Evidence artifacts

- `docs/TASK19_REQUIREMENT_EVIDENCE_MATRIX.md`
- `REVIEW_PACKET.md` (runtime section)
- `CONTRIBUTION_LOG.md` (Task19 runtime closure entry)
