# BHIV HR Platform - Backend

**Enterprise AI-Powered Recruiting Platform**

---

## 📊 System Overview

| Metric | Value |
|--------|-------|
| **Platform Version** | v4.3.0 |
| **Last Updated** | January 22, 2026 |
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

## 📁 Complete Project Structure

```
backend/
├── .env.example                    # Example environment variables file
├── .gitignore                     # Git ignore rules
├── README.md                      # This file
├── check_services.bat             # Windows batch script to check service status
├── comprehensive_test_results.json # JSON file with comprehensive test results
├── docker-compose.production.yml  # Production Docker Compose configuration
├── requirements.txt               # Python dependencies
├── run_services.py                # Main script to run all services
├── run_test_simple.py             # Simple test runner script
├── run_with_venv.bat             # Windows batch script to run with virtual environment
├── seed_mongodb.py               # MongoDB seeding script
├── setup_venv.bat                # Windows batch script to set up virtual environment
├── test_mongodb_atlas.py         # MongoDB Atlas connection test script
├── test_mongodb_setup.py         # MongoDB setup test script
├── MONGODB_VERIFICATION_REPORT.md # MongoDB connection verification report
├── __pycache__/                  # Python bytecode cache
├── Ishan's_AI_HR_System-main/    # Ishan's AI HR system components
│   ├── app/
│   │   ├── agents/               # AI agent implementations
│   │   ├── routers/              # API route definitions
│   │   ├── utils/                # Utility functions and helpers
│   │   ├── __init__.py
│   │   ├── main.py               # Main application entry point
│   │   └── models.py             # Data models
│   ├── archive/                  # Archived components
│   ├── dashboard/                # Dashboard components
│   ├── docs/                     # Documentation
│   ├── feedback/                 # Feedback processing components
│   ├── scripts/                  # Utility scripts
│   ├── tests/                    # Test suite
│   ├── .env.example
│   ├── .gitignore
│   ├── CLEANUP_SUMMARY.md        # Cleanup summary documentation
│   ├── DEPLOYMENT_GUIDE.md       # Deployment guide
│   ├── ENHANCEMENT_SUMMARY.md    # Enhancement summary
│   ├── INTEGRATION_GUIDE.md      # Integration guide
│   ├── ISSUES_FIXED_SUMMARY.md   # Issues fixed summary
│   ├── README.md                 # Ishan's system README
│   ├── ROBUSTNESS_REPORT.md      # Robustness report
│   ├── ROBUSTNESS_REPORT_v2.md   # Robustness report v2
│   ├── RUN_COMMANDS.md          # Run commands documentation
│   ├── add_sample_data.py       # Sample data addition script
│   ├── hr_intelligence_brain.py # HR intelligence brain implementation
│   ├── requirements.txt         # Dependencies for Ishan's system
│   ├── requirements_minimal.txt # Minimal dependencies for Ishan's system
│   ├── run_dashboard.bat        # Dashboard run script
│   ├── run_fastapi.py           # FastAPI run script
│   ├── simple_test.py           # Simple test implementation
│   ├── start_enhanced_system.py # Enhanced system startup
│   ├── start_system.py          # System startup script
│   ├── start_system_fixed.py    # Fixed system startup script
│   ├── test_api.py              # API testing script
│   └── test_robustness.py       # Robustness testing script
├── Task/                         # Task documentation files
│   ├── BHIV HR Demo Ready Task 9.md # Task 9 documentation
│   ├── TAsk 8.md                # Task 8 documentation
│   └── Task 7.md                # Task 7 documentation
├── assets/                       # Asset files
│   └── data/
│       └── candidates.csv        # Sample candidate data
├── docs/                         # Comprehensive documentation
│   ├── README.md                 # Documentation overview
│   ├── analysis/                 # Analysis documentation
│   │   ├── CODE_QUALITY_ANALYSIS.md # Code quality analysis
│   │   └── COMPREHENSIVE_CODEBASE_ANALYSIS.md # Comprehensive analysis
│   ├── api/                      # API documentation
│   │   └── API_CONTRACT.md       # API contract documentation
│   ├── architecture/             # Architecture documentation
│   │   ├── ARCHITECTURE.md       # Architecture overview
│   │   ├── SERVICE_DEPENDENCY_GRAPH.md # Service dependency graph
│   │   └── SYSTEM_ARCHITECTURE.md # System architecture
│   ├── database/                 # Database documentation
│   │   ├── DATABASE_DOCUMENTATION.md # Database documentation
│   │   ├── DATABASE_SCHEMA.md    # Database schema
│   │   ├── MONGODB_ATLAS_SETUP.md # MongoDB Atlas setup
│   │   ├── MONGODB_COLLECTIONS.md # MongoDB collections
│   │   └── POSTGRES_MIGRATION_PLAN.md # PostgreSQL migration plan
│   ├── demo/                     # Demo documentation
│   │   └── DEMO_SCOPE.md         # Demo scope definition
│   ├── framework/                # Framework documentation
│   │   └── BOUNDARY_DEFINITION.md # Boundary definition
│   ├── guides/                   # Guides
│   │   ├── AUTHENTICATION_FLOW.md # Authentication flow
│   │   ├── BACKEND_INTEGRATION_GUIDE.md # Backend integration guide
│   │   ├── CLIENT_PORTAL_API_GUIDE.md # Client portal API guide
│   │   ├── CLOUD_DEPLOYMENT_GUIDE.md # Cloud deployment guide
│   │   ├── CREATING_NEW_ENDPOINTS.md # Creating new endpoints
│   │   ├── DEBUGGING_GUIDE.md   # Debugging guide
│   │   ├── DEVELOPER_ONBOARDING.md # Developer onboarding
│   │   ├── ENVIRONMENT_SETUP.md # Environment setup
│   │   ├── FRONTEND_INTEGRATION_GUIDE.md # Frontend integration guide
│   │   ├── GATEWAY_SERVICE_GUIDE.md # Gateway service guide
│   │   ├── SERVICES_GUIDE.md    # Services guide
│   │   ├── SSL_CERTIFICATE_SETUP.md # SSL certificate setup
│   │   └── TROUBLESHOOTING_GUIDE.md # Troubleshooting guide
│   ├── reports/                  # Reports
│   │   ├── BUG_REPORTS.md       # Bug reports
│   │   └── PERFORMANCE_REPORT.md # Performance report
│   ├── security/                 # Security documentation
│   │   ├── API_SECURITY.md       # API security
│   │   ├── AUTHENTICATION_SECURITY.md # Authentication security
│   │   ├── SECURITY_AUDIT.md     # Security audit
│   │   └── SECURITY_IMPLEMENTATION.md # Security implementation
│   ├── system/                   # System documentation
│   │   └── CURRENT_REALITY.md    # Current reality assessment
│   └── testing/                  # Testing documentation
│       ├── COMPREHENSIVE_TESTING_STRATEGY.md # Comprehensive testing strategy
│       ├── ENDPOINT_TESTING.md   # Endpoint testing
│       └── TESTING_APPROACH.md   # Testing approach
├── handover/                     # Handover documentation
│   ├── README.md                 # Handover README
│   ├── api_contract/             # API contract handover
│   │   ├── AGENT_SERVICE_API_CONTRACT.md # Agent service API contract
│   │   ├── GATEWAY_SERVICE_API_CONTRACT.md # Gateway service API contract
│   │   ├── LANGGRAPH_SERVICE_API_CONTRACT.md # LangGraph service API contract
│   │   ├── PORTAL_SERVICE_API_CONTRACT.md # Portal service API contract
│   │   └── SERVICE_INTERACTION_API_CONTRACT.md # Service interaction API contract
│   ├── architecture/             # Architecture handover
│   │   └── ARCHITECTURE_OVERVIEW.md # Architecture overview
│   ├── integration_maps/         # Integration maps
│   │   └── SERVICE_INTEGRATION_MAPS.md # Service integration maps
│   ├── issues/                   # Issues documentation
│   │   └── ISSUES_LOG.md         # Issues log
│   ├── postman/                  # Postman collections
│   │   ├── Agent.postman_collection.json # Agent service Postman collection
│   │   ├── Gateway.postman_collection.json # Gateway service Postman collection
│   │   ├── LangGraph.postman_collection.json # LangGraph service Postman collection
│   │   ├── Portal.postman_collection.json # Portal service Postman collection
│   │   └── bhiv_hr_platform.postman_collection.json # Main Postman collection
│   ├── FAQ.md                    # Frequently asked questions
│   ├── HOW_TO_TEST.md            # Testing guide
│   ├── ISOLATION_CHECKLIST.md    # Isolation checklist
│   ├── KNOWN_GAPS.md             # Known gaps
│   ├── POSTMAN_README.md         # Postman documentation
│   ├── QA_CHECKLIST.md           # QA checklist
│   ├── READ_THIS_FIRST.md        # Initial handover instructions
│   ├── ROLE_MATRIX.md            # Role matrix
│   ├── RUNBOOK.md                # Operations runbook
│   ├── START_HERE.md             # Starting point documentation
│   ├── SYSTEM_BEHAVIOR.md        # System behavior
│   ├── TENANT_ASSUMPTIONS.md     # Tenant assumptions
│   └── generate_totp.py          # TOTP generation utility
├── refer_list/                   # Reference lists
│   ├── AGENT  ENDPOINTS.md       # Agent service endpoints
│   ├── GATEWAY ENDPOINTS.md      # Gateway service endpoints
│   └── LANGGRAPH  ENDPOINTS.md   # LangGraph service endpoints
├── runtime-core/                 # Sovereign Application Runtime framework
│   ├── README.md                 # Runtime-core README
│   ├── Dockerfile                # Docker configuration
│   ├── EXECUTIVE_SUMMARY.md      # Executive summary
│   ├── VALIDATION_REPORT.md      # Validation report
│   ├── docker-compose.yml        # Docker Compose configuration
│   ├── main.py                   # Main runtime entry point
│   ├── requirements.txt          # Runtime dependencies
│   ├── audit_logging/            # Audit logging module
│   │   ├── README.md
│   │   ├── audit_service.py     # Audit service implementation
│   │   ├── integration.py       # Audit integration
│   │   └── middleware.py        # Audit middleware
│   ├── auth/                     # Authentication module
│   │   ├── README.md
│   │   ├── auth_service.py      # Authentication service
│   │   └── router.py            # Authentication router
│   ├── docs/                     # Runtime documentation
│   │   ├── README.md
│   │   ├── IMPLEMENTATION_GUIDE.md # Implementation guide
│   │   └── OVERVIEW.md          # Overview documentation
│   ├── framework/                # Framework components
│   │   ├── README.md
│   │   ├── framework.py         # Core framework
│   │   └── registry.py          # Component registry
│   ├── handover/                 # Runtime handover
│   │   └── README.md
│   ├── integration/              # Integration components
│   │   ├── README.md
│   │   └── integration_service.py # Integration service
│   ├── role_enforcement/         # Role enforcement module
│   │   ├── README.md
│   │   ├── middleware.py        # Role enforcement middleware
│   │   ├── rbac_service.py      # RBAC service
│   │   ├── role_checker.py      # Role checker
│   │   └── validators.py        # Validators
│   ├── sovereign/                # Sovereign components
│   │   └── README.md
│   ├── tenancy/                  # Tenancy management
│   │   ├── README.md
│   │   ├── middleware.py        # Tenancy middleware
│   │   ├── router.py            # Tenancy router
│   │   └── tenant_service.py    # Tenant service
│   ├── test/                     # Runtime tests
│   │   ├── README.md
│   │   ├── test_auth.py         # Authentication tests
│   │   ├── test_audit_logging.py # Audit logging tests
│   │   ├── test_role_enforcement.py # Role enforcement tests
│   │   ├── test_sar_core.py     # SAR core tests
│   │   ├── test_tenancy.py      # Tenancy tests
│   │   └── test_utils.py        # Test utilities
│   ├── test_suite/               # Test suite
│   │   ├── README.md
│   │   ├── sar_test_client.py   # SAR test client
│   │   ├── sar_test_runner.py   # SAR test runner
│   │   └── test_data_generator.py # Test data generator
│   └── workflow/                 # Workflow module
│       ├── README.md
│       ├── state_machine.py     # State machine implementation
│       ├── workflow_engine.py   # Workflow engine
│       ├── workflow_executor.py # Workflow executor
│       └── workflow_registry.py # Workflow registry
├── scripts/                      # Utility scripts
│   └── local-deploy.cmd          # Local deployment script
├── services/                     # Main microservices
│   ├── README.md                 # Services README
│   ├── agent/                    # AI Agent Service
│   │   ├── Dockerfile
│   │   ├── README.md
│   │   ├── app.py               # Main application
│   │   ├── database.py          # Database connection
│   │   ├── requirements.txt     # Dependencies
│   │   └── semantic_engine/     # Semantic engine components
│   ├── candidate_portal/         # Candidate Portal Service
│   │   ├── Dockerfile
│   │   ├── README.md
│   │   ├── app.py               # Main application
│   │   └── requirements.txt     # Dependencies
│   ├── client_portal/            # Client Portal Service
│   │   ├── Dockerfile
│   │   ├── README.md
│   │   ├── app.py               # Main application
│   │   └── requirements.txt     # Dependencies
│   ├── db/                       # Database Service
│   │   ├── Dockerfile
│   │   ├── README.md
│   │   ├── consolidated_schema.sql # Database schema
│   │   ├── docker-compose.yml   # Docker Compose
│   │   └── requirements.txt     # Dependencies
│   ├── gateway/                  # API Gateway Service
│   │   ├── Dockerfile
│   │   ├── README.md
│   │   ├── app/
│   │   │   ├── __init__.py
│   │   │   ├── database.py      # Database connection
│   │   │   ├── db_helpers.py    # Database helpers
│   │   │   ├── main.py          # Main application
│   │   │   └── monitoring.py    # Monitoring utilities
│   │   ├── config.py            # Configuration
│   │   ├── docker-compose.yml   # Docker Compose
│   │   ├── jwt_auth.py          # JWT authentication
│   │   ├── langgraph_integration.py # LangGraph integration
│   │   ├── monitoring.py        # Monitoring utilities
│   │   ├── requirements.txt     # Dependencies
│   │   └── routes/              # Route definitions
│   ├── langgraph/                # LangGraph Service
│   │   ├── Dockerfile
│   │   ├── README.md
│   │   ├── app/
│   │   │   ├── __init__.py
│   │   │   ├── app.py           # Main application
│   │   │   ├── communication/   # Communication components
│   │   │   ├── config.py        # Configuration
│   │   │   ├── database.py      # Database connection
│   │   │   ├── mongodb_tracker.py # MongoDB tracker
│   │   │   ├── rl_database.py   # RL database
│   │   │   ├── rl_integration/  # RL integration components
│   │   │   ├── semantic_matcher.py # Semantic matcher
│   │   │   └── workflows/       # Workflow definitions
│   │   ├── docker-compose.yml   # Docker Compose
│   │   └── requirements.txt     # Dependencies
│   └── portal/                   # Portal Service
│       ├── Dockerfile
│       ├── README.md
│       ├── app.py               # Main application
│       ├── docker-compose.yml   # Docker Compose
│       └── requirements.txt     # Dependencies
├── tests/                        # Comprehensive test suites
│   ├── README.md                 # Tests README
│   ├── agent/                    # Agent service tests
│   ├── api/                      # API tests
│   ├── database/                 # Database tests
│   ├── deployment/               # Deployment tests
│   ├── fixes/                    # Fix verification tests
│   ├── gateway/                  # Gateway service tests
│   ├── integration/              # Integration tests
│   ├── langgraph/                # LangGraph service tests
│   ├── misc/                     # Miscellaneous tests
│   ├── portal/                   # Portal service tests
│   ├── rl_integration/           # RL integration tests
│   ├── security/                 # Security tests
│   ├── validation/               # Validation tests
│   ├── workflows/                # Workflow tests
│   ├── comprehensive_endpoint_tests.py # Comprehensive endpoint tests
│   ├── fix_postman_collection.py # Postman collection fixer
│   └── requirements.txt          # Test dependencies
├── tools/                        # Development tools
│   ├── README.md                 # Tools README
│   ├── analysis/                 # Analysis tools
│   ├── data/                     # Data tools
│   ├── database/                 # Database tools
│   ├── fixes/                    # Fix tools
│   ├── monitoring/               # Monitoring tools
│   ├── portal/                   # Portal tools
│   ├── security/                 # Security tools
│   ├── utilities/                # Utility tools
│   ├── requirements.txt          # Tool dependencies
│   └── setup_advanced_tools.py   # Advanced tools setup
├── validation/                   # Validation scripts
│   └── scripts/
│       ├── final_verification.py # Final verification script
│       └── verify_auth_and_params.py # Auth and parameters verification
└── venv/                         # Virtual environment (if exists)
    └── ...                       # Python virtual environment files
```

## 🏗️ Backend Architecture Overview

The BHIV HR Platform backend follows a microservices architecture with a focus on AI-powered recruitment processes. Here's a comprehensive breakdown of each component:

### Root Level Components

- **`.env.example`**: Template containing all required environment variables with placeholder values for database connections, API keys, and service configurations.
- **`.gitignore`**: Specifies files and Git should ignore, including environment files, cache directories, and local configuration files.
- **`README.md`**: Main documentation file providing setup instructions, architecture overview, and usage guidelines.
- **`check_services.bat`**: Windows batch script that verifies the health status of all running backend services.
- **`comprehensive_test_results.json`**: JSON file containing results from comprehensive integration tests, useful for CI/CD pipelines.
- **`docker-compose.production.yml`**: Production-ready Docker Compose configuration for deploying all services in a containerized environment.
- **`requirements.txt`**: Lists all Python dependencies required for the backend services to run properly.
- **`run_services.py`**: Main orchestration script that starts all backend services with proper configurations and inter-service communication.
- **`run_test_simple.py`**: Lightweight test runner for basic functionality verification.
- **`run_with_venv.bat`**: Windows batch script that activates the virtual environment and starts all services.
- **`seed_mongodb.py`**: Script to populate MongoDB with initial sample data for demonstration and testing purposes.
- **`setup_venv.bat`**: Windows batch script to create and configure a Python virtual environment with all required dependencies.
- **`test_mongodb_atlas.py`**: Test script to verify connectivity and basic operations with MongoDB Atlas.
- **`test_mongodb_setup.py`**: Comprehensive test suite for MongoDB connection and schema validation.
- **`MONGODB_VERIFICATION_REPORT.md`**: Detailed report of MongoDB connection tests and performance metrics.
- **`__pycache__`**: Automatically generated directory containing Python bytecode cache files.

### Ishan's AI HR System Components

Legacy integration components from the AI system developed by Ishan:

- **`Ishan's_AI_HR_System-main/`**: Contains the original AI HR system with agents, routers, and utility functions that may still be referenced for AI logic.
- **`app/agents/`**: AI agent implementations responsible for candidate matching and analysis.
- **`app/routers/`**: API route definitions from the original AI system.
- **`hr_intelligence_brain.py`**: Core AI logic for HR intelligence and decision-making.
- **`start_system.py`**: Original startup script for the AI system.

### Assets Directory

- **`assets/data/candidates.csv`**: Sample candidate data file used for seeding and testing purposes.

### Documentation Directory

Comprehensive documentation system covering all aspects of the platform:

- **`docs/analysis/`**: Code quality and comprehensive analysis reports.
- **`docs/api/`**: API contract documentation with endpoint specifications.
- **`docs/architecture/`**: System architecture diagrams, dependency graphs, and structural documentation.
- **`docs/database/`**: Database schema documentation, MongoDB setup guides, and migration plans.
- **`docs/demo/`**: Demo scope definitions and safe demo flow documentation.
- **`docs/framework/`**: Boundary definitions for HR-specific vs reusable platform logic.
- **`docs/guides/`**: Step-by-step guides for development, deployment, and troubleshooting.
- **`docs/security/`**: Security implementation details, authentication flows, and audit requirements.
- **`docs/system/`**: Current reality assessments and system status documentation.
- **`docs/testing/`**: Comprehensive testing strategies and approach documentation.

### Handover Documentation

Critical operational documentation for system maintenance and transfer:

- **`handover/api_contract/`**: Detailed API contracts for each microservice.
- **`handover/postman/`**: Complete Postman collections for API testing and validation.
- **`handover/RUNBOOK.md`**: Operational runbook with procedures for system maintenance.
- **`handover/START_HERE.md`**: Starting point documentation for new team members.
- **`handover/SYSTEM_BEHAVIOR.md`**: Detailed documentation of system behaviors and expected responses.

### Runtime Core Framework

The Sovereign Application Runtime (SAR) provides reusable framework components:

- **`runtime-core/auth/`**: Authentication services with JWT and API key management.
- **`runtime-core/tenancy/`**: Multi-tenancy management with tenant isolation capabilities.
- **`runtime-core/role_enforcement/`**: Role-based access control and permission management.
- **`runtime-core/audit_logging/`**: Comprehensive audit trail system for compliance and monitoring.
- **`runtime-core/workflow/`**: Workflow automation engine for business process orchestration.
- **`runtime-core/framework/`**: Core framework utilities and common components.

### Services Directory

Core microservices that power the HR platform:

- **`services/gateway/`**: API Gateway service (port 8000) - Main entry point handling authentication, routing, and security.
  - **`app/main.py`**: Main FastAPI application with all route definitions.
  - **`jwt_auth.py`**: JWT authentication implementation with dual secret support.
  - **`routes/`**: Individual route modules for different API domains.
  - **`database.py`**: MongoDB connection and helper functions.

- **`services/agent/`**: AI Agent service (port 9000) - Handles semantic matching and candidate analysis.
  - **`semantic_engine/`**: Advanced semantic matching algorithms and NLP processing.
  - **`app.py`**: AI agent main application with matching endpoints.

- **`services/langgraph/`**: LangGraph service (port 9001) - Workflow automation and reinforcement learning.
  - **`workflows/`**: Business process workflows with multi-channel communication.
  - **`rl_integration/`**: Reinforcement learning components for adaptive behavior.
  - **`communication/`**: Multi-channel notification system (Email, WhatsApp, Telegram).

- **`services/db/`**: Database service configuration and schema definitions.
  - **`consolidated_schema.sql`**: Database schema definitions (though MongoDB is primary).

- **`services/portal/`**: General portal service for UI rendering.

### Test Suite

Comprehensive testing infrastructure covering all services:

- **`tests/api/`**: API endpoint testing with comprehensive coverage.
- **`tests/integration/`**: Service-to-service integration tests.
- **`tests/security/`**: Security vulnerability and authentication tests.
- **`tests/workflows/`**: Business process and workflow validation.
- **`comprehensive_endpoint_tests.py`**: Complete end-to-end test suite for all endpoints.

### Tools Directory

Development and operational tools for various purposes:

- **`tools/analysis/`**: Code analysis and quality assessment tools.
- **`tools/database/`**: Database management and migration tools.
- **`tools/security/`**: Security scanning and vulnerability assessment tools.
- **`tools/utilities/`**: General-purpose utilities for development and maintenance.

### Validation Scripts

Pre-deployment validation scripts to ensure system integrity:

- **`validation/scripts/final_verification.py`**: Final system verification before deployment.
- **`validation/scripts/verify_auth_and_params.py`**: Authentication and parameter validation.

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
