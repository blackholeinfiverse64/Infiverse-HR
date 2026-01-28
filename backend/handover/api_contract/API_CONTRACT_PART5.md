# API Contract — Part 5: AI Agent & LangGraph Services

**Continued from:** [API_CONTRACT_PART4.md](./API_CONTRACT_PART4.md)

**Version:** 4.0.0  
**Last Updated:** January 22, 2026  
**Total Endpoints:** 114 (83 Gateway + 6 Agent + 25 LangGraph)  
**Database:** MongoDB Atlas

---

## AI Agent Service (6 endpoints)

**Base URL:** https://bhiv-hr-agent-nhgg.onrender.com

### 81. GET /

**Purpose:** AI Agent service information

**Authentication:** None (public endpoint)

**Request:**
```http
GET /
```

**Response (200 OK):**
```json
{
  "service": "BHIV AI Agent",
  "version": "3.0.0",
  "endpoints": 6,
  "available_endpoints": {
    "root": "GET / - Service information",
    "health": "GET /health - Service health check",
    "test_db": "GET /test-db - Database connectivity test",
    "match": "POST /match - AI-powered candidate matching",
    "batch_match": "POST /batch-match - Batch AI matching for multiple jobs",
    "analyze": "GET /analyze/{candidate_id} - Detailed candidate analysis"
  }
}
```

**When Called:** Service discovery

**Implemented In:** `services/agent/app.py` → `read_root()`

---

### 82. GET /health

**Purpose:** Health check for AI Agent service

**Authentication:** None (public health endpoint)

**Request:**
```http
GET /health
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "BHIV AI Agent",
  "version": "3.0.0",
  "timestamp": "2024-12-09T13:37:00Z"
}
```

**When Called:** Load balancer health checks

**Implemented In:** `services/agent/app.py` → `health_check()`

---

### 83. GET /test-db

**Purpose:** Test database connectivity

**Authentication:** Bearer token required

**Request:**
```http
GET /test-db
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "status": "success",
  "candidates_count": 1234,
  "samples": [
    {"id": 1, "name": "John Doe"},
    {"id": 2, "name": "Jane Smith"},
    {"id": 3, "name": "Bob Johnson"}
  ]
}
```

**Error Responses:**
- 500 Internal Server Error: Database connection failed

**When Called:** System diagnostics

**Implemented In:** `services/agent/app.py` → `test_database()`

---

### 84. POST /match

**Purpose:** AI-powered candidate matching using Phase 3 semantic engine

**Authentication:** Bearer token required

**Request:**
```http
POST /match
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "job_id": 123
}
```

**Response (200 OK):**
```json
{
  "job_id": 123,
  "top_candidates": [
    {
      "candidate_id": 45,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "score": 92.5,
      "skills_match": ["Python", "FastAPI", "PostgreSQL"],
      "experience_match": "5y - Phase 3 matched",
      "location_match": true,
      "reasoning": "Semantic match: 0.95; Skills: Python, FastAPI, PostgreSQL; Experience: 5y; Location: San Francisco"
    }
  ],
  "total_candidates": 50,
  "processing_time": 0.45,
  "algorithm_version": "3.0.0-phase3-production",
  "status": "success"
}
```

**Sequence:**
1. Fetch job details from database
2. Fetch all candidates
3. Run Phase 3 semantic matching
4. Calculate similarity scores
5. Rank candidates by score
6. Return top 10 matches

**Error Responses:**
- 404 Not Found: Job not found
- 500 Internal Server Error: Matching failed

**When Called:** Gateway requests AI matching

**Implemented In:** `services/agent/app.py` → `match_candidates()`

**Database Impact:** SELECT from jobs, candidates tables

---

### 85. POST /batch-match

**Purpose:** Batch AI matching for multiple jobs

**Authentication:** Bearer token required

**Request:**
```http
POST /batch-match
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
          "skills_match": ["Python", "FastAPI"],
          "experience_match": "5y - Phase 3 matched",
          "location_match": true,
          "reasoning": "Skills: Python, FastAPI; Experience: 5y; Phase 3 AI semantic analysis"
        }
      ],
      "total_candidates": 5,
      "algorithm": "batch-production",
      "processing_time": "0.5s"
    }
  },
  "total_jobs_processed": 3,
  "total_candidates_analyzed": 50,
  "algorithm_version": "3.0.0-phase3-production-batch",
  "status": "success",
  "processing_time": "1.2s"
}
```

