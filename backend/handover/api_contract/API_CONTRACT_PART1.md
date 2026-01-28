# API Contract — BHIV HR Platform

**Version:** 4.1.0  
**Last Updated:** January 22, 2026  
**Total Endpoints:** 111 (80 Gateway + 6 Agent + 25 LangGraph)  
**Documentation Style:** Stripe API Standard  
**Analysis Source:** Comprehensive endpoint analysis from services directories

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

**1. API Key Authentication (Service-to-Service)**
```http
Authorization: Bearer <API_KEY_SECRET>
```
- **Environment Variable:** `API_KEY_SECRET`
- **Used for:** Internal service calls, admin operations
- **Implementation:** All services support API key validation

**2. Client JWT Token (Client Portal)**
```http
Authorization: Bearer <client_jwt_token>
```
- **Environment Variable:** `JWT_SECRET_KEY`
- **Role:** `client`
- **Expiration:** 24 hours
- **Algorithm:** HS256

**3. Candidate JWT Token (Candidate/Recruiter Portal)**
```http
Authorization: Bearer <candidate_jwt_token>
```
- **Environment Variable:** `CANDIDATE_JWT_SECRET_KEY`
- **Roles:** `candidate`, `recruiter`
- **Expiration:** 24 hours
- **Algorithm:** HS256

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

**Dynamic Rate Limits (CPU-based adjustment: 50-150% of base):**
- **Default Tier:** 60 requests/minute
- **Premium Tier:** 300 requests/minute

**Endpoint-Specific Limits:**
- `/v1/jobs`: 100/min (default), 500/min (premium)
- `/v1/candidates/search`: 50/min (default), 200/min (premium)
- `/v1/match`: 20/min (default), 100/min (premium)
- `/v1/candidates/bulk`: 5/min (default), 25/min (premium)

**Rate Limit Headers:**
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1702134000
```

### Timeout Configurations
- **Gateway Service:** 60s for AI matching, 120s for batch operations
- **Agent Service:** 60s for semantic matching, 120s for batch matching
- **LangGraph Service:** 30s for workflow calls, 120s for RL operations

---

## Gateway Authentication

### 1. POST /auth/2fa/setup

**Purpose:** Initialize 2FA for user account with QR code generation

**Authentication:** Bearer token required

**Implementation:** `services/gateway/app/main.py` → `setup_2fa()`

**Timeout:** 30s

**Request:**
```http
POST /auth/2fa/setup
Content-Type: application/json
Authorization: Bearer <API_KEY_SECRET>

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

---

### 2. POST /auth/2fa/verify

**Purpose:** Verify TOTP code during 2FA authentication

**Authentication:** Bearer token required

**Implementation:** `services/gateway/app/main.py` → `verify_2fa()`

**Timeout:** 10s

**Request:**
```http
POST /auth/2fa/verify
Content-Type: application/json
Authorization: Bearer <API_KEY_SECRET>

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

---

### 3. POST /auth/login

**Purpose:** User login with 2FA support

**Authentication:** None (public endpoint)

**Implementation:** `services/gateway/app/main.py` → `login_with_2fa()`

**Timeout:** 15s

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

---

### 4. GET /auth/2fa/status/{user_id}

**Purpose:** Check 2FA status for user

**Authentication:** Bearer token required

**Implementation:** `services/gateway/app/main.py` → `get_2fa_status()`

**Timeout:** 5s

**Request:**
```http
GET /auth/2fa/status/user_12345
Authorization: Bearer <API_KEY_SECRET>
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

---

## Gateway AI Integration

### 5. POST /api/v1/ai/test-communication

**Purpose:** Test multi-channel communication system (Email, WhatsApp, Telegram)

**Authentication:** Bearer token required

**Implementation:** `services/gateway/routes/ai_integration.py` → `test_communication_system()`

**Timeout:** 60s

