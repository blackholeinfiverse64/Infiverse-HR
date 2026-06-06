# Decision and Challenge Flow

**Owner**: Rishabh Yadav

## Challenge Lifecycle

```
open → under_review → resolved | rejected
```

| Status | Meaning |
|--------|---------|
| open | Challenge filed against policy evaluation |
| under_review | Review assigned |
| resolved | Review upheld challenge |
| rejected | Review rejected challenge |

## Review Lifecycle

```
assigned → completed
```

## Override Lifecycle

```
proposed → applied | rejected
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/v1/governance/challenges` | Create challenge |
| GET | `/v1/governance/challenges` | List challenges |
| POST | `/v1/governance/reviews` | Assign review |
| POST | `/v1/governance/reviews/{id}/complete` | Complete review |
| POST | `/v1/governance/overrides` | Record workflow override |
| POST | `/v1/governance/overrides/{id}/apply` | Apply override |
| POST | `/v1/governance/reviews/{id}/decision` | Record decision from review |

## Sample Challenge

```json
{
  "policy_key": "visibility_policy",
  "evaluation_id": "peval-abc123",
  "reason": "Scope boundary appears incorrect for department view"
}
```

## Collections

- `challenges` — challenge records
- `reviews` — review assignments and outcomes
- `workflow_overrides` — override proposals and applied state
