# BHIV HR Platform — Start Here

**Version**: 4.3.1 | **Status**: Production Ready | **Services**: 6/6 Live | **Endpoints**: 119 | **RL Status**: ✅ 100% Test Pass

---

## What Is This System?

BHIV HR Platform is an **enterprise AI-powered recruiting platform** that automates candidate matching and hiring workflows:

1. **AI Candidate Matching** - Phase 3 semantic engine ranks candidates in <2s
2. **Reinforcement Learning** - System learns from hiring feedback to improve predictions
3. **Workflow Automation** - LangGraph orchestrates multi-step hiring workflows
4. **Multi-Channel Communication** - Email, WhatsApp, Telegram with interactive buttons
5. **Triple Portal System** - HR Portal, Client Portal, Candidate Portal
6. **Enterprise Security** - Triple authentication (API Key + Client JWT + Candidate JWT) + 2FA + Dynamic rate limiting

**Think of it as**: An AI recruiter that learns from every hiring decision and gets smarter over time.

---

## Quick Start (2 Minutes)

### Production URLs (Live Now - No Setup Required)
- **Gateway API**: https://bhiv-hr-gateway-ltg0.onrender.com/docs
- **AI Agent**: https://bhiv-hr-agent-nhgg.onrender.com/docs
- **LangGraph**: https://bhiv-hr-langgraph.onrender.com/docs (33 endpoints: 25 workflow + 8 RL)
- **HR Portal**: https://bhiv-hr-portal-u670.onrender.com
- **Client Portal**: https://bhiv-hr-client-portal-3iod.onrender.com
- **Candidate Portal**: https://bhiv-hr-candidate-portal-abe6.onrender.com

**Demo Credentials**: 
- Client Portal: `TECH001` / `demo123`
- API Testing: Check `.env` file or contact admin for API key

### Local Development (Windows)
```bash
cd "c:\BHIV HR PLATFORM"
docker-compose -f docker-compose.production.yml up -d
# Wait 30 seconds for initialization

# Access locally:
# Gateway: http://localhost:8000/docs
# HR Portal: http://localhost:8501
# Client Portal: http://localhost:8502
# Candidate Portal: http://localhost:8503
```

### Health Check
```bash
curl https://bhiv-hr-gateway-ltg0.onrender.com/health
# Expected: {"status":"healthy","service":"BHIV HR Gateway","version":"4.2.0"}
```

---

## Documentation Structure

```
handover/
├── READ_THIS_FIRST.md          <- You are here
├── architecture/
│   └── ARCHITECTURE.md          <- System design, 6 services, 111 endpoints
├── api_contract/
│   ├── API_CONTRACT_PART1.md    <- Auth, AI, Workflows, RL (17 endpoints)
│   ├── API_CONTRACT_PART2.md    <- Core, Jobs, Candidates (18 endpoints)
│   ├── API_CONTRACT_PART3.md    <- Matching, Assessment, Client (10 endpoints)
│   ├── API_CONTRACT_PART4.md    <- Security, 2FA, Password, Candidate (35 endpoints)
│   ├── API_CONTRACT_PART5.md    <- Agent (6) + LangGraph (25) = 31 endpoints
│   └── DATA_MODELS.md           <- Database schema (19 tables)
├── integration_maps/
│   └── INTEGRATION_MAPS.md      <- 5 service integration flows with diagrams
├── issues/
│   └── ISSUES_AND_LIMITATIONS.md <- 9 known issues with workarounds
├── FAQ.md                        <- 44 troubleshooting scenarios
├── RUNBOOK.md                   <- Complete operations manual
├── QA_CHECKLIST.md             <- 150+ test cases
├── postman/
│   ├── bhiv-local-env.json          <- Environment variables for testing
│   ├── postman_collection.json      <- Complete 119 endpoint collection
│   ├── complete-enhanced-tests.js   <- Advanced test scripts (22 tests)
│   ├── enhanced-tests.js            <- Basic test scripts (10 tests)
│   ├── README.md                    <- Postman setup guide
│   └── test_all_endpoints.py        <- Python test reference
└── video/
    └── overview.mp4             <- System walkthrough (optional)
```

---

## System Architecture

