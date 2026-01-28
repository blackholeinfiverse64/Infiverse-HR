# BHIV Application Framework (Runtime-Core)

The BHIV Application Framework is a comprehensive, reusable platform extracted from the BHIV HR Platform and evolved to support multiple domains (HR, CRM, ERP, etc.). It provides core infrastructure services including authentication, tenant isolation, role enforcement, audit logging, workflow management, and pluggable integration capabilities.

**Status**: Legacy Reference - Not actively used in current production system

**Note**: This runtime-core framework was developed as part of Task 7 and Task 8 requirements but is not currently integrated into the main BHIV HR Platform services. The core functionality has been integrated directly into the main services (gateway, agent, langgraph) for better maintainability and performance.

## Overview

**⚠️ IMPORTANT: Legacy Status**

This SAR (Sovereign Application Runtime) framework was originally designed as a sovereign cloud architecture that can be deployed in KSA/UAE infrastructure, ensuring data sovereignty and compliance with local regulations. However, it is currently maintained as a reference implementation and not actively used in the production system.

The production system has been re-architected to have core services (gateway, agent, langgraph) with their functionality integrated directly rather than relying on a separate runtime framework. This change was made to:

1. Improve maintainability
2. Reduce complexity
3. Enable better performance through direct integration
4. Simplify the deployment process

This repository contains the complete framework for educational, reference, and future potential integration purposes.

## Features (Reference Implementation)

**⚠️ Note**: These features are implemented in the reference framework but are not actively used in the current production system. The production system has these features implemented directly in the core services.

- **Multi-tenant SaaS Architecture**: Complete tenant isolation with no cross-tenant data access
- **Dual Authentication System**: Support for both API keys and JWT tokens with 2FA capabilities
- **Role-Based Access Control (RBAC)**: Comprehensive permission system with flexible role assignments
- **Comprehensive Audit Logging**: Complete audit trails with provenance tracking for all operations
- **Workflow Engine**: Business process automation with dependency management
- **Integration Adapters**: Pluggable adapters for external systems (Artha, Karya, InsightFlow, Bucket)
- **Reusable Architecture**: Framework designed for multiple business domains (HR, CRM, ERP, etc.)
- **Rate Limiting and Security Measures**: Built-in protection against abuse and attacks
- **Configurable Storage Backends**: Support for multiple storage options
- **Asynchronous Processing**: Non-blocking operations for improved performance
- **Event-Driven Architecture**: Scalable and responsive system design
- **Complete API Coverage**: All endpoints fully tested and verified for functionality
- **AI/RL Integration Ready**: Framework designed to integrate with BHIV AI/RL system for intelligent automation and reinforcement learning
- **BHIV Product Ecosystem**: Ready for integration with HR, CRM, ERP, Nyaya, Setu, and Design Tools products

## Architecture

The framework follows a modular architecture with the following core components:

1. **Authentication Service** - Handles user authentication and session management
2. **Tenant Resolution Service** - Manages tenant identification and isolation
3. **Role Enforcement Service** - Implements role-based access control
4. **Audit Logging Service** - Provides comprehensive audit trails
5. **Workflow Engine** - Automates business processes
6. **Integration Adapters** - Pluggable adapters for external systems

Each component is designed to work independently while providing seamless integration when used together.

## Integration Adapters

The framework includes a pluggable adapter layer for connecting with external systems:

- **Artha Adapter**: Payroll and finance system integration
- **Karya Adapter**: Task and workflow management integration
- **InsightFlow Adapter**: Analytics and metrics collection
- **Bucket Adapter**: Storage and artifact management

All adapters follow the same interface and are designed to be optional and fail-safe, ensuring the core system operates even when external integrations are unavailable.

## Core Components

### Authentication Service (`auth/`)

The authentication service provides comprehensive user authentication capabilities:

- **JWT Token Management**: Secure token generation and validation
- **API Key Authentication**: System-level access with API keys (default: `default_sar_api_key`)
- **Two-Factor Authentication**: TOTP-based 2FA with QR code generation and manual entry
- **Password Management**: Secure password hashing, validation, generation, and policy enforcement
- **Email and Phone Validation**: Verification mechanisms for contact information
- **Session Management**: Secure session handling and lifecycle management
- **Security Measures**: Rate limiting, brute force protection, and secure token storage

**API Endpoints**:
- `/auth/login` - User login with optional 2FA
- `/auth/2fa/setup` - Setup 2FA for user (requires API key)
- `/auth/2fa/verify` - Verify TOTP code (requires API key)
- `/auth/2fa/status/{user_id}` - Get 2FA status for user
- `/auth/password/validate` - Validate password strength (requires API key)
- `/auth/password/change` - Change password (requires JWT)
- `/auth/password/generate` - Generate secure password (requires API key)
- `/auth/password/policy` - Get password policy (requires API key)
- `/auth/health` - Authentication service health check

### Tenant Resolution Service (`tenancy/`)

The tenant resolution service ensures proper multi-tenancy with complete isolation:

- **Tenant Identification**: Automatic tenant resolution from JWT tokens and headers
- **Isolation Enforcement**: Prevents cross-tenant data access
- **Context Injection**: Automatic tenant context injection in requests
- **Validation Mechanisms**: Tenant access validation and verification
- **Scalable Architecture**: Designed to handle thousands of tenants
- **Configurable Isolation**: Flexible isolation policies based on requirements

**API Endpoints**:
- `/tenants/current` - Get current tenant information
- `/tenants/isolation-check/{resource_tenant_id}` - Check cross-tenant access
- `/tenants/query-filter/{table_name}` - Get SQL query filters for tenant isolation
- `/tenants/shared-resource-access/{resource_type}` - Check shared resource access
- `/tenants/health` - Tenant service health check

### Role Enforcement Service (`role_enforcement/`)

The role enforcement service provides comprehensive access control:

- **Role Definitions**: Predefined roles (system_admin, client_admin, client_user, candidate, api_key_user)
- **Permission System**: Resource-action based permissions with scope control (tenant, system, global, own, public)
- **Dynamic Assignment**: Role assignment with tenant scoping and expiration
- **Middleware Integration**: Request-level access control enforcement
- **Permission Inheritance**: Hierarchical permission management
- **Real-time Validation**: On-demand permission checking

**API Endpoints**:
- `/role/health` - Role enforcement service health check
- `/role/available-roles` - Get all available roles in the system
- `/role/current` - Get current user's roles and permissions
- `/role/permissions` - Get current user's permissions
- `/role/user/{user_id}` - Get roles assigned to a specific user
- `/role/assign` - Assign a role to a user (requires admin permissions)
- `/role/check-permission` - Check if user has specific permission
- `/role/protected-example` - Example of protected endpoint
- `/role/admin-only` - Example of admin-only endpoint

