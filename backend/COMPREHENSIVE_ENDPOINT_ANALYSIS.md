# COMPREHENSIVE ENDPOINT ANALYSIS
**BHIV HR Platform - Complete API Endpoint Documentation**

**Analysis Date:** January 22, 2026  
**Total Endpoints Analyzed:** 111 (80 Gateway + 6 Agent + 25 LangGraph)  
**Services Analyzed:** Gateway (Port 8000), Agent (Port 9000), LangGraph (Port 9001)

---

## EXECUTIVE SUMMARY

This comprehensive analysis covers all API endpoints across the three core services of the BHIV HR Platform. Each endpoint has been analyzed for:

- **Route & HTTP Method**
- **Authentication Requirements** 
- **Request/Response Specifications**
- **Timeout Configurations**
- **Implementation Details**
- **Parameter Validation**

---

## AUTHENTICATION FRAMEWORK

### Authentication Methods
1. **API Key Authentication** - Service-to-service communication
   - Header: `Authorization: Bearer <API_KEY_SECRET>`
   - Used for: Internal service calls, admin operations

2. **Client JWT Token** - Client portal authentication
   - Secret: `JWT_SECRET_KEY`
   - Header: `Authorization: Bearer <client_jwt_token>`
   - Role: `client`

3. **Candidate JWT Token** - Candidate/Recruiter portal authentication
   - Secret: `CANDIDATE_JWT_SECRET_KEY`
   - Header: `Authorization: Bearer <candidate_jwt_token>`
   - Roles: `candidate`, `recruiter`

### Timeout Configurations
- **Gateway Service:** 60s for AI matching, 120s for batch operations
- **Agent Service:** 60s for semantic matching, 120s for batch matching
- **LangGraph Service:** 30s for workflow calls, 120s for RL operations

---

## SERVICE 1: GATEWAY API (Port 8000)
**Total Endpoints:** 80  
**Base URL:** http://localhost:8000 (Local) | https://bhiv-hr-gateway-ltg0.onrender.com (Production)

### AUTHENTICATION ENDPOINTS (4)

#### 1. POST /auth/2fa/setup
- **Authentication:** Bearer token required
- **Purpose:** Initialize 2FA with QR code generation
- **Implementation:** `services/gateway/app/main.py` → `setup_2fa()`
- **Timeout:** 30s
- **Request:**
```json
{
  "user_id": "user_12345"
}
```
- **Response:** QR code, secret key, manual entry instructions

#### 2. POST /auth/2fa/verify
- **Authentication:** Bearer token required
- **Purpose:** Verify TOTP code during authentication
- **Implementation:** `services/gateway/app/main.py` → `verify_2fa()`
- **Timeout:** 10s
- **Request:**
```json
{
  "user_id": "user_12345",
  "totp_code": "123456"
}
```

#### 3. POST /auth/login
- **Authentication:** None (public endpoint)
- **Purpose:** User login with 2FA support
- **Implementation:** `services/gateway/app/main.py` → `login_with_2fa()`
- **Timeout:** 15s
- **Request:**
```json
{
  "username": "demo_user",
  "password": "demo_password",
  "totp_code": "123456"
}
```

#### 4. GET /auth/2fa/status/{user_id}
- **Authentication:** Bearer token required
- **Purpose:** Check 2FA status for user
- **Implementation:** `services/gateway/app/main.py` → `get_2fa_status()`
- **Timeout:** 5s

### AI INTEGRATION ENDPOINTS (2)

#### 5. POST /api/v1/ai/test-communication
- **Authentication:** Bearer token required
- **Purpose:** Test multi-channel communication (Email, WhatsApp, Telegram)
- **Implementation:** `services/gateway/routes/ai_integration.py` → `test_communication_system()`
- **Timeout:** 60s
- **Request:**
```json
{
  "test_type": "all_channels",
  "recipient_email": "test@example.com",
  "recipient_phone": "+1234567890",
  "telegram_chat_id": "123456789"
}
```

#### 6. POST /api/v1/ai/gemini/analyze
- **Authentication:** Bearer token required
- **Purpose:** Analyze candidate profile using Google Gemini AI
- **Implementation:** `services/gateway/routes/ai_integration.py` → `analyze_with_gemini()`
- **Timeout:** 45s
- **Request:**
```json
{
  "candidate_id": 123,
  "analysis_type": "comprehensive",
  "include_recommendations": true
}
```

### LANGGRAPH WORKFLOW ENDPOINTS (7)

#### 7. POST /api/v1/workflow/trigger
- **Authentication:** Bearer token required
- **Purpose:** Trigger LangGraph workflow
- **Implementation:** `services/gateway/langgraph_integration.py` → `trigger_workflow()`
- **Timeout:** 30s
- **Request:**
```json
{
  "candidate_id": "123",
  "job_id": "456",
  "candidate_name": "John Doe",
  "candidate_email": "john@example.com",
  "job_title": "Software Engineer"
}
```

