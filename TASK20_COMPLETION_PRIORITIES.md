# TASK20_COMPLETION_PRIORITIES.md
# Sampada / INFIVERSE-HR-PLATFORM — Task 20 Completion Work Orders
# Place this file at the repo root and execute all 5 priorities in order.
# Each priority is a self-contained work order. Do not skip steps.
# Priorities 2–5 require no live services. Priority 1 requires MongoDB running.

---

## AGENT EXECUTION RULES

- Read every priority section fully before starting it.
- Execute priorities in order: P1 → P2 → P3 → P4 → P5.
- Do not modify any auth, role enforcement, access control, or scope-filter logic in source code.
- Do not forge approvals, timestamps, or real API responses — use real captured data or leave clearly marked placeholders.
- After completing each priority, print a one-line confirmation: `[DONE] Priority N complete — <summary>`.
- If a step fails, print `[BLOCKED] Priority N step X — <reason>` and continue to the next priority.

---

## PRIORITY 1 — Replace Template Evidence with Real Live Captures

**Goal:** The two JSON proof files under `evidence/workforce_runtime/` are currently self-labeled templates. Replace them with real HTTP response data captured from a live gateway run.

**Requires:** MongoDB running locally OR Atlas URI in `backend/.env`. Gateway able to start on port 8000.

### Steps

**Step 1.1 — Start the gateway**
```
cd backend/services/gateway
uvicorn app.main:app --port 8000 --reload
```
Confirm health: `GET http://localhost:8000/health` returns 200.

**Step 1.2 — Run the workforce creation sequence**

Execute these HTTP calls in order, capturing the full response body each time. Store the returned IDs for use in subsequent calls.

```
POST http://localhost:8000/v1/workforce/organizations
Headers: X-API-Key: <from backend/.env>
Body:
{
  "name": "Northern Region HQ",
  "code": "NR-HQ-001",
  "default_roles": ["org_member"],
  "status": "active"
}
→ Store: org_id from response
→ Store: X-Correlation-ID response header
```

```
POST http://localhost:8000/v1/workforce/divisions
Headers: X-API-Key: <from backend/.env>
Body:
{
  "organization_id": "<org_id>",
  "name": "Operations Division",
  "code": "OPS-001",
  "status": "active"
}
→ Store: division_id
```

```
POST http://localhost:8000/v1/workforce/departments
Headers: X-API-Key: <from backend/.env>
Body:
{
  "organization_id": "<org_id>",
  "name": "Field Operations",
  "code": "FOPS-001",
  "default_roles": ["analyst"],
  "status": "active"
}
→ Store: department_id
```

```
POST http://localhost:8000/v1/workforce/employees
Headers: X-API-Key: <from backend/.env>
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
→ Store: workforce_ref_id
→ Store: trace_id from response lineage
```

```
GET http://localhost:8000/v1/workforce/organizations/<org_id>/hierarchy
Headers: X-API-Key: <from backend/.env>
→ Store: full hierarchy response
```

**Step 1.3 — Run the SETU signal sequence**

```
POST http://localhost:8000/v1/setu/signals/niyantran_telemetry
Headers: X-API-Key: <from backend/.env>
Body:
{
  "payload": {"event": "task_completed", "task_id": "exec-1042"},
  "source_declaration": "niyantran participation",
  "trust_classification": "observed",
  "visibility_scope": "tenant"
}
→ Store: signal_id, trace_id
```

```
POST http://localhost:8000/v1/setu/signals/artha_payroll_visibility
Headers: X-API-Key: <from backend/.env>
Body:
{
  "payload": {"period": "2026-06", "visibility": "summary_only"},
  "source_declaration": "artha participation",
  "trust_classification": "observed",
  "visibility_scope": "tenant"
}
→ Store: signal_id
```

```
GET http://localhost:8000/v1/setu/trace/<trace_id>
Headers: X-API-Key: <from backend/.env>
→ Store: full trace continuity response
```

**Step 1.4 — Replace evidence files**

Overwrite `evidence/workforce_runtime/api_proof_workforce.json` with a JSON object containing:
- `proof_type`: `"api_sequence"`
- `status`: `"live_capture"` (remove `"verified_template"`)
- `captured_at`: real UTC timestamp
- `gateway`: `"http://localhost:8000"`
- `sequence`: array of objects, one per call, each with: `step`, `method`, `path`, `request_body`, `response_status`, `response_body`, `correlation_id`
- `ids_captured`: object with `org_id`, `division_id`, `department_id`, `workforce_ref_id`, `trace_id`