**Error Responses:**
- 400 Bad Request: Empty job_ids or > 10 jobs
- 404 Not Found: Jobs not found

**When Called:** Gateway requests batch matching

**Implemented In:** `services/agent/app.py` → `batch_match_jobs()`

**Database Impact:** SELECT from jobs, candidates tables

---

### 86. GET /analyze/{candidate_id}

**Purpose:** Detailed candidate analysis with skill categorization

**Authentication:** Bearer token required

**Request:**
```http
GET /analyze/123
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "candidate_id": 123,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "experience_years": 5,
  "seniority_level": "Senior",
  "education_level": "Bachelor of Science in Computer Science",
  "location": "San Francisco, CA",
  "skills_analysis": {
    "Programming": ["python", "java", "javascript"],
    "Web Development": ["react", "node", "django"],
    "Cloud": ["aws", "docker", "kubernetes"],
    "Database": ["sql", "postgresql", "mongodb"]
  },
  "semantic_skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "Kubernetes"],
  "total_skills": 10,
  "ai_analysis_enabled": true,
  "analysis_timestamp": "2026-01-22T13:37:00Z"
}
```

**Error Responses:**
- 404 Not Found: Candidate not found

**When Called:** HR requests detailed candidate analysis

**Implemented In:** `services/agent/app.py` → `analyze_candidate()`

**Database Impact:** SELECT from candidates table

---

## LangGraph Service (33 endpoints)

**Base URL:** https://bhiv-hr-langgraph.onrender.com

**RL Integration Status:** ✅ 8 RL endpoints operational with 100% test pass rate

### 87. GET /

**Purpose:** LangGraph service information

**Authentication:** None (public endpoint)

**Request:**
```http
GET /
```

**Response (200 OK):**
```json
{
  "message": "BHIV LangGraph Orchestrator",
  "version": "1.0.0",
  "status": "healthy",
  "environment": "production",
  "endpoints": 25,
  "workflow_engine": "active",
  "ai_automation": "enabled"
}
```

**When Called:** Service discovery

**Implemented In:** `services/langgraph/app/main.py` → `read_root()`

---

### 88. GET /health

**Purpose:** Health check for LangGraph service

**Authentication:** None (public health endpoint)

**Request:**
```http
GET /health
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "langgraph-orchestrator",
  "version": "1.0.0",
  "environment": "production"
}
```

**When Called:** Load balancer health checks

**Implemented In:** `services/langgraph/app/main.py` → `health_check()`

---

### 89. POST /workflows/application/start

**Purpose:** Start AI workflow for candidate processing

**Authentication:** Bearer token required

**Request:**
```http
POST /workflows/application/start
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "candidate_id": 123,
  "job_id": 45,
  "application_id": 789,
  "candidate_email": "john.doe@example.com",
  "candidate_phone": "+1234567890",
  "candidate_name": "John Doe",
  "job_title": "Senior Software Engineer",
  "job_description": "Build scalable HR solutions"
}
```

**Response (200 OK):**
```json
{
  "workflow_id": "wf_abc123def456",
  "status": "started",
  "message": "Application workflow started for John Doe",
  "timestamp": "2024-12-09T13:37:00Z"
}
```

**Sequence:**
1. Generate unique workflow_id
2. Initialize workflow state
3. Execute workflow in background
4. Track in database
5. Return workflow_id for tracking

**Error Responses:**
- 500 Internal Server Error: Workflow initialization failed

**When Called:** Candidate submits application

**Implemented In:** `services/langgraph/app/main.py` → `start_application_workflow()`

**Database Impact:** INSERT into workflows table

---

### 90. GET /workflows/{workflow_id}/status

**Purpose:** Get detailed workflow execution status

**Authentication:** Bearer token required

**Request:**
```http
GET /workflows/wf_abc123def456/status
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "workflow_id": "wf_abc123def456",
  "workflow_type": "candidate_application",
  "status": "running",
  "progress_percentage": 65,
  "current_step": "ai_matching_analysis",
  "total_steps": 5,
  "candidate_id": 123,
  "job_id": 45,
  "input_data": {
    "candidate_name": "John Doe",
    "job_title": "Senior Software Engineer"
  },
  "output_data": {},
  "error_message": null,
  "started_at": "2024-12-09T13:37:00Z",
  "completed_at": null,
  "updated_at": "2026-01-22T13:40:00Z",
  "completed": false,
  "estimated_time_remaining": "2-4 minutes",
  "source": "database"
}
```