**Request:**
```http
POST /api/v1/ai/test-communication
Content-Type: application/json
Authorization: Bearer <API_KEY_SECRET>

{
  "channel": "email",
  "recipient_email": "test@example.com",
  "phone": "+1234567890",
  "chat_id": "123456789",
  "subject": "Test Email",
  "message": "Test message"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "result": {
    "sent": true,
    "message_id": "msg_abc123",
    "provider": "langgraph_service"
  }
}
```

**Error Responses:**
- 500 Internal Server Error: Communication service unavailable
- 400 Bad Request: Invalid channel or recipient data
- 504 Gateway Timeout: LangGraph service timeout

**When Called:** Admin tests notification system

**Note:** Proxies to LangGraph service communication endpoints

---

### 6. POST /api/v1/ai/gemini/analyze

**Purpose:** Analyze text using Google Gemini AI

**Authentication:** Bearer token required

**Implementation:** `services/gateway/routes/ai_integration.py` → `analyze_with_gemini()`

**Timeout:** 45s

**Request:**
```http
POST /api/v1/ai/gemini/analyze
Content-Type: application/json
Authorization: Bearer <API_KEY_SECRET>

{
  "text": "Candidate resume or job description text",
  "analysis_type": "resume"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "analysis": "AI-generated analysis of the provided text",
  "analysis_type": "resume",
  "model": "gemini-pro"
}
```

**Error Responses:**
- 400 Bad Request: Missing text or invalid analysis_type
- 503 Service Unavailable: Gemini API unavailable or not configured

**When Called:** HR requests AI analysis of candidate or job description

**Analysis Types:** `resume`, `job_description`, `match`

**Environment Variable Required:** `GEMINI_API_KEY`

---

## Gateway LangGraph Workflows

### 7. POST /api/v1/workflow/trigger

**Purpose:** Trigger LangGraph workflow for candidate processing

**Authentication:** Bearer token required

**Implementation:** `services/gateway/langgraph_integration.py` → `trigger_workflow()`

**Timeout:** 30s

**Request:**
```http
POST /api/v1/workflow/trigger
Content-Type: application/json
Authorization: Bearer <API_KEY_SECRET>

{
  "candidate_id": "123",
  "job_id": "456",
  "candidate_name": "John Doe",
  "candidate_email": "john@example.com",
  "candidate_phone": "+1234567890",
  "job_title": "Software Engineer",
  "trigger_type": "candidate_applied"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Workflow triggered successfully",
  "workflow_id": "wf_abc123",
  "status": "started",
  "trigger_type": "candidate_applied",
  "triggered_at": "2024-12-09T13:37:00Z"
}
```

**Error Responses:**
- 500 Internal Server Error: LangGraph service unavailable
- 400 Bad Request: Missing required fields

**When Called:** Candidate applies for job, workflow automation needed

---

### 8. GET /api/v1/workflow/status/{workflow_id}

**Purpose:** Get detailed workflow status and progress

**Authentication:** Bearer token required

**Implementation:** `services/gateway/langgraph_integration.py` → `get_workflow_status()`

**Timeout:** 15s

**Request:**
```http
GET /api/v1/workflow/status/wf_abc123
Authorization: Bearer <API_KEY_SECRET>
```

**Response (200 OK):**
```json
{
  "workflow_id": "wf_abc123",
  "status": "running",
  "current_stage": "ai_analysis",
  "progress": {
    "percentage": 65,
    "current_step": "Running AI matching analysis",
    "total_steps": 6
  },
  "results": {
    "matching_score": 85.5,
    "ai_recommendation": "Strong candidate"
  },
  "updated_at": "2024-12-09T13:37:00Z"
}
```

**Error Responses:**
- 404 Not Found: Workflow not found
- 500 Internal Server Error: Status retrieval failed

**When Called:** Monitor workflow progress, check completion status

---

### 9. GET /api/v1/workflow/list

**Purpose:** List all workflows with filtering options

**Authentication:** Bearer token required

**Implementation:** `services/gateway/langgraph_integration.py` → `list_workflows()`

**Timeout:** 10s