Overwrite `evidence/workforce_runtime/setu_signal_proof.json` with a JSON object containing:
- `proof_type`: `"signal_ingest"`
- `status`: `"live_capture"`
- `captured_at`: real UTC timestamp
- `signals`: array of 2 objects (niyantran + artha), each with: `signal_type`, `signal_id`, `trace_id`, `ownership`, `response_status`, `response_body`
- `trace_continuity`: full response from the trace GET call

**Step 1.5 — Update replay and summary docs**

Update `evidence/workforce_runtime/replay_trace_proof.md`:
- Replace any placeholder correlation_ids with the real `X-Correlation-ID` values captured above.
- Add a section: `## Live Capture Run` with the date, real IDs, and outcome.

Update `evidence/workforce_runtime/test_output_summary.md`:
- Change execution date to today's real date.
- Add the real correlation_id and trace_id captured.
- Change status line from template to `live_capture`.

**Boundary:** Do not modify any source `.py` file. Evidence files only.

---

## PRIORITY 2 — Add Task 20 Endpoints to Production Smoke Test

**Goal:** Extend `backend/tests/e2e/control_center/run_production_smoke.py` to cover Task 20 workforce governance endpoints. Current smoke test (15 tests) covers only health, auth, and control-center routes — none of the Task 20 routes are exercised.

**Requires:** No live service needed to write the code. Tests will run against `GATEWAY_URL` env var (production or local).

### Steps

**Step 2.1 — Read the existing smoke test file**

Open `backend/tests/e2e/control_center/run_production_smoke.py`. Understand the existing test pattern: how tests are defined, how results are recorded, how the report JSON is built.

**Step 2.2 — Add new section after existing tests**

Find the location just before the final summary/report generation block. Insert the following comment and 8 new tests, following the exact same pattern already used in the file:

```
# --- Task 20: Workforce Governance Endpoints ---
```

**Test 1 — `workforce_org_create`**
- `POST /v1/workforce/organizations`
- Body: `{"name": "Smoke Test Org", "code": "SMOKE-001", "status": "active", "default_roles": []}`
- Expect: status 200 or 201, response contains `"id"` or `"_id"` field
- On success: store `org_id` from response for use in test 2

**Test 2 — `workforce_employee_create`**
- `POST /v1/workforce/employees`
- Body: `{"organization_id": "<org_id from test 1>", "workforce_type": "employee", "role": "analyst", "display_name": "Smoke User", "lifecycle_state": "draft", "source_system": "smoke_test"}`
- Expect: status 200 or 201, response contains `"workforce_ref_id"`

**Test 3 — `policy_seed`**
- `POST /v1/policies/seed`
- Body: `{}`
- Expect: status 200, response contains `"seeded"` list

**Test 4 — `policy_evaluate`**
- `POST /v1/policies/evaluate`
- Body: `{"policy_key": "leave_policy", "context": {"tenure_days": 120}}`
- Expect: status 200, response contains `"result"` with `"decision"` field

**Test 5 — `setu_signal_ingest`**
- `POST /v1/setu/signals/niyantran_telemetry`
- Body: `{"payload": {"event": "smoke_check"}, "source_declaration": "smoke test", "trust_classification": "observed", "visibility_scope": "tenant"}`
- Expect: status 200 or 201, response contains `"signal_id"`
- On success: store `trace_id` from response for use in test 6

**Test 6 — `setu_trace_continuity`**
- `GET /v1/setu/trace/<trace_id from test 5>`
- Expect: status 200, response contains `"signal_count"` >= 1

**Test 7 — `decision_create`**
- `POST /v1/decisions`
- Body: `{"owner": "smoke_runner", "scope": "platform", "rationale": "Smoke test decision", "inputs": {"source": "smoke"}, "status": "active"}`
- Expect: status 200 or 201, response contains `"decision_id"`

**Test 8 — `challenge_create`**
- `POST /v1/governance/challenges`
- Body: `{"policy_key": "leave_policy", "reason": "Smoke test challenge", "subject_type": "policy_evaluation"}`
- Expect: status 200 or 201, response contains `"challenge_id"`

**Step 2.3 — Error handling requirement**

Each new test must:
- On failure: log status code + first 200 chars of response body, mark as failed, continue (do not abort remaining tests).
- Use the same `passed`/`failed` counter already used in the file.

**Step 2.4 — Report update**

The final JSON report written to `backend/tests/e2e/control_center/results/control_center_production_smoke_report.json` must include the new 8 tests in its `tests` array and update the `summary.total` count from 15 to 23.

