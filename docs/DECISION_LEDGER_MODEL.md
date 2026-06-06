# Decision Ledger Model

**Task20 Phase 5** | **Owner**: Rishabh Yadav

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| decision_id | string | Unique decision identifier |
| owner | string | Decision owner (human/system) |
| scope | string | Tenant/org scope |
| rationale | string | Why the decision was made |
| inputs | object | Input context |
| timestamp | datetime | When recorded |
| dependencies | string[] | Related decision IDs |
| status | string | active, superseded |
| supersedes | string | Prior decision_id replaced |
| trace_references | string[] | Correlation/trace IDs |

## Storage

MongoDB collection: `decisions` (append-only; supersession via `supersedes` link)

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/v1/decisions` | Record decision |
| GET | `/v1/decisions` | List decisions (scoped) |
| GET | `/v1/decisions/{id}` | Get decision |
| GET | `/v1/decisions/replay` | Reconstruct chain |

## Replay Reconstruction

1. **supersedes_chain**: Start at `decision_id`, follow `supersedes` backward
2. **correlation_timeline**: All decisions sharing `correlation_id` sorted by timestamp

## Sample Entries

```json
{
  "decision_id": "dec-a1b2c3",
  "owner": "Rishabh Yadav",
  "scope": "TECH001",
  "rationale": "Visibility challenge upheld — scope corrected",
  "status": "active",
  "trace_references": ["cid-uuid-1"]
}
```
