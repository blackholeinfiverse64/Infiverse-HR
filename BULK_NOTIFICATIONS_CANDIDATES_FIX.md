# Fix for Bulk Notifications Not Showing Candidates

## Problem
The recruiter dashboard shows counts for shortlisted and interview scheduled candidates, but when selecting those notification types in bulk notifications, it shows "No candidates found" even with or without job selection.

## Root Cause Analysis

### Dashboard Stats Counting
The dashboard `/v1/recruiter/stats` endpoint counts:
```python
shortlisted = await db.job_applications.count_documents({
    "job_id": {"$in": job_ids},
    "status": "shortlisted"
})
```
- Counts records in **`job_applications`** collection
- Filters by `status` field in **`job_applications`** table

### Bulk Notifications Querying (BEFORE FIX)
The `/v1/candidates` endpoint was:
```python
# Filters in candidates collection
query_filter["status"] = "shortlisted"
```
- Queries **`candidates`** collection  
- Filters by `status` field in **`candidates`** table

### The Issue
These are **two different collections** with potentially different status values:
- `job_applications.status` = Application-level status (shortlisted for THIS job)
- `candidates.status` = Candidate-level status (may not be synced)

Result: Dashboard shows 10 shortlisted candidates (from job_applications), but bulk notifications shows 0 (from candidates with no matching status).

---

## Solution Implemented

### Backend Changes (main.py)

#### 1. Added `job_id` Parameter Support
```python
@app.get("/v1/candidates", tags=["Candidate Management"])
async def get_all_candidates(
    # ... existing params ...
    job_id: Optional[str] = None,  # NEW: Filter by specific job
    # ...
)
```

#### 2. Fixed Status Filtering Logic
When `job_id`, `recruiter_id`, or `client_id` is provided, the status filter now applies to **`job_applications`** collection instead of `candidates`:

**Before (WRONG):**
```python
# Always filtered candidates collection
if status:
    query_filter["status"] = status  # Filters candidates.status ❌
```

**After (CORRECT):**
```python
# Track if we're filtering by job context
use_application_status = False

if job_id or recruiter_id or client_id:
    use_application_status = True
    
    # Build application query with status filtering
    app_query = {
        "job_id": job_id,  # or job_ids for recruiter/client
        "status": status   # Filters job_applications.status ✅
    }
    
    # Get candidate_ids from job_applications matching the status
    pipeline = [
        {"$match": app_query},
        {"$group": {"_id": "$candidate_id"}}
    ]
    # ... then fetch candidates by these IDs
```

### Key Changes Made:

1. **job_id Parameter Added** (Lines 1029-1030)
   - New optional parameter to filter candidates by specific job

2. **Status Filtering Fixed** (Lines 1053-1217)
   - When filtering by job_id/recruiter_id/client_id:
     - Status filter applied to `job_applications.status`
     - Get matching candidate_ids from job_applications
     - Then fetch candidate details from candidates collection
   - When NOT filtering by job context:
     - Status filter applied to `candidates.status` (legacy behavior)

