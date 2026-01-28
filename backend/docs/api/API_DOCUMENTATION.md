# 📚 BHIV HR Platform - Complete API Documentation

**Updated**: January 22, 2026  
**API Version**: v4.3.0 Production Ready  
**Total Endpoints**: 111 (80 Gateway + 6 Agent + 25 LangGraph)  
**Status**: ✅ 3/3 Core Services Operational | 111 Endpoints Live | 99.9% Uptime | MongoDB Atlas  
**Architecture**: Three-Port Microservices (8000/Gateway, 9000/Agent, 9001/LangGraph)

---

## 🌐 API Overview

### **Three-Port Microservices Architecture**

**Status**: ✅ **3/3 CORE SERVICES OPERATIONAL** | **Total Endpoints**: 111

| Service | Port | URL | Endpoints | Status |
|---------|------|-----|-----------|--------|
| **API Gateway** | 8000 | http://localhost:8000/docs | 80 | ✅ Running |
| **AI Engine** | 9000 | http://localhost:9000/docs | 6 | ✅ Running |
| **LangGraph Automation** | 9001 | http://localhost:9001/docs | 25 | ✅ Running |

**Architecture Note**: The system follows a three-port microservices pattern where each service runs on a dedicated port for clear separation of concerns and simplified service discovery.

### **Local Development URLs**
- **Gateway**: http://localhost:8000
- **Agent**: http://localhost:9000
- **LangGraph**: http://localhost:9001
- **Database**: MongoDB Atlas (Cloud)

### **Unified Authentication System**

The platform employs a multi-layered authentication approach with cross-service compatibility:

#### **1. API Key Authentication (Primary - Cross-Service)**
```bash
Authorization: Bearer <YOUR_API_KEY>
```
**Scope**: Universal authentication across all 3 services (Gateway:8000, Agent:9000, LangGraph:9001)  
**Implementation**: Single API key works across all microservices for simplified integration  
**Rate Limiting**: Dynamic scaling (60-500 requests/minute) based on system load  
**Security**: Centralized key management with automatic rotation support

#### **2. Service-Specific JWT Authentication**
```bash
Authorization: Bearer <service_specific_jwt_token>
```
**Client JWT** (Gateway service):
- **Purpose**: Client portal operations and job management
- **Demo Credentials**: `username: demo_user`, `password: demo_password`
- **Features**: 2FA TOTP support, session management, role-based access

**Candidate JWT** (Gateway service):
- **Purpose**: Candidate profile operations and job applications
- **Demo Credentials**: `email: demo@candidate.com`, `password: demo_password`
- **Features**: Profile management, application tracking, personalized recommendations

#### **3. Cross-Service Communication Patterns**

**Inter-Service Authentication**:
- Services communicate using the same API key for seamless integration
- Gateway service acts as authentication broker for client/candidate JWTs
- Agent and LangGraph services validate API keys independently

**Token Propagation**:
- JWT tokens issued by Gateway can be validated by other services when needed
- Session continuity maintained across service boundaries
- Centralized user management with distributed validation

### **System Architecture**

**Microservices Architecture**: Three-port design with 3 core services + MongoDB Atlas database  
**Technology Stack**: FastAPI 4.2.0, Python 3.12.7, MongoDB Atlas (NoSQL)  
**Database**: MongoDB Atlas with 17+ collections (fully migrated from PostgreSQL)  
**Deployment**: Docker-based microservices with port isolation (8000/9000/9001)  
**Communication**: Inter-service communication via HTTP REST APIs with API key authentication

### **Standard Response Format**
```json
{
  "status": "success|error",
  "data": {...},
  "message": "Human readable message",
  "timestamp": "2025-12-09T10:30:00Z",
  "request_id": "req_12345",
  "version": "v3.0.0"
}
```

### **Error Response Format**
```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": "Email format is invalid",
    "field": "email"
  },
  "timestamp": "2025-12-09T10:30:00Z",
  "request_id": "req_12345"
}
```

---

## 📋 Comprehensive Endpoint Directory

All 111 endpoints organized by functional category across the three microservices. Each endpoint supports the unified API key authentication system.

### **Core System Endpoints (5)**

| Service | Method | Path | Auth | Description |
|---------|--------|------|------|-------------|
| Gateway | GET | / | None | Root service information and endpoint discovery |
| Gateway | GET | /health | None | Basic health check and service status |
| Agent | GET | / | None | AI engine service information |
| Agent | GET | /health | None | AI service health monitoring |
| LangGraph | GET | / | None | Workflow automation service information |

### **Database & Connectivity Endpoints (3)**

| Service | Method | Path | Auth | Description |
|---------|--------|------|------|-------------|
| Gateway | GET | /test-candidates | API Key | Test MongoDB connection and sample data retrieval |
| Agent | GET | /test-db | API Key | AI engine database connectivity verification |
| LangGraph | GET | /test-integration | API Key | Comprehensive service integration testing |

### **Job Management Endpoints (2)**

| Service | Method | Path | Auth | Description |
|---------|--------|------|------|-------------|
| Gateway | GET | /v1/jobs | API Key | Retrieve all jobs with pagination and filtering |
| Gateway | POST | /v1/jobs | API Key/JWT | Create new job postings with detailed specifications |

### **Candidate Management Endpoints (5)**

| Service | Method | Path | Auth | Description |
|---------|--------|------|------|-------------|
| Gateway | GET | /v1/candidates | API Key | Retrieve candidates with advanced pagination |
| Gateway | GET | /v1/candidates/{id} | API Key | Get detailed information for specific candidate |
| Gateway | GET | /v1/candidates/search | API Key | Advanced search with AI-powered matching |
| Gateway | POST | /v1/candidates/bulk | API Key | Bulk upload candidates with validation |
| Gateway | GET | /v1/candidates/job/{job_id} | API Key | Get candidates who applied for specific job |

### **AI Matching & Analytics Endpoints (4)**

| Service | Method | Path | Auth | Description |
|---------|--------|------|------|-------------|
| Gateway | GET | /v1/match/{job_id}/top | API Key | Top candidate matches using Phase 3 AI semantic matching |
| Gateway | POST | /v1/match/batch | API Key | Batch processing for multiple job matching |
| Agent | POST | /match | API Key | AI-powered candidate matching with RL integration |
| Agent | POST | /batch-match | API Key | Batch AI matching for multiple jobs |

### **Authentication & User Management Endpoints (14)**

| Service | Method | Path | Auth | Description |
|---------|--------|------|------|-------------|
| Gateway | POST | /v1/client/login | API Key | Client JWT token generation |
| Gateway | POST | /v1/candidate/register | API Key | Candidate account registration |
| Gateway | POST | /v1/candidate/login | API Key | Candidate JWT token generation |
| Gateway | GET | /v1/candidate/profile | API Key | Retrieve candidate profile information |
| Gateway | PUT | /v1/candidate/profile | API Key | Update candidate profile details |
| Gateway | POST | /v1/candidate/apply | API Key | Apply for jobs as candidate |
| Gateway | GET | /v1/candidate/applications | API Key | View candidate job applications |
| Gateway | GET | /v1/candidate/applications/{job_id} | API Key | Get specific application status |
| Gateway | POST | /v1/auth/totp/setup | API Key | Set up TOTP 2FA for clients |
| Gateway | POST | /v1/auth/totp/verify | API Key | Verify TOTP authentication codes |
| Gateway | POST | /v1/auth/totp/login | API Key | Login with TOTP 2FA enabled |
| Gateway | GET | /v1/auth/totp/status | API Key | Check 2FA status for client accounts |
| Gateway | POST | /v1/auth/totp/disable | API Key | Disable TOTP 2FA for clients |
| Gateway | GET | /v1/auth/totp/qrcode | API Key | Generate QR code for TOTP setup |

### **Workflow & Automation Endpoints (12)**

| Service | Method | Path | Auth | Description |
|---------|--------|------|------|-------------|
| LangGraph | POST | /workflows/application/start | API Key | Initiate AI workflow for candidate processing |
| LangGraph | GET | /workflows/{workflow_id}/status | API Key | Get detailed workflow execution status |
| LangGraph | POST | /workflows/{workflow_id}/resume | API Key | Resume paused workflow executions |
| LangGraph | GET | /workflows | API Key | List all workflows with filtering options |
| LangGraph | GET | /workflows/stats | API Key | Workflow statistics and analytics |
| LangGraph | POST | /tools/send-notification | API Key | Multi-channel notification system |
| LangGraph | POST | /automation/trigger-workflow | API Key | Trigger portal integration workflows |
| LangGraph | POST | /automation/bulk-notifications | API Key | Send bulk notifications to candidates |
| LangGraph | POST | /webhook/whatsapp | API Key | Handle WhatsApp interactive responses |
| LangGraph | GET | /rl/performance | API Key | RL performance monitoring data |
| LangGraph | POST | /rl/start-monitoring | API Key | Initialize RL performance monitoring |
| LangGraph | POST | /retrain | API Key | Trigger RL model retraining processes |