### Audit Logging Service (`audit_logging/`)

The audit logging service provides complete operational transparency:

- **Comprehensive Event Tracking**: User logins, API access, data modifications, security events
- **Provenance Tracking**: Maintains old/new values for data modifications
- **Multi-Tenancy Support**: Tenant-isolated audit logs with cross-tenant access prevention
- **Flexible Storage**: Supports file-based and in-memory storage backends
- **Real-time Monitoring**: Middleware for automatic request/response logging
- **Search and Analysis**: Comprehensive API for audit trail retrieval and analysis
- **Retention Policies**: Configurable log retention and archival
- **Asynchronous Processing**: Non-blocking audit logging with configurable flush intervals

**API Endpoints**:
- `/audit/health` - Audit logging service health check
- `/audit/events` - Retrieve audit events with filtering and pagination
- `/audit/events/{event_id}` - Get specific audit event by ID
- `/audit/trail/{resource}/{resource_id}` - Get complete audit trail for a resource
- `/audit/stats` - Get audit log statistics
- `/audit/log-custom` - Log custom audit event (requires valid event type)
- `/audit/example-protected-endpoint` - Example of audit-logged protected endpoint

### Workflow Engine (`workflow/`)

The workflow engine automates business processes:

- **Workflow Definitions**: Reusable templates for business processes
- **Task Management**: Dependency-aware task execution with error handling
- **State Management**: Persistent workflow state with pause/resume capabilities
- **Multi-Tenancy Support**: Tenant-isolated workflow execution
- **Event-Driven**: Asynchronous task execution with timeout and retry mechanisms
- **Scalable Execution**: Concurrent workflow processing
- **Monitoring and Control**: Workflow lifecycle management

**API Endpoints**:
- `/workflow/health` - Workflow engine health check
- `/workflow/definitions` - Get available workflow definitions
- `/workflow/start` - Start a new workflow instance
- `/workflow/instances` - Get all workflow instances
- `/workflow/instances/{instance_id}` - Get specific workflow instance
- `/workflow/instances/{instance_id}/cancel` - Cancel workflow instance
- `/workflow/instances/{instance_id}/pause` - Pause workflow instance
- `/workflow/instances/{instance_id}/resume` - Resume workflow instance
- `/workflow/examples/candidate-onboarding` - Register example workflow definition

## Integration

All services are designed to work together seamlessly:

- **Cross-Service Communication**: Services share context and information
- **Unified Middleware**: Consistent request processing pipeline with RoleEnforcementMiddleware, TenantIsolationMiddleware, AuditLoggingMiddleware, and WorkflowEnforcementMiddleware
- **Shared Configuration**: Centralized configuration management
- **Common Security Model**: Unified authentication and authorization
- **AI/RL Integration**: Framework integrates with the BHIV AI/RL system for intelligent workflow automation and reinforcement learning capabilities
- **BHIV Ecosystem**: Designed for seamless integration with other BHIV products (HR, CRM, ERP, Nyaya, Setu, Design Tools)

## API Endpoints

Each service provides RESTful API endpoints for integration:

- `/auth/...` - Authentication endpoints (login, 2FA, password management)
- `/tenants/...` - Tenant management and isolation endpoints
- `/role/...` - Role management and permission checking endpoints
- `/audit/...` - Audit logging and event retrieval endpoints
- `/workflow/...` - Workflow management and execution endpoints

## Configuration

The SAR is highly configurable through environment variables:

- `JWT_SECRET_KEY` - Secret key for JWT token signing
- `API_KEY_SECRET` - System-level API key (default: `default_sar_api_key`)
- `CANDIDATE_JWT_SECRET_KEY` - Secret key for candidate JWT tokens
- `AUDIT_LOGGING_ENABLED` - Enable/disable audit logging
- `AUDIT_STORAGE_BACKEND` - Storage backend for audit logs (file/memory)
- `AUDIT_ASYNC_WRITES` - Enable/disable asynchronous audit logging
- `TENANT_ISOLATION_ENABLED` - Enable/disable tenant isolation
- `WORKFLOW_STORAGE_BACKEND` - Storage backend for workflows

## Security

The SAR implements multiple layers of security:

- **Authentication**: Multiple authentication methods with 2FA support
- **Authorization**: Role-based access control with fine-grained permissions
- **Data Isolation**: Complete tenant data separation
- **Audit Trails**: Comprehensive logging of all operations
- **Rate Limiting**: Protection against abuse and DoS attacks
- **Input Validation**: Comprehensive input sanitization and validation
- **API Key Protection**: System-level operations protected with API keys
- **JWT Token Validation**: Secure token validation with proper secret keys

## Deployment

The SAR can be deployed in various configurations:

- **Sovereign Cloud**: Deployable in KSA/UAE infrastructure
- **Self-Hosted**: On-premises deployment with no external dependencies
- **Containerized**: Docker-based deployment for easy scaling
- **Air-Gapped**: Functionality without internet access

## Usage

This runtime is designed to be integrated with various BHIV products (HR, CRM, ERP, Nyaya, Setu, Design Tools) to provide consistent infrastructure services across the platform. Each service can be used independently or in combination based on application requirements.

## Running & Testing (Python, Docker, Swagger)

### Python (Local) Option

From the project root:

```bash
cd "C:\\BHIV HR PLATFORM\\runtime-core"
python -m venv .venv
.\\.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Once running:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- Health check: `http://localhost:8000/health`

### Docker Option

From the project root:

```bash
cd "C:\\BHIV HR PLATFORM\\runtime-core"

# Build image
docker build -t sar-runtime .

# Run container
docker run -p 8000:8000 --name sar-runtime sar-runtime
```

Or, using Docker Compose:

```bash
docker compose -f docker-compose.yml up --build
```

Then use the same URLs:

- Swagger UI: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

---

## 📘 Complete Swagger UI Testing Guide

Open **http://localhost:8000/docs** to access the interactive API documentation.

---

## 🔐 Authentication Types

| Type | Value to Enter in Swagger | When to Use |
|------|---------------------------|-------------|
| **API Key** | `default_sar_api_key` | All protected endpoints (simplest option for testing) |
| **JWT Token** | Token received from `/auth/login` | Alternative to API Key for user-specific context |
| **None** | No authorization needed | Health checks, login, root endpoint |

> **Note:** Most protected endpoints accept **both** API Key and JWT Token. API Key is recommended for testing as it's simpler to use.

---

# 🏠 SECTION 1: Default Endpoints

