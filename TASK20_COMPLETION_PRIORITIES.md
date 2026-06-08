# TASK20_COMPLETION_PRIORITIES.md
# Sampada / INFIVERSE-HR-PLATFORM — Task 20 Completion Work Orders
# Place this file at the repo root and execute all 5 priorities in order.
# Each priority is a self-contained work order. Do not skip steps.
# ALL tests and captures run against the live production gateway — NOT localhost.

---

## PRODUCTION ENVIRONMENT

| Resource | Value |
|----------|-------|
| Gateway (production) | `https://bhiv-hr-gateway-l0xp.onrender.com` |
| Auth header | `Authorization: Bearer <API_KEY_SECRET>` |
| API key source | `API_KEY_SECRET` env var (same as used in run_production_smoke.py) |
| Health check | `GET https://bhiv-hr-gateway-l0xp.onrender.com/health` |

**Never use localhost in any URL. All calls hit the production Render gateway.**

---

## AGENT EXECUTION RULES

- Read every priority section fully before starting it.
- Execute priorities in order: P1 → P2 → P3 → P4 → P5.
- Do not modify any auth, role enforcement, access control, or scope-filter logic in source code.
- Do not forge approvals, timestamps, or real API responses — use real captured data or leave clearly marked placeholders.
- After completing each priority, print a one-line confirmation: `[DONE] Priority N complete — <summary>`.
- If a step fails, print `[BLOCKED] Priority N step X — <reason>` and continue to the next priority.
- All HTTP calls use the production gateway URL defined in the PRODUCTION ENVIRONMENT table above.

---

## PRIORITY 1 — Replace Template Evidence with Real Live Captures

**Goal:** The two JSON proof files under `evidence/workforce_runtime/` are self-labeled templates.
Replace them with real HTTP response data captured from the live production gateway.

**Requires:** `API_KEY_SECRET` environment variable set. No local services needed.

### Steps

**Step 1.1 — Confirm production gateway is healthy**

```
GET https://bhiv-hr-gateway-l0xp.onrender.com/health
Headers: Authorization: Bearer <API_KEY_SECRET>
```
Must return HTTP 200 before proceeding. If not 200, print `[BLOCKED] P1 Step 1.1 — gateway unhealthy` and stop Priority 1.

**Step 1.2 — Run the workforce creation sequence**

Execute these HTTP calls in order against the production gateway. Capture the full response body and response headers each time. Store returned IDs for subsequent calls.

```
POST https://bhiv-hr-gateway-l0xp.onrender.com/v1/workforce/organizations
Headers:
  Authorization: Bearer <API_KEY_SECRET>
  Content-Type: application/json
Body:
{
  "name": "Northern Region HQ",
  "code": "NR-HQ-001",
  "default_roles": ["org_member"],
  "status": "active"
}
→ Store: org_id from response body
→ Store: X-Correlation-ID from response headers
```

```
POST https://bhiv-hr-gateway-l0xp.onrender.com/v1/workforce/divisions
Headers:
  Authorization: Bearer <API_KEY_SECRET>
  Content-Type: application/json
Body:
{
  "organization_id": "<org_id from above>",
  "name": "Operations Division",
  "code": "OPS-001",
  "status": "active"
}
→ Store: division_id from response body
```

```
POST https://bhiv-hr-gateway-l0xp.onrender.com/v1/workforce/departments
Headers:
  Authorization: Bearer <API_KEY_SECRET>
  Content-Type: application/json
Body:
{
  "organization_id": "<org_id>",
  "name": "Field Operations",
  "code": "FOPS-001",
  "default_roles": ["analyst"],
  "status": "active"
}
→ Store: department_id from response body
```

```
POST https://bhiv-hr-gateway-l0xp.onrender.com/v1/workforce/employees
Headers:
  Authorization: Bearer <API_KEY_SECRET>
  Content-Type: application/json
Body:
{
  "organization_id": "<org_id>",
  "department_id": "<department_id>",
  "workforce_type": "contractor",
  "role": "analyst",
  "display_name": "A. Sharma",
  "email": "a.sharma@test.local",
  "lifecycle_state": "draft",
  "source_system": "sampada"
}
→ Store: workforce_ref_id from response body
→ Store: trace_id from response lineage field
```

