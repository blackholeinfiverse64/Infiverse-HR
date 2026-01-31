[CursorBrowser] Native dialog overrides installed - dialogs are now non-blocking
chunk-PJEEZAML.js?v=6d89e3c3:21551 Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
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
api.ts:39 ✅ Adding Authorization header for request: /v1/jobs?
api.ts:39 ✅ Adding Authorization header for request: /v1/recruiter/stats
api.ts:39 ✅ Adding Authorization header for request: /v1/interviews
api.ts:39 ✅ Adding Authorization header for request: /v1/offers
2api.ts:39 ✅ Adding Authorization header for request: /v1/match/69722cbe8d9c05b1a84e1e71/top
api.ts:79 Network Error: Unable to reach API at http://localhost:8000/v1/match/69722cbe8d9c05b1a84e1e71/top
(anonymous) @ api.ts:79
Promise.then
_request @ axios.js?v=938f59ed:2310
request @ axios.js?v=938f59ed:2219
Axios.<computed> @ axios.js?v=938f59ed:2346
wrap @ axios.js?v=938f59ed:8
getCandidatesByJob @ api.ts:462
loadDashboardData @ Dashboard.tsx:143
await in loadDashboardData
(anonymous) @ Dashboard.tsx:112
commitHookEffectListMount @ chunk-PJEEZAML.js?v=6d89e3c3:16915
commitPassiveMountOnFiber @ chunk-PJEEZAML.js?v=6d89e3c3:18156
commitPassiveMountEffects_complete @ chunk-PJEEZAML.js?v=6d89e3c3:18129
commitPassiveMountEffects_begin @ chunk-PJEEZAML.js?v=6d89e3c3:18119
commitPassiveMountEffects @ chunk-PJEEZAML.js?v=6d89e3c3:18109
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=6d89e3c3:19490
flushPassiveEffects @ chunk-PJEEZAML.js?v=6d89e3c3:19447
(anonymous) @ chunk-PJEEZAML.js?v=6d89e3c3:19328
workLoop @ chunk-PJEEZAML.js?v=6d89e3c3:197
flushWork @ chunk-PJEEZAML.js?v=6d89e3c3:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=6d89e3c3:384
api.ts:465 Error fetching candidates: AxiosError {message: 'timeout of 15000ms exceeded', name: 'AxiosError', code: 'ECONNABORTED', config: {…}, request: XMLHttpRequest, …}
getCandidatesByJob @ api.ts:465
await in getCandidatesByJob
loadDashboardData @ Dashboard.tsx:143
await in loadDashboardData
(anonymous) @ Dashboard.tsx:112
commitHookEffectListMount @ chunk-PJEEZAML.js?v=6d89e3c3:16915
commitPassiveMountOnFiber @ chunk-PJEEZAML.js?v=6d89e3c3:18156
commitPassiveMountEffects_complete @ chunk-PJEEZAML.js?v=6d89e3c3:18129
commitPassiveMountEffects_begin @ chunk-PJEEZAML.js?v=6d89e3c3:18119
commitPassiveMountEffects @ chunk-PJEEZAML.js?v=6d89e3c3:18109
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=6d89e3c3:19490
flushPassiveEffects @ chunk-PJEEZAML.js?v=6d89e3c3:19447
(anonymous) @ chunk-PJEEZAML.js?v=6d89e3c3:19328
workLoop @ chunk-PJEEZAML.js?v=6d89e3c3:197
flushWork @ chunk-PJEEZAML.js?v=6d89e3c3:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=6d89e3c3:384
api.ts:39 ✅ Adding Authorization header for request: /v1/match/69722af98d9c05b1a84e1e6d/top
api.ts:79 Network Error: Unable to reach API at http://localhost:8000/v1/match/69722cbe8d9c05b1a84e1e71/top
(anonymous) @ api.ts:79
Promise.then
_request @ axios.js?v=938f59ed:2310
request @ axios.js?v=938f59ed:2219
Axios.<computed> @ axios.js?v=938f59ed:2346
wrap @ axios.js?v=938f59ed:8
getCandidatesByJob @ api.ts:462
loadDashboardData @ Dashboard.tsx:143
await in loadDashboardData
(anonymous) @ Dashboard.tsx:112
commitHookEffectListMount @ chunk-PJEEZAML.js?v=6d89e3c3:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=6d89e3c3:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=6d89e3c3:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=6d89e3c3:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=6d89e3c3:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=6d89e3c3:19447
(anonymous) @ chunk-PJEEZAML.js?v=6d89e3c3:19328
workLoop @ chunk-PJEEZAML.js?v=6d89e3c3:197
flushWork @ chunk-PJEEZAML.js?v=6d89e3c3:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=6d89e3c3:384
api.ts:465 Error fetching candidates: AxiosError {message: 'timeout of 15000ms exceeded', name: 'AxiosError', code: 'ECONNABORTED', config: {…}, request: XMLHttpRequest, …}
getCandidatesByJob @ api.ts:465
await in getCandidatesByJob
loadDashboardData @ Dashboard.tsx:143
await in loadDashboardData
(anonymous) @ Dashboard.tsx:112
commitHookEffectListMount @ chunk-PJEEZAML.js?v=6d89e3c3:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=6d89e3c3:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=6d89e3c3:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=6d89e3c3:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=6d89e3c3:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=6d89e3c3:19447
(anonymous) @ chunk-PJEEZAML.js?v=6d89e3c3:19328
workLoop @ chunk-PJEEZAML.js?v=6d89e3c3:197
flushWork @ chunk-PJEEZAML.js?v=6d89e3c3:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=6d89e3c3:384
api.ts:39 ✅ Adding Authorization header for request: /v1/match/69722af98d9c05b1a84e1e6d/top
api.ts:39 ✅ Adding Authorization header for request: /v1/jobs?
api.ts:39 ✅ Adding Authorization header for request: /v1/recruiter/stats
api.ts:39 ✅ Adding Authorization header for request: /v1/interviews
api.ts:39 ✅ Adding Authorization header for request: /v1/offers
api.ts:39 ✅ Adding Authorization header for request: /v1/match/69722cbe8d9c05b1a84e1e71/top
api.ts:79 Network Error: Unable to reach API at http://localhost:8000/v1/match/69722af98d9c05b1a84e1e6d/top
(anonymous) @ api.ts:79
Promise.then
_request @ axios.js?v=938f59ed:2310
request @ axios.js?v=938f59ed:2219
Axios.<computed> @ axios.js?v=938f59ed:2346
wrap @ axios.js?v=938f59ed:8
getCandidatesByJob @ api.ts:462
loadDashboardData @ Dashboard.tsx:143
await in loadDashboardData
(anonymous) @ Dashboard.tsx:112
commitHookEffectListMount @ chunk-PJEEZAML.js?v=6d89e3c3:16915
commitPassiveMountOnFiber @ chunk-PJEEZAML.js?v=6d89e3c3:18156
commitPassiveMountEffects_complete @ chunk-PJEEZAML.js?v=6d89e3c3:18129
commitPassiveMountEffects_begin @ chunk-PJEEZAML.js?v=6d89e3c3:18119
commitPassiveMountEffects @ chunk-PJEEZAML.js?v=6d89e3c3:18109
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=6d89e3c3:19490
flushPassiveEffects @ chunk-PJEEZAML.js?v=6d89e3c3:19447
(anonymous) @ chunk-PJEEZAML.js?v=6d89e3c3:19328
workLoop @ chunk-PJEEZAML.js?v=6d89e3c3:197
flushWork @ chunk-PJEEZAML.js?v=6d89e3c3:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=6d89e3c3:384
api.ts:465 Error fetching candidates: AxiosError {message: 'timeout of 15000ms exceeded', name: 'AxiosError', code: 'ECONNABORTED', config: {…}, request: XMLHttpRequest, …}
getCandidatesByJob @ api.ts:465
await in getCandidatesByJob
loadDashboardData @ Dashboard.tsx:143
await in loadDashboardData
(anonymous) @ Dashboard.tsx:112
commitHookEffectListMount @ chunk-PJEEZAML.js?v=6d89e3c3:16915
commitPassiveMountOnFiber @ chunk-PJEEZAML.js?v=6d89e3c3:18156
commitPassiveMountEffects_complete @ chunk-PJEEZAML.js?v=6d89e3c3:18129
commitPassiveMountEffects_begin @ chunk-PJEEZAML.js?v=6d89e3c3:18119
commitPassiveMountEffects @ chunk-PJEEZAML.js?v=6d89e3c3:18109
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=6d89e3c3:19490
flushPassiveEffects @ chunk-PJEEZAML.js?v=6d89e3c3:19447
(anonymous) @ chunk-PJEEZAML.js?v=6d89e3c3:19328
workLoop @ chunk-PJEEZAML.js?v=6d89e3c3:197
flushWork @ chunk-PJEEZAML.js?v=6d89e3c3:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=6d89e3c3:384
api.ts:39 ✅ Adding Authorization header for request: /v1/match/69722adc8d9c05b1a84e1e6c/top
api.ts:79 Network Error: Unable to reach API at http://localhost:8000/v1/match/69722af98d9c05b1a84e1e6d/top
(anonymous) @ api.ts:79
Promise.then
_request @ axios.js?v=938f59ed:2310
request @ axios.js?v=938f59ed:2219
Axios.<computed> @ axios.js?v=938f59ed:2346
wrap @ axios.js?v=938f59ed:8
getCandidatesByJob @ api.ts:462
loadDashboardData @ Dashboard.tsx:143
await in loadDashboardData
(anonymous) @ Dashboard.tsx:112
commitHookEffectListMount @ chunk-PJEEZAML.js?v=6d89e3c3:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=6d89e3c3:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=6d89e3c3:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=6d89e3c3:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=6d89e3c3:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=6d89e3c3:19447
(anonymous) @ chunk-PJEEZAML.js?v=6d89e3c3:19328
workLoop @ chunk-PJEEZAML.js?v=6d89e3c3:197
flushWork @ chunk-PJEEZAML.js?v=6d89e3c3:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=6d89e3c3:384
api.ts:465 Error fetching candidates: AxiosError {message: 'timeout of 15000ms exceeded', name: 'AxiosError', code: 'ECONNABORTED', config: {…}, request: XMLHttpRequest, …}
getCandidatesByJob @ api.ts:465
await in getCandidatesByJob
loadDashboardData @ Dashboard.tsx:143
await in loadDashboardData
(anonymous) @ Dashboard.tsx:112
commitHookEffectListMount @ chunk-PJEEZAML.js?v=6d89e3c3:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=6d89e3c3:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=6d89e3c3:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=6d89e3c3:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=6d89e3c3:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=6d89e3c3:19447
(anonymous) @ chunk-PJEEZAML.js?v=6d89e3c3:19328
workLoop @ chunk-PJEEZAML.js?v=6d89e3c3:197
flushWork @ chunk-PJEEZAML.js?v=6d89e3c3:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=6d89e3c3:384
api.ts:39 ✅ Adding Authorization header for request: /v1/match/69722adc8d9c05b1a84e1e6c/top
api.ts:79 Network Error: Unable to reach API at http://localhost:8000/v1/match/69722cbe8d9c05b1a84e1e71/top
(anonymous) @ api.ts:79
Promise.then
_request @ axios.js?v=938f59ed:2310
request @ axios.js?v=938f59ed:2219
Axios.<computed> @ axios.js?v=938f59ed:2346
wrap @ axios.js?v=938f59ed:8
getCandidatesByJob @ api.ts:462
loadDashboardData @ Dashboard.tsx:143
setInterval
(anonymous) @ Dashboard.tsx:114
commitHookEffectListMount @ chunk-PJEEZAML.js?v=6d89e3c3:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=6d89e3c3:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=6d89e3c3:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=6d89e3c3:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=6d89e3c3:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=6d89e3c3:19447
(anonymous) @ chunk-PJEEZAML.js?v=6d89e3c3:19328
workLoop @ chunk-PJEEZAML.js?v=6d89e3c3:197
flushWork @ chunk-PJEEZAML.js?v=6d89e3c3:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=6d89e3c3:384
api.ts:465 Error fetching candidates: AxiosError {message: 'timeout of 15000ms exceeded', name: 'AxiosError', code: 'ECONNABORTED', config: {…}, request: XMLHttpRequest, …}
getCandidatesByJob @ api.ts:465
await in getCandidatesByJob
loadDashboardData @ Dashboard.tsx:143
setInterval
(anonymous) @ Dashboard.tsx:114
commitHookEffectListMount @ chunk-PJEEZAML.js?v=6d89e3c3:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=6d89e3c3:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=6d89e3c3:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=6d89e3c3:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=6d89e3c3:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=6d89e3c3:19447
(anonymous) @ chunk-PJEEZAML.js?v=6d89e3c3:19328
workLoop @ chunk-PJEEZAML.js?v=6d89e3c3:197
flushWork @ chunk-PJEEZAML.js?v=6d89e3c3:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=6d89e3c3:384
api.ts:39 ✅ Adding Authorization header for request: /v1/match/69722af98d9c05b1a84e1e6d/top
api.ts:79 Network Error: Unable to reach API at http://localhost:8000/v1/match/69722adc8d9c05b1a84e1e6c/top
(anonymous) @ api.ts:79
Promise.then
_request @ axios.js?v=938f59ed:2310
request @ axios.js?v=938f59ed:2219
Axios.<computed> @ axios.js?v=938f59ed:2346
wrap @ axios.js?v=938f59ed:8
getCandidatesByJob @ api.ts:462
loadDashboardData @ Dashboard.tsx:143
await in loadDashboardData
(anonymous) @ Dashboard.tsx:112
commitHookEffectListMount @ chunk-PJEEZAML.js?v=6d89e3c3:16915
commitPassiveMountOnFiber @ chunk-PJEEZAML.js?v=6d89e3c3:18156
commitPassiveMountEffects_complete @ chunk-PJEEZAML.js?v=6d89e3c3:18129
commitPassiveMountEffects_begin @ chunk-PJEEZAML.js?v=6d89e3c3:18119
commitPassiveMountEffects @ chunk-PJEEZAML.js?v=6d89e3c3:18109
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=6d89e3c3:19490
flushPassiveEffects @ chunk-PJEEZAML.js?v=6d89e3c3:19447
(anonymous) @ chunk-PJEEZAML.js?v=6d89e3c3:19328
workLoop @ chunk-PJEEZAML.js?v=6d89e3c3:197
flushWork @ chunk-PJEEZAML.js?v=6d89e3c3:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=6d89e3c3:384
api.ts:465 Error fetching candidates: AxiosError {message: 'timeout of 15000ms exceeded', name: 'AxiosError', code: 'ECONNABORTED', config: {…}, request: XMLHttpRequest, …}
getCandidatesByJob @ api.ts:465
await in getCandidatesByJob
loadDashboardData @ Dashboard.tsx:143
await in loadDashboardData
(anonymous) @ Dashboard.tsx:112
commitHookEffectListMount @ chunk-PJEEZAML.js?v=6d89e3c3:16915
commitPassiveMountOnFiber @ chunk-PJEEZAML.js?v=6d89e3c3:18156
commitPassiveMountEffects_complete @ chunk-PJEEZAML.js?v=6d89e3c3:18129
commitPassiveMountEffects_begin @ chunk-PJEEZAML.js?v=6d89e3c3:18119
commitPassiveMountEffects @ chunk-PJEEZAML.js?v=6d89e3c3:18109
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=6d89e3c3:19490
flushPassiveEffects @ chunk-PJEEZAML.js?v=6d89e3c3:19447
(anonymous) @ chunk-PJEEZAML.js?v=6d89e3c3:19328
workLoop @ chunk-PJEEZAML.js?v=6d89e3c3:197
flushWork @ chunk-PJEEZAML.js?v=6d89e3c3:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=6d89e3c3:384
api.ts:39 ✅ Adding Authorization header for request: /v1/match/69722a15c184e7444f54410c/top
api.ts:79 Network Error: Unable to reach API at http://localhost:8000/v1/match/69722adc8d9c05b1a84e1e6c/top
(anonymous) @ api.ts:79
Promise.then
_request @ axios.js?v=938f59ed:2310
request @ axios.js?v=938f59ed:2219
Axios.<computed> @ axios.js?v=938f59ed:2346
wrap @ axios.js?v=938f59ed:8
getCandidatesByJob @ api.ts:462
loadDashboardData @ Dashboard.tsx:143
await in loadDashboardData
(anonymous) @ Dashboard.tsx:112
commitHookEffectListMount @ chunk-PJEEZAML.js?v=6d89e3c3:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=6d89e3c3:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=6d89e3c3:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=6d89e3c3:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=6d89e3c3:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=6d89e3c3:19447
(anonymous) @ chunk-PJEEZAML.js?v=6d89e3c3:19328
workLoop @ chunk-PJEEZAML.js?v=6d89e3c3:197
flushWork @ chunk-PJEEZAML.js?v=6d89e3c3:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=6d89e3c3:384
api.ts:465 Error fetching candidates: AxiosError {message: 'timeout of 15000ms exceeded', name: 'AxiosError', code: 'ECONNABORTED', config: {…}, request: XMLHttpRequest, …}
getCandidatesByJob @ api.ts:465
await in getCandidatesByJob
loadDashboardData @ Dashboard.tsx:143
await in loadDashboardData
(anonymous) @ Dashboard.tsx:112
commitHookEffectListMount @ chunk-PJEEZAML.js?v=6d89e3c3:16915
invokePassiveEffectMountInDEV @ chunk-PJEEZAML.js?v=6d89e3c3:18324
invokeEffectsInDev @ chunk-PJEEZAML.js?v=6d89e3c3:19701
commitDoubleInvokeEffectsInDEV @ chunk-PJEEZAML.js?v=6d89e3c3:19686
flushPassiveEffectsImpl @ chunk-PJEEZAML.js?v=6d89e3c3:19503
flushPassiveEffects @ chunk-PJEEZAML.js?v=6d89e3c3:19447
(anonymous) @ chunk-PJEEZAML.js?v=6d89e3c3:19328
workLoop @ chunk-PJEEZAML.js?v=6d89e3c3:197
flushWork @ chunk-PJEEZAML.js?v=6d89e3c3:176
performWorkUntilDeadline @ chunk-PJEEZAML.js?v=6d89e3c3:384
api.ts:39 ✅ Adding Authorization header for request: /v1/match/69722a15c184e7444f54410c/top