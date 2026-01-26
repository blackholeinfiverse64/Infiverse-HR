# 🧪 BHIV HR Platform - Testing Guide

**Comprehensive guide for testing authentication, MongoDB, and API endpoints**

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Authentication Testing](#authentication-testing)
3. [MongoDB Testing](#mongodb-testing)
4. [API Endpoint Testing](#api-endpoint-testing)
5. [Test Scripts Reference](#test-scripts-reference)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
- Backend services running (Gateway on port 8000)
- MongoDB connection configured
- Python 3.12+ with required dependencies installed

### Run All Tests
```bash
# From backend directory
cd backend

# Test authentication flows
python test_authentication_changes.py

# Test MongoDB scripts
python test_mongodb_scripts.py

# Test API endpoints (from tests directory)
cd tests
python comprehensive_endpoint_tests.py
```

---

## 🔐 Authentication Testing

### Overview
The `test_authentication_changes.py` script tests all authentication flows including candidate, recruiter, and client login/registration.

### Location
`backend/test_authentication_changes.py`

### What It Tests
- ✅ Candidate registration with role field
- ✅ Candidate login and JWT token generation
- ✅ Recruiter registration (via candidate endpoint with role='recruiter')
- ✅ Recruiter login
- ✅ Client registration
- ✅ Client login (using email)
- ✅ JWT token validation
- ✅ Authenticated endpoint access
- ✅ Role-based access control

### Usage
```bash
# From backend directory
python test_authentication_changes.py
```

### Expected Output
```
============================================================
AUTHENTICATION CHANGES TEST SUITE
============================================================
[OK] Candidate Registration: PASSED
[OK] Candidate Login: PASSED
[OK] Recruiter Registration: PASSED
[OK] Recruiter Login: PASSED
[OK] Client Registration: PASSED
[OK] Client Login: PASSED
[OK] Authenticated Endpoint (candidate): PASSED
[OK] Authenticated Endpoint (client): PASSED

============================================================
TEST SUMMARY
============================================================
[OK] Passed: 8
[ERROR] Failed: 0
[SUCCESS] ALL TESTS PASSED!
============================================================
```

### Test Data
- Uses unique email addresses with timestamp prefix
- Automatically cleans up test data (optional)
- Tests with real JWT tokens from backend

### Configuration
Edit the script to change:
- `BASE_URL`: Default is `http://localhost:8000`
- `TEST_EMAIL_PREFIX`: Default uses timestamp

---

## 🗄️ MongoDB Testing

### Overview
The MongoDB testing suite includes scripts for schema verification, index creation, and data migration.

### Test Script: `test_mongodb_scripts.py`

#### Location
`backend/test_mongodb_scripts.py`

#### What It Tests
- ✅ MongoDB schema verification script execution
- ✅ Index creation script execution
- ✅ Schema migration script execution
- ✅ Collection existence verification
- ✅ Script error handling

#### Usage
```bash
# From backend directory
python test_mongodb_scripts.py
```

#### Expected Output
```
============================================================
MONGODB SCRIPTS TEST SUITE
============================================================
[OK] verify_mongodb_schema.py execution: PASSED
[OK] verify_mongodb_schema.py - Collections found: PASSED
[OK] create_mongodb_indexes.py execution: PASSED
[OK] create_mongodb_indexes.py - Indexes: PASSED
[OK] migrate_mongodb_schema.py execution: PASSED
[OK] migrate_mongodb_schema.py - Migration: PASSED

[SUCCESS] ALL TESTS PASSED!
============================================================
```

### MongoDB Schema Verification

#### Script: `verify_mongodb_schema.py`
**Location:** `backend/services/gateway/verify_mongodb_schema.py`

#### Purpose
Verifies that all required MongoDB collections and fields exist for authentication and role management.

#### What It Checks
- ✅ Collections exist (candidates, clients)
- ✅ Required fields present (email, password_hash, role, etc.)
- ✅ Indexes exist for performance
- ✅ Role field distribution
- ✅ Missing fields identification

#### Usage
```bash
python services/gateway/verify_mongodb_schema.py
```

#### Expected Output
```
============================================================
MongoDB Schema Verification
============================================================
[OK] Connected to MongoDB database: bhiv_hr
[INFO] Found 3 collections: candidates, clients, jobs

[CHECK] Checking 'candidates' collection...
[OK] 'candidates' collection exists
[INFO] Total candidates: 15
[OK] All required fields present
[OK] 'role' field exists
   Role distribution: {'candidate': 10, 'recruiter': 5}

[CHECK] Checking 'clients' collection...
[OK] 'clients' collection exists
[INFO] Total clients: 5
[OK] All required fields present
[OK] 'email' field exists (required for email-based login)

[SUMMARY] VERIFICATION SUMMARY
[OK] No critical issues found!
```

### MongoDB Index Creation

#### Script: `create_mongodb_indexes.py`
**Location:** `backend/services/gateway/create_mongodb_indexes.py`

#### Purpose
Creates recommended indexes for optimal query performance.

#### Indexes Created
- `candidates.email` (unique)
- `candidates.role`
- `clients.email` (unique)
- `clients.client_id` (unique)

#### Usage
```bash
python services/gateway/create_mongodb_indexes.py
```

#### Expected Output
```
============================================================
MongoDB Index Creation
============================================================
[OK] Connected to MongoDB database: bhiv_hr
[OK] Index on candidates.email created successfully
[OK] Index on candidates.role created successfully
[OK] Index on clients.email created successfully
[OK] Index on clients.client_id created successfully
[SUCCESS] All indexes created successfully!
```

### MongoDB Schema Migration

#### Script: `migrate_mongodb_schema.py`
**Location:** `backend/services/gateway/migrate_mongodb_schema.py`

#### Purpose
Migrates existing MongoDB data to add missing fields (e.g., role field for candidates).

#### What It Does
- ✅ Adds `role` field to candidates missing it (defaults to 'candidate')
- ✅ Identifies candidates without `password_hash`
- ✅ Reports migration statistics

#### Usage
```bash
python services/gateway/migrate_mongodb_schema.py
```

#### Expected Output
```
============================================================
MongoDB Schema Migration
============================================================
[OK] Connected to MongoDB database: bhiv_hr
[MIGRATION] Found 5 candidates without 'role' field
[MIGRATION] Updated 5 candidates with role='candidate'
[SUCCESS] Migration completed successfully!
```

---

## 🌐 API Endpoint Testing

### Overview
Comprehensive testing of all API endpoints across all services.

### Script: `comprehensive_endpoint_tests.py`
**Location:** `backend/tests/comprehensive_endpoint_tests.py`

### What It Tests
- ✅ All 108 endpoints (77 Gateway + 6 Agent + 25 LangGraph)
- ✅ Service health checks
- ✅ Authentication & security
- ✅ Business workflow
- ✅ AI matching engine
- ✅ LangGraph workflows
- ✅ Service integration
- ✅ Portal accessibility

### Usage
```bash
cd backend/tests
python comprehensive_endpoint_tests.py
```

### Configuration
Set environment variables for production testing:
```bash
export API_KEY_SECRET="your-production-api-key"
export GATEWAY_SERVICE_URL="http://localhost:8000"
export AGENT_SERVICE_URL="http://localhost:9000"
export LANGGRAPH_SERVICE_URL="http://localhost:9001"
```

### Expected Output
See `backend/tests/README.md` for detailed output format.

---

## 📚 Test Scripts Reference

### Authentication Tests

| Script | Location | Purpose |
|--------|----------|---------|
| `test_authentication_changes.py` | `backend/` | Test all authentication flows |

### MongoDB Tests

| Script | Location | Purpose |
|--------|----------|---------|
| `test_mongodb_scripts.py` | `backend/` | Test MongoDB script execution |
| `verify_mongodb_schema.py` | `backend/services/gateway/` | Verify MongoDB schema |
| `create_mongodb_indexes.py` | `backend/services/gateway/` | Create indexes |
| `migrate_mongodb_schema.py` | `backend/services/gateway/` | Migrate data |

### API Tests

| Script | Location | Purpose |
|--------|----------|---------|
| `comprehensive_endpoint_tests.py` | `backend/tests/` | Test all API endpoints |

---

## 🔧 Troubleshooting

### Authentication Tests Fail

**Issue:** Tests fail with connection errors
```bash
# Solution: Ensure backend is running
python run_services.py
```

**Issue:** Tests fail with 401 Unauthorized
```bash
# Solution: Check JWT_SECRET_KEY in .env file
# Verify environment variables are loaded
python -c "from dotenv import load_dotenv; import os; load_dotenv(); print(os.getenv('JWT_SECRET_KEY'))"
```

### MongoDB Tests Fail

**Issue:** `ModuleNotFoundError: No module named 'motor'`
```bash
# Solution: Install MongoDB dependencies
pip install motor pymongo
```

**Issue:** `DATABASE_URL not found`
```bash
# Solution: Ensure .env file exists with DATABASE_URL
# Check file location: backend/.env or root .env
```

**Issue:** Unicode encoding errors on Windows
```bash
# Solution: Scripts already handle Windows encoding
# If issues persist, set environment variable:
set PYTHONIOENCODING=utf-8
```

### API Tests Fail

**Issue:** Service not found (404)
```bash
# Solution: Verify services are running
curl http://localhost:8000/health
curl http://localhost:9000/health
curl http://localhost:9001/health
```

**Issue:** Authentication errors
```bash
# Solution: Set API_KEY_SECRET environment variable
export API_KEY_SECRET="your-api-key"
```

---

## 📊 Test Results Interpretation

### Success Criteria

#### Authentication Tests
- ✅ **All Pass**: System ready for authentication
- ⚠️ **Some Fail**: Check specific test output for details
- ❌ **All Fail**: Check backend service and environment variables

#### MongoDB Tests
- ✅ **All Pass**: Database schema is correct
- ⚠️ **Warnings**: Review warnings for recommendations
- ❌ **Failures**: Fix critical issues before proceeding

#### API Tests
- ✅ **90%+ Pass**: System is healthy
- ⚠️ **70-89% Pass**: Review failed endpoints
- ❌ **<70% Pass**: Critical issues need attention

---

## 📝 Best Practices

1. **Run tests before deployment**
   ```bash
   python test_authentication_changes.py
   python test_mongodb_scripts.py
   ```

2. **Run MongoDB verification after schema changes**
   ```bash
   python services/gateway/verify_mongodb_schema.py
   ```

3. **Create indexes after data migration**
   ```bash
   python services/gateway/create_mongodb_indexes.py
   ```

4. **Test authentication flows after code changes**
   ```bash
   python test_authentication_changes.py
   ```

5. **Run comprehensive API tests weekly**
   ```bash
   cd tests
   python comprehensive_endpoint_tests.py
   ```

---

## 🔗 Related Documentation

- [Backend README](backend/README.md) - Backend setup and configuration
- [Tests README](backend/tests/README.md) - Detailed API testing guide
- [Environment Variables](ENVIRONMENT_VARIABLES.md) - Required environment variables
- [Testing Checklist](TESTING_CHECKLIST.md) - Manual testing checklist

---

**Last Updated:** January 2026  
**Status:** ✅ All test scripts verified and working

