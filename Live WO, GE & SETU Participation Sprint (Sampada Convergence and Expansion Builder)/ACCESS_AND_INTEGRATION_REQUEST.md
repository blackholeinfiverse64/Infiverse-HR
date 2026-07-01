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

- [ ] **B1.** Deployed gateway URL (the live server address).
- [ ] **B2.** API key / access credentials for the live gateway.
- [ ] **B3.** Confirmation that running a controlled evidence capture against the live server is permitted (and a preferred time window, if any).

## SECTION C — Live database access

- [ ] **C1.** Live MongoDB connection string (or the connection details).
- [ ] **C2.** Database name to use.
- [ ] **C3.** Read/write permission confirmation for the evidence capture.

## SECTION D — External partner systems (one row per system)

For **each** of the four systems, we need a contact and connection details so they can send a real message into Sampada.

### D1. Niyantran

- [ ] Owner / contact person:
- [ ] Connection key / credential for it to send data in:
- [ ] Confirmation it can send a real test signal:

### D2. Artha

- [ ] Owner / contact person:
- [ ] Connection key / credential for it to send data in:
- [ ] Confirmation it can send a real test signal:

### D3. CRM

- [ ] Owner / contact person:
- [ ] Connection key / credential for it to send data in:
- [ ] Confirmation it can send a real test signal:

### D4. Logistics

- [ ] Owner / contact person:
- [ ] Connection key / credential for it to send data in:
- [ ] Confirmation it can send a real test signal:

## SECTION E — (Optional) Scale / sustained-use test

- [ ] **E1.** Go-ahead to run a higher-volume / repeated run against the live server (depends on Section B + C).

---

## What happens once provided

- **With Section B + C** → production-grade evidence for items 1 and 3 can be generated quickly.
- **With Section D** (per partner) → each partner's live participation moves from "Not Yet Available" to "Verified" as real signals arrive.

> Note: credentials should be shared through a secure channel, **not** committed into the repository or pasted into shared docs.

