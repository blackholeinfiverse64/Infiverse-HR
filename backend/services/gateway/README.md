# Gateway Service

**FastAPI + Python 3.12.7**  
**Purpose:** Central API gateway for routing, authentication, and orchestration between HR platform services.

## Architecture Overview

The Gateway service serves as the primary entry point for the BHIV HR Platform, handling API requests, authentication, service orchestration, and monitoring. It manages communication between various microservices including the AI Agent, LangGraph workflow engine, and client/candidate portals.

### Core Components
- **API Gateway:** Routes requests to appropriate services
- **Authentication Layer:** JWT and API key authentication
- **Service Integration:** Communication with Agent, LangGraph, and Portal services
- **Database Layer:** MongoDB Atlas integration
- **Monitoring System:** Performance metrics and health checks
- **Security Features:** Rate limiting, input validation, and CSP

### Service Architecture
```
gateway/
├── app/                    # FastAPI application core
│   ├── main.py             # Main application with 77+ endpoints
│   ├── database.py         # MongoDB async connection
│   └── db_helpers.py       # MongoDB utility functions
├── config.py               # Environment configuration
├── dependencies.py         # Authentication dependencies
├── jwt_auth.py             # JWT authentication module
├── langgraph_integration.py # LangGraph service integration
├── monitoring.py           # Advanced monitoring system
├── routes/                 # Modular route definitions
│   ├── ai_integration.py   # AI service routes
│   └── rl_routes.py        # Reinforcement learning routes
├── Dockerfile              # Container configuration
├── requirements.txt        # Python dependencies
└── run.bat                 # Windows startup script
```

## API Endpoints

### Core API Endpoints (5 endpoints)
- `GET /` - API Root Information
- `GET /health` - Health Check
- `GET /docs` - API Documentation
- `GET /openapi.json` - OpenAPI Schema
- `GET /v1/test-candidates` - Database Connectivity Test

### Job Management (2 endpoints)
- `POST /v1/jobs` - Create New Job Posting
- `GET /v1/jobs` - List All Active Jobs

### Candidate Management (5 endpoints)
- `GET /v1/candidates` - Get All Candidates with Pagination
- `GET /v1/candidates/search` - Search & Filter Candidates
- `GET /v1/candidates/job/{job_id}` - Get All Candidates for Specific Job
- `GET /v1/candidates/{candidate_id}` - Get Specific Candidate by ID
- `POST /v1/candidates/bulk` - Bulk Upload Candidates

### AI Matching Engine (2 endpoints)
- `GET /v1/match/{job_id}/top` - AI-powered semantic candidate matching
- `POST /v1/match/batch` - Batch AI matching via Agent Service

### Assessment & Workflow (6 endpoints)
- `POST /v1/feedback` - Values Assessment
- `GET /v1/feedback` - Get All Feedback Records
- `GET /v1/interviews` - Get All Interviews
- `POST /v1/interviews` - Schedule Interview
- `POST /v1/offers` - Create Job Offer
- `GET /v1/offers` - Get All Job Offer

### Analytics & Statistics (3 endpoints)
- `GET /v1/candidates/stats` - Dynamic Candidate Statistics
- `GET /v1/database/schema` - Get Database Schema Information
- `GET /v1/reports/job/{job_id}/export.csv` - Export Job Report

### Client Portal API (2 endpoints)
- `POST /v1/client/register` - Client Registration
- `POST /v1/client/login` - Client Authentication

### Security Testing (12 endpoints)
- `GET /v1/security/rate-limit-status` - Check Rate Limit Status
- `GET /v1/security/blocked-ips` - View Blocked IPs
- `POST /v1/security/test-input-validation` - Test Input Validation
- `POST /v1/security/validate-email` - Email Validation
- `POST /v1/security/test-email-validation` - Test Email Validation
- `POST /v1/security/validate-phone` - Phone Validation
- `POST /v1/security/test-phone-validation` - Test Phone Validation
- `GET /v1/security/test-headers` - Test Security Headers
- `GET /v1/security/security-headers-test` - Test Security Headers Legacy
- `POST /v1/security/penetration-test` - Penetration Test
- `GET /v1/security/test-auth` - Test Authentication
- `GET /v1/security/penetration-test-endpoints` - Penetration Test Endpoints

### CSP Management (4 endpoints)
- `POST /v1/security/csp-report` - CSP Violation Reporting
- `GET /v1/security/csp-violations` - View CSP Violations
- `GET /v1/security/csp-policies` - Current CSP Policies
- `POST /v1/security/test-csp-policy` - Test CSP Policy

### Two-Factor Authentication (8 endpoints)
- `POST /v1/auth/2fa/setup` - Setup 2FA
- `POST /v1/auth/2fa/verify` - Verify 2FA
- `POST /v1/auth/2fa/login` - 2FA Login
- `GET /v1/auth/2fa/status/{user_id}` - 2FA Status
- `POST /v1/auth/2fa/disable` - Disable 2FA
- `POST /v1/auth/2fa/backup-codes` - Generate Backup Codes
- `POST /v1/auth/2fa/test-token` - Test Token
- `GET /v1/auth/2fa/qr/{user_id}` - QR Code

### Password Management (6 endpoints)
- `POST /v1/auth/password/validate` - Validate Password
- `GET /v1/auth/password/generate` - Generate Password
- `GET /v1/auth/password/policy` - Password Policy
- `POST /v1/auth/password/change` - Change Password
- `POST /v1/auth/password/strength` - Password Strength Test
- `GET /v1/auth/password/security-tips` - Security Tips

### Candidate Portal APIs (7 endpoints)
- `POST /v1/candidate/register` - Candidate Registration
- `POST /v1/candidate/login` - Candidate Login
- `GET /v1/candidate/profile/{candidate_id}` - Get Candidate Profile
- `PUT /v1/candidate/profile/{candidate_id}` - Update Candidate Profile
- `POST /v1/candidate/apply` - Apply for Job
- `GET /v1/candidate/applications/{candidate_id}` - Get Candidate Applications
- `GET /v1/candidate/stats/{candidate_id}` - Get Candidate Statistics

### Recruiter Portal APIs (1 endpoint)
- `GET /v1/recruiter/stats` - Get Recruiter Dashboard Statistics

### Monitoring & Health (3 endpoints)
- `GET /metrics` - Prometheus Metrics Export
- `GET /health/detailed` - Detailed Health Check with Metrics
- `GET /metrics/dashboard` - Metrics Dashboard Data

### LangGraph Integration (8 endpoints)
- `POST /api/v1/workflow/trigger` - Trigger LangGraph Workflow
- `GET /api/v1/workflow/status/{workflow_id}` - Get Workflow Status
- `GET /api/v1/workflow/list` - List All Workflows
- `GET /api/v1/workflows` - List Workflows Alt
- `GET /api/v1/workflow/health` - Check LangGraph Service Health
- `POST /api/v1/webhooks/candidate-applied` - Webhook: Candidate Applied
- `POST /api/v1/webhooks/candidate-shortlisted` - Webhook: Candidate Shortlisted
- `POST /api/v1/webhooks/interview-scheduled` - Webhook: Interview Scheduled

### AI Integration (2 endpoints)
- `POST /api/v1/test-communication` - Test communication system
- `POST /api/v1/gemini/analyze` - Analyze text using Gemini AI

### RL + Feedback Agent (4 endpoints)
- `POST /rl/predict` - Proxy RL prediction to LangGraph service
- `POST /rl/feedback` - Proxy RL feedback to LangGraph service
- `GET /rl/analytics` - Proxy RL analytics to LangGraph service
- `GET /rl/performance` - Proxy RL performance to LangGraph service

## Authentication & Security Implementation

### Dual Authentication System
- **API Key Authentication:** For service-to-service communication
- **JWT Token Authentication:** For user authentication with dual secrets:
  - `JWT_SECRET_KEY` - For client authentication
  - `CANDIDATE_JWT_SECRET_KEY` - For candidate authentication

### Security Features
- **Rate Limiting:** Dynamic rate limiting based on endpoint and system load
- **Input Validation:** Comprehensive validation with regex patterns
- **CSP (Content Security Policy):** Protection against XSS attacks
- **CORS Configuration:** Flexible origin management
- **Two-Factor Authentication:** TOTP-based 2FA with QR code
- **Password Security:** Bcrypt hashing with strength validation
- **SQL Injection Prevention:** Parameterized queries and input sanitization

## Database Integration

### MongoDB Atlas
- **Driver:** Motor (async MongoDB driver for FastAPI)
- **Connection:** AsyncIOMotorClient with connection pooling
- **Collections:** Candidates, jobs, feedback, interviews, offers, clients, users, matching_cache, audit_logs, rate_limits, csp_violations, company_scoring_preferences
- **Schema:** Dynamic schema with automatic ObjectId to string conversion
- **Operations:** Async CRUD operations with proper error handling

### Database Helpers
- `find_one_by_field()` - Find document by field value
- `find_many()` - Find multiple documents with pagination
- `count_documents()` - Count documents matching query
- `insert_one()` - Insert single document
- `update_one()` - Update single document
- `delete_one()` - Delete single document

## Configuration Requirements

### Environment Variables
```env
# Database
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>

# Authentication
API_KEY_SECRET=<your-api-key>
JWT_SECRET_KEY=<your-jwt-secret>
CANDIDATE_JWT_SECRET_KEY=<your-candidate-jwt-secret>
GATEWAY_SECRET_KEY=<your-gateway-secret>

# Service URLs
AGENT_SERVICE_URL=http://localhost:9000
LANGGRAPH_SERVICE_URL=http://localhost:9001

# Optional: AI Services
GEMINI_API_KEY=<your-gemini-key>

# Optional: Communication (LangGraph)
GMAIL_EMAIL=<your-email>
GMAIL_APP_PASSWORD_SECRET_KEY=<your-app-password>
TWILIO_ACCOUNT_SID=<your-twilio-sid>
TWILIO_AUTH_TOKEN_SECRET_KEY=<your-twilio-token>
TWILIO_WHATSAPP_NUMBER=<your-whatsapp-number>
TELEGRAM_BOT_TOKEN_SECRET_KEY=<your-telegram-token>
```

## Deployment Instructions

### Local Development
```bash
cd services/gateway
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Docker Deployment
```bash
# Build image
docker build -t gateway-service .

# Run container
docker run -p 8000:8000 --env-file .env gateway-service
```

### Docker Compose
```yaml
version: '3.8'
services:
  gateway:
    build: .
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      - mongodb
```

## Integration Points

### With AI Agent Service
- Matches candidates to jobs using semantic analysis
- Batch matching for multiple job positions
- Fallback mechanisms when agent service is unavailable

### With LangGraph Service
- Workflow orchestration for hiring processes
- Communication automation (email, WhatsApp, Telegram)
- Reinforcement learning feedback loops
- Webhook triggers for automation

### With Portal Services
- Candidate portal authentication
- Client portal integration
- HR dashboard analytics

## Monitoring and Error Handling

### Prometheus Metrics
- API response times
- Resume processing metrics
- Matching performance metrics
- Error rates and counts
- Active user counts
- Database connection metrics

### Error Handling
- Comprehensive exception handling
- Detailed error responses
- Logging for debugging
- Graceful degradation with fallbacks

## Security Best Practices

### Implemented Security Measures
- JWT token validation with multiple secret support
- API key authentication for service communication
- Rate limiting with dynamic thresholds
- Input validation and sanitization
- CSP header implementation
- Two-factor authentication
- Password strength enforcement
- Secure password hashing with bcrypt
- Session management

### Penetration Testing Endpoints
- Input validation testing
- Email format validation
- Phone format validation
- Security header verification

## Development Notes
- All database operations are asynchronous using Motor
- Error handling includes fallback mechanisms
- API keys required for most endpoints
- JWT tokens support both client and candidate authentication
- Integration with external services via HTTPX
- Comprehensive logging for monitoring and debugging