```
GET https://bhiv-hr-gateway-l0xp.onrender.com/v1/workforce/organizations/<org_id>/hierarchy
Headers:
  Authorization: Bearer <API_KEY_SECRET>
→ Store: full hierarchy response body
```

**Step 1.3 — Run the SETU signal sequence**

```
POST https://bhiv-hr-gateway-l0xp.onrender.com/v1/setu/signals/niyantran_telemetry
Headers:
  Authorization: Bearer <API_KEY_SECRET>
  Content-Type: application/json
Body:
{
  "payload": {"event": "task_completed", "task_id": "exec-1042"},
  "source_declaration": "niyantran participation",
  "trust_classification": "observed",
  "visibility_scope": "tenant"
}
→ Store: signal_id from response body
→ Store: trace_id from response lineage field
```

```
POST https://bhiv-hr-gateway-l0xp.onrender.com/v1/setu/signals/artha_payroll_visibility
Headers:
  Authorization: Bearer <API_KEY_SECRET>
  Content-Type: application/json
Body:
{
  "payload": {"period": "2026-06", "visibility": "summary_only"},
  "source_declaration": "artha participation",
  "trust_classification": "observed",
  "visibility_scope": "tenant"
}
→ Store: signal_id from response body
```

```
GET https://bhiv-hr-gateway-l0xp.onrender.com/v1/setu/trace/<trace_id from niyantran signal>
Headers:
  Authorization: Bearer <API_KEY_SECRET>
→ Store: full trace continuity response body
```

**Step 1.4 — Replace evidence files**

Overwrite `evidence/workforce_runtime/api_proof_workforce.json` with:
```json
{
  "proof_type": "api_sequence",
  "status": "live_capture",
  "captured_at": "<real UTC timestamp>",
  "gateway": "https://bhiv-hr-gateway-l0xp.onrender.com",
  "sequence": [
    {
      "step": 1,
      "method": "POST",
      "path": "/v1/workforce/organizations",
      "request_body": { ... },
      "response_status": <real status>,
      "response_body": { ... full real response ... },
      "correlation_id": "<real X-Correlation-ID>"
    },
    ... one entry per call made in Step 1.2 ...
  ],
  "ids_captured": {
    "org_id": "<real id>",
    "division_id": "<real id>",
    "department_id": "<real id>",
    "workforce_ref_id": "<real id>",
    "trace_id": "<real id>"
  }
}
```
Remove `"verified_template"` entirely. Every ID and timestamp must be real values from the actual responses.

Overwrite `evidence/workforce_runtime/setu_signal_proof.json` with:
```json
{
  "proof_type": "signal_ingest",
  "status": "live_capture",
  "captured_at": "<real UTC timestamp>",
  "gateway": "https://bhiv-hr-gateway-l0xp.onrender.com",
  "signals": [
    {
      "signal_type": "niyantran_telemetry",
      "signal_id": "<real signal_id>",
      "trace_id": "<real trace_id>",
      "ownership": "niyantran",
      "response_status": <real status>,
      "response_body": { ... full real response ... }
    },
    {
      "signal_type": "artha_payroll_visibility",
      "signal_id": "<real signal_id>",
      "trace_id": "<real trace_id>",
      "ownership": "artha",
      "response_status": <real status>,
      "response_body": { ... full real response ... }
    }
  ],
  "trace_continuity": { ... full real response from GET /v1/setu/trace/<trace_id> ... }
}
```

**Step 1.5 — Update replay and summary docs**

Update `evidence/workforce_runtime/replay_trace_proof.md`:
- Replace any placeholder correlation_ids with the real `X-Correlation-ID` values from Step 1.2.
- Add a section `## Live Production Capture` with: date, gateway URL, real org_id, real trace_id, outcome.

Update `evidence/workforce_runtime/test_output_summary.md`:
- Change execution date to today's real date.
- Change gateway reference to `https://bhiv-hr-gateway-l0xp.onrender.com`.
- Add real correlation_id and trace_id captured.
- Change status from `verified_template` to `live_capture`.

