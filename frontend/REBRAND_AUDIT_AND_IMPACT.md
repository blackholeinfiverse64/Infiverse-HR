# Rebrand Audit: Sampada – Remaining Items, Backend Impact & UI Visibility

## 1. Frontend audit – remaining elements not updated

The following frontend items still reference the old branding (BHIV/Infiverse) or are configuration that could be updated for consistency. **None of these are user-visible UI copy**; they are build/config or internal keys.

### 1.1 Recommended (optional) frontend updates

| Location | Current value | Note |
|----------|----------------|-------|
| **`frontend/package.json`** | `"name": "bhiv-hr-frontend"` | NPM package name; used by tooling only. Optional: change to `sampada-frontend` or `sampada-hr-frontend`. |
| **`frontend/src/context/ThemeContext.tsx`** | `localStorage.getItem('bhiv-theme')` / `setItem('bhiv-theme', …)` | Internal key for theme preference. Changing it would **reset** saved theme for existing users. Leave as-is unless you accept that trade-off. |

### 1.2 Intentionally unchanged (configuration, not branding)

| Location | Current value | Reason |
|----------|----------------|--------|
| **`frontend/src/services/api.ts`** | Fallback API base: `https://bhiv-hr-gateway-l0xp.onrender.com` | Backend URL; renaming the app does not require changing the hostname. Update only when you deploy a new gateway URL. |
| **`frontend/src/pages/recruiter/BatchOperations.tsx`** | Fallback `VITE_LANGGRAPH_URL`: `https://bhiv-hr-langgraph-luy9.onrender.com` | Same as above. |
| **`frontend/src/pages/recruiter/AutomationPanel.tsx`** | Same LangGraph fallback URL | Same as above. |
| **`frontend/VERCEL_DEPLOYMENT.md`** | Example env vars with `bhiv-hr-*` URLs | Documentation of existing deployment URLs; update when you change deployment. |

### 1.3 Summary

- **User-facing UI:** All visible branding has been updated to “Sampada” and “HR Recruitment System.”
- **Remaining “old” references:** Package name, theme localStorage key, and API/env URLs. None of these affect the visible rebrand; updating them is optional or tied to infrastructure/deployment.

---

## 2. Backend / database impact of frontend rebranding

### 2.1 No impact on core functionality

- **Auth (login/signup, JWT):** Backend does not depend on the product name. Tokens are validated by signature and claims (e.g. `user_id`, `role`), not by “Infiverse” or “Sampada.” **No change required** for auth to keep working.
- **APIs:** Request/response schemas use generic fields (`user_id`, `email`, `company_name`, etc.). No API contract uses “Infiverse” or “BHIV” as a required value. **No breaking change** from the frontend rebrand.
- **Database:** MongoDB collections and documents use generic fields (e.g. `company_name`, `email`, `role`). The database name `bhiv_hr` and any backend-internal labels do not affect the frontend. **No DB migration needed** for the rebrand.

### 2.2 Backend places where old branding still appears (optional to update)

These are the only backend spots that still use “BHIV” or similar. They are **not required** for correctness; updating them is for consistency and for any place where the text is shown to users (e.g. 2FA app, CSP report).

| Location | What appears | Impact if left as-is |
|----------|----------------|----------------------|
| **Gateway `main.py`** | `issuer_name="BHIV HR Platform"` in 2FA TOTP provisioning (two places: ~3643, ~3753) | 2FA QR codes in authenticator apps will show “BHIV HR Platform” as issuer. **Purely cosmetic**; 2FA still works. |
| **Gateway `main.py`** | `"company": "BHIV Partner"` in candidate applications response (~4465) | If the frontend displays the “company” field for applications, users will see “BHIV Partner” instead of a real company name. **Only affects display** of that field. |
| **Gateway `main.py`** | `document_uri: "https://bhiv-platform.com/dashboard"` in CSP report (~3605) | Used only in CSP violation reporting; not shown in normal UI. **No user impact.** |
| **Gateway `main.py`** | API title / Swagger: “BHIV HR Platform API Gateway”, “BHIV HR Platform API”, “BHIV HR Gateway” (~144, 577, 583, 589, 606) | Only visible in OpenAPI/Swagger and health responses. **No impact on frontend app behavior.** |
| **Agent `app.py`** | “BHIV AI Matching Engine”, “BHIV AI Agent” in title/health | Same as above; API/docs only. |
| **Backend docs / README / env examples** | “BHIV HR”, “bhiv_hr”, “Infiverse-HR” in paths and text | Documentation and examples only; no runtime impact. |

### 2.3 Potential “conflict” only in display data

- The **only** place that could look like a conflict is the **applications API** returning `"company": "BHIV Partner"`. If your frontend shows this field (e.g. on candidate “My Applications” or recruiter views), users will still see “BHIV Partner” until the backend is updated to return a real company name or “Sampada” (or you remove/hide that field in the UI).
- **Recommendation:** In the gateway, either set `company` from the actual job/client data (e.g. `company_name` from the job’s client) or use a generic label like `"Sampada"` or your real company name. No DB schema change is required.

### 2.4 Summary table

| Area | Impact from rebrand | Action needed |
|------|---------------------|----------------|
| Auth / JWT / login | None | None |
| API contracts / DB schema | None | None |
| 2FA issuer label | Shown in authenticator app | Optional: change `issuer_name` to “Sampada” in gateway |
| Applications “company” field | Shown in UI if you display it | Optional: change hardcoded “BHIV Partner” to real data or “Sampada” |
| API/Swagger titles | Docs/health only | Optional: rename for consistency |
| Database name `bhiv_hr` | Internal only | Optional; leave as-is to avoid migration |

---

## 3. Where rebranding is visible in the live application

Below is a concise list of **every place** in the UI where the new branding (Sampada + HR Recruitment System) and related styling appear.

### 3.1 Entry and public shell

| Page / component | What you see |
|------------------|--------------|
| **Browser tab** | Document title: **“Sampada - HR Recruitment System”** (from `index.html`). |
| **Splash screen** (first load / refresh) | Full-screen gradient (slate → purple → slate). Animated gradient blobs (purple, emerald, pink). **“Sampada”** in gradient text (emerald → purple → pink). **“HR Recruitment System”** as subtitle. Progress bar (emerald → purple → pink). Footer: “Powered by AI • Built for Modern Recruitment.” |
| **Role selection** (`/`) | Header: **“Sampada”** (same gradient), **“HR Recruitment System”** underneath. “Welcome to the Future of Hiring” and role cards. Footer: **“© 2024 Sampada.** Powered by AI • Built for Modern Recruitment.” |
| **Auth (login/signup)** (`/auth`) | Left panel: logo (briefcase icon in gradient box) + **“Sampada”** (gradient) + **“HR Recruitment System”** (small gray subtitle). Rest of page unchanged. |
| **Public navbar** (when shown, e.g. landing) | Logo: **“S”** in gradient box. **“Sampada”** (purple gradient) with **“HR Recruitment System”** (small gray) below. User block: “Admin User”, **admin@sampada.hr**. |

### 3.2 Role-specific shell (after login)

| Page / component | What you see |
|------------------|--------------|
| **Role navbar** (Recruiter / Client / Candidate) | Logo icon in role-colored gradient. **“Sampada”** (gradient). **“HR Recruitment System”** (gray subtitle). Mobile: **“Sampada”** only. |
| **Client sidebar** (bottom user block) | Fallback email when no user email: **client@sampada.hr**. |
| **Recruiter sidebar** (bottom user block) | Fallback email: **recruiter@sampada.hr**. |
| **Candidate sidebar** (bottom user block) | Fallback email: **candidate@sampada.hr**. |

### 3.3 Page content (in-app)

| Page | What you see |
|------|----------------|
| **Client dashboard** (`/client` or `/client/dashboard`) | Page header: **"Sampada Client Portal"** with subtitle "Dedicated Client Interface for Jobs & Candidate Review." |
| **Recruiter dashboard** | “Recruiter Console” (unchanged; not product name). |
| **Candidate dashboard** | “Welcome back, {name}” (unchanged). |
| **Blob loading overlay** (AI Shortlist / Get AI Matches) | Title and description are page-specific (e.g. “Generating AI Shortlist”, “Getting AI Matches”); no “Sampada” in overlay. Styling uses same gradient blob look (purple/emerald/pink) as splash. |

### 3.4 Styling and visuals (unchanged by rebrand)

- **Gradients:** Emerald → purple → pink (splash, role selection, auth, navbars, progress bars) – same as before; only the word “Sampada” and “HR Recruitment System” replaced “Infiverse” / “Infiverse HR” / “Intelligent Hiring Platform.”
- **Logo:** Briefcase icon in gradient box; logo letter in public nav changed from “BH” to “S”. No new logo asset was added.
- **Typography:** Same font usage; no new typefaces.
- **Animations:** Blob animation, pulse-glow, bounce-slow, spin-slow, fade-in-up – all unchanged; they are not tied to the old name.

### 3.5 Checklist for manual verification

- [ ] Browser tab: “Sampada - HR Recruitment System”
- [ ] Splash: “Sampada” + “HR Recruitment System”
- [ ] Role selection: “Sampada” + “HR Recruitment System” + “© 2024 Sampada”
- [ ] Auth: “Sampada” + “HR Recruitment System”
- [ ] Public navbar: “S” + “Sampada” + “HR Recruitment System” + admin@sampada.hr
- [ ] Role navbars (all three roles): “Sampada” + “HR Recruitment System”
- [ ] Client dashboard: “Sampada Client Portal”
- [ ] Sidebars: fallback emails *@sampada.hr when no user email
- [ ] No visible “Infiverse” or “BHIV HR” in the app UI

---

## 4. Conflicts between frontend rebrand and backend

- **Functionality:** None. Login, APIs, and database continue to work with the frontend rebrand.
- **Display:** The only possible mismatch is the **applications `company`** value “BHIV Partner” returned by the backend. If the frontend shows that field, update the backend (or the UI) as in §2.3.
- **2FA:** Issuer name “BHIV HR Platform” in authenticator apps is cosmetic only; no conflict with frontend rebrand.

No other conflicts between frontend rebranding and existing backend/database functionality were found.
