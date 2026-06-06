# Workforce Lifecycle API

**Owner**: Rishabh Yadav

## Lifecycle States

`draft` → `onboarding` → `active` → (`role_change_pending` | `transfer_pending` | `offboarding_prep` | `inactive`) → `offboarded`

## Endpoints

| Method | Path | Action |
|--------|------|--------|
| POST | `/v1/workforce/employees/{id}/lifecycle/onboard` | Start onboarding |
| POST | `/v1/workforce/employees/{id}/lifecycle/onboard-complete` | Complete onboarding → active |
| POST | `/v1/workforce/employees/{id}/lifecycle/role-move` | Role movement (requires `new_role`) |
| POST | `/v1/workforce/employees/{id}/lifecycle/department-transfer` | Transfer (requires `new_department_id`) |
| PATCH | `/v1/workforce/employees/{id}/lifecycle/status` | Status change (requires `target_state`) |
| POST | `/v1/workforce/employees/{id}/lifecycle/offboard-prepare` | Offboarding preparation |

## Sample Payload — Role Move

```json
{
  "new_role": "senior_analyst",
  "reason": "Promotion after review"
}
```

## Failure Cases

| Case | HTTP | Detail |
|------|------|--------|
| Invalid transition | 409 | e.g. draft → active without onboarding |
| Employee not found | 404 | Wrong ID or cross-tenant access |
| Department not found | 404 | Invalid `new_department_id` |
| Missing required field | 422 | e.g. role-move without `new_role` |
| Unauthorized role | 403 | candidate role blocked |

## Audit Logging

Every transition writes `governance` event to `audit_logs` with `prior_state`, `new_state`, `correlation_id`.