**Boundary:** Do not modify any `.py` source file. Evidence files only.

---

## PRIORITY 2 — Add Task 20 Endpoints to Production Smoke Test

**Goal:** Extend `backend/tests/e2e/control_center/run_production_smoke.py` to cover Task 20
workforce governance endpoints against the production gateway. Current smoke test (15 tests) covers
only health, auth, and control-center routes.

**Requires:** Same `API_KEY_SECRET` env var already used by the existing smoke test.
Tests target `GATEWAY` variable already defined in the file (`https://bhiv-hr-gateway-l0xp.onrender.com`).

### Steps

**Step 2.1 — Read the existing smoke test file**

Open `backend/tests/e2e/control_center/run_production_smoke.py`.
Note how existing tests are structured: each test uses `client.get/post(f"{GATEWAY}/path", headers=headers)`,
checks the status code, records result with `_rec(name, passed, detail)` or equivalent, and catches exceptions.
The `GATEWAY` variable and `headers` (Bearer token) are already defined at the top — use them exactly as-is.

**Step 2.2 — Add new section after existing tests**

Find the location just before the final summary/report-generation block.
Insert a comment and 8 new tests following the exact pattern already in the file.
Use the existing `GATEWAY`, `headers`, and result-recording function without redefinition.

```python
# --- Task 20: Workforce Governance Endpoints ---
```

**Test 1 — `workforce_org_create`**
- `POST {GATEWAY}/v1/workforce/organizations`
- Use `headers` already defined (Bearer token)
- Body: `{"name": "Smoke Test Org", "code": "SMOKE-001", "status": "active", "default_roles": []}`
- Pass if: status 200 or 201 AND response JSON contains `"id"` or `"_id"` key
- On pass: store `org_id` from response for test 2
- On fail: log status + first 300 chars of response body; set `org_id = None`

**Test 2 — `workforce_employee_create`**
- `POST {GATEWAY}/v1/workforce/employees`
- Body: `{"organization_id": org_id, "workforce_type": "employee", "role": "analyst", "display_name": "Smoke User", "lifecycle_state": "draft", "source_system": "smoke_test"}`
- Skip with `[SKIP]` detail if `org_id is None` (test 1 failed)
- Pass if: status 200 or 201 AND response contains `"workforce_ref_id"`

**Test 3 — `policy_seed`**
- `POST {GATEWAY}/v1/policies/seed`
- Body: `{}`
- Pass if: status 200 AND response contains `"seeded"` key

**Test 4 — `policy_evaluate`**
- `POST {GATEWAY}/v1/policies/evaluate`
- Body: `{"policy_key": "leave_policy", "context": {"tenure_days": 120}}`
- Pass if: status 200 AND response contains `"result"` with `"decision"` field

**Test 5 — `setu_signal_ingest`**
- `POST {GATEWAY}/v1/setu/signals/niyantran_telemetry`
- Body: `{"payload": {"event": "smoke_check"}, "source_declaration": "smoke test", "trust_classification": "observed", "visibility_scope": "tenant"}`
- Pass if: status 200 or 201 AND response contains `"signal_id"`
- On pass: store `smoke_trace_id` from response for test 6
- On fail: set `smoke_trace_id = None`

**Test 6 — `setu_trace_continuity`**
- `GET {GATEWAY}/v1/setu/trace/{smoke_trace_id}`
- Skip if `smoke_trace_id is None`
- Pass if: status 200 AND response contains `"signal_count"` with value >= 1

**Test 7 — `decision_create`**
- `POST {GATEWAY}/v1/decisions`
- Body: `{"owner": "smoke_runner", "scope": "platform", "rationale": "Smoke test decision", "inputs": {"source": "smoke"}, "status": "active"}`
- Pass if: status 200 or 201 AND response contains `"decision_id"`

**Test 8 — `challenge_create`**
- `POST {GATEWAY}/v1/governance/challenges`
- Body: `{"policy_key": "leave_policy", "reason": "Smoke test challenge", "subject_type": "policy_evaluation"}`
- Pass if: status 200 or 201 AND response contains `"challenge_id"`

**Step 2.3 — Error handling requirement**

Every new test must:
- Wrap the HTTP call in a `try/except Exception` the same way existing tests do.
- On any exception: mark as failed, log the exception message, continue.
- Never abort the remaining tests on failure.

**Step 2.4 — Report update**

The JSON report written to `backend/tests/e2e/control_center/results/control_center_production_smoke_report.json`
must include all 8 new tests in the `tests` array.
Update `summary.total` from 15 to 23.
The `gateway` field in the report must remain `https://bhiv-hr-gateway-l0xp.onrender.com`.

**Boundary:** Do not touch, reorder, or rename any of the existing 15 tests. Only extend.

---

## PRIORITY 3 — Two-Tenant Isolation Test

**Goal:** Create a new pytest test file proving tenant isolation works at the scope-filter level.
No live services needed — all MongoDB calls are mocked.

### Steps

**Step 3.1 — Create the test file**

Create `backend/tests/gateway/test_tenant_isolation_workforce.py`.

**File docstring:**
```python
"""
Tenant isolation tests for workforce governance scope filters.

Validates that:
- tenant_id is injected on writes for client-scope callers
- cross-tenant reads are blocked by scope filter enforcement
- platform-scope callers bypass tenant filtering

No MongoDB or live gateway required — all DB calls mocked via unittest.mock.
Production gateway: https://bhiv-hr-gateway-l0xp.onrender.com
"""
```

**Imports and path setup** (follow exact pattern of existing test files):
```python
from __future__ import annotations
import sys
from pathlib import Path
import pytest
from unittest.mock import AsyncMock, MagicMock

GATEWAY_ROOT = Path(__file__).resolve().parents[2] / "services" / "gateway"
if str(GATEWAY_ROOT) not in sys.path:
    sys.path.insert(0, str(GATEWAY_ROOT))

from app.workforce_common import workforce_scope_filter, LIFECYCLE_STATES

pytestmark = pytest.mark.e2e_unit
```

**Test 1 — `test_tenant_scope_filter_client_isolates_to_user_id`**
```python
def test_tenant_scope_filter_client_isolates_to_user_id():
    scope = {"scope": "client", "user_id": "TENANT_A"}
    result = workforce_scope_filter(scope)
    assert result == {"tenant_id": "TENANT_A"}
```

**Test 2 — `test_tenant_scope_filter_different_tenants_produce_different_filters`**
```python
def test_tenant_scope_filter_different_tenants_produce_different_filters():
    scope_a = {"scope": "client", "user_id": "TENANT_A"}
    scope_b = {"scope": "client", "user_id": "TENANT_B"}
    assert workforce_scope_filter(scope_a) != workforce_scope_filter(scope_b)
```

**Test 3 — `test_platform_scope_bypasses_tenant_filter`**
```python
def test_platform_scope_bypasses_tenant_filter():
    scope = {"scope": "platform"}
    result = workforce_scope_filter(scope)
    assert result == {}
```

**Test 4 — `test_tenant_id_injected_on_org_create`**
```python
@pytest.mark.asyncio
async def test_tenant_id_injected_on_org_create():
    from app.workforce_runtime import create_organization

    db = MagicMock()
    db.organizations = MagicMock()
    db.organizations.insert_one = AsyncMock(return_value=MagicMock(inserted_id="mock_id_001"))
    db.audit_logs = MagicMock()
    db.audit_logs.insert_one = AsyncMock(return_value=None)

    scope = {"scope": "client", "user_id": "TENANT_A", "role": "org_admin", "type": "jwt_token"}

    body = MagicMock()
    body.name = "Tenant A Org"
    body.code = "TA-001"
    body.status = "active"
    body.default_roles = []

    await create_organization(db, body, scope, correlation_id="test-cid-001")

    call_args = db.organizations.insert_one.call_args[0][0]
    assert call_args.get("tenant_id") == "TENANT_A", \
        f"Expected tenant_id=TENANT_A in inserted doc, got: {call_args}"
```