#### 8. GET /api/v1/workflow/status/{workflow_id}
- **Authentication:** Bearer token required
- **Purpose:** Get workflow status
- **Implementation:** `services/gateway/langgraph_integration.py` → `get_workflow_status()`
- **Timeout:** 15s

#### 9. GET /api/v1/workflow/list
- **Authentication:** Bearer token required
- **Purpose:** List all workflows
- **Implementation:** `services/gateway/langgraph_integration.py` → `list_workflows()`
- **Timeout:** 10s

#### 10. GET /api/v1/workflows
- **Authentication:** Bearer token required
- **Purpose:** Alternative workflow listing endpoint
- **Implementation:** `services/gateway/langgraph_integration.py` → `list_workflows_alt()`
- **Timeout:** 10s

#### 11. GET /api/v1/workflow/health
- **Authentication:** Bearer token required
- **Purpose:** Check LangGraph service health
- **Implementation:** `services/gateway/langgraph_integration.py` → `check_langgraph_health()`
- **Timeout:** 5s

#### 12. POST /api/v1/webhooks/candidate-applied
- **Authentication:** Bearer token required
- **Purpose:** Webhook for candidate application events
- **Implementation:** `services/gateway/langgraph_integration.py` → `webhook_candidate_applied()`
- **Timeout:** 30s

#### 13. POST /api/v1/webhooks/candidate-shortlisted
- **Authentication:** Bearer token required
- **Purpose:** Webhook for candidate shortlisting events
- **Implementation:** `services/gateway/langgraph_integration.py` → `webhook_candidate_shortlisted()`
- **Timeout:** 30s

### RL + FEEDBACK AGENT ENDPOINTS (4)

#### 14. POST /api/v1/rl/predict
- **Authentication:** Bearer token required
- **Purpose:** RL-enhanced candidate matching prediction
- **Implementation:** `services/gateway/routes/rl_routes.py` → `rl_predict_match()`
- **Timeout:** 120s (proxies to LangGraph)

#### 15. POST /api/v1/rl/feedback
- **Authentication:** Bearer token required
- **Purpose:** Submit feedback for RL learning
- **Implementation:** `services/gateway/routes/rl_routes.py` → `submit_rl_feedback()`
- **Timeout:** 120s (proxies to LangGraph)

#### 16. GET /api/v1/rl/analytics
- **Authentication:** Bearer token required
- **Purpose:** Get RL system analytics
- **Implementation:** `services/gateway/routes/rl_routes.py` → `get_rl_analytics()`
- **Timeout:** 120s (proxies to LangGraph)

#### 17. GET /api/v1/rl/performance
- **Authentication:** Bearer token required
- **Purpose:** Get RL performance metrics
- **Implementation:** `services/gateway/routes/rl_routes.py` → `get_rl_performance()`
- **Timeout:** 120s (proxies to LangGraph)

### MONITORING ENDPOINTS (3)

#### 18. GET /metrics
- **Authentication:** None (public)
- **Purpose:** Prometheus metrics export
- **Implementation:** `services/gateway/app/main.py` → `get_prometheus_metrics()`
- **Timeout:** 5s

#### 19. GET /health/detailed
- **Authentication:** None (public)
- **Purpose:** Detailed health check with metrics
- **Implementation:** `services/gateway/app/main.py` → `detailed_health_check()`
- **Timeout:** 10s

#### 20. GET /metrics/dashboard
- **Authentication:** None (public)
- **Purpose:** Metrics dashboard data
- **Implementation:** `services/gateway/app/main.py` → `metrics_dashboard()`
- **Timeout:** 15s

### CORE API ENDPOINTS (5)

#### 21. GET /openapi.json
- **Authentication:** None (public)
- **Purpose:** OpenAPI schema
- **Implementation:** `services/gateway/app/main.py` → `get_openapi()`
- **Timeout:** 5s

#### 22. GET /docs
- **Authentication:** None (public)
- **Purpose:** API documentation
- **Implementation:** `services/gateway/app/main.py` → `get_docs()`
- **Timeout:** 5s

#### 23. GET /
- **Authentication:** None (public)
- **Purpose:** API root information
- **Implementation:** `services/gateway/app/main.py` → `read_root()`
- **Timeout:** 2s

#### 24. GET /health
- **Authentication:** None (public)
- **Purpose:** Basic health check
- **Implementation:** `services/gateway/app/main.py` → `health_check()`
- **Timeout:** 5s

#### 25. GET /v1/test-candidates
- **Authentication:** Bearer token required
- **Purpose:** Database connectivity test
- **Implementation:** `services/gateway/app/main.py` → `test_candidates_db()`
- **Timeout:** 10s

### JOB MANAGEMENT ENDPOINTS (2)

