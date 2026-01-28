# API Contract — Part 2: Gateway Core Features

**Continued from:** [API_CONTRACT_PART1.md](./API_CONTRACT_PART1.md)

**Version:** 4.1.0  
**Last Updated:** January 22, 2026  
**Total Endpoints:** 111 (80 Gateway + 6 Agent + 25 LangGraph)  
**Database:** MongoDB Atlas  
**Analysis Source:** Comprehensive endpoint analysis from services directories

---

## Gateway Monitoring

### 18. GET /metrics

**Purpose:** Export Prometheus metrics for monitoring

**Authentication:** None (public monitoring endpoint)

**Implementation:** `services/gateway/app/main.py` → `get_prometheus_metrics()`

**Timeout:** 5s

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

---

### 19. GET /health/detailed

**Purpose:** Detailed health check with system metrics

**Authentication:** None (public health endpoint)

**Implementation:** `services/gateway/app/main.py` → `detailed_health_check()`

**Timeout:** 10s

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
    "type": "MongoDB Atlas",
    "active_connections": 3
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

---

### 20. GET /metrics/dashboard

**Purpose:** Metrics dashboard data for admin UI

**Authentication:** None (public)

**Implementation:** `services/gateway/app/main.py` → `metrics_dashboard()`

**Timeout:** 15s

**Request:**
```http
GET /metrics/dashboard
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

---

## Gateway Core API

### 21. GET /openapi.json

**Purpose:** OpenAPI schema for API documentation

**Authentication:** None (public documentation)

**Implementation:** `services/gateway/app/main.py` → `get_openapi()`

**Timeout:** 5s

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

---

### 22. GET /docs

**Purpose:** Interactive API documentation (Swagger UI)

**Authentication:** None (public documentation)

**Implementation:** `services/gateway/app/main.py` → `get_docs()`

**Timeout:** 5s

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

---

### 23. GET /

**Purpose:** API root information and service status

**Authentication:** None (public endpoint)

**Implementation:** `services/gateway/app/main.py` → `read_root()`

**Timeout:** 2s

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
  "endpoints": 80,
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

---

### 24. GET /health

**Purpose:** Basic health check endpoint

**Authentication:** None (public health endpoint)

**Implementation:** `services/gateway/app/main.py` → `health_check()`

**Timeout:** 5s

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

---

### 25. GET /v1/test-candidates

**Purpose:** Test database connectivity with candidate count

**Authentication:** Bearer token required

**Implementation:** `services/gateway/app/main.py` → `test_candidates_db()`

**Timeout:** 10s

**Request:**
```http
GET /v1/test-candidates
Authorization: Bearer <API_KEY_SECRET>
```

**Response (200 OK):**
```json
{
  "database_status": "connected",
  "database_type": "MongoDB Atlas",
  "total_candidates": 1234,
  "test_timestamp": "2026-01-22T13:37:00Z"
}
```

**Error Responses:**
- 500 Internal Server Error: Database connection failed

**When Called:** System diagnostics, deployment verification

---

## Gateway Job Management

### 26. POST /v1/jobs

**Purpose:** Create new job posting

**Authentication:** Bearer token required

**Implementation:** `services/gateway/app/main.py` → `create_job()`

**Timeout:** 15s

**Request:**
```http
POST /v1/jobs
Content-Type: application/json
Authorization: Bearer <API_KEY_SECRET>

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

**Response (200 OK):**
```json
{
  "message": "Job created successfully",
  "job_id": "507f1f77bcf86cd799439011",
  "created_at": "2024-12-09T13:37:00Z"
}
```

**Validation:**
- Required fields: title, department, location, experience_level, requirements, description
- experience_level: "entry", "mid", "senior", "lead"

**Error Responses:**
- 400 Bad Request: Missing required fields
- 422 Unprocessable Entity: Invalid experience_level

**When Called:** Client creates job posting in portal

**Database Impact:** INSERT into jobs collection

---

### 27. GET /v1/jobs

**Purpose:** List all active job postings

**Authentication:** None (public endpoint)

**Implementation:** `services/gateway/app/main.py` → `list_jobs()`

**Timeout:** 10s

**Request:**
```http
GET /v1/jobs
```

**Response (200 OK):**
```json
{
  "jobs": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Senior Software Engineer",
      "department": "Engineering",
      "location": "Remote",
      "experience_level": "senior",
      "requirements": "5+ years Python, FastAPI, PostgreSQL",
      "description": "Join our team to build scalable HR solutions",
      "created_at": "2024-12-09T13:37:00Z"
    }
  ],
  "count": 1
}
```

**When Called:** Dashboard loads job list, candidate browses jobs

**Database Impact:** SELECT from jobs collection WHERE status='active'

---

## Gateway Candidate Management

### 28. GET /v1/candidates

**Purpose:** Get all candidates with pagination

**Authentication:** Bearer token required

**Implementation:** `services/gateway/app/main.py` → `get_all_candidates()`

**Timeout:** 15s

**Request:**
```http
GET /v1/candidates?limit=50&offset=0
Authorization: Bearer <API_KEY_SECRET>
```

