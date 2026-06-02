# Central Control API Contract Freeze

Status: active
Owner: Rishabh Yadav
Support Builder: Shashank

## Scope

This contract freeze defines the live API surfaces used by central control so frontend wiring does not rely on mock sources.

## Approved Endpoints

- `GET /metrics/dashboard` (Gateway `:8000`)
  - Auth required (`Bearer` token or service API key)
  - Allowed roles: `client`, `recruiter`, `admin`
  - Response buckets:
    - `performance_summary`
    - `business_metrics`
    - `system_metrics`
  - Correlation header: `X-Correlation-ID`

- `GET /v1/candidates/stats` (Gateway `:8000`)
  - Auth required (`Bearer` token or service API key)
  - Allowed roles: `client`, `recruiter`, `admin`
  - Core fields:
    - `total_candidates`
    - `active_jobs`
    - `recent_matches`
    - `pending_interviews`
    - `new_candidates_this_week`
    - `total_feedback_submissions`
  - Correlation header: `X-Correlation-ID`

- `GET /health` (Agent `:9000`)
  - Read-only health probe
  - Used for service readiness only

- `GET /health` (LangGraph `:9001`)
  - Read-only health probe
  - Used for service readiness only

- `POST /v1/control-center/audit-events` (Gateway `:8000`)
  - Auth required (`Bearer` token or service API key)
  - Allowed roles: `client`, `recruiter`, `admin`
  - Stores control-center access, refresh, and fallback audit records

## Mock Surface Replacement Inventory

Replaced or bounded in central control:

- Static KPI cards -> live Gateway metrics and candidate stats mapping
- Service status badges -> live Agent/LangGraph health checks
- Funnel visualization -> live-derived counts from candidate stats
- Department load bars -> live-derived values from performance metrics

Still intentionally seeded:

- Replay/trace evidence panel remains seeded until a dedicated live replay endpoint is exposed.

## Security and Governance Notes

- Control center stays read-only.
- No execution or mutation workflows are introduced.
- Unauthorized role access returns `403` and UI fails closed.
- Correlation IDs are propagated for traceability.

