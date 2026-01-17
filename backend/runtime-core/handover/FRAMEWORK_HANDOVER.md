# Framework Handover Package

## Quick Start (5 minutes)
```bash
# Clone repository
git clone https://github.com/Shashank-0208/BHIV-HR-PLATFORM.git

# Navigate to runtime core
cd runtime-core

# Set up environment
cp .env.example .env
# Update environment variables as needed

# Install dependencies
pip install -r requirements.txt

# Start services
python main.py
```

## Architecture Overview

The framework consists of:
- **Core Services**: Authentication, Tenancy, RBAC, Audit, Workflow
- **Integration Layer**: Pluggable adapters for external systems
- **AI/RL Integration Layer**: Intelligent automation and reinforcement learning capabilities
- **Module Layer**: HR (reference implementation), with templates for CRM/ERP
- **Security Layer**: Tenant isolation, audit logging, compliance

## How to Add a New Module (CRM/ERP)
1. Create a new directory in `/modules/`
2. Follow the patterns established in `/modules/hr/`
3. Use the shared services from `/runtime-core/`
4. Ensure all data access includes tenant_id scoping
5. Implement AI/RL integration hooks where intelligent automation is beneficial
6. Use the AI/RL service abstraction layer to maintain loose coupling

## AI/RL Integration Guidelines
1. Use the AI/RL service wrapper to maintain optional integration
2. Implement graceful degradation when AI/RL services are unavailable
3. Log all AI/RL interactions for audit and debugging purposes
4. Follow the same tenant isolation patterns for AI/RL service calls
5. Implement appropriate error handling and timeouts for external AI/RL services

## Configuration Guide
- All configuration should be passed via environment variables
- See `.env.example` for required variables
- Regional configurations are supported for KSA/UAE/India compliance

## Common Issues & Solutions
- **Issue**: Tenant isolation not working
  - **Solution**: Verify all database queries include tenant_id filters
- **Issue**: Adapters not loading
  - **Solution**: Check adapter configuration in environment variables
- **Issue**: AI/RL service integration failing
  - **Solution**: Verify AI_SERVICE_ENDPOINT and RL_SERVICE_API_KEY environment variables, check service connectivity

## Team Contact Points
- **Ishan Shirode**: AI/RL integration
- **Nikhil**: Frontend/UI integration
- **Vinayak**: QA and deployment
- **Ashmit**: Integration architecture

---

**Created:** January 10, 2026  
**Status:** Template created, needs final details