### **Communication & Testing Endpoints (8)**

| Service | Method | Path | Auth | Description |
|---------|--------|------|------|-------------|
| LangGraph | POST | /test/send-email | API Key | Test email delivery functionality |
| LangGraph | POST | /test/send-whatsapp | API Key | Test WhatsApp message delivery |
| LangGraph | POST | /test/send-telegram | API Key | Test Telegram bot messaging |
| LangGraph | POST | /test/send-whatsapp-buttons | API Key | Test WhatsApp interactive buttons |
| LangGraph | POST | /test/send-automated-sequence | API Key | Test automated communication sequences |
| Agent | GET | /analyze/{candidate_id} | API Key | Detailed candidate analysis with semantic skills |
| Agent | POST | /rl/predict | API Key | RL-enhanced candidate matching predictions |
| Agent | POST | /rl/feedback | API Key | Submit ML feedback for continuous learning |

### **Dashboard & Reporting Endpoints (25)**

| Service | Method | Path | Auth | Description |
|---------|--------|------|------|-------------|
| Gateway | GET | /v1/client-dashboard/stats | API Key | Client dashboard statistics and metrics |
| Gateway | GET | /v1/client-dashboard/jobs | API Key | Client's job postings overview |
| Gateway | GET | /v1/client-dashboard/candidates | API Key | Candidates for client's positions |
| Gateway | GET | /v1/client-dashboard/matches | API Key | AI-matched candidates for client |
| Gateway | GET | /v1/client-dashboard/applications | API Key | Applications for client's jobs |
| Gateway | GET | /v1/client-dashboard/interviews | API Key | Interview schedules for client |
| Gateway | GET | /v1/client-dashboard/offers | API Key | Job offers managed by client |
| Gateway | GET | /v1/client-dashboard/analytics | API Key | Recruitment analytics for client |
| Gateway | GET | /v1/client-dashboard/export | API Key | Export client data and reports |
| Gateway | GET | /v1/client-dashboard/settings | API Key | Client account settings |
| Gateway | PUT | /v1/client-dashboard/settings | API Key | Update client account settings |
| Gateway | GET | /v1/candidate-dashboard/profile | API Key | Candidate profile information |
| Gateway | PUT | /v1/candidate-dashboard/profile | API Key | Update candidate profile |
| Gateway | GET | /v1/candidate-dashboard/applications | API Key | Candidate's job applications |
| Gateway | GET | /v1/candidate-dashboard/recommendations | API Key | Personalized job recommendations |
| Gateway | GET | /v1/candidate-dashboard/matches | API Key | AI matches for candidate |
| Gateway | GET | /v1/candidate-dashboard/interviews | API Key | Candidate's interview schedules |
| Gateway | GET | /v1/candidate-dashboard/offers | API Key | Job offers for candidate |
| Gateway | GET | /v1/candidate-dashboard/analytics | API Key | Career analytics for candidate |
| Gateway | GET | /v1/candidate-dashboard/settings | API Key | Candidate account settings |
| Gateway | PUT | /v1/candidate-dashboard/settings | API Key | Update candidate settings |
| Gateway | GET | /v1/hr-dashboard/stats | API Key | HR dashboard comprehensive statistics |
| Gateway | GET | /v1/hr-dashboard/recruitment | API Key | Recruitment metrics and KPIs |
| Gateway | GET | /v1/hr-dashboard/candidates | API Key | All candidates in system |
| Gateway | GET | /v1/hr-dashboard/jobs | API Key | All job postings in system |

### **System Management & Security Endpoints (15)**

| Service | Method | Path | Auth | Description |
|---------|--------|------|------|-------------|
| Gateway | POST | /v1/assessments/submit | API Key | Submit candidate assessment feedback |
| Gateway | GET | /v1/assessments/{assessment_id}/results | API Key | Get assessment results |
| Gateway | GET | /v1/interviews/scheduled | API Key | Get scheduled interviews |
| Gateway | POST | /v1/offers/generate | API Key | Generate job offers |
| Gateway | GET | /v1/offers/{offer_id}/status | API Key | Check offer status |
| Gateway | POST | /v1/offers/{offer_id}/accept | API Key | Accept job offers |
| Gateway | GET | /v1/security/rate-limit-test | API Key | Test rate limiting functionality |
| Gateway | GET | /v1/security/input-validation | API Key | Test input validation security |
| Gateway | GET | /v1/security/headers | API Key | Test security headers implementation |
| Gateway | GET | /v1/security/csp-violations | API Key | Report CSP violations |
| Gateway | GET | /v1/security/audit-log | API Key | Get security audit logs |
| Gateway | GET | /v1/security/brute-force-attempt | API Key | Test brute force protection |
| Gateway | GET | /v1/security/timeout-test | API Key | Test timeout handling |
| Gateway | GET | /metrics | None | Prometheus metrics endpoint |
| Gateway | GET | /dashboard | API Key | Health dashboard and monitoring |

### **Analytics & Data Endpoints (6)**

| Service | Method | Path | Auth | Description |
|---------|--------|------|------|-------------|
| Gateway | GET | /v1/hr-dashboard/matches | API Key | All AI matches in system |
| Gateway | GET | /v1/hr-dashboard/applications | API Key | All job applications |
| Gateway | GET | /v1/hr-dashboard/interviews | API Key | All interviews scheduled |
| Gateway | GET | /v1/hr-dashboard/offers | API Key | All job offers |
| Gateway | GET | /v1/hr-dashboard/analytics | API Key | HR analytics and reporting |
| Gateway | GET | /v1/analytics/stats | API Key | System-wide analytics data |

### **RL & Machine Learning Endpoints (5)**

| Service | Method | Path | Auth | Description |
|---------|--------|------|------|-------------|
| LangGraph | GET | /rl/analytics | API Key | RL system analytics and performance metrics |
| LangGraph | GET | /rl/performance/{model_version} | API Key | RL model performance by version |
| LangGraph | GET | /rl/history/{candidate_id} | API Key | RL decision history for candidates |
| Agent | GET | /rl/analytics | API Key | AI agent RL analytics |
| Agent | GET | /rl/history/{candidate_id} | API Key | AI agent decision history |

---

## 🎯 Complete Unified Endpoint Reference (108 Endpoints)

This comprehensive table provides quick reference to all available endpoints across the three microservices:

### **Job Management Endpoints (2)**

#### **GET /v1/jobs** - List All Jobs
**Description**: Retrieve all jobs with pagination and filtering options  
**Authentication**: API Key required  
**Rate Limit**: 100 requests/minute

```bash
curl -X GET \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  "http://localhost:8000/v1/jobs?limit=10&department=Engineering"
```

**Query Parameters**:
- `limit` (optional): Number of jobs to return (1-100, default: 50)
- `offset` (optional): Number of jobs to skip (default: 0)
- `department` (optional): Filter by department
- `location` (optional): Filter by location
- `experience_level` (optional): Filter by experience level (`entry|mid|senior|lead`)
- `status` (optional): Filter by status (`active|closed|draft`)

**Example Response**:
```json
{
  "jobs": [
    {
      "id": 1,
      "title": "Senior Python Developer",
      "department": "Engineering",
      "location": "Remote",
      "experience_level": "senior",
      "requirements": "Python, Django, PostgreSQL, REST APIs, 5+ years experience",
      "description": "We are looking for a senior Python developer to join our team...",
      "salary_range": "$120,000 - $150,000",
      "status": "active",
      "created_at": "2025-12-09T10:30:00Z",
      "applications_count": 15
    }
  ],
  "total": 19,
  "count": 1,
  "limit": 10,
  "offset": 0
}
```

#### **POST /v1/jobs** - Create New Job
**Description**: Create a new job posting with full details  
**Authentication**: API Key or Client JWT required  
**Rate Limit**: 20 requests/minute

```bash
curl -X POST \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Engineer",
    "department": "Engineering",
    "location": "San Francisco, CA",
    "experience_level": "mid",
    "requirements": "Python, React, 3+ years experience, Bachelor degree",
    "description": "Join our engineering team to build scalable web applications...",
    "salary_range": "$90,000 - $120,000",
    "employment_type": "full-time",
    "remote_allowed": true
  }' \
  http://localhost:8000/v1/jobs
```

