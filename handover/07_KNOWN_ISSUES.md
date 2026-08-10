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
| KI-003 | Same hardcoded prod-looking API key fallback in service files | Medium-High | **Fixed (code)** — VM/Render redeploy required | Verified active on production, removed fallbacks from service files to enforce env-based authentication. |
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

### KI-003 — Hardcoded API key fallback in service files (Fixed 2026-08-10)

**Symptom:** A fallback/default `API_KEY` value prefixed `prod_api_key_...` was hardcoded in several service files and test scripts.

**Verification (2026-08-10)**:
- We probed the live production gateway (`https://sampada.blackholeinfiverse.com/gateway`) with this key.
- It **successfully authenticated** and returned live records, confirming it holds active production privileges.
- We scanned the MongoDB Atlas database and confirmed the key is **not stored in any collection**; it was validated solely in-memory via the fallback defaults in code and the `.env` configuration.

**Resolution**:
- **Code fix**: Removed the hardcoded fallback string from `backend/services/gateway/app/main.py` and the Streamlit portal auth managers (`portal`, `client_portal`, `candidate_portal`). The services now strictly load the API key from the `API_KEY_SECRET` environment variable and will raise a `ValueError` if it is missing.
- **Git History**: Since the repository is private, rewriting git history to purge historical references is not required.
- **Recommended Action**: Rotate the key in the live Render/VM environment settings under the `API_KEY_SECRET` environment variable. Once rotated, the old committed key will be completely inactive in production and carry zero privileges.

**Deploy**: Redeploy all gateway and portal services on the production VM/Render to pick up the code changes and load the rotated keys.

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