#### 26. POST /v1/jobs
- **Authentication:** Bearer token required
- **Purpose:** Create new job posting
- **Implementation:** `services/gateway/app/main.py` → `create_job()`
- **Timeout:** 15s
- **Request:**
```json
{
  "title": "Senior Software Engineer",
  "department": "Engineering",
  "location": "Remote",
  "experience_level": "senior",
  "requirements": "5+ years Python, FastAPI",
  "description": "Join our team to build scalable HR solutions"
}
```

#### 27. GET /v1/jobs
- **Authentication:** None (public)
- **Purpose:** List all active jobs
- **Implementation:** `services/gateway/app/main.py` → `list_jobs()`
- **Timeout:** 10s

### CANDIDATE MANAGEMENT ENDPOINTS (5)

#### 28. GET /v1/candidates
- **Authentication:** Bearer token required
- **Purpose:** Get all candidates with pagination
- **Implementation:** `services/gateway/app/main.py` → `get_all_candidates()`
- **Timeout:** 15s
- **Parameters:** `limit` (default: 50), `offset` (default: 0)

#### 29. GET /v1/candidates/search
- **Authentication:** Bearer token required
- **Purpose:** Search and filter candidates
- **Implementation:** `services/gateway/app/main.py` → `search_candidates()`
- **Timeout:** 20s
- **Parameters:** `skills`, `location`, `experience_min`
- **Validation:** Skills max 200 chars, location max 100 chars

#### 30. GET /v1/candidates/job/{job_id}
- **Authentication:** Bearer token required
- **Purpose:** Get candidates for specific job (dynamic matching)
- **Implementation:** `services/gateway/app/main.py` → `get_candidates_by_job()`
- **Timeout:** 15s

#### 31. GET /v1/candidates/{candidate_id}
- **Authentication:** Bearer token required
- **Purpose:** Get specific candidate by ID
- **Implementation:** `services/gateway/app/main.py` → `get_candidate_by_id()`
- **Timeout:** 10s

#### 32. POST /v1/candidates/bulk
- **Authentication:** Bearer token required
- **Purpose:** Bulk upload candidates
- **Implementation:** `services/gateway/app/main.py` → `bulk_upload_candidates()`
- **Timeout:** 60s
- **Validation:** Email uniqueness, required fields

### ANALYTICS & STATISTICS ENDPOINTS (3)

#### 33. GET /v1/candidates/stats
- **Authentication:** Bearer token required
- **Purpose:** Dynamic candidate statistics for HR dashboard
- **Implementation:** `services/gateway/app/main.py` → `get_candidate_stats()`
- **Timeout:** 15s

#### 34. GET /v1/database/schema
- **Authentication:** Bearer token required
- **Purpose:** Get database schema information (MongoDB)
- **Implementation:** `services/gateway/app/main.py` → `get_database_schema()`
- **Timeout:** 10s

#### 35. GET /v1/reports/job/{job_id}/export.csv
- **Authentication:** Bearer token required
- **Purpose:** Export job report
- **Implementation:** `services/gateway/app/main.py` → `export_job_report()`
- **Timeout:** 30s

### AI MATCHING ENGINE ENDPOINTS (2)

#### 36. GET /v1/match/{job_id}/top
- **Authentication:** Bearer token or JWT required
- **Purpose:** AI-powered semantic candidate matching via Agent Service
- **Implementation:** `services/gateway/app/main.py` → `get_top_matches()`
- **Timeout:** 60s
- **Parameters:** `limit` (1-50, default: 10)
- **Fallback:** Database matching if Agent service unavailable

#### 37. POST /v1/match/batch
- **Authentication:** Bearer token required
- **Purpose:** Batch AI matching for multiple jobs
- **Implementation:** `services/gateway/app/main.py` → `batch_match_jobs()`
- **Timeout:** 120s
- **Request:**
```json
{
  "job_ids": ["job1", "job2"],
  "limit": 10
}
```
- **Validation:** Max 10 jobs per batch

### ASSESSMENT & WORKFLOW ENDPOINTS (6)

#### 38. POST /v1/feedback
- **Authentication:** JWT token required
- **Purpose:** Values assessment submission
- **Implementation:** `services/gateway/app/main.py` → `submit_feedback()`
- **Timeout:** 15s
- **Request:**
```json
{
  "candidate_id": "123",
  "job_id": "456",
  "integrity": 8,
  "honesty": 9,
  "discipline": 7,
  "hard_work": 8,
  "gratitude": 9,
  "comments": "Excellent candidate"
}
```

#### 39. GET /v1/feedback
- **Authentication:** JWT token required
- **Purpose:** Get all feedback records with filtering
- **Implementation:** `services/gateway/app/main.py` → `get_all_feedback()`
- **Timeout:** 20s
- **Parameters:** `candidate_id` (optional)

