# SAMPADA CURRENT STATE — Developer Handover Document
**Last Updated**: 2026-06-02 | **Maintained by**: Shashank (Sampada, Support Builder)
**System Owner**: Rishabh Yadav | **Status**: Active Convergence Sprint · Task19 Constitutional Hardening

> This document enables a completely new developer to enter the system with minimal verbal explanation.
> Read every section before writing a single line of code.

### Task19 Required Sections Index

| # | Required Section (Task19) | Section in This Document |
|---|---------------------------|--------------------------|
| 1 | Product Purpose | §1 Product Purpose |
| 2 | Ownership Matrix | §2 Ownership Matrix |
| 3 | Architecture Layers | §3 Architecture Layers (Government-Scale Workforce OS) |
| 4 | SETU Relationship | §4 SETU Relationship |
| 5 | Policy / Governance Model | §5 Policy / Governance Model |
| 6 | Federated Workforce Model | §6 Federated Workforce Model |
| 7 | Command Center Governance | §7 Command Center Governance |
| 8 | Human Safety Framework | §8 Human Safety Framework |
| 9 | Current Implementation State | §9 Current Implementation State |
| 10 | Developer Entry Guide | §10 Developer Entry Guide |

---

## 1. Product Purpose

**INFIVERSE-HR (codename: Sampada / BHIV)** is an enterprise-grade AI-enabled multi-tenant **Workforce Intelligence + HR Operations Platform** — evolving from a Workforce OS baseline into a governance-ready, policy-aware, government-scale operational workforce intelligence layer inside the SETU unified operational ecosystem.

### What It Does
The platform manages the complete hiring lifecycle **and** broader workforce intelligence for multiple client companies (tenants) from a single system:
- **Job Posting & Management**: Client companies post roles; recruiters manage hiring pipelines.
- **Candidate Sourcing & Matching**: AI-powered semantic matching scores candidates against job descriptions using sentence transformers.
- **Application Lifecycle**: Candidates apply, move through review → shortlist → interview → offer stages.
- **Workflow Automation**: Every lifecycle event (apply, shortlist, schedule, offer) triggers automated notifications via Email, WhatsApp, and Telegram.
- **Multi-Tenant Isolation**: Each client company's data is isolated — Client A cannot see Client B's jobs or candidates.
- **External Workflow Integration**: Candidate task assignments sync with the Complete-Infiverse external workflow system.
- **Workforce Operations Layer**: Employee profiles, attendance visibility, leave requests, HR requests, reimbursements, payroll visibility (not ownership).
- **Growth & Development Layer**: Learning progress visibility, skills evolution, mentorship tracking, strengths mapping.
- **Workforce Observability Layer**: Organizational visibility, team load signals, bottlenecks, operational health signals.
- **Government-Scale Governance Layer**: Policy-aware visibility, explicit authority separation, challenge pathways, and traceable governance actions.
- **Executive Workforce Control Center**: Low-scroll, high-density operational dashboard for workforce health, hiring health, escalations, and observability.

### Who Uses It
| Portal | Users | Core Actions |
|--------|-------|-------------|
| **Candidate Portal** | Job seekers | Apply, track status, upload docs, view tasks |
| **Recruiter Console** | Internal HR staff | Post jobs, review applicants, schedule, shortlist |
| **Client Portal** | Hiring companies | View pipeline, approve candidates, request documents |

### Scale & Volume
- **111 operational API endpoints** across 3 microservices
- **240 candidates** in the database (as of last verified run: 2026-05-26)
- **25 active jobs** across multiple tenants
- **14+ MongoDB collections** for persistence

### Task19 Direction
- Government-scale org hierarchy support
- Federated administration across local, department, platform, and auditor roles
- Policy- and consent-bounded visibility
- Challengeable derived intelligence, not canonical truth

---

## 2. Ownership Matrix

| Domain | Owner | Scope |
|--------|-------|-------|
| **Sampada (Platform)** | Rishabh Yadav | Hiring intelligence, workforce intelligence, employee operations, HR visibility, growth tracking, workforce observability |
| **Niyantran** | Rishabh Yadav | Tasking, reviews, testing, execution telemetry, payroll calculation participation |
| **Artha** | Rishabh Yadav | Financial systems, payroll truth |
| **Logistics** | Rishabh Yadav | Logistics systems |
| **CRM** | Rishabh Yadav | Relationship intelligence |
| **SETU** | Rishabh Yadav | Aggregation, cross-domain intelligence, unified operational visibility |

