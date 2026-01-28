# API Contract — BHIV HR Platform

**Version:** 4.0.0  
**Last Updated:** January 22, 2026  
**Total Endpoints:** 114 (83 Gateway + 6 Agent + 25 LangGraph)  
**Documentation Style:** Stripe API Standard

---

## Table of Contents

### Part 1: Core Services
1. [Authentication & Standards](#authentication--standards)
2. [Gateway API - Authentication (4 endpoints)](#gateway-authentication)
3. [Gateway API - AI Integration (2 endpoints)](#gateway-ai-integration)
4. [Gateway API - LangGraph Workflows (7 endpoints)](#gateway-langgraph-workflows)
5. [Gateway API - RL + Feedback Agent (4 endpoints)](#gateway-rl-feedback)

### Part 2: Gateway Core Features
- Monitoring (3 endpoints)
- Core API (5 endpoints)
- Job Management (2 endpoints)
- Candidate Management (5 endpoints)
- Analytics & Statistics (3 endpoints)

### Part 3: Gateway Advanced Features
- AI Matching Engine (2 endpoints)
- Assessment & Workflow (6 endpoints)
- Client Portal API (2 endpoints)
- Security Testing (12 endpoints)

### Part 4: Gateway Security & Portals
- CSP Management (4 endpoints)
- Two-Factor Authentication (8 endpoints)
- Password Management (6 endpoints)
- Candidate Portal (5 endpoints)

### Part 5: AI Agent & LangGraph Services
- AI Agent API (6 endpoints)
- LangGraph API (25 endpoints)

---

## Authentication & Standards

### Authentication Methods

**1. API Key Authentication (Primary)**
```http
Authorization: Bearer YOUR_API_KEY_HERE
```

**2. Client JWT Token**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**3. Candidate JWT Token**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Base URLs

| Service | Production URL | Local URL |
|---------|---------------|-----------|
| **Gateway** | https://bhiv-hr-gateway-ltg0.onrender.com | http://localhost:8000 |
| **AI Agent** | https://bhiv-hr-agent-nhgg.onrender.com | http://localhost:9000 |
| **LangGraph** | https://bhiv-hr-langgraph.onrender.com | http://localhost:9001 |

### Standard Response Format

**Success Response:**
```json
{
  "status": "success",
  "data": {},
  "timestamp": "2024-12-09T13:37:00Z"
}
```

**Error Response:**
```json
{
  "status": "error",
  "error": "Error message",
  "detail": "Detailed error description",
  "timestamp": "2024-12-09T13:37:00Z"
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET/POST/PUT |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Invalid/missing authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

### Rate Limiting

**Dynamic Rate Limits:**
- Default: 60 requests/minute
- Premium: 300 requests/minute
- CPU-based adjustment: 50-150% of base limit

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1702134000
```

---

## Gateway Authentication

### 1. POST /auth/2fa/setup

**Purpose:** Initialize 2FA for user account with QR code generation

**Authentication:** Bearer token required

**Request:**
```http
POST /auth/2fa/setup
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "user_id": "user_12345"
}
```

**Response (200 OK):**
```json
{
  "message": "2FA setup initiated",
  "user_id": "user_12345",
  "secret": "JBSWY3DPEHPK3PXP",
  "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "manual_entry_key": "JBSWY3DPEHPK3PXP",
  "instructions": "Scan QR code with Google Authenticator, Microsoft Authenticator, or Authy"
}
```

**Error Responses:**
- 401 Unauthorized: Invalid API key
- 400 Bad Request: Missing user_id

**When Called:** User enables 2FA in security settings

**Implemented In:** `services/gateway/routes/auth.py` → `setup_2fa()`

---

### 2. POST /auth/2fa/verify

**Purpose:** Verify TOTP code during 2FA authentication

**Authentication:** Bearer token required

**Request:**
```http
POST /auth/2fa/verify
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "user_id": "user_12345",
  "totp_code": "123456"
}
```

**Response (200 OK):**
```json
{
  "message": "2FA verification successful",
  "user_id": "user_12345",
  "verified": true,
  "verified_at": "2024-12-09T13:37:00Z"
}
```

**Error Responses:**
- 401 Unauthorized: Invalid 2FA code
- 400 Bad Request: Missing required fields

**When Called:** User submits 2FA code during login

**Implemented In:** `services/gateway/routes/auth.py` → `verify_2fa()`

---

### 3. POST /auth/login

**Purpose:** User login with 2FA support

**Authentication:** None (public endpoint)

**Request:**
```http
POST /auth/login
Content-Type: application/json

{
  "username": "demo_user",
  "password": "demo_password",
  "totp_code": "123456"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user_id": "user_12345",
  "2fa_verified": true
}
```

**Error Responses:**
- 401 Unauthorized: Invalid credentials
- 403 Forbidden: Account locked

**When Called:** User attempts to login

**Implemented In:** `services/gateway/routes/auth.py` → `login_with_2fa()`

---

### 4. GET /auth/2fa/status/{user_id}

**Purpose:** Check 2FA status for user

**Authentication:** Bearer token required

**Request:**
```http
GET /auth/2fa/status/user_12345
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "user_id": "user_12345",
  "2fa_enabled": true,
  "setup_date": "2024-01-01T12:00:00Z",
  "last_used": "2024-12-09T08:30:00Z",
  "backup_codes_remaining": 8
}
```

**Error Responses:**
- 404 Not Found: User not found
- 401 Unauthorized: Invalid API key

**When Called:** Dashboard loads user security settings

**Implemented In:** `services/gateway/routes/auth.py` → `get_2fa_status()`

---

## Gateway AI Integration

### 5. POST /api/v1/ai/test-communication

**Purpose:** Test multi-channel communication system (Email, WhatsApp, Telegram)

**Authentication:** Bearer token required

**Request:**
```http
POST /api/v1/ai/test-communication
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "test_type": "all_channels",
  "recipient_email": "test@example.com",
  "recipient_phone": "+1234567890",
  "telegram_chat_id": "123456789"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "results": {
    "email": {
      "sent": true,
      "message_id": "msg_abc123",
      "provider": "gmail_smtp"
    },
    "whatsapp": {
      "sent": true,
      "message_sid": "SM1234567890abcdef",
      "provider": "twilio"
    },
    "telegram": {
      "sent": true,
      "message_id": 456789,
      "provider": "telegram_bot_api"
    }
  },
  "test_timestamp": "2024-12-09T13:37:00Z"
}
```

**Error Responses:**
- 500 Internal Server Error: Communication service unavailable
- 400 Bad Request: Invalid recipient data

**When Called:** Admin tests notification system

**Implemented In:** `services/gateway/routes/ai_integration.py` → `test_communication_system()`

---

### 6. POST /api/v1/ai/gemini/analyze

**Purpose:** Analyze candidate profile using Google Gemini AI

**Authentication:** Bearer token required

**Request:**
```http
POST /api/v1/ai/gemini/analyze
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "candidate_id": 123,
  "analysis_type": "comprehensive",
  "include_recommendations": true
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "candidate_id": 123,
  "analysis": {
    "skills_assessment": "Strong technical background in Python, FastAPI, and cloud technologies",
    "experience_evaluation": "5+ years of relevant experience with progressive responsibility",
    "cultural_fit": "High alignment with company values",
    "strengths": ["Technical expertise", "Problem-solving", "Communication"],
    "areas_for_development": ["Leadership experience", "Domain knowledge"],
    "overall_score": 85.5,
    "recommendation": "Strong candidate - proceed to interview"
  },
  "ai_model": "gemini-pro",
  "analyzed_at": "2024-12-09T13:37:00Z"
}
```

**Error Responses:**
- 404 Not Found: Candidate not found
- 503 Service Unavailable: Gemini API unavailable

**When Called:** HR requests AI analysis of candidate

**Implemented In:** `services/gateway/routes/ai_integration.py` → `analyze_with_gemini()`

---

## Gateway LangGraph Workflows

### 7. POST /api/v1/workflow/trigger

**Purpose:** Trigger automated workflow for candidate processing

**Authentication:** Bearer token required

**Request:**
```http
POST /api/v1/workflow/trigger
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "workflow_type": "candidate_application",
  "candidate_id": 123,
  "job_id": 45,
  "trigger_event": "application_submitted"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "workflow_id": "wf_abc123def456",
  "workflow_type": "candidate_application",
  "triggered_at": "2024-12-09T13:37:00Z",
  "estimated_completion": "2024-12-09T13:42:00Z",
  "tracking_url": "/api/v1/workflow/status/wf_abc123def456"
}
```

**Sequence:**
1. Validate input data
2. Create workflow instance in LangGraph
3. Emit workflow.started event
4. Return workflow ID for tracking
5. Execute workflow asynchronously

**Error Responses:**
- 400 Bad Request: Invalid workflow type
- 404 Not Found: Candidate or job not found
- 503 Service Unavailable: LangGraph service down

**When Called:** Candidate submits application, HR triggers manual workflow

**Implemented In:** `services/gateway/langgraph_integration.py` → `trigger_workflow()`

---

### 8. GET /api/v1/workflow/status/{workflow_id}

**Purpose:** Get real-time workflow execution status

**Authentication:** Bearer token required

**Request:**
```http
GET /api/v1/workflow/status/wf_abc123def456
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "workflow_id": "wf_abc123def456",
  "status": "running",
  "progress_percentage": 65,
  "current_step": "ai_matching_analysis",
  "total_steps": 5,
  "steps_completed": [
    "data_validation",
    "initial_screening",
    "ai_matching_analysis"
  ],
  "steps_remaining": [
    "recommendation_generation",
    "notification_dispatch"
  ],
  "started_at": "2024-12-09T13:37:00Z",
  "estimated_completion": "2024-12-09T13:42:00Z",
  "last_updated": "2024-12-09T13:40:00Z"
}
```

**Error Responses:**
- 404 Not Found: Workflow ID not found
- 401 Unauthorized: Invalid API key

**When Called:** Dashboard polls for workflow updates, WebSocket alternative

**Implemented In:** `services/gateway/langgraph_integration.py` → `get_workflow_status()`

---

### 9. GET /api/v1/workflow/list

**Purpose:** List all workflows with filtering options

**Authentication:** Bearer token required

**Request:**
```http
GET /api/v1/workflow/list?status=running&limit=20&offset=0
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
      "candidate_id": 123,
      "job_id": 45,
      "progress_percentage": 65,
      "started_at": "2024-12-09T13:37:00Z"
    },
    {
      "workflow_id": "wf_def456",
      "workflow_type": "interview_scheduling",
      "status": "completed",
      "candidate_id": 124,
      "job_id": 46,
      "progress_percentage": 100,
      "started_at": "2024-12-09T13:30:00Z",
      "completed_at": "2024-12-09T13:35:00Z"
    }
  ],
  "total_count": 2,
  "limit": 20,
  "offset": 0,
  "filters_applied": {
    "status": "running"
  }
}
```

**Error Responses:**
- 401 Unauthorized: Invalid API key

**When Called:** Dashboard loads workflow list, admin monitors system

**Implemented In:** `services/gateway/langgraph_integration.py` → `list_workflows()`

---

### 10. GET /api/v1/workflow/health

**Purpose:** Check LangGraph service health and connectivity

**Authentication:** Bearer token required

**Request:**
```http
GET /api/v1/workflow/health
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "langgraph-orchestrator",
  "version": "1.0.0",
  "uptime_seconds": 86400,
  "active_workflows": 5,
  "total_workflows_processed": 1234,
  "database_connection": "connected",
  "last_health_check": "2024-12-09T13:37:00Z"
}
```

**Error Responses:**
- 503 Service Unavailable: LangGraph service down

**When Called:** Gateway startup, periodic health checks

**Implemented In:** `services/gateway/langgraph_integration.py` → `check_langgraph_health()`

---

### 11. POST /api/v1/webhooks/candidate-applied

**Purpose:** Webhook triggered when candidate applies for job

**Authentication:** Bearer token required

**Request:**
```http
POST /api/v1/webhooks/candidate-applied
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
  "applied_at": "2024-12-09T13:37:00Z"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "webhook_processed": true,
  "workflow_triggered": true,
  "workflow_id": "wf_abc123",
  "notifications_sent": ["email", "whatsapp"],
  "processed_at": "2024-12-09T13:37:00Z"
}
```

**Sequence:**
1. Receive webhook payload
2. Validate candidate and job data
3. Trigger LangGraph workflow
4. Send confirmation notifications
5. Return workflow ID

**Error Responses:**
- 400 Bad Request: Invalid payload
- 404 Not Found: Candidate or job not found

**When Called:** Candidate portal submits application

**Implemented In:** `services/gateway/langgraph_integration.py` → `webhook_candidate_applied()`

---

### 12. POST /api/v1/webhooks/candidate-shortlisted

**Purpose:** Webhook triggered when candidate is shortlisted

**Authentication:** Bearer token required

**Request:**
```http
POST /api/v1/webhooks/candidate-shortlisted
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "candidate_id": 123,
  "job_id": 45,
  "shortlisted_by": "hr_manager_001",
  "matching_score": 85.5,
  "shortlisted_at": "2024-12-09T13:37:00Z"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "webhook_processed": true,
  "workflow_triggered": true,
  "workflow_id": "wf_def456",
  "notifications_sent": ["email", "whatsapp", "telegram"],
  "next_action": "schedule_interview",
  "processed_at": "2024-12-09T13:37:00Z"
}
```

**Error Responses:**
- 400 Bad Request: Invalid payload
- 404 Not Found: Candidate or job not found

**When Called:** HR shortlists candidate in portal

**Implemented In:** `services/gateway/langgraph_integration.py` → `webhook_candidate_shortlisted()`

---

### 13. POST /api/v1/webhooks/interview-scheduled

**Purpose:** Webhook triggered when interview is scheduled

**Authentication:** Bearer token required

**Request:**
```http
POST /api/v1/webhooks/interview-scheduled
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "candidate_id": 123,
  "job_id": 45,
  "interview_id": 999,
  "interview_date": "2024-12-15T14:00:00Z",
  "interviewer": "Sarah Johnson",
  "interview_type": "technical",
  "meeting_link": "https://meet.google.com/abc-defg-hij",
  "scheduled_at": "2024-12-09T13:37:00Z"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "webhook_processed": true,
  "workflow_triggered": true,
  "workflow_id": "wf_ghi789",
  "notifications_sent": ["email", "whatsapp"],
  "calendar_invite_sent": true,
  "reminder_scheduled": true,
  "processed_at": "2024-12-09T13:37:00Z"
}
```

**Error Responses:**
- 400 Bad Request: Invalid interview data
- 404 Not Found: Candidate or job not found

**When Called:** HR schedules interview in portal

**Implemented In:** `services/gateway/langgraph_integration.py` → `webhook_interview_scheduled()`

---

## Gateway RL Feedback

### 14. POST /api/v1/rl/predict

**Purpose:** Get RL-enhanced matching prediction for candidate-job pair

**Authentication:** Bearer token required

**Request:**
```http
POST /api/v1/rl/predict
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "candidate_id": 123,
  "job_id": 45,
  "candidate_features": {
    "experience_years": 5,
    "technical_skills": ["Python", "FastAPI", "PostgreSQL"],
    "education_level": "Bachelor",
    "seniority_level": "Senior"
  },
  "job_features": {
    "experience_required": 5,
    "required_skills": ["Python", "FastAPI", "Docker"],
    "department": "Engineering"
  }
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "prediction": {
    "rl_score": 87.5,
    "confidence": 0.92,
    "recommendation": "strong_match",
    "factors": {
      "skills_alignment": 0.95,
      "experience_match": 0.88,
      "historical_performance": 0.85
    },
    "model_version": "rl_v2.1.0",
    "feedback_samples_used": 150
  },
  "predicted_at": "2024-12-09T13:37:00Z"
}
```

**Error Responses:**
- 400 Bad Request: Missing required features
- 503 Service Unavailable: RL service unavailable

**When Called:** AI matching engine requests RL enhancement

**Implemented In:** `services/gateway/routes/rl_routes.py` → `rl_predict_match()`

---

### 15. POST /api/v1/rl/feedback

**Purpose:** Submit feedback to improve RL model

**Authentication:** Bearer token required

**Request:**
```http
POST /api/v1/rl/feedback
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "candidate_id": 123,
  "job_id": 45,
  "prediction_id": "pred_abc123",
  "actual_outcome": "hired",
  "feedback_score": 5,
  "feedback_notes": "Excellent hire, exceeded expectations",
  "submitted_by": "hr_manager_001"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "feedback_id": "fb_xyz789",
  "reward_signal": 1.0,
  "model_updated": true,
  "new_model_version": "rl_v2.1.1",
  "submitted_at": "2024-12-09T13:37:00Z"
}
```

**Sequence:**
1. Validate feedback data
2. Calculate reward signal
3. Store in rl_feedback table
4. Trigger model retraining if threshold met
5. Update model performance metrics

**Error Responses:**
- 400 Bad Request: Invalid feedback data
- 404 Not Found: Prediction not found

**When Called:** HR provides hiring outcome feedback

**Implemented In:** `services/gateway/routes/rl_routes.py` → `submit_rl_feedback()`

---

### 16. GET /api/v1/rl/analytics

**Purpose:** Get RL system analytics and performance metrics

**Authentication:** Bearer token required

**Request:**
```http
GET /api/v1/rl/analytics?time_range=30d
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "status": "success",
  "analytics": {
    "total_predictions": 1234,
    "total_feedback": 567,
    "feedback_rate": 0.46,
    "model_accuracy": 0.87,
    "average_confidence": 0.85,
    "top_performing_features": [
      "skills_alignment",
      "experience_match",
      "education_level"
    ],
    "recent_improvements": {
      "accuracy_delta": 0.05,
      "confidence_delta": 0.03
    },
    "model_version": "rl_v2.1.1",
    "last_retrain": "2024-12-08T10:00:00Z"
  },
  "time_range": "30d",
  "generated_at": "2024-12-09T13:37:00Z"
}
```

**Error Responses:**
- 401 Unauthorized: Invalid API key

**When Called:** Admin dashboard loads RL metrics

**Implemented In:** `services/gateway/routes/rl_routes.py` → `get_rl_analytics()`

---

### 17. GET /api/v1/rl/performance

**Purpose:** Get detailed RL model performance metrics

**Authentication:** Bearer token required

**Request:**
```http
GET /api/v1/rl/performance?model_version=rl_v2.1.1
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "status": "success",
  "performance": {
    "model_version": "rl_v2.1.1",
    "accuracy": 0.87,
    "precision": 0.89,
    "recall": 0.85,
    "f1_score": 0.87,
    "auc_roc": 0.92,
    "confusion_matrix": {
      "true_positive": 450,
      "true_negative": 380,
      "false_positive": 45,
      "false_negative": 58
    },
    "performance_by_category": {
      "engineering": 0.90,
      "marketing": 0.85,
      "sales": 0.82
    },
    "training_data_size": 5000,
    "last_evaluation": "2024-12-09T10:00:00Z"
  },
  "retrieved_at": "2024-12-09T13:37:00Z"
}
```

**Error Responses:**
- 404 Not Found: Model version not found
- 401 Unauthorized: Invalid API key

**When Called:** Admin reviews model performance, ML team monitors metrics

**Implemented In:** `services/gateway/routes/rl_routes.py` → `get_rl_performance()`

---

## Summary Table - Part 1

| Endpoint | Method | Category | Purpose | Auth Required |
|----------|--------|----------|---------|---------------|
| /auth/2fa/setup | POST | Authentication | Setup 2FA | Yes |
| /auth/2fa/verify | POST | Authentication | Verify 2FA code | Yes |
| /auth/login | POST | Authentication | User login | No |
| /auth/2fa/status/{user_id} | GET | Authentication | Check 2FA status | Yes |
| /api/v1/ai/test-communication | POST | AI Integration | Test notifications | Yes |
| /api/v1/ai/gemini/analyze | POST | AI Integration | AI candidate analysis | Yes |
| /api/v1/workflow/trigger | POST | LangGraph | Trigger workflow | Yes |
| /api/v1/workflow/status/{workflow_id} | GET | LangGraph | Get workflow status | Yes |
| /api/v1/workflow/list | GET | LangGraph | List workflows | Yes |
| /api/v1/workflow/health | GET | LangGraph | Check service health | Yes |
| /api/v1/webhooks/candidate-applied | POST | LangGraph | Application webhook | Yes |
| /api/v1/webhooks/candidate-shortlisted | POST | LangGraph | Shortlist webhook | Yes |
| /api/v1/webhooks/interview-scheduled | POST | LangGraph | Interview webhook | Yes |
| /api/v1/rl/predict | POST | RL + Feedback | RL prediction | Yes |
| /api/v1/rl/feedback | POST | RL + Feedback | Submit feedback | Yes |
| /api/v1/rl/analytics | GET | RL + Feedback | Get analytics | Yes |
| /api/v1/rl/performance | GET | RL + Feedback | Get performance | Yes |

**Total Endpoints in Part 1:** 17 of 114

---

**Continue to:** [API_CONTRACT_PART2.md](./API_CONTRACT_PART2.md) for Gateway Core Features
