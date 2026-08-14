# 13 — Governance, Control Center & Workforce OS

**Status:** ✅ Verified at API level (2026-08-14); conceptual models summarized from source docs
**Owner:** Shashank Mishra

> The government-scale governance layer, workforce OS, and executive control center. This
> summarizes the architecture and maps every concept to its verified API surface and its archived
> source documents. Read after `12_OPERATIONS_RUNBOOK.md`.

---

## 1. Purpose

Sampada is an **intelligence and visibility layer** — not a universal admin console, not a hidden
decision engine, not a monolithic workforce authority. Execution authority remains with the owning
system and owning humans. All governance/control-center surfaces are read-only observability
("observability not execution authority").

---

## 2. Government-Scale Workforce OS

### Org hierarchy (verified — `app/workforce_runtime.py`, API §12 of `06_API_REFERENCE.md`)

```text
Ministry
  └─ Department
       └─ Division
            └─ Unit
                 └─ Office / Contractor / Vendor (scoped participation)
```

Modeled as `organizations → divisions → units → departments → employees`, each wrapped in a
`LineageEnvelope` (tenant scoping + audit hooks). Employee lifecycle (verified API):
`onboard → onboard-complete → role-move → department-transfer → status → offboard-prepare`.

### Verified API mapping

| Concept | Endpoints |
|---------|-----------|
| Org / hierarchy | `/v1/workforce/organizations`, `/{org_id}`, `/{org_id}/hierarchy` |
| Divisions / units / departments | `/v1/workforce/divisions`, `/units`, `/departments` |
| Employees + lifecycle | `/v1/workforce/employees` + `/lifecycle/*` |
| Trace / replay | `/v1/workforce/trace-replay` |

---

## 3. Policy Governance Model

- Policy definitions, evaluation, overrides, and registry (collections: `policy_definitions`,
  `policy_evaluations`, `policy_overrides`, `policy_registry`).
- Verified API: `/v1/policies/seed`, `/v1/policies/definitions` (GET/POST),
  `/v1/policies/evaluate`, `/v1/policies/overrides`.
- Implementation: `app/policy_engine.py`, `app/control_center_governance.py` (policy-scope
  resolution).

---

## 4. Decision Ledger & Challenge Flow

- Governance actions are challengeable; decisions are recorded in a ledger
  (collection `decisions`).
- Verified API: `/v1/governance/challenges` (GET/POST), `/v1/governance/reviews` +
  `/complete` + `/decision`, `/v1/governance/overrides` + `/{id}/apply`,
  `/v1/decisions` (POST/GET/replay/{id}).
- Implementation: `app/decision_ledger.py`, `app/decision_workflow.py`.

---

## 5. Human Safety & Growth Models

- Human Safety: boundaries on automation, human-in-the-loop for consequential actions
  (`SAMPADA_HUMAN_SAFETY_MODEL.md`, `SAMPADA_HUMAN_GROWTH_MODEL.md`).
- Growth: learning progress visibility, skills evolution, mentorship tracking, strengths mapping.
- These are model documents (archived in `archived/docs/`); their functional APIs live within the
  workforce/governance endpoints above.

---

## 6. Command Center Governance / Federated Administration

- Federated admin across local, department, platform, and auditor roles.
- Command-center governance model separates visibility from execution authority.
- Sources: `SAMPADA_COMMAND_CENTER_GOVERNANCE_MODEL.md`,
  `SAMPADA_FEDERATED_WORKFORCE_MODEL.md`.

---

## 7. Executive Control Center

- Frontend route: `/control` (roles `client|recruiter|admin`) → `ControlCenter.tsx` with
  executive / hiring / workforce / growth / org / governance / replay zones.
- Verified API:
  - `/v1/control-center/audit-events` (POST/GET)
  - `/v1/control-center/audit-replay`
  - `/v1/control-center/dashboard-aggregates`
- Dashboard cards in `src/components/cards/` are explicitly read-only observability components.

---

## 8. SETU Participation

- Additive outbound dispatchers from partner systems (Niyantran, Artha, CRM, Logistics) target
  `POST /v1/setu/signals/{signal_type}` on the gateway.
- Verified API: `/v1/setu/signals` (GET), `/v1/setu/signals/{signal_type}` (POST),
  `/v1/setu/trace/{trace_id}` (GET).
- Implementation: `app/setu_participation.py`; collection `setu_signals`.
- Live evidence: `evidence/live_workforce_governance_setu/partner_live/20260702T073708Z/`
  (Tier-2 dispatcher captures). External participation remains unproven pending partner
  integration (see `15_KNOWN_ISSUES_ARCHIVE_INDEX.md`).

---

## 9. Governance Panel Approval & Task19

- Control-center production verification (33/33 API evaluation 2026-06-06) and governance panel
  approval (GOV-PANEL-001) are recorded in `docs/GOVERNANCE_PANEL_APPROVAL_RECORD.md` (archived).
- Task19 requirement/evidence mapping and acceptance packs are archived under
  `archived/docs/` (`TASK19_REQUIREMENT_EVIDENCE_MATRIX.md`, `TASK19_ACCEPTANCE_TEST_PACK.md`,
  `CONTROL_CENTER_E2E_TEST_FRAMEWORK.md`, `CENTRAL_CONTROL_API_CONTRACT_FREEZE.md`,
  `CENTRAL_CONTROL_LIVE_EXECUTION_CHECKLIST.md`).

---

## 10. Verified API Surface Summary (this layer)

| Group | Routes |
|-------|--------|
| Workforce | `/v1/workforce/*` (orgs, divisions, units, departments, employees, trace-replay) |
| Policies | `/v1/policies/*` |
| Governance | `/v1/governance/*` (challenges, reviews, overrides) |
| Decisions | `/v1/decisions/*` |
| SETU | `/v1/setu/*` |
| Control center | `/v1/control-center/*` |

Full route tables with methods in `06_API_REFERENCE.md` §12–§13.

---

## 11. Archived Source Documents

Full-depth models (copies preserved, originals gitignored):
`Updated Docs/archived/docs/SAMPADA_GOVERNMENT_SCALE_ARCHITECTURE.md`,
`SAMPADA_POLICY_GOVERNANCE_MODEL.md`, `SAMPADA_FEDERATED_WORKFORCE_MODEL.md`,
`SAMPADA_COMMAND_CENTER_GOVERNANCE_MODEL.md`, `SAMPADA_HUMAN_SAFETY_MODEL.md`,
`SAMPADA_HUMAN_GROWTH_MODEL.md`, `SAMPADA_WORKFORCE_OS_ARCHITECTURE.md`,
`POLICY_ENGINE_RUNTIME.md`, `DECISION_LEDGER_MODEL.md`, `DECISION_AND_CHALLENGE_FLOW.md`,
`FEDERATED_WORKFORCE_RUNTIME.md`, `SETU_PARTICIPATION_RUNTIME.md`,
`OWNERSHIP_AND_LINEAGE_MODEL.md`, `SAMPADA_CONTROL_CENTER_BLUEPRINT.md`.

---

## 12. Next

→ `14_SCOPE_SPRINTS_VANA.md`.