#### 40. GET /v1/interviews
- **Authentication:** JWT token required
- **Purpose:** Get all interviews with filtering
- **Implementation:** `services/gateway/app/main.py` → `get_interviews()`
- **Timeout:** 15s
- **Parameters:** `candidate_id` (optional)

#### 41. POST /v1/interviews
- **Authentication:** Bearer token required
- **Purpose:** Schedule interview
- **Implementation:** `services/gateway/app/main.py` → `schedule_interview()`
- **Timeout:** 15s

#### 42. GET /v1/offers
- **Authentication:** JWT token required
- **Purpose:** Get all job offers with filtering
- **Implementation:** `services/gateway/app/main.py` → `get_all_offers()`
- **Timeout:** 15s
- **Parameters:** `candidate_id` (optional)

#### 43. POST /v1/offers
- **Authentication:** Bearer token required
- **Purpose:** Create job offer
- **Implementation:** `services/gateway/app/main.py` → `create_job_offer()`
- **Timeout:** 15s

### CLIENT PORTAL API ENDPOINTS (2)

#### 44. POST /v1/client/register
- **Authentication:** None (public)
- **Purpose:** Client registration
- **Implementation:** `services/gateway/app/main.py` → `client_register()`
- **Timeout:** 20s
- **Validation:** Email uniqueness, client_id uniqueness

#### 45. POST /v1/client/login
- **Authentication:** None (public)
- **Purpose:** Client authentication with database integration
- **Implementation:** `services/gateway/app/main.py` → `client_login()`
- **Timeout:** 15s
- **Features:** Account locking, failed attempt tracking

### SECURITY TESTING ENDPOINTS (12)

#### 46. GET /v1/security/rate-limit-status
- **Authentication:** Bearer token required
- **Purpose:** Check rate limit status
- **Implementation:** `services/gateway/app/main.py` → `check_rate_limit_status()`
- **Timeout:** 5s

#### 47. GET /v1/security/blocked-ips
- **Authentication:** Bearer token required
- **Purpose:** View blocked IPs
- **Implementation:** `services/gateway/app/main.py` → `view_blocked_ips()`
- **Timeout:** 5s

#### 48. POST /v1/security/test-input-validation
- **Authentication:** Bearer token required
- **Purpose:** Test input validation (XSS/SQL injection detection)
- **Implementation:** `services/gateway/app/main.py` → `test_input_validation()`
- **Timeout:** 10s

#### 49. POST /v1/security/validate-email
- **Authentication:** Bearer token required
- **Purpose:** Email validation
- **Implementation:** `services/gateway/app/main.py` → `validate_email()`
- **Timeout:** 5s

#### 50. POST /v1/security/test-email-validation
- **Authentication:** Bearer token required
- **Purpose:** Test email validation
- **Implementation:** `services/gateway/app/main.py` → `test_email_validation()`
- **Timeout:** 5s

#### 51. POST /v1/security/validate-phone
- **Authentication:** Bearer token required
- **Purpose:** Phone validation (Indian format)
- **Implementation:** `services/gateway/app/main.py` → `validate_phone()`
- **Timeout:** 5s

#### 52. POST /v1/security/test-phone-validation
- **Authentication:** Bearer token required
- **Purpose:** Test phone validation
- **Implementation:** `services/gateway/app/main.py` → `test_phone_validation()`
- **Timeout:** 5s

#### 53. GET /v1/security/test-headers
- **Authentication:** Bearer token required
- **Purpose:** Security headers test
- **Implementation:** `services/gateway/app/main.py` → `test_security_headers()`
- **Timeout:** 5s

#### 54. GET /v1/security/security-headers-test
- **Authentication:** Bearer token required
- **Purpose:** Legacy security headers test
- **Implementation:** `services/gateway/app/main.py` → `test_security_headers_legacy()`
- **Timeout:** 5s

#### 55. POST /v1/security/penetration-test
- **Authentication:** Bearer token required
- **Purpose:** Penetration test
- **Implementation:** `services/gateway/app/main.py` → `penetration_test()`
- **Timeout:** 30s

#### 56. GET /v1/security/test-auth
- **Authentication:** Bearer token required
- **Purpose:** Test authentication
- **Implementation:** `services/gateway/app/main.py` → `test_authentication()`
- **Timeout:** 5s

#### 57. GET /v1/security/penetration-test-endpoints
- **Authentication:** Bearer token required
- **Purpose:** List penetration testing endpoints
- **Implementation:** `services/gateway/app/main.py` → `penetration_test_endpoints()`
- **Timeout:** 5s

### CSP MANAGEMENT ENDPOINTS (4)

#### 58. POST /v1/security/csp-report
- **Authentication:** Bearer token required
- **Purpose:** CSP violation reporting
- **Implementation:** `services/gateway/app/main.py` → `csp_violation_reporting()`
- **Timeout:** 10s

