# SETU Participation Evidence (Live WO/GE/SETU Sprint · Phase 5)

**Date**: 2026-06-27
**Gateway base URL**: in-process FastAPI app mounting the real `routes/workforce_governance_routes.py` router
**Environment**: local in-process runtime over in-memory async Mongo (`mongomock_motor`) — real runtime code path; not deployed
**Auth type used**: API key (platform/admin)
**Status**: `partial_capture` — Sampada-side participation mechanics are runtime-proven; **external-system-initiated participation is NOT available in this environment** (see Verified vs Simulated)
**Raw capture**: `evidence/live_workforce_governance_setu/setu_participation/phase5_signals.json`

> Owner / acceptance authority: Rishabh Yadav. Builder surfaces evidence only.

---

## Scenario Narrative

All four SETU signal types — `niyantran_telemetry`, `artha_payroll_visibility`, `crm_participation`, `setu_aggregation` — were ingested through the real `/v1/setu/signals/{signal_type}` endpoint with realistic payloads, each referencing the Phase 1 employee's `workforce_ref_id = wf-bf29e5b85bc4` so the signals correlate to a real workforce object rather than orphan records. Each signal was then read back (scoped list by `signal_type` + `correlation_id`) and its trace continuity reconstructed (`/v1/setu/trace/{trace_id}`). The niyantran signal was deliberately linked to the Phase 1 lifecycle correlation/trace id (`9fda459e-1916-42f8-81d1-f9a6f7d7f7ec`) to prove genuine cross-system trace continuity (it appears alongside the 14 workforce/governance audit events sharing that trace). Per Gap Resolution #4, these payloads **simulate the external systems' shapes from the Sampada side**; no external system actually initiated a call.

## Verified vs Simulated (per Gap Resolution #4)

| Capability | Status | Evidence |
|---|---|---|
| Sampada-side signal ingestion (all 4 types) | **Verified (runtime-proven)** | `POST /v1/setu/signals/{type}` → HTTP 200, real `signal_id` per type |
| Ownership metadata assignment (origin/owning system per type) | **Verified (runtime-proven)** | lineage.owning_system = niyantran / artha / crm / setu (captured) |
| Lineage envelope on every signal (7 fields incl. schema_version) | **Verified (runtime-proven)** | see Phase 6 doc; captured in `phase5_signals.json` |
| Correlation/trace continuity & replay reconstruction | **Verified (runtime-proven)** | `GET /v1/setu/trace/{trace_id}` returns signal+audit chain; niyantran links to lifecycle trace (1 signal + 14 audits) |
| Scoped signal list (tenant/correlation filter) | **Verified (runtime-proven)** | `GET /v1/setu/signals?signal_type=…&correlation_id=…` |
| **External system actually initiating participation** (Niyantran / Artha / CRM / Logistics as live callers) | **Not Yet Available — Blocked on external owner integration** | No external endpoints/credentials reachable; payloads are Sampada-side simulations of external shape. Mirrors reviewer finding "SETU Participation Still Mostly Internal." |

## Step-by-step Evidence Table

| Signal Type | Ingest → signal_id | trace_id | owning_system | List HTTP | Trace HTTP (signals/audits) | Ingest Timestamp (UTC) |
|---|---|---|---|---|---|---|
| niyantran_telemetry (linked) | `sig-a101a7ebdd58` | `9fda459e-1916-42f8-81d1-f9a6f7d7f7ec` | niyantran | 200 | 200 (**1 signal / 14 audits**) | 10:27:12.437392Z |
| artha_payroll_visibility | `sig-1abd2cd401c7` | `c71cb3c7-11cb-430a-a3e4-72b00c1c0cfc` | artha | 200 | 200 (1 signal / 1 audit) | 10:27:12.468988Z |
| crm_participation | `sig-870d5d57d618` | `b1e11c75-0943-4208-8ec1-99da4cf6fe39` | crm | 200 | 200 (1 signal / 1 audit) | 10:27:12.489679Z |
| setu_aggregation | `sig-859ddc573082` | `e709101b-06dc-49bb-a12b-07c3d39719e2` | setu | 200 | 200 (1 signal / 1 audit) | 10:27:12.512424Z |

Each signal carried: source_declaration (`<type> participation`), `workforce_ref_id=wf-bf29e5b85bc4`, tenant_id, created_at, and a full lineage envelope (origin_system, owning_system, schema_version=1.0.0, trace_id, correlation_id, trust_classification, visibility_scope).

## Replay Confirmation

- `GET /v1/setu/trace/9fda459e-1916-42f8-81d1-f9a6f7d7f7ec` returned the niyantran signal **plus the 14 workforce/governance audit events** sharing that trace id — proving cross-system continuity between a SETU signal and a real workforce lifecycle (not just signal storage).
- The other three signals each reconstructed their own (signal + ingest-audit) trace, confirming per-signal trace continuity.

## Known Limitations

- **External SETU participation remains unproven** — no Niyantran/Artha/CRM/Logistics system initiated a real inbound call from this environment; this is blocked on external owner integration and credentials (carried as a risk in `REVIEW_PACKET.md` and `CONTRIBUTION_LOG.md` blockers). The phrase "live ecosystem participation" is deliberately **not** claimed.
- Local in-process runtime capture (see Phase 1 header).

## Cross-references

- Lineage field-by-field proof: `LINEAGE_PROPAGATION_EVIDENCE.md`
- Linked workforce lifecycle: `LIVE_WORKFORCE_OPERATIONS_EVIDENCE.md`
- Raw: `evidence/live_workforce_governance_setu/setu_participation/phase5_signals.json`
