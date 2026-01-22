# BHIV HR Platform - Backend

**Enterprise AI-Powered Recruiting Platform**

---

## 📊 System Overview

| Metric | Value |
|--------|-------|
| **Platform Version** | v4.3.0 |
| **Last Updated** | January 16, 2026 |
| **Services** | 3 Microservices (Gateway, Agent, LangGraph) |
| **Total Endpoints** | 108 |
| **Database** | MongoDB Atlas (fully migrated) |
| **Security Rating** | A+ |
| **Status** | ✅ Production Ready |

---

## 🌐 Service URLs (Localhost)

| Service | URL | Endpoints | Status |
|---------|-----|-----------|--------|
| **Frontend (React)** | http://localhost:3000 | Web UI | ✅ Running |
| **API Gateway** | http://localhost:8000/docs | 77 | ✅ Running |
| **AI Agent** | http://localhost:9000/docs | 6 | ✅ Running |
| **LangGraph** | http://localhost:9001/docs | 25 | ✅ Running |

**Note:** 
- Frontend serves the main web application on port 3000
- Streamlit portals (HR, Client, Candidate) are available via Docker only and are for reference
- Backend API documentation is available at the `/docs` endpoints

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.12+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **MongoDB Atlas Account** - [Sign Up](https://www.mongodb.com/cloud/atlas/register)
- **Git** - [Download](https://git-scm.com/downloads/)
- **Docker Desktop** (Optional - for Docker method)

### 📝 Complete Setup (Backend + Frontend)

**Option 1: Quick Start Script (Windows)**
```bash
# Clone repository
git clone <repository-url>
cd Infiverse-HR

# Run both backend and frontend
run_project.bat
```

**Option 2: Manual Setup**

*Terminal 1 - Backend:*
```bash
cd Infiverse-HR/backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
# Configure .env file (see backend setup below)
python run_services.py
```

*Terminal 2 - Frontend:*
```bash
cd Infiverse-HR/frontend
npm install
# Configure .env file (see frontend setup below)
npm run dev
```

**Access the application:**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/docs

---

## 📦 Setup Methods

### Method 1: Python Virtual Environment (Recommended)

#### Step 1: Clone Repository
```bash
git clone <repository-url>
cd Infiverse-HR/backend
```

#### Step 2: Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Or use the setup script (Windows):**
```bash
setup_venv.bat
```

#### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

#### Step 4: Configure Environment

**Copy environment template:**
```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

**Edit `.env` file with your values:**
```env
# Database (Required)
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/bhiv_hr

# Authentication Secrets (Required)
# Generate with: python -c "import secrets; print(secrets.token_urlsafe(32))"
API_KEY_SECRET=<your-api-key>
JWT_SECRET_KEY=<your-jwt-secret>
CANDIDATE_JWT_SECRET_KEY=<your-candidate-jwt-secret>
GATEWAY_SECRET_KEY=<your-gateway-secret>

# Service URLs (Localhost)
GATEWAY_SERVICE_URL=http://localhost:8000
AGENT_SERVICE_URL=http://localhost:9000
LANGGRAPH_SERVICE_URL=http://localhost:9001
```

**Generate secrets:**
```bash
python -c "import secrets; print('API_KEY_SECRET=' + secrets.token_urlsafe(32))"
python -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_urlsafe(32))"
python -c "import secrets; print('CANDIDATE_JWT_SECRET_KEY=' + secrets.token_urlsafe(32))"
python -c "import secrets; print('GATEWAY_SECRET_KEY=' + secrets.token_urlsafe(32))"
```

#### Step 5: Start Backend Services

**Option A: Using run_services.py script (Recommended)**
```bash
# Start all services
cd Infiverse-HR/backend
python run_services.py
```

**Option B: Using Windows batch script**
```bash
cd Infiverse-HR/backend
run_with_venv.bat
```

**Option C: Manual start (separate terminals)**

*Terminal 1 - Gateway:*
```bash
cd Infiverse-HR/backend/services/gateway
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

*Terminal 2 - Agent:*
```bash
cd Infiverse-HR/backend/services/agent
uvicorn app:app --host 0.0.0.0 --port 9000 --reload
```

*Terminal 3 - LangGraph:*
```bash
cd Infiverse-HR/backend/services/langgraph
uvicorn app.main:app --host 0.0.0.0 --port 9001 --reload
```

#### Step 6: Verify Services
```bash
curl http://localhost:8000/health
curl http://localhost:9000/health
curl http://localhost:9001/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "BHIV HR Gateway",
  "version": "4.2.0",
  "timestamp": "2026-01-16T11:28:38.848959+00:00"
}
```

---

### Method 2: Docker Compose (All Services)

#### Step 1: Clone Repository
```bash
git clone <repository-url>
cd Infiverse-HR/backend
```

#### Step 2: Configure Environment
```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

Edit `.env` with your MongoDB connection and secrets (same as Method 1).

#### Step 3: Start All Services with Docker
```bash
docker-compose -f docker-compose.production.yml up --build
```

**Run in background (detached mode):**
```bash
docker-compose -f docker-compose.production.yml up -d
```

#### Step 4: View Logs
```bash
# View all logs
docker-compose -f docker-compose.production.yml logs -f

# View specific service logs
docker-compose -f docker-compose.production.yml logs -f gateway
docker-compose -f docker-compose.production.yml logs -f agent
docker-compose -f docker-compose.production.yml logs -f langgraph
```

#### Step 5: Verify Services
```bash
curl http://localhost:8000/health
curl http://localhost:9000/health
curl http://localhost:9001/health
```

#### Step 6: Stop Services
```bash
# Stop services
docker-compose -f docker-compose.production.yml down

# Stop and remove volumes
docker-compose -f docker-compose.production.yml down -v
```

---

## 🎨 Frontend Setup (Port 3000)

**Modern React TypeScript frontend with three portal system**

### Prerequisites
- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js

### Frontend Setup Steps

#### Step 1: Navigate to Frontend Directory
```bash
cd Infiverse-HR/frontend
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Configure Environment
```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

**Edit `.env` file:**
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
```

#### Step 4: Start Frontend Development Server
```bash
npm run dev
```

#### Step 5: Access Frontend
Open your browser and navigate to: **http://localhost:3000**

### Frontend Features

| Portal | URL | Features |
|--------|-----|----------|
| **Recruiter Console** | `/recruiter` | Job creation, applicant management, feedback |
| **Candidate Portal** | `/candidate` | Profile management, applications, interviews |
| **Client View** | `/client` | Analytics, shortlist review, approvals |

### Frontend Build Commands

| Command | Purpose |
|---------|----------|
| `npm run dev` | Start development server (Port 3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Type checking |

### Tech Stack
- **React 18** with TypeScript
- **Vite** for fast builds
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls

---

## 🔧 Backend Scripts Reference

| Script | Purpose | Usage |
|--------|---------|-------|
| `run_services.py` | Start all or specific services | `python run_services.py [gateway\|agent\|langgraph]` |
| `setup_venv.bat` | Create venv & install packages (Windows) | `setup_venv.bat` |
| `run_with_venv.bat` | Activate venv & run services (Windows) | `run_with_venv.bat` |
| `seed_mongodb.py` | Seed database with sample data | `python seed_mongodb.py` |
| `test_mongodb_atlas.py` | Test MongoDB connection | `python test_mongodb_atlas.py` |
| `check_services.bat` | Check service health (Windows) | `check_services.bat` |

---

## 📁 Project Structure

```
backend/
├── services/              # Microservices
│   ├── gateway/          # API Gateway (Port 8000)
│   ├── agent/            # AI Agent (Port 9000)
│   ├── langgraph/        # Workflow Engine (Port 9001)
│   ├── portal/           # HR Portal (Docker only)
│   ├── client_portal/    # Client Portal (Docker only)
│   ├── candidate_portal/ # Candidate Portal (Docker only)
│   ├── db/               # Database schemas (PostgreSQL - legacy, not used)
│   └── shared/           # Shared utilities
├── docs/                 # Documentation
│   ├── api/             # API documentation
│   ├── architecture/    # System architecture
│   ├── database/        # Database documentation
│   ├── guides/          # User guides
│   ├── security/        # Security documentation
│   ├── testing/         # Testing guides
│   ├── analysis/        # Analysis and updates
│   └── reports/         # Reports and logs
├── tests/               # Test suite
├── tools/               # Utility scripts
├── config/              # Configuration files
├── assets/              # Static assets
│   └── data/            # Data files
│       └── candidates.csv
├── handover/            # Handover documentation
├── Ishan's_AI_HR_System-main/  # Integration reference (legacy, not active)
├── runtime-core/        # Runtime core (legacy reference, not active)
├── scripts/             # Build scripts
├── validation/          # Validation scripts
├── .env.example         # Environment template
├── README.md            # This file
├── requirements.txt     # Python dependencies
└── run_services.py      # Service launcher
```

---

## 🔧 Services Architecture

### 1. API Gateway (Port 8000)
**Main API entry point with 77 endpoints**

**Key Features:**
- Job management
- Candidate management
- AI matching integration
- Authentication & authorization
- Security features (2FA, CSP, rate limiting)
- Workflow orchestration
- Analytics & reporting

**Technology:** FastAPI 4.2.0

### 2. AI Agent (Port 9000)
**AI/ML matching engine with 6 endpoints**

**Key Features:**
- Semantic candidate matching
- Batch matching
- Candidate analysis
- ML-powered predictions

**Technology:** FastAPI + Sentence Transformers

### 3. LangGraph (Port 9001)
**Workflow automation engine with 25 endpoints**

**Key Features:**
- Workflow orchestration
- Multi-channel notifications (Email, WhatsApp, Telegram)
- RL integration
- Automated sequences

**Technology:** FastAPI + LangGraph + LangChain

---

## 🗄️ Database

**Current:** MongoDB Atlas (Cloud)

**Collections:**
- candidates
- jobs
- applications
- interviews
- feedback
- offers
- clients
- users
- workflow_executions
- notifications
- rl_predictions
- rl_feedback
- matching_cache
- audit_logs

**Legacy Reference:** PostgreSQL schemas in `services/db/` (not in use, for historical reference only)

---

## 🔑 Environment Variables

Required variables in `.env`:

```env
# Database
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>

# Authentication
API_KEY_SECRET=<your-api-key>
JWT_SECRET_KEY=<your-jwt-secret>
CANDIDATE_JWT_SECRET_KEY=<your-candidate-jwt-secret>
GATEWAY_SECRET_KEY=<your-gateway-secret>

# Service URLs
GATEWAY_SERVICE_URL=http://localhost:8000
AGENT_SERVICE_URL=http://localhost:9000
LANGGRAPH_SERVICE_URL=http://localhost:9001

# Optional: AI Services
GEMINI_API_KEY=<your-gemini-key>
OPENAI_API_KEY=<your-openai-key>

# Optional: Communication (LangGraph)
GMAIL_EMAIL=<your-email>
GMAIL_APP_PASSWORD_SECRET_KEY=<your-app-password>
TWILIO_ACCOUNT_SID=<your-twilio-sid>
TWILIO_AUTH_TOKEN_SECRET_KEY=<your-twilio-token>
TWILIO_WHATSAPP_NUMBER=<your-whatsapp-number>
TELEGRAM_BOT_TOKEN_SECRET_KEY=<your-telegram-token>
```

---

## 🧪 Testing

### Run Complete Test Suite
```bash
cd tests
python comprehensive_endpoint_tests.py
```

### Test Individual Services
```bash
# Gateway
curl -H "Authorization: Bearer <API_KEY>" http://localhost:8000/v1/jobs

# Agent
curl -X POST http://localhost:9000/match -H "Content-Type: application/json" -d '{"job_id":"1"}'

# LangGraph
curl http://localhost:9001/workflows
```

### Test Results
Results saved to `tests/test_results.json`

---

## 📚 Documentation

### Quick Links
- [API Documentation](docs/api/API_DOCUMENTATION.md)
- [Project Structure](docs/architecture/PROJECT_STRUCTURE.md)
- [Database Documentation](docs/database/DATABASE_DOCUMENTATION.md)
- [Security Audit](docs/security/SECURITY_AUDIT.md)
- [Testing Guide](docs/testing/COMPREHENSIVE_TESTING_GUIDE.md)
- [Handover Documentation](handover/READ_THIS_FIRST.md)

### API Documentation
- **Gateway:** http://localhost:8000/docs
- **Agent:** http://localhost:9000/docs
- **LangGraph:** http://localhost:9001/docs

---

## 🔒 Security Features

- **Authentication:** JWT tokens, API keys, 2FA
- **Rate Limiting:** Dynamic per-endpoint limits
- **Input Validation:** XSS and SQL injection protection
- **Security Headers:** CSP, HSTS, X-Frame-Options
- **Audit Logging:** Complete activity tracking
- **Encryption:** Password hashing with bcrypt

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8000
kill <PID>
```

### Module Not Found
```bash
pip install -r requirements.txt
```

### MongoDB Connection Error
```bash
# Test connection
python test_mongodb_atlas.py

# Check DATABASE_URL in .env
```

### Service Not Starting
```bash
# Check logs
tail -f logs/bhiv_hr_platform.log

# Verify environment
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print(os.getenv('DATABASE_URL'))"
```

---

## 📦 Deployment

### Local Development
```bash
python run_services.py
```

### Docker (All Services)
```bash
docker-compose -f docker-compose.production.yml up -d --build
```

### Stop Services
```bash
# Local
Ctrl+C

# Docker
docker-compose -f docker-compose.production.yml down
```

---

## 📊 Monitoring

### Health Checks
```bash
curl http://localhost:8000/health
curl http://localhost:9000/health
curl http://localhost:9001/health
```

### Metrics
```bash
curl http://localhost:8000/metrics
curl http://localhost:8000/metrics/dashboard
```

---

## 🔄 Development Workflow

1. **Make Changes**
   ```bash
   # Edit code
   git add .
   git commit -m "Description"
   ```

2. **Test Changes**
   ```bash
   python tests/comprehensive_endpoint_tests.py
   ```

3. **Restart Services**
   ```bash
   # Services auto-reload with --reload flag
   # Or manually restart:
   python run_services.py
   ```

---

## 📝 Notes

- **MongoDB:** Platform is fully migrated to MongoDB; no SQL/PostgreSQL in production
- **Streamlit Portals:** Available in Docker only, for reference. Main frontend runs on port 3000
- **PostgreSQL:** Legacy reference in `services/db/`, not in use (historical only)
- **Ishan's Folder:** Integration reference, completed, not active
- **Runtime Core:** Legacy reference, not active
- **Total Endpoints**: 108 (77 Gateway + 6 Agent + 25 LangGraph)

---

## 🆘 Support

For issues or questions:
1. Check the [Troubleshooting Guide](docs/guides/TROUBLESHOOTING_GUIDE.md)
2. Review the [API Documentation](docs/api/API_DOCUMENTATION.md)
3. To view service logs:
   - **Docker:** Use `docker-compose -f docker-compose.production.yml logs -f <service>`
   - **Manual/Local:** See each service's README or config for log file location and details.

---

**Status:** ✅ Production Ready | **Services:** 3/3 Live | **Endpoints:** 112 | **Database:** MongoDB Atlas

*Built with Integrity, Honesty, Discipline, Hard Work & Gratitude*