**Example Response**:
```json
{
  "status": "success",
  "message": "Job created successfully",
  "job_id": 20,
  "job": {
    "id": 20,
    "title": "Software Engineer",
    "department": "Engineering",
    "status": "active",
    "created_at": "2025-12-09T10:30:00Z"
  }
}
```

---

### **Candidate Management Endpoints (5)**

#### **GET /v1/candidates** - List Candidates with Pagination
**Description**: Retrieve all candidates with advanced pagination and filtering  
**Authentication**: API Key required  
**Rate Limit**: 100 requests/minute

```bash
curl -X GET \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  "http://localhost:8000/v1/candidates?limit=10&skills=Python&location=Mumbai"
```

**Query Parameters**:
- `limit` (optional): Number of candidates to return (1-100, default: 50)
- `offset` (optional): Number of candidates to skip (default: 0)
- `skills` (optional): Filter by technical skills (comma-separated)
- `location` (optional): Filter by location
- `experience_min` (optional): Minimum years of experience (integer)
- `experience_max` (optional): Maximum years of experience (integer)
- `education_level` (optional): Filter by education (`High School|Bachelors|Masters|PhD`)

**Example Response**:
```json
{
  "candidates": [
    {
      "id": 1,
      "name": "John Smith",
      "email": "john@example.com",
      "phone": "+1-555-0101",
      "location": "Mumbai",
      "experience_years": 5,
      "technical_skills": "Python, Django, PostgreSQL, REST APIs",
      "seniority_level": "Software Developer",
      "education_level": "Masters",
      "status": "applied",
      "created_at": "2025-12-09T10:30:00Z"
    }
  ],
  "total": 10,
  "count": 1,
  "limit": 10,
  "offset": 0
}
```

#### **GET /v1/candidates/{id}** - Get Specific Candidate
**Description**: Retrieve detailed information for a specific candidate  
**Authentication**: API Key required  
**Rate Limit**: 200 requests/minute

```bash
curl -X GET \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  http://localhost:8000/v1/candidates/1
```

**Example Response**:
```json
{
  "candidate": {
    "id": 1,
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1-555-0101",
    "location": "Mumbai",
    "experience_years": 5,
    "technical_skills": "Python, Django, PostgreSQL, REST APIs, Docker, AWS",
    "seniority_level": "Software Developer",
    "education_level": "Masters",
    "status": "applied",
    "linkedin_url": "https://linkedin.com/in/johnsmith",
    "github_url": "https://github.com/johnsmith",
    "created_at": "2025-12-09T10:30:00Z"
  }
}
```

#### **GET /v1/candidates/search** - Advanced Search with Filters
**Description**: Advanced candidate search with multiple filter options and AI-powered matching  
**Authentication**: API Key required  
**Rate Limit**: 50 requests/minute

```bash
curl -X GET \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  "http://localhost:8000/v1/candidates/search?skills=Python,Django&location=Mumbai&ai_match=true"
```

**Query Parameters**:
- `skills` (optional): Comma-separated list of technical skills
- `location` (optional): Location filter (supports partial matching)
- `experience_min` (optional): Minimum years of experience (integer, 0-50)
- `experience_max` (optional): Maximum years of experience (integer, 0-50)
- `ai_match` (optional): `true|false` - Use AI semantic matching (default: `false`)
- `match_threshold` (optional): AI match threshold (0.0-1.0, default: 0.7)

**Example Response**:
```json
{
  "candidates": [
    {
      "id": 1,
      "name": "John Smith",
      "email": "john@example.com",
      "location": "Mumbai",
      "technical_skills": "Python, Django, PostgreSQL, REST APIs",
      "experience_years": 5,
      "match_score": 0.92,
      "match_reasoning": "Strong match: Python (0.95), Django (0.89), Experience: 5y matches requirement"
    }
  ],
  "total_matches": 15,
  "count": 1,
  "ai_matching_enabled": true,
  "search_timestamp": "2025-12-09T10:30:00Z"
}
```

#### **POST /v1/candidates/bulk** - Bulk Upload with Validation
**Description**: Upload multiple candidates at once with comprehensive validation  
**Authentication**: API Key required  
**Rate Limit**: 5 requests/minute  
**Max Candidates**: 50 per request

```bash
curl -X POST \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "candidates": [
      {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "phone": "+1-555-0102",
        "location": "San Francisco, CA",
        "experience_years": 3,
        "technical_skills": "React, JavaScript, Node.js, TypeScript",
        "seniority_level": "Mid-level Developer",
        "education_level": "Bachelors"
      }
    ],
    "validate_emails": true,
    "skip_duplicates": true
  }' \
  http://localhost:8000/v1/candidates/bulk
```

**Example Response**:
```json
{
  "status": "success",
  "message": "Bulk upload completed successfully",
  "candidates_received": 1,
  "candidates_inserted": 1,
  "candidates_skipped": 0,
  "errors": [],
  "total_errors": 0,
  "processing_time": "0.245s",
  "inserted_ids": [11]
}
```

#### **GET /v1/candidates/job/{job_id}** - Candidates by Job
**Description**: Get all candidates who applied for a specific job  
**Authentication**: API Key required  
**Rate Limit**: 100 requests/minute

```bash
curl -X GET \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  "http://localhost:8000/v1/candidates/job/1?include_scores=true"
```

**Example Response**:
```json
{
  "job_id": 1,
  "job_title": "Senior Python Developer",
  "candidates": [
    {
      "id": 1,
      "name": "John Smith",
      "email": "john@example.com",
      "technical_skills": "Python, Django, PostgreSQL, REST APIs",
      "application_date": "2025-12-09T10:30:00Z",
      "application_status": "applied",
      "match_score": 92.5,
      "match_reasoning": "Strong technical match: Python (0.95), Django (0.89)"
    }
  ],
  "total_applications": 15,
  "count": 1
}
```

---

### **AI Matching Endpoints (2)**

#### **GET /v1/match/{job_id}/top** - AI-Powered Semantic Matching
**Description**: Get top candidate matches for a job using Phase 3 AI semantic matching  
**Authentication**: API Key required  
**Rate Limit**: 20 requests/minute  
**Processing Time**: <0.02 seconds

```bash
curl -X GET \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  "http://localhost:8000/v1/match/1/top?limit=5&threshold=0.7"
```

**Query Parameters**:
- `limit` (optional): Number of top matches to return (1-50, default: 10)
- `threshold` (optional): Minimum match score threshold (0.0-1.0, default: 0.6)
- `include_reasoning` (optional): `true|false` - Include AI reasoning (default: `true`)
- `algorithm` (optional): `semantic|hybrid|traditional` - Matching algorithm (default: `semantic`)

**Example Response**:
```json
{
  "matches": [
    {
      "candidate_id": 1,
      "name": "John Smith",
      "email": "john@example.com",
      "location": "Mumbai",
      "score": 92.5,
      "confidence": 0.94,
      "skills_match": ["Python", "Django", "PostgreSQL", "REST APIs"],
      "skills_score": 0.89,
      "experience_match": "5y - Exceeds minimum requirement",
      "reasoning": "Exceptional match: Strong semantic similarity (0.89) in Python/Django stack. 5 years experience exceeds 3+ requirement.",
      "recommendation_strength": "Excellent",
      "semantic_similarity": 0.89
    }
  ],
  "job_id": 1,
  "job_title": "Senior Python Developer",
  "total_candidates_analyzed": 10,
  "matches_found": 1,
  "algorithm_version": "3.0.0-phase3-production",
  "processing_time": "0.015s",
  "timestamp": "2025-12-09T10:30:00Z"
}
```

#### **POST /v1/match/batch** - Batch Matching for Multiple Jobs
**Description**: Process AI matching for multiple jobs simultaneously with optimized batch processing  
**Authentication**: API Key required  
**Rate Limit**: 5 requests/minute  
**Max Jobs**: 20 per request

```bash
curl -X POST \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "job_ids": [1, 2, 3],
    "limit_per_job": 5,
    "threshold": 0.7,
    "include_reasoning": true
  }' \
  http://localhost:8000/v1/match/batch
```

**Example Response**:
```json
{
  "batch_results": {
    "1": {
      "job_id": 1,
      "job_title": "Senior Python Developer",
      "matches": [
        {
          "candidate_id": 1,
          "name": "John Smith",
          "score": 92.5,
          "reasoning": "Exceptional semantic match for Python development role"
        }
      ],
      "matches_found": 1,
      "processing_time": "0.023s"
    }
  },
  "summary": {
    "total_jobs_processed": 3,
    "total_matches_found": 5,
    "total_candidates_analyzed": 30,
    "average_processing_time": "0.021s"
  },
  "algorithm_version": "3.0.0-phase3-production-batch",
  "status": "success",
  "timestamp": "2025-12-09T10:30:00Z"
}
```

