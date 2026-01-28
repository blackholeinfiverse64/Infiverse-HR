# API Contract — Part 2: Gateway Core Features

**Continued from:** [API_CONTRACT_PART1.md](./API_CONTRACT_PART1.md)

**Version:** 4.0.0  
**Last Updated:** January 22, 2026  
**Total Endpoints:** 114 (83 Gateway + 6 Agent + 25 LangGraph)  
**Database:** MongoDB Atlas

---

## Gateway Monitoring

### 18. GET /metrics

**Purpose:** Export Prometheus metrics for monitoring

**Authentication:** None (public monitoring endpoint)

**Request:**
```http
GET /metrics
```

**Response (200 OK):**
```text
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",endpoint="/health"} 1234
http_requests_total{method="POST",endpoint="/v1/jobs"} 567

# HELP http_request_duration_seconds HTTP request duration
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.1"} 890
http_request_duration_seconds_bucket{le="0.5"} 1150
http_request_duration_seconds_sum 234.5
http_request_duration_seconds_count 1234

# HELP active_connections Active database connections
# TYPE active_connections gauge
active_connections 8
```

**When Called:** Prometheus scrapes metrics every 15s

**Implemented In:** `services/gateway/app/main.py` → `get_prometheus_metrics()`

---

### 19. GET /health/detailed

**Purpose:** Detailed health check with system metrics

**Authentication:** None (public health endpoint)

**Request:**
```http
GET /health/detailed
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "BHIV HR Gateway",
  "version": "4.2.0",
  "timestamp": "2026-01-22T13:37:00Z",
  "uptime_seconds": 86400,
  "database": {
    "status": "connected",
    "pool_size": 10,
    "active_connections": 3,
    "idle_connections": 7
  },
  "dependencies": {
    "agent_service": "healthy",
    "langgraph_service": "healthy",
    "mongodb": "healthy"
  },
  "system": {
    "cpu_usage": 25.5,
    "memory_usage": 512,
    "disk_usage": 45.2
  }
}
```

**When Called:** Load balancer health checks, monitoring dashboard

**Implemented In:** `services/gateway/app/main.py` → `detailed_health_check()`

---

### 20. GET /metrics/dashboard

**Purpose:** Metrics dashboard data for admin UI

**Authentication:** Bearer token required

**Request:**
```http
GET /metrics/dashboard
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "performance_summary": {
    "avg_response_time_ms": 45.2,
    "p95_response_time_ms": 120.5,
    "p99_response_time_ms": 250.0,
    "requests_per_minute": 150,
    "error_rate": 0.02
  },
  "business_metrics": {
    "total_candidates": 1234,
    "active_jobs": 45,
    "applications_today": 67,
    "interviews_scheduled": 23
  },
  "system_metrics": {
    "cpu_usage": 25.5,
    "memory_mb": 512,
    "disk_usage_percent": 45.2,
    "active_connections": 8
  },
  "generated_at": "2024-12-09T13:37:00Z"
}
```

**When Called:** Admin dashboard loads metrics

**Implemented In:** `services/gateway/app/main.py` → `metrics_dashboard()`

---

## Gateway Core API

### 21. GET /openapi.json

**Purpose:** OpenAPI schema for API documentation

**Authentication:** None (public documentation)

**Request:**
```http
GET /openapi.json
```

**Response (200 OK):**
```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "BHIV HR Platform API Gateway",
    "version": "4.2.0",
    "description": "Enterprise HR Platform with Advanced Security Features"
  },
  "paths": {
    "/health": {
      "get": {
        "summary": "Health Check",
        "responses": {
          "200": {
            "description": "Successful Response"
          }
        }
      }
    }
  }
}
```

**When Called:** API documentation tools, client SDK generation

**Implemented In:** `services/gateway/app/main.py` → `get_openapi()`

---

### 22. GET /docs

**Purpose:** Interactive API documentation (Swagger UI)

**Authentication:** None (public documentation)

**Request:**
```http
GET /docs
```

**Response (200 OK):**
```html
<!DOCTYPE html>
<html>
<head>
  <title>BHIV HR Platform API</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
</body>
</html>
```

**When Called:** Developers access API documentation

**Implemented In:** `services/gateway/app/main.py` → `get_docs()`

---

### 23. GET /

**Purpose:** API root information and service status

**Authentication:** None (public endpoint)

**Request:**
```http
GET /
```

