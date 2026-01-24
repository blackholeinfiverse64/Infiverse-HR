# Complete Framework Handover Package

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Quick Start Guide](#quick-start-guide)
3. [Architecture Overview](#architecture-overview)
4. [Module Development Guide](#module-development-guide)
5. [AI/RL Integration Guidelines](#airl-integration-guidelines)
6. [Configuration Guide](#configuration-guide)
7. [Security & Compliance](#security--compliance)
8. [Deployment Guide](#deployment-guide)
9. [Troubleshooting](#troubleshooting)
10. [Team Contacts](#team-contacts)
11. [Support & Maintenance](#support--maintenance)

## Executive Summary

The BHIV Application Framework is a production-ready, multi-tenant application platform evolved from the Sovereign Application Runtime (SAR). It provides essential infrastructure services for building secure, scalable SaaS applications with complete tenant isolation, robust security measures, and integrated AI/RL capabilities.

### Key Features
- **Authentication Service**: JWT/API key auth with 2FA and password management
- **Tenancy Service**: Robust tenant isolation with cross-tenant access prevention
- **Role Enforcement**: Comprehensive RBAC with 5 predefined roles
- **Audit Logging**: Complete audit trails with provenance tracking
- **Workflow Engine**: Business process automation with instance management
- **AI/RL Integration**: Intelligent automation and reinforcement learning hooks
- **Integration Adapters**: Pluggable adapters for external systems

### Business Value
- **Reusable Infrastructure**: <10% glue code needed for new product integration
- **Consistent Experience**: Uniform auth, authorization, and audit across products
- **Compliance Ready**: Built-in audit trails and tenant isolation
- **Scalable Foundation**: Ready for multi-product deployment strategy

## Quick Start Guide

### Prerequisites
- Python 3.12+
- pip package manager
- Docker (optional, for containerized deployment)

### Installation
```bash
# Clone the repository
git clone https://github.com/Shashank-0208/BHIV-HR-PLATFORM.git

cd BHIV-HR-PLATFORM/backend/runtime-core

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Configuration
```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with your specific values
# Generate secure secrets with: openssl rand -hex 32
```

### Running the Framework
```bash
# Start the application
python main.py

# Or with uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### API Access
- **Swagger UI**: http://localhost:8000/docs
- **API Root**: http://localhost:8000/
- **Health Check**: http://localhost:8000/health
- **Default API Key**: `default_sar_api_key`

## Architecture Overview

### Core Services

The framework consists of 5 core microservices:

#### 1. Authentication Service
- Handles user authentication and session management
- Supports JWT tokens and API key authentication
- Implements 2FA with TOTP and QR code generation
- Manages password policies and validation

#### 2. Tenancy Service
- Provides tenant identification and isolation
- Ensures cross-tenant data access prevention
- Injects tenant context automatically in requests
- Validates tenant access permissions

#### 3. Role Enforcement Service
- Implements comprehensive RBAC system
- Manages 5 predefined roles with granular permissions
- Enforces permissions at middleware level
- Provides real-time permission checking

#### 4. Audit Logging Service
- Captures comprehensive audit trails
- Maintains provenance tracking for data modifications
- Provides search and analysis capabilities
- Supports configurable storage backends

#### 5. Workflow Engine
- Automates business processes with dependency management
- Manages workflow definitions and instances
- Provides lifecycle controls (start, pause, resume, cancel)
- Supports tenant-isolated workflow execution

### Integration Layer

#### Adapter System
The framework includes a pluggable adapter layer for external system integrations:

- **Artha Adapter**: Payroll and finance system integration
- **Karya Adapter**: Task and workflow management
- **InsightFlow Adapter**: Analytics and metrics collection
- **Bucket Adapter**: Storage and artifact management

All adapters follow the same interface and are designed to be optional and fail-safe.

### AI/RL Integration Layer

The framework includes hooks for AI/RL integration:
- Clean abstraction layer for AI services
- Reinforcement learning feedback loops
- Graceful degradation when AI/RL services unavailable
- Tenant isolation maintained for AI/RL service calls

## Module Development Guide

### Adding a New Module (CRM/ERP/etc.)

1. **Create Module Directory**
   ```bash
   mkdir modules/new_module
   cd modules/new_module
   ```

2. **Follow HR Reference Pattern**
   - Examine `/modules/hr/` for implementation patterns
   - Use the same authentication and tenancy services
   - Leverage the shared services from `/runtime-core/`

3. **Ensure Tenant Isolation**
   - Include tenant_id scoping in all data access
   - Use tenant resolution service for context
   - Validate tenant access before operations

4. **Implement AI/RL Integration**
   - Use the AI/RL service abstraction layer
   - Implement intelligent automation where beneficial
   - Maintain loose coupling with AI/RL services

5. **API Endpoint Patterns**
   - Follow RESTful API design principles
   - Use consistent authentication patterns
   - Implement proper error handling
   - Document endpoints with proper schemas

### Best Practices
- Use dependency injection for service access
- Implement proper logging and monitoring
- Follow security best practices
- Maintain backward compatibility
- Write comprehensive tests

## AI/RL Integration Guidelines

### Integration Architecture

The AI/RL integration follows a service wrapper pattern to maintain loose coupling:

```python
# Use the AI/RL service wrapper
class AIServiceWrapper:
    def __init__(self):
        self.ai_available = True  # Check service availability
    
    def get_recommendation(self, data):
        if not self.ai_available:
            return self.fallback_logic(data)
        # Call AI service
        return ai_client.process(data)
```

### Implementation Guidelines

1. **Optional Integration**
   - Use the AI/RL service wrapper to maintain optional integration
   - Implement graceful degradation when services unavailable
   - Provide fallback logic for all AI-dependent features

2. **Tenant Isolation**
   - Apply the same tenant isolation patterns for AI/RL service calls
   - Ensure AI service calls include proper tenant context
   - Maintain data privacy in AI service communications

3. **Error Handling**
   - Implement appropriate error handling for external services
   - Set reasonable timeouts for AI/RL service calls
   - Log all AI/RL interactions for audit and debugging

4. **Performance Considerations**
   - Cache AI results when appropriate
   - Implement async processing for time-consuming operations
   - Monitor AI service response times

### Configuration

AI/RL services are configured via environment variables:
- `AI_SERVICE_ENDPOINT`: URL for AI service
- `RL_SERVICE_API_KEY`: API key for reinforcement learning service
- `AI_TIMEOUT_SECONDS`: Timeout for AI service calls
- `AI_FALLBACK_ENABLED`: Whether to use fallback logic

## Configuration Guide

### Environment Variables

The framework relies on environment variables for configuration. The `.env.example` file contains all required variables:

#### Authentication
- `API_KEY_SECRET`: Secret for API key authentication
- `JWT_SECRET_KEY`: Secret for JWT token signing
- `CANDIDATE_JWT_SECRET_KEY`: Secret for candidate tokens

#### Database
- `DATABASE_URL`: Connection string for database (currently for future migration)

#### Services
- `GATEWAY_SERVICE_URL`: URL for gateway service
- `AGENT_SERVICE_URL`: URL for agent service
- `LANGGRAPH_SERVICE_URL`: URL for LangGraph service

#### Security
- `MAX_LOGIN_ATTEMPTS`: Maximum failed login attempts before lockout
- `JWT_EXPIRATION_HOURS`: JWT token expiration time
- `REQUIRE_PASSWORD_COMPLEXITY`: Whether to enforce password complexity

### Configuration Best Practices
- Use different secrets for development/staging/production
- Rotate secrets regularly (recommended every 90 days)
- Never commit .env files to version control
- Use infrastructure-specific configurations for different environments

## Security & Compliance

### Security Measures

#### Authentication
- Dual authentication (API key and JWT tokens)
- 2FA with TOTP implementation
- Secure password hashing and validation
- Session management with proper expiration

#### Authorization
- Role-based access control with granular permissions
- Tenant isolation preventing cross-tenant access
- Permission checking at middleware level
- Resource-action based access control

#### Data Protection
- Tenant isolation for all data access
- Audit logging for all operations
- Secure token validation
- Input sanitization and validation

### Compliance Features

#### Audit Trail
- Comprehensive logging of all user actions
- Provenance tracking for data modifications
- Configurable retention policies
- Search and analysis capabilities

#### Data Privacy
- Tenant isolation ensuring data separation
- GDPR/CCPA compliance capabilities
- Right to deletion implementation
- Data minimization principles

### Security Best Practices
- Regular security audits
- Penetration testing
- Vulnerability scanning
- Secure coding practices
- Access control reviews

## Deployment Guide

### Production Deployment

#### Environment Preparation
1. Set up production environment with appropriate hardware
2. Configure firewall and network security
3. Set up SSL certificates for HTTPS
4. Prepare database infrastructure

#### Configuration
1. Update environment variables for production
2. Configure security settings appropriately
3. Set up monitoring and logging infrastructure
4. Configure backup and recovery procedures

#### Deployment Process
1. Deploy the framework to production servers
2. Run database migrations if applicable
3. Start all services
4. Perform smoke tests
5. Monitor initial operation

### Docker Deployment

#### Building the Image
```bash
docker build -t bharat-sar-runtime .
```

#### Running with Docker
```bash
docker run -p 8000:8000 --env-file .env bharat-sar-runtime
```

#### Docker Compose
```bash
docker-compose -f docker-compose.yml up -d
```

### Scaling Considerations
- Horizontal scaling capabilities planned
- Database connection pooling
- Memory management optimization
- Load balancing configuration

## Troubleshooting

### Common Issues

#### 1. Authentication Issues
- **Problem**: Unable to authenticate
- **Solution**: Verify API_KEY_SECRET and JWT_SECRET_KEY in environment variables

#### 2. Tenant Isolation Not Working
- **Problem**: Cross-tenant data access
- **Solution**: Verify all database queries include tenant_id filters

#### 3. Adapter Not Loading
- **Problem**: Integration adapters not initializing
- **Solution**: Check adapter configuration in environment variables

#### 4. AI/RL Service Integration Failing
- **Problem**: AI/RL services not responding
- **Solution**: Verify AI_SERVICE_ENDPOINT and RL_SERVICE_API_KEY, check service connectivity

#### 5. Performance Issues
- **Problem**: Slow response times
- **Solution**: Check database performance, optimize queries, monitor resource usage

### Diagnostic Commands

```bash
# Check service health
curl http://localhost:8000/health

# Check all endpoints
python test/test_all_endpoints.py --verbose

# View logs
tail -f logs/application.log
```

### Monitoring
- Implement health checks for production
- Monitor response times and error rates
- Track resource utilization
- Set up alerts for critical issues

## Team Contacts

### Core Framework
- **Framework Architect**: Ashmit (Integration architecture)
- **Platform Engineer**: Vinayak (QA and deployment)

### Module Development
- **Frontend/UI**: Nikhil
- **Backend Services**: Development team

### AI/RL Integration
- **AI Specialist**: Ishan Shirode

### Support Channels
- **Technical Queries**: framework-support@bharat-platform.com
- **Security Issues**: security@bharat-platform.com
- **Urgent Issues**: escalation@bharat-platform.com

## Support & Maintenance

### Ongoing Maintenance
- Regular security updates
- Performance monitoring and optimization
- Feature enhancements based on user feedback
- Documentation updates

### Version Management
- Semantic versioning for releases
- Backward compatibility maintained
- Migration guides for major versions
- Deprecation notices in advance

### Support Levels
- **Critical Issues**: 2-hour response time
- **High Priority**: 24-hour response time
- **Medium Priority**: 3-business day response time
- **Low Priority**: 5-business day response time

---

**Handover Date**: January 17, 2026  
**Framework Version**: BHIV Application Framework v1.0  
**Document Version**: 1.0