# Ownership and Lineage Model

**Owner**: Rishabh Yadav

## Lineage Envelope (required on cross-system signals)

| Field | Description |
|-------|-------------|
| origin_system | System that originated the signal |
| owning_system | Authoritative data owner |
| schema_version | Contract version |
| trace_id | End-to-end trace |
| correlation_id | Request/flow correlation |
| trust_classification | canonical \| derived \| observed \| challenged |
| visibility_scope | platform \| tenant \| org \| department \| restricted |

## Implementation

- Module: `backend/services/gateway/app/lineage_envelope.py`
- Attached to: workforce entities, policy evaluations, decisions, SETU signals, audit logs

## Propagation

- Gateway `X-Correlation-ID` middleware sets `request.state.correlation_id`
- Workforce governance routes pass correlation ID into all write operations
- Audit logs store `trace_id` and `correlation_id` at top level

## Example

```json
{
  "lineage": {
    "origin_system": "niyantran",
    "owning_system": "niyantran",
    "schema_version": "1.0.0",
    "trace_id": "trace-abc",
    "correlation_id": "cid-abc",
    "trust_classification": "observed",
    "visibility_scope": "tenant"
  }
}
```
