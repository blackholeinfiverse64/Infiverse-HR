# 05 — Database Documentation

**Status:** Pending  
**Owner:** Shashank Mishra  
**Last updated:** 2026-08-08

---

## What This Deliverable Must Cover

- MongoDB Atlas cluster overview
- Schema / collections and relationships
- Migration history (PostgreSQL → MongoDB)
- Seed data procedures
- Backup and restore procedures
- Connection string location (not the value)

## Verification Needed Before Writing

- [ ] Connect to Atlas (requires access) and list collections
- [ ] Run schema scripts in `backend/services/db/`
- [ ] Document backup schedule from Atlas dashboard
- [ ] Verify `MONGODB_URI` env var location in GitHub secrets + VM env files

## Source Material

- [backend/handover/api_contract/DATA_MODELS.md](../backend/handover/api_contract/DATA_MODELS.md)
- [backend/services/db/deploy_schema_production.sql](../backend/services/db/deploy_schema_production.sql)
- [backend/.env.example](../backend/.env.example)

## Evidence Links

_None yet._
