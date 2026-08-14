# 14 — Scope, Sprints & Reusability (SETU / VANA)

**Status:** ✅ Summarized from verified source docs (2026-08-14)
**Owner:** Shashank Mishra

> The SETU ecosystem, the Sampada+SETU convergence sprints, the VANA reusability audits, and the
> partner runbooks. Read after `13_GOVERNANCE_CONTROL_CENTER.md`.

---

## 1. The SETU Ecosystem

SETU is the unified operational ecosystem that aggregates cross-domain intelligence. Sampada
participates **additively** — it posts signals to `POST /v1/setu/signals/{signal_type}` and never
takes ownership of partner execution.

| System | Owner | Role in SETU |
|--------|-------|--------------|
| Sampada (this platform) | Rishabh Yadav | Hiring + workforce intelligence, HR visibility |
| Niyantran | Rishabh Yadav | Tasking, reviews, testing, execution telemetry, payroll participation |
| Artha | Rishabh Yadav | Financial systems, payroll truth |
| Logistics | Rishabh Yadav | Logistics systems |
| CRM | Rishabh Yadav | Relationship intelligence |
| SETU | Rishabh Yadav | Aggregation, cross-domain intelligence, unified operational visibility |

Canonical repo map: `ECOSYSTEM_REPOSITORY_MAP.md` (archived → `Updated Docs/archived/root/`).

---

## 2. SETU Live Runbook (`PARTNER_SETU_LIVE_RUNBOOK.md` — archived)

- 9-section closeout runbook: per-partner behaviour, per-system deployment checklist, individual +
  integrated test procedures.
- Partner dispatch flow: Niyantran / Artha / CRM / Logistics → `POST /v1/setu/signals/{signal_type}`
  on the live gateway.
- Evidence: `evidence/live_workforce_governance_setu/partner_live/20260702T073708Z/` (Tier-2
  dispatcher invoked directly; partner servers not booted).

---

## 3. Sampada + SETU Convergence (Product Owner / Sprint Docs)

Sprint folder: `Sampada + SETU Product Owner (Convergence And Production Transition Lead)/` and the
master sprint file
`Live WO, GE & SETU Participation Sprint (Sampada Convergence and Expansion Builder).md` (374 lines).

| Element | Detail |
|---------|--------|
| Sprint title | Live WO / GE / SETU Participation (Sampada Convergence and Expansion Builder) |
| Workflow | 12-step table with harness entry points, Tier definitions |
| Deliverables | 16-item registry |
| Verification | Workforce/governance/SETU runtime exercised end-to-end (2026-06-27): one employee threaded through Created→Assigned→Transferred→Promoted→Moved→Offboarding→Replay under a single correlation id |

All sprint docs are gitignored at the repo root (see `.gitignore`) — treat them as working
artifacts, not canonical docs.

---

## 4. Live WO / GE / SETU Evidence Summary

- Live runtime evidence captured 2026-06-27 (`evidence/live_workforce_governance_setu/SUMMARY.md`).
- Partner-initiated live SETU dispatch (Tier 2) captured 2026-07-02.
- External (partner-side) SETU participation remains **unproven** — blocked on external owner
  integration. Treat as open blocker (also in `15_KNOWN_ISSUES_ARCHIVE_INDEX.md`).

---

## 5. VANA Reusability Audits

### Sampada (`VANA_REUSABILITY_SAMPADA.md` — archived)

- AST metrics: **391 modules / 276 classes / 2239 functions / 125 test files**.
- 9-point reusability matrix; per-folder AST table; evidence: 32 passed tests.
- Purpose: assess which parts of Sampada can be reused by other BHIV platforms.

### Samachar (`VANA_REUSABILITY_SAMACHAR.md` — archived)

- Audit of `bhiv-intelligence-samachar`: unified-news-workflow, authenticity check, LLM fallback
  router, TTS engine — **zero blockers**.

Both repos (`bhiv-SVACS/`, `bhiv-intelligence-samachar/`) are gitignored working copies.

---

## 6. Partner Repositories (gitignored — reference only)

`ai-crm/`, `Artha/`, `Prana/`, `Karma-Tracker/`, `bhiv-registry/`, `bhiv-SVACS/`,
`bhiv-intelligence-samachar/`, `bucket/`, `workflow-blackhole/`. These are vendored for
integration reference and are **out of scope** for this documentation set (do not track them).

---

## 7. Handover Recipients & Ownership

- Handover prepared for **Vijay Dhawan** and **Soham Kotkar** (transfer model — no formal sign-off
  person; "transfer recipients continue from docs").
- Owner: Shashank Mishra. System Owner: Rishabh Yadav.
- User decisions (from archived `handover/00_INDEX.md`): git `main` only; no secret rotation
  (document locations only); scope = `gateway + agent + langgraph + frontend/`
  (`candidate_portal`/`client_portal`/`portal` archived).

---

## 8. Contribution Log

`CONTRIBUTION_LOG.md` (archived) records 2026-05-26 → 07-02 history, the architectural
contributions table, and open blockers: partner contacts, Artha payroll API, sign-off.

---

## 9. Next

→ `15_KNOWN_ISSUES_ARCHIVE_INDEX.md` (final document — closes the linear path back to the index).