---

## 🤖 Agent Service API (6 Endpoints) - AI/ML/RL Engine

### **Base URL**
- **Production**: https://bhiv-hr-agent-nhgg.onrender.com
- **Local**: http://localhost:9000

### **Advanced AI Features**
- **Phase 3 Semantic Engine**: Sentence transformers with 0.89 semantic similarity
- **Reinforcement Learning**: ML-powered optimization with scikit-learn models
- **Real-time Processing**: <0.02s response time per candidate
- **Batch Processing**: 50 candidates per chunk with parallel processing
- **ML Integration**: Prediction accuracy 89%, model confidence 91%
- **Adaptive Scoring**: Company-specific optimization with feedback loops

### **Core Endpoints (2)**

#### **GET /** - Service Information
```bash
curl https://bhiv-hr-agent-nhgg.onrender.com/
```
**Response:**
```json
{
  "service": "BHIV AI Agent",
  "version": "3.0.0",
  "endpoints": 6,
  "features": ["phase3_semantic", "rl_integration", "batch_processing"],
  "status": "operational"
}
```

#### **GET /health** - Health Check
```bash
curl https://bhiv-hr-agent-nhgg.onrender.com/health
```
**Response:**
```json
{
  "status": "healthy",
  "service": "BHIV AI Agent",
  "version": "3.0.0",
  "timestamp": "2025-12-09T10:30:00Z"
}
```

### **AI Processing Endpoints (4)**

#### **POST /match** - Phase 3 AI Semantic Matching + RL Integration
```bash
curl -X POST -H "Content-Type: application/json" \
     -d '{"job_id": 1, "use_rl": true, "threshold": 0.7}' \
     https://bhiv-hr-agent-nhgg.onrender.com/match
```
**Response:**
```json
{
  "job_id": 1,
  "top_candidates": [
    {
      "candidate_id": 1,
      "name": "John Smith",
      "score": 92.5,
      "skills_match": ["Python", "Django", "MongoDB"],
      "reasoning": "RL-Enhanced Semantic match: 0.89; ML Confidence: 0.94",
      "rl_score": 0.94,
      "ml_confidence": 0.91
    }
  ],
  "total_candidates": 10,
  "processing_time": 0.015,
  "algorithm_version": "3.0.0-phase3-rl-production",
  "rl_integration": true,
  "status": "success"
}
```

#### **POST /batch-match** - Batch Processing for Multiple Jobs
```bash
curl -X POST -H "Content-Type: application/json" \
     -d '{"job_ids": [1, 2, 3]}' \
     https://bhiv-hr-agent-nhgg.onrender.com/batch-match
```
**Response:**
```json
{
  "batch_results": {
    "1": {
      "job_id": 1,
      "matches": [
        {
          "candidate_id": 1,
          "name": "John Smith",
          "score": 92.5,
          "reasoning": "Batch AI matching - Job 1"
        }
      ]
    }
  },
  "total_jobs_processed": 3,
  "total_candidates_analyzed": 31,
  "algorithm_version": "3.0.0-phase3-production-batch",
  "status": "success"
}
```

#### **POST /rl/predict** - RL-Enhanced Matching Prediction
```bash
curl -X POST -H "Content-Type: application/json" \
     -d '{"candidate_id": 1, "job_id": 1, "features": {"experience": 5, "skills_match": 0.89}}' \
     https://bhiv-hr-agent-nhgg.onrender.com/rl/predict
```
**Response:**
```json
{
  "candidate_id": 1,
  "job_id": 1,
  "ml_prediction": {
    "match_probability": 0.94,
    "confidence_score": 0.91,
    "recommendation": "Excellent",
    "predicted_success_rate": 0.87
  },
  "model_version": "rl_v2.1.0",
  "features_used": ["experience", "skills_match", "education", "location"],
  "processing_time": 0.008,
  "timestamp": "2025-12-09T10:30:00Z"
}
```

#### **POST /rl/feedback** - Submit ML Feedback for Learning
```bash
curl -X POST -H "Content-Type: application/json" \
     -d '{"candidate_id": 1, "job_id": 1, "outcome": "hired", "rating": 5}' \
     https://bhiv-hr-agent-nhgg.onrender.com/rl/feedback
```
**Response:**
```json
{
  "feedback_id": "fb_001",
  "status": "accepted",
  "message": "Feedback recorded for ML training",
  "candidate_id": 1,
  "job_id": 1,
  "outcome": "hired",
  "rating": 5,
  "model_updated": true,
  "training_scheduled": true,
  "timestamp": "2025-12-09T10:30:00Z"
}
```

---

## 🔄 LangGraph Service API (25 Endpoints) - Workflow Automation

### **Base URL**
- **Production**: http://localhost:9001
- **Local**: http://localhost:9001

### **Advanced Workflow Features**
- **Multi-Channel Notifications**: Email (Gmail SMTP), WhatsApp (Twilio), Telegram Bot - ✅ Confirmed Working
- **AI Workflow Automation**: Candidate processing, interview scheduling, offer management
- **Real-time Status Tracking**: Live workflow monitoring and notifications
- **RL Integration**: Workflow optimization through reinforcement learning
- **Direct API Integration**: `/tools/send-notification` endpoint for automation sequences
- **Automated Sequences**: Multi-step workflows with 100% success rate

### **Core Endpoints (2)**

#### **GET /** - Service Information
```bash
curl http://localhost:9001/
```
**Response:**
```json
{
  "service": "BHIV LangGraph Workflows",
  "version": "3.0.0",
  "endpoints": 25,
  "status": "operational",
  "workflows_available": ["application", "shortlist", "interview"]
}
```

#### **GET /health** - Health Check
```bash
curl http://localhost:9001/health
```
**Response:**
```json
{
  "status": "healthy",
  "service": "BHIV LangGraph",
  "version": "3.0.0",
  "timestamp": "2025-12-09T10:30:00Z"
}
```

### **Key Workflow Endpoints**

#### **POST /tools/send-notification** - Multi-Channel Notifications
```bash
curl -X POST -H "Content-Type: application/json" \
     -d '{
       "recipient": "candidate@example.com",
       "message": "Application received for Senior Python Developer position",
       "channels": ["email", "whatsapp", "telegram"],
       "template": "application_received",
       "candidate_name": "John Smith",
       "job_title": "Senior Python Developer"
     }' \
     http://localhost:9001/tools/send-notification
```
**Response:**
```json
{
  "notification_id": "notif_001",
  "status": "sent",
  "channels_used": ["email", "whatsapp", "telegram"],
  "delivery_status": {
    "email": "delivered",
    "whatsapp": "delivered",
    "telegram": "delivered"
  },
  "sent_at": "2025-12-09T10:30:00Z",
  "total_delivery_time": "1.2s"
}
```

#### **GET /test/send-automated-sequence** - Test Automation Sequence
```bash
curl http://localhost:9001/test/send-automated-sequence
```
**Response:**
```json
{
  "sequence_id": "seq_test_001",
  "status": "completed",
  "steps_executed": [
    "email_notification_sent",
    "whatsapp_notification_sent",
    "telegram_notification_sent",
    "workflow_status_updated"
  ],
  "total_execution_time": "2.1s",
  "notifications_sent": 3,
  "success_rate": "100%",
  "timestamp": "2025-12-09T10:30:00Z"
}
```

---

## 🏢 Portal Services - Triple Portal System

### **Live Production Portals**
- **HR Portal**: https://bhiv-hr-portal-u670.onrender.com/ - ✅ Live
- **Client Portal**: https://bhiv-hr-client-portal-3iod.onrender.com/ - ✅ Live
- **Candidate Portal**: https://bhiv-hr-candidate-portal-abe6.onrender.com/ - ✅ Live

### **Portal Features**
- **Technology**: Streamlit 1.41.1, Python 3.12.7
- **Authentication**: Unified auth_manager.py per service
- **Real-time Updates**: Live metrics and notifications
- **Responsive Design**: Mobile-friendly interfaces
- **Demo Access**: `demo_user` / `demo_password`

### **Portal Endpoints**

#### **HR Portal Health Check**
```bash
curl https://bhiv-hr-portal-u670.onrender.com/health
```
**Response:**
```json
{
  "status": "healthy",
  "service": "BHIV HR Portal",
  "version": "3.0.0",
  "streamlit_version": "1.41.1",
  "features_enabled": ["ai_matching", "rl_integration", "workflow_automation"],
  "timestamp": "2025-12-09T10:30:00Z"
}
```

---

## 📊 Complete Unified Endpoint Summary (108 Total)

