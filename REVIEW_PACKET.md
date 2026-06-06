# BHIV Sampada — Task20 Review Packet

**Status**: Task20 implementation completed end-to-end for gateway runtime, control-center visibility, docs, and baseline tests  
**Maintained by**: Shashank (Sampada, Support Builder)  
**For Acceptance Review By**: Rishabh Yadav  
**Updated**: 2026-06-05

> Operational boundary remains unchanged: Sampada is a visibility and intelligence surface; execution authority stays with owning systems and approved owners.

---

## State Block

- Task20 backend modules are present and compile under gateway app.
- Task20 route bundle is wired through `backend/services/gateway/app/main.py`.
- Task20 control-center section is visible only when `VITE_ENABLE_TASK20_GOVERNANCE=true`.
- Phase docs and evidence artifacts are present under `docs/` and `evidence/task20/`.

---

## Federated Workforce Runtime

- Runtime module: `backend/services/gateway/app/workforce_runtime.py`.
- Routes: organization, division, unit, department, employee CRUD/list/read and hierarchy/trace replay in `backend/services/gateway/routes/task20_routes.py`.
- Scope controls: workforce access and scope filtering via `backend/services/gateway/app/workforce_common.py`.
- Reference doc: `docs/FEDERATED_WORKFORCE_RUNTIME.md`.

---

## Lifecycle APIs

- Runtime module: `backend/services/gateway/app/workforce_lifecycle.py`.
- Endpoints include onboarding start/complete, role movement, department transfer, status change, and offboard preparation.
- Allowed transitions are enforced with explicit lifecycle-state mapping.
- Reference doc: `docs/WORKFORCE_LIFECYCLE_API.md`.

---

## Policy Engine

- Runtime module: `backend/services/gateway/app/policy_engine.py`.
- Endpoints include policy seed/list/create/evaluate/override.
- Policy evaluation and override events are auditable through gateway audit storage.
- Reference doc: `docs/POLICY_ENGINE_RUNTIME.md`.

---

## Challenge Workflow

- Runtime module: `backend/services/gateway/app/decision_workflow.py`.
- Endpoints include challenge creation/listing, review assignment/completion, and override proposal/apply flow.
- Review-to-decision bridge is exposed through governance review decision recording.
- Reference doc: `docs/DECISION_AND_CHALLENGE_FLOW.md`.

---

## Decision Ledger

- Runtime module: `backend/services/gateway/app/decision_ledger.py`.
- Endpoints include decision create/list/read/replay.
- Replay supports chain reconstruction and correlation-based timeline review.
- Reference doc: `docs/DECISION_LEDGER_MODEL.md`.

---

## SETU Participation

- Runtime module: `backend/services/gateway/app/setu_participation.py`.
- Endpoints include signal ingest, scoped signal list, and trace continuity reads.
- Cross-system participation uses lineage + ownership metadata for replay integrity.
- Reference doc: `docs/SETU_PARTICIPATION_RUNTIME.md`.

---

## Ownership Metadata

- Metadata envelope module: `backend/services/gateway/app/lineage_envelope.py`.
- Shared lineage fields include origin, owning system, schema version, trace ID, correlation ID, trust classification, and visibility scope.
- Task20 writes pass correlation IDs from request state into runtime actions.
- Reference doc: `docs/OWNERSHIP_AND_LINEAGE_MODEL.md`.

---

## Testing Results

- Compile verification: `python -m compileall backend/services/gateway/app backend/services/gateway/routes/task20_routes.py`.
- Unit tests: `python -m pytest -q backend/tests/gateway/test_task20_runtime.py backend/tests/gateway/test_task20_workforce_lifecycle.py`.
- Latest result: **12 passed**, 3 warnings (custom mark + dependency warning), 0 failures.

---

## Replay Evidence

- Workforce API/replay baseline: `evidence/task20/api_proof_workforce.json`.
- SETU ingest baseline: `evidence/task20/setu_signal_proof.json`.
- Added evidence summaries:
  - `evidence/task20/replay_trace_proof.md`
  - `evidence/task20/test_output_summary.md`
  - `evidence/task20/api_trace_matrix.md`

---

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Task20 routes depend on runtime Mongo collections existing | Medium | Seed/initialize required collections during deployment checks |
| Governance tab default visibility not approved for all tenants | Medium | Keep behind `VITE_ENABLE_TASK20_GOVERNANCE` until owner approval |
| Warning-only pytest marks (`e2e_unit`) may hide marker taxonomy drift | Low | Register custom marks in pytest config in a follow-up cleanup |
| Replay evidence currently template-driven in docs, not full prod trace capture | Medium | Capture and store signed production replay samples after owner-led run |

---

*This review packet is maintained by the Sampada Support Builder role. Architectural decisions and final acceptance remain with Rishabh Yadav.*
