# Task19 Requirement → Evidence Matrix

**Updated:** 2026-06-02  
**Scope:** Runtime hardening + governance deliverables (post-document phase)

| Task19 requirement (summary) | Status | Runtime evidence | Verification |
|-----------------------------|--------|------------------|--------------|
| Government-scale multi-org boundaries documented | Complete | `docs/SAMPADA_GOVERNMENT_SCALE_ARCHITECTURE.md` | Doc review |
| Policy/governance separation documented | Complete | `docs/SAMPADA_POLICY_GOVERNANCE_MODEL.md` | Doc review |
| Federated workforce model documented | Complete | `docs/SAMPADA_FEDERATED_WORKFORCE_MODEL.md` | Doc review |
| Command center governance model documented | Complete | `docs/SAMPADA_COMMAND_CENTER_GOVERNANCE_MODEL.md` | Doc review |
| Human safety model documented | Complete | `docs/SAMPADA_HUMAN_SAFETY_MODEL.md` | Doc review |
| Centralized tenant/org/policy scope enforcement | Complete | `backend/services/gateway/app/control_center_governance.py`, scoped `/v1/candidates/stats` | `backend/tests/gateway/test_task19_control_center_governance.py` |
| Live audit write + read + replay APIs | Complete | `POST/GET /v1/control-center/audit-events`, `GET /v1/control-center/audit-replay` | Acceptance pack + manual curl |
| Backend-driven funnel/dept aggregates (no synthetic default) | Complete | `GET /v1/control-center/dashboard-aggregates` | Frontend control center hiring zone |
| Cross-service correlation propagation | Complete | Gateway/Agent/LangGraph `X-Correlation-ID` middleware | Health responses include `correlation_id` |
| Agent/LangGraph authz alignment (sensitive ops) | Complete | RL `POST /rl/retrain` requires API key; health governance metadata | `test_task19_control_center_governance.py` |
| Control center live replay (no seeded default) | Complete | `frontend/src/pages/control/ControlCenter.tsx` uses `fetchControlCenterAuditReplay` | UI replay zone |
| Role-gated control center + nav discoverability | Complete | `ProtectedRoute`, sidebars when `VITE_ENABLE_CONTROL_CENTER=true` | Manual role test |
| End-to-end acceptance pack | Complete | `docs/TASK19_ACCEPTANCE_TEST_PACK.md` | `pytest backend/tests/gateway/test_task19_control_center_governance.py` |
| Review packet objective closure | Complete | `REVIEW_PACKET.md` § Task19 Runtime Evidence | Acceptance reviewer |

## Former runtime gaps (now closed)

1. **Seeded replay trace** → live scoped audit replay API + UI wiring.
2. **Platform-wide stats for scoped roles** → `compute_scoped_candidate_stats` with job-id isolation.
3. **Synthetic funnel/dept visuals** → MongoDB aggregates by pipeline stage and job department.
4. **Fragmented auth on LangGraph RL retrain** → API key required.
5. **Missing acceptance mapping** → matrix + executable pytest module.
