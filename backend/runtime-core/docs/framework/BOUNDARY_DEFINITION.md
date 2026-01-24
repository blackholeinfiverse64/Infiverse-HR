# BHIV HR Platform - Boundary Definition

**Document Status**: DEMO-READY | FACTUAL | NON-NEGOTIABLE  
**Created**: January 23, 2026  
**Purpose**: Explicit boundary separation for HR platform components

---

## 📋 EXECUTIVE BOUNDARY MAP

This document establishes clear boundaries between HR-specific logic, reusable platform logic, and external/pluggable components. All classifications are based on current implementation reality, not future aspirations.

---

## 🎯 HR-SPECIFIC LOGIC (Domain Logic)

### Core HR Business Logic
These components contain pure HR domain knowledge and workflows:

#### 1. Candidate Management
- **Location**: `services/gateway/routes/` (candidate-related endpoints)
- **Logic**: 
  - Candidate profile validation and storage
  - Application status tracking (applied → screened → interviewed → offered → hired/rejected)
  - Experience level categorization (Junior, Mid-level, Senior, Lead)
  - Technical skills parsing and normalization
- **HR Domain Concepts**: Recruitment workflows, candidate lifecycle, hiring stages

#### 2. Job Posting & Requirements
- **Location**: `services/gateway/routes/jobs.py`
- **Logic**:
  - Job description parsing and requirement extraction
  - Department categorization (Engineering, Sales, Marketing, HR, Finance)
  - Experience level matching requirements
  - Employment type classification (Full-time, Part-time, Contract, Intern)
- **HR Domain Concepts**: Job requisition, role requirements, organizational structure

#### 3. Values-Based Assessment System
- **Location**: `services/db/consolidated_schema.sql` (feedback table)
- **Logic**:
  - Integrity scoring (1-5 scale)
  - Honesty assessment (1-5 scale)
  - Discipline evaluation (1-5 scale)
  - Hard work measurement (1-5 scale)
  - Gratitude assessment (1-5 scale)
- **HR Domain Concepts**: Cultural fit assessment, behavioral evaluation, values alignment

#### 4. Interview Scheduling
- **Location**: `services/db/consolidated_schema.sql` (interviews table)
- **Logic**:
  - Interview type classification (Technical, HR, Behavioral, Final, Panel)
  - Scheduling workflow management
  - Interviewer assignment logic
- **HR Domain Concepts**: Interview process, candidate evaluation stages

#### 5. Offer Management
- **Location**: `services/db/consolidated_schema.sql` (offers table)
- **Logic**:
  - Salary negotiation workflows
  - Terms and conditions management
  - Offer acceptance/rejection tracking
- **HR Domain Concepts**: Compensation management, employment agreements

---

## ♻️ REUSABLE PLATFORM LOGIC (Generic Infrastructure)

### Authentication & Security Framework
- **Location**: `runtime-core/auth/`
- **Reusable Components**:
  - JWT token management with dual secret support (client and candidate)
  - API key authentication for service-to-service communication
  - Two-factor authentication (TOTP) implementation
  - Password strength validation and policy enforcement
  - Session management with secure token storage
- **Generic Logic**: Authentication patterns, security protocols, credential management

### Multi-Tenant Framework
- **Location**: `runtime-core/tenancy/`
- **Reusable Components**:
  - Tenant resolution from JWT tokens and headers
  - Tenant context injection middleware
  - Cross-tenant access validation
  - SQL query filtering for tenant isolation
- **Generic Logic**: Multi-tenancy patterns, context propagation, isolation mechanisms

### Role-Based Access Control
- **Location**: `runtime-core/role_enforcement/`
- **Reusable Components**:
  - Role definition and assignment system
  - Permission-based access control
  - Resource-action-scope authorization model
  - Dynamic role checking middleware
- **Generic Logic**: Authorization patterns, permission management, access control

### Audit Logging System
- **Location**: `runtime-core/audit_logging/`
- **Reusable Components**:
  - Comprehensive event tracking framework
  - Provenance tracking with old/new value comparison
  - Configurable storage backends (file/memory)
  - Real-time monitoring middleware
- **Generic Logic**: Audit patterns, event sourcing, compliance tracking