#### 59. GET /v1/security/csp-violations
- **Authentication:** Bearer token required
- **Purpose:** View CSP violations
- **Implementation:** `services/gateway/app/main.py` → `view_csp_violations()`
- **Timeout:** 10s

#### 60. GET /v1/security/csp-policies
- **Authentication:** Bearer token required
- **Purpose:** Current CSP policies
- **Implementation:** `services/gateway/app/main.py` → `current_csp_policies()`
- **Timeout:** 5s

#### 61. POST /v1/security/test-csp-policy
- **Authentication:** Bearer token required
- **Purpose:** Test CSP policy
- **Implementation:** `services/gateway/app/main.py` → `test_csp_policy()`
- **Timeout:** 10s

### TWO-FACTOR AUTHENTICATION ENDPOINTS (8)

#### 62. POST /v1/auth/2fa/setup
- **Authentication:** Bearer token required
- **Purpose:** Setup 2FA
- **Implementation:** `services/gateway/app/main.py` → `setup_2fa()`
- **Timeout:** 15s

#### 63. POST /v1/auth/2fa/verify
- **Authentication:** Bearer token required
- **Purpose:** Verify 2FA
- **Implementation:** `services/gateway/app/main.py` → `verify_2fa()`
- **Timeout:** 10s

#### 64. POST /v1/auth/2fa/login
- **Authentication:** Bearer token required
- **Purpose:** 2FA login
- **Implementation:** `services/gateway/app/main.py` → `login_2fa()`
- **Timeout:** 15s

#### 65. GET /v1/auth/2fa/status/{user_id}
- **Authentication:** Bearer token required
- **Purpose:** Get 2FA status
- **Implementation:** `services/gateway/app/main.py` → `get_2fa_status_auth()`
- **Timeout:** 5s

#### 66. POST /v1/auth/2fa/disable
- **Authentication:** Bearer token required
- **Purpose:** Disable 2FA
- **Implementation:** `services/gateway/app/main.py` → `disable_2fa_auth()`
- **Timeout:** 10s

#### 67. POST /v1/auth/2fa/backup-codes
- **Authentication:** Bearer token required
- **Purpose:** Generate backup codes
- **Implementation:** `services/gateway/app/main.py` → `generate_backup_codes_auth()`
- **Timeout:** 10s

#### 68. POST /v1/auth/2fa/test-token
- **Authentication:** Bearer token required
- **Purpose:** Test 2FA token
- **Implementation:** `services/gateway/app/main.py` → `test_2fa_token_auth()`
- **Timeout:** 10s

#### 69. GET /v1/auth/2fa/qr/{user_id}
- **Authentication:** Bearer token required
- **Purpose:** Get QR code
- **Implementation:** `services/gateway/app/main.py` → `get_qr_code()`
- **Timeout:** 10s

### PASSWORD MANAGEMENT ENDPOINTS (6)

#### 70. POST /v1/auth/password/validate
- **Authentication:** Bearer token required
- **Purpose:** Validate password strength
- **Implementation:** `services/gateway/app/main.py` → `validate_password()`
- **Timeout:** 5s

#### 71. GET /v1/auth/password/generate
- **Authentication:** Bearer token required
- **Purpose:** Generate secure password
- **Implementation:** `services/gateway/app/main.py` → `generate_password()`
- **Timeout:** 5s
- **Parameters:** `length` (8-128), `include_symbols` (boolean)

#### 72. GET /v1/auth/password/policy
- **Authentication:** Bearer token required
- **Purpose:** Get password policy
- **Implementation:** `services/gateway/app/main.py` → `get_password_policy_auth()`
- **Timeout:** 5s

#### 73. POST /v1/auth/password/change
- **Authentication:** Bearer token required
- **Purpose:** Change password
- **Implementation:** `services/gateway/app/main.py` → `change_password_auth()`
- **Timeout:** 15s

#### 74. POST /v1/auth/password/strength
- **Authentication:** Bearer token required
- **Purpose:** Test password strength
- **Implementation:** `services/gateway/app/main.py` → `test_password_strength()`
- **Timeout:** 5s

#### 75. GET /v1/auth/password/security-tips
- **Authentication:** Bearer token required
- **Purpose:** Get security tips
- **Implementation:** `services/gateway/app/main.py` → `get_security_tips()`
- **Timeout:** 5s

### CANDIDATE PORTAL ENDPOINTS (5)

#### 76. POST /v1/candidate/register
- **Authentication:** None (public)
- **Purpose:** Candidate registration (supports recruiter role)
- **Implementation:** `services/gateway/app/main.py` → `candidate_register()`
- **Timeout:** 20s
- **Features:** Password hashing, role support

#### 77. POST /v1/candidate/login
- **Authentication:** None (public)
- **Purpose:** Candidate login (supports recruiter role)
- **Implementation:** `services/gateway/app/main.py` → `candidate_login()`
- **Timeout:** 15s
- **Features:** JWT token generation, role-based authentication