### **Unified Service Distribution**
- **Gateway Service**: 77 endpoints (Core API, Auth, Security, Workflows)
- **AI Agent Service**: 6 endpoints (ML/RL Engine, Semantic Matching)
- **LangGraph Service**: 25 endpoints (Workflow Automation, Notifications, RL Integration)
- **Total**: 111 endpoints across 3 microservices

### **Gateway Service Categories (77 Endpoints)**
- **Core API**: 3 endpoints (Root, Health, Test DB)
- **Monitoring**: 3 endpoints (Metrics, Health Detail, Dashboard)
- **Analytics**: 3 endpoints (Stats, Schema, Export)
- **Job Management**: 2 endpoints (Create, List)
- **Candidate Management**: 5 endpoints (List, Search, By Job, By ID, Bulk)
- **AI Matching**: 2 endpoints (Top Matches, Batch)
- **Assessment Workflow**: 6 endpoints (Feedback, Interviews, Offers)
- **Security Testing**: 7 endpoints (Rate Limit, Input Validation, Headers, etc.)
- **2FA Authentication**: 8 endpoints (Setup, Verify, Login, Status, etc.)
- **Client Portal**: 1 endpoint (Login with JWT)
- **Candidate Portal**: 5 endpoints (Register, Login, Profile, Apply, Applications)
- **Additional Endpoints**: 29 endpoints (Various specialized functions)

### **AI Agent Service Endpoints (6 Endpoints)**
- **Core API**: 2 endpoints (Root, Health)
- **System Diagnostics**: 1 endpoint (Test DB)
- **AI Matching Engine**: 2 endpoints (Single Match, Batch Match)
- **Candidate Analysis**: 1 endpoint (Analyze Candidate)

| Method | Path | Authentication | Description |
|--------|------|----------------|-------------|
| GET | / | None | Service information and available endpoints |
| GET | /health | None | Health check for the AI service |
| GET | /test-db | API Key | Database connectivity test with MongoDB |
| POST | /match | API Key | AI-powered candidate matching using Phase 3 semantic engine |
| POST | /batch-match | API Key | Batch AI matching for multiple jobs |
| GET | /analyze/{candidate_id} | API Key | Detailed candidate analysis with semantic skills extraction |

### **LangGraph Service Endpoints (25 Endpoints)**
- **Core API**: 2 endpoints (Root, Health)
- **Workflow Management**: 3 endpoints (Start, Resume, Status)
- **Communication Tools**: 8 endpoints (Notifications, Email, WhatsApp, Telegram, etc.)
- **Workflow Monitoring**: 2 endpoints (List, Stats)
- **RL + Feedback Agent**: 6 endpoints (Predict, Feedback, Analytics, Performance, History, Retrain)
- **System Diagnostics**: 1 endpoint (Integration Test)
- **Webhooks**: 1 endpoint (WhatsApp responses)
- **Automation**: 2 endpoints (Trigger, Bulk notifications)

| Method | Path | Authentication | Description |
|--------|------|----------------|-------------|
| GET | / | None | LangGraph service information |
| GET | /health | None | Health check for the workflow orchestrator |
| POST | /workflows/application/start | API Key | Start AI workflow for candidate processing |
| GET | /workflows/{workflow_id}/status | API Key | Get detailed workflow status |
| POST | /workflows/{workflow_id}/resume | API Key | Resume paused workflow |
| GET | /workflows | API Key | List all workflows with filtering |
| POST | /tools/send-notification | API Key | Multi-channel notification system |
| POST | /test/send-email | API Key | Test email sending |
| POST | /test/send-whatsapp | API Key | Test WhatsApp sending |
| POST | /test/send-telegram | API Key | Test Telegram sending |
| POST | /test/send-whatsapp-buttons | API Key | Test WhatsApp interactive buttons |
| POST | /test/send-automated-sequence | API Key | Test automated email/WhatsApp sequence |
| POST | /automation/trigger-workflow | API Key | Trigger portal integration workflows |
| POST | /automation/bulk-notifications | API Key | Send bulk notifications to multiple candidates |
| POST | /webhook/whatsapp | API Key | Handle WhatsApp interactive button responses |
| GET | /workflows/stats | API Key | Workflow statistics and analytics |
| GET | /rl/performance | API Key | Get RL performance monitoring data |
| POST | /rl/start-monitoring | API Key | Start RL performance monitoring |
| GET | /test-integration | API Key | Integration testing and system validation |
| POST | /rl/predict | API Key | RL-enhanced candidate matching prediction |
| POST | /rl/feedback | API Key | Submit feedback for RL learning |
| GET | /rl/analytics | API Key | Get RL system analytics and performance metrics |
| GET | /rl/performance/{model_version} | API Key | Get RL model performance metrics |
| GET | /rl/history/{candidate_id} | API Key | Get RL decision history for candidate |
| POST | /retrain | API Key | Trigger RL model retraining |

### **Complete Unified Endpoint List (All 108 Endpoints)**
## 📊 Complete Endpoint Inventory (108 Endpoints)

### **Endpoint Classification Summary**

| Category | Count | Services Involved |
|----------|-------|-------------------|
| **Core System** | 5 | All services |
| **Database & Connectivity** | 3 | Gateway, Agent, LangGraph |
| **Job Management** | 2 | Gateway |
| **Candidate Management** | 5 | Gateway |
| **AI Matching & Analytics** | 4 | Gateway, Agent |
| **Authentication & User Management** | 14 | Gateway |
| **Workflow & Automation** | 12 | LangGraph |
| **Communication & Testing** | 8 | LangGraph, Agent |
| **Dashboard & Reporting** | 25 | Gateway |
| **System Management & Security** | 15 | Gateway |
| **Analytics & Data** | 6 | Gateway |
| **RL & Machine Learning** | 5 | LangGraph, Agent |
| **Monitoring & Health** | 4 | All services |

### **Detailed Endpoint Reference**

**Core System Endpoints (5)**
- `/` (GET) - Service information [All services]
- `/health` (GET) - Health check [All services]

**Database & Connectivity (3)**
- `/test-candidates` (GET) - MongoDB connectivity test [Gateway:8000]
- `/test-db` (GET) - Database test [Agent:9000] 
- `/test-integration` (GET) - Integration testing [LangGraph:9001]

**Job Management (2)**
- `/v1/jobs` (GET) - List jobs with filtering [Gateway:8000]
- `/v1/jobs` (POST) - Create new job postings [Gateway:8000]

**Candidate Management (5)**
- `/v1/candidates` (GET) - List candidates with pagination [Gateway:8000]
- `/v1/candidates/{id}` (GET) - Get specific candidate details [Gateway:8000]
- `/v1/candidates/search` (GET) - Advanced candidate search [Gateway:8000]
- `/v1/candidates/bulk` (POST) - Bulk candidate upload [Gateway:8000]
- `/v1/candidates/job/{job_id}` (GET) - Candidates by job [Gateway:8000]

**AI Matching & Analytics (4)**
- `/v1/match/{job_id}/top` (GET) - Top candidate matches [Gateway:8000]
- `/v1/match/batch` (POST) - Batch job matching [Gateway:8000]
- `/match` (POST) - AI semantic matching [Agent:9000]
- `/batch-match` (POST) - Batch AI processing [Agent:9000]

**Authentication & User Management (14)**
- Client authentication endpoints [Gateway:8000]
- Candidate registration and login [Gateway:8000]
- Profile management endpoints [Gateway:8000]
- 2FA TOTP setup and management [Gateway:8000]

**Workflow & Automation (12)**
- Workflow initiation and management [LangGraph:9001]
- Status tracking and monitoring [LangGraph:9001]
- Notification system endpoints [LangGraph:9001]
- Automation triggers [LangGraph:9001]

**Communication & Testing (8)**
- Multi-channel notification testing [LangGraph:9001]
- Candidate analysis and RL features [Agent:9000]
- Interactive communication tools [LangGraph:9001]

**Dashboard & Reporting (25)**
- Client dashboard endpoints [Gateway:8000]
- Candidate dashboard endpoints [Gateway:8000]
- HR dashboard and analytics [Gateway:8000]

**System Management & Security (15)**
- Assessment and interview management [Gateway:8000]
- Offer generation and management [Gateway:8000]
- Security testing endpoints [Gateway:8000]
- Monitoring and metrics [Gateway:8000]

**Analytics & Data (6)**
- HR analytics and reporting [Gateway:8000]
- System-wide analytics [Gateway:8000]
- Data export functionality [Gateway:8000]

**RL & Machine Learning (5)**
- RL performance monitoring [LangGraph:9001]
- ML prediction and feedback [Agent:9000]
- Model analytics and history [Both services]

