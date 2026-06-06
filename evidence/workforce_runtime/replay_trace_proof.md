# Replay / Trace Proof

## Workforce replay path

1. Create workforce entities through governance APIs:
   - `POST /v1/workforce/organizations`
   - `POST /v1/workforce/divisions`
   - `POST /v1/workforce/departments`
   - `POST /v1/workforce/employees`
2. Capture response/request `X-Correlation-ID`.
3. Query replay endpoint:
   - `GET /v1/workforce/trace-replay?correlation_id=<captured_cid>`
4. Validate returned event sequence includes workforce writes in order.

## SETU trace continuity path

1. Ingest SETU signals:
   - `POST /v1/setu/signals/niyantran_telemetry`
   - `POST /v1/setu/signals/artha_payroll_visibility`
2. Use shared `trace_id` and correlation metadata in payload lineage.
3. Query trace continuity endpoint:
   - `GET /v1/setu/trace/<trace_id>`
4. Validate continuity response includes expected signal chain and audit references.

## Linked evidence

- `evidence/workforce_runtime/api_proof_workforce.json`
- `evidence/workforce_runtime/setu_signal_proof.json`
- `evidence/workforce_runtime/api_trace_matrix.md`
