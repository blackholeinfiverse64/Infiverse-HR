# ⚡ BHIV HR Platform - Quick Start Guide

**Get Started in 5 Minutes**  
**Updated**: January 22, 2026  
**Platform**: Production Ready - Local Development  
**Version**: v4.3.0  
**Status**: ✅ 3/3 Services Operational | 108 Endpoints Live | MongoDB Atlas

---

## 🚀 Choose Your Path


### **💻 Option 1: Python Virtual Environment (Recommended)**
**Full control - Run services directly**

### **🐳 Option 2: Docker Compose**
**Containerized - All services in Docker**

---

## 🌐 Live Production Platform (0 Minutes Setup)

### **🎯 Instant Access**
All services are live and operational - no installation needed!


#### **Localhost Service URLs (108 Total Endpoints)**
```bash
# API Gateway (77 endpoints - FastAPI 4.2.0)
http://localhost:8000/docs

# AI Agent Service (6 endpoints - Semantic Matching + ML)
http://localhost:9000/docs

# LangGraph Workflow Service (25 endpoints - Automation + Notifications)
http://localhost:9001/docs

# Note: Streamlit portals (HR, Client, Candidate) available via Docker only
```

#### **Service Status Overview**
| Service | Endpoints | Type | Status | Response Time |
|---------|-----------|------|--------|---------------|
| **Gateway** | 77 | FastAPI | ✅ Live | <85ms |
| **AI Agent** | 6 | FastAPI | ✅ Live | <15ms |
| **LangGraph** | 25 | FastAPI | ✅ Live | <120ms |
| **TOTAL** | **108** | **FastAPI** | **✅ 100%** | **Excellent** |

#### **🔑 Authentication**
```bash
# API Testing Key (from .env)
API_KEY_SECRET=<YOUR_API_KEY>

# Generate secrets:
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

#### **⚡ 30-Second Test**
```bash
# 1. Test API Health
curl http://localhost:8000/health

# 2. Get Candidates
curl -H "Authorization: Bearer <YOUR_API_KEY>" \
     http://localhost:8000/v1/candidates

# 3. AI Matching Test
curl -H "Authorization: Bearer <YOUR_API_KEY>" \
     http://localhost:8000/v1/match/1/top

# 4. Test Agent Service
curl http://localhost:9000/health

# 5. Test LangGraph Service
curl http://localhost:9001/health
```

---

## 💻 Local Development Setup (5 Minutes)

### **📋 Prerequisites**
```bash
# Required Software
✅ Python 3.12+
✅ MongoDB Atlas account
✅ Git
✅ Docker Desktop (optional)
```

### **🚀 Method 1: Python Virtual Environment (Recommended)**
```bash
# Step 1: Clone Repository
git clone <repository-url>
cd Infiverse-HR/backend

# Step 2: Create Virtual Environment
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate

# Step 3: Install Dependencies
pip install -r requirements.txt

# Step 4: Configure Environment
copy .env.example .env  # Windows
cp .env.example .env    # Linux/Mac
# Edit .env with MongoDB connection and secrets

# Step 5: Start Services
python run_services.py

# Step 6: Verify
curl http://localhost:8000/health
curl http://localhost:9000/health
curl http://localhost:9001/health
```

### **🐳 Method 2: Docker Compose**
```bash
# Step 1: Clone Repository
git clone <repository-url>
cd Infiverse-HR/backend

# Step 2: Configure Environment
copy .env.example .env  # Windows
cp .env.example .env    # Linux/Mac
# Edit .env with MongoDB connection and secrets

# Step 3: Start All Services
docker-compose -f docker-compose.production.yml up -d --build

# Step 4: View Logs
docker-compose -f docker-compose.production.yml logs -f

# Step 5: Verify
curl http://localhost:8000/health
curl http://localhost:9000/health
curl http://localhost:9001/health

# Step 6: Stop Services
docker-compose -f docker-compose.production.yml down
```

### **🔧 Local Service Configuration**
```bash
# API Services
Gateway API:      http://localhost:8000    # 77 endpoints
AI Agent API:     http://localhost:9000    # 6 endpoints
LangGraph API:    http://localhost:9001    # 25 endpoints

# Database
MongoDB Atlas:    Cloud-hosted              # MongoDB Atlas

# Total Endpoints: 111 (80+6+25)
```

---

## 🎯 First Steps Guide

### **1. Explore the HR Portal (2 minutes)**
```bash

# Visit HR Portal
http://localhost:8501

# Try These Features:
✅ Dashboard Overview - See real-time metrics
✅ View 10+ Real Candidates - Browse candidate database
✅ Check 6+ Active Jobs - Review job postings
✅ AI Shortlisting - Test Phase 3 AI matching
✅ LangGraph Workflows - Test automated processing
✅ Export Reports - Download assessment data
```

### **2. Test Client Portal (1 minute)**
```bash

# Visit Client Portal
http://localhost:8502

# Login Credentials:
Username: TECH001
Password: demo123

# Explore:
✅ Client Dashboard - Job posting analytics
✅ Create New Job - Post a job opening
✅ View Candidates - See AI-matched candidates
✅ Schedule Interviews - Manage interview process
```

### **3. Try Candidate Portal (1 minute)**
```bash

# Visit Candidate Portal
http://localhost:8503

# Features:
✅ Register Account - Create candidate profile
✅ Browse Jobs - View available positions
✅ Apply for Jobs - Submit applications
✅ Track Applications - Monitor application status
```

### **4. API Testing (1 minute)**
```bash

# Test Gateway API (80 endpoints)
curl -H "Authorization: Bearer <YOUR_API_KEY>" \
     http://localhost:8000/v1/jobs

# Test AI Agent (6 endpoints with RL integration)
curl -X POST -H "Content-Type: application/json" \
     -d '{"job_id": 1}' \
     http://localhost:9000/match

# Test LangGraph Workflows (25 endpoints)
curl -X POST -H "Content-Type: application/json" \
     -d '{"candidate_id": 1, "job_id": 1}' \
     http://localhost:9001/workflows/application/start

# Test Portal Endpoints (22 total)
curl http://localhost:8501/health  # HR Portal
curl http://localhost:8502/health  # Client Portal
curl http://localhost:8503/health  # Candidate Portal
```

---

## 🔥 Key Features to Try

## 🔥 Key Features to Try

### **🤖 AI-Powered Matching**
```bash
# 1. Get AI Matches for Job
curl -H "Authorization: Bearer <YOUR_API_KEY>" \
     http://localhost:8000/v1/match/1/top

# 2. Batch Processing
curl -X POST -H "Authorization: Bearer <YOUR_API_KEY>" \
     -H "Content-Type: application/json" \
     -d '{"job_ids": ["1", "2"]}' \
     http://localhost:8000/v1/match/batch

# 3. Candidate Analysis
curl http://localhost:9000/analyze/1

# 4. LangGraph Workflow
curl -X POST -H "Content-Type: application/json" \
     -d '{"candidate_id": 1, "job_id": 1}' \
     http://localhost:9001/workflows/application/start
```

### **📊 Values Assessment**
```bash
# Submit BHIV Values Assessment
curl -X POST -H "Authorization: Bearer <YOUR_API_KEY>" \
     -H "Content-Type: application/json" \
     -d '{
       "candidate_id": "1",
       "job_id": "1",
       "integrity": 5,
       "honesty": 4,
       "discipline": 4,
       "hard_work": 5,
       "gratitude": 4
     }' \
     http://localhost:8000/v1/feedback
```

### **🔒 Security Features**
```bash
# Test 2FA Setup
curl -X POST -H "Authorization: Bearer <YOUR_API_KEY>" \
     -H "Content-Type: application/json" \
     -d '{"user_id": 1}' \
     http://localhost:8000/v1/auth/2fa/setup

# Test Input Validation
curl -X POST -H "Authorization: Bearer <YOUR_API_KEY>" \
     -H "Content-Type: application/json" \
     -d '{"input_data": "test"}' \
     http://localhost:8000/v1/security/test-input-validation
```

---

## 📊 Real Data Available

### **MongoDB Atlas Database**
```bash
# Current Collections:
✅ candidates - Candidate profiles
✅ jobs - Job postings
✅ applications - Job applications
✅ interviews - Interview scheduling
✅ feedback - Values assessments
✅ offers - Job offers
✅ clients - Client companies
✅ users - HR users
✅ workflow_executions - LangGraph workflows
✅ notifications - Notification log
✅ rl_predictions - ML predictions
✅ rl_feedback - ML feedback
✅ matching_cache - Matching results
✅ audit_logs - System audit trail
```

### **Data Verification**
```bash
# Check Database Status
curl -H "Authorization: Bearer <YOUR_API_KEY>" \
     http://localhost:8000/v1/database/schema

# Get Candidate Statistics
curl -H "Authorization: Bearer <YOUR_API_KEY>" \
     http://localhost:8000/v1/candidates/stats

# Check Service Health
curl http://localhost:8000/health
curl http://localhost:9000/health
curl http://localhost:9001/health
```

---

## 🛠️ Development Workflow

### **Local Development Commands**
```bash
# Start Services (Python)
python run_services.py

# Start Services (Docker)
docker-compose -f docker-compose.production.yml up -d

# View Logs
tail -f logs/bhiv_hr_platform.log

# Stop Services
Ctrl+C  # Python
docker-compose -f docker-compose.production.yml down  # Docker
```

### **Testing Commands**
```bash
# Run Complete Test Suite (112 endpoints)
python tests/comprehensive_endpoint_tests.py

# Test Individual Services
curl http://localhost:8000/health
curl http://localhost:9000/health
curl http://localhost:9001/health
```

---

## 🔧 Configuration

### **Environment Variables**
```env
# Database
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/bhiv_hr

# Authentication
API_KEY_SECRET=<your-api-key>
JWT_SECRET_KEY=<your-jwt-secret>
CANDIDATE_JWT_SECRET_KEY=<your-candidate-jwt-secret>
GATEWAY_SECRET_KEY=<your-gateway-secret>

# Service URLs
GATEWAY_SERVICE_URL=http://localhost:8000
AGENT_SERVICE_URL=http://localhost:9000
LANGGRAPH_SERVICE_URL=http://localhost:9001
```

### **Service Configuration**
```bash
# Gateway Service (Port 8000) - 80 Endpoints
- FastAPI 4.2.0
- JWT authentication
- Rate limiting
- MongoDB integration

# AI Agent Service (Port 9000) - 6 Endpoints
- FastAPI + Sentence Transformers
- Semantic matching
- ML predictions

# LangGraph Service (Port 9001) - 26 Endpoints
- FastAPI + LangGraph
- Workflow automation
- Multi-channel notifications
```

---

## 🚨 Troubleshooting

### **Common Issues & Solutions**

#### **Services Not Starting**
```bash
# Check Docker
docker --version
docker-compose --version

# Check Ports
netstat -tulpn | grep :8000
netstat -tulpn | grep :8501

# Restart Docker
sudo systemctl restart docker  # Linux
# Restart Docker Desktop      # Windows/Mac
```

#### **Database Connection Issues**
```bash
# Check Database Container
docker-compose -f docker-compose.production.yml ps

# Check Database Logs
docker-compose -f docker-compose.production.yml logs db

# Reset Database
docker-compose -f docker-compose.production.yml down -v
docker-compose -f docker-compose.production.yml up -d
```

#### **API Authentication Issues**
```bash
# Verify API Key
curl -H "Authorization: Bearer <YOUR_API_KEY>" \
     http://localhost:8000/health

# Check Environment Variables
echo $API_KEY_SECRET

# Test Without Authentication (health endpoints)
curl http://localhost:8000/health
```

#### **Common API Endpoint Issues**

**Problem**: `422 Unprocessable Entity` on `/v1/candidates/stats`
**Solution**: Use Bearer token authentication
```bash
# Correct
curl -H "Authorization: Bearer <YOUR_API_KEY>" \
     http://localhost:8000/v1/candidates/stats

# Incorrect
curl -H "X-API-Key: <YOUR_API_KEY>" \
     http://localhost:8000/v1/candidates/stats
```

**Problem**: `422 Unprocessable Entity` on `POST /v1/jobs`
**Solution**: Include all required fields
```bash
curl -X POST -H "Authorization: Bearer <YOUR_API_KEY>" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Software Engineer",
       "department": "Engineering",
       "location": "Remote",
       "experience_level": "mid",
       "requirements": "Python, FastAPI",
       "description": "Join our team"
     }' \
     http://localhost:8000/v1/jobs
```

**Problem**: `404 Not Found` on LangGraph `/statistics`
**Solution**: Use correct endpoint path
```bash
# Correct
curl -H "Authorization: Bearer <YOUR_API_KEY>" \
     http://localhost:9001/workflows/stats

# Incorrect
curl -H "Authorization: Bearer <YOUR_API_KEY>" \
     http://localhost:9001/statistics
```

**Problem**: `405 Method Not Allowed` on `POST /workflows`
**Solution**: Use correct workflow creation endpoint
```bash
# Correct
curl -X POST -H "Authorization: Bearer <YOUR_API_KEY>" \
     -H "Content-Type: application/json" \
     -d '{"candidate_id":1,"job_id":1,"application_id":1,"candidate_email":"test@example.com","candidate_phone":"123-456-7890","candidate_name":"Test User","job_title":"Software Engineer"}' \
     http://localhost:9001/workflows/application/start

# Incorrect
curl -X POST -H "Authorization: Bearer <YOUR_API_KEY>" \
     http://localhost:9001/workflows
```

#### **Portal Access Issues**
```bash
# Check Service Status
curl http://localhost:8501/  # Should return HTML
curl http://localhost:8502/  # Should return HTML
curl http://localhost:8503/  # Should return HTML

# Check Streamlit Logs
docker-compose -f docker-compose.production.yml logs portal
docker-compose -f docker-compose.production.yml logs client_portal
docker-compose -f docker-compose.production.yml logs candidate_portal
```

### **Performance Issues**
```bash
# Check System Resources
docker stats

# Check All Service Health (111 Endpoints)
curl http://localhost:8000/health/detailed  # Gateway (80 endpoints)
curl http://localhost:9000/health           # AI Agent (6 endpoints)
curl http://localhost:9001/health           # LangGraph (25 endpoints)
curl http://localhost:8501/health           # HR Portal (8 endpoints)
curl http://localhost:8502/health           # Client Portal (7 endpoints)
curl http://localhost:8503/health           # Candidate Portal (7 endpoints)

# Monitor Performance & Analytics
curl http://localhost:8000/metrics          # Prometheus metrics
curl http://localhost:8000/v1/monitoring/performance
curl http://localhost:9001/workflows/stats  # Workflow analytics
```

---

## 📚 Next Steps

### **After Quick Start**
1. **Explore Documentation**: Read [CURRENT_FEATURES.md](CURRENT_FEATURES.md) for complete feature list
2. **API Integration**: Check [API_DOCUMENTATION.md](../api/API_DOCUMENTATION.md) for all 112 endpoints
3. **Security Setup**: Review [SECURITY_AUDIT.md](security/SECURITY_AUDIT.md) for security features
4. **Production Deploy**: Follow [RENDER_DEPLOYMENT_GUIDE.md](deployment/RENDER_DEPLOYMENT_GUIDE.md)

### **Advanced Usage**
```bash
# Data Processing Tools
python tools/dynamic_job_creator.py --count 10
python tools/comprehensive_resume_extractor.py
python tools/database_sync_manager.py

# Custom Configuration
# Edit config/production.env
# Modify docker-compose.production.yml

# Monitoring Setup
# Access Prometheus metrics at /metrics
# Set up custom dashboards
```

### **Integration Examples**
```python
# Python Integration
import requests

BASE_URL = "https://bhiv-hr-gateway-ltg0.onrender.com"
API_KEY = "<YOUR_API_KEY>"
headers = {"Authorization": f"Bearer {API_KEY}"}

# Get candidates
candidates = requests.get(f"{BASE_URL}/v1/candidates", headers=headers).json()

# AI matching
matches = requests.get(f"{BASE_URL}/v1/match/1/top", headers=headers).json()
```

---

## 🎯 Success Checklist

### **✅ Quick Start Complete When:**
- [ ] Can access all 5 portal URLs
- [ ] API health checks return "healthy"
- [ ] Can login to client portal (TECH001/demo123)
- [ ] Can view 10+ candidates in HR portal
- [ ] AI matching returns candidate scores
- [ ] Can create new job posting
- [ ] Can register new candidate
- [ ] Database shows 13 core tables
- [ ] All 111 endpoints respond correctly (80 Gateway + 6 Agent + 25 LangGraph)
- [ ] Export functionality works

### **🚀 Ready for Production When:**
- [ ] All services running smoothly
- [ ] Performance metrics acceptable (<100ms API)
- [ ] Security features tested (2FA, validation)
- [ ] Data integrity verified
- [ ] Monitoring setup complete
- [ ] Backup strategy in place

---

## 📞 Support & Resources

### **Documentation Links**
- **Complete Features**: [CURRENT_FEATURES.md](CURRENT_FEATURES.md)
- **API Reference**: [API_DOCUMENTATION.md](api/API_DOCUMENTATION.md)
- **Architecture**: [SERVICES_GUIDE.md](SERVICES_GUIDE.md) | [PROJECT_STRUCTURE.md](../architecture/PROJECT_STRUCTURE.md)
- **Deployment**: [DEPLOYMENT_STATUS.md](architecture/DEPLOYMENT_STATUS.md)


### **Localhost Platform URLs**
- **Gateway API**: http://localhost:8000/docs
- **Agent API**: http://localhost:9000/docs
- **HR Portal**: http://localhost:8501/
- **Client Portal**: http://localhost:8502/
- **Candidate Portal**: http://localhost:8503/

### **Demo Credentials**
```bash
# Client Portal
Username: TECH001
Password: demo123

# API Testing
API Key: <YOUR_API_KEY>
```

---

**BHIV HR Platform Quick Start Guide** - Get started in 5 minutes with live production platform or local development setup.

*Built with Integrity, Honesty, Discipline, Hard Work & Gratitude*

**Last Updated**: January 16, 2026 | **Setup Time**: 5 minutes | **Services**: 3/3 Live | **Endpoints**: 112 Total | **Status**: ✅ Production Ready | **Database**: MongoDB Atlas
