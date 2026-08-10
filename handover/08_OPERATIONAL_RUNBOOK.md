# 08 — Operational Runbook

**Status:** Pending  
**Owner:** Shashank Mishra  
**Last updated:** 2026-08-08

---

## What This Deliverable Must Cover

- How to deploy (GitHub Actions + manual VM steps)
- How to restart services (`docker compose` on VM)
- Failure recovery and automatic rollback (from deploy.yml)
- Log locations (container logs, VM paths)
- Monitoring process
- Troubleshooting guide
- Rollback procedure (Render failover + VM image rollback)
- Release history location (`~/SAMPADA/docs/RELEASE_HISTORY.md`)

## Verification Needed Before Writing

- [ ] SSH to VM and perform restart drill (requires access)
- [ ] Trigger or review a GitHub Actions deploy run
- [ ] Test rollback path documented in `.github/workflows/deploy.yml`
- [ ] Document Render wake-up / failover switch steps
- [ ] Capture `docker compose logs` locations

## Source Material

- [backend/handover/RUNBOOK.md](../backend/handover/RUNBOOK.md)
- [backend/handover/FAQ.md](../backend/handover/FAQ.md)
- [.github/workflows/deploy.yml](../.github/workflows/deploy.yml)

## Evidence Links

_None yet._
