# Task20 Replay / Trace Proof

## Scope

This evidence records replay proof paths for Task20 workforce and SETU flows.

## Workforce Replay Path

1. Create workforce entities through Task20 APIs:
   - `POST /v1/workforce/organizations`
   - `POST /v1/workforce/divisions`
   - `POST /v1/workforce/departments`
   - `POST /v1/workforce/employees`
2. Capture response/request `X-Correlation-ID`.
3. Query replay endpoint:
   - `GET /v1/workforce/trace-replay?correlation_id=<captured_cid>`
4. Validate returned event sequence includes Task20 writes in order.

## SETU Trace Continuity Path

1. Ingest Task20 SETU signals:
   - `POST /v1/setu/signals/niyantran_telemetry`
   - `POST /v1/setu/signals/artha_payroll_visibility`
2. Use shared `trace_id` and correlation metadata in payload lineage.
3. Query trace continuity endpoint:
   - `GET /v1/setu/trace/<trace_id>`
4. Validate continuity response includes expected signal chain and audit references.

## Linked Evidence Files

- `evidence/task20/api_proof_workforce.json`
- `evidence/task20/setu_signal_proof.json`
- `evidence/task20/api_trace_matrix.md`