#### 78. GET /v1/candidate/profile/{candidate_id}
- **Authentication:** JWT token required
- **Purpose:** Get candidate profile (JWT authenticated)
- **Implementation:** `services/gateway/app/main.py` → `get_candidate_profile()`
- **Timeout:** 10s
- **Security:** User can only view own profile

#### 79. PUT /v1/candidate/profile/{candidate_id}
- **Authentication:** JWT token required
- **Purpose:** Update candidate profile
- **Implementation:** `services/gateway/app/main.py` → `update_candidate_profile()`
- **Timeout:** 15s
- **Validation:** Phone format, experience validation

#### 80. POST /v1/candidate/apply
- **Authentication:** JWT token required
- **Purpose:** Apply for job
- **Implementation:** `services/gateway/app/main.py` → `apply_for_job()`
- **Timeout:** 15s
- **Features:** Duplicate application prevention

---

## SERVICE 2: AI AGENT API (Port 9000)
**Total Endpoints:** 6  
**Base URL:** http://localhost:9000 (Local) | https://bhiv-hr-agent-nhgg.onrender.com (Production)

### CORE API ENDPOINTS (2)

#### 81. GET /
- **Authentication:** None (public)
- **Purpose:** AI service information
- **Implementation:** `services/agent/app.py` → `read_root()`
- **Timeout:** 2s

#### 82. GET /health
- **Authentication:** None (public)
- **Purpose:** Health check
- **Implementation:** `services/agent/app.py` → `health_check()`
- **Timeout:** 5s

### AI MATCHING ENGINE ENDPOINTS (2)

#### 83. POST /match
- **Authentication:** Bearer token required
- **Purpose:** AI-powered candidate matching (Phase 3 semantic engine)
- **Implementation:** `services/agent/app.py` → `match_candidates()`
- **Timeout:** 60s
- **Features:** Phase 3 semantic matching, fallback support
- **Request:**
```json
{
  "job_id": "123"
}
```

#### 84. POST /batch-match
- **Authentication:** Bearer token required
- **Purpose:** Batch AI matching for multiple jobs
- **Implementation:** `services/agent/app.py` → `batch_match_jobs()`
- **Timeout:** 120s
- **Validation:** Max 10 jobs per batch
- **Request:**
```json
{
  "job_ids": ["job1", "job2", "job3"]
}
```

### CANDIDATE ANALYSIS ENDPOINTS (1)

#### 85. GET /analyze/{candidate_id}
- **Authentication:** Bearer token required
- **Purpose:** Detailed candidate analysis
- **Implementation:** `services/agent/app.py` → `analyze_candidate()`
- **Timeout:** 30s
- **Features:** Skills categorization, semantic analysis

### SYSTEM DIAGNOSTICS ENDPOINTS (1)

#### 86. GET /test-db
- **Authentication:** Bearer token required
- **Purpose:** Database connectivity test
- **Implementation:** `services/agent/app.py` → `test_database()`
- **Timeout:** 10s

---

## SERVICE 3: LANGGRAPH API (Port 9001)
**Total Endpoints:** 25  
**Base URL:** http://localhost:9001 (Local) | https://bhiv-hr-langgraph.onrender.com (Production)

### CORE API ENDPOINTS (2)

#### 87. GET /
- **Authentication:** None (public)
- **Purpose:** LangGraph service information
- **Implementation:** `services/langgraph/app/main.py` → `read_root()`
- **Timeout:** 2s

#### 88. GET /health
- **Authentication:** None (public)
- **Purpose:** Health check
- **Implementation:** `services/langgraph/app/main.py` → `health_check()`
- **Timeout:** 5s

### WORKFLOW MANAGEMENT ENDPOINTS (2)

#### 89. POST /workflows/application/start
- **Authentication:** Bearer token required
- **Purpose:** Start AI workflow for candidate processing
- **Implementation:** `services/langgraph/app/main.py` → `start_application_workflow()`
- **Timeout:** 30s
- **Request:**
```json
{
  "candidate_id": "123",
  "job_id": "456",
  "application_id": "789",
  "candidate_email": "test@example.com",
  "candidate_phone": "123-456-7890",
  "candidate_name": "Test User",
  "job_title": "Software Engineer"
}
```

#### 90. POST /workflows/{workflow_id}/resume
- **Authentication:** Bearer token required
- **Purpose:** Resume paused workflow
- **Implementation:** `services/langgraph/app/main.py` → `resume_workflow()`
- **Timeout:** 30s

### WORKFLOW MONITORING ENDPOINTS (3)

#### 91. GET /workflows/{workflow_id}/status
- **Authentication:** Bearer token required
- **Purpose:** Get detailed workflow status
- **Implementation:** `services/langgraph/app/main.py` → `get_workflow_status()`
- **Timeout:** 15s
- **Features:** Progress tracking, ETA calculation