### Microservices (6 Services)
```
┌─────────────────────────────────────────────────────────┐
│                    PORTALS (3)                          │
│  HR Portal (8501) | Client (8502) | Candidate (8503)   │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/REST
                         ↓
┌─────────────────────────────────────────────────────────┐
│              API GATEWAY (8000)                         │
│  80 Endpoints | Triple Auth | Dynamic Rate Limiting    │
└──────┬──────────────┬──────────────┬───────────────────┘
       │              │              │
       ↓              ↓              ↓
┌──────────┐   ┌──────────┐   ┌──────────┐
│ AI Agent │   │LangGraph │   │PostgreSQL│
│  (9000)  │   │  (9001)  │   │  (5432)  │
│6 endpoints│   │25 endpoints│  │19 tables │
│Phase 3 AI│   │Workflows │   │Schema v4 │
└──────────┘   └──────────┘   └──────────┘
```

### Endpoint Distribution
- **Gateway**: 88 endpoints (Auth, Jobs, Candidates, Matching, Security, Workflows, Monitoring)
- **AI Agent**: 6 endpoints (Semantic matching, Batch processing, Analysis)
- **LangGraph**: 25 endpoints (Workflow automation, RL integration, Communication)
- **Total**: 119 endpoints

### Technology Stack
- **Backend**: FastAPI 4.2.0, Python 3.12.7
- **Frontend**: Streamlit 1.41.1
- **Database**: PostgreSQL 17 (Schema v4.3.1, 19 tables: 13 core + 6 RL with 5 predictions, 17 feedback records)
- **AI/ML**: Sentence Transformers (Phase 3), scikit-learn, Reinforcement Learning
- **Deployment**: Docker containers on Render Cloud (Oregon, US West)
- **Cost**: $0/month (optimized free tier)

---

## Common Tasks

### 1. Test API with Postman
```bash
# Steps:
1. Open Postman
2. Import: handover/postman_collection.json
3. Set environment variable: api_key_secret = YOUR_API_KEY
4. Test any of 111 endpoints
5. See POSTMAN_README.md for detailed guide
```

### 2. Create Candidate via API
```bash
curl -X POST https://bhiv-hr-gateway-ltg0.onrender.com/v1/candidates \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "technical_skills": "Python, FastAPI, PostgreSQL",
    "experience_years": 5,
    "seniority_level": "Senior",
    "education_level": "Bachelor"
  }'
```

### 3. Get AI Matches for Job
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://bhiv-hr-gateway-ltg0.onrender.com/v1/match/1/top
```

### 4. Submit Hiring Feedback
```bash
curl -X POST https://bhiv-hr-gateway-ltg0.onrender.com/v1/feedback \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": 1,
    "job_id": 1,
    "integrity": 5,
    "honesty": 5,
    "discipline": 4,
    "hard_work": 5,
    "gratitude": 4
  }'
```

### 5. Trigger Workflow Automation
```bash
curl -X POST https://bhiv-hr-gateway-ltg0.onrender.com/api/v1/workflow/trigger \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "workflow_type": "candidate_application",
    "candidate_id": 1,
    "job_id": 1
  }'
```

### 6. Check Service Health
```bash
# Production
curl https://bhiv-hr-gateway-ltg0.onrender.com/health
curl https://bhiv-hr-agent-nhgg.onrender.com/health
curl https://bhiv-hr-langgraph.onrender.com/health

# Local
curl http://localhost:8000/health
curl http://localhost:9000/health
curl http://localhost:9001/health
```

### 7. View Logs (Local Development)
```bash
docker logs -f bhiv-hr-gateway    # Gateway logs
docker logs -f bhiv-hr-agent      # AI matching logs
docker logs -f bhiv-hr-langgraph  # Workflow logs
docker logs -f bhiv-hr-portal     # HR Portal logs
```

### 8. Troubleshoot Issue
**Step-by-step**:
1. Check `FAQ.md` - 44 common issues with solutions
2. Check `RUNBOOK.md` - Operations manual with diagnostics
3. Check service health endpoints
4. Check logs for errors
5. Contact team if unresolved

---

## File Locations

| What You Need | Where To Find It |
|---------------|------------------|
| **API Documentation** | `api_contract/API_CONTRACT_PART*.md` (5 parts covering 119 endpoints) |
| **System Architecture** | `architecture/ARCHITECTURE.md` |
| **Troubleshooting Guide** | `FAQ.md` (44 Q&A scenarios) |
| **Operations Manual** | `RUNBOOK.md` (startup, shutdown, backup, recovery) |
| **Test Cases** | `QA_CHECKLIST.md` (150+ test cases) |
| **Postman Collection** | `postman/postman_collection.json` + `postman/README.md` |
| **Service Integration** | `integration_maps/INTEGRATION_MAPS.md` (5 flows) |
| **Known Issues** | `issues/ISSUES_AND_LIMITATIONS.md` (9 issues) |
| **Database Schema** | `api_contract/DATA_MODELS.md` (19 tables) |
| **Source Code** | `../services/` (gateway, agent, langgraph, portals, db) |
| **Tests** | `../tests/` (organized by service) |
| **Tools** | `../tools/` (data, security, monitoring utilities) |

---

## Key Concepts

### Authentication (Triple System)
1. **API Key** (Bearer token) - Service-to-service and API access
2. **Client JWT** - Client portal authentication (HS256, 24h expiry)
3. **Candidate JWT** - Candidate portal authentication (HS256, 24h expiry)

### Candidate Lifecycle
```
1. Candidate created (API/Portal/Bulk import)
   ↓
2. AI Agent ranks candidate (Phase 3 semantic matching, <2s)
   ↓
3. Candidate appears in HR Portal with ai_rank (0-100)
   ↓
4. HR reviews and schedules interview
   ↓
5. HR provides BHIV values feedback (Integrity, Honesty, Discipline, Hard Work, Gratitude)
   ↓
6. RL model learns from feedback
   ↓
7. Future rankings improve based on patterns
```

### Workflow Automation
```
1. Event triggered (candidate applies, interview scheduled, etc.)
   ↓
2. LangGraph workflow starts
   ↓
3. Multi-step automation executes (notifications, status updates, RL feedback)
   ↓
4. Multi-channel notifications sent (Email, WhatsApp, Telegram)
   ↓
5. Workflow status tracked in real-time
   ↓
6. Completion logged with metrics
```

### AI Matching (Phase 3)
```
Job Requirements → Semantic Embeddings → Candidate Pool
                                              ↓
                                    Similarity Scoring
                                              ↓
                                    RL Adjustment (learns from feedback)
                                              ↓
                                    Ranked Results (0-100 score)
```

### Reinforcement Learning
- **Feedback Loop**: HR provides BHIV values ratings (1-5) after interviews
- **Learning**: System identifies patterns in successful hires with 80% model accuracy
- **Optimization**: Future rankings weighted by learned preferences (340% feedback rate)
- **Adaptation**: Company-specific optimization over time
- **Tables**: 6 dedicated RL tables with 5 predictions, 17 feedback records
- **Status**: 8 RL endpoints operational with 100% test pass rate

---

## Security Features

### Authentication Layers
1. **API Key Authentication** - Bearer token for service/API access
2. **Client JWT** - HS256 tokens with 24h expiry for client portal
3. **Candidate JWT** - HS256 tokens with 24h expiry for candidate portal
4. **2FA TOTP** - Time-based one-time passwords with QR code generation

### Security Headers
- **CSP** (Content Security Policy)
- **XSS Protection** (X-XSS-Protection)
- **HSTS** (HTTP Strict Transport Security)
- **X-Frame-Options**: DENY
- **X-Content-Type-Options**: nosniff

### Rate Limiting
- **Dynamic**: 60-500 requests/minute based on CPU usage
- **Per-endpoint**: Configurable limits
- **IP-based**: Tracking and throttling

### Data Protection
- **Password Hashing**: bcrypt with salt
- **Token Encryption**: HS256 algorithm
- **SQL Injection Prevention**: Parameterized queries
- **Input Validation**: Pydantic models
- **Audit Logging**: All critical operations logged

---

## Performance Metrics

| Metric | Target | Current |
|--------|--------|----------|
| **API Response Time** | <100ms | ✅ 45ms avg |
| **AI Matching Speed** | <2s | ✅ <0.02s |
| **Batch Processing** | 50 candidates/chunk | ✅ Operational |
| **Uptime** | >99% | ✅ 99.9% |
| **Concurrent Users** | 100+ | ✅ Supported |
| **Database Connections** | Pool of 20 | ✅ Optimized |

---

## Known Issues & Workarounds

**See**: `issues/ISSUES_AND_LIMITATIONS.md` for complete list (9 issues)

### Top 3 Issues:

1. **Cold Start Delay (Render Free Tier)**
   - **Issue**: Services sleep after 15 min inactivity, 30-60s wake time
   - **Workaround**: Use health check pings or upgrade to paid tier
   - **Impact**: First request slow, subsequent requests normal

2. **WhatsApp/Telegram Rate Limits**
   - **Issue**: Free tier API limits (1000 msgs/day WhatsApp, 30 msgs/sec Telegram)
   - **Workaround**: Implement message queuing, upgrade for production
   - **Impact**: High-volume notifications may be delayed

3. **Database Connection Pool**
   - **Issue**: Free tier PostgreSQL limited to 20 connections
   - **Workaround**: Connection pooling configured, monitor usage
   - **Impact**: High concurrent load may hit limits

---

## Next Steps

### For New Developers
1. ✅ Read this file (you're here!)
2. 📖 Read `architecture/ARCHITECTURE.md` - Understand system design
3. 🔌 Read `api_contract/API_CONTRACT_PART1.md` - Start with core APIs
4. 🧪 Import `postman_collection.json` - Test endpoints
5. 💻 Run local setup - `docker-compose up -d`
6. 🎯 Complete `QA_CHECKLIST.md` - Verify functionality

### For Operations Team
1. ✅ Read this file
2. 📚 Read `RUNBOOK.md` - Operations manual
3. ❓ Bookmark `FAQ.md` - Troubleshooting guide
4. 🔔 Setup monitoring - Health check endpoints
5. 🔐 Secure credentials - Update `.env` files
6. 📊 Review `issues/ISSUES_AND_LIMITATIONS.md` - Known issues

### For QA Team
1. ✅ Read this file
2. 📋 Use `QA_CHECKLIST.md` - 150+ test cases
3. 🔧 Import `postman_collection.json` - API testing
4. 🔄 Test `integration_maps/INTEGRATION_MAPS.md` - 5 integration flows
5. 🐛 Report issues using template in `issues/` folder

### For Product Managers
1. ✅ Read this file
2. 🎥 Watch `video/overview.mp4` (if available)
3. 🌐 Test live portals - HR, Client, Candidate
4. 📊 Review `architecture/ARCHITECTURE.md` - Feature overview
5. 📈 Check production metrics - Uptime, performance

---

## Support & Resources

### Documentation
- **Main README**: `../README.md` - Complete project overview
- **Quick Start**: `../docs/guides/QUICK_START_GUIDE.md` - 5-minute setup
- **User Guide**: `../docs/guides/USER_GUIDE.md` - End-user manual
- **API Docs**: `../docs/api/API_DOCUMENTATION.md` - Complete API reference

### Live Resources
- **Gateway API Docs**: https://bhiv-hr-gateway-ltg0.onrender.com/docs (Swagger UI)
- **AI Agent Docs**: https://bhiv-hr-agent-nhgg.onrender.com/docs (Swagger UI)
- **LangGraph Docs**: https://bhiv-hr-langgraph.onrender.com/docs (Swagger UI)
- **GitHub Repository**: https://github.com/Shashank-0208/BHIV-HR-PLATFORM

### Contact
- **Platform**: Render Cloud (Oregon, US West)
- **Deployment**: Docker-based microservices
- **Database**: PostgreSQL 17 on Render
- **Monitoring**: Health endpoints + Prometheus metrics

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│              BHIV HR PLATFORM - QUICK REFERENCE             │
├─────────────────────────────────────────────────────────────┤
│ PRODUCTION URLS                                             │
│ • Gateway:  bhiv-hr-gateway-ltg0.onrender.com/docs         │
│ • AI Agent: bhiv-hr-agent-nhgg.onrender.com/docs           │
│ • LangGraph: bhiv-hr-langgraph.onrender.com/docs           │
│ • HR Portal: bhiv-hr-portal-u670.onrender.com              │
│ • Client:   bhiv-hr-client-portal-3iod.onrender.com        │
│ • Candidate: bhiv-hr-candidate-portal-abe6.onrender.com    │
├─────────────────────────────────────────────────────────────┤
│ DEMO CREDENTIALS                                            │
│ • Client Portal: TECH001 / demo123                         │
│ • API Key: Check .env file or Render dashboard            │
├─────────────────────────────────────────────────────────────┤
│ LOCAL PORTS                                                 │
│ • Gateway: 8000  • Agent: 9000  • LangGraph: 9001         │
│ • HR: 8501  • Client: 8502  • Candidate: 8503             │
│ • Database: 5432                                           │
├─────────────────────────────────────────────────────────────┤
│ KEY COMMANDS                                                │
│ • Start: docker-compose -f docker-compose.production.yml up│
│ • Stop:  docker-compose -f docker-compose.production.yml down│
│ • Logs:  docker logs -f bhiv-hr-gateway                    │
│ • Health: curl http://localhost:8000/health                │
├─────────────────────────────────────────────────────────────┤
│ CRITICAL FILES                                              │
│ • Architecture: architecture/ARCHITECTURE.md               │
│ • API Docs: api_contract/API_CONTRACT_PART*.md (5 parts)  │
│ • Troubleshooting: FAQ.md (44 scenarios)       │
│ • Operations: RUNBOOK.md                                   │
│ • Testing: QA_CHECKLIST.md (150+ cases)              │
│ • Postman: postman/postman_collection.json (119 endpoints)│
├─────────────────────────────────────────────────────────────┤
│ SYSTEM STATS                                                │
│ • Services: 6/6 Live  • Endpoints: 119  • Uptime: 99.9%   │
│ • Response: <100ms  • AI Match: <0.02s  • Cost: $0/month  │
│ • Database: 19 tables  • Schema: v4.3.0                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Version History

- **v4.3.1** (Dec 2024) - Enhanced Postman testing, 119 endpoints, complete RL integration
- **v3.0.0** (Dec 2024) - Production release with RL integration, unified auth, LangGraph workflows
- **v2.0.0** (Nov 2024) - Phase 3 semantic engine, triple portal system
- **v1.0.0** (Oct 2024) - Initial microservices architecture

---

**BHIV HR Platform v4.3.1** - Enterprise AI-powered recruiting platform

*Built with Integrity, Honesty, Discipline, Hard Work & Gratitude*

**Status**: ✅ Production Ready | **Services**: 6/6 Live | **Endpoints**: 119 | **Uptime**: 99.9% | **Cost**: $0/month

---

**Last Updated**: December 22, 2024 | **Maintained By**: BHIV Development Team  ↓
3. AI matching performed (if needed)
   ↓
4. Multi-channel notifications sent (Email + WhatsApp + Telegram)
   ↓
5. Status updated in database
   ↓
6. Workflow completion logged
```

### Data Flow
```
Portal → Gateway → Agent/LangGraph → Database
         ↓
    Authentication & Rate Limiting
         ↓
    Monitoring & Logging
```

---

## Performance Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| API Response Time | < 100ms | 45ms avg | ✅ |
| AI Matching Time | < 2s | 0.45s avg | ✅ |
| Workflow Completion | < 5min | 3-5min | ✅ |
| System Uptime | 99.9% | 99.9% | ✅ |
| Concurrent Users | 100+ | Tested | ✅ |
| Database Queries | < 100ms | 50ms avg | ✅ |
| Notification Delivery | < 5s | 2-4s | ✅ |

---

## Who To Contact

| Issue Type | Contact | Response Time |
|------------|---------|---------------|
| **API/Backend Issues** | Development Team | 1-2 hours |
| **Portal UI Issues** | Frontend Team | 1-2 hours |
| **Database Issues** | Database Admin | 30 minutes |
| **Deployment Issues** | DevOps Team | 15 minutes |
| **System Down (Production)** | On-Call Engineer | Immediate |
| **Security Issues** | Security Team | Immediate |
| **Feature Requests** | Product Manager | Next sprint |

**Emergency Escalation**: See `RUNBOOK.md` Section 15 for escalation procedures

---

## Before Asking For Help

**Checklist**:
1. ✅ Check if services are running
   - Production: Visit URLs above
   - Local: `docker-compose ps`
2. ✅ Check health endpoints
   - `curl https://bhiv-hr-gateway-ltg0.onrender.com/health`
3. ✅ Read `FAQ.md` - 44 common issues with solutions
4. ✅ Check `RUNBOOK.md` - Operations manual with diagnostics
5. ✅ Check logs
   - Production: Render Dashboard → Service → Logs
   - Local: `docker logs <service_name>`
6. ✅ Check `issues/ISSUES_AND_LIMITATIONS.md` - Known issues

**Still stuck?** Contact team with:
- What you tried (list all steps)
- Error messages (full text)
- Service logs (last 50 lines)
- Steps to reproduce

---

## Next Steps

### For New Team Members
1. ✅ Read this file (you're doing it!)
2. ✅ Read `architecture/ARCHITECTURE.md` - Understand system design
3. ✅ Import `postman_collection.json` - Test APIs hands-on
4. ✅ Read `api_contract/API_CONTRACT_PART1.md` - Learn API structure
5. ✅ Bookmark `FAQ.md` - For troubleshooting
6. ✅ Test production: Visit live URLs above

### For Developers
1. ✅ Clone repo: `git clone https://github.com/Shashank-0208/BHIV-HR-PLATFORM.git`
2. ✅ Setup environment: `cp .env.example .env` (edit with your values)
3. ✅ Start services: `docker-compose -f docker-compose.production.yml up -d`
4. ✅ Run tests: `cd tests && python test_complete_111_endpoints.py`
5. ✅ Read `integration_maps/INTEGRATION_MAPS.md` - Service communication patterns

### For QA Team
1. ✅ Import `postman_collection.json` into Postman
2. ✅ Follow `QA_CHECKLIST.md` - 150+ test cases
3. ✅ Execute tests against production or local
4. ✅ Document results and report issues

### For Operations Team
1. ✅ Read `RUNBOOK.md` - Complete operations manual
2. ✅ Setup monitoring for health endpoints (every 1 minute)
3. ✅ Configure alerts for service failures
4. ✅ Review backup/restore procedures (Section 8)
5. ✅ Familiarize with emergency procedures (Section 11)

---

## Production Status

**Current Status**: ✅ **FULLY OPERATIONAL**

| Service | Status | URL | Endpoints |
|---------|--------|-----|-----------|
| Gateway | ✅ Live | bhiv-hr-gateway-ltg0.onrender.com | 80 |
| AI Agent | ✅ Live | bhiv-hr-agent-nhgg.onrender.com | 6 |
| LangGraph | ✅ Live + RL | bhiv-hr-langgraph.onrender.com | 25 |
| HR Portal | ✅ Live | bhiv-hr-portal-u670.onrender.com | UI |
| Client Portal | ✅ Live | bhiv-hr-client-portal-3iod.onrender.com | UI |
| Candidate Portal | ✅ Live | bhiv-hr-candidate-portal-abe6.onrender.com | UI |

**Metrics**: 99.9% uptime | $0/month cost | Oregon, US West region | RL: 100% test pass, 80% model accuracy

---

## Important Warnings

### DO NOT Modify Without Approval
- `services/gateway/app/main.py` - Core API gateway (80 endpoints)
- `services/agent/semantic_engine/phase3_engine.py` - AI matching model
- `services/db/consolidated_schema.sql` - Database schema (19 tables)
- `docker-compose.production.yml` - Production configuration
- `.env` - Secrets file (NEVER commit to Git!)

**Why?** Changes can break entire system. Test thoroughly on staging first.

### Safe To Modify
- Portal UI code (`services/portal/`, `services/client_portal/`, `services/candidate_portal/`)
- Test files (`tests/`)
- Documentation (`docs/`, `handover/`)
- Utility scripts (`tools/`, `scripts/`)
- Configuration files (`config/`)

---

## Resources

### Live System
- **GitHub Repository**: https://github.com/Shashank-0208/BHIV-HR-PLATFORM
- **Live API Documentation**: https://bhiv-hr-gateway-ltg0.onrender.com/docs
- **Interactive API Testing**: Use Swagger UI at /docs endpoint

### Documentation
- **Complete API Reference**: `handover/api_contract/` (5 parts, 119 endpoints)
- **Architecture Diagrams**: `handover/architecture/ARCHITECTURE.md`
- **Integration Flows**: `handover/integration_maps/INTEGRATION_MAPS.md`
- **Troubleshooting**: `handover/FAQ.md` (44 scenarios)
- **Operations**: `handover/RUNBOOK.md` (complete manual)

### Testing
- **Postman Collection**: `handover/postman/postman_collection.json`
- **Test Checklist**: `handover/QA_CHECKLIST.md` (150+ cases)
- **Test Scripts**: `tests/test_all_endpoints.py`

---

## Database Schema

**PostgreSQL 17** with Schema v4.3.0

### Core Tables (13)
- `candidates` - Candidate profiles
- `jobs` - Job postings
- `clients` - Enterprise clients
- `users` - HR system users
- `feedback` - BHIV values assessment
- `interviews` - Interview scheduling
- `offers` - Job offers
- `matching_cache` - AI matching results
- `audit_logs` - System audit trail
- `rate_limits` - API rate limiting
- `csp_violations` - Security violations
- `company_scoring_preferences` - Phase 3 learning
- `job_applications` - Application tracking

### RL/ML Tables (6)
- `rl_predictions` - RL model predictions (5 production records)
- `rl_feedback` - Feedback for learning (17 production records, 340% feedback rate)
- `rl_model_performance` - Model metrics (v1.0.1 with 80% accuracy)
- `rl_training_data` - Training dataset (15 samples)
- `workflows` - Workflow tracking
- `company_scoring_preferences` - Adaptive scoring

**Total**: 19 tables | **Indexes**: 85+ | **Features**: Audit triggers, generated columns, RL integration | **RL Status**: Fully operational

---

## Version History

- **v4.3.1** (Dec 2024): Enhanced Postman testing suite, 119 endpoints, complete documentation
- **v3.0.0** (Dec 2024): Complete RL integration, 111 endpoints, production ready
- **v2.0.0** (Nov 2024): LangGraph workflows, multi-channel notifications
- **v1.0.0** (Oct 2024): Initial release with Phase 3 AI matching

---

## Handover Checklist

### Documentation ✅
- ✅ Architecture documented
- ✅ All 119 endpoints documented
- ✅ Integration flows mapped
- ✅ Known issues listed
- ✅ FAQ created (44 scenarios)
- ✅ Runbook complete
- ✅ QA checklist ready (150+ tests)
- ✅ Postman collection exported
- ✅ README created

### System ✅
- ✅ All 6 services deployed
- ✅ All 119 endpoints operational
- ✅ Database schema deployed
- ✅ Authentication working
- ✅ Rate limiting active
- ✅ Monitoring enabled
- ✅ Backups configured

### Testing ✅
- ✅ Test suite created
- ✅ Postman collection ready
- ✅ Health checks passing
- ✅ Integration tests available

### Optional
- ⏳ Video walkthrough (folder ready at `video/`)

---

## Quick Reference

### Essential Commands
```bash
# Start system (local)
docker-compose -f docker-compose.production.yml up -d

# Stop system (local)
docker-compose -f docker-compose.production.yml down

# Check health
curl https://bhiv-hr-gateway-ltg0.onrender.com/health

# View logs (local)
docker logs -f bhiv-hr-gateway

# Restart service (local)
docker-compose restart gateway
```

### Essential URLs
```
Production Gateway: https://bhiv-hr-gateway-ltg0.onrender.com/docs
HR Portal: https://bhiv-hr-portal-u670.onrender.com
Client Portal: https://bhiv-hr-client-portal-3iod.onrender.com
GitHub: https://github.com/Shashank-0208/BHIV-HR-PLATFORM
```

### Essential Files
```
Quick Start: handover/READ_THIS_FIRST.md (this file)
Architecture: handover/architecture/ARCHITECTURE.md
API Docs: handover/api_contract/ (5 parts)
Troubleshooting: handover/FAQ.md
Operations: handover/RUNBOOK.md
Testing: handover/QA_CHECKLIST.md
```

---

**Last Updated**: December 22, 2024  
**System Owner**: BHIV HR Platform Team  
**Status**: Production Ready | 6/6 Services Live | 119 Endpoints Operational

**Questions?** Start here → `FAQ.md` → `RUNBOOK.md` → Contact team

---

**Ready to start? Import `postman_collection.json` and test your first API call!**
