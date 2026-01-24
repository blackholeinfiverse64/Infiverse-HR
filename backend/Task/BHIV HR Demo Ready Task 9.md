## Page 1

# TASK — SHASHANK MISHRA

Title: HR Platform → Sovereign-Ready, Demo-Stable Alignment Sprint
Duration: 3 Days (Hard stop, no spillover)
Deadline: End of Day 3
Mode: STRICT | CORRECTIVE | DEMO-CRITICAL

---

## READ THIS FIRST — MANDATORY

This task is not about adding features or expanding scope.
This task exists to realign, stabilize, and clearly frame what already exists so the system is:

*   Demo-safe (non-failing)
*   Sovereign-ready (environment + tenant aware)
*   Integrable into BHIV ecosystem
*   Hand-off clean (no ambiguity for others)

You are not allowed to:
*   Rewrite large portions of logic
*   Add new microservices
*   Introduce new frameworks
*   Rename internal BHIV systems

Your responsibility is to extract clarity, boundaries, and safety from the existing build.

---

## INTEGRATION BLOCK

You must sync with:

---


## Page 2

*   Ishan — AI / automation endpoints (confirm what is real vs mock)
*   Nikhil — Frontend consumption expectations
*   Vinayak — Final demo verification & test sign-off

No other dependencies.

---

## DAY-BY-DAY BREAKDOWN

### DAY 1 — Boundary, Reality & Risk Lock

**Goal:** Make the system understandable and safe to present.

**Deliver the following files (MANDATORY):**
1.  `/docs/framework/BOUNDARY_DEFINITION.md`
    *   Must explicitly define:
        *   What is HR-specific logic
        *   What is reusable platform logic
        *   What is external / pluggable
2.  `/docs/demo/DEMO_SCOPE.md`
    *   What flows are SAFE to demo
    *   What must NOT be touched during demo
    *   Known weak points (auth, DB, APIs)
3.  `/docs/system/CURRENT_REALITY.md`
    *   Single-tenant vs multi-tenant: current truth
    *   What breaks if a second company is added
    *   What is mocked vs real

**No assumptions. Only facts.**

---

### DAY 2 — Sovereign & Tenant Hardening (Minimal, Practical)

---


## Page 3

Goal: Make the system appear and behave sovereign-ready without rewriting it.

Deliver:
4. `/docs/sovereign/DEPLOYMENT_READINESS.md`
    * Environment variables required
    * What changes per country / deployment
    * What must NEVER be hardcoded
5. `/docs/security/TENANT_ISOLATION_STATUS.md`
    * How tenant_id is handled today
    * Where it is missing
    * Explicit “NOT SAFE YET” declarations if applicable
6. Code-level changes (small only):
    * Centralize tenant_id extraction (even if single-tenant default)
    * Add guards/comments where cross-tenant leakage could occur

No full refactors. Only containment.

---

DAY 3 — Demo Lock, Handover & Deposit

Goal: Freeze, document, and hand off cleanly.

Deliver:
7. `/handover/DEMO_RUNBOOK.md`
    * Step-by-step demo flow (click/order/API calls)
    * What to do if something fails
    * Who to contact (only if absolutely required)
8. `/handover/FAQ.md` (if not already clean)
    * “Can this support multiple companies?” (honest answer)
    * “Is payroll integrated?” (honest answer)

---


## Page 4

*   "Is this production?" (clear framing)
    9. /handover/QA_CHECKLIST.md
*   What Vinayak should test
*   Pass/fail criteria
    10. Tag the repo:
        *   demo-ready-jan

No new commits after tagging unless explicitly approved.

---

DELIVERABLES (NON-NEGOTIABLE)

*   All docs committed to repo
*   No broken builds
*   No new failing tests
*   Clear demo path validated once locally

If any item cannot be completed, it must be explicitly documented, not hidden.

---

Note for Shashank to understand where we are and what we are heading towards:

What this system is built to do:
A modular, AI-assisted HR platform intended to support recruitment workflows, automation, and decision support, with future readiness for tenant isolation and sovereign deployment.

What it currently is:
A functional, single-tenant HR platform with strong execution depth, but requiring boundary clarification, tenant hardening, and governance framing to be demo-safe and ecosystem-integrable.

---


## Page 5

&lt;img&gt;A close-up photograph of a person's hand holding a small, dark, shiny object between their thumb and index finger. The background is out of focus.&lt;/img&gt;

