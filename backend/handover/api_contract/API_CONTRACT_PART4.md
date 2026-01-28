# API Contract — Part 4: Gateway Security & Portals

**Continued from:** [API_CONTRACT_PART3.md](./API_CONTRACT_PART3.md)

**Version:** 4.0.0  
**Last Updated:** January 22, 2026  
**Total Endpoints:** 114 (83 Gateway + 6 Agent + 25 LangGraph)  
**Database:** MongoDB Atlas

---

## Gateway Security Testing

### 46. GET /v1/security/rate-limit-status

**Purpose:** Check current rate limit status

**Authentication:** Bearer token required

**Request:**
```http
GET /v1/security/rate-limit-status
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "rate_limit_enabled": true,
  "requests_per_minute": 60,
  "current_requests": 15,
  "remaining_requests": 45,
  "reset_time": "2026-01-22T13:37:00Z",
  "status": "active"
}
```

**When Called:** Admin monitors rate limiting

**Implemented In:** `services/gateway/app/main.py` → `check_rate_limit_status()`

---

### 47. GET /v1/security/blocked-ips

**Purpose:** View list of blocked IP addresses

**Authentication:** Bearer token required

**Request:**
```http
GET /v1/security/blocked-ips
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "blocked_ips": [
    {
      "ip": "192.168.1.100",
      "reason": "Rate limit exceeded",
      "blocked_at": "2026-01-22T10:30:00Z"
    }
  ],
  "total_blocked": 1,
  "last_updated": "2026-01-22T13:37:00Z"
}
```

**When Called:** Admin reviews security blocks

**Implemented In:** `services/gateway/app/main.py` → `view_blocked_ips()`

---

### 48-57. Security Testing Endpoints (10 endpoints)

**Endpoints:**
- POST /v1/security/test-input-validation
- POST /v1/security/validate-email
- POST /v1/security/test-email-validation
- POST /v1/security/validate-phone
- POST /v1/security/test-phone-validation
- GET /v1/security/test-headers
- GET /v1/security/security-headers-test
- POST /v1/security/penetration-test
- GET /v1/security/test-auth
- GET /v1/security/penetration-test-endpoints

**Common Pattern:**
```http
POST /v1/security/test-input-validation
Authorization: Bearer YOUR_API_KEY
{"input_data": "<script>alert('xss')</script>"}
```

**Response:**
```json
{
  "input": "<script>alert('xss')</script>",
  "validation_result": "BLOCKED",
  "threats_detected": ["XSS attempt detected"],
  "timestamp": "2024-12-09T13:37:00Z"
}
```

**When Called:** Security testing, penetration testing

**Implemented In:** `services/gateway/app/main.py` → Various security test functions

---

## Gateway CSP Management

### 58. POST /v1/security/csp-report

**Purpose:** Report Content Security Policy violations

**Authentication:** Bearer token required

**Request:**
```http
POST /v1/security/csp-report
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "violated_directive": "script-src",
  "blocked_uri": "https://malicious-site.com/script.js",
  "document_uri": "https://bhiv-platform.com/dashboard"
}
```

**Response (200 OK):**
```json
{
  "message": "CSP violation reported successfully",
  "violation": {
    "violated_directive": "script-src",
    "blocked_uri": "https://malicious-site.com/script.js",
    "document_uri": "https://bhiv-platform.com/dashboard",
    "timestamp": "2026-01-22T13:37:00Z"
  },
  "report_id": "csp_report_1702134000"
}
```

**When Called:** Browser reports CSP violation

**Implemented In:** `services/gateway/app/main.py` → `csp_violation_reporting()`

**Database Impact:** INSERT into csp_violations table

---

### 59-61. CSP Management Endpoints (3 endpoints)

- GET /v1/security/csp-violations
- GET /v1/security/csp-policies
- POST /v1/security/test-csp-policy

**Implemented In:** `services/gateway/app/main.py` → CSP management functions

---

## Gateway Two-Factor Authentication

### 62-69. 2FA Endpoints (8 endpoints)

**Endpoints:**
- POST /v1/auth/2fa/setup
- POST /v1/auth/2fa/verify
- POST /v1/auth/2fa/login
- GET /v1/auth/2fa/status/{user_id}
- POST /v1/auth/2fa/disable
- POST /v1/auth/2fa/backup-codes
- POST /v1/auth/2fa/test-token
- GET /v1/auth/2fa/qr/{user_id}

**Example - Setup:**
```http
POST /v1/auth/2fa/setup
Authorization: Bearer YOUR_API_KEY
{"user_id": "user_123"}
```

**Response:**
```json
{
  "message": "2FA setup initiated",
  "user_id": "user_123",
  "secret": "JBSWY3DPEHPK3PXP",
  "qr_code": "data:image/png;base64,...",
  "manual_entry_key": "JBSWY3DPEHPK3PXP"
}
```

**Implemented In:** `services/gateway/app/main.py` → 2FA functions

---

## Gateway Password Management

### 70-75. Password Management Endpoints (6 endpoints)

**Endpoints:**
- POST /v1/auth/password/validate
- GET /v1/auth/password/generate
- GET /v1/auth/password/policy
- POST /v1/auth/password/change
- POST /v1/auth/password/strength
- GET /v1/auth/password/security-tips

**Example - Validate:**
```http
POST /v1/auth/password/validate
Authorization: Bearer YOUR_API_KEY
{"password": "SecurePass123!"}
```

**Response:**
```json
{
  "password_strength": "Very Strong",
  "score": 100,
  "max_score": 100,
  "is_valid": true,
  "feedback": []
}
```

