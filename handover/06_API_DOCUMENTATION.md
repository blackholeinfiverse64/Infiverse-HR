# 06 — API Documentation

**Status:** Pending  
**Owner:** Shashank Mishra  
**Last updated:** 2026-08-08

---

## What This Deliverable Must Cover

- Every API endpoint (gateway, agent, langgraph)
- Request/response shapes
- Authentication requirements (API key, JWT roles)
- Dependencies between endpoints
- Failure scenarios
- SETU partner signal endpoints (`/v1/setu/*`)

## Verification Needed Before Writing

- [ ] Run Postman collection against VM gateway
- [ ] Run `backend/handover/test_all_endpoints.py` against production
- [ ] Validate OpenAPI docs at `/gateway/docs` on VM
- [ ] Capture SETU signal round-trip with Niyantran/Artha

## Source Material

- [backend/handover/api_contract/](../backend/handover/api_contract/) (PART1–5, DATA_MODELS)
- [backend/handover/postman/postman_collection.json](../backend/handover/postman/postman_collection.json)
- [backend/handover/postman/POSTMAN_README.md](../backend/handover/postman/POSTMAN_README.md)

## Evidence Links

_None yet._
