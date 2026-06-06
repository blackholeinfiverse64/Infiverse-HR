# Policy Engine Runtime

**Task20 Phase 3** | **Owner**: Rishabh Yadav

## Components

| Component | Collection | Purpose |
|-----------|------------|---------|
| Policy Registry | `policy_registry` | Tenant policy index |
| Policy Definitions | `policy_definitions` | Versioned rules |
| Policy Evaluation | `policy_evaluations` | Evaluation results |
| Policy Override | `policy_overrides` | Explicit overrides |
| Policy Audit | `audit_logs` | `policy_evaluate`, `policy_override` events |

## Example Policies (seeded)

1. **leave_policy** — tenure-based leave observation
2. **visibility_policy** — scope-match visibility
3. **growth_policy** — derived growth signal bounds
4. **approval_policy** — explicit approval required
5. **retention_policy** — retention boundaries

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/v1/policies/seed` | Seed example policies for tenant |
| GET | `/v1/policies/definitions` | List policy definitions |
| POST | `/v1/policies/definitions` | Create policy definition |
| POST | `/v1/policies/evaluate` | Evaluate policy against context |
| POST | `/v1/policies/overrides` | Record policy override |

## Sample Evaluate Request

```json
{
  "policy_key": "leave_policy",
  "context": { "tenure_days": 120 },
  "employee_id": "<employee_id>",
  "organization_id": "<org_id>"
}
```

## Sample Evaluate Response

```json
{
  "evaluation_id": "peval-abc123",
  "policy_key": "leave_policy",
  "result": { "decision": "allow", "effect": "observe", "rationale": "policy=leave_policy" },
  "correlation_id": "<uuid>"
}
```