3. **Three Priority Levels:**
   - **Priority 1:** job_id (specific job filtering)
   - **Priority 2:** recruiter_id (all recruiter's jobs)
   - **Priority 3:** client_id (all client's jobs)

---

## Testing Instructions

### Prerequisites
Backend services must be restarted after these changes:
```bash
cd backend
# Stop existing services
# Restart gateway service
python -m services.gateway.app.main
```

### Test Cases

#### Test 1: Verify Dashboard Shows Counts
1. Log in as recruiter
2. Navigate to Recruiter Dashboard
3. Check "Shortlisted" count (e.g., shows 5 candidates)
4. Check "Interviewed" count (e.g., shows 3 candidates)
5. **Note these numbers**

#### Test 2: Bulk Notifications - Shortlisted (No Job Filter)
1. Navigate to Batch Operations → Bulk Notifications tab
2. Select notification type: "🎯 Shortlisted (Passed Screening)"
3. Leave job dropdown as "Select Job Title" (no job selected)
4. **Expected:** Candidates list should show same count as dashboard's shortlisted count
5. **Verify:** Each candidate should have status badge showing "shortlisted"

#### Test 3: Bulk Notifications - Shortlisted (With Job Filter)
1. Stay in Bulk Notifications
2. Keep notification type: "Shortlisted"
3. Select a specific job from dropdown (e.g., "Software Engineer – Job ID job_123")
4. **Expected:** List filters to show only shortlisted candidates for THAT job
5. **Verify:** Count should be ≤ total shortlisted count (subset)

#### Test 4: Bulk Notifications - Interview Scheduled
1. Select notification type: "📅 Interview Scheduled"
2. Leave job as "Select Job Title"
3. **Expected:** Shows candidates with upcoming interviews (matches dashboard count)

#### Test 5: Bulk Notifications - Interview Scheduled (With Job)
1. Keep notification type: "Interview Scheduled"
2. Select a specific job
3. **Expected:** Shows only interview scheduled candidates for that job

#### Test 6: Bulk Notifications - Application Received
1. Select notification type: "✉️ Application Received"
2. **Expected:** Shows recent applicants from last 7 days + never-applied candidates

#### Test 7: Job Selection Changes
1. Select notification type: "Shortlisted"
2. Select Job A → note candidate count (e.g., 3 candidates)
3. Switch to Job B → verify count updates (e.g., 2 candidates)
4. Clear job selection → verify shows all shortlisted (e.g., 5 candidates)

---

## Verification API Calls

### Check Job Applications Status Distribution
```bash
# MongoDB query to see status counts in job_applications
db.job_applications.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])
```

Expected output:
```json
[
  { "_id": "shortlisted", "count": 5 },
  { "_id": "pending", "count": 15 },
  { "_id": "interview_scheduled", "count": 3 },
  { "_id": "rejected", "count": 2 }
]
```

### Check Candidates Status Distribution
```bash
# MongoDB query to see status counts in candidates
db.candidates.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])
```

These counts may differ (which was the problem).

### Test API Directly

**Before Fix (Would return 0):**
```bash
curl "http://localhost:8000/v1/candidates?recruiter_id=rec_123&status=shortlisted"
# Returns: { "candidates": [], "total": 0 }  ❌
```

**After Fix (Returns correct candidates):**
```bash
curl "http://localhost:8000/v1/candidates?recruiter_id=rec_123&status=shortlisted"
# Returns: { "candidates": [...], "total": 5 }  ✅
```

**Test job_id filtering:**
```bash
curl "http://localhost:8000/v1/candidates?job_id=job_123&status=shortlisted"
# Returns: { "candidates": [...], "total": 3 }  ✅
```

---

## Expected Behavior After Fix

| Scenario | Status Filter Applied To | Result |
|----------|-------------------------|---------|
| No filters | `candidates.status` | All candidates (legacy) |
| With `job_id` | `job_applications.status` | Candidates for that job with status |
| With `recruiter_id` | `job_applications.status` | Candidates for recruiter's jobs with status |
| With `client_id` | `job_applications.status` | Candidates for client's jobs with status |
| With `job_id` + status="shortlisted" | `job_applications.status="shortlisted"` | Only shortlisted for THAT job |

---

## Files Modified

### Backend
**File:** `backend/services/gateway/app/main.py`

**Changes:**
1. Line 1029: Added `job_id: Optional[str] = None` parameter
2. Lines 1053-1095: Added job_id filtering with status on job_applications
3. Lines 1097-1148: Updated recruiter_id filtering to use job_applications.status
4. Lines 1150-1217: Updated client_id filtering to use job_applications.status
5. Lines 1219-1237: Updated status filtering logic with `use_application_status` flag

**Total Lines Changed:** ~200 lines modified/added

### Frontend
**File:** `frontend/src/services/api.ts` (Already updated in previous changes)
- Added `job_id?: string` to `CandidateFilters` interface ✅
- Updated `getAllCandidates()` to pass job_id parameter ✅

**File:** `frontend/src/pages/recruiter/BatchOperations.tsx` (Already updated in previous changes)
- Updated `getFiltersForNotificationType()` to include job_id filter ✅
- Added useEffect to reload on job selection change ✅

---

## Troubleshooting

### Issue: Still showing "No candidates found"

**Check 1: Backend restarted?**
```bash
# Restart backend gateway service
cd backend
python -m services.gateway.app.main
```

**Check 2: Database has job_applications with status?**
```javascript
// MongoDB query
db.job_applications.find({ status: "shortlisted" }).limit(5)
```
If this returns empty, candidates need to be properly shortlisted first.

**Check 3: Recruiter ID correct?**
Check browser console for API calls:
```javascript
// Should see:
GET /v1/candidates?recruiter_id=<your_id>&status=shortlisted&limit=100
```

**Check 4: Check API response directly**
Open browser DevTools Network tab, find the API call, check response:
```json
{
  "candidates": [],  // If empty, issue is in backend
  "total": 0
}
```

### Issue: Dashboard shows 10, bulk notifications shows 5

This is expected if:
- Dashboard counts all job_applications with status="shortlisted" (10 applications)
- But some of those are duplicate candidates (same person applied to multiple jobs)
- Bulk notifications shows unique candidates (5 unique people)

This is correct behavior - you don't want to send duplicate notifications to the same person.

---

## Summary

✅ **Fixed:** Status filtering now uses `job_applications` collection when filtering by job context  
✅ **Added:** `job_id` parameter support for specific job filtering  
✅ **Result:** Bulk notifications now shows the same candidates that dashboard counts  
✅ **Bonus:** Job-based filtering now works correctly (wasn't working before)

The core issue was a **data source mismatch**:
- Dashboard counted from `job_applications` table
- Bulk notifications queried from `candidates` table
- Now both use `job_applications` for status filtering ✅