**Response (200 OK):**
```json
{
  "message": "BHIV HR Platform API Gateway",
  "version": "4.2.0",
  "status": "healthy",
  "endpoints": 77,
  "documentation": "/docs",
  "monitoring": "/metrics",
  "production_url": "https://bhiv-hr-gateway-ltg0.onrender.com",
  "langgraph_integration": "active",
  "ai_workflows": [
    "candidate_applied",
    "shortlisted",
    "interview_scheduled"
  ]
}
```

**When Called:** Service discovery, health check

**Implemented In:** `services/gateway/app/main.py` → `read_root()`

---

### 24. GET /health

**Purpose:** Basic health check endpoint

**Authentication:** None (public health endpoint)

**Request:**
```http
GET /health
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "BHIV HR Gateway",
  "version": "4.2.0",
  "timestamp": "2026-01-22T13:37:00Z"
}
```

**Response Headers:**
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

**When Called:** Load balancer health checks, monitoring systems

**Implemented In:** `services/gateway/app/main.py` → `health_check()`

---

### 25. GET /v1/test-candidates

**Purpose:** Test database connectivity with candidate count

**Authentication:** Bearer token required

**Request:**
```http
GET /v1/test-candidates
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "database_status": "connected",
  "total_candidates": 1234,
  "test_timestamp": "2026-01-22T13:37:00Z"
}
```

**Error Responses:**
- 500 Internal Server Error: Database connection failed

**When Called:** System diagnostics, deployment verification

**Implemented In:** `services/gateway/app/main.py` → `test_candidates_db()`

---

## Gateway Job Management

### 26. POST /v1/jobs

**Purpose:** Create new job posting

**Authentication:** Bearer token required

**Request:**
```http
POST /v1/jobs
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "title": "Senior Software Engineer",
  "department": "Engineering",
  "location": "Remote",
  "experience_level": "senior",
  "requirements": "5+ years Python, FastAPI, PostgreSQL",
  "description": "Join our team to build scalable HR solutions",
  "employment_type": "Full-time"
}
```

**Response (201 Created):**
```json
{
  "message": "Job created successfully",
  "job_id": 123,
  "created_at": "2024-12-09T13:37:00Z"
}
```

**Sequence:**
1. Validate required fields (title, department, location, experience_level)
2. Insert into jobs table with status='active'
3. Return job_id
4. Trigger job.created event for notifications

**Error Responses:**
- 400 Bad Request: Missing required fields
- 422 Unprocessable Entity: Invalid experience_level

**When Called:** Client creates job posting in portal

**Implemented In:** `services/gateway/app/main.py` → `create_job()`

**Database Impact:** INSERT into jobs table

---

### 27. GET /v1/jobs

**Purpose:** List all active job postings

**Authentication:** Bearer token required (API key or JWT)

**Request:**
```http
GET /v1/jobs
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "jobs": [
    {
      "id": 123,
      "title": "Senior Software Engineer",
      "department": "Engineering",
      "location": "Remote",
      "experience_level": "senior",
      "requirements": "5+ years Python, FastAPI, PostgreSQL",
      "description": "Join our team to build scalable HR solutions",
      "created_at": "2024-12-09T13:37:00Z"
    },
    {
      "id": 124,
      "title": "Product Manager",
      "department": "Product",
      "location": "San Francisco",
      "experience_level": "mid",
      "requirements": "3+ years product management",
      "description": "Lead product strategy for HR platform",
      "created_at": "2026-01-21T10:00:00Z"
    }
  ],
  "count": 2
}
```

**Error Responses:**
- 401 Unauthorized: Invalid authentication

**When Called:** Dashboard loads job list, candidate browses jobs

**Implemented In:** `services/gateway/app/main.py` → `list_jobs()`

**Database Impact:** SELECT from jobs table WHERE status='active'

---

## Gateway Candidate Management

### 28. GET /v1/candidates

**Purpose:** Get all candidates with pagination

**Authentication:** Bearer token required

**Request:**
```http
GET /v1/candidates?limit=50&offset=0
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "candidates": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "location": "San Francisco, CA",
      "experience_years": 5,
      "technical_skills": "Python, FastAPI, PostgreSQL, Docker",
      "seniority_level": "Senior",
      "education_level": "Bachelor",
      "created_at": "2024-12-09T13:37:00Z"
    }
  ],
  "total": 1234,
  "limit": 50,
  "offset": 0,
  "count": 1
}
```

**Error Responses:**
- 401 Unauthorized: Invalid API key

**When Called:** HR dashboard loads candidate list

**Implemented In:** `services/gateway/app/main.py` → `get_all_candidates()`

**Database Impact:** SELECT from candidates table with LIMIT/OFFSET

---

### 29. GET /v1/candidates/stats

**Purpose:** Get dynamic candidate statistics for dashboard

**Authentication:** Bearer token required

**Request:**
```http
GET /v1/candidates/stats
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "total_candidates": 1234,
  "active_jobs": 45,
  "recent_matches": 89,
  "pending_interviews": 23,
  "new_candidates_this_week": 67,
  "total_feedback_submissions": 456,
  "statistics_generated_at": "2026-01-22T13:37:00Z",
  "data_source": "real_time_database",
  "dashboard_ready": true
}
```

**Error Responses:**
- 401 Unauthorized: Invalid API key

**When Called:** Dashboard loads analytics panel

**Implemented In:** `services/gateway/app/main.py` → `get_candidate_stats()`

**Database Impact:** Multiple COUNT queries on candidates, jobs, matching_cache, interviews, feedback tables

---

### 30. GET /v1/candidates/search

**Purpose:** Search and filter candidates by criteria

**Authentication:** Bearer token required

**Request:**
```http
GET /v1/candidates/search?skills=Python&location=San Francisco&experience_min=3
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "candidates": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "location": "San Francisco, CA",
      "technical_skills": "Python, FastAPI, PostgreSQL",
      "experience_years": 5,
      "seniority_level": "Senior",
      "education_level": "Bachelor",
      "status": "active"
    }
  ],
  "filters": {
    "skills": "Python",
    "location": "San Francisco",
    "experience_min": 3
  },
  "count": 1
}
```

**Input Validation:**
- skills: Max 200 chars, alphanumeric + comma/space only
- location: Max 100 chars, alphanumeric + comma/space only
- experience_min: Non-negative integer

**Error Responses:**
- 400 Bad Request: Invalid filter format
- 401 Unauthorized: Invalid API key

**When Called:** HR searches for candidates matching criteria

**Implemented In:** `services/gateway/app/main.py` → `search_candidates()`

**Database Impact:** SELECT with WHERE clauses using ILIKE for fuzzy matching

---

### 31. GET /v1/candidates/job/{job_id}

**Purpose:** Get candidates for specific job (dynamic matching)

**Authentication:** Bearer token required

**Request:**
```http
GET /v1/candidates/job/123
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "candidates": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "skills": "Python, FastAPI, PostgreSQL",
      "experience": 5
    }
  ],
  "job_id": 123,
  "count": 1
}
```

**Error Responses:**
- 400 Bad Request: Invalid job_id (< 1)
- 404 Not Found: Job not found

**When Called:** HR views candidates for specific job

**Implemented In:** `services/gateway/app/main.py` → `get_candidates_by_job()`

**Database Impact:** SELECT from candidates table (limited to 10)

---

### 32. GET /v1/candidates/{candidate_id}

**Purpose:** Get specific candidate by ID with full details

**Authentication:** Bearer token required

**Request:**
```http
GET /v1/candidates/123
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "candidate": {
    "id": 123,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "location": "San Francisco, CA",
    "experience_years": 5,
    "technical_skills": "Python, FastAPI, PostgreSQL, Docker, Kubernetes",
    "seniority_level": "Senior",
    "education_level": "Bachelor of Science in Computer Science",
    "resume_path": "/resumes/john_doe_resume.pdf",
    "created_at": "2024-12-01T10:00:00Z",
    "updated_at": "2026-01-22T13:37:00Z"
  }
}
```

**Error Responses:**
- 404 Not Found: Candidate not found
- 401 Unauthorized: Invalid API key

**When Called:** HR views candidate profile details

**Implemented In:** `services/gateway/app/main.py` → `get_candidate_by_id()`

**Database Impact:** SELECT from candidates table WHERE id = candidate_id

---

### 33. POST /v1/candidates/bulk

**Purpose:** Bulk upload multiple candidates

**Authentication:** Bearer token required

**Request:**
```http
POST /v1/candidates/bulk
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "candidates": [
    {
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "phone": "+1234567890",
      "location": "New York, NY",
      "experience_years": 3,
      "technical_skills": "JavaScript, React, Node.js",
      "seniority_level": "Mid",
      "education_level": "Bachelor",
      "resume_path": "/resumes/jane_smith.pdf",
      "status": "applied"
    },
    {
      "name": "Bob Johnson",
      "email": "bob.johnson@example.com",
      "phone": "+0987654321",
      "location": "Austin, TX",
      "experience_years": 7,
      "technical_skills": "Java, Spring Boot, Microservices",
      "seniority_level": "Senior",
      "education_level": "Master",
      "resume_path": "/resumes/bob_johnson.pdf",
      "status": "applied"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "message": "Bulk upload completed",
  "candidates_received": 2,
  "candidates_inserted": 2,
  "errors": [],
  "total_errors": 0,
  "status": "success"
}
```

**Validation:**
- Email uniqueness check
- Required field: email
- Experience years: Non-negative integer
- Duplicate emails skipped with error message

**Error Responses:**
- 400 Bad Request: Invalid candidate data
- 409 Conflict: Duplicate emails

**When Called:** HR imports candidates from CSV/Excel

**Implemented In:** `services/gateway/app/main.py` → `bulk_upload_candidates()`

**Database Impact:** Multiple INSERT into candidates table with transaction

---

### 34. GET /v1/candidate/profile/{candidate_id}

**Purpose:** Get detailed candidate profile with extended information

**Authentication:** Bearer token required

**Request:**
```http
GET /v1/candidate/profile/123
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "candidate": {
    "id": 123,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "location": "San Francisco, CA",
    "experience_years": 5,
    "technical_skills": "Python, FastAPI, PostgreSQL, Docker, Kubernetes",
    "seniority_level": "Senior",
    "education_level": "Bachelor of Science in Computer Science",
    "resume_path": "/resumes/john_doe_resume.pdf",
    "average_score": 4.6,
    "status": "active",
    "created_at": "2024-12-01T10:00:00Z",
    "updated_at": "2026-01-22T13:37:00Z",
    "applications": [
      {
        "job_id": 45,
        "job_title": "Senior Software Engineer",
        "application_status": "interviewed",
        "applied_at": "2026-01-15T10:00:00Z"
      }
    ],
    "feedback": [
      {
        "integrity": 5,
        "honesty": 5,
        "discipline": 4,
        "hard_work": 5,
        "gratitude": 4,
        "average_score": 4.6,
        "submitted_at": "2026-01-20T14:30:00Z"
      }
    ]
  }
}
```

**Error Responses:**
- 404 Not Found: Candidate not found
- 401 Unauthorized: Invalid API key

**When Called:** Recruiter views detailed candidate profile

**Implemented In:** `services/gateway/app/main.py` → `get_candidate_profile()`

**Database Impact:** SELECT from candidates, job_applications, feedback tables with JOIN

---

### 35. GET /v1/candidate/stats/{candidate_id}

**Purpose:** Get statistics for specific candidate

**Authentication:** Bearer token required

**Request:**
```http
GET /v1/candidate/stats/123
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "candidate_id": 123,
  "applications_count": 3,
  "interviews_count": 1,
  "offers_count": 1,
  "average_feedback_score": 4.6,
  "highest_matching_score": 92.5,
  "applied_jobs": [
    {
      "job_id": 45,
      "job_title": "Senior Software Engineer",
      "status": "interviewed",
      "applied_at": "2026-01-15T10:00:00Z",
      "matching_score": 92.5
    }
  ],
  "stats_generated_at": "2026-01-22T13:37:00Z"
}
```

**Error Responses:**
- 404 Not Found: Candidate not found
- 401 Unauthorized: Invalid API key

**When Called:** Recruiter analyzes candidate performance

**Implemented In:** `services/gateway/app/main.py` → `get_candidate_stats()`

**Database Impact:** Multiple COUNT queries on job_applications, interviews, offers, feedback tables

---

### 36. GET /v1/recruiter/stats

**Purpose:** Get comprehensive statistics for recruiter dashboard

**Authentication:** Bearer token required

**Request:**
```http
GET /v1/recruiter/stats
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "total_candidates": 1234,
  "total_jobs": 45,
  "active_jobs": 18,
  "applications_today": 23,
  "interviews_scheduled": 12,
  "offers_extended": 5,
  "hires_this_month": 8,
  "average_time_to_hire": "15 days",
  "top_performing_jobs": [
    {
      "job_id": 45,
      "title": "Senior Software Engineer",
      "applications": 67,
      "interviews": 15,
      "offers": 3,
      "hires": 2
    }
  ],
  "recruiter_performance": {
    "applications_reviewed": 156,
    "interviews_conducted": 45,
    "offers_made": 18,
    "conversion_rate": "11.5%"
  },
  "stats_generated_at": "2026-01-22T13:37:00Z"
}
```

