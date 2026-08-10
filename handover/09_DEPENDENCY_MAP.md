# 09 — Dependency Map

**Status:** Pending  
**Owner:** Shashank Mishra  
**Last updated:** 2026-08-08

---

## What This Deliverable Must Cover

- Internal service dependencies (gateway → agent, langgraph, MongoDB)
- External dependencies (MongoDB Atlas, Twilio, Gemini, Gmail, workflow bridge)
- SETU partner dependencies — Sampada's calling code only (Niyantran, Artha, CRM, Bucket, PRANA etc. are separate repos, not in this zip — see `IMPLEMENTATION_PLAN.md` § Ecosystem Scope)
- Team dependencies and ownership
- Repository dependencies (primary repo; partner repos noted as external, not documented in depth)

## Verification Needed Before Writing

- [ ] Trace the SETU signal flow as far as Sampada's own code goes (request/response shape at the `/v1/setu/*` boundary); full round-trip testing needs the partner systems, which aren't available in this handover
- [ ] Confirm `WORKFLOW_API_BASE_URL` target (`blackholeworkflow.onrender.com`)
- [ ] Map which partner repos exist locally vs remote-only
- [ ] Document team contacts per [backend/handover/ROLE_MATRIX.md](../backend/handover/ROLE_MATRIX.md)

## Source Material

- [ECOSYSTEM_REPOSITORY_MAP.md](../ECOSYSTEM_REPOSITORY_MAP.md)
- [backend/handover/integration_maps/INTEGRATION_MAPS.md](../backend/handover/integration_maps/INTEGRATION_MAPS.md)
- [docs/SAMPADA_SETU_CONVERGENCE_MAP.md](../docs/SAMPADA_SETU_CONVERGENCE_MAP.md)

## Evidence Links

_None yet._