### Workflow Engine
- **Location**: `runtime-core/workflow/`
- **Reusable Components**:
  - Generic workflow definition and execution engine
  - Task dependency management
  - State persistence with pause/resume capabilities
  - Concurrent workflow processing
- **Generic Logic**: Workflow patterns, state machines, process orchestration

### API Gateway Patterns
- **Location**: `services/gateway/`
- **Reusable Components**:
  - Centralized routing and request handling
  - Rate limiting implementation
  - CORS configuration management
  - Health check patterns
- **Generic Logic**: API gateway patterns, traffic management, observability

---

## 🔌 EXTERNAL/PLUGGABLE COMPONENTS

### Communication Adapters
These are designed as pluggable interfaces:

#### 1. Email Service
- **Current Implementation**: Gmail SMTP integration
- **Pluggable Interface**: `services/langgraph/app/communication/email_adapter.py`
- **Configuration**: Environment variables for SMTP settings
- **Extensibility**: Can be replaced with other email providers

#### 2. SMS/WhatsApp Service
- **Current Implementation**: Twilio integration
- **Pluggable Interface**: `services/langgraph/app/communication/twilio_adapter.py`
- **Configuration**: Twilio account credentials via environment variables
- **Extensibility**: Can integrate with other SMS providers

#### 3. Telegram Service
- **Current Implementation**: Telegram Bot API
- **Pluggable Interface**: `services/langgraph/app/communication/telegram_adapter.py`
- **Configuration**: Bot token via environment variables
- **Extensibility**: Can integrate with other messaging platforms

#### 4. AI/ML Services
- **Current Implementation**: Google Gemini API
- **Pluggable Interface**: `services/agent/semantic_engine/`
- **Configuration**: API keys via environment variables
- **Extensibility**: Can integrate with OpenAI, Azure AI, or custom models

### Database Adapters
- **Current Implementation**: MongoDB-only (MongoDB Atlas)
- **Pluggable Interface**: Database connection modules in each service
- **Configuration**: Database URLs via environment variables
- **Extensibility**: Can support other databases through adapter pattern

### External API Integrations
- **Payment Processing**: Currently mocked/not implemented
- **Background Verification**: Currently mocked/not implemented
- **Payroll Systems**: Currently mocked/not implemented (Artha adapter placeholder exists)

---

## ⚠️ BOUNDARY CROSSING WARNINGS

### Components That Blur Boundaries

#### 1. Matching Engine (`services/agent/`)
- **Classification**: Primarily reusable platform logic BUT contains HR-specific weighting algorithms
- **Concern**: Business logic about what constitutes a "good match" embedded in supposedly generic matching logic

#### 2. Feedback Processing (`services/gateway/routes/rl_routes.py`)
- **Classification**: Mix of HR-specific assessment logic and reusable RL framework
- **Concern**: Values scoring system (integrity, honesty, etc.) is HR-specific but implemented in generic RL routes

#### 3. Communication Workflows (`services/langgraph/app/workflows/`)
- **Classification**: Generic workflow engine containing HR-specific communication templates
- **Concern**: Email/SMS templates contain HR business language that should be configurable

---

## 📊 BOUNDARY MAINTENANCE CHECKLIST

### For New Development:
- [ ] HR business logic goes in gateway service routes
- [ ] Generic infrastructure goes in runtime-core
- [ ] External integrations use adapter pattern
- [ ] Configuration via environment variables only
- [ ] No hardcoded business rules in platform logic

### For Refactoring:
- [ ] Extract HR-specific weights from matching engine
- [ ] Move communication templates to configurable storage
- [ ] Separate values assessment logic from RL framework
- [ ] Ensure tenant context flows through all layers

---

## 🎯 DECISION FRAMEWORK

When adding new functionality, ask:

1. **Is this pure HR domain knowledge?** → Put in gateway service
2. **Is this generic infrastructure pattern?** → Put in runtime-core
3. **Is this external system integration?** → Create pluggable adapter
4. **Does it blur boundaries?** → Refactor to maintain clear separation

---

*This boundary definition represents current implementation reality and must be maintained for demo stability and future extensibility.*