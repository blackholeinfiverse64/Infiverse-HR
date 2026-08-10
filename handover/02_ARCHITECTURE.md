# 02 — Complete Architecture Documentation

**Status:** Pending  
**Owner:** Shashank Mishra  
**Last updated:** 2026-08-08

---

## What This Deliverable Must Cover

- High-level architecture diagram
- Module breakdown (gateway, agent, langgraph, frontend, SETU)
- Service interactions and data flow
- Authentication flow (API key + JWT layers)
- Deployment architecture (VM primary, Render backup)
- Repository structure
- Environment configuration overview
- External dependencies (MongoDB Atlas, Twilio, Gemini, workflow bridge)

## Verification Needed Before Writing

- [ ] Validate service health endpoints on VM
- [ ] Trace auth flow with test login (local or staging)
- [ ] Confirm SETU signal path with live `/v1/setu/*` call
- [ ] Draw architecture diagram matching actual deployment

## Source Material

- [backend/handover/architecture/ARCHITECTURE.md](../backend/handover/architecture/ARCHITECTURE.md)
- [docs/SAMPADA_WORKFORCE_OS_ARCHITECTURE.md](../docs/SAMPADA_WORKFORCE_OS_ARCHITECTURE.md)
- [backend/handover/SYSTEM_BEHAVIOR.md](../backend/handover/SYSTEM_BEHAVIOR.md)

## Evidence Links

_None yet._