**Monitoring & Health (4)**
- Prometheus metrics [Gateway:8000]
- Detailed health checks [Gateway:8000]
- Dashboard monitoring [Gateway:8000]

### **Cross-Service Communication Matrix**

| Service | Communicates With | Purpose | Authentication |
|---------|-------------------|---------|----------------|
| Gateway (8000) | Agent (9000) | AI matching requests | API Key |
| Gateway (8000) | LangGraph (9001) | Workflow initiation | API Key |
| Agent (9000) | Gateway (8000) | Candidate data retrieval | API Key |
| LangGraph (9001) | Gateway (8000) | Status updates | API Key |
| All Services | MongoDB Atlas | Data persistence | Service-specific |

### **MongoDB Implementation Details**

**Database Migration Status**: ✅ Fully migrated from PostgreSQL to MongoDB Atlas
**Collections**: 17+ collections organized by service domains
**Connection Pattern**: Each service maintains independent MongoDB connections
**Data Consistency**: Cross-service data synchronization via API calls
**Backup Strategy**: Automated MongoDB Atlas backups with point-in-time recovery

### **Performance & Scalability**

**Response Times**:
- Gateway API: <100ms average
- Agent API: <50ms average  
- AI Matching: <0.02 seconds
- Database Queries: <50ms

**Throughput Capacity**:
- Gateway: 500+ requests/minute
- Agent: 200+ requests/minute
- Concurrent Users: 100+ supported
- Batch Processing: 50 candidates/chunk

**Scalability Features**:
- Horizontal scaling via Docker containers
- Load balancing across service instances
- MongoDB Atlas auto-scaling clusters
- Redis caching for frequently accessed data

---

## 🔐 Comprehensive Authentication Framework

### **Universal API Key Authentication**
```bash
# Primary cross-service authentication method
Authorization: Bearer <YOUR_API_KEY>
```
**Characteristics**:
- Single API key works across all three services (8000, 9000, 9001)
- Environment variable: `API_KEY_SECRET`
- Rate limiting: 60-500 requests/minute (dynamic)
- Automatic key rotation support
- Centralized management dashboard

### **Service-Specific JWT Implementation**

**Client Authentication Flow**:
```bash
# Step 1: Obtain client JWT token
curl -X POST -H "Content-Type: application/json" \
     -d '{"client_id": "TECH001", "password": "demo123"}' \
     http://localhost:8000/v1/client/login

# Step 2: Use JWT for authenticated requests
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Example authenticated request
curl -X GET -H "Authorization: Bearer <client_jwt_token>" \
     http://localhost:8000/v1/client-dashboard/jobs
```

**Candidate Authentication Flow**:
```bash
# Step 1: Register or login to get candidate JWT
curl -X POST -H "Content-Type: application/json" \
     -d '{"email": "candidate@example.com", "password": "password123"}' \
     http://localhost:8000/v1/candidate/login

# Step 2: Use candidate JWT for profile operations
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Example profile update
curl -X PUT -H "Authorization: Bearer <candidate_jwt_token>" \
     -H "Content-Type: application/json" \
     -d '{"location": "New York", "experience_years": 5}' \
     http://localhost:8000/v1/candidate/profile
```

### **Two-Factor Authentication (2FA) Integration**

**TOTP Setup Process**:
```bash
# 1. Initialize 2FA setup
curl -X POST -H "Authorization: Bearer <client_jwt_token>" \
     http://localhost:8000/v1/auth/totp/setup

# 2. Scan QR code with authenticator app
# 3. Verify setup with generated code
curl -X POST -H "Authorization: Bearer <client_jwt_token>" \
     -H "Content-Type: application/json" \
     -d '{"totp_code": "123456"}' \
     http://localhost:8000/v1/auth/totp/verify

# 4. Subsequent logins require 2FA
curl -X POST -H "Content-Type: application/json" \
     -d '{"client_id": "TECH001", "password": "demo123", "totp_code": "654321"}' \
     http://localhost:8000/v1/auth/totp/login
```

### **Cross-Service Authentication Patterns**

**Service-to-Service Communication**:
```bash
# Agent service calling Gateway for candidate data
curl -X GET -H "Authorization: Bearer <SHARED_API_KEY>" \
     http://localhost:8000/v1/candidates/123

# LangGraph service updating workflow status via Gateway
curl -X POST -H "Authorization: Bearer <SHARED_API_KEY>" \
     -H "Content-Type: application/json" \
     -d '{"workflow_id": "wf_001", "status": "completed"}' \
     http://localhost:8000/v1/workflows/update
```

**Token Validation Across Services**:
- Gateway validates both API keys and JWT tokens
- Agent and LangGraph services validate API keys independently
- JWT tokens can be verified by any service when needed
- Session continuity maintained through centralized user management

---

## ⚙️ MongoDB Atlas & Rate Limiting Configuration

### **MongoDB Atlas Implementation**

**Database Architecture**:
- **Migration Status**: ✅ Fully migrated from PostgreSQL to MongoDB Atlas
- **Cluster Configuration**: M10 tier with auto-scaling enabled
- **Replica Sets**: 3-node replica set for high availability
- **Collections**: 17+ purpose-built collections across services
- **Backup Strategy**: Continuous cloud backups with 7-day retention
- **Security**: Network isolation, IP whitelisting, and encryption at rest

**Collection Structure**:
```javascript
// Core collections per service domain
{
  "gateway_service": ["jobs", "candidates", "applications", "users", "assessments"],
  "agent_service": ["matches", "candidate_analytics", "rl_predictions", "feedback"],
  "langgraph_service": ["workflows", "notifications", "rl_analytics", "automation_logs"]
}
```

### **Intelligent Rate Limiting System**

**Dynamic Adjustment Algorithm**:
Rate limits automatically adapt based on real-time system metrics:
- **High Load (>80% CPU/Memory)**: Reduce limits by 50% to prevent degradation
- **Medium Load (30-80% CPU/Memory)**: Maintain standard operational limits
- **Low Load (<30% CPU/Memory)**: Increase limits by 50% for optimal throughput
- **MongoDB Connection Pool**: Auto-scales based on concurrent database operations

**Service-Specific Rate Tiers**:

#### **Gateway Service (Port 8000) - Business Operations**
```yaml
Free Tier (Default):
  general_endpoints: 60 requests/minute
  search_operations: 30 requests/minute  
  ai_matching: 10 requests/minute
  bulk_operations: 3 requests/minute
  database_queries: 100 requests/minute

Premium Tier:
  general_endpoints: 300 requests/minute
  search_operations: 150 requests/minute
  ai_matching: 50 requests/minute
  bulk_operations: 15 requests/minute
  database_queries: 500 requests/minute
```

#### **Agent Service (Port 9000) - AI/ML Processing**
```yaml
Processing Tier:
  ai_matching: 50 requests/minute
  batch_processing: 10 requests/minute
  candidate_analysis: 30 requests/minute
  rl_operations: 20 requests/minute
  database_analytics: 100 requests/minute
```

#### **LangGraph Service (Port 9001) - Workflow Automation**
```yaml
Automation Tier:
  workflow_operations: 40 requests/minute
  notification_dispatch: 100 requests/minute
  communication_tools: 60 requests/minute
  rl_monitoring: 25 requests/minute
  system_integration: 30 requests/minute
```

### **MongoDB-Specific Performance Optimizations**

**Indexing Strategy**:
- Compound indexes on frequently queried fields
- Text indexes for search operations
- TTL indexes for temporary data expiration
- Geospatial indexes for location-based queries

**Connection Management**:
- Connection pooling with 20-50 connections per service
- Automatic connection recovery and retry logic
- Query timeout configurations (30 seconds default)
- Read preference: Primary for writes, SecondaryPreferred for reads

**Data Modeling Best Practices**:
- Embedded documents for related data to reduce joins
- Reference patterns for loosely coupled relationships
- Aggregation pipelines for complex analytics
- Change streams for real-time data synchronization

---

## 🚨 Comprehensive Error Handling & Troubleshooting

### **HTTP Status Code Reference**

**Success Codes (2xx)**:
- **200 OK**: Request successful, data returned
- **201 Created**: Resource successfully created
- **204 No Content**: Request successful, no content to return

**Client Error Codes (4xx)**:
- **400 Bad Request**: Invalid request syntax or parameters
- **401 Unauthorized**: Missing or invalid authentication credentials
- **403 Forbidden**: Valid credentials but insufficient permissions
- **404 Not Found**: Requested resource doesn't exist
- **409 Conflict**: Resource conflict (duplicate entry, etc.)
- **422 Unprocessable Entity**: Well-formed request but semantic errors
- **429 Too Many Requests**: Rate limit exceeded