**Test 5 — `test_cross_tenant_read_returns_404`**
```python
@pytest.mark.asyncio
async def test_cross_tenant_read_returns_404():
    from app.workforce_runtime import get_organization
    from fastapi import HTTPException

    db = MagicMock()
    db.organizations = MagicMock()
    # Returns None — simulates scope filter finding no record for TENANT_B on TENANT_A's data
    db.organizations.find_one = AsyncMock(return_value=None)

    scope_b = {"scope": "client", "user_id": "TENANT_B", "role": "org_admin", "type": "jwt_token"}

    with pytest.raises(HTTPException) as exc_info:
        await get_organization(db, "org_id_owned_by_tenant_a", scope_b)

    assert exc_info.value.status_code == 404, \
        f"Expected 404 for cross-tenant read, got: {exc_info.value.status_code}"
```

**Step 3.2 — Syntax verify**

Run immediately after creating the file:
```
python3 -c "import ast; ast.parse(open('backend/tests/gateway/test_tenant_isolation_workforce.py').read()); print('[PASS] Syntax OK')"
```
If this fails, fix the syntax error before proceeding.

**Step 3.3 — Register pytest marker**

Open `backend/tests/e2e/control_center/pytest.ini` or the nearest `pytest.ini`.
Confirm `e2e_unit` is listed under `[pytest] markers =`.
If not found, add it. Also ensure `asyncio_mode = auto` is set for async tests.

**Boundary:** Do not modify any `.py` file in `app/`. Test file and config only.

---

## PRIORITY 4 — Governance Panel Owner Approval Documentation

**Goal:** The frontend governance panel is gated behind `VITE_ENABLE_GOVERNANCE=true` and off by default.
Create a formal traceable decision record for this. Do NOT enable the panel — paper trail only.

### Steps

**Step 4.1 — Create approval record file**

Create `docs/GOVERNANCE_PANEL_APPROVAL_RECORD.md` with this exact content:

```markdown
# Governance Panel Enablement — Owner Decision Record

| Field              | Value                                       |
|--------------------|---------------------------------------------|
| Decision ID        | GOV-PANEL-001                               |
| Date Raised        | [today's date]                              |
| Raised By          | Shashank (Sampada Support Builder)          |
| Decision Authority | Rishabh Yadav (System Owner)                |
| Status             | PENDING_OWNER_APPROVAL                      |
| Feature Flag       | VITE_ENABLE_GOVERNANCE=true                 |
| Scope              | Frontend ControlCenter.tsx panel visibility |
| Production URL     | https://sampada.blackholeinfiverse.com      |

---

## What Enabling This Panel Does

When `VITE_ENABLE_GOVERNANCE=true` is set in the frontend environment and redeployed to Vercel:

- Organization count is visible on the Control Center dashboard
- Policy registry and policy count are visible
- Challenge count and open challenge list are visible
- Decision count and decision list (read-only) are visible
- SETU signal count by signal type is visible
- Workforce trace replay events are browsable

All data shown is **read-only observation**. No execution capability is added.

---

## What This Panel Does NOT Do

- Does not grant authority to execute decisions
- Does not expose payroll amounts or individual salary data
- Does not add surveillance, tracking, or employee ranking capability
- Does not create any new data — only surfaces existing audit/trace data
- Does not change any role permissions or access control rules

---

## Boundary Statement

> **Visibility ≠ Authority.**
> Enabling this panel makes governance data observable to authorized operators.
> It does not transfer ownership of any system, decision, or data asset.
> Payroll ownership remains with Artha. Execution authority remains with designated governors.
> This panel is a diagnostic and oversight instrument only.

---

## Approval

|                          |                           |
|--------------------------|---------------------------|
| **Approved by**          | _________________________ |
| **Name**                 | Rishabh Yadav (System Owner) |
| **Date**                 | _________________________ |
| **Signature / Auth token** | _________________________|
| **Notes**                | _________________________ |

---

## Rollback

To disable the panel at any time:
1. Remove `VITE_ENABLE_GOVERNANCE=true` from the Vercel environment variables, or set it to `false`
2. Trigger a Vercel redeploy
3. No data is deleted. No backend change required.

---

## Related Files

- `frontend/src/pages/control/ControlCenter.tsx` — feature flag check location
- `docs/SAMPADA_CURRENT_STATE.md` — system state reference
- `REVIEW_PACKET.md` — risk register
- Production frontend: `https://sampada.blackholeinfiverse.com`
- Production gateway: `https://bhiv-hr-gateway-l0xp.onrender.com`
```

**Step 4.2 — Update REVIEW_PACKET.md**

Find the risks table. Add this row:
```
| Governance panel default off | Low | GOV-PANEL-001 approval record created at docs/GOVERNANCE_PANEL_APPROVAL_RECORD.md — pending Rishabh sign-off |
```
If no risks table exists, add:
```markdown
## Risk Register

