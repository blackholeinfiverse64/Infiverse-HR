# Endpoint Gap Analysis: Interviews & Tasks Page

## Frontend Requirements vs Backend Availability

### ✅ **Working Endpoints**

| Frontend Call | Backend Endpoint | Status | Notes |
|--------------|------------------|--------|-------|
| `GET /v1/interviews?candidate_id={id}` | `GET /v1/interviews` | ✅ **EXISTS** | Works correctly, supports `candidate_id` query param |

### ❌ **Missing Endpoints**

| Frontend Call | Backend Endpoint | Status | Impact |
|--------------|------------------|--------|--------|
| `GET /v1/tasks?candidate_id={id}` | `GET /v1/tasks` | ❌ **MISSING** | Tasks tab shows empty (handled gracefully) |
| `PUT /v1/tasks/{taskId}/submit` | `PUT /v1/tasks/{id}/submit` | ❌ **MISSING** | Task submission feature not functional |

---

## Current Behavior

### Interviews Tab ✅
- **Status:** Working correctly
- **Endpoint:** `GET /v1/interviews?candidate_id=697dc3980bd5abf897e5105c`
- **Response:** Returns interviews array (or empty if none)
- **UI:** Displays interviews correctly or shows "No interviews scheduled"

### Tasks Tab ⚠️
- **Status:** Partially working (UI works, backend missing)
- **Endpoint:** `GET /v1/tasks?candidate_id=697dc3980bd5abf897e5105c`
- **Response:** 404 Not Found (expected, handled gracefully)
- **UI:** Shows "No tasks assigned" (correct empty state)
- **Console:** Shows warning "Tasks endpoint not available on backend" (expected)

---

## Frontend Code Analysis

### What Frontend Expects:

**1. Get Tasks:**
```typescript
// frontend/src/services/api.ts
export const getTasks = async (candidateId: string): Promise<Task[]> => {
  const response = await api.get(`/v1/tasks?candidate_id=${candidateId}`)
  return response.data.tasks || response.data || []
}
```

**Expected Response Format:**
```json
{
  "tasks": [
    {
      "id": "string",
      "candidate_id": "string",
      "job_id": "string",
      "job_title": "string",
      "title": "string",
      "description": "string",
      "deadline": "ISO date string",
      "status": "pending" | "in_progress" | "submitted" | "reviewed",
      "submission_url": "string (optional)"
    }
  ]
}
```

**2. Submit Task:**
```typescript
// frontend/src/services/api.ts
export const submitTask = async (taskId: string, submissionUrl: string) => {
  const response = await api.put(`/v1/tasks/${taskId}/submit`, { 
    submission_url: submissionUrl 
  })
  return response.data
}
```

**Expected Request:**
```json
PUT /v1/tasks/{taskId}/submit
{
  "submission_url": "https://github.com/..."
}
```

---

## Backend Implementation Needed

### Required Endpoints:

#### 1. `GET /v1/tasks` (Get Tasks)
```python
@app.get("/v1/tasks", tags=["Assessment & Workflow"])
async def get_tasks(candidate_id: Optional[str] = None, auth = Depends(get_auth)):
    """Get All Tasks (supports filtering by candidate_id)"""
    # Similar to get_interviews implementation
    # Query MongoDB tasks collection
    # Filter by candidate_id if provided
    # Return tasks array
```

#### 2. `PUT /v1/tasks/{task_id}/submit` (Submit Task)
```python
@app.put("/v1/tasks/{task_id}/submit", tags=["Assessment & Workflow"])
async def submit_task(task_id: str, submission_data: TaskSubmission, auth = Depends(get_auth)):
    """Submit Task Completion"""
    # Update task status to "submitted"
    # Store submission_url
    # Return updated task
```

---

## MongoDB Collection Needed

If tasks feature is to be implemented, you'll need:

**Collection:** `tasks`

**Schema:**
```javascript
{
  "_id": ObjectId,
  "candidate_id": "string (ObjectId)",
  "job_id": "string (ObjectId)",
  "title": "string",
  "description": "string",
  "deadline": ISODate,
  "status": "pending" | "in_progress" | "submitted" | "reviewed",
  "submission_url": "string (optional)",
  "created_at": ISODate,
  "updated_at": ISODate
}
```

---

## Options

### Option 1: Implement Tasks Endpoints (Recommended if feature is needed)
- Add `GET /v1/tasks` endpoint
- Add `PUT /v1/tasks/{id}/submit` endpoint
- Create/use `tasks` collection in MongoDB
- Full functionality for tasks feature

### Option 2: Suppress Console Warnings (Quick fix)
- Update frontend to only log warnings in development mode
- Keep graceful handling of 404
- Tasks feature remains non-functional but UI doesn't show errors

### Option 3: Hide Tasks Tab (If feature not needed)
- Conditionally hide Tasks tab if endpoint doesn't exist
- Only show Interviews tab
- Cleaner UI if tasks feature isn't planned

---

## Recommendation

**For Now:**
- ✅ Keep current implementation (graceful 404 handling)
- ✅ Suppress console warnings in production
- ✅ Document that tasks feature requires backend implementation

**If Tasks Feature is Needed:**
- Implement the two missing endpoints
- Create tasks collection in MongoDB
- Test with frontend

---

## Current Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| **Interviews** | ✅ Working | Endpoint exists, data loads correctly |
| **Tasks (Get)** | ⚠️ Missing | 404 handled gracefully, shows empty state |
| **Tasks (Submit)** | ⚠️ Missing | Feature not functional, but UI doesn't break |
| **Frontend Error Handling** | ✅ Good | Gracefully handles missing endpoints |
| **User Experience** | ✅ Acceptable | Shows appropriate empty states |

**Conclusion:** The application works correctly. The 404 for tasks is expected and handled properly. The tasks feature simply needs backend implementation if it's required.

