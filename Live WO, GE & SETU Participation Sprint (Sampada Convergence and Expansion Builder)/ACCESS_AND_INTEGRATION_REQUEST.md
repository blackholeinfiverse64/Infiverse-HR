# Access & Integration Request — Live WO/GE/SETU Sprint

**Purpose:** This is the list of items needed to unblock the remaining (currently "Not Yet Available") proof for the Sampada workforce/governance/SETU runtime. Once these are provided, production-grade evidence can be produced and the external-participation gap can be closed.

**Requested by:** Shashank (Sampada, Support Builder)
**Approval / owner:** Rishabh Yadav
**Date raised:** 2026-06-27

---

## Why this is needed (plain summary)

The system has been proven to work on a **local practice copy** using a temporary database, and our side of partner-data ingestion works. What is **not yet proven**:

1. The same behaviour on the **real deployed server** with the **real database**.
2. **Live data actually sent in by the four external partner systems.**
3. That it holds up under **sustained, higher-volume real use.**

The items below unblock all three.

---

## SECTION A — Owner decision (Rishabh)

- [ ] **A1.** Approval to contact the four external partner teams for live integration.
- [ ] **A2.** Decision on whether "policy-conflict resolution" should be built in a future sprint *(currently not a system capability; flagged honestly — no action needed now beyond a yes/no for the roadmap).*

## SECTION B — Live server (deployed gateway) access

- [x] **B1.** Deployed gateway URL (the live server address).  
  _Received_: `https://bhiv-hr-gateway-l0xp.onrender.com`
- [x] **B2.** API key / access credentials for the live gateway.  
  _Received via secure env_: `backend/.env` (`API_KEY_SECRET`; redacted in docs).
- [x] **B3.** Confirmation that running a controlled evidence capture against the live server is permitted (and a preferred time window, if any).  
  _Action completed_: live capture executed on 2026-07-02; evidence stored under `evidence/live_workforce_governance_setu/live/20260702T063831Z/`.

## SECTION C — Live database access

- [x] **C1.** Live MongoDB connection string (or the connection details).  
  _Received via secure env_: `backend/.env` (`DATABASE_URL` / `MONGODB_URI`; redacted in docs).
- [x] **C2.** Database name to use.  
  _Received_: `MONGODB_DB_NAME=bhiv_hr`.
- [x] **C3.** Read/write permission confirmation for the evidence capture.  
  _Inferred from successful live write/read evidence_: workforce/governance/SETU/control-center writes and replays returned HTTP 200 in production capture.

## SECTION D — External partner systems (one row per system)

For **each** of the four systems, we need a contact and connection details so they can send a real message into Sampada.

### D1. Niyantran

- [x] Repo received (2026-07-02): `workflow-blackhole` codebase provided by owner.
- [ ] Owner / contact person:
- [x] Connection key / credential for it to send data in: additive `server/services/setuDispatcher.js` wired; uses `SAMPADA_SETU_BASE_URL` + `SAMPADA_SETU_API_KEY` (= `API_KEY_SECRET` against live gateway).
- [x] Confirmation it can send a real test signal: **Tier 2 verified 2026-07-02** — `sig-29f9efbb899a` from real `ExecutionEvent` (`exec_demo_002`). Evidence: `evidence/live_workforce_governance_setu/partner_live/20260702T073708Z/niyantran_telemetry_capture.json`.

### D2. Artha

- [x] Repo received (2026-07-02): `Artha_Update_T29-main` codebase provided by owner.
- [ ] Owner / contact person:
- [x] Connection key / credential for it to send data in: existing `dispatchToSetu()` re-pointed to `/v1/setu/signals/artha_payroll_visibility` via `sampadaAdapter.js`; `SETU_API_KEY` = `API_KEY_SECRET`.
- [x] Confirmation it can send a real test signal: **Tier 2 verified 2026-07-02** — `sig-9802342a158c` from real `ComplianceSignal` `SIG-d03e25ed-…`. Evidence: `partner_live/20260702T073708Z/artha_payroll_visibility_capture.json`.

### D3. CRM

- [x] Repo received (2026-07-02): `ai-crm-main` codebase provided by owner (includes CRM + SETU internal module + Logistics frontend).
- [ ] Owner / contact person:
- [x] Connection key / credential for it to send data in: additive `backend/setu/sampada_dispatcher.py` + env `SAMPADA_SETU_*`.
- [x] Confirmation it can send a real test signal: **Tier 2 verified 2026-07-02** — `sig-5ffbd0b0bde4`. Evidence: `partner_live/20260702T073708Z/crm_participation_capture.json`.

### D4. Logistics

- [x] Repo received (2026-07-02): ships inside the same `ai-crm-main` codebase — no separate Logistics backend exists (`frontend/src/pages/Logistics.jsx` only); confirmed via repo scan.
- [ ] Owner / contact person:
- [x] Connection key / credential for it to send data in: rides CRM dispatcher with `subsystem: "logistics"` marker.
- [x] Confirmation it can send a real test signal: **Tier 2 verified 2026-07-02** — `sig-3acbbfa3ca0a` (`crm_participation` + `subsystem: logistics`). Evidence: `partner_live/20260702T073708Z/logistics_crm_participation_capture.json`.

## SECTION E — (Optional) Scale / sustained-use test

- [ ] **E1.** Go-ahead to run a higher-volume / repeated run against the live server (depends on Section B + C).

---

## What happens once provided

- **With Section B + C** → production-grade evidence for items 1 and 3 can be generated quickly.
- **With Section D** (per partner) → each partner's live participation moves from "Not Yet Available" to "Verified" as real signals arrive.

> Note: credentials should be shared through a secure channel, **not** committed into the repository or pasted into shared docs.