**Request:**
```http
GET /api/v1/workflow/list?status=active&limit=50
Authorization: Bearer <API_KEY_SECRET>
```

**Response (200 OK):**
```json
{
  "workflows": [
    {
      "workflow_id": "wf_abc123",
      "status": "running",
      "candidate_name": "John Doe",
      "job_title": "Software Engineer",
      "created_at": "2024-12-09T13:30:00Z"
    }
  ],
  "count": 1,
  "retrieved_at": "2024-12-09T13:37:00Z"
}
```

**Parameters:**
- `status`: Filter by workflow status (optional)
- `limit`: Maximum workflows to return (default: 50)

**When Called:** Dashboard workflow overview, admin monitoring

---

### 10. GET /api/v1/workflows

**Purpose:** Alternative workflow listing endpoint

**Authentication:** Bearer token required

**Implementation:** `services/gateway/langgraph_integration.py` → `list_workflows_alt()`

**Timeout:** 10s

**Note:** Identical functionality to `/api/v1/workflow/list`

---

### 11. GET /api/v1/workflow/health

**Purpose:** Check LangGraph service health and connectivity

**Authentication:** Bearer token required

**Implementation:** `services/gateway/langgraph_integration.py` → `check_langgraph_health()`

**Timeout:** 5s

**Request:**
```http
GET /api/v1/workflow/health
Authorization: Bearer <API_KEY_SECRET>
```

**Response (200 OK):**
```json
{
  "langgraph_status": "connected",
  "service_status": "healthy",
  "version": "1.0.0",
  "checked_at": "2024-12-09T13:37:00Z"
}
```

**Error Response:**
```json
{
  "langgraph_status": "disconnected",
  "error": "Connection timeout",
  "checked_at": "2024-12-09T13:37:00Z"
}
```

**When Called:** System health checks, service monitoring

---

### 12. POST /api/v1/webhooks/candidate-applied

**Purpose:** Webhook for candidate application events with workflow automation

**Authentication:** Bearer token required

**Implementation:** `services/gateway/langgraph_integration.py` → `webhook_candidate_applied()`

**Timeout:** 30s

**Request:**
```http
POST /api/v1/webhooks/candidate-applied
Content-Type: application/json
Authorization: Bearer <API_KEY_SECRET>

{
  "candidate_id": "123",
  "job_id": "456",
  "candidate_name": "John Doe",
  "candidate_email": "john@example.com",
  "job_title": "Software Engineer"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Workflow triggered successfully",
  "workflow_id": "wf_abc123",
  "status": "started",
  "trigger_type": "candidate_applied",
  "triggered_at": "2024-12-09T13:37:00Z"
}
```

**When Called:** External systems notify of candidate applications

---

### 13. POST /api/v1/webhooks/candidate-shortlisted

**Purpose:** Webhook for candidate shortlisting events with notification automation

**Authentication:** Bearer token required

**Implementation:** `services/gateway/langgraph_integration.py` → `webhook_candidate_shortlisted()`

**Timeout:** 30s

**Request:**
```http
POST /api/v1/webhooks/candidate-shortlisted
Content-Type: application/json
Authorization: Bearer <API_KEY_SECRET>

{
  "candidate_id": "123",
  "job_id": "456",
  "candidate_name": "John Doe",
  "candidate_email": "john@example.com",
  "candidate_phone": "+1234567890",
  "job_title": "Software Engineer"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Shortlist notification triggered",
  "status": "notification_sent",
  "trigger_type": "candidate_shortlisted",
  "triggered_at": "2024-12-09T13:37:00Z"
}
```

**Features:**
- Automatically sends congratulatory notifications
- Multi-channel delivery (email + WhatsApp)
- Customized message templates

---

## Gateway RL + Feedback Agent

### 14. POST /api/v1/rl/predict

**Purpose:** RL-enhanced candidate matching prediction (proxies to LangGraph)

**Authentication:** Bearer token required

**Implementation:** `services/gateway/routes/rl_routes.py` → `rl_predict_match()`

**Timeout:** 120s (proxies to LangGraph service)