| Risk | Severity | Mitigation |
|------|----------|------------|
| Governance panel default off | Low | GOV-PANEL-001 approval record at docs/GOVERNANCE_PANEL_APPROVAL_RECORD.md — pending Rishabh sign-off |
```

**Step 4.3 — Update SAMPADA_CURRENT_STATE.md**

Search for `VITE_ENABLE_GOVERNANCE` in the file. If found, add directly below it:
```
> Governance panel enablement decision pending at docs/GOVERNANCE_PANEL_APPROVAL_RECORD.md (GOV-PANEL-001). Status: PENDING_OWNER_APPROVAL.
```
If not found, add near the bottom:
```markdown
## Feature Flag Status

| Flag | Default | Decision Record |
|------|---------|-----------------|
| VITE_ENABLE_GOVERNANCE | false (off) | GOV-PANEL-001 — PENDING_OWNER_APPROVAL — see docs/GOVERNANCE_PANEL_APPROVAL_RECORD.md |
```

**Boundary:** Do NOT touch any `.env` file, Vercel config, or `.tsx`/`.jsx` file. Documentation only.

---

## PRIORITY 5 — Expand Documentation Depth

**Goal:** The 7 Task 20 runtime docs describe architecture well but lack failure cases, audit events,
and replay examples. Append three standard sections to each — do not change existing content.

**Docs to update (all in `docs/` folder):**
1. `FEDERATED_WORKFORCE_RUNTIME.md`
2. `WORKFORCE_LIFECYCLE_API.md`
3. `POLICY_ENGINE_RUNTIME.md`
4. `DECISION_AND_CHALLENGE_FLOW.md`
5. `DECISION_LEDGER_MODEL.md`
6. `SETU_PARTICIPATION_RUNTIME.md`
7. `OWNERSHIP_AND_LINEAGE_MODEL.md`

### Template — append to every doc

```markdown
---

### Failure Cases

| Scenario | HTTP Status | Error Detail | Audit Event Written |
|----------|-------------|--------------|---------------------|
| <row>    | <code>      | <detail>     | Yes / No            |

---

### Audit Events

| Action | Outcome Values | When Fired | Correlation ID Propagated |
|--------|---------------|------------|--------------------------|
| <action> | success / failure | <trigger> | Yes |

---

### Replay Example