**Implemented In:** `services/gateway/app/main.py` → Password management functions

---

## Gateway Candidate Portal

### 76. POST /v1/candidate/register

**Purpose:** Register new candidate account

**Authentication:** None (public registration)

**Request:**
```http
POST /v1/candidate/register
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890",
  "location": "New York, NY",
  "experience_years": 3,
  "technical_skills": "JavaScript, React, Node.js",
  "education_level": "Bachelor",
  "seniority_level": "Mid"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Registration successful",
  "candidate_id": 456
}
```

**Sequence:**
1. Check email uniqueness
2. Hash password with bcrypt
3. Insert into candidates table with status='applied'
4. Return candidate_id

**Error Responses:**
- 409 Conflict: Email already registered

**When Called:** Candidate signs up

**Implemented In:** `services/gateway/app/main.py` → `candidate_register()`

**Database Impact:** INSERT into candidates table

---

### 77. POST /v1/candidate/login

**Purpose:** Candidate authentication with JWT token

**Authentication:** None (public login)

**Request:**
```http
POST /v1/candidate/login
Content-Type: application/json

{
  "email": "jane.smith@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "candidate": {
    "id": 456,
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "+1234567890",
    "location": "New York, NY",
    "experience_years": 3,
    "technical_skills": "JavaScript, React, Node.js",
    "seniority_level": "Mid",
    "education_level": "Bachelor",
    "status": "applied"
  }
}
```

**Error Responses:**
- 401 Unauthorized: Invalid credentials

**When Called:** Candidate logs in

**Implemented In:** `services/gateway/app/main.py` → `candidate_login()`

**Database Impact:** SELECT from candidates table

---

### 78. PUT /v1/candidate/profile/{candidate_id}

**Purpose:** Update candidate profile

**Authentication:** Candidate JWT token required

**Request:**
```http
PUT /v1/candidate/profile/456
Content-Type: application/json
Authorization: Bearer CANDIDATE_JWT_TOKEN

{
  "phone": "+0987654321",
  "location": "San Francisco, CA",
  "experience_years": 4,
  "technical_skills": "JavaScript, React, Node.js, TypeScript"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

**Validation:**
- Phone: E.164 format
- Experience years: Non-negative

**Error Responses:**
- 400 Bad Request: Invalid phone format
- 401 Unauthorized: Invalid token

**When Called:** Candidate updates profile

**Implemented In:** `services/gateway/app/main.py` → `update_candidate_profile()`

**Database Impact:** UPDATE candidates table

---

### 79. POST /v1/candidate/apply

**Purpose:** Apply for job

**Authentication:** Candidate JWT token required

**Request:**
```http
POST /v1/candidate/apply
Content-Type: application/json
Authorization: Bearer CANDIDATE_JWT_TOKEN

{
  "candidate_id": 456,
  "job_id": 123,
  "cover_letter": "I am excited to apply for this position..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "application_id": 789
}
```

**Sequence:**
1. Check if already applied
2. Create job_applications table if not exists
3. Insert application with status='applied'
4. Trigger application webhook

**Error Responses:**
- 409 Conflict: Already applied
- 404 Not Found: Job not found

**When Called:** Candidate applies for job

**Implemented In:** `services/gateway/app/main.py` → `apply_for_job()`

**Database Impact:** INSERT into job_applications table

---

### 80. GET /v1/candidate/applications/{candidate_id}

**Purpose:** Get candidate's job applications

**Authentication:** Candidate JWT token required

**Request:**
```http
GET /v1/candidate/applications/456
Authorization: Bearer CANDIDATE_JWT_TOKEN
```

**Response (200 OK):**
```json
{
  "applications": [
    {
      "id": 789,
      "job_id": 123,
      "status": "applied",
      "applied_date": "2026-01-22T13:37:00Z",
      "cover_letter": "I am excited to apply...",
      "job_title": "Senior Software Engineer",
      "department": "Engineering",
      "location": "Remote",
      "experience_level": "senior",
      "company": "Tech Innovations Inc",
      "updated_at": "2026-01-22T13:37:00Z"
    }
  ],
  "count": 1
}
```

**When Called:** Candidate views application history

**Implemented In:** `services/gateway/app/main.py` → `get_candidate_applications()`

**Database Impact:** SELECT from job_applications, jobs, clients tables with JOIN

---

## Summary Table - Part 4

| Endpoint | Method | Category | Purpose | Auth Required |
|----------|--------|----------|---------|---------------|
| /v1/security/rate-limit-status | GET | Security | Check rate limits | Yes |
| /v1/security/blocked-ips | GET | Security | View blocked IPs | Yes |
| /v1/security/test-* (10) | POST/GET | Security | Security testing | Yes |
| /v1/security/csp-report | POST | CSP | Report violation | Yes |
| /v1/security/csp-* (3) | GET/POST | CSP | CSP management | Yes |
| /v1/auth/2fa/* (8) | POST/GET | 2FA | Two-factor auth | Yes |
| /v1/auth/password/* (6) | POST/GET | Password | Password mgmt | Yes |
| /v1/candidate/register | POST | Candidate | Register | No |
| /v1/candidate/login | POST | Candidate | Login | No |
| /v1/candidate/profile/{id} | PUT | Candidate | Update profile | Yes |
| /v1/candidate/apply | POST | Candidate | Apply for job | Yes |
| /v1/candidate/applications/{id} | GET | Candidate | Get applications | Yes |

**Total Endpoints in Part 4:** 35 (Cumulative: 83 of 111)

---

**Continue to:** [API_CONTRACT_PART5.md](./API_CONTRACT_PART5.md) for AI Agent & LangGraph Services