#### 92. GET /workflows
- **Authentication:** Bearer token required
- **Purpose:** List all workflows with filtering
- **Implementation:** `services/langgraph/app/main.py` → `list_workflows()`
- **Timeout:** 10s
- **Parameters:** `status`, `limit` (default: 50)

#### 93. GET /workflows/stats
- **Authentication:** Bearer token required
- **Purpose:** Workflow statistics and analytics
- **Implementation:** `services/langgraph/app/main.py` → `get_workflow_stats()`
- **Timeout:** 10s

### COMMUNICATION TOOLS ENDPOINTS (10)

#### 94. POST /tools/send-notification
- **Authentication:** Bearer token required
- **Purpose:** Multi-channel notification system with interactive features
- **Implementation:** `services/langgraph/app/main.py` → `send_notification()`
- **Timeout:** 60s

#### 95. POST /test/send-email
- **Authentication:** Bearer token required
- **Purpose:** Test email sending
- **Implementation:** `services/langgraph/app/main.py` → `test_send_email()`
- **Timeout:** 30s
- **Features:** Works with real email addresses

#### 96. POST /test/send-whatsapp
- **Authentication:** Bearer token required
- **Purpose:** Test WhatsApp sending
- **Implementation:** `services/langgraph/app/main.py` → `test_send_whatsapp()`
- **Timeout:** 30s
- **Features:** Works with Indian phone numbers (+91 format)

#### 97. POST /test/send-telegram
- **Authentication:** Bearer token required
- **Purpose:** Test Telegram sending
- **Implementation:** `services/langgraph/app/main.py` → `test_send_telegram()`
- **Timeout:** 30s

#### 98. POST /test/send-whatsapp-buttons
- **Authentication:** Bearer token required
- **Purpose:** Test WhatsApp interactive buttons
- **Implementation:** `services/langgraph/app/main.py` → `test_send_whatsapp_buttons()`
- **Timeout:** 30s

#### 99. POST /test/send-automated-sequence
- **Authentication:** Bearer token required
- **Purpose:** Test automated email & WhatsApp sequence
- **Implementation:** `services/langgraph/app/main.py` → `test_send_automated_sequence()`
- **Timeout:** 60s

#### 100. POST /automation/trigger-workflow
- **Authentication:** Bearer token required
- **Purpose:** Trigger portal integration workflows
- **Implementation:** `services/langgraph/app/main.py` → `trigger_workflow_automation()`
- **Timeout:** 30s

#### 101. POST /automation/bulk-notifications
- **Authentication:** Bearer token required
- **Purpose:** Send bulk notifications to multiple candidates
- **Implementation:** `services/langgraph/app/main.py` → `send_bulk_notifications()`
- **Timeout:** 120s

#### 102. POST /webhook/whatsapp
- **Authentication:** Bearer token required
- **Purpose:** Handle WhatsApp interactive button responses
- **Implementation:** `services/langgraph/app/main.py` → `whatsapp_webhook()`
- **Timeout:** 15s

### RL + FEEDBACK AGENT ENDPOINTS (8)

#### 103. POST /rl/predict
- **Authentication:** Bearer token required
- **Purpose:** RL-enhanced candidate matching prediction
- **Implementation:** `services/langgraph/app/rl_integration/rl_endpoints.py` → `rl_predict_match()`
- **Timeout:** 120s
- **Request:**
```json
{
  "candidate_id": 123,
  "job_id": 456,
  "candidate_features": {},
  "job_features": {}
}
```

#### 104. POST /rl/feedback
- **Authentication:** Bearer token required
- **Purpose:** Submit feedback for RL learning
- **Implementation:** `services/langgraph/app/rl_integration/rl_endpoints.py` → `submit_rl_feedback()`
- **Timeout:** 60s

#### 105. GET /rl/analytics
- **Authentication:** Bearer token required
- **Purpose:** Get RL system analytics and performance metrics
- **Implementation:** `services/langgraph/app/rl_integration/rl_endpoints.py` → `get_rl_analytics()`
- **Timeout:** 30s

#### 106. GET /rl/performance/{model_version}
- **Authentication:** Bearer token required
- **Purpose:** Get RL model performance metrics
- **Implementation:** `services/langgraph/app/rl_integration/rl_endpoints.py` → `get_rl_performance()`
- **Timeout:** 30s

#### 107. GET /rl/history/{candidate_id}
- **Authentication:** Bearer token required
- **Purpose:** Get RL decision history for candidate
- **Implementation:** `services/langgraph/app/rl_integration/rl_endpoints.py` → `get_candidate_rl_history()`
- **Timeout:** 20s

#### 108. POST /rl/retrain
- **Authentication:** Bearer token required
- **Purpose:** Trigger RL model retraining
- **Implementation:** `services/langgraph/app/rl_integration/rl_endpoints.py` → `trigger_rl_retrain()`
- **Timeout:** 300s