**Error Responses:**
- 404 Not Found: Workflow not found

**When Called:** Dashboard polls for workflow updates

**Implemented In:** `services/langgraph/app/main.py` → `get_workflow_status()`

**Database Impact:** SELECT from workflows table

---

### 91. POST /workflows/{workflow_id}/resume

**Purpose:** Resume paused workflow

**Authentication:** Bearer token required

**Request:**
```http
POST /workflows/wf_abc123def456/resume
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "workflow_id": "wf_abc123def456",
  "status": "resumed",
  "result": {}
}
```

**When Called:** Admin resumes paused workflow

**Implemented In:** `services/langgraph/app/main.py` → `resume_workflow()`

---

### 92. GET /workflows

**Purpose:** List all workflows with filtering

**Authentication:** Bearer token required

**Request:**
```http
GET /workflows?status=running&limit=50
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "workflows": [
    {
      "workflow_id": "wf_abc123",
      "workflow_type": "candidate_application",
      "status": "running",
      "progress_percentage": 65,
      "candidate_id": 123,
      "job_id": 45,
      "started_at": "2024-12-09T13:37:00Z",
      "completed": false,
      "estimated_time_remaining": "2-4 minutes"
    }
  ],
  "count": 1,
  "filter": "running",
  "limit": 50,
  "tracking_source": "database_with_fallback",
  "status": "operational"
}
```

**When Called:** Dashboard loads workflow list

**Implemented In:** `services/langgraph/app/main.py` → `list_workflows()`

**Database Impact:** SELECT from workflows table

---

### 93. GET /workflows/stats

**Purpose:** Workflow statistics and analytics

**Authentication:** Bearer token required

**Request:**
```http
GET /workflows/stats
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "total_workflows": 1234,
  "active_workflows": 5,
  "completed_workflows": 1200,
  "failed_workflows": 29,
  "average_completion_time": "3-5 minutes",
  "success_rate": "97.2%",
  "database_connection": "connected",
  "last_updated": "2026-01-22T13:37:00Z"
}
```

**When Called:** Admin dashboard loads workflow metrics

**Implemented In:** `services/langgraph/app/main.py` → `get_workflow_stats()`

**Database Impact:** Multiple COUNT queries on workflows table

---

### 94. POST /tools/send-notification

**Purpose:** Multi-channel notification system with interactive features

**Authentication:** Bearer token required

**Request:**
```http
POST /tools/send-notification
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "candidate_name": "John Doe",
  "candidate_email": "john.doe@example.com",
  "candidate_phone": "+1234567890",
  "job_title": "Senior Software Engineer",
  "message": "Your application has been received",
  "channels": ["email", "whatsapp"],
  "application_status": "received"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Automated notification sequence completed",
  "candidate_name": "John Doe",
  "job_title": "Senior Software Engineer",
  "sequence_type": "application_received",
  "channels_requested": ["email", "whatsapp"],
  "results": {
    "email": {"sent": true, "message_id": "msg_abc123"},
    "whatsapp": {"sent": true, "message_sid": "SM123"}
  },
  "sent_at": "2026-01-22T13:37:00Z"
}
```

**When Called:** Workflow triggers notification

**Implemented In:** `services/langgraph/app/main.py` → `send_notification()`

---

### 95-102. Communication Tools (8 endpoints)

**Endpoints:**
- POST /test/send-email
- POST /test/send-whatsapp
- POST /test/send-telegram
- POST /test/send-whatsapp-buttons
- POST /test/send-automated-sequence
- POST /automation/trigger-workflow
- POST /automation/bulk-notifications
- POST /webhook/whatsapp

**Common Pattern:**
```http
POST /test/send-email
Authorization: Bearer YOUR_API_KEY
{
  "recipient_email": "test@example.com",
  "subject": "Test Email",
  "message": "This is a test"
}
```

**Response:**
```json
{
  "success": true,
  "result": {"sent": true, "message_id": "msg_abc123"}
}
```

**When Called:** Testing communication channels, automation triggers

**Implemented In:** `services/langgraph/app/main.py` → Communication functions

---

### 103-110. RL + Feedback Agent (8 endpoints) - ✅ 100% Operational

