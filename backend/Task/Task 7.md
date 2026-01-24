## Page 1

# CORE TASK ASSIGNMENT — SHASHANK MISHRA

Task Code: BHIV-SAR-01
Title: Sovereign Application Runtime (SAR) — Core Build & Extraction
Duration: 15 Days (Compressed from ~25 Days)
Mode: Execution-Strict | Zero Assumptions | Zero Rework Allowed
Outcome: Reusable Sovereign Runtime for ALL BHIV Products

---

## READ THIS FIRST (MANDATORY)

This is NOT an HR-only task.

You are extracting and hardening a reusable Sovereign Application Runtime from the BHIV HR Platform so it can be reused across:
*   HR
*   CRM
*   ERP (Artha)
*   Nyaya
*   Setu
*   Design Tools
*   Any future BHIV product

You are responsible for:
*   Correctness
*   Reusability
*   Sovereign portability
*   Zero data leakage
*   Clean handover

You are NOT allowed to:
*   Hardcode HR-specific assumptions into the runtime
*   Embed tenant logic incorrectly

---


## Page 2

*   Expose Sovereign Core internals
*   Leave undocumented decisions
*   Rely on “we’ll fix it later”

**Outcome standard:**
If this runtime is dropped into KSA / UAE sovereign infrastructure, it must work without modification.

---

&lt;img&gt;Link icon&lt;/img&gt; **INTEGRATION BLOCK**

You must actively coordinate with:
*   Ishan Shirode — AI / RL / Decision Layer validation
*   Nikhil — Frontend / UI contract alignment
*   Vinayak Tiwari — Repo Depot, QA, acceptance testing

You do not own their work.
You must provide clean interfaces for them.

---

&lt;img&gt;Calendar icon&lt;/img&gt; **TIMELINE (FIXED)**
*   Start: Day 1 (Immediate)
*   Hard Freeze: End of Day 13
*   QA + Buffer: Day 14–15
*   No extensions

---

&lt;img&gt;Calendar icon&lt;/img&gt; **DAY-BY-DAY BREAKDOWN (MANDATORY)**

**Day 1–2 — Runtime Extraction**
*   Identify and isolate:
    *   Auth flow

---


## Page 3

* Tenant resolution
* Role enforcement
* Audit logging
* Extract into /runtime-core/
* Remove HR-specific coupling

Deliverable:
/runtime-core/README.md (what this runtime is and is not)

---

Day 3-4 — Tenant & Sovereignty Layer
* Implement:
    * Tenant_ID as first-class citizen
    * Hard tenant isolation
    * Config-driven jurisdiction rules
* No cross-tenant memory, logs, or cache

Deliverable:
Tenant isolation test cases + failure proofs

---

Day 5-6 — Workflow Spine
* Generalize workflow engine:
    * Task creation
    * Approval
    * State transitions
* Must support:
    * HR tasks
    * ERP actions
    * Future Nyaya / Setu actions

Deliverable:
Workflow DSL / schema + examples (HR + non-HR)

---


## Page 4

## Day 7-8 — Audit, Provenance & Bucket Hooks

*   Every action must:
    *   Emit audit record
    *   Store provenance reference
*   Bucket integration must be pluggable, not hardcoded

**Deliverable:**
Audit event schema + sample logs

## Day 9-10 — Artha & Task Manager Integration

*   Connect:
    *   Payroll → Artha ledger (interface only)
    *   Task events → workflow manager
*   No business logic duplication

**Deliverable:**
Artha adapter + mock ledger tests

## Day 11-12 — Edge & Sovereign Portability

*   Runtime must:
    *   Run without cloud dependencies
    *   Support air-gapped mode
    *   Allow sovereign key injection
*   No Render / SaaS assumptions

**Deliverable:**
Edge deployment guide (Docker + no-cloud mode)

---


## Page 5

# Day 13 — Runtime Finalization

*   Freeze interfaces
*   Version the runtime
*   Produce handover pack

---

# Day 14-15 — QA + Depot Submission

*   Vinayak testing
*   Fix only critical issues
*   Final submission to Repo Depot

---

## LEARNING KITS (MANDATORY)

### Core Concepts

*   Keywords:
    *   “Multi-tenant SaaS architecture”
    *   “Workflow engine design”
    *   “Audit logging systems”
    *   “Sovereign cloud architecture”

### Reading

*   CNCF: Cloud Native Security Whitepaper
*   Temporal.io workflow concepts
*   Event sourcing basics (conceptual only)

### LLM Learning Prompts

Use ChatGPT with prompts like:

*   “Design a tenant-isolated workflow engine”
*   “Explain audit-first application architecture”
*   “How to design portable sovereign runtimes”

---


## Page 6

# DELIVERABLES (NON-NEGOTIABLE)

You must submit:
1. Runtime Core Folder
2. Integration Contracts (HR, Artha, Generic)
3. Audit & Workflow Schemas
4. Edge Deployment Guide
5. Handover README
6. QA Checklist
7. Known Limitations (Explicit)

No partial submissions.

---

# SUCCESS CRITERIA

This task is successful if:
* HR continues to work unchanged
* Another product can reuse the runtime with <10% glue code
* Vinayak can test without calling you
* Ishan can plug RL into it cleanly
* Nikhil can build UI without backend rewrites