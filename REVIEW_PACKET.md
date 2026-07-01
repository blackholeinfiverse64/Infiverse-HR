# BHIV Sampada — Workforce Governance Review Packet

**Status**: Workforce governance runtime completed for gateway, control-center visibility, docs, and baseline tests; **Live WO/GE/SETU Sprint live runtime evidence captured (workforce / governance / policy / SETU / lineage / control-center)**  
**Maintained by**: Shashank (Sampada, Support Builder)  
**For Acceptance Review By**: Rishabh Yadav  
**Updated**: 2026-06-27

> Operational boundary remains unchanged: Sampada is a visibility and intelligence surface; execution authority stays with owning systems and approved owners.

---

## State Block

- Workforce governance backend modules are present and compile under gateway app.
- Route bundle is wired through `backend/services/gateway/app/main.py`.
- Control-center governance panel is visible only when `VITE_ENABLE_GOVERNANCE=true`.
- Runtime docs and evidence artifacts are present under `docs/` and `evidence/workforce_runtime/`; the seven Live WO/GE/SETU Sprint phase evidence docs live in the sprint folder `Live WO, GE & SETU Participation Sprint (Sampada Convergence and Expansion Builder)/`.
- **Live WO/GE/SETU Sprint (2026-06-27)**: end-to-end runtime usage captured across 8 phases (68 API calls, 67×200 + 1×404 negative path) in one continuous session with a single correlation id threading workforce → audit → SETU. Two additive runtime gap fixes applied (`transition_type`/`employee_promotion`; `schema_version` confirmed present). New evidence bundle: `evidence/live_workforce_governance_setu/`.

---

## Live WO/GE/SETU Sprint — Live WO / GE / SETU Participation Evidence (2026-06-27)

**Sprint**: Live WO, GE & SETU Participation Sprint (Sampada Convergence and Expansion Builder). **Status**: evidence captured (local in-process runtime); awaiting owner acceptance.

> Environment note: Live WO/GE/SETU Sprint captures are **local in-process** runtime (real `workforce_governance_routes` router over in-memory async Mongo) because no deployed-gateway credentials/Mongo were available in this environment. Real request/response/status/timestamp; not the deployed Render gateway. This is stated in every Live WO/GE/SETU Sprint evidence doc header.