**Error Responses:**
- 401 Unauthorized: Invalid API key

**When Called:** Recruiter dashboard loads performance metrics

**Implemented In:** `services/gateway/app/main.py` → `get_recruiter_stats()`

**Database Impact:** Multiple COUNT and aggregate queries across all core tables

---

## Gateway Analytics & Statistics

### 34. GET /v1/database/schema

**Purpose:** Get database schema information and version

**Authentication:** Bearer token required

**Request:**
```http
GET /v1/database/schema
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "schema_version": "4.3.0",
  "applied_at": "2024-12-01T10:00:00Z",
  "total_tables": 18,
  "tables": [
    "candidates",
    "jobs",
    "feedback",
    "interviews",
    "offers",
    "users",
    "clients",
    "matching_cache",
    "audit_logs",
    "rate_limits",
    "csp_violations",
    "company_scoring_preferences",
    "workflows",
    "rl_predictions",
    "rl_feedback",
    "rl_model_performance",
    "rl_training_data",
    "job_applications"
  ],
  "phase3_enabled": true,
  "core_tables": [
    "candidates",
    "jobs",
    "feedback",
    "interviews",
    "offers",
    "users",
    "clients",
    "matching_cache",
    "audit_logs",
    "rate_limits",
    "csp_violations",
    "company_scoring_preferences"
  ],
  "checked_at": "2026-01-22T13:37:00Z"
}
```

**Error Responses:**
- 401 Unauthorized: Invalid API key
- 500 Internal Server Error: Database connection failed

**When Called:** Admin checks database status, deployment verification

**Implemented In:** `services/gateway/app/main.py` → `get_database_schema()`

**Database Impact:** Query information_schema.tables, schema_version table

---

### 35. GET /v1/reports/job/{job_id}/export.csv

**Purpose:** Export job report as CSV

**Authentication:** Bearer token required

**Request:**
```http
GET /v1/reports/job/123/export.csv
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "message": "Job report export",
  "job_id": 123,
  "format": "CSV",
  "download_url": "/downloads/job_123_report.csv",
  "generated_at": "2024-12-09T13:37:00Z"
}
```

**Error Responses:**
- 404 Not Found: Job not found
- 401 Unauthorized: Invalid API key

**When Called:** HR exports job analytics report

**Implemented In:** `services/gateway/app/main.py` → `export_job_report()`

---

## Summary Table - Part 2

| Endpoint | Method | Category | Purpose | Auth Required |
|----------|--------|----------|---------|---------------|
| /metrics | GET | Monitoring | Prometheus metrics | No |
| /health/detailed | GET | Monitoring | Detailed health check | No |
| /metrics/dashboard | GET | Monitoring | Dashboard metrics | Yes |
| /openapi.json | GET | Core API | OpenAPI schema | No |
| /docs | GET | Core API | API documentation | No |
| / | GET | Core API | Service info | No |
| /health | GET | Core API | Basic health check | No |
| /v1/test-candidates | GET | Core API | Test database | Yes |
| /v1/jobs | POST | Job Management | Create job | Yes |
| /v1/jobs | GET | Job Management | List jobs | Yes |
| /v1/candidates | GET | Candidate Mgmt | List candidates | Yes |
| /v1/candidates/stats | GET | Analytics | Get statistics | Yes |
| /v1/candidates/search | GET | Candidate Mgmt | Search candidates | Yes |
| /v1/candidates/job/{job_id} | GET | Candidate Mgmt | Get candidates by job | Yes |
| /v1/candidates/{candidate_id} | GET | Candidate Mgmt | Get candidate details | Yes |
| /v1/candidates/bulk | POST | Candidate Mgmt | Bulk upload | Yes |
| /v1/candidate/profile/{candidate_id} | GET | Candidate Mgmt | Get candidate profile | Yes |
| /v1/candidate/stats/{candidate_id} | GET | Analytics | Get candidate stats | Yes |
| /v1/recruiter/stats | GET | Analytics | Get recruiter stats | Yes |
| /v1/database/schema | GET | Analytics | Get schema info | Yes |
| /v1/reports/job/{job_id}/export.csv | GET | Analytics | Export report | Yes |

**Total Endpoints in Part 2:** 21 (Cumulative: 38 of 111)

---

**Continue to:** [API_CONTRACT_PART3.md](./API_CONTRACT_PART3.md) for Gateway Advanced Features
