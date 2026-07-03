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

---

## Live deployment (2026-07-02)

**Gateway base URL**: `https://bhiv-hr-gateway-l0xp.onrender.com`  
**Environment**: deployed Render gateway with production Mongo (`bhiv_hr`) via `backend/.env` (credentials kept out of docs)  
**Auth type used**: `Authorization: Bearer <API_KEY_SECRET>`  
**Raw capture**:
- `evidence/live_workforce_governance_setu/live/20260702T063831Z/capture_index_live.json`
- `evidence/live_workforce_governance_setu/live/20260702T063831Z/full_capture_live.json`

### Live Sampada SETU ingestion — verified

| Signal Type | Ingest → signal_id | trace_id | List HTTP | Trace HTTP |
|---|---|---|---|---|
| niyantran_telemetry (linked) | `sig-a810511a2509` | `3d0a7d1a-1be8-4267-af5b-8d239ea25049` | 200 | 200 |
| artha_payroll_visibility | `sig-ea9866e71888` | `95bbcea8-b565-4214-8bf8-a5041d769449` | 200 | 200 |
| crm_participation | `sig-e138e93526f1` | `626f10d3-5764-493a-ba39-2f46c472fe8d` | 200 | 200 |
| setu_aggregation | `sig-78548e3c1c17` | `e3cce9b5-dcee-4f08-a6cf-b5c52f25e0a4` | 200 | 200 |

Live run summary: **41 calls, all HTTP 200**, no blockers, lifecycle replay event_count=13, decision id `dec-7a2fbd790e70`.

### External partner live participation status (honest)

| Partner system | Repo location | Candidate outbound path toward Sampada | Live status |
|---|---|---|---|
| Niyantran (workflow-blackhole) | `workflow-blackhole` | `POST /api/tantra/execution/participate` (Tantra execution contract; auth via `x-execution-key`/`x-auth-token`) | **Not Yet Available** — no code path found targeting Sampada `POST /v1/setu/signals/{signal_type}` and no running integration URL/credential was available in this session. |
| Artha | `Artha` | `POST /api/v1/signals/:signalId/dispatch` dispatches to external SETU base (`SETU_BASE_URL`, Bearer `SETU_API_KEY`) | **Not Yet Available** — runtime docs show example/placeholder SETU URL and no verified live Artha service URL + active dispatch credentials were provided. |
| CRM + SETU + Logistics (ai-crm) | `ai-crm` | no Sampada SETU emitter found; main backend exposes `/api/*` CRM/logistics routes | **Not Yet Available** — repo exposes CRM/logistics APIs but no discovered outbound integration to Sampada gateway SETU endpoint and no partner runtime credentials were supplied. |

**Conclusion:** Sampada live ingestion is verified in production; external-system-initiated live participation remains blocked pending partner runtime URLs + credentials and explicit partner-trigger execution windows.

---

## Partner-Initiated Live Participation (2026-07-02 closeout)

**Date**: 2026-07-02  
**Gateway**: `https://bhiv-hr-gateway-l0xp.onrender.com`  
**Auth resolved**: `API_KEY_SECRET` (Bearer) → HTTP 200 on `GET /v1/setu/signals?limit=1`; `GATEWAY_SECRET_KEY` → HTTP 401  
**Shared correlation_id**: `3d0a7d1a-1be8-4267-af5b-8d239ea25049` (threads partner signals with prior live lifecycle capture)  
**Raw capture**: `evidence/live_workforce_governance_setu/partner_live/20260702T073708Z/` (`capture_index_partner_live.json`, per-partner JSON, `auth_probe.json`, `SUMMARY.md`)

### Auth resolution (§1.2)

| Candidate key | `GET /v1/setu/signals?limit=1` | Partner-facing? |
|---|---|---|
| `API_KEY_SECRET` | **200** | **Yes** — used for all partner dispatchers |
| `GATEWAY_SECRET_KEY` | **401** | No — treat as internal/service-to-service unless re-tested after rotation |

### Repo-topology checkpoint

No uploaded ZIP copies (`ai-crm-main.zip`, etc.) present in workspace. Embedded copies at `Artha/`, `ai-crm/`, `workflow-blackhole/` used. SETU-relevant source files match Implementation.md §0.2 inventory (no divergence surfaced).

### Per-partner live participation (honest tiers)

| Partner | Tier | Sampada signal_id | trace_id | Evidence file |
|---|---|---|---|---|
| **Artha** | **Tier 2** — `sampadaAdapter` + pipeline; dispatcher invoked directly from `Artha/backend/scripts/sampada_partner_capture.mjs` using real `ComplianceSignal` from Artha Mongo (`SIG-d03e25ed-…`); Artha API server not started | `sig-9802342a158c` | `TRC-20260702-19f21bf0` | `partner_live/20260702T073708Z/artha_payroll_visibility_capture.json` |
| **CRM** | **Tier 2** — `sampada_dispatcher.dispatch_to_sampada()` invoked directly; CRM FastAPI server not started | `sig-5ffbd0b0bde4` | `crm-trace-3d0a7d1a` | `partner_live/20260702T073708Z/crm_participation_capture.json` |
| **Logistics** | **Tier 2** — same CRM dispatcher with `payload.subsystem: "logistics"` (no separate Logistics backend) | `sig-3acbbfa3ca0a` | `logistics-trace-3d0a7d1a` | `partner_live/20260702T073708Z/logistics_crm_participation_capture.json` |
| **Niyantran** | **Tier 2** — `setuDispatcher` invoked with real `ExecutionEvent` from Niyantran Mongo (`exec_demo_002`, event `39ec574c…`); Niyantran server not started | `sig-29f9efbb899a` | `trace_demo_002` | `partner_live/20260702T073708Z/niyantran_telemetry_capture.json` |

All four partner dispatches: real HTTP POST to live gateway → HTTP 200 → real `sig-…` id confirmed via `GET /v1/setu/signals?signal_type=…&correlation_id=3d0a7d1a-…`.

### Verified vs Simulated (closeout update)

| Capability | Status |
|---|---|
| Partner-initiated outbound HTTP to Sampada live SETU endpoint (all four systems) | **Verified (Tier 2 — dispatcher invoked directly; partner server not booted)** |
| Full Tier 1 end-to-end (partner business action → server route → dispatcher) | **Not Yet Available** — partner API servers not started in this session (JWT-gated Artha dispatch route; CRM/Niyantran full boot not exercised) |
| Sampada contract unchanged | **Verified** — no diff on `setu_participation.py` or route paths |

### Known limitations (closeout)

- Tier 2 only: partner-side trigger was direct dispatcher invocation (or harness script), not a full partner-server business flow.
- Logistics has no backend event source — signal rides `crm_participation` with `subsystem: "logistics"` marker (owner decision pending).
- Recommend rotating `API_KEY_SECRET` / `GATEWAY_SECRET_KEY` after this capture (plaintext exposure noted in Implementation.md §0.3).