**Boundary:** Do not modify existing 15 tests. Do not change report schema. Only extend.

---

## PRIORITY 3 — Two-Tenant Isolation Test

**Goal:** Create a new pytest test file that proves tenant isolation works at the scope-filter level. No MongoDB connection needed — all DB calls are mocked.

### Steps

**Step 3.1 — Create the test file**

Create `backend/tests/gateway/test_tenant_isolation_workforce.py` with the following content:

**File header docstring:**
```python
"""
Tenant isolation tests for workforce governance scope filters.

These tests validate that:
- tenant_id is correctly injected on writes for client-scope callers
- cross-tenant reads are blocked by scope filter enforcement
- platform-scope callers bypass tenant filtering

No MongoDB connection required — all DB calls are mocked via unittest.mock.
"""
```

**Imports and path setup** (follow same pattern as existing test files):
```python
from __future__ import annotations
import sys
from pathlib import Path
import pytest
from unittest.mock import AsyncMock, MagicMock, patch

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

Mock `db.organizations.insert_one` as an `AsyncMock`. Call `create_organization` (import from `app.workforce_runtime`) with a client-scoped caller having `user_id="TENANT_A"`. Capture the document passed to `insert_one`. Assert `doc["tenant_id"] == "TENANT_A"`.

```python
@pytest.mark.asyncio
async def test_tenant_id_injected_on_org_create():
    from app.workforce_runtime import create_organization
    from app.workforce_common import build_auth_context

    db = MagicMock()
    db.organizations = MagicMock()
    db.organizations.insert_one = AsyncMock(return_value=MagicMock(inserted_id="mock_id_001"))
    db.audit_logs = MagicMock()
    db.audit_logs.insert_one = AsyncMock(return_value=None)

    scope = {"scope": "client", "user_id": "TENANT_A", "role": "org_admin", "type": "jwt_token"}

    from app.workforce_common import ORG_CREATE_BODY  # or inline the body
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

Mock `db.organizations.find_one` to return `None` (simulating no result when TENANT_B's filter is applied to TENANT_A's records). Call the get function. Assert `HTTPException` with status 404 is raised.

```python
@pytest.mark.asyncio
async def test_cross_tenant_read_returns_404():
    from app.workforce_runtime import get_organization
    from fastapi import HTTPException

    db = MagicMock()
    db.organizations = MagicMock()
    db.organizations.find_one = AsyncMock(return_value=None)

    scope_b = {"scope": "client", "user_id": "TENANT_B", "role": "org_admin", "type": "jwt_token"}

    with pytest.raises(HTTPException) as exc_info:
        await get_organization(db, "org_id_owned_by_tenant_a", scope_b)

    assert exc_info.value.status_code == 404, \
        f"Expected 404 for cross-tenant read, got: {exc_info.value.status_code}"
```

**Step 3.2 — Syntax verify**

After writing the file, run:
```
python3 -c "import ast; ast.parse(open('backend/tests/gateway/test_tenant_isolation_workforce.py').read()); print('[PASS] Syntax OK')"
```

**Step 3.3 — Update pytest config**

Open `backend/tests/e2e/control_center/pytest.ini` or the nearest `pytest.ini`/`conftest.py`. Confirm the marker `e2e_unit` is registered. If not, add:
```ini
[pytest]
markers =
    e2e_unit: lightweight unit tests with mocked I/O
    asyncio_mode: auto
```

**Boundary:** Do not modify any source file in `app/`. Test file only.

---

## PRIORITY 4 — Governance Panel Owner Approval Documentation

**Goal:** The frontend governance panel is gated behind `VITE_ENABLE_GOVERNANCE=true` and is not live by default. Create a formal decision record so its non-default state is traceable and auditable. Do NOT enable it — only create the paper trail.

### Steps

**Step 4.1 — Create approval record file**

Create `docs/GOVERNANCE_PANEL_APPROVAL_RECORD.md` with the following structure:

```markdown
# Governance Panel Enablement — Owner Decision Record

| Field               | Value                                      |
|---------------------|--------------------------------------------|
| Decision ID         | GOV-PANEL-001                              |
| Date Raised         | [today's date]                             |
| Raised By           | Shashank (Sampada Support Builder)         |
| Decision Authority  | Rishabh Yadav (System Owner)               |
| Status              | PENDING_OWNER_APPROVAL                     |
| Feature Flag        | VITE_ENABLE_GOVERNANCE=true                |
| Scope               | Frontend ControlCenter.tsx panel visibility|

---

## What Enabling This Panel Does

When `VITE_ENABLE_GOVERNANCE=true` is set in the frontend environment:

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

| | |
|---|---|
| **Approved by** | _________________________ |
| **Name** | Rishabh Yadav (System Owner) |
| **Date** | _________________________ |
| **Signature / Auth token** | _________________________ |
| **Notes** | _________________________ |

---

## Rollback

To disable the panel at any time:
- Remove `VITE_ENABLE_GOVERNANCE=true` from the frontend `.env` file, or set it to `false`
- Redeploy frontend
- No data is deleted. No backend change required.

---

## Related Files

- `frontend/src/pages/control/ControlCenter.tsx` — feature flag check location
- `docs/SAMPADA_CURRENT_STATE.md` — system state reference
- `REVIEW_PACKET.md` — risk register
```

**Step 4.2 — Update REVIEW_PACKET.md**

Find the risks table in `REVIEW_PACKET.md`. Add this row:
```
| Governance panel default off | Low | GOV-PANEL-001 approval record created at docs/GOVERNANCE_PANEL_APPROVAL_RECORD.md — pending owner sign-off |
```

If no risks table exists, add a section:
```markdown
## Risk Register

| Risk | Severity | Mitigation |
|------|----------|------------|
| Governance panel default off | Low | GOV-PANEL-001 approval record created at docs/GOVERNANCE_PANEL_APPROVAL_RECORD.md — pending owner sign-off |
```

**Step 4.3 — Update SAMPADA_CURRENT_STATE.md**

Search for the text `VITE_ENABLE_GOVERNANCE` in `docs/SAMPADA_CURRENT_STATE.md`. Directly below that reference, add:
```
> Governance panel enablement decision pending at docs/GOVERNANCE_PANEL_APPROVAL_RECORD.md (GOV-PANEL-001). Status: PENDING_OWNER_APPROVAL.
```

If `VITE_ENABLE_GOVERNANCE` does not appear in the file, add a new section near the bottom:
```markdown
## Feature Flag Status

| Flag | Default | Decision Record |
|------|---------|-----------------|
| VITE_ENABLE_GOVERNANCE | false (off) | GOV-PANEL-001 — PENDING_OWNER_APPROVAL — see docs/GOVERNANCE_PANEL_APPROVAL_RECORD.md |
```

**Boundary:** Do NOT change any `.env` file. Do NOT change any `.tsx`/`.jsx` file. Documentation only.

---

## PRIORITY 5 — Expand Documentation Depth

**Goal:** Each of the 7 Task 20 runtime docs currently describes architecture but lacks failure cases, audit events, and replay examples. Append three standard sections to each doc without modifying existing content.

**Docs to update (all in `docs/` folder):**
1. `FEDERATED_WORKFORCE_RUNTIME.md`
2. `WORKFORCE_LIFECYCLE_API.md`
3. `POLICY_ENGINE_RUNTIME.md`
4. `DECISION_AND_CHALLENGE_FLOW.md`
5. `DECISION_LEDGER_MODEL.md`
6. `SETU_PARTICIPATION_RUNTIME.md`
7. `OWNERSHIP_AND_LINEAGE_MODEL.md`

### Sections to append to EVERY doc

Append exactly these three sections at the bottom of each file. Customise the table rows and JSON content per doc using the guidance below.

```markdown
---

### Failure Cases

| Scenario | HTTP Status | Error Detail | Audit Event Written |
|----------|-------------|--------------|---------------------|
| <row 1>  | <code>      | <detail>     | Yes / No            |
| <row 2>  | <code>      | <detail>     | Yes / No            |
| <row 3>  | <code>      | <detail>     | Yes / No            |

---

### Audit Events

| Action | Outcome Values | When Fired | Correlation ID Propagated |
|--------|---------------|------------|--------------------------|
| <action> | success / failure | <trigger> | Yes |

---

### Replay Example

```json
{
  "correlation_id": "cid-<doc-specific-placeholder>",
  "event_count": 3,
  "events": [
    {
      "action": "<action_name>",
      "outcome": "success",
      "correlation_id": "cid-<placeholder>",
      "trace_id": "trace-<placeholder>",
      "created_at": "2026-06-06T10:00:00Z"
    },
    ...
  ]
}
```
```

### Per-doc guidance — what rows to fill in

