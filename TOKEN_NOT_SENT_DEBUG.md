# Token Not Being Sent - Debug Guide

## Problem
Backend logs show: **"No credentials provided in Authorization header"**
This means the frontend is NOT sending the `Authorization: Bearer <token>` header.

## Root Cause Analysis

### ✅ What's Working
1. **Axios Interceptor** - Correctly configured to add Authorization header
2. **Token Storage** - `authService.setAuthToken()` stores token as `'auth_token'`
3. **AuthContext** - Also stores token as `'auth_token'`

### ❌ Potential Issues

1. **Token Not Stored After Login**
   - Login might be failing silently
   - Token might not be in response
   - Token might be stored with wrong key

2. **Token Cleared**
   - Token might be expired and cleared
   - Token might be cleared by another part of the app

3. **Interceptor Not Running**
   - Axios instance might not be using the interceptor
   - Multiple axios instances might exist

## Debug Steps Added

### 1. Enhanced Interceptor Logging
Added console logging to `api.ts` interceptor:
```typescript
if (!token) {
  console.warn('⚠️ No auth_token found in localStorage for request:', config.url);
  console.warn('Available localStorage keys:', Object.keys(localStorage));
} else {
  console.log('✅ Adding Authorization header for request:', config.url);
}
```

### 2. How to Debug

#### Step 1: Check Browser Console
After login, check console for:
- `✅ Adding Authorization header` - Token is present and being added
- `⚠️ No auth_token found` - Token is missing

#### Step 2: Check localStorage
In browser console, run:
```javascript
// Check if token exists
const token = localStorage.getItem('auth_token');
console.log('Token exists:', !!token);
console.log('Token (first 50 chars):', token?.substring(0, 50));

// Check all localStorage keys
console.log('All localStorage keys:', Object.keys(localStorage));
```

#### Step 3: Check Network Tab
In browser DevTools → Network tab:
1. Find a failed API request (401 error)
2. Click on it
3. Check "Request Headers"
4. Look for `Authorization: Bearer <token>`
   - ✅ If present: Backend issue (token validation failing)
   - ❌ If missing: Frontend issue (token not being sent)

#### Step 4: Verify Login Response
After login, check:
```javascript
// In browser console after login
const token = localStorage.getItem('auth_token');
const userData = localStorage.getItem('user_data');
console.log('Token after login:', token ? 'Present' : 'Missing');
console.log('User data:', userData);
```

## Expected Behavior

### After Successful Login:
1. ✅ Token stored in `localStorage.getItem('auth_token')`
2. ✅ Console shows: `✅ Adding Authorization header for request: /v1/...`
3. ✅ Network tab shows: `Authorization: Bearer <token>` in request headers
4. ✅ Backend logs show: `Authentication successful: Candidate JWT token`

### If Token Missing:
1. ❌ Console shows: `⚠️ No auth_token found in localStorage`
2. ❌ Network tab shows: No `Authorization` header
3. ❌ Backend logs show: `No credentials provided in Authorization header`

## Quick Fixes to Try

### Fix 1: Clear localStorage and Re-login
```javascript
// In browser console
localStorage.clear();
// Then login again
```

### Fix 2: Manually Set Token (for testing)
```javascript
// In browser console (after login)
const token = localStorage.getItem('auth_token');
if (token) {
  console.log('Token is present, should work');
} else {
  console.error('Token is missing! Login might have failed.');
}
```

### Fix 3: Check Login Response
Verify the login endpoint returns a token:
- Check Network tab → Login request → Response
- Should contain: `{ "success": true, "token": "..." }`

## Next Steps

1. **Check browser console** for the new debug messages
2. **Check Network tab** to see if Authorization header is being sent
3. **Check localStorage** to verify token is stored
4. **Check backend logs** to see what error is being logged

## Files Modified

1. **`frontend/src/services/api.ts`**
   - Added debug logging to request interceptor
   - Will show if token is missing or present

## Expected Console Output

### ✅ If Working:
```
✅ Adding Authorization header for request: /v1/candidate/stats/...
✅ Adding Authorization header for request: /v1/interviews?candidate_id=...
```

### ❌ If Not Working:
```
⚠️ No auth_token found in localStorage for request: /v1/candidate/stats/...
Available localStorage keys: ['user_data', 'user_role', ...]
```

This will help identify if:
- Token is not being stored after login
- Token is being cleared
- Token is stored with wrong key