#### 109. GET /rl/performance
- **Authentication:** Bearer token required
- **Purpose:** Get RL performance monitoring data
- **Implementation:** `services/langgraph/app/main.py` → `get_rl_performance()`
- **Timeout:** 30s

#### 110. POST /rl/start-monitoring
- **Authentication:** Bearer token required
- **Purpose:** Start RL performance monitoring
- **Implementation:** `services/langgraph/app/main.py` → `start_rl_monitoring()`
- **Timeout:** 15s

### SYSTEM DIAGNOSTICS ENDPOINTS (1)

#### 111. GET /test-integration
- **Authentication:** Bearer token required
- **Purpose:** Integration testing and system validation
- **Implementation:** `services/langgraph/app/main.py` → `test_integration()`
- **Timeout:** 15s

---

## RATE LIMITING & PERFORMANCE

### Dynamic Rate Limiting
- **Default Tier:** 60 requests/minute
- **Premium Tier:** 300 requests/minute
- **CPU-based Adjustment:** 50-150% of base limit
- **Endpoint-specific Limits:**
  - `/v1/jobs`: 100/min (default), 500/min (premium)
  - `/v1/candidates/search`: 50/min (default), 200/min (premium)
  - `/v1/match`: 20/min (default), 100/min (premium)
  - `/v1/candidates/bulk`: 5/min (default), 25/min (premium)

### Performance Considerations
- **Database:** MongoDB Atlas with connection pooling
- **Caching:** In-memory caching for frequent queries
- **Fallback Support:** All AI services have database fallbacks
- **Error Handling:** Comprehensive error responses with details

---

## SECURITY FEATURES

### Input Validation
- **XSS Protection:** Script tag detection
- **SQL Injection:** Query parameter sanitization
- **Email Validation:** Regex pattern matching
- **Phone Validation:** Indian format (+91) support
- **File Upload:** Security scanning for resume uploads

### Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`
- `Content-Security-Policy: default-src 'self'`

### Account Security
- **2FA Support:** TOTP with QR codes
- **Account Locking:** 5 failed attempts = 30min lock
- **Password Policy:** 8+ chars, mixed case, numbers, symbols
- **JWT Expiration:** 24 hours for all tokens

---

## ERROR HANDLING & MONITORING

### Standard Error Responses
```json
{
  "status": "error",
  "error": "Error message",
  "detail": "Detailed error description",
  "timestamp": "2024-12-09T13:37:00Z"
}
```

### HTTP Status Codes
- **200:** Success
- **201:** Created
- **400:** Bad Request
- **401:** Unauthorized
- **403:** Forbidden
- **404:** Not Found
- **409:** Conflict
- **422:** Validation Failed
- **429:** Rate Limited
- **500:** Server Error

### Monitoring & Metrics
- **Prometheus Metrics:** Available at `/metrics`
- **Health Checks:** Multiple levels (basic, detailed)
- **Performance Tracking:** Request timing, success rates
- **Error Logging:** Comprehensive error tracking

---

## DEPLOYMENT INFORMATION

### Service URLs
- **Gateway (Production):** https://bhiv-hr-gateway-ltg0.onrender.com
- **Agent (Production):** https://bhiv-hr-agent-nhgg.onrender.com
- **LangGraph (Production):** https://bhiv-hr-langgraph.onrender.com

### Environment Variables Required
- `API_KEY_SECRET`: Service-to-service authentication
- `JWT_SECRET_KEY`: Client JWT token secret
- `CANDIDATE_JWT_SECRET_KEY`: Candidate/Recruiter JWT token secret
- `MONGODB_URI`: MongoDB Atlas connection string
- `GEMINI_API_KEY`: Google Gemini AI API key
- `TWILIO_*`: WhatsApp integration credentials
- `TELEGRAM_*`: Telegram bot credentials
- `SMTP_*`: Email service credentials

---

## CONCLUSION

This comprehensive analysis covers all 111 endpoints across the BHIV HR Platform's three core services. Each endpoint has been documented with complete implementation details, authentication requirements, timeout configurations, and parameter specifications. The platform provides robust authentication, comprehensive error handling, dynamic rate limiting, and extensive monitoring capabilities.

**Key Strengths:**
- Comprehensive API coverage (111 endpoints)
- Multiple authentication methods (API Key, Client JWT, Candidate JWT)
- Advanced AI integration (Semantic matching, RL feedback)
- Multi-channel communication (Email, WhatsApp, Telegram)
- Robust security features (2FA, CSP, input validation)
- Extensive monitoring and analytics
- Fallback support for all AI services

**Recommended Next Steps:**
1. Update API documentation with this comprehensive analysis
2. Implement additional endpoint-specific rate limiting
3. Add more granular role-based access controls
4. Enhance monitoring with custom metrics
5. Implement API versioning strategy