**Server Error Codes (5xx)**:
- **500 Internal Server Error**: Unexpected server error
- **502 Bad Gateway**: Invalid response from upstream service
- **503 Service Unavailable**: Service temporarily unavailable
- **504 Gateway Timeout**: Upstream service timeout

### **Structured Error Response Format**

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data provided",
    "details": "Email format is invalid: missing @ symbol",
    "field": "email",
    "validation_rules": ["Must be valid email format", "Required field"]
  },
  "timestamp": "2025-12-09T10:30:00Z",
  "request_id": "req_12345",
  "documentation": "https://docs.bhiv-hr.com/errors/VALIDATION_ERROR"
}
```

### **Service-Specific Error Patterns**

**Gateway Service Errors**:
```json
// Authentication Failure
{
  "status": "error",
  "error": {
    "code": "AUTH_FAILED",
    "message": "Invalid API key provided",
    "details": "API key expired or malformed"
  },
  "service": "gateway"
}

// Rate Limit Exceeded
{
  "status": "error", 
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests in given time period",
    "details": "Limit: 60 requests/minute, Reset in: 45 seconds"
  },
  "retry_after": 45
}
```

**Agent Service Errors**:
```json
// AI Processing Error
{
  "status": "error",
  "error": {
    "code": "AI_PROCESSING_FAILED",
    "message": "AI semantic matching engine unavailable",
    "details": "Phase 3 engine initialization failed"
  },
  "service": "agent",
  "fallback_available": true
}

// Database Connection Error
{
  "status": "error",
  "error": {
    "code": "DATABASE_CONNECTION_FAILED",
    "message": "Unable to connect to MongoDB Atlas",
    "details": "Connection timeout after 30 seconds"
  },
  "service": "agent"
}
```

**LangGraph Service Errors**:
```json
// Workflow Execution Error
{
  "status": "error",
  "error": {
    "code": "WORKFLOW_EXECUTION_FAILED",
    "message": "Workflow processing encountered unexpected error",
    "details": "LangGraph state machine transition failed"
  },
  "workflow_id": "wf_001",
  "service": "langgraph"
}

// Notification Delivery Error
{
  "status": "error",
  "error": {
    "code": "NOTIFICATION_DELIVERY_FAILED",
    "message": "Failed to deliver notification via selected channels",
    "details": "Email delivery: success, WhatsApp: failed, Telegram: success"
  },
  "channels_failed": ["whatsapp"],
  "service": "langgraph"
}
```

### **Troubleshooting Quick Reference**

**Common Issues & Solutions**:

1. **Authentication Failures**
   - Verify API key is correctly set in `API_KEY_SECRET` environment variable
   - Check JWT token expiration and refresh if needed
   - Ensure proper `Authorization: Bearer <token>` header format

2. **Rate Limit Issues**
   - Implement exponential backoff retry logic
   - Monitor rate limit headers in responses
   - Consider upgrading to premium tier for higher limits

3. **Database Connectivity**
   - Check MongoDB Atlas cluster status
   - Verify network IP whitelist includes service IPs
   - Monitor connection pool utilization metrics

4. **Service Communication**
   - Validate inter-service API key consistency
   - Check service health endpoints (`/health`)
   - Monitor cross-service latency metrics

5. **Performance Degradation**
   - Review MongoDB query execution plans
   - Check for missing database indexes
   - Monitor system resource utilization (CPU, memory, disk I/O)

---

## 📈 Performance Metrics

### **Response Times**
- **Gateway API**: <100ms average
- **Agent API**: <50ms average
- **AI Matching**: <0.02 seconds
- **Database Queries**: <50ms

### **Throughput**
- **Gateway**: 500+ requests/minute
- **Agent**: 200+ requests/minute
- **Concurrent Users**: 100+ supported
- **Batch Processing**: 50 candidates/chunk

---

## 🔧 Comprehensive SDK Integration Examples

### **Python Client Library**

```python
import requests
import json
from typing import Dict, List, Optional
from datetime import datetime

class BHIVHRClient:
    def __init__(self, base_url: str = "http://localhost:8000", api_key: str = None):
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        } if api_key else {}
    
    def _make_request(self, method: str, endpoint: str, **kwargs) -> Dict:
        """Make HTTP request with error handling"""
        url = f"{self.base_url}{endpoint}"
        try:
            response = requests.request(method, url, headers=self.headers, **kwargs)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"API request failed: {str(e)}")
    
    # Job Management
    def list_jobs(self, limit: int = 50, department: str = None) -> List[Dict]:
        """Retrieve all jobs with optional filtering"""
        params = {"limit": limit}
        if department:
            params["department"] = department
        return self._make_request("GET", "/v1/jobs", params=params)
    
    def create_job(self, job_data: Dict) -> Dict:
        """Create a new job posting"""
        return self._make_request("POST", "/v1/jobs", json=job_data)
    
    # Candidate Management
    def search_candidates(self, skills: List[str] = None, location: str = None, 
                         ai_match: bool = False) -> Dict:
        """Advanced candidate search with AI matching"""
        params = {}
        if skills:
            params["skills"] = ",".join(skills)
        if location:
            params["location"] = location
        if ai_match:
            params["ai_match"] = "true"
        
        return self._make_request("GET", "/v1/candidates/search", params=params)
    
    # AI Matching
    def get_top_matches(self, job_id: int, limit: int = 10, threshold: float = 0.7) -> Dict:
        """Get top AI-powered candidate matches for a job"""
        params = {"limit": limit, "threshold": threshold}
        return self._make_request("GET", f"/v1/match/{job_id}/top", params=params)
    
    def batch_match_jobs(self, job_ids: List[int], limit_per_job: int = 5) -> Dict:
        """Process AI matching for multiple jobs simultaneously"""
        payload = {
            "job_ids": job_ids,
            "limit_per_job": limit_per_job,
            "include_reasoning": True
        }
        return self._make_request("POST", "/v1/match/batch", json=payload)

# Usage Example
client = BHIVHRClient(base_url="http://localhost:8000", api_key="your_api_key_here")

# Search for Python developers in Mumbai
candidates = client.search_candidates(
    skills=["Python", "Django", "MongoDB"],
    location="Mumbai",
    ai_match=True
)

# Get top matches for a specific job
matches = client.get_top_matches(job_id=123, limit=5, threshold=0.8)

# Create a new job posting
new_job = client.create_job({
    "title": "Senior Python Developer",
    "department": "Engineering",
    "location": "Remote",
    "experience_level": "senior",
    "requirements": "Python, Django, MongoDB, 5+ years experience",
    "description": "Join our team to build scalable web applications",
    "salary_range": "$120,000 - $150,000"
})
```

### **JavaScript/Node.js Integration**

```javascript
const axios = require('axios');

class BHIVHRClient {
    constructor(baseUrl = 'http://localhost:8000', apiKey = null) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.apiKey = apiKey;
        this.headers = apiKey ? {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        } : {};
    }
    
    async makeRequest(method, endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        try {
            const response = await axios({
                method,
                url,
                headers: this.headers,
                ...options
            });
            return response.data;
        } catch (error) {
            throw new Error(`API request failed: ${error.response?.data?.error?.message || error.message}`);
        }
    }
    
    // Authentication
    async getClientToken(clientId, password) {
        const response = await this.makeRequest('POST', '/v1/client/login', {
            data: { client_id: clientId, password }
        });
        return response.token;
    }
    
    // Job Operations
    async listJobs(params = {}) {
        return await this.makeRequest('GET', '/v1/jobs', { params });
    }
    
    async createJob(jobData) {
        return await this.makeRequest('POST', '/v1/jobs', { data: jobData });
    }
    
    // Candidate Operations
    async searchCandidates(options = {}) {
        const params = {};
        if (options.skills) params.skills = options.skills.join(',');
        if (options.location) params.location = options.location;
        if (options.aiMatch) params.ai_match = 'true';
        
        return await this.makeRequest('GET', '/v1/candidates/search', { params });
    }
    
    // AI Matching
    async getTopMatches(jobId, options = {}) {
        const params = {
            limit: options.limit || 10,
            threshold: options.threshold || 0.7
        };
        return await this.makeRequest('GET', `/v1/match/${jobId}/top`, { params });
    }
    
    async batchMatch(jobIds, options = {}) {
        const payload = {
            job_ids: jobIds,
            limit_per_job: options.limitPerJob || 5,
            include_reasoning: true
        };
        return await this.makeRequest('POST', '/v1/match/batch', { data: payload });
    }
}

// Usage Example
const client = new BHIVHRClient('http://localhost:8000', 'your_api_key_here');