**Request:**
```http
POST /api/v1/rl/predict
Content-Type: application/json
Authorization: Bearer <API_KEY_SECRET>

{
  "candidate_id": 123,
  "job_id": 456,
  "candidate_features": {
    "experience_years": 5,
    "skills": ["Python", "FastAPI", "MongoDB"]
  },
  "job_features": {
    "required_experience": 3,
    "required_skills": ["Python", "FastAPI"]
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "prediction_id": "pred_123",
    "rl_prediction": {
      "rl_score": 0.85,
      "confidence_level": 0.92,
      "decision_type": "recommend",
      "model_version": "v1.0.0"
    },
    "feedback_samples_used": 150
  },
  "message": "RL prediction completed successfully",
  "timestamp": "2024-12-09T13:37:00Z"
}
```

**Error Responses:**
- 500 Internal Server Error: LangGraph service unavailable
- 400 Bad Request: Invalid request format

**When Called:** AI matching with reinforcement learning enhancement

---

### 15. POST /api/v1/rl/feedback

**Purpose:** Submit feedback for RL learning (proxies to LangGraph)

**Authentication:** Bearer token required

**Implementation:** `services/gateway/routes/rl_routes.py` → `submit_rl_feedback()`

**Timeout:** 120s (proxies to LangGraph service)

**Request:**
```http
POST /api/v1/rl/feedback
Content-Type: application/json
Authorization: Bearer <API_KEY_SECRET>

{
  "prediction_id": "pred_123",
  "candidate_id": 123,
  "job_id": 456,
  "actual_outcome": "hired",
  "feedback_score": 0.9,
  "feedback_source": "hr_manager",
  "feedback_notes": "Excellent candidate, great cultural fit"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "feedback_id": "fb_456",
    "reward_signal": 0.85,
    "processed_feedback": {
      "actual_outcome": "hired",
      "feedback_score": 0.9,
      "reward_signal": 0.85
    }
  },
  "message": "RL feedback submitted successfully",
  "timestamp": "2024-12-09T13:37:00Z"
}
```

**When Called:** HR provides feedback on matching predictions

---

### 16. GET /api/v1/rl/analytics

**Purpose:** Get RL system analytics and performance metrics (proxies to LangGraph)

**Authentication:** Bearer token required

**Implementation:** `services/gateway/routes/rl_routes.py` → `get_rl_analytics()`

**Timeout:** 120s (proxies to LangGraph service)

**Request:**
```http
GET /api/v1/rl/analytics
Authorization: Bearer <API_KEY_SECRET>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "rl_analytics": {
      "total_predictions": 1250,
      "total_feedback": 890,
      "average_accuracy": 0.87,
      "model_performance": {
        "precision": 0.85,
        "recall": 0.82,
        "f1_score": 0.83
      }
    },
    "system_status": "operational"
  },
  "message": "RL analytics retrieved successfully",
  "timestamp": "2024-12-09T13:37:00Z"
}
```

**When Called:** Dashboard analytics, system performance monitoring

---

### 17. GET /api/v1/rl/performance

**Purpose:** Get RL performance metrics (proxies to LangGraph)

**Authentication:** Bearer token required

**Implementation:** `services/gateway/routes/rl_routes.py` → `get_rl_performance()`

**Timeout:** 120s (proxies to LangGraph service)

**Request:**
```http
GET /api/v1/rl/performance
Authorization: Bearer <API_KEY_SECRET>
```

**Response (200 OK):**
```json
{
  "current_metrics": {
    "total_predictions": 1250,
    "accuracy": 0.87,
    "model_version": "v1.0.0"
  },
  "monitoring_status": "active",
  "retrieved_at": "2024-12-09T13:37:00Z"
}
```

**When Called:** Performance monitoring, model evaluation

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

**Total Endpoints in Part 1:** 17 (1-17 of 111)

---

**Continue to:** [API_CONTRACT_PART2.md](./API_CONTRACT_PART2.md) for Gateway Core Features