- **Workforce Operations Evidence** → `Live WO, GE & SETU Participation Sprint (Sampada Convergence and Expansion Builder)/LIVE_WORKFORCE_OPERATIONS_EVIDENCE.md` — one employee (`wf-bf29e5b85bc4`) Created→Assigned→Transferred→Promoted→Moved→Offboarding-Initiated→Replay (13-event ordered reconstruction; `employee_promotion` action via Gap Fix #1).
- **Hierarchy Validation** → `Live WO, GE & SETU Participation Sprint (Sampada Convergence and Expansion Builder)/ORG_HIERARCHY_VALIDATION.md` — Org→Division→Unit→Department→Team→Employee; inheritance (`[org_member, analyst]`); admin sees 3 vs client/tenant 0 (boundary); unknown org → 404.
- **Governance Replay** → `Live WO, GE & SETU Participation Sprint (Sampada Convergence and Expansion Builder)/GOVERNANCE_REPLAY_EVIDENCE.md` — 3 scenarios (leave/visibility/approval) full chain `Policy→Eval→Challenge→Review→Override→Decision→Replay`; Leave has a 2-link supersedes replay chain.
- **Policy Replay** → `Live WO, GE & SETU Participation Sprint (Sampada Convergence and Expansion Builder)/POLICY_REPLAY_VALIDATION.md` — policy-state angle; overrides do not version the definition; re-evaluations confirm context-driven outcomes.
- **SETU Participation** → `Live WO, GE & SETU Participation Sprint (Sampada Convergence and Expansion Builder)/SETU_PARTICIPATION_EVIDENCE.md` — all 4 signal types ingested/listed/traced; niyantran linked to lifecycle trace (1 signal + 14 audits). **Verified vs Simulated**: Sampada-side ingestion/lineage/trace/replay = **Verified (runtime-proven)**; external-system-initiated participation = **Not Yet Available — Blocked on external owner integration**.
- **Ownership Metadata & Lineage Validation** → `Live WO, GE & SETU Participation Sprint (Sampada Convergence and Expansion Builder)/LINEAGE_PROPAGATION_EVIDENCE.md` — 7/7 fields (incl. `schema_version=1.0.0`) present in workforce, governance, and SETU samples; one correlation id propagated across workforce + audit + SETU.
- **Control Center Evidence** → `Live WO, GE & SETU Participation Sprint (Sampada Convergence and Expansion Builder)/CONTROL_CENTER_EVIDENCE.md` — `audit-events` (38 total / 14 for lifecycle cid) and `audit-replay` (14 ordered) via real read endpoints; Observation→Execution boundary mapping; frontend UI screenshot is a stated limitation.
- **Testing Results** → `evidence/live_workforce_governance_setu/test_results/pytest_final.txt`: **29 passed, 6 warnings**; `compileall` success. After-gap-fix run: 24 passed (no regression).
- **Replay Results (Live WO/GE/SETU Sprint consolidated)**:
  - Workforce trace-replay by correlation id → 13 ordered events (`GET /v1/workforce/trace-replay`).
  - Decision replay → Leave 2-link supersedes chain; Visibility & Approval 1-link (`GET /v1/decisions/replay`).
  - SETU trace continuity → 4 signals reconstructed; niyantran cross-system (1 signal + 14 audits) (`GET /v1/setu/trace/{trace_id}`).
  - Control Center audit-replay → 14 ordered events for the lifecycle correlation id.
- **Evidence bundle** → `evidence/live_workforce_governance_setu/` (`SUMMARY.md`, `capture_index.json`, `full_capture.json`, per-phase JSON, `addendum/`, `test_results/`, `harness/`).

### Reviewer-findings reconciliation (against the actual `Review Feedback (… Sampada – Convergence And Expansion Builder).md`)

The five findings of the real reviewer document were read in full and mapped to Live WO/GE/SETU Sprint evidence:

| # | Reviewer finding | Live WO/GE/SETU Sprint status |
|---|---|---|
| 1 | Runtime Existence ≠ Runtime Convergence (prove sustained/real/scale usage, not just compile+unit+endpoints) | **Partially addressed** — real end-to-end runtime usage + cross-system trace captured; **sustained production usage / operational scale** remain unproven (local in-process capture, not deployed). |
| 2 | SETU still mostly internal (Niyantran/Artha/CRM/**Logistics**); live ecosystem participation not proven | **Honestly unchanged** — Sampada-side ingestion/lineage/replay = Verified; external-initiated participation = Not Yet Available (all four incl. Logistics named). "Live ecosystem participation" deliberately not claimed. |
| 3 | Workforce needs real org proof (multi-org, multi-dept, inheritance, transfer, permission propagation, realistic datasets) | **Addressed** — `Live WO, GE & SETU Participation Sprint (Sampada Convergence and Expansion Builder)/ORG_HIERARCHY_VALIDATION.md` incl. supplemental **multi-org** capture (2 orgs, disjoint listings, per-org inheritance) + transfers + inheritance in Phase 1/2. |
| 4 | Policy engine operational validation (conflicts, override chains, challenge lifecycle, escalation, replay) | **Mostly addressed** — challenge lifecycle/escalation/override chains/replay proven; **policy conflicts = not a present runtime capability**, flagged not fabricated. |
| 5 | Decision ledger replay demonstration (Decision→Challenge→Review→Override→Final) | **Addressed** — consolidated correlation-linked replay packet in `Live WO, GE & SETU Participation Sprint (Sampada Convergence and Expansion Builder)/GOVERNANCE_REPLAY_EVIDENCE.md` (workforce trace-replay + control-center audit-replay), plus a 2-link supersedes chain. |

---

## Federated Workforce Runtime

- Runtime module: `backend/services/gateway/app/workforce_runtime.py`.
- Routes: organization, division, unit, department, employee CRUD/list/read and hierarchy/trace replay in `backend/services/gateway/routes/workforce_governance_routes.py`.
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
- Write routes pass correlation IDs from request state into runtime actions.
- Reference doc: `docs/OWNERSHIP_AND_LINEAGE_MODEL.md`.

---

## Testing Results

- Compile verification: `python -m compileall backend/services/gateway/app backend/services/gateway/routes/workforce_governance_routes.py`.
- Unit tests: `python -m pytest -q backend/tests/gateway/test_workforce_governance_runtime.py backend/tests/gateway/test_workforce_lifecycle.py`.
- Prior baseline result: **12 passed** (Task20), 3 warnings, 0 failures.
- **Live WO/GE/SETU Sprint latest result (2026-06-27)**: the four gateway suites + new `test_live_workforce_governance_setu_gapfix.py` → **29 passed, 6 warnings, 0 failures** (`evidence/live_workforce_governance_setu/test_results/pytest_final.txt`). After-gap-fix regression check on the four baseline suites alone → 24 passed.

---

## Replay Evidence

- Workforce API/replay baseline: `evidence/workforce_runtime/api_proof_workforce.json`.
- SETU ingest baseline: `evidence/workforce_runtime/setu_signal_proof.json`.
- Evidence summaries:
  - `evidence/workforce_runtime/replay_trace_proof.md`
  - `evidence/workforce_runtime/test_output_summary.md`
  - `evidence/workforce_runtime/api_trace_matrix.md`

---

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Routes depend on runtime Mongo collections existing | Medium | Seed/initialize required collections during deployment checks |
| Governance tab visibility for all tenants | Medium | Owner approved (GOV-PANEL-001); remains behind `VITE_ENABLE_GOVERNANCE` env flag for rollback |
| Warning-only pytest marks (`e2e_unit`) may hide marker taxonomy drift | Low | Register custom marks in pytest config in a follow-up cleanup |
| Replay evidence currently template-driven in docs, not full prod trace capture | Medium (partially mitigated) | Live WO/GE/SETU Sprint captured real ordered replay chains (workforce/decision/SETU/control-center) — but as **local in-process** runtime, not deployed prod. Re-run against deployed gateway + persistent Mongo for production-signed samples. |
| Governance panel enablement | Low | GOV-PANEL-001 approved — see docs/GOVERNANCE_PANEL_APPROVAL_RECORD.md; enabled in production |
| **SETU external participation remains unproven** | High | Niyantran/Artha/CRM/Logistics did not initiate any real inbound call; only Sampada-side ingestion/lineage/replay proven (Live WO/GE/SETU Sprint Phase 5 "Not Yet Available"). Blocked on external owner integration + credentials — Rishabh to authorize outreach. |
| **Live WO/GE/SETU Sprint evidence is local in-process, not deployed-gateway** | Medium | No deployed-gateway credentials/Mongo available this session; re-run `evidence/live_workforce_governance_setu/harness/run_capture.py` flow against deployed Render gateway for production-grade capture. |
| `transition_type` field is additive but only positively tested | Low | New `test_live_workforce_governance_setu_gapfix.py` covers promotion vs lateral audit action; negative-path/validation tests (e.g. invalid transition_type) not yet added. |
| Policy-conflict resolution not a runtime capability (Review Feedback #4) | Medium | `_evaluate_rules` is single-policy; no conflict engine exists. Not built this sprint (two-additive-fixes-only). Needs owner decision on whether multi-policy conflict resolution is in scope for a future sprint. |
| Sustained production usage & operational scale unproven (Review Feedback #1) | Medium | Live WO/GE/SETU Sprint proves linked end-to-end runtime usage but is a single local in-process session, not sustained/scaled deployed traffic. Re-run against deployed gateway with volume for scale evidence. |

---

*This review packet is maintained by the Sampada Support Builder role. Architectural decisions and final acceptance remain with Rishabh Yadav.*