### Role Assignments
| Role | Person | Responsibility |
|------|--------|---------------|
| System Owner | Rishabh Yadav | All architectural decisions, acceptance sign-off, escalation authority |
| Support Builder | Shashank | Documentation, observability, implementation support under lead direction |
| Frontend Developer | Nikhil | Frontend implementation |
| Infra | Vinayak / Raj | Deployment and infrastructure |

### Critical Rule
Payroll visibility participation ≠ payroll ownership. Sampada may surface payroll signals from Artha but does not own payroll truth.

---

## 3. Architecture Layers (Government-Scale Workforce OS)

Sampada is modeled as a 5-layer government-scale workforce intelligence platform. Full specification: [SAMPADA_GOVERNMENT_SCALE_ARCHITECTURE.md](SAMPADA_GOVERNMENT_SCALE_ARCHITECTURE.md).

| Layer | Scope | Key Entities |
|-------|-------|-------------|
| **Talent Intelligence** | Hiring lifecycle | Candidates, recruiters, jobs, interviews, NDAs, onboarding |
| **Workforce Operations** | Employee operations | Profiles, attendance, leave, reimbursements, HR requests, complaints, appreciations, policy acknowledgements |
| **Growth & Development** | Human growth tracking | Learning progress, skills evolution, mentorship, aspirations, strengths mapping |
| **Workforce Observability** | Organizational signals | Team load, bottlenecks, staffing gaps, operational health |
| **Government-Scale Governance** | Policy & authority | Multi-org hierarchy (ministry→department→division→unit→office), federated admin (local/department/platform/auditor), policy-bounded visibility |

### Multi-Org Hierarchy
Supports nested organizational levels: ministry → department → division → unit → office → contractor/vendor participation.

### Workforce Scope
Permanent staff, contractual staff, consultants, outsourced workforce, volunteers, fellows, advisors — each as distinct participation types.

### Federated Administration
Bounded administration model: local admins, department admins, platform admins, auditors. No single global admin.

### Multi-Tenant Isolation
Four isolation dimensions: tenant isolation, org isolation, data visibility boundaries, policy boundaries.

---

## 4. SETU Relationship

Full convergence map: [SAMPADA_SETU_CONVERGENCE_MAP.md](SAMPADA_SETU_CONVERGENCE_MAP.md).

### Domain Ownership
| System | Owns | Sampada Relationship |
|--------|------|---------------------|
| **Sampada** | Intelligence + workforce visibility | Source system |
| **Niyantran** | Tasking, execution telemetry | Bounded signal consumer |
| **Artha** | Payroll truth, financial systems | Bounded visibility participant |
| **Logistics** | Logistics systems | Bounded participant |
| **CRM** | Relationship intelligence | Bounded participant |
| **SETU** | Aggregation, cross-domain intelligence | Upstream aggregator |

### Signal Exchange Model
- Sampada → SETU: workforce intelligence signals, hiring pipeline state, observability data
- Niyantran → Sampada: execution telemetry (read-only participation)
- Artha → Sampada: payroll visibility signals (read-only, not ownership transfer)
- SETU → All: cross-domain aggregated intelligence

### Boundary Enforcement
- Aggregation must not erase local ownership or policy context
- Cross-system references must preserve source authority
- Derived intelligence remains challengeable interpretation, not canonical truth

---

## 5. Policy / Governance Model

Full specification: [SAMPADA_POLICY_GOVERNANCE_MODEL.md](SAMPADA_POLICY_GOVERNANCE_MODEL.md).

### Policy Layer
Scoped, explicit policies: leave, attendance, growth, visibility, consent, retention. Policies may vary by tenant, organization, workforce category, or administrative level.

### Governance Verbs (Visibly Separated)
| Verb | Meaning | Boundary |
|------|---------|----------|
| **Observe** | Read signals within scope | Cannot assess or approve |
| **Assess** | Interpret against policy | Must show basis; cannot imply approval |
| **Recommend** | Suggest next steps | Advisory only; cannot execute |
| **Approve** | Authorize bounded action | Traceable to role and scope |
| **Execute** | Perform action in owning system | Not inferred from observation alone |

### Enforcement Patterns
Policy tags, policy engines, rule provenance, auditability, override recording, challenge pathways.

### Non-Negotiable
No hidden governance. No silent authority escalation. No opaque policy effects.

---

## 6. Federated Workforce Model

Full specification: [SAMPADA_FEDERATED_WORKFORCE_MODEL.md](SAMPADA_FEDERATED_WORKFORCE_MODEL.md).

### Canonical Workforce Reference
Minimal shared identity layer with: workforce reference ID, local system ID, source system, tenant/org scope, participation type, correlation ID history, ownership metadata, data freshness marker.

### Domain Ownership Split
| Domain | Owns |
|--------|------|
| **Sampada** | Growth, lifecycle, workforce intelligence, observability |
| **Niyantran** | Execution telemetry, tasking evidence |
| **Artha** | Payroll truth, compensation state |
| **Others** | Bounded participation only when explicitly defined |

### Signal Interoperability
Cross-system references, trace lineage, correlation IDs, source declarations, ownership metadata — all mandatory for replay and audit.

### Anti-Centralization Guardrails
- No universal human-state model
- Derived intelligence remains challengeable
- Source systems remain visible
- Aggregation must not erase origin

---

## 7. Command Center Governance

Full specification: [SAMPADA_COMMAND_CENTER_GOVERNANCE_MODEL.md](SAMPADA_COMMAND_CENTER_GOVERNANCE_MODEL.md).

### Executive Use Cases
Minister, Secretary, Department Head, HR Operator, Auditor — each with scope-bounded views.

### Cognition Separation
Observation → Assessment → Recommendation → Decision → Execution. Each stage visibly labeled. Dashboard informs; it does not grant legitimacy.

### Explainability Surfaces
Every derived insight must show: source visibility, calculation explanation, signal provenance.

### Authority Drift Protection
Prevent: dashboard score → official truth, operational summary → hidden approval, visual ranking → coercive authority, recommendation widget → decision engine.

### Operational Principles
Low-scroll, high-density, fast scanability, hierarchical emphasis, bounded drill-down, trace-aware surfaces.

---

## 8. Human Safety Framework

Full specification: [SAMPADA_HUMAN_SAFETY_MODEL.md](SAMPADA_HUMAN_SAFETY_MODEL.md).

### Core Principles
| Principle | Protection |
|-----------|------------|
| Human Dignity | People ≠ metrics |
| Explainability | No opaque score generation |
| Bounded Scoring | Scores ≠ universal truth; scores ≠ hidden discipline |
| Context Awareness | Same behavior ≠ same meaning across scopes |
| Assistive Intelligence | Advisory ≠ authority |
| Reviewability | Significant outputs must be challengeable |

### Allowed vs Prohibited
| Allowed | Prohibited |
|---------|------------|
| Contextual labeled signals | Surveillance-style monitoring |
| Explainable summaries | Opaque employee scoring |
| Advisory recommendations | Coercive productivity ranking |
| Cross-system references | Hidden authority systems |
| Human review paths | Unreviewable automated judgment |

### Consent & Visibility
Consent is part of the safety model: opt-in for sensitive visibility, explicit and revocable consent scope, role/org/policy-scoped visibility controls, challenge and appeal pathways.

---

## 9. Current Implementation State

### Technical Stack
- **Backend**: Python FastAPI microservices — Gateway (`:8000`), AI Agent (`:9000`), LangGraph (`:9001`)
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Database**: MongoDB Atlas (14+ collections)
- **External**: Complete-Infiverse / EMS for candidate task bridging
- **AI**: sentence-transformers for semantic matching, LangGraph for workflow automation

### API Surface
- **111 operational endpoints** across 3 microservices
- **240 candidates** in database (as of 2026-05-26)
- **25 active jobs** across multiple tenants

### Verified Evidence
| Test | Result |
|------|--------|
| Trace Continuity | `trace_conv_17_257502` — PASS |
| Workflow Automation | `d5df0069-1bfd-4402-a9cc-f13e2e7a8e29` — PASS |
| Resilience Tests | 8/8 PASSED |
| RBAC Negative Tests | 5/5 PASSED (401/403 enforced) |
| Tenant Isolation | PASSED (Client B blocked from Client A) |
| Replay Reconstruction | SUCCESS |

### Known Gaps
| Gap | Risk | Mitigation |
|-----|------|------------|
| Internal HR user authentication not implemented | Medium | API keys used as workaround |
| Tenant isolation is per-endpoint manual filtering | High | Systematic negative testing |
| RL model training is mocked | Low | Documented accepted limitation |
| Tenant-specific encryption missing | Medium | Shared keys — security consideration |

### Task19 Document Status
| Document | Path | Status |
|----------|------|--------|
| Government-Scale Architecture | `docs/SAMPADA_GOVERNMENT_SCALE_ARCHITECTURE.md` | Complete |
| Policy & Governance Model | `docs/SAMPADA_POLICY_GOVERNANCE_MODEL.md` | Complete |
| Federated Workforce Model | `docs/SAMPADA_FEDERATED_WORKFORCE_MODEL.md` | Complete |
| Command Center Governance | `docs/SAMPADA_COMMAND_CENTER_GOVERNANCE_MODEL.md` | Complete |
| Human Safety Model | `docs/SAMPADA_HUMAN_SAFETY_MODEL.md` | Complete |
| Review Packet | `REVIEW_PACKET.md` | Updated |
| Contribution Log | `CONTRIBUTION_LOG.md` | Updated |

---

## 10. Developer Entry Guide

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB Atlas connection string
- Docker Desktop (for containerized services)

### Getting Started
1. Clone the repository
2. Copy `.env.example` to `.env` and fill in secrets (MongoDB URI, JWT secrets, API keys)
3. Backend: `cd backend && pip install -r requirements.txt && python run_services.py`
4. Frontend: `cd frontend && npm install && npm run dev`
5. Services start on Gateway `:8000`, Agent `:9000`, LangGraph `:9001`

### Common Issues
| Issue | Fix |
|-------|-----|
| JWT auth failing | Regenerate tokens using correct secret keys from `.env` |
| Docker not found | Open Docker Desktop; wait for engine to start |
| MongoDB connection refused | Verify Atlas URI and network access in `.env` |
| Frontend CORS errors | Check Gateway CORS config allows frontend origin |

### Key Contacts
- **Architecture questions**: Rishabh Yadav (System Owner)
- **Frontend questions**: Nikhil (Frontend Developer)
- **Deployment questions**: Vinayak / Raj (Infra)
- **Documentation / Observability**: Shashank (Sampada, Support Builder)

### Supporting Documents
| Category | Document | Path |
|----------|----------|------|
| Task19 | Government-Scale Architecture | `docs/SAMPADA_GOVERNMENT_SCALE_ARCHITECTURE.md` |
| Task19 | Policy & Governance Model | `docs/SAMPADA_POLICY_GOVERNANCE_MODEL.md` |
| Task19 | Federated Workforce Model | `docs/SAMPADA_FEDERATED_WORKFORCE_MODEL.md` |
| Task19 | Command Center Governance | `docs/SAMPADA_COMMAND_CENTER_GOVERNANCE_MODEL.md` |
| Task19 | Human Safety Model | `docs/SAMPADA_HUMAN_SAFETY_MODEL.md` |
| Task18 | Workforce OS Architecture | `docs/SAMPADA_WORKFORCE_OS_ARCHITECTURE.md` |
| Task18 | SETU Convergence Map | `docs/SAMPADA_SETU_CONVERGENCE_MAP.md` |
| Task18 | Control Center Blueprint | `docs/SAMPADA_CONTROL_CENTER_BLUEPRINT.md` |
| Task18 | Human Growth Model | `docs/SAMPADA_HUMAN_GROWTH_MODEL.md` |
| General | Review Packet | `REVIEW_PACKET.md` |
| General | Contribution Log | `CONTRIBUTION_LOG` |

### Before Writing Code
1. Read this entire document
2. Read `REVIEW_PACKET.md` for boundary context
3. Check the ownership matrix — do not assume authority across domains
4. Verify which layer your change affects and respect its boundaries
5. All architectural decisions require Rishabh Yadav's approval

---

*This document is maintained by the Sampada Support Builder role. Updates must not change execution-layer configurations or architecture decisions — those require Rishabh Yadav's approval.*
