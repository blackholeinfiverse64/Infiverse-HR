[CursorBrowser] Native dialog overrides installed - dialogs are now non-blocking
chunk-PJEEZAML.js?v=bf09b053:21551 Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
ThemeContext.tsx:28 Theme changed to: light
ThemeContext.tsx:28 Theme changed to: light
AuthContext.tsx:62 🔐 AuthContext: Attempting login with stored role: auto-detect
authService.ts:50 🔐 No role found, attempting auto-detection...
authService.ts:249 🔐 Storing auth token after login
authService.ts:250 🔐 Token length: 355
authService.ts:251 🔐 Token first 50 chars: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2O
authService.ts:269 ✅ Token stored successfully
authService.ts:270 ✅ Token verification: Stored token matches
AuthContext.tsx:69 🔐 AuthContext: Login result: {success: true, hasToken: true, hasUser: true, userRole: 'candidate'}
AuthContext.tsx:90 🔐 AuthContext: Extracted role from token: recruiter
AuthContext.tsx:99 🔐 AuthContext: Storing auth token for role: recruiter
AuthContext.tsx:100 🔐 AuthContext: Token length: 355
AuthContext.tsx:101 🔐 AuthContext: Token first 50 chars: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2O
AuthContext.tsx:137 ✅ AuthContext: Token stored successfully
AuthContext.tsx:138 ✅ AuthContext: Token verification passed
AuthContext.tsx:168 ✅ AuthContext: Login successful for role: recruiter
AuthPage.tsx:163 🚀 Login: User role from token: recruiter Redirecting to: /recruiter
api.ts:39 ✅ Adding Authorization header for request: /v1/jobs?
api.ts:39 ✅ Adding Authorization header for request: /v1/recruiter/stats
api.ts:39 ✅ Adding Authorization header for request: /v1/interviews
api.ts:39 ✅ Adding Authorization header for request: /v1/offers
api.ts:39 ✅ Adding Authorization header for request: /v1/match/69722cbe8d9c05b1a84e1e71/top
5api.ts:39 ✅ Adding Authorization header for request: /v1/jobs?
api.ts:39 ✅ Adding Authorization header for request: /v1/jobs/1
api.ts:39 ✅ Adding Authorization header for request: /v1/jobs?
api.ts:39 ✅ Adding Authorization header for request: /v1/jobs/1
api.ts:319  GET http://localhost:8000/v1/jobs/1 404 (Not Found)
dispatchXhrRequest @ axios.js?v=bf09b053:1696
xhr @ axios.js?v=bf09b053:1573
dispatchRequest @ axios.js?v=bf09b053:2107
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getJobById @ api.ts:319
loadJobDetails @ ApplicantsMatching.tsx:64
(anonymous) @ ApplicantsMatching.tsx:39
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
commitPassiveMountOnFiber @ chunk-PJEEZAML.js?v=bf09b053:18156
commitPassiveMountEffects_complete @ chunk-PJEEZAML.js?v=bf09b053:18129
commitPassiveMountEffects_begin @ chunk-PJEEZAML.js?v=bf09b053:18119
commitPassiveMountEffects @ chunk-PJEEZAML.js?v=bf09b053:18109
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19490
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:75 API Error: 404 - /v1/jobs/1
(anonymous) @ api.ts:75
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getJobById @ api.ts:319
loadJobDetails @ ApplicantsMatching.tsx:64
(anonymous) @ ApplicantsMatching.tsx:39
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
commitPassiveMountOnFiber @ chunk-PJEEZAML.js?v=bf09b053:18156
commitPassiveMountEffects_complete @ chunk-PJEEZAML.js?v=bf09b053:18129
commitPassiveMountEffects_begin @ chunk-PJEEZAML.js?v=bf09b053:18119
commitPassiveMountEffects @ chunk-PJEEZAML.js?v=bf09b053:18109
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19490
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:322 Error fetching job: AxiosError {message: 'Request failed with status code 404', name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, request: XMLHttpRequest, …}
getJobById @ api.ts:322
await in getJobById
loadJobDetails @ ApplicantsMatching.tsx:64
(anonymous) @ ApplicantsMatching.tsx:39
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
commitPassiveMountOnFiber @ chunk-PJEEZAML.js?v=bf09b053:18156
commitPassiveMountEffects_complete @ chunk-PJEEZAML.js?v=bf09b053:18129
commitPassiveMountEffects_begin @ chunk-PJEEZAML.js?v=bf09b053:18119
commitPassiveMountEffects @ chunk-PJEEZAML.js?v=bf09b053:18109
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19490
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
ApplicantsMatching.tsx:67 Failed to load job: AxiosError {message: 'Request failed with status code 404', name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, request: XMLHttpRequest, …}
loadJobDetails @ ApplicantsMatching.tsx:67
await in loadJobDetails
(anonymous) @ ApplicantsMatching.tsx:39
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
commitPassiveMountOnFiber @ chunk-PJEEZAML.js?v=bf09b053:18156
commitPassiveMountEffects_complete @ chunk-PJEEZAML.js?v=bf09b053:18129
commitPassiveMountEffects_begin @ chunk-PJEEZAML.js?v=bf09b053:18119
commitPassiveMountEffects @ chunk-PJEEZAML.js?v=bf09b053:18109
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19490
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:319  GET http://localhost:8000/v1/jobs/1 404 (Not Found)
dispatchXhrRequest @ axios.js?v=bf09b053:1696
xhr @ axios.js?v=bf09b053:1573
dispatchRequest @ axios.js?v=bf09b053:2107
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getJobById @ api.ts:319
loadJobDetails @ ApplicantsMatching.tsx:64
(anonymous) @ ApplicantsMatching.tsx:39
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=bf09b053:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=bf09b053:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=bf09b053:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:75 API Error: 404 - /v1/jobs/1
(anonymous) @ api.ts:75
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getJobById @ api.ts:319
loadJobDetails @ ApplicantsMatching.tsx:64
(anonymous) @ ApplicantsMatching.tsx:39
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=bf09b053:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=bf09b053:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=bf09b053:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:322 Error fetching job: AxiosError {message: 'Request failed with status code 404', name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, request: XMLHttpRequest, …}
getJobById @ api.ts:322
await in getJobById
loadJobDetails @ ApplicantsMatching.tsx:64
(anonymous) @ ApplicantsMatching.tsx:39
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=bf09b053:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=bf09b053:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=bf09b053:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
ApplicantsMatching.tsx:67 Failed to load job: AxiosError {message: 'Request failed with status code 404', name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, request: XMLHttpRequest, …}
loadJobDetails @ ApplicantsMatching.tsx:67
await in loadJobDetails
(anonymous) @ ApplicantsMatching.tsx:39
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=bf09b053:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=bf09b053:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=bf09b053:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
2api.ts:39 ✅ Adding Authorization header for request: /v1/jobs?
api.ts:39 ✅ Adding Authorization header for request: /v1/candidates?
api.ts:39 ✅ Adding Authorization header for request: /v1/jobs?
api.ts:39 ✅ Adding Authorization header for request: /v1/candidates?
api.ts:39 ✅ Adding Authorization header for request: /v1/jobs?
api.ts:929  GET http://localhost:8000/v1/candidates? 401 (Unauthorized)
dispatchXhrRequest @ axios.js?v=bf09b053:1696
xhr @ axios.js?v=bf09b053:1573
dispatchRequest @ axios.js?v=bf09b053:2107
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getAllCandidates @ api.ts:929
loadData @ ValuesAssessment.tsx:45
(anonymous) @ ValuesAssessment.tsx:35
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
commitPassiveMountOnFiber @ chunk-PJEEZAML.js?v=bf09b053:18156
commitPassiveMountEffects_complete @ chunk-PJEEZAML.js?v=bf09b053:18129
commitPassiveMountEffects_begin @ chunk-PJEEZAML.js?v=bf09b053:18119
commitPassiveMountEffects @ chunk-PJEEZAML.js?v=bf09b053:18109
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19490
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:60 ❌ 401 Unauthorized for: /v1/candidates?
(anonymous) @ api.ts:60
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getAllCandidates @ api.ts:929
loadData @ ValuesAssessment.tsx:45
(anonymous) @ ValuesAssessment.tsx:35
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
commitPassiveMountOnFiber @ chunk-PJEEZAML.js?v=bf09b053:18156
commitPassiveMountEffects_complete @ chunk-PJEEZAML.js?v=bf09b053:18129
commitPassiveMountEffects_begin @ chunk-PJEEZAML.js?v=bf09b053:18119
commitPassiveMountEffects @ chunk-PJEEZAML.js?v=bf09b053:18109
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19490
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:61 Response details: {detail: 'Invalid API key'}
(anonymous) @ api.ts:61
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getAllCandidates @ api.ts:929
loadData @ ValuesAssessment.tsx:45
(anonymous) @ ValuesAssessment.tsx:35
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
commitPassiveMountOnFiber @ chunk-PJEEZAML.js?v=bf09b053:18156
commitPassiveMountEffects_complete @ chunk-PJEEZAML.js?v=bf09b053:18129
commitPassiveMountEffects_begin @ chunk-PJEEZAML.js?v=bf09b053:18119
commitPassiveMountEffects @ chunk-PJEEZAML.js?v=bf09b053:18109
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19490
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:66 Token exists but was rejected. Token (first 50 chars): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2O
(anonymous) @ api.ts:66
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getAllCandidates @ api.ts:929
loadData @ ValuesAssessment.tsx:45
(anonymous) @ ValuesAssessment.tsx:35
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
commitPassiveMountOnFiber @ chunk-PJEEZAML.js?v=bf09b053:18156
commitPassiveMountEffects_complete @ chunk-PJEEZAML.js?v=bf09b053:18129
commitPassiveMountEffects_begin @ chunk-PJEEZAML.js?v=bf09b053:18119
commitPassiveMountEffects @ chunk-PJEEZAML.js?v=bf09b053:18109
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19490
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:67 This suggests the token is invalid, expired, or signed with wrong secret.
(anonymous) @ api.ts:67
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getAllCandidates @ api.ts:929
loadData @ ValuesAssessment.tsx:45
(anonymous) @ ValuesAssessment.tsx:35
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
commitPassiveMountOnFiber @ chunk-PJEEZAML.js?v=bf09b053:18156
commitPassiveMountEffects_complete @ chunk-PJEEZAML.js?v=bf09b053:18129
commitPassiveMountEffects_begin @ chunk-PJEEZAML.js?v=bf09b053:18119
commitPassiveMountEffects @ chunk-PJEEZAML.js?v=bf09b053:18109
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19490
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:932 Error fetching candidates: AxiosError {message: 'Request failed with status code 401', name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, request: XMLHttpRequest, …}
getAllCandidates @ api.ts:932
await in getAllCandidates
loadData @ ValuesAssessment.tsx:45
(anonymous) @ ValuesAssessment.tsx:35
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
commitPassiveMountOnFiber @ chunk-PJEEZAML.js?v=bf09b053:18156
commitPassiveMountEffects_complete @ chunk-PJEEZAML.js?v=bf09b053:18129
commitPassiveMountEffects_begin @ chunk-PJEEZAML.js?v=bf09b053:18119
commitPassiveMountEffects @ chunk-PJEEZAML.js?v=bf09b053:18109
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19490
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:929  GET http://localhost:8000/v1/candidates? 401 (Unauthorized)
dispatchXhrRequest @ axios.js?v=bf09b053:1696
xhr @ axios.js?v=bf09b053:1573
dispatchRequest @ axios.js?v=bf09b053:2107
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getAllCandidates @ api.ts:929
loadData @ ValuesAssessment.tsx:45
(anonymous) @ ValuesAssessment.tsx:35
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=bf09b053:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=bf09b053:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=bf09b053:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:60 ❌ 401 Unauthorized for: /v1/candidates?
(anonymous) @ api.ts:60
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getAllCandidates @ api.ts:929
loadData @ ValuesAssessment.tsx:45
(anonymous) @ ValuesAssessment.tsx:35
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=bf09b053:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=bf09b053:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=bf09b053:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:61 Response details: {detail: 'Invalid API key'}
(anonymous) @ api.ts:61
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getAllCandidates @ api.ts:929
loadData @ ValuesAssessment.tsx:45
(anonymous) @ ValuesAssessment.tsx:35
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=bf09b053:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=bf09b053:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=bf09b053:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:66 Token exists but was rejected. Token (first 50 chars): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2O
(anonymous) @ api.ts:66
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getAllCandidates @ api.ts:929
loadData @ ValuesAssessment.tsx:45
(anonymous) @ ValuesAssessment.tsx:35
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=bf09b053:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=bf09b053:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=bf09b053:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:67 This suggests the token is invalid, expired, or signed with wrong secret.
(anonymous) @ api.ts:67
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getAllCandidates @ api.ts:929
loadData @ ValuesAssessment.tsx:45
(anonymous) @ ValuesAssessment.tsx:35
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=bf09b053:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=bf09b053:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=bf09b053:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:932 Error fetching candidates: AxiosError {message: 'Request failed with status code 401', name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, request: XMLHttpRequest, …}
getAllCandidates @ api.ts:932
await in getAllCandidates
loadData @ ValuesAssessment.tsx:45
(anonymous) @ ValuesAssessment.tsx:35
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=bf09b053:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=bf09b053:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=bf09b053:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:39 ✅ Adding Authorization header for request: /v1/candidates?
api.ts:39 ✅ Adding Authorization header for request: /v1/interviews
api.ts:39 ✅ Adding Authorization header for request: /v1/candidates?
api.ts:39 ✅ Adding Authorization header for request: /v1/interviews
api.ts:929  GET http://localhost:8000/v1/candidates? 401 (Unauthorized)
dispatchXhrRequest @ axios.js?v=bf09b053:1696
xhr @ axios.js?v=bf09b053:1573
dispatchRequest @ axios.js?v=bf09b053:2107
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getAllCandidates @ api.ts:929
loadData @ ExportReports.tsx:24
(anonymous) @ ExportReports.tsx:14
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
commitPassiveMountOnFiber @ chunk-PJEEZAML.js?v=bf09b053:18156
commitPassiveMountEffects_complete @ chunk-PJEEZAML.js?v=bf09b053:18129
commitPassiveMountEffects_begin @ chunk-PJEEZAML.js?v=bf09b053:18119
commitPassiveMountEffects @ chunk-PJEEZAML.js?v=bf09b053:18109
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19490
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:60 ❌ 401 Unauthorized for: /v1/candidates?
(anonymous) @ api.ts:60
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getAllCandidates @ api.ts:929
loadData @ ExportReports.tsx:24
(anonymous) @ ExportReports.tsx:14
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
commitPassiveMountOnFiber @ chunk-PJEEZAML.js?v=bf09b053:18156
commitPassiveMountEffects_complete @ chunk-PJEEZAML.js?v=bf09b053:18129
commitPassiveMountEffects_begin @ chunk-PJEEZAML.js?v=bf09b053:18119
commitPassiveMountEffects @ chunk-PJEEZAML.js?v=bf09b053:18109
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19490
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:61 Response details: {detail: 'Invalid API key'}
(anonymous) @ api.ts:61
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getAllCandidates @ api.ts:929
loadData @ ExportReports.tsx:24
(anonymous) @ ExportReports.tsx:14
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
commitPassiveMountOnFiber @ chunk-PJEEZAML.js?v=bf09b053:18156
commitPassiveMountEffects_complete @ chunk-PJEEZAML.js?v=bf09b053:18129
commitPassiveMountEffects_begin @ chunk-PJEEZAML.js?v=bf09b053:18119
commitPassiveMountEffects @ chunk-PJEEZAML.js?v=bf09b053:18109
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19490
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:66 Token exists but was rejected. Token (first 50 chars): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2O
(anonymous) @ api.ts:66
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getAllCandidates @ api.ts:929
loadData @ ExportReports.tsx:24
(anonymous) @ ExportReports.tsx:14
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
commitPassiveMountOnFiber @ chunk-PJEEZAML.js?v=bf09b053:18156
commitPassiveMountEffects_complete @ chunk-PJEEZAML.js?v=bf09b053:18129
commitPassiveMountEffects_begin @ chunk-PJEEZAML.js?v=bf09b053:18119
commitPassiveMountEffects @ chunk-PJEEZAML.js?v=bf09b053:18109
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19490
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:67 This suggests the token is invalid, expired, or signed with wrong secret.
(anonymous) @ api.ts:67
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getAllCandidates @ api.ts:929
loadData @ ExportReports.tsx:24
(anonymous) @ ExportReports.tsx:14
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
commitPassiveMountOnFiber @ chunk-PJEEZAML.js?v=bf09b053:18156
commitPassiveMountEffects_complete @ chunk-PJEEZAML.js?v=bf09b053:18129
commitPassiveMountEffects_begin @ chunk-PJEEZAML.js?v=bf09b053:18119
commitPassiveMountEffects @ chunk-PJEEZAML.js?v=bf09b053:18109
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19490
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:932 Error fetching candidates: AxiosError {message: 'Request failed with status code 401', name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, request: XMLHttpRequest, …}
getAllCandidates @ api.ts:932
await in getAllCandidates
loadData @ ExportReports.tsx:24
(anonymous) @ ExportReports.tsx:14
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
commitPassiveMountOnFiber @ chunk-PJEEZAML.js?v=bf09b053:18156
commitPassiveMountEffects_complete @ chunk-PJEEZAML.js?v=bf09b053:18129
commitPassiveMountEffects_begin @ chunk-PJEEZAML.js?v=bf09b053:18119
commitPassiveMountEffects @ chunk-PJEEZAML.js?v=bf09b053:18109
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19490
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:929  GET http://localhost:8000/v1/candidates? 401 (Unauthorized)
dispatchXhrRequest @ axios.js?v=bf09b053:1696
xhr @ axios.js?v=bf09b053:1573
dispatchRequest @ axios.js?v=bf09b053:2107
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getAllCandidates @ api.ts:929
loadData @ ExportReports.tsx:24
(anonymous) @ ExportReports.tsx:14
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=bf09b053:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=bf09b053:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=bf09b053:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:60 ❌ 401 Unauthorized for: /v1/candidates?
(anonymous) @ api.ts:60
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getAllCandidates @ api.ts:929
loadData @ ExportReports.tsx:24
(anonymous) @ ExportReports.tsx:14
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=bf09b053:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=bf09b053:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=bf09b053:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:61 Response details: {detail: 'Invalid API key'}
(anonymous) @ api.ts:61
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getAllCandidates @ api.ts:929
loadData @ ExportReports.tsx:24
(anonymous) @ ExportReports.tsx:14
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=bf09b053:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=bf09b053:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=bf09b053:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:66 Token exists but was rejected. Token (first 50 chars): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2O
(anonymous) @ api.ts:66
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getAllCandidates @ api.ts:929
loadData @ ExportReports.tsx:24
(anonymous) @ ExportReports.tsx:14
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=bf09b053:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=bf09b053:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=bf09b053:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:67 This suggests the token is invalid, expired, or signed with wrong secret.
(anonymous) @ api.ts:67
Promise.then
_request @ axios.js?v=bf09b053:2310
request @ axios.js?v=bf09b053:2219
Axios.<computed> @ axios.js?v=bf09b053:2346
wrap @ axios.js?v=bf09b053:8
getAllCandidates @ api.ts:929
loadData @ ExportReports.tsx:24
(anonymous) @ ExportReports.tsx:14
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=bf09b053:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=bf09b053:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=bf09b053:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:932 Error fetching candidates: AxiosError {message: 'Request failed with status code 401', name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, request: XMLHttpRequest, …}
getAllCandidates @ api.ts:932
await in getAllCandidates
loadData @ ExportReports.tsx:24
(anonymous) @ ExportReports.tsx:14
commitHookEffectListMount @ chunk-PJEEZAML.js?v=bf09b053:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=bf09b053:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=bf09b053:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=bf09b053:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=bf09b053:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=bf09b053:19447
(anonymous) @ chunk-PJEEZAML.js?v=bf09b053:19328
workLoop @ chunk-PJEEZAML.js?v=bf09b053:197
flushWork @ chunk-PJEEZAML.js?v=bf09b053:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=bf09b053:384
api.ts:39 ✅ Adding Authorization header for request: /v1/match/69722af98d9c05b1a84e1e6d/top