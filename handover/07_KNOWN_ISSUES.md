# 07 — Known Issues Register

**Status:** In Progress  
**Owner:** Shashank Mishra  
**Last updated:** 2026-08-08

---

## Active Issues

| ID | Issue | Severity | Status | Notes |
|----|-------|----------|--------|-------|
| KI-001 | Client login datetime comparison (`POST /gateway/v1/client/login`) | Medium | **Fixed (code)** — VM redeploy required | EVD-002: `can't compare offset-naive and offset-aware datetimes` in account lock check. Fixed in `backend/services/gateway/app/main.py` by normalizing MongoDB `locked_until` to UTC-aware before compare. **Redeploy gateway on VM** to pick up fix. |
| KI-002 | Render backup returning 503 | Low | Open | See IMPLEMENTATION_PLAN.md — confirm transient vs broken deploy |
| KI-003 | Same hardcoded prod-looking API key committed in 29 files | **Medium-High** | Open — verified 2026-08-10, not rotated (no-rotation policy) | One key, not 29. Full detail below. |
| KI-004 | Nested repo duplication in workspace | Low | Open | `bhiv-Infiverse-HR/` nested copy vs root |
| KI-005 | Gateway self-reports a dead Render URL | Low | **Fixed (code)** — VM redeploy required | `GET /gateway/` returns `production_url: bhiv-hr-gateway-ltg0.onrender.com`, which doesn't match the actual current Render backup (`l0xp`, per EVD-002). Full detail below. |

---

## Resolved / Closed

### KI-001 — Client login offset-naive vs offset-aware datetime (2026-08-08)

**Symptom:** Client login for `vinayaktiwari27@gmail.com` returned HTTP 200 with body error: `Authentication error: can't compare offset-naive and offset-aware datetimes`. Candidate and Recruiter logins unaffected.

**Root cause:** `client_login` compared MongoDB `locked_until` (often stored/read as timezone-naive UTC) directly against `datetime.now(timezone.utc)` (timezone-aware).

**Fix:** Added `_as_utc_aware()` helper; account lock check now normalizes `locked_until` before comparison.

**Deploy:** Gateway service on production VM must be redeployed/restarted after merging this fix.

**Evidence:** [EVD-002](evidence/health-checks/vm-health-check-2026-08-08.md)

---

### KI-003 — Hardcoded API key committed across 29 files (verified 2026-08-10)

**Symptom:** A fallback/default `API_KEY` value prefixed `prod_api_key_...` appears identically across every location below — this is one key copy-pasted 29 times, not 29 independent test keys.

**Confirmed locations:**
- `evidence/entry-points/curl-examples.sh` — also has 2 sample JWTs (client scope, candidate scope)
- `backend/tools/utilities/verify_changes.py` — module-level `API_KEY = "..."` constant
- `backend/tests/**/*.py` — 27 files, same key as a fallback default

**Not re-checked this pass:** `backend/services/portal/auth_manager.py` — lower priority since `portal` is archived per the 2026-08-10 scope decision, but the same key may still be there.

**Why this is different from the general "no rotation" policy:** the owner's decision not to rotate env-file secrets at handover is reasonable — those stay inside the team. This is a key value **committed to source control**, sitting in a file inside the very `evidence/` folder this handover package points recipients toward. It's in git history regardless of whether it's removed from the working tree today.

**Recommended action (not performed as part of this pass):** confirm whether this key still carries live production privileges. If it does, treat it as already compromised — anyone with repo read access has had it — independent of the no-rotation policy for this specific handover. Run `backend/tools/utilities/find_exposed_keys.py` for a fuller sweep before widening repo access.

---

### KI-005 — Gateway self-reports a dead production URL (verified 2026-08-10)

**Symptom:** `GET /gateway/` (confirmed both on a local instance and live on the VM per EVD-002) returns a `production_url` field pointing at `https://bhiv-hr-gateway-ltg0.onrender.com` — a URL that doesn't match the Render backup actually configured today (`https://bhiv-hr-gateway-l0xp.onrender.com`). Cosmetic — doesn't affect routing, auth, or the health checks — but it's coming from the API itself, which is exactly the kind of detail Vijay/Soham would reasonably trust as current.

**Root cause:** Hardcoded string literal in the root (`/`) handler at `backend/services/gateway/app/main.py` (around line 803), left over from an earlier Render deployment generation, never updated across the Render → VM migration.

**Fix:**
```python
"production_url": "https://sampada.blackholeinfiverse.com/gateway",
```
(or drop the field — `04_PRODUCTION_INFRASTRUCTURE.md` and `/gateway/health` already cover this. Team's call.)

**Deploy:** Gateway on the production VM needs a redeploy to pick this up, same as KI-001 — worth bundling both fixes into one redeploy.

**Evidence:** Cross-confirmed two ways — a local gateway boot during this audit, and the live VM check in EVD-002 (where `l0xp` is the URL that actually returns a response, `ltg0` isn't tested anywhere/doesn't appear to be a live service).

---

## What This Deliverable Must Cover

- Existing bugs and pending work
- Technical debt
- Incomplete features and temporary workarounds
- Production risks

## Verification Needed Before Writing

- [ ] Run full test suite and capture failures
- [ ] Cross-check [REVIEW_PACKET.md](../REVIEW_PACKET.md) open items
- [ ] Confirm Render 503 is transient vs broken deploy
- [ ] Audit git history for committed secrets
- [x] Re-verify client login on VM after gateway redeploy

## Source Material

- [backend/handover/KNOWN_GAPS.md](../backend/handover/KNOWN_GAPS.md)
- [backend/handover/issues/ISSUES_AND_LIMITATIONS.md](../backend/handover/issues/ISSUES_AND_LIMITATIONS.md)
- [REVIEW_PACKET.md](../REVIEW_PACKET.md)

## Evidence Links

- [EVD-002 — VM health check + login smoke](evidence/health-checks/vm-health-check-2026-08-08.md)
