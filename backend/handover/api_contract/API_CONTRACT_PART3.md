# API Contract — Part 3: Gateway Advanced Features

**Continued from:** [API_CONTRACT_PART2.md](./API_CONTRACT_PART2.md)

**Version:** 4.0.0  
**Last Updated:** January 22, 2026  
**Total Endpoints:** 114 (83 Gateway + 6 Agent + 25 LangGraph)  
**Database:** MongoDB Atlas

---

## Gateway AI Matching Engine

### 36. GET /v1/match/{job_id}/top

**Purpose:** AI-powered semantic candidate matching via Agent Service

**Authentication:** Bearer token required

**Request:**
```http
GET /v1/match/123/top?limit=10
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "matches": [
    {
      "candidate_id": 45,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "score": 92.5,
      "skills_match": "Python, FastAPI, PostgreSQL",
      "experience_match": "5y - Phase 3 matched",
      "location_match": true,
      "reasoning": "Semantic match: 0.95; Skills: Python, FastAPI, PostgreSQL; Experience: 5y; Location: San Francisco",
      "recommendation_strength": "Strong Match"
    }
  ],
  "top_candidates": [],
  "job_id": 123,
  "limit": 10,
  "total_candidates": 50,
  "algorithm_version": "3.0.0-phase3-production",
  "processing_time": "0.45s",
  "ai_analysis": "Real AI semantic matching via Agent Service",
  "agent_status": "connected"
}
```

**Sequence:**
1. Gateway calls Agent Service POST /match
2. Agent performs Phase 3 semantic matching
3. Results transformed to Gateway format
4. Fallback to database matching if Agent unavailable

**Error Responses:**
- 400 Bad Request: Invalid job_id or limit
- 404 Not Found: Job not found
- 503 Service Unavailable: Agent service down (fallback activated)

**When Called:** HR views top candidates for job

**Implemented In:** `services/gateway/app/main.py` → `get_top_matches()`

**Database Impact:** SELECT from candidates, jobs tables

---

### 37. POST /v1/match/batch

**Purpose:** Batch AI matching for multiple jobs

**Authentication:** Bearer token required

**Request:**
```http
POST /v1/match/batch
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "job_ids": [123, 124, 125]
}
```

**Response (200 OK):**
```json
{
  "batch_results": {
    "123": {
      "job_id": 123,
      "matches": [
        {
          "candidate_id": 45,
          "name": "John Doe",
          "email": "john.doe@example.com",
          "score": 92.5,
          "skills_match": "Python, FastAPI",
          "experience_match": "5y - Phase 3 matched",
          "location_match": true,
          "reasoning": "Skills: Python, FastAPI; Experience: 5y; Phase 3 AI semantic analysis",
          "recommendation_strength": "Strong Match"
        }
      ],
      "top_candidates": [],
      "total_candidates": 5,
      "algorithm": "phase3-ai",
      "processing_time": "0.5s",
      "ai_analysis": "Real AI semantic matching via Agent Service"
    }
  },
  "total_jobs_processed": 3,
  "total_candidates_analyzed": 50,
  "algorithm_version": "3.0.0-phase3-production-batch",
  "status": "success",
  "agent_status": "connected"
}
```

**Error Responses:**
- 400 Bad Request: Empty job_ids or > 10 jobs
- 404 Not Found: Jobs not found
- 503 Service Unavailable: Agent service down (fallback activated)

**When Called:** HR compares candidates across multiple jobs

**Implemented In:** `services/gateway/app/main.py` → `batch_match_jobs()`

**Database Impact:** SELECT from candidates, jobs tables

---

## Gateway Assessment & Workflow

### 38. POST /v1/feedback

**Purpose:** Submit values assessment feedback for candidate

**Authentication:** Bearer token required

**Request:**
```http
POST /v1/feedback
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "candidate_id": 123,
  "job_id": 45,
  "integrity": 5,
  "honesty": 5,
  "discipline": 4,
  "hard_work": 5,
  "gratitude": 4,
  "comments": "Excellent candidate with strong values alignment"
}
```

**Response (200 OK):**
```json
{
  "message": "Feedback submitted successfully",
  "feedback_id": 789,
  "candidate_id": 123,
  "job_id": 45,
  "values_scores": {
    "integrity": 5,
    "honesty": 5,
    "discipline": 4,
    "hard_work": 5,
    "gratitude": 4
  },
  "average_score": 4.6,
  "submitted_at": "2026-01-22T13:37:00Z"
}
```

**Error Responses:**
- 400 Bad Request: Invalid score values (must be 1-5)
- 404 Not Found: Candidate or job not found

**When Called:** HR submits post-interview feedback

**Implemented In:** `services/gateway/app/main.py` → `submit_feedback()`

**Database Impact:** INSERT into feedback table

---

### 39. GET /v1/feedback

**Purpose:** Get all feedback records with candidate/job details

**Authentication:** Bearer token required

**Request:**
```http
GET /v1/feedback
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "feedback": [
    {
      "id": 789,
      "candidate_id": 123,
      "job_id": 45,
      "values_scores": {
        "integrity": 5,
        "honesty": 5,
        "discipline": 4,
        "hard_work": 5,
        "gratitude": 4
      },
      "average_score": 4.6,
      "comments": "Excellent candidate with strong values alignment",
      "created_at": "2024-12-09T13:37:00Z",
      "candidate_name": "John Doe",
      "job_title": "Senior Software Engineer"
    }
  ],
  "count": 1
}
```

**When Called:** HR reviews feedback history

**Implemented In:** `services/gateway/app/main.py` → `get_all_feedback()`

**Database Impact:** SELECT from feedback, candidates, jobs tables with JOIN

---

### 40. GET /v1/interviews

**Purpose:** Get all scheduled interviews

**Authentication:** Bearer token required

**Request:**
```http
GET /v1/interviews
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "interviews": [
    {
      "id": 456,
      "candidate_id": 123,
      "job_id": 45,
      "interview_date": "2026-01-29T14:00:00Z",
      "interviewer": "Sarah Johnson",
      "status": "scheduled",
      "candidate_name": "John Doe",
      "job_title": "Senior Software Engineer"
    }
  ],
  "count": 1
}
```

**When Called:** HR views interview schedule

**Implemented In:** `services/gateway/app/main.py` → `get_interviews()`

**Database Impact:** SELECT from interviews, candidates, jobs tables with JOIN

---

### 41. POST /v1/interviews

**Purpose:** Schedule new interview

**Authentication:** Bearer token required

**Request:**
```http
POST /v1/interviews
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "candidate_id": 123,
  "job_id": 45,
  "interview_date": "2024-12-15T14:00:00Z",
  "interviewer": "Sarah Johnson",
  "notes": "Technical interview - focus on system design"
}
```

**Response (200 OK):**
```json
{
  "message": "Interview scheduled successfully",
  "interview_id": 456,
  "candidate_id": 123,
  "job_id": 45,
  "interview_date": "2024-12-15T14:00:00Z",
  "status": "scheduled"
}
```

**Sequence:**
1. Validate candidate and job exist
2. Insert into interviews table with status='scheduled'
3. Trigger interview.scheduled webhook
4. Send notification to candidate

**Error Responses:**
- 400 Bad Request: Invalid date format
- 404 Not Found: Candidate or job not found
- 500 Internal Server Error: Database error

**When Called:** HR schedules interview

**Implemented In:** `services/gateway/app/main.py` → `schedule_interview()`

**Database Impact:** INSERT into interviews table

---

### 42. POST /v1/offers

**Purpose:** Create job offer for candidate

**Authentication:** Bearer token required

**Request:**
```http
POST /v1/offers
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "candidate_id": 123,
  "job_id": 45,
  "salary": 150000.00,
  "start_date": "2025-01-15",
  "terms": "Full-time, remote, benefits included"
}
```

**Response (200 OK):**
```json
{
  "message": "Job offer created successfully",
  "offer_id": 999,
  "candidate_id": 123,
  "job_id": 45,
  "salary": 150000.00,
  "start_date": "2025-01-15",
  "terms": "Full-time, remote, benefits included",
  "status": "pending",
  "created_at": "2026-01-22T13:37:00Z"
}
```

**Error Responses:**
- 400 Bad Request: Invalid salary or date
- 404 Not Found: Candidate or job not found

**When Called:** HR extends job offer

**Implemented In:** `services/gateway/app/main.py` → `create_job_offer()`

**Database Impact:** INSERT into offers table

---

### 43. GET /v1/offers

**Purpose:** Get all job offers

**Authentication:** Bearer token required

**Request:**
```http
GET /v1/offers
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "offers": [
    {
      "id": 999,
      "candidate_id": 123,
      "job_id": 45,
      "salary": 150000.00,
      "start_date": "2025-01-15",
      "terms": "Full-time, remote, benefits included",
      "status": "pending",
      "created_at": "2024-12-09T13:37:00Z",
      "candidate_name": "John Doe",
      "job_title": "Senior Software Engineer"
    }
  ],
  "count": 1
}
```

**When Called:** HR reviews offer status

**Implemented In:** `services/gateway/app/main.py` → `get_all_offers()`

**Database Impact:** SELECT from offers, candidates, jobs tables with JOIN

---

## Gateway Client Portal API

### 44. POST /v1/client/register

**Purpose:** Register new client company

**Authentication:** None (public registration)

**Request:**
```http
POST /v1/client/register
Content-Type: application/json

{
  "client_id": "TECH001",
  "company_name": "Tech Innovations Inc",
  "contact_email": "hr@techinnovations.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Client registration successful",
  "client_id": "TECH001",
  "company_name": "Tech Innovations Inc"
}
```

**Sequence:**
1. Check client_id uniqueness
2. Check email uniqueness
3. Hash password with bcrypt
4. Insert into clients table with status='active'
5. Return success confirmation

**Error Responses:**
- 409 Conflict: Client ID or email already exists
- 400 Bad Request: Invalid input data

**When Called:** New client signs up

**Implemented In:** `services/gateway/app/main.py` → `client_register()`

**Database Impact:** INSERT into clients table

---

### 45. POST /v1/client/login

**Purpose:** Client authentication with JWT token generation

**Authentication:** None (public login)

**Request:**
```http
POST /v1/client/login
Content-Type: application/json

{
  "client_id": "TECH001",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Authentication successful",
  "client_id": "TECH001",
  "company_name": "Tech Innovations Inc",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 86400,
  "permissions": [
    "view_jobs",
    "create_jobs",
    "view_candidates",
    "schedule_interviews"
  ]
}
```

**Sequence:**
1. Lookup client by client_id
2. Check account status (active/locked)
3. Verify password with bcrypt
4. Generate JWT token (HS256, 24h expiry)
5. Reset failed login attempts
6. Return token and permissions

**Error Responses:**
- 401 Unauthorized: Invalid credentials
- 403 Forbidden: Account locked (5 failed attempts)
- 404 Not Found: Client not found

**When Called:** Client logs into portal

**Implemented In:** `services/gateway/app/main.py` → `client_login()`

**Database Impact:** SELECT from clients table, UPDATE failed_login_attempts

---

## Summary Table - Part 3

| Endpoint | Method | Category | Purpose | Auth Required |
|----------|--------|----------|---------|---------------|
| /v1/match/{job_id}/top | GET | AI Matching | Get top matches | Yes |
| /v1/match/batch | POST | AI Matching | Batch matching | Yes |
| /v1/feedback | POST | Assessment | Submit feedback | Yes |
| /v1/feedback | GET | Assessment | Get feedback | Yes |
| /v1/interviews | GET | Workflow | List interviews | Yes |
| /v1/interviews | POST | Workflow | Schedule interview | Yes |
| /v1/offers | POST | Workflow | Create offer | Yes |
| /v1/offers | GET | Workflow | List offers | Yes |
| /v1/client/register | POST | Client Portal | Register client | No |
| /v1/client/login | POST | Client Portal | Client login | No |

**Total Endpoints in Part 3:** 10 (Cumulative: 48 of 111)

---

**Continue to:** [API_CONTRACT_PART4.md](./API_CONTRACT_PART4.md) for Gateway Security & Portals
