# SETU Participation Runtime

**Task20 Phase 6** | **Owner**: Rishabh Yadav

## Participation Contracts

| Signal Type | Owning System | Schema Reference |
|-------------|---------------|------------------|
| niyantran_telemetry | niyantran | `docs/schemas/execution_telemetry.json` |
| artha_payroll_visibility | artha | `docs/schemas/payroll_visibility.json` |
| crm_participation | crm | SETU convergence map |
| setu_aggregation | setu | SETU convergence map |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/v1/setu/signals/{signal_type}` | Ingest participation signal |
| GET | `/v1/setu/signals` | List signals (scoped) |
| GET | `/v1/setu/trace/{trace_id}` | Trace continuity across signals + audits |

## Required Metadata

- ownership metadata (via LineageEnvelope)
- source_declaration
- correlation_id
- lineage references
- trace continuity (shared trace_id)

## Sample Niyantran Telemetry Ingest

```json
{
  "payload": { "event": "task_completed", "task_id": "t-001" },
  "workforce_ref_id": "wf-abc123",
  "source_declaration": "Niyantran execution telemetry",
  "origin_system": "niyantran",
  "trust_classification": "observed"
}
```

## Storage

MongoDB collection: `setu_signals`

Evidence: `evidence/task20/setu_signal_proof.json`
