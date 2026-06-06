# Federated Workforce Runtime

**Task20 Phase 1** | **Owner**: Rishabh Yadav | **Status**: Runtime live in gateway

## Overview

Live workforce identity and organization hierarchy runtime for Sampada. Recruitment entities (`candidates`, `jobs`) remain separate from workforce entities (`employees`, `organizations`).

## MongoDB Collections

| Collection | Purpose |
|------------|---------|
| `organizations` | Top-level org units with tenant isolation |
| `divisions` | Divisions under organizations |
| `units` | Units under divisions |
| `departments` | Departments with team structures |
| `employees` | Federated workforce records |

## Entity Schemas

### Organization
- `name`, `code`, `parent_organization_id`, `default_roles`, `status`, `tenant_id`, `lineage`

### Division
- `organization_id`, `name`, `code`, `status`, `tenant_id`, `lineage`

### Unit
- `division_id`, `name`, `code`, `status`, `tenant_id`, `lineage`

### Department
- `organization_id`, `unit_id`, `name`, `code`, `teams[]`, `default_roles[]`, `status`, `tenant_id`, `lineage`

### Employee
- `workforce_ref_id`, `organization_id`, `department_id`, `unit_id`
- `workforce_type`: contractor | employee | consultant | advisor | intern | vendor_workforce
- `role`, `inherited_roles[]`, `lifecycle_state`, `display_name`, `email`
- `local_system_id`, `source_system`, `tenant_id`, `lineage`

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/v1/workforce/organizations` | Create organization |
| GET | `/v1/workforce/organizations` | List organizations (scoped) |
| GET | `/v1/workforce/organizations/{id}` | Get organization |
| GET | `/v1/workforce/organizations/{id}/hierarchy` | Full hierarchy tree |
| POST | `/v1/workforce/divisions` | Create division |
| GET | `/v1/workforce/divisions` | List divisions |
| POST | `/v1/workforce/units` | Create unit |
| GET | `/v1/workforce/units` | List units |
| POST | `/v1/workforce/departments` | Create department |
| GET | `/v1/workforce/departments` | List departments |
| POST | `/v1/workforce/employees` | Create employee |
| GET | `/v1/workforce/employees` | List employees |
| GET | `/v1/workforce/employees/{id}` | Get employee |
| GET | `/v1/workforce/trace-replay` | Workforce audit trace replay |

## Sample Payload — Create Employee

```json
{
  "organization_id": "<org_id>",
  "department_id": "<dept_id>",
  "workforce_type": "contractor",
  "role": "analyst",
  "display_name": "Sample Contractor",
  "lifecycle_state": "draft"
}
```

## Trace / Replay Proof

1. Create org → division → department → employee (note `X-Correlation-ID` header).
2. `GET /v1/workforce/trace-replay?correlation_id=<cid>`
3. Verify audit events: `organization_create`, `employee_create`, etc.

Evidence: `evidence/task20/api_proof_workforce.json`