// Search for candidates
client.searchCandidates({
    skills: ['React', 'Node.js', 'AWS'],
    location: 'Bangalore',
    aiMatch: true
}).then(results => {
    console.log('Found candidates:', results.candidates.length);
});

// Get AI matches for job
client.getTopMatches(456, { limit: 8, threshold: 0.75 })
    .then(matches => {
        console.log('Top matches:', matches.matches);
    });

// Create job posting
client.createJob({
    title: 'Full Stack Developer',
    department: 'Engineering',
    location: 'Hyderabad',
    experience_level: 'mid',
    requirements: 'React, Node.js, MongoDB, 3+ years',
    salary_range: '$80,000 - $110,000'
}).then(job => {
    console.log('Created job:', job.job_id);
});
```

### **cURL Command Reference**

```bash
#!/bin/bash
# BHIV HR Platform API Examples

# Configuration
BASE_URL="http://localhost:8000"
API_KEY="your_api_key_here"
HEADERS="-H 'Authorization: Bearer $API_KEY' -H 'Content-Type: application/json'"

# 1. Health Check
echo "=== Health Check ==="
curl -s $BASE_URL/health | jq '.'

# 2. List Jobs
echo -e "\n=== List Jobs ==="
curl -s $HEADERS "$BASE_URL/v1/jobs?limit=5&department=Engineering" | jq '.'

# 3. Create Job
echo -e "\n=== Create Job ==="
curl -s -X POST $HEADERS \
  -d '{
    "title": "DevOps Engineer",
    "department": "Operations",
    "location": "Pune",
    "experience_level": "senior",
    "requirements": "AWS, Docker, Kubernetes, Terraform, 4+ years",
    "salary_range": "$100,000 - $130,000"
  }' \
  $BASE_URL/v1/jobs | jq '.'

# 4. Search Candidates with AI Matching
echo -e "\n=== AI Candidate Search ==="
curl -s $HEADERS \
  "$BASE_URL/v1/candidates/search?skills=Python,Django,MongoDB&location=Mumbai&ai_match=true" | jq '.'

# 5. Get AI Matches for Job
echo -e "\n=== AI Job Matching ==="
curl -s $HEADERS \
  "$BASE_URL/v1/match/1/top?limit=3&threshold=0.8&include_reasoning=true" | jq '.'

# 6. Batch Processing
echo -e "\n=== Batch Job Matching ==="
curl -s -X POST $HEADERS \
  -d '{
    "job_ids": [1, 2, 3],
    "limit_per_job": 3,
    "threshold": 0.7
  }' \
  $BASE_URL/v1/match/batch | jq '.'

# 7. Test Database Connectivity
echo -e "\n=== Database Test ==="
curl -s $HEADERS $BASE_URL/test-candidates | jq '.'
```

### **Environment Configuration**

```bash
# .env file for local development
API_BASE_URL=http://localhost:8000
AGENT_SERVICE_URL=http://localhost:9000
LANGGRAPH_SERVICE_URL=http://localhost:9001
API_KEY_SECRET=your_production_api_key_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bhiv_hr
DEBUG=false
LOG_LEVEL=INFO
```

### **Docker Compose Integration**

```yaml
# docker-compose.yml for local development
version: '3.8'
services:
  gateway:
    build: ./backend/services/gateway
    ports:
      - "8000:8000"
    environment:
      - API_KEY_SECRET=${API_KEY_SECRET}
      - MONGODB_URI=${MONGODB_URI}
    depends_on:
      - mongodb
  
  agent:
    build: ./backend/services/agent
    ports:
      - "9000:9000"
    environment:
      - API_KEY_SECRET=${API_KEY_SECRET}
      - MONGODB_URI=${MONGODB_URI}
  
  langgraph:
    build: ./backend/services/langgraph
    ports:
      - "9001:9001"
    environment:
      - API_KEY_SECRET=${API_KEY_SECRET}
      - MONGODB_URI=${MONGODB_URI}
  
  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

---

## 📚 Development Resources & Documentation

### **Interactive API Documentation**

**Swagger/OpenAPI UI**:
- **Gateway Service**: http://localhost:8000/docs (77 endpoints)
- **Agent Service**: http://localhost:9000/docs (6 endpoints)  
- **LangGraph Service**: http://localhost:9001/docs (25 endpoints)

**API Schema Downloads**:
- OpenAPI 3.0 YAML: `/openapi.json` on each service
- Postman Collection: Available in repository `/postman/BHIV-HR-API.postman_collection.json`

### **Development Environment**

**Local Setup Commands**:
```bash
# Clone repository
git clone https://github.com/your-org/bhiv-hr-platform.git
cd bhiv-hr-platform

# Install dependencies
pip install -r backend/requirements.txt

# Start services
docker-compose up -d

# Verify services
curl http://localhost:8000/health
curl http://localhost:9000/health  
curl http://localhost:9001/health
```

**Environment Variables**:
```bash
# Required variables
API_KEY_SECRET=your_secret_key_here
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bhiv_hr

# Optional configuration
DEBUG=true
LOG_LEVEL=DEBUG
RATE_LIMIT_MULTIPLIER=1.5
```

### **Monitoring & Observability**

**Real-time Monitoring**:
- **Prometheus Metrics**: http://localhost:8000/metrics
- **Health Dashboard**: http://localhost:8000/dashboard
- **System Status**: http://localhost:8000/health/detailed
- **Performance Analytics**: Built-in Grafana dashboards

**Logging Configuration**:
```python
# Structured logging format
{
  "timestamp": "2025-12-09T10:30:00Z",
  "level": "INFO",
  "service": "gateway",
  "endpoint": "/v1/jobs",
  "request_id": "req_12345",
  "duration_ms": 45,
  "status_code": 200
}
```

### **Testing & Quality Assurance**

**Automated Testing Suite**:
```bash
# Run API tests
pytest backend/tests/api/ -v

# Run integration tests
pytest backend/tests/integration/ -v

# Performance testing
locust -f backend/tests/performance/locustfile.py

# Security scanning
bandit -r backend/
```

**Postman Collection Features**:
- Pre-configured environments for local/production
- Automated test scripts for each endpoint
- Collection runner for regression testing
- Mock server configurations

### **Deployment & Scaling**

**Production Deployment**:
```yaml
# kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bhiv-hr-gateway
spec:
  replicas: 3
  selector:
    matchLabels:
      app: gateway
  template:
    metadata:
      labels:
        app: gateway
    spec:
      containers:
      - name: gateway
        image: bhiv/gateway:v3.0.0
        ports:
        - containerPort: 8000
        envFrom:
        - configMapRef:
            name: bhiv-config
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

**Auto-scaling Configuration**:
```yaml
# kubernetes/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: gateway-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: bhiv-hr-gateway
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

---

## 🏆 Platform Capabilities Summary

### **Technical Excellence**
✅ **108 Production-Ready Endpoints** across 3 microservices  
✅ **Three-Port Architecture** (8000/Gateway, 9000/Agent, 9001/LangGraph)  
✅ **MongoDB Atlas Migration** - Fully migrated from PostgreSQL  
✅ **Enterprise-Grade Security** - Multi-layer authentication, rate limiting  
✅ **AI-Powered Matching** - Phase 3 semantic engine with RL integration  
✅ **Real-time Workflows** - LangGraph orchestration with multi-channel notifications  

### **Performance & Reliability**
⚡ **Sub-100ms Response Times** for critical operations  
📈 **99.9% Uptime** with automated failover  
🔄 **Horizontal Scaling** via Docker/Kubernetes  
🛡️ **Comprehensive Monitoring** with Prometheus/Grafana  
📋 **Structured Logging** for observability  

### **Developer Experience**
📘 **Comprehensive Documentation** with interactive examples  
🔧 **Multiple SDK Options** (Python, JavaScript, cURL)  
🧪 **Automated Testing Suite** with CI/CD integration  
📦 **Docker Deployment** for consistent environments  
📊 **Real-time Analytics** and performance metrics  

---

**BHIV HR Platform API Documentation v4.3.0** - Enterprise-grade recruitment platform with 111 endpoints, MongoDB implementation, and three-port microservices architecture.

*Built with Integrity, Honesty, Discipline, Hard Work & Gratitude*

**Documentation Last Updated**: January 22, 2026  
**Platform Status**: ✅ All Services Operational  
**Total Endpoints**: 111 (80 Gateway + 6 Agent + 25 LangGraph)  
**Database**: MongoDB Atlas (17+ collections)  
**Architecture**: Three-Port Microservices (8000/9000/9001)  
**Uptime**: 99.9% | **Response Time**: <100ms avg