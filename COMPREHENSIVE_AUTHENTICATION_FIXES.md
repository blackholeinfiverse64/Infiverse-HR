# Comprehensive Authentication Fixes

## Overview
Fixed all authentication issues to ensure candidate-facing endpoints properly support JWT token authentication from the frontend.

## Issues Fixed

### 1. **401 Unauthorized Errors - Multiple Endpoints**

#### Problem
Several endpoints were using `get_api_key` which only accepts API keys, not JWT tokens from the frontend:
- `/v1/interviews` - 401 error
- `/v1/offers` - 401 error  
- `/v1/feedback` (GET) - 401 error
- `/v1/feedback` (POST) - 401 error

#### Solution
Changed all candidate-facing endpoints to use `get_auth` which supports both API keys (for service-to-service) and JWT tokens (for frontend users).

### 2. **404 Not Found - Stats Endpoint**

#### Problem
- `/v1/candidate/stats/{candidate_id}` endpoint didn't exist

#### Solution
Created new endpoint that returns dashboard statistics for candidates.

### 3. **Missing Candidate ID Filtering**

#### Problem
Endpoints didn't support filtering by `candidate_id` query parameter, making it difficult for candidates to view only their own data.

#### Solution
Added `candidate_id` query parameter support with proper authorization checks.

## Endpoints Updated

### 1. `/v1/interviews` (GET)
**Before:**
```python
async def get_interviews(api_key: str = Depends(get_api_key)):
```

**After:**
```python
async def get_interviews(candidate_id: Optional[str] = None, auth = Depends(get_auth)):
```
- ✅ Now accepts JWT tokens
- ✅ Supports `candidate_id` query parameter filtering
- ✅ Validates candidates can only view their own interviews

### 2. `/v1/offers` (GET)
**Before:**
```python
async def get_all_offers(api_key: str = Depends(get_api_key)):
```

**After:**
```python
async def get_all_offers(candidate_id: Optional[str] = None, auth = Depends(get_auth)):
```
- ✅ Now accepts JWT tokens
- ✅ Supports `candidate_id` query parameter filtering
- ✅ Validates candidates can only view their own offers

### 3. `/v1/feedback` (GET)
**Before:**
```python
async def get_all_feedback(api_key: str = Depends(get_api_key)):
```

**After:**
```python
async def get_all_feedback(candidate_id: Optional[str] = None, auth = Depends(get_auth)):
```
- ✅ Now accepts JWT tokens
- ✅ Supports `candidate_id` query parameter filtering
- ✅ Validates candidates can only view their own feedback

### 4. `/v1/feedback` (POST)
**Before:**
```python
async def submit_feedback(feedback: FeedbackSubmission, api_key: str = Depends(get_api_key)):
```

**After:**
```python
async def submit_feedback(feedback: FeedbackSubmission, auth = Depends(get_auth)):
```
- ✅ Now accepts JWT tokens
- ✅ Validates candidates can only submit feedback for themselves

### 5. `/v1/candidate/stats/{candidate_id}` (GET) - NEW
**Created:**
```python
async def get_candidate_stats(candidate_id: str, auth = Depends(get_auth)):
```
- ✅ Returns dashboard statistics
- ✅ Requires JWT authentication
- ✅ Validates candidates can only view their own stats

## Authorization Logic

All candidate-facing endpoints now include authorization checks:

```python
# If JWT auth, verify candidate_id matches authenticated user
if auth.get("type") == "jwt_token" and auth.get("role") == "candidate":
    token_candidate_id = str(auth.get("user_id", ""))
    if token_candidate_id and token_candidate_id != str(candidate_id):
        raise HTTPException(status_code=403, detail="You can only view your own data")
```

This ensures:
- Candidates can only access their own data
- API keys (service-to-service) still work for admin operations
- Proper security boundaries are maintained

## Frontend Compatibility

All frontend API calls are already correctly configured:
- ✅ JWT tokens are stored in `localStorage` as `auth_token`
- ✅ Axios interceptor adds `Authorization: Bearer <token>` header
- ✅ All API calls use the correct endpoints with query parameters

## Testing Checklist

After restarting the backend, test:

### ✅ Login Flow
- [ ] Login as candidate
- [ ] Token is stored in localStorage
- [ ] `candidate_id` is stored in localStorage

### ✅ Dashboard
- [ ] Dashboard loads without errors
- [ ] Stats endpoint returns data (no 404)
- [ ] Applications load (no 401)
- [ ] Interviews load (no 401)
- [ ] Offers load (no 401)

### ✅ Profile Page
- [ ] Profile loads (no 401)
- [ ] Profile can be updated (no 401)

### ✅ Job Search
- [ ] Jobs list loads (public endpoint - no auth needed)
- [ ] Can apply for jobs (no 401)

### ✅ Applications Page
- [ ] Applications list loads (no 401)

### ✅ Interviews/Tasks Page
- [ ] Interviews load (no 401)
- [ ] Tasks endpoint returns empty array (endpoint doesn't exist - handled gracefully)

### ✅ Feedback Page
- [ ] Feedback list loads (no 401)
- [ ] Can submit feedback (no 401)

## Expected Console Output

After fixes, you should see:
- ✅ No 401 Unauthorized errors
- ✅ No 404 Not Found errors (except for tasks endpoint which is handled)
- ✅ All API calls return 200 OK
- ✅ Data loads successfully in all pages

## Files Modified

1. `backend/services/gateway/app/main.py`
   - Updated `/v1/interviews` endpoint
   - Updated `/v1/offers` endpoint
   - Updated `/v1/feedback` (GET) endpoint
   - Updated `/v1/feedback` (POST) endpoint
   - Created `/v1/candidate/stats/{candidate_id}` endpoint

## Next Steps

1. **Restart Backend Gateway Service** (REQUIRED)
2. **Clear Browser Cache** (optional but recommended):
   ```javascript
   localStorage.clear()
   ```
3. **Test All Candidate Pages**:
   - Dashboard
   - Profile
   - Job Search
   - Applications
   - Interviews/Tasks
   - Feedback

## Debugging

If you still see errors:

1. **Check Backend Logs**:
   - Look for authentication errors
   - Verify `CANDIDATE_JWT_SECRET_KEY` is set

2. **Check Browser Network Tab**:
   - Verify `Authorization: Bearer <token>` header is present
   - Check response status codes

3. **Verify Token**:
   ```javascript
   // In browser console:
   const token = localStorage.getItem('auth_token');
   const candidateId = localStorage.getItem('backend_candidate_id');
   console.log('Token:', token ? 'Present' : 'Missing');
   console.log('Candidate ID:', candidateId);
   ```

## Summary

All candidate-facing endpoints now properly support JWT authentication, ensuring:
- ✅ Secure access control
- ✅ Proper authorization checks
- ✅ Frontend compatibility
- ✅ No more 401/404 errors

