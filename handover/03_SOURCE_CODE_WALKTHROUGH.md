# 03 — Source Code Walkthrough

**Status:** Pending  
**Owner:** Shashank Mishra  
**Last updated:** 2026-08-08

---

## What This Deliverable Must Cover

- Every major module and its purpose
- Folder structure (`backend/services/`, `frontend/src/`, `runtime-core/`)
- Important files and entry points
- Configuration files (`.env.example`, docker compose)
- Build process (Docker images, Vite frontend)
- Runtime lifecycle (startup, health checks, shutdown)

## Verification Needed Before Writing

- [ ] Run local build: `docker compose -f docker-compose.production.yml config`
- [ ] Run frontend build: `npm run build` in `frontend/`
- [ ] Identify canonical repo path (nested vs root duplicate)
- [ ] Walk through `backend/services/gateway/app/main.py` startup

## Source Material

- [backend/docs/architecture/PROJECT_STRUCTURE.md](../backend/docs/architecture/PROJECT_STRUCTURE.md)
- [QUICK_START.md](../QUICK_START.md)
- [README.md](../README.md)

## Evidence Links

_None yet._
