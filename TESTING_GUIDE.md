+# Testing Guide: Candidate ID Consistency Fix

## Quick Test Steps

### Prerequisites
1. ✅ Backend is running (gateway service on port 8000)
2. ✅ Frontend is running (usually on port 5173)
3. ✅ You have a test candidate account

---

## Test Scenario 1: Applied Jobs Page

### Steps:
1. **Open Browser** → Navigate to `http://localhost:5173`
2. **Login** as candidate user
3. **Navigate** to `/candidate/applied-jobs` (or click "Applied Jobs" in sidebar)

### Expected Results:
- ✅ Page loads without errors
- ✅ If you have applications: Shows list of applications with statuses
- ✅ If no applications: Shows "No applications found" message
- ✅ If `backend_candidate_id` missing: Shows empty state (no errors)

### Check Browser Console:
```javascript
// Should see:
"Loading applications for candidate: [integer_id]"
"Loaded applications: [array]"
```

### Check Network Tab:
- Request: `GET /v1/candidate/applications/{integer_id}`
- Status: `200 OK`
- Response: `{ "applications": [...], "count": N }`

---

## Test Scenario 2: Dashboard

### Steps:
1. **Login** as candidate
2. **Navigate** to `/candidate/dashboard` (or click "Dashboard" in sidebar)

### Expected Results:
- ✅ Dashboard loads with stats cards:
  - Total Applications
  - Interviews Scheduled
  - Shortlisted
  - Offers Received
- ✅ Shows "Recent Applications" section (if any)
- ✅ Shows "Upcoming Interviews" section (if any)
- ✅ No console errors

### Check Browser Console:
```javascript
// Should see successful API calls:
"Loading applications for candidate: [integer_id]"
```

### Check Network Tab:
- `GET /v1/candidate/stats/{integer_id}` → 200 OK
- `GET /v1/candidate/applications/{integer_id}` → 200 OK
- `GET /v1/interviews?candidate_id={integer_id}` → 200 OK

---

## Test Scenario 3: Feedback Page

### Steps:
1. **Login** as candidate
2. **Navigate** to `/candidate/feedback`

### Expected Results:
- ✅ Page loads without errors
- ✅ If feedback exists: Shows feedback list
- ✅ If no feedback: Shows "No feedback found" message
- ✅ No console errors

### Check Network Tab:
- Request: `GET /v1/feedback?candidate_id={integer_id}`
- Status: `200 OK`

---

## Test Scenario 4: Interviews & Tasks

### Steps:
1. **Login** as candidate
2. **Navigate** to `/candidate/interviews`

### Expected Results:
- ✅ Page loads with two tabs: "Interviews" and "Tasks"
- ✅ Interviews tab shows scheduled interviews (if any)
- ✅ Tasks tab shows assigned tasks (if any)
- ✅ No console errors

### Check Network Tab:
- `GET /v1/interviews?candidate_id={integer_id}` → 200 OK
- `GET /v1/tasks?candidate_id={integer_id}` → 200 OK

---

## Test Scenario 5: Edge Case - Missing backend_candidate_id

### Steps:
1. **Open Browser DevTools** → Application → Local Storage
2. **Delete** `backend_candidate_id` key (keep other keys)
3. **Refresh** page
4. **Navigate** to any candidate page

### Expected Results:
- ✅ Pages show empty state (not errors)
- ✅ No console errors
- ✅ User-friendly messages like "No applications found"
- ✅ No API calls with invalid IDs

---

## Test Scenario 6: Verify ID Format

### Steps:
1. **Open Browser DevTools** → Console
2. **Run** this command:
```javascript
console.log('backend_candidate_id:', localStorage.getItem('backend_candidate_id'))
```

### Expected Results:
- ✅ Should show an **integer string** (e.g., `"456"`, `"123"`)
- ❌ Should NOT show UUID (e.g., `"550e8400-..."`)
- ❌ Should NOT be `null` (if user is registered)

---

## Test Scenario 7: Full User Flow

### Steps:
1. **Register** new candidate account
2. **Login** with new account
3. **Check** localStorage for `backend_candidate_id`
4. **Navigate** through all candidate pages:
   - Dashboard
   - Profile
   - Job Search
   - Applied Jobs
   - Interviews
   - Feedback

### Expected Results:
- ✅ All pages load without errors
- ✅ `backend_candidate_id` is set after registration/login
- ✅ All API calls use integer ID format
- ✅ Data displays correctly (or shows appropriate empty states)

---

## Debugging Tips

### If Pages Show Empty State:
1. **Check** localStorage: `localStorage.getItem('backend_candidate_id')`
2. **Verify** user is registered as candidate (not just JWT authenticated)
3. **Check** backend logs for candidate registration

### If API Calls Fail:
1. **Check Network Tab** → See request URL and response
2. **Verify** backend is running on correct port
3. **Check** CORS settings if seeing CORS errors
4. **Verify** JWT token is valid in Authorization header

### If Wrong Data Shows:
1. **Check** browser console for errors
2. **Verify** `backend_candidate_id` matches your actual candidate ID in database
3. **Check** backend logs for query results

---

## Automated Test Commands

### Check localStorage:
```javascript
// In browser console
console.log({
  backend_candidate_id: localStorage.getItem('backend_candidate_id'),
  candidate_id: localStorage.getItem('candidate_id'),
  user_id: JSON.parse(localStorage.getItem('user_data') || '{}').id,
  auth_token: localStorage.getItem('auth_token') ? 'exists' : 'missing'
})
```

### Test API Directly:
```javascript
// In browser console (after login)
const candidateId = localStorage.getItem('backend_candidate_id')
fetch(`http://localhost:8000/v1/candidate/applications/${candidateId}`, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  }
})
.then(r => r.json())
.then(console.log)
```

---

## Success Criteria

✅ **All tests pass if:**
- No console errors
- All pages load correctly
- API calls return 200 OK status
- Data displays correctly (or appropriate empty states)
- `backend_candidate_id` is integer format
- No UUIDs sent to backend endpoints

---

## Rollback Plan (If Needed)

If issues occur, the changes are **frontend-only**:
1. Revert the 4 modified files:
   - `AppliedJobs.tsx`
   - `Dashboard.tsx`
   - `Feedback.tsx`
   - `InterviewTaskPanel.tsx`
2. No backend/database changes to rollback
3. No data loss risk

---

## Questions to Answer During Testing

1. ✅ Do all candidate pages load without errors?
2. ✅ Are API calls using integer `backend_candidate_id`?
3. ✅ Is data displaying correctly?
4. ✅ Are empty states showing appropriately when no data?
5. ✅ Are there any console errors?
6. ✅ Are network requests successful (200 OK)?