**Response (200 OK):**
```json
{
  "candidates": [
    {
      "id": "507f1f77bcf86cd799439011",
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

**Parameters:**
- `limit`: Maximum candidates to return (default: 50)
- `offset`: Number of candidates to skip (default: 0)

**Error Responses:**
- 401 Unauthorized: Invalid API key

**When Called:** HR dashboard loads candidate list

**Database Impact:** SELECT from candidates collection with LIMIT/OFFSET

---

### 29. GET /v1/candidates/stats

**Purpose:** Get dynamic candidate statistics for dashboard

**Authentication:** Bearer token required

**Implementation:** `services/gateway/app/main.py` → `get_candidate_stats()`

**Timeout:** 15s

**Request:**
```http
GET /v1/candidates/stats
Authorization: Bearer <API_KEY_SECRET>
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
  "data_source": "mongodb_atlas",
  "dashboard_ready": true
}
```

**Error Responses:**
- 401 Unauthorized: Invalid API key

**When Called:** Dashboard loads analytics panel

**Database Impact:** Multiple COUNT queries on candidates, jobs, matching_cache, interviews, feedback collections

---

### 30. GET /v1/candidates/search

**Purpose:** Search and filter candidates by criteria

**Authentication:** Bearer token required

**Implementation:** `services/gateway/app/main.py` → `search_candidates()`

**Timeout:** 20s

**Request:**
```http
GET /v1/candidates/search?skills=Python&location=San Francisco&experience_min=3
Authorization: Bearer <API_KEY_SECRET>
```

**Response (200 OK):**
```json
{
  "candidates": [
    {
      "id": "507f1f77bcf86cd799439011",
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

**Parameters:**
- `skills`: Skills to search for (max 200 chars)
- `location`: Location filter (max 100 chars)
- `experience_min`: Minimum years of experience

**Input Validation:**
- skills: Max 200 chars, alphanumeric + comma/space only
- location: Max 100 chars, alphanumeric + comma/space only
- experience_min: Non-negative integer

**Error Responses:**
- 400 Bad Request: Invalid filter format
- 401 Unauthorized: Invalid API key

**When Called:** HR searches for candidates matching criteria

**Database Impact:** SELECT with WHERE clauses using regex for fuzzy matching

---

### 31. GET /v1/candidates/job/{job_id}

**Purpose:** Get candidates for specific job (dynamic matching)

**Authentication:** Bearer token required

**Implementation:** `services/gateway/app/main.py` → `get_candidates_by_job()`

**Timeout:** 15s

**Request:**
```http
GET /v1/candidates/job/507f1f77bcf86cd799439011
Authorization: Bearer <API_KEY_SECRET>
```

**Response (200 OK):**
```json
{
  "candidates": [
    {
      "id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "skills": "Python, FastAPI, PostgreSQL",
      "experience": 5
    }
  ],
  "job_id": "507f1f77bcf86cd799439011",
  "count": 1
}
```

**Error Responses:**
- 400 Bad Request: Invalid job_id format
- 404 Not Found: Job not found

**When Called:** HR views candidates for specific job

**Database Impact:** SELECT from candidates collection (limited to 10)

---

### 32. GET /v1/candidates/{candidate_id}

**Purpose:** Get specific candidate by ID with full details

**Authentication:** Bearer token required

**Implementation:** `services/gateway/app/main.py` → `get_candidate_by_id()`

**Timeout:** 10s

**Request:**
```http
GET /v1/candidates/507f1f77bcf86cd799439011
Authorization: Bearer <API_KEY_SECRET>
```

**Response (200 OK):**
```json
{
  "candidate": {
    "id": "507f1f77bcf86cd799439011",
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

**Database Impact:** SELECT from candidates collection WHERE _id = ObjectId(candidate_id)

---

### 33. POST /v1/candidates/bulk

**Purpose:** Bulk upload multiple candidates

**Authentication:** Bearer token required

**Implementation:** `services/gateway/app/main.py` → `bulk_upload_candidates()`

**Timeout:** 60s

**Request:**
```http
POST /v1/candidates/bulk
Content-Type: application/json
Authorization: Bearer <API_KEY_SECRET>

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
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "message": "Bulk upload completed",
  "candidates_received": 1,
  "candidates_inserted": 1,
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

**Database Impact:** Multiple INSERT into candidates collection with transaction

---


## Gateway Analytics & Statistics

### 34. GET /v1/database/schema

**Purpose:** Get database schema information and version

**Authentication:** Bearer token required

**Implementation:** `services/gateway/app/main.py` → `get_database_schema()`

**Timeout:** 10s

**Request:**
```http
GET /v1/database/schema
Authorization: Bearer <API_KEY_SECRET>
```

**Response (200 OK):**
```json
{
  "database_type": "MongoDB Atlas",
  "schema_version": "1.0.0-mongodb",
  "applied_at": null,
  "total_collections": 12,
  "collections": [
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
  "phase3_enabled": true,
  "core_collections": [
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

**Database Impact:** Query collection list, schema_version collection

---

### 35. GET /v1/reports/job/{job_id}/export.csv

**Purpose:** Export job report as CSV

**Authentication:** Bearer token required

**Implementation:** `services/gateway/app/main.py` → `export_job_report()`

**Timeout:** 30s

**Request:**
```http
GET /v1/reports/job/507f1f77bcf86cd799439011/export.csv
Authorization: Bearer <API_KEY_SECRET>
```

**Response (200 OK):**
```json
{
  "message": "Job report export",
  "job_id": "507f1f77bcf86cd799439011",
  "format": "CSV",
  "download_url": "/downloads/job_507f1f77bcf86cd799439011_report.csv",
  "generated_at": "2024-12-09T13:37:00Z"
}
```

**Error Responses:**
- 404 Not Found: Job not found
- 401 Unauthorized: Invalid API key

**When Called:** HR exports job analytics report

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

| /v1/database/schema | GET | Analytics | Get schema info | Yes |
| /v1/reports/job/{job_id}/export.csv | GET | Analytics | Export report | Yes |

**Total Endpoints in Part 2:** 18 (18-35 of 111)

---

**Continue to:** [API_CONTRACT_PART3.md](./API_CONTRACT_PART3.md) for Gateway Advanced Features