```json
{
  "correlation_id": "cid-<placeholder>",
  "event_count": 3,
  "events": [
    {
      "action": "<action_name>",
      "outcome": "success",
      "correlation_id": "cid-<placeholder>",
      "trace_id": "trace-<placeholder>",
      "created_at": "2026-06-06T10:00:00Z"
    }
  ]
}
```
```

### Per-doc content guidance

Before writing each doc's sections, **read the corresponding source file** in
`backend/services/gateway/app/` to find real `HTTPException` raises and `write_workforce_audit` calls.
Use only failure modes and audit actions that actually exist in the code.

**1. FEDERATED_WORKFORCE_RUNTIME.md** — source: `workforce_runtime.py`
- Failures: invalid `workforce_type` → 422; duplicate org `code` → 409; missing `organization_id` on employee create → 422; unauthorized scope on hierarchy read → 403
- Audit actions: `create_organization`, `create_employee`, `get_org_hierarchy`
- Replay: `create_organization` → `create_division` → `create_employee`

**2. WORKFORCE_LIFECYCLE_API.md** — source: `workforce_lifecycle.py`
- Failures: invalid transition e.g. `active → draft` → 409; employee not found → 404; missing required field → 422
- Audit actions: `lifecycle_transition` (fired on every valid state change)
- Replay: `lifecycle_transition` sequence: `draft → onboarding → active`

**3. POLICY_ENGINE_RUNTIME.md** — source: `policy_engine.py`
- Failures: unknown `policy_key` → 404; missing context field → 422; override by non-governor → 403
- Audit actions: `policy_evaluation`, `policy_override_created`
- Replay: `policy_seed` → `policy_evaluation` → `policy_override_created`

**4. DECISION_AND_CHALLENGE_FLOW.md** — source: `decision_workflow.py`
- Failures: challenge on non-existent policy → 404; review assigned to invalid reviewer → 422; override applied before review complete → 409
- Audit actions: `challenge_created`, `review_assigned`, `review_completed`, `override_applied`
- Replay: `challenge_created` → `review_assigned` → `review_completed`

**5. DECISION_LEDGER_MODEL.md** — source: `decision_ledger.py`
- Failures: duplicate `decision_id` → 409; missing `owner` or `rationale` → 422; replay on empty ledger → 200 empty list (not error)
- Audit actions: `decision_recorded`, `decision_replay_accessed`
- Replay: two `decision_recorded` entries showing `supersedes` chain

**6. SETU_PARTICIPATION_RUNTIME.md** — source: `setu_participation.py`
- Failures: unknown `signal_type` in path → 422; missing `source_declaration` → 422; `trace_id` not found → 404
- Audit actions: `setu_signal_ingested` (ownership always set by `OWNERSHIP_BY_TYPE`)
- Replay: `niyantran_telemetry` ingest → `artha_payroll_visibility` ingest → trace continuity response

**7. OWNERSHIP_AND_LINEAGE_MODEL.md** — source: `lineage_envelope.py`
- Failures: missing required envelope field → 500 (internal); mismatched `owning_system` → logged warning, not hard error
- Audit actions: lineage envelope attached to every audit entry — no standalone action; `visibility_scope` on every event
- Replay: lineage envelope block as it appears in a workforce event trace entry

### Execution order

Process one file at a time:
1. `POLICY_ENGINE_RUNTIME.md`
2. `WORKFORCE_LIFECYCLE_API.md`
3. `FEDERATED_WORKFORCE_RUNTIME.md`
4. `DECISION_LEDGER_MODEL.md`
5. `DECISION_AND_CHALLENGE_FLOW.md`
6. `SETU_PARTICIPATION_RUNTIME.md`
7. `OWNERSHIP_AND_LINEAGE_MODEL.md`

After each file print: `[DONE] P5 — <filename> updated (+N lines)`

**Boundary:** Append only — do not modify or delete any existing content in any doc.
Do not edit any `.py` source file.

---

## COMPLETION CHECKLIST

Run through every item after all 5 priorities finish:

- [ ] `evidence/workforce_runtime/api_proof_workforce.json` — `"status": "live_capture"`, contains real IDs and real gateway URL `https://bhiv-hr-gateway-l0xp.onrender.com`
- [ ] `evidence/workforce_runtime/setu_signal_proof.json` — real `signal_id` and `trace_id` values present, not placeholders
- [ ] `evidence/workforce_runtime/replay_trace_proof.md` — real `X-Correlation-ID` values from production run
- [ ] `evidence/workforce_runtime/test_output_summary.md` — real execution date, real IDs, status `live_capture`
- [ ] `backend/tests/e2e/control_center/run_production_smoke.py` — 8 new Task 20 tests added, total 23, all pointing to `GATEWAY` variable (production Render URL)
- [ ] `backend/tests/gateway/test_tenant_isolation_workforce.py` — file exists, 5 tests, `python3 -c "import ast; ast.parse(...)"` returns `[PASS] Syntax OK`
- [ ] `docs/GOVERNANCE_PANEL_APPROVAL_RECORD.md` — exists, `Status: PENDING_OWNER_APPROVAL`, production URL present
- [ ] `REVIEW_PACKET.md` — GOV-PANEL-001 row in risk register
- [ ] `docs/SAMPADA_CURRENT_STATE.md` — GOV-PANEL-001 reference added
- [ ] All 7 docs in `docs/` — each has `### Failure Cases`, `### Audit Events`, `### Replay Example` appended

**If all 10 boxes are checked: Task 20 completion work is done.**