**Endpoints:**
- POST /rl/predict - ML-powered candidate matching (Score: 77.65, Confidence: 75%)
- POST /rl/feedback - Submit hiring outcome feedback (340% feedback rate)
- GET /rl/analytics - System performance metrics (5 predictions, 17 feedback)
- GET /rl/performance/{model_version} - Model performance data (v1.0.0 active)
- GET /rl/history/{candidate_id} - Candidate decision history (3 decisions tracked)
- POST /rl/retrain - Trigger model retraining (v1.0.1, 80% accuracy)
- GET /health - Service health check
- GET /test-integration - RL system integration test

**Example - RL Predict:**
```http
POST /rl/predict
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "candidate_features": {
    "experience_years": 5,
    "technical_skills": ["Python", "FastAPI"]
  },
  "job_features": {
    "experience_required": 5,
    "required_skills": ["Python", "FastAPI"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "rl_prediction": {
    "rl_score": 87.5,
    "confidence": 0.92,
    "recommendation": "strong_match"
  },
  "feedback_samples_used": 150,
  "predicted_at": "2026-01-22T13:37:00Z"
}
```

**When Called:** AI matching requests RL enhancement

**Implemented In:** `services/langgraph/app/rl_integration/rl_endpoints.py` → Complete RL system

**Database Integration:** PostgreSQL with rl_predictions, rl_feedback, rl_model_performance tables

**Test Results:** 8/8 tests passing (100% success rate)
- ✅ Service Health: langgraph-orchestrator v4.3.1 operational
- ✅ Integration Test: RL Engine integrated with PostgreSQL
- ✅ RL Prediction: Score 77.65, Decision: recommend, Confidence: 75.0%
- ✅ RL Feedback: Feedback ID: 20, Reward: 1.225
- ✅ RL Analytics: 5 Predictions, 17 Feedback, 340% rate
- ✅ RL Performance: Model v1.0.0 active
- ✅ RL History: Candidate 1 has 3 decisions tracked
- ✅ RL Retrain: Model v1.0.1, 15 samples, 80% accuracy

---

### 111. GET /test-integration

**Purpose:** Integration testing and system validation

**Authentication:** Bearer token required

**Request:**
```http
GET /test-integration
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "service": "langgraph-orchestrator",
  "status": "operational",
  "integration_test": "passed",
  "endpoints_available": 25,
  "workflow_engine": "active",
  "rl_engine": "integrated",
  "rl_database": "mongodb",
  "rl_monitoring": "available",
  "database_tracking": "enabled",
  "progress_tracking": "detailed",
  "fallback_support": "enabled",
  "tested_at": "2026-01-22T13:37:00Z"
}
```

**When Called:** System diagnostics, deployment verification

**Implemented In:** `services/langgraph/app/main.py` → `test_integration()`

---

## Summary Table - Part 5

### AI Agent Service (6 endpoints)

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| / | GET | Service info | No |
| /health | GET | Health check | No |
| /test-db | GET | Test database | Yes |
| /match | POST | AI matching | Yes |
| /batch-match | POST | Batch matching | Yes |
| /analyze/{candidate_id} | GET | Candidate analysis | Yes |

### LangGraph Service (33 endpoints)

| Category | Endpoints | Auth Required |
|----------|-----------|---------------|
| Core API | 2 (/, /health) | No |
| Workflow Management | 2 (start, resume) | Yes |
| Workflow Monitoring | 3 (status, list, stats) | Yes |
| Communication Tools | 9 (notifications, webhooks) | Yes |
| RL + Feedback Agent | 8 (predict, feedback, analytics) - 100% operational | Yes |
| System Diagnostics | 1 (test-integration) | Yes |

**Total Endpoints in Part 5:** 31 (Cumulative: 114 of 114)

---

## 🎉 Complete API Documentation

**Total Endpoints Documented:** 114 of 114 (100%)

### Service Breakdown
- **Gateway API:** 83 endpoints
- **AI Agent API:** 6 endpoints
- **LangGraph API:** 25 endpoints (17 workflow + 8 RL)

### Documentation Parts
- ✅ Part 1: Core Services (17 endpoints)
- ✅ Part 2: Gateway Core Features (21 endpoints)
- ✅ Part 3: Gateway Advanced Features (10 endpoints)
- ✅ Part 4: Gateway Security & Portals (35 endpoints)
- ✅ Part 5: AI Agent & LangGraph Services (31 endpoints)

---

**Back to:** [API_CONTRACT_SUMMARY.md](./API_CONTRACT_SUMMARY.md) for complete overview