**1. FEDERATED_WORKFORCE_RUNTIME.md**
- Failure cases: invalid `workforce_type` → 422; duplicate org `code` → 409; missing `organization_id` on employee create → 422; unauthorized scope on hierarchy read → 403
- Audit actions: `create_organization`, `create_employee`, `get_org_hierarchy`
- Replay: use action names `create_organization`, `create_division`, `create_employee`

**2. WORKFORCE_LIFECYCLE_API.md**
- Failure cases: invalid transition (e.g. `active` → `draft`) → 409; employee not found → 404; missing required transition field → 422
- Audit actions: `lifecycle_transition` (fired on every valid state change)
- Replay: use action names `lifecycle_transition` with states in event sequence: `draft → onboarding → active`

**3. POLICY_ENGINE_RUNTIME.md**
- Failure cases: unknown `policy_key` → 404; missing context field for rule evaluation → 422; policy override by non-governor → 403
- Audit actions: `policy_evaluation` (on every evaluate call), `policy_override_created` (on override)
- Replay: use action names `policy_seed`, `policy_evaluation`, `policy_override_created`

**4. DECISION_AND_CHALLENGE_FLOW.md**
- Failure cases: challenge on non-existent policy → 404; review assignment to non-existent reviewer → 422; override applied before review complete → 409
- Audit actions: `challenge_created`, `review_assigned`, `review_completed`, `override_applied`
- Replay: use action names in order: `challenge_created`, `review_assigned`, `review_completed`

**5. DECISION_LEDGER_MODEL.md**
- Failure cases: duplicate `decision_id` → 409; missing `owner` or `rationale` field → 422; replay on empty ledger → 200 with empty list (not an error)
- Audit actions: `decision_recorded` (on create), `decision_replay_accessed` (on replay call)
- Replay: use action names `decision_recorded` with two decisions showing `supersedes` chain

**6. SETU_PARTICIPATION_RUNTIME.md**
- Failure cases: unknown `signal_type` in path → 422; missing `source_declaration` → 422; trace_id not found → 404
- Audit actions: `setu_signal_ingested` (on every ingest), ownership field always set by `OWNERSHIP_BY_TYPE`
- Replay: show two signals ingested: `niyantran_telemetry` then `artha_payroll_visibility`, with trace continuity

**7. OWNERSHIP_AND_LINEAGE_MODEL.md**
- Failure cases: lineage envelope missing required field → 500 (internal — envelope is internal not user-facing); mismatched `owning_system` → logged warning, not hard error
- Audit actions: lineage envelope is attached to every workforce audit entry — no standalone audit action; `visibility_scope` field on every event
- Replay: show a lineage envelope block as it appears attached to a workforce event trace entry

### Execution order for Priority 5

Process one file at a time in this order:
1. `POLICY_ENGINE_RUNTIME.md` (simplest)
2. `WORKFORCE_LIFECYCLE_API.md`
3. `FEDERATED_WORKFORCE_RUNTIME.md`
4. `DECISION_LEDGER_MODEL.md`
5. `DECISION_AND_CHALLENGE_FLOW.md`
6. `SETU_PARTICIPATION_RUNTIME.md`
7. `OWNERSHIP_AND_LINEAGE_MODEL.md`

After each file: print `[DONE] P5 — <filename> updated (+N lines)`.

**Boundary:** Append only — do not modify or delete any existing content. Do not edit any source `.py` file.

---

## COMPLETION CHECKLIST

After all 5 priorities are done, verify each item:

- [ ] `evidence/workforce_runtime/api_proof_workforce.json` — status is `"live_capture"`, not `"verified_template"`
- [ ] `evidence/workforce_runtime/setu_signal_proof.json` — contains real signal_ids and trace_ids
- [ ] `evidence/workforce_runtime/replay_trace_proof.md` — contains real correlation_ids
- [ ] `evidence/workforce_runtime/test_output_summary.md` — updated with real execution date
- [ ] `run_production_smoke.py` — 8 new tests added, total count 23
- [ ] `backend/tests/gateway/test_tenant_isolation_workforce.py` — file exists, syntax OK, 5 tests
- [ ] `docs/GOVERNANCE_PANEL_APPROVAL_RECORD.md` — file exists, status is `PENDING_OWNER_APPROVAL`
- [ ] `REVIEW_PACKET.md` — GOV-PANEL-001 row added to risk register
- [ ] `docs/SAMPADA_CURRENT_STATE.md` — GOV-PANEL-001 reference added
- [ ] All 7 docs in `docs/` — each has `Failure Cases`, `Audit Events`, `Replay Example` sections appended

**If all boxes are checked: Task 20 completion work is done.**