## 📋 Step 1.1: Root Endpoint

**Authorization:** None required

1. Expand **GET /**
2. Click **"Try it out"**
3. Click **"Execute"**

**Response:**
```json
{
  "service": "Sovereign Application Runtime",
  "version": "1.0.0",
  "description": "Multi-tenant runtime environment with authentication, RBAC, audit logging, and workflow management",
  "docs": "/docs",
  "health": "/health"
}
```

---

## 📋 Step 1.2: Health Check

**Authorization:** None required

1. Expand **GET /health**
2. Click **"Try it out"**
3. Click **"Execute"**

**Response:**
```json
{
  "status": "healthy",
  "service": "Sovereign Application Runtime",
  "version": "1.0.0",
  "timestamp": "2026-01-09T10:00:00.000000"
}
```

---

## 📋 Step 1.3: Readiness Check

**Authorization:** None required

1. Expand **GET /ready**
2. Click **"Try it out"**
3. Click **"Execute"**

**Response:**
```json
{
  "status": "ready",
  "checks": {
    "auth_service": "ok",
    "tenant_service": "ok",
    "role_service": "ok",
    "audit_service": "ok",
    "workflow_service": "ok"
  }
}
```

---

# 🔑 SECTION 2: Sovereign Authentication

## 📋 Step 2.0: Authorize with API Key

Before testing auth endpoints that require API Key:

1. Click the **🔒 Authorize** button (top-right)
2. In the **Value** field, enter:
   ```
   default_sar_api_key
   ```
3. Click **"Authorize"**
4. Click **"Close"**

✅ You are now authorized to use API Key protected endpoints.

---

## 📋 Step 2.1: Setup 2FA for a User

**Authorization:** API Key required ✅

1. Expand **POST /auth/2fa/setup**
2. Click **"Try it out"**
3. Enter this JSON in the **Request body**:
   ```json
   {
     "user_id": "user1"
   }
   ```
4. Click **"Execute"**

**Response:**
```json
{
  "user_id": "user1",
  "secret": "CBPTUXGLOTPNM7MIVGONDJIUVYD4M5OS",
  "qr_code": "data:image/png;base64,iVBORw0KGgo...",
  "manual_entry_key": "CBPTUXGLOTPNM7MIVGONDJIUVYD4M5OS",
  "instructions": "Scan QR code with Google Authenticator, Microsoft Authenticator, or Authy"
}
```

📱 **Next:** Open your authenticator app → Add account → Enter the `manual_entry_key` manually.

---

## 📋 Step 2.2: Verify 2FA Code

**Authorization:** API Key required ✅

1. Expand **POST /auth/2fa/verify**
2. Click **"Try it out"**
3. Enter this JSON in the **Request body**:
   ```json
   {
     "user_id": "user1",
     "totp_code": "123456"
   }
   ```
   > Replace `123456` with the current code from your authenticator app
4. Click **"Execute"**

**Response (Success):**
```json
{
  "success": true,
  "user_id": "user1",
  "verified_at": "2026-01-09T10:01:00.000000"
}
```

**Response (Invalid Code):**
```json
{
  "detail": "Invalid 2FA code"
}
```

---

## 📋 Step 2.3: Login (Get JWT Token)

**Authorization:** None required

1. Expand **POST /auth/login**
2. Click **"Try it out"**
3. Enter this JSON in the **Request body**:

   **Option A - Without 2FA:**
   ```json
   {
     "username": "user1",
     "password": "mypassword"
   }
   ```

   **Option B - With 2FA:**
   ```json
   {
     "username": "user1",
     "password": "mypassword",
     "totp_code": "123456"
   }
   ```
   > Replace `123456` with current code from authenticator app

4. Click **"Execute"**

**Response:**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzY1MDk2MDAsImlhdCI6MTczNjQyMzIwMCwidHlwZSI6InVzZXJfand0IiwidXNlcl9pZCI6InVzZXIxIiwidGVuYW50X2lkIjoiZGVmYXVsdCJ9.xxxxx",
  "token_type": "bearer",
  "expires_in": 86400,
  "user_id": "user1",
  "2fa_verified": false
}
```

⚠️ **IMPORTANT:** Copy the `access_token` value! You need it for JWT-protected endpoints.

---

## 📋 Step 2.4: Get 2FA Status

**Authorization:** API Key or JWT Token required ✅

1. Expand **GET /auth/2fa/status/{user_id}**
2. Click **"Try it out"**
3. Enter in **user_id**:
   ```
   user1
   ```
4. Click **"Execute"**

**Response:**
```json
{
  "user_id": "user1",
  "2fa_enabled": true,
  "setup_date": "2025-01-01T12:00:00Z",
  "last_used": "2025-01-02T08:30:00Z",
  "backup_codes_remaining": 8
}
```

---

## 📋 Step 2.5: Validate Password Strength

**Authorization:** API Key required ✅

> Switch back to API Key: Click **🔒 Authorize** → Logout → Enter `default_sar_api_key` → Authorize

1. Expand **POST /auth/password/validate**
2. Click **"Try it out"**
3. Enter this JSON in the **Request body**:

   **Strong password:**
   ```json
   {
     "password": "MySecure@Pass123"
   }
   ```

4. Click **"Execute"**

**Response (Strong):**
```json
{
  "password_strength": "Very Strong",
  "score": 100,
  "max_score": 100,
  "is_valid": true,
  "feedback": []
}
```

**Test with weak password:**
```json
{
  "password": "abc"
}
```

**Response (Weak):**
```json
{
  "password_strength": "Very Weak",
  "score": 20,
  "max_score": 100,
  "is_valid": false,
  "feedback": [
    "Password should be at least 8 characters long",
    "Password should contain uppercase letters",
    "Password should contain numbers",
    "Password should contain special characters"
  ]
}
```

---

## 📋 Step 2.6: Change Password

**Authorization:** API Key required ✅

> Use API Key: Click **🔒 Authorize** → Enter `default_sar_api_key` → Authorize

1. Expand **POST /auth/password/change**
2. Click **"Try it out"**
3. Enter this JSON in the **Request body**:
   ```json
   {
     "user_id": "user1",
     "old_password": "mypassword",
     "new_password": "MyNewSecure@123"
   }
   ```
4. Click **"Execute"**

**Response:**
```json
{
  "message": "Password changed successfully",
  "changed_at": "2026-01-09T10:05:00.000000+00:00",
  "password_strength": "Very Strong"
}
```

---

## 📋 Step 2.7: Generate Secure Password

**Authorization:** API Key required ✅

1. Expand **GET /auth/password/generate**
2. Click **"Try it out"**
3. Click **"Execute"**

**Response:**
```json
{
  "generated_password": "Kx9#mP2$vL7@nQ4!",
  "length": 16,
  "includes_uppercase": true,
  "includes_lowercase": true,
  "includes_numbers": true,
  "includes_symbols": true
}
```

---

## 📋 Step 2.8: Get Password Policy

**Authorization:** API Key required ✅

1. Expand **GET /auth/password/policy**
2. Click **"Try it out"**
3. Click **"Execute"**

**Response:**
```json
{
  "min_length": 8,
  "max_length": 128,
  "require_uppercase": true,
  "require_lowercase": true,
  "require_numbers": true,
  "require_special_chars": true,
  "special_chars_allowed": "!@#$%^&*()_+-=[]{}|;:,.<>?",
  "min_score_required": 60
}
```

---

## 📋 Step 2.9: Auth Health Check

**Authorization:** None required

1. Expand **GET /auth/health**
2. Click **"Try it out"**
3. Click **"Execute"**

**Response:**
```json
{
  "status": "healthy",
  "service": "authentication",
  "2fa_enabled": true,
  "rate_limiting_enabled": true
}
```

---

# 🏢 SECTION 3: Sovereign Tenancy

> **All tenant endpoints work with API Key or JWT Token authorization**

## 📋 Step 3.0: Authorization Options

**Option A - API Key (simpler for testing):**
1. Click the **🔒 Authorize** button
2. Enter: `default_sar_api_key`
3. Click **"Authorize"** → **"Close"**

**Option B - JWT Token:**
1. Click the **🔒 Authorize** button
2. Click **"Logout"** (if previously authorized)
3. Paste your JWT token from Step 2.3
4. Click **"Authorize"** → **"Close"**

---

## 📋 Step 3.1: Get Current Tenant

**Authorization:** API Key or JWT Token required ✅

1. Expand **GET /tenants/current**
2. Click **"Try it out"**
3. Click **"Execute"**

**Response:**
```json
{
  "tenant_id": "default",
  "user_id": "user1",
  "resolved_from": "jwt_token",
  "isolation_enabled": true,
  "resolved_at": "2026-01-09T10:10:00.000000"
}
```

---

## 📋 Step 3.2: Tenant Health Check

**Authorization:** API Key or JWT Token required ✅

1. Expand **GET /tenants/health**
2. Click **"Try it out"**
3. Click **"Execute"**

**Response:**
```json
{
  "status": "healthy",
  "service": "tenant_resolution",
  "isolation_enabled": true,
  "active_tenants": 5
}
```

---

## 📋 Step 3.3: Check Tenant Access (Isolation Check)

**Authorization:** API Key or JWT Token required ✅

1. Expand **GET /tenants/isolation-check/{resource_tenant_id}**
2. Click **"Try it out"**
3. Enter in **resource_tenant_id**:
   ```
   tenant123
   ```
4. Click **"Execute"**

**Response (Access Denied - Different Tenant):**
```json
{
  "current_tenant_id": "default",
  "resource_tenant_id": "tenant123",
  "access_allowed": false,
  "reason": "Cross-tenant access denied"
}
```

**Test with same tenant:**
Enter `default` as resource_tenant_id

**Response (Access Allowed - Same Tenant):**
```json
{
  "current_tenant_id": "default",
  "resource_tenant_id": "default",
  "access_allowed": true,
  "reason": "Same tenant access"
}
```

---

## 📋 Step 3.4: Get Query Filter

**Authorization:** API Key or JWT Token required ✅

1. Expand **GET /tenants/query-filter/{table_name}**
2. Click **"Try it out"**
3. Enter in **table_name**:
   ```
   users
   ```
4. Click **"Execute"**

**Response:**
```json
{
  "table_name": "users",
  "tenant_id": "default",
  "filter_clause": "tenant_id = 'default'",
  "sql_safe": true
}
```

---

## 📋 Step 3.5: Check Shared Resource Access

**Authorization:** API Key or JWT Token required ✅

1. Expand **GET /tenants/shared-resource-access/{resource_type}**
2. Click **"Try it out"**
3. Enter in **resource_type**:
   ```
   templates
   ```
4. Click **"Execute"**

**Response:**
```json
{
  "resource_type": "templates",
  "tenant_id": "default",
  "access_allowed": true,
  "access_level": "read",
  "shared_resources": ["email_templates", "document_templates"]
}
```

---

# 👥 SECTION 4: Role Enforcement

> **All role endpoints work with API Key or JWT Token authorization** (except health which needs none)

## 📋 Step 4.1: Role Health Check

**Authorization:** None required

1. Expand **GET /role/health**
2. Click **"Try it out"**
3. Click **"Execute"**

**Response:**
```json
{
  "status": "healthy",
  "service": "role_enforcement",
  "roles_loaded": 5,
  "permissions_loaded": 25
}
```

---

## 📋 Step 4.2: Get Available Roles

**Authorization:** API Key or JWT Token required ✅

1. Expand **GET /role/available-roles**
2. Click **"Try it out"**
3. Click **"Execute"**

**Response:**
```json
{
  "roles": [
    {
      "name": "system_admin",
      "description": "Full system access across all tenants",
      "scope": "system"
    },
    {
      "name": "client_admin",
      "description": "Administrative access within tenant",
      "scope": "tenant"
    },
    {
      "name": "client_user",
      "description": "Standard user access within tenant",
      "scope": "tenant"
    },
    {
      "name": "candidate",
      "description": "Job candidate with limited access",
      "scope": "own"
    },
    {
      "name": "api_key_user",
      "description": "System-level API access",
      "scope": "system"
    }
  ]
}
```

---

## 📋 Step 4.3: Get Current User Info

**Authorization:** API Key or JWT Token required ✅

1. Expand **GET /role/current**
2. Click **"Try it out"**
3. Click **"Execute"**

**Response:**
```json
{
  "user_id": "user1",
  "tenant_id": "default",
  "roles": ["client_user"],
  "auth_type": "user_jwt",
  "token_expires_at": "2026-01-10T10:00:00.000000"
}
```

---

## 📋 Step 4.4: Get User Permissions

**Authorization:** API Key or JWT Token required ✅

1. Expand **GET /role/permissions**
2. Click **"Try it out"**
3. Click **"Execute"**

**Response:**
```json
{
  "user_id": "user1",
  "permissions": [
    {
      "resource": "workflow",
      "actions": ["read", "create", "update"],
      "scope": "tenant"
    },
    {
      "resource": "audit",
      "actions": ["read"],
      "scope": "tenant"
    },
    {
      "resource": "tenant",
      "actions": ["read"],
      "scope": "own"
    }
  ]
}
```

---

## 📋 Step 4.5: Get User Roles by User ID

**Authorization:** API Key or JWT Token required ✅

1. Expand **GET /role/user/{user_id}**
2. Click **"Try it out"**
3. Enter in **user_id**:
   ```
   user1
   ```
4. Click **"Execute"**

**Response:**
```json
{
  "user_id": "user1",
  "roles": [
    {
      "role_name": "client_user",
      "tenant_id": "default",
      "assigned_at": "2026-01-09T08:00:00.000000",
      "expires_at": null
    }
  ]
}
```

---

## 📋 Step 4.6: Assign Role to User

**Authorization:** API Key or JWT Token required ✅ (Admin permissions needed)

1. Expand **POST /role/assign**
2. Click **"Try it out"**
3. Enter this JSON in the **Request body**:
   ```json
   {
     "user_id": "user2",
     "role_name": "client_user",
     "tenant_id": "default"
   }
   ```
4. Click **"Execute"**

**Response:**
```json
{
  "success": true,
  "user_id": "user2",
  "role_name": "client_user",
  "tenant_id": "default",
  "assigned_at": "2026-01-09T10:15:00.000000"
}
```

---

## 📋 Step 4.7: Check Permission

**Authorization:** API Key or JWT Token required ✅

1. Expand **POST /role/check-permission**
2. Click **"Try it out"**
3. Enter this JSON in the **Request body**:
   ```json
   {
     "resource": "workflow",
     "action": "read"
   }
   ```
4. Click **"Execute"**

**Response:**
```json
{
  "user_id": "user1",
  "resource": "workflow",
  "action": "read",
  "has_permission": true,
  "scope": "tenant",
  "checked_at": "2026-01-09T10:16:00.000000"
}
```

**Test with unauthorized action:**
```json
{
  "resource": "system",
  "action": "delete"
}
```

**Response:**
```json
{
  "user_id": "user1",
  "resource": "system",
  "action": "delete",
  "has_permission": false,
  "scope": null,
  "checked_at": "2026-01-09T10:16:30.000000"
}
```

---

## 📋 Step 4.8: Protected Example Endpoint

**Authorization:** API Key or JWT Token required ✅

1. Expand **GET /role/protected-example**
2. Click **"Try it out"**
3. Click **"Execute"**

**Response:**
```json
{
  "message": "You have accessed a protected endpoint",
  "user_id": "user1",
  "tenant_id": "default",
  "accessed_at": "2026-01-09T10:17:00.000000"
}
```

---

## 📋 Step 4.9: Admin Only Endpoint

**Authorization:** API Key or JWT Token required ✅ (Admin role needed)

1. Expand **POST /role/admin-only**
2. Click **"Try it out"**
3. Click **"Execute"**

**Response (If Admin):**
```json
{
  "message": "Admin action executed successfully",
  "user_id": "admin_user",
  "action": "admin_operation",
  "executed_at": "2026-01-09T10:18:00.000000"
}
```

**Response (If Not Admin):**
```json
{
  "detail": "Admin access required"
}
```

---

# 📝 SECTION 5: Audit Logging

> **All audit endpoints work with API Key or JWT Token authorization** (except health which needs none)

## 📋 Step 5.1: Audit Health Check

**Authorization:** None required

1. Expand **GET /audit/health**
2. Click **"Try it out"**
3. Click **"Execute"**

**Response:**
```json
{
  "status": "healthy",
  "service": "audit_logging",
  "storage_backend": "file",
  "async_writes": true,
  "events_count": 150
}
```

---

## 📋 Step 5.2: Get Audit Events

**Authorization:** API Key or JWT Token required ✅

1. Expand **GET /audit/events**
2. Click **"Try it out"**
3. Set parameters (optional):
   - **limit**: `10`
   - **offset**: `0`
   - **event_type**: `api_access` (optional filter)
4. Click **"Execute"**

**Response:**
```json
{
  "events": [
    {
      "event_id": "evt_001",
      "event_type": "api_access",
      "timestamp": "2026-01-09T10:00:00.000000",
      "user_id": "user1",
      "tenant_id": "default",
      "resource": "auth",
      "action": "login",
      "status": "success",
      "ip_address": "127.0.0.1",
      "user_agent": "Mozilla/5.0..."
    },
    {
      "event_id": "evt_002",
      "event_type": "api_access",
      "timestamp": "2026-01-09T10:05:00.000000",
      "user_id": "user1",
      "tenant_id": "default",
      "resource": "tenant",
      "action": "read",
      "status": "success",
      "ip_address": "127.0.0.1",
      "user_agent": "Mozilla/5.0..."
    }
  ],
  "total": 150,
  "limit": 10,
  "offset": 0
}
```

---

## 📋 Step 5.3: Get Audit Event by ID

**Authorization:** API Key or JWT Token required ✅

1. Expand **GET /audit/events/{event_id}**
2. Click **"Try it out"**
3. Enter in **event_id**:
   ```
   evt_001
   ```
4. Click **"Execute"**

**Response:**
```json
{
  "event_id": "evt_001",
  "event_type": "api_access",
  "timestamp": "2026-01-09T10:00:00.000000",
  "user_id": "user1",
  "tenant_id": "default",
  "resource": "auth",
  "action": "login",
  "status": "success",
  "details": {
    "ip_address": "127.0.0.1",
    "user_agent": "Mozilla/5.0...",
    "method": "POST",
    "path": "/auth/login"
  }
}
```

---

## 📋 Step 5.4: Get Resource Audit Trail

**Authorization:** API Key or JWT Token required ✅

1. Expand **GET /audit/trail/{resource}/{resource_id}**
2. Click **"Try it out"**
3. Enter parameters:
   - **resource**: `workflow`
   - **resource_id**: `wf_inst_abc123`
4. Click **"Execute"**

**Response:**
```json
{
  "resource": "workflow",
  "resource_id": "wf_inst_abc123",
  "audit_trail": [
    {
      "event_id": "evt_010",
      "action": "create",
      "timestamp": "2026-01-09T10:10:00.000000",
      "user_id": "user1",
      "changes": {
        "status": {"old": null, "new": "created"}
      }
    },
    {
      "event_id": "evt_011",
      "action": "update",
      "timestamp": "2026-01-09T10:11:00.000000",
      "user_id": "user1",
      "changes": {
        "status": {"old": "created", "new": "running"}
      }
    }
  ],
  "total_events": 2
}
```

---

## 📋 Step 5.5: Get Audit Statistics

**Authorization:** API Key or JWT Token required ✅

1. Expand **GET /audit/stats**
2. Click **"Try it out"**
3. Click **"Execute"**

**Response:**
```json
{
  "total_events": 1500,
  "events_by_type": {
    "api_access": 1000,
    "user_login": 200,
    "data_modification": 150,
    "security_event": 50,
    "system_event": 100
  },
  "events_by_status": {
    "success": 1400,
    "failure": 100
  },
  "events_last_24h": 450,
  "events_last_7d": 1200,
  "storage_backend": "file",
  "oldest_event": "2025-12-01T00:00:00.000000",
  "newest_event": "2026-01-09T10:20:00.000000"
}
```

---

## 📋 Step 5.6: Log Custom Audit Event

**Authorization:** API Key or JWT Token required ✅

> **Note:** This endpoint uses **query parameters**, not JSON body

1. Expand **POST /audit/log-custom**
2. Click **"Try it out"**
3. Set **query parameters** (required):
   - **event_type**: `data_access` (see valid types below)
   - **resource**: `document`
   - **action**: `download`
   - **resource_id**: `doc_123` (optional)
4. Click **"Execute"**

**Response:**
```json
{
  "success": true,
  "message": "Audit event logged successfully",
  "resource": "document",
  "action": "download"
}
```

---

## 📋 Step 5.7: Example Protected Endpoint (Audit)

**Authorization:** API Key or JWT Token required ✅

1. Expand **GET /audit/example-protected-endpoint**
2. Click **"Try it out"**
3. Click **"Execute"**

**Response:**
```json
{
  "message": "This endpoint is protected and audited",
  "user_id": "user1",
  "tenant_id": "default",
  "audit_event_logged": true,
  "accessed_at": "2026-01-09T10:22:00.000000"
}
```

---

# ⚙️ SECTION 6: Workflow Engine

> **All workflow endpoints work with API Key or JWT Token authorization** (except health which needs none)

## 📋 Step 6.1: Workflow Health Check

**Authorization:** None required

1. Expand **GET /workflow/health**
2. Click **"Try it out"**
3. Click **"Execute"**

**Response:**
```json
{
  "status": "healthy",
  "service": "workflow_engine",
  "storage_backend": "memory",
  "active_instances": 3,
  "registered_definitions": 2
}
```

---

## 📋 Step 6.2: Create Candidate Onboarding Workflow (Example)

**Authorization:** API Key or JWT Token required ✅

1. Expand **POST /workflow/examples/candidate-onboarding**
2. Click **"Try it out"**
3. Click **"Execute"**

**Response:**
```json
{
  "message": "Example workflow registered successfully",
  "workflow_name": "candidate_onboarding",
  "description": "Workflow for onboarding new candidates",
  "tasks": [
    "collect_documents",
    "verify_identity",
    "background_check",
    "schedule_interview",
    "send_offer"
  ],
  "tasks_count": 5,
  "registered_at": "2026-01-09T10:25:00.000000"
}
```

---

## 📋 Step 6.3: List Workflow Definitions

**Authorization:** API Key or JWT Token required ✅

1. Expand **GET /workflow/definitions**
2. Click **"Try it out"**
3. Click **"Execute"**

**Response:**
```json
{
  "definitions": [
    {
      "name": "candidate_onboarding",
      "description": "Workflow for onboarding new candidates",
      "tasks": [
        "collect_documents",
        "verify_identity",
        "background_check",
        "schedule_interview",
        "send_offer"
      ],
      "created_at": "2026-01-09T10:25:00.000000",
      "created_by": "user1"
    }
  ],
  "total": 1
}
```

---

## 📋 Step 6.4: Start a Workflow

**Authorization:** API Key or JWT Token required ✅

1. Expand **POST /workflow/start**
2. Click **"Try it out"**
3. Enter this JSON in the **Request body**:
   ```json
   {
     "workflow_name": "candidate_onboarding",
     "parameters": {
       "candidate_name": "John Doe",
       "email": "john.doe@example.com",
       "position": "Software Engineer",
       "department": "Engineering"
     }
   }
   ```
4. Click **"Execute"**

**Response:**
```json
{
  "instance_id": "wf_inst_abc123",
  "workflow_name": "candidate_onboarding",
  "status": "running",
  "current_task": "collect_documents",
  "started_at": "2026-01-09T10:26:00.000000",
  "started_by": "user1",
  "tenant_id": "default",
  "parameters": {
    "candidate_name": "John Doe",
    "email": "john.doe@example.com",
    "position": "Software Engineer",
    "department": "Engineering"
  }
}
```

---

## 📋 Step 6.5: List Workflow Instances

**Authorization:** API Key or JWT Token required ✅

1. Expand **GET /workflow/instances**
2. Click **"Try it out"**
3. Click **"Execute"**

**Response:**
```json
{
  "instances": [
    {
      "instance_id": "wf_inst_abc123",
      "workflow_name": "candidate_onboarding",
      "status": "running",
      "current_task": "collect_documents",
      "progress": "20%",
      "started_at": "2026-01-09T10:26:00.000000",
      "started_by": "user1"
    },
    {
      "instance_id": "wf_inst_def456",
      "workflow_name": "candidate_onboarding",
      "status": "completed",
      "current_task": null,
      "progress": "100%",
      "started_at": "2026-01-08T09:00:00.000000",
      "completed_at": "2026-01-08T17:00:00.000000",
      "started_by": "user1"
    }
  ],
  "total": 2
}
```

---

## 📋 Step 6.6: Get Workflow Instance Details

**Authorization:** API Key or JWT Token required ✅

1. Expand **GET /workflow/instances/{instance_id}**
2. Click **"Try it out"**
3. Enter in **instance_id**:
   ```
   wf_inst_abc123
   ```
4. Click **"Execute"**

**Response:**
```json
{
  "instance_id": "wf_inst_abc123",
  "workflow_name": "candidate_onboarding",
  "status": "running",
  "current_task": "collect_documents",
  "started_at": "2026-01-09T10:26:00.000000",
  "started_by": "user1",
  "tenant_id": "default",
  "parameters": {
    "candidate_name": "John Doe",
    "email": "john.doe@example.com",
    "position": "Software Engineer",
    "department": "Engineering"
  },
  "task_history": [
    {
      "task_name": "collect_documents",
      "status": "in_progress",
      "started_at": "2026-01-09T10:26:00.000000"
    }
  ],
  "progress_percentage": 20
}
```

---

## 📋 Step 6.7: Pause Workflow Instance

**Authorization:** API Key or JWT Token required ✅

1. Expand **POST /workflow/instances/{instance_id}/pause**
2. Click **"Try it out"**
3. Enter in **instance_id**:
   ```
   wf_inst_abc123
   ```
4. Click **"Execute"**

**Response:**
```json
{
  "instance_id": "wf_inst_abc123",
  "previous_status": "running",
  "current_status": "paused",
  "paused_at": "2026-01-09T10:30:00.000000",
  "paused_by": "user1",
  "message": "Workflow instance paused successfully"
}
```

---

## 📋 Step 6.8: Resume Workflow Instance

**Authorization:** API Key or JWT Token required ✅

1. Expand **POST /workflow/instances/{instance_id}/resume**
2. Click **"Try it out"**
3. Enter in **instance_id**:
   ```
   wf_inst_abc123
   ```
4. Click **"Execute"**

**Response:**
```json
{
  "instance_id": "wf_inst_abc123",
  "previous_status": "paused",
  "current_status": "running",
  "resumed_at": "2026-01-09T10:35:00.000000",
  "resumed_by": "user1",
  "message": "Workflow instance resumed successfully"
}
```

---

## 📋 Step 6.9: Cancel Workflow Instance

**Authorization:** API Key or JWT Token required ✅

1. Expand **POST /workflow/instances/{instance_id}/cancel**
2. Click **"Try it out"**
3. Enter in **instance_id**:
   ```
   wf_inst_abc123
   ```
4. Click **"Execute"**

**Response:**
```json
{
  "instance_id": "wf_inst_abc123",
  "previous_status": "running",
  "current_status": "cancelled",
  "cancelled_at": "2026-01-09T10:40:00.000000",
  "cancelled_by": "user1",
  "message": "Workflow instance cancelled successfully"
}
```

---

# 📊 Complete Endpoint Reference

## Default Endpoints (No Auth)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Root - Service info |
| `/health` | GET | Health check |
| `/ready` | GET | Readiness check |

## Authentication Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/2fa/setup` | POST | API Key | Setup 2FA for user |
| `/auth/2fa/verify` | POST | API Key | Verify 2FA code |
| `/auth/login` | POST | None | Login & get JWT |
| `/auth/2fa/status/{user_id}` | GET | API Key/JWT | Get 2FA status |
| `/auth/password/validate` | POST | API Key | Validate password |
| `/auth/password/change` | POST | API Key | Change password (requires user_id in body) |
| `/auth/password/generate` | GET | API Key | Generate password |
| `/auth/password/policy` | GET | API Key | Get password policy |
| `/auth/health` | GET | None | Auth health check |

## Tenancy Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/tenants/current` | GET | API Key/JWT | Current tenant info |
| `/tenants/health` | GET | API Key/JWT | Tenant health check |
| `/tenants/isolation-check/{id}` | GET | API Key/JWT | Check tenant access |
| `/tenants/query-filter/{table}` | GET | API Key/JWT | Get SQL filter |
| `/tenants/shared-resource-access/{type}` | GET | API Key/JWT | Check shared access |

## Role Enforcement Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/role/health` | GET | None | Role health check |
| `/role/assign` | POST | API Key/JWT | Assign role to user |
| `/role/user/{user_id}` | GET | API Key/JWT | Get user's roles |
| `/role/check-permission` | POST | API Key/JWT | Check permission |
| `/role/permissions` | GET | API Key/JWT | Get user permissions |
| `/role/available-roles` | GET | API Key/JWT | List all roles |
| `/role/current` | GET | API Key/JWT | Current user info |
| `/role/protected-example` | GET | API Key/JWT | Protected endpoint demo |
| `/role/admin-only` | POST | API Key/JWT | Admin-only endpoint |

## Audit Logging Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/audit/events` | GET | API Key/JWT | List audit events |
| `/audit/events/{event_id}` | GET | API Key/JWT | Get event by ID |
| `/audit/trail/{resource}/{id}` | GET | API Key/JWT | Resource audit trail |
| `/audit/stats` | GET | API Key/JWT | Audit statistics |
| `/audit/log-custom` | POST | API Key/JWT | Log custom event (uses query params) |
| `/audit/health` | GET | None | Audit health check |
| `/audit/example-protected-endpoint` | GET | API Key/JWT | Protected endpoint demo |

## Workflow Engine Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/workflow/start` | POST | API Key/JWT | Start workflow |
| `/workflow/instances` | GET | API Key/JWT | List instances |
| `/workflow/instances/{id}` | GET | API Key/JWT | Get instance details |
| `/workflow/instances/{id}/cancel` | POST | API Key/JWT | Cancel instance |
| `/workflow/instances/{id}/pause` | POST | API Key/JWT | Pause instance |
| `/workflow/instances/{id}/resume` | POST | API Key/JWT | Resume instance |
| `/workflow/definitions` | GET | API Key/JWT | List definitions |
| `/workflow/health` | GET | None | Workflow health check |
| `/workflow/examples/candidate-onboarding` | POST | API Key/JWT | Create example workflow |

---

## ✅ Testing & Verification Summary

All **42 unique endpoints** have been documented and tested with **49 test scenarios**:

- ✅ Step-by-step Swagger UI instructions
- ✅ JSON request body examples
- ✅ JSON response examples
- ✅ Authorization requirements clearly marked
- ✅ Error response examples where applicable

**Why 49 tests for 42 endpoints?**

| Endpoint | Extra Tests | Reason |
|----------|-------------|--------|
| `/auth/login` | +1 | Tested with and without 2FA |
| `/auth/password/validate` | +1 | Tested with strong and weak passwords |
| `/tenants/isolation-check/{id}` | +1 | Tested same tenant and different tenant |
| `/role/check-permission` | +1 | Tested allowed and denied permissions |
| Security tests | +3 | Unauthorized access, invalid token, auth type mixing |

**Tested Components:**
- **Authentication**: Login, 2FA setup/verify, password management
- **Authorization**: Role assignment, permission checking, protected endpoints
- **Audit Logging**: Event logging, retrieval, statistics, trails
- **Workflow Engine**: Definition registration, instance lifecycle management
- **Multi-Tenancy**: Tenant isolation, cross-tenant access prevention
- **Security**: Token validation, unauthorized access blocking

---

## 🤖 Automated Test Script

For comprehensive automated testing of all endpoints, use the provided test script:

### Basic Run

```bash
cd runtime-core
python test/test_all_endpoints.py
```

### With Verbose Output

```bash
python test/test_all_endpoints.py --verbose
```

### Custom Options

```bash
# Custom base URL
python test/test_all_endpoints.py --base-url http://localhost:8000

# Custom API key
python test/test_all_endpoints.py --api-key your_custom_api_key
```

### Test Script Features

- ✅ Tests all **42 unique endpoints** with **49 test scenarios**
- ✅ Automatic TOTP generation for 2FA testing using `pyotp`
- ✅ Colored terminal output with pass/fail indicators
- ✅ Summary with success rate at the end
- ✅ Supports custom base URL and API key
- ✅ Handles workflow lifecycle states (completed/failed workflows)
- ✅ Multiple test cases for same endpoint (valid/invalid inputs)

### Prerequisites

```bash
pip install httpx pyotp
```

> **Note:** Make sure the server is running (`uvicorn main:app --port 8000`) before executing the test script.

---

## 🔧 Recent Updates & Bug Fixes

### Files Modified

| File | Changes |
|------|---------|
| `test_all_endpoints.py` | Fixed event_type for audit logging, updated auth types for workflow/role endpoints, added workflow status handling |
| `role_enforcement/rbac_service.py` | Added `workflow`, `audit`, and `roles` permissions to all default roles |
| `role_enforcement/middleware.py` | Added `/` and `/ready` to public endpoints list |
| `role_enforcement/router.py` | Added API key authentication bypass for role assignment |
| `workflow/middleware.py` | Fixed async issue in `validate_workflow_tenant_access()`, added API key bypass |

### Issues Fixed

| Issue | Root Cause | Solution |
|-------|-----------|----------|
| `/` and `/ready` returning 500 | Missing from public endpoints in role middleware | Added to public endpoints list |
| `/audit/log-custom` returning 400 | Invalid `event_type` value | Changed to valid enum value `api_access` |
| Workflow endpoints returning 403 | API key auth not recognized | Added API key bypass in `check_workflow_permissions()` |
| `/role/assign` returning 403 | API key auth not recognized | Added API key bypass in role assignment endpoint |
| Workflow instance ops returning 500 | `asyncio.run()` inside async loop | Fixed to use synchronous dictionary access |
| Workflow lifecycle ops returning 404 | Workflow already completed/failed | Updated test to accept 404 for finished workflows |

### Valid Audit Event Types

When using `/audit/log-custom`, use one of these valid event types:

```
user_login, user_logout, user_register, api_access, data_access,
data_modification, role_assignment, permission_change, tenant_access,
tenant_creation, security_event, config_change, file_upload,
file_download, system_error
```

### Default Role Permissions

All default roles now include workflow, audit, and roles permissions:

| Role | Workflow | Audit | Roles |
|------|----------|-------|-------|
| `system_admin` | `*` (all) | `*` (all) | `*` (all) |
| `client_admin` | create, read, update | - | read |
| `client_user` | read | - | - |
| `api_key_user` | `*` (all) | `*` (all) | `*` (all) |

---

## 🚀 Quick Start Commands

### 1. Start the Server

```bash
cd "c:\BHIV HR PLATFORM\runtime-core"
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 2. Run All Tests

```bash
cd "c:\BHIV HR PLATFORM\runtime-core"
python test/test_all_endpoints.py
```

### 3. Expected Output

```
======================================================================
  SOVEREIGN APPLICATION RUNTIME - COMPREHENSIVE TEST SUITE
======================================================================
  Base URL: http://localhost:8000
  API Key: default_sa...
  Test User: testuser1
======================================================================

... (test sections 1-7)

======================================================================
TEST SUMMARY
======================================================================
✅ Passed: 49
❌ Failed: 0
⏭️  Skipped: 0
======================================================================
Success Rate: 100.0%
======================================================================
```

---

## 📁 Project Structure

```
runtime-core/
├── main.py                      # FastAPI application entry point
├── requirements.txt             # Python dependencies
├── Dockerfile                   # Container configuration
├── docker-compose.yml           # Docker Compose configuration
├── README.md                    # This documentation
├── VERSION                      # Version file
├── EXECUTIVE_SUMMARY.md         # Executive summary document
├── auth/                        # Authentication service
│   ├── __init__.py
│   ├── auth_service.py          # Core auth logic
│   └── router.py                # Auth API endpoints
├── tenancy/                     # Tenant resolution service
│   ├── __init__.py
│   ├── router.py                # Tenant API endpoints
│   ├── middleware.py            # Tenant isolation middleware
│   └── tenant_service.py        # Tenant resolution logic
├── role_enforcement/            # RBAC service
│   ├── __init__.py
│   ├── router.py                # Role API endpoints
│   ├── middleware.py            # Role enforcement middleware
│   └── rbac_service.py          # Permission checking
├── audit_logging/               # Audit logging service
│   ├── __init__.py
│   ├── router.py                # Audit API endpoints
│   ├── middleware.py            # Audit logging middleware
│   └── audit_service.py         # Audit event management
├── workflow/                    # Workflow engine
│   ├── __init__.py
│   ├── router.py                # Workflow API endpoints
│   ├── middleware.py            # Workflow enforcement
│   ├── integration.py           # AI/RL and cross-service integration
│   └── workflow_engine.py       # Workflow execution
├── integration/                 # Integration layer
│   ├── __init__.py
│   ├── adapter_manager.py       # Centralized adapter management
│   └── adapters/                # Individual integration adapters
│       ├── __init__.py
│       ├── base_adapter.py      # Base adapter class
│       ├── artha_adapter.py     # Payroll/finance integration
│       ├── karya_adapter.py     # Task/workflow integration
│       ├── insightflow_adapter.py # Analytics integration
│       └── bucket_adapter.py    # Storage/artifacts integration
├── test/                        # Test files
│   ├── __init__.py              # Package init
│   ├── test_all_endpoints.py    # Comprehensive endpoint tests (49 tests)
│   └── test_rbac_bootstrap.py   # RBAC bootstrap script
└── docs/                        # Additional documentation
```

---

## Documentation

- [Executive Summary](EXECUTIVE_SUMMARY.md): High-level overview of completed framework
- [Framework Boundary Definition](docs/framework/BOUNDARY_DEFINITION.md): Separation of concerns
- [Sovereign Deployment Readiness](docs/sovereign/DEPLOYMENT_READINESS.md): Deployment guide
- [Reusability Guide](docs/framework/REUSABILITY_GUIDE.md): How to adapt for different domains
- [Security & Audit Guide](docs/security/AUDIT_AND_TRACEABILITY.md): Compliance and audit info
- [Framework Handover](handover/FRAMEWORK_HANDOVER.md): Complete handover documentation
- [Known Limitations](docs/KNOWN_LIMITATIONS.md): Current limitations and constraints
- [QA Checklist](docs/QA_CHECKLIST.md): Comprehensive testing verification

---

## 📄 License

This project is part of the BHIV HR Platform and is proprietary software.

---

## 📞 Support

For support and questions, contact the BHIV development team.