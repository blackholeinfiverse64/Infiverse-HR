# BHIV Application Framework - Reusability Guide

## Overview
This guide explains how to leverage the BHIV Application Framework (Sovereign Application Runtime) for building different types of applications beyond HR. The framework is designed to be reusable across multiple domains including CRM, ERP, Nyaya, Setu, and Design Tools.

## Framework Architecture

### Core Components
The framework consists of five main services that provide reusable infrastructure:

1. **Authentication Service** - Handles user authentication and session management
2. **Tenant Resolution Service** - Manages tenant identification and isolation  
3. **Role Enforcement Service** - Implements role-based access control
4. **Audit Logging Service** - Provides comprehensive audit trails
5. **Workflow Engine** - Automates business processes

### Reusable Elements

#### Authentication & Security
- JWT token management
- API key authentication
- Two-factor authentication (2FA)
- Password management and validation
- Rate limiting and security measures
- Session management

#### Multi-Tenancy
- Complete tenant isolation
- Cross-tenant access prevention
- Tenant context management
- Configurable isolation policies

#### Access Control
- Role-based permissions
- Predefined roles with granular permissions
- Dynamic role assignment
- Scope-based access control (tenant, system, global, own, public)

#### Audit & Compliance
- Comprehensive event tracking
- Provenance tracking for data modifications
- Multi-tenancy support for audit logs
- Flexible storage backends
- Search and analysis capabilities

#### Business Process Automation
- Reusable workflow definitions
- Task management with dependencies
- State management for workflows
- Multi-tenancy support for workflows

## Using the Framework for Different Domains

### 1. CRM Implementation

#### Entity Mapping
- **Contacts/Leads** → Generic entities with custom attributes
- **Opportunities** → Custom workflow definitions
- **Deals** → Custom audit events
- **Activities** → Workflow tasks

#### Implementation Steps
1. Define CRM-specific entity schemas
2. Create CRM-specific workflow definitions
3. Implement CRM-specific audit events
4. Customize UI to match CRM requirements
5. Map CRM roles to framework roles

```python
# Example CRM entity configuration
CRM_ENTITIES = {
    "contact": {
        "fields": ["name", "email", "phone", "company", "status"],
        "validation": {
            "email": {"required": True, "format": "email"},
            "phone": {"format": "phone"}
        }
    },
    "opportunity": {
        "fields": ["name", "value", "stage", "owner", "close_date"],
        "validation": {
            "value": {"type": "number", "min": 0},
            "stage": {"enum": ["prospect", "qualified", "proposal", "negotiation", "closed"]}
        }
    }
}
```

### 2. ERP Implementation

#### Entity Mapping
- **Employees** → Users with extended attributes
- **Departments** → Organizational units
- **Payroll** → Integrated with Artha adapter
- **Expenses** → Custom workflow processes

#### Implementation Steps
1. Leverage existing HR entities for employee data
2. Extend user profiles with ERP-specific attributes
3. Use Artha adapter for payroll integration
4. Create expense approval workflows
5. Implement financial audit requirements

```python
# Example ERP workflow definition
ERP_WORKFLOWS = {
    "expense_approval": {
        "tasks": [
            {"name": "submit_expense", "requires": []},
            {"name": "manager_approve", "requires": ["submit_expense"]},
            {"name": "finance_review", "requires": ["manager_approve"]},
            {"name": "process_payment", "requires": ["finance_review"]}
        ],
        "roles_required": {
            "submit_expense": ["employee"],
            "manager_approve": ["manager"],
            "finance_review": ["finance"],
            "process_payment": ["accountant"]
        }
    }
}
```

### 3. Nyaya (Legal/Law) Implementation

#### Entity Mapping
- **Cases** → Custom entities with legal attributes
- **Clients** → Contact entities with legal requirements
- **Documents** → Stored with Bucket adapter
- **Hearings** → Scheduled with custom workflows

#### Implementation Steps
1. Define legal-specific entity schemas
2. Implement document management with proper retention
3. Create case tracking workflows
4. Add legal compliance audit requirements
5. Implement privileged communication handling

### 4. Setu (Infrastructure/Project) Implementation

#### Entity Mapping
- **Projects** → Custom entities with project attributes
- **Tasks** → Workflow tasks with dependencies
- **Resources** → Inventory entities
- **Milestones** → Workflow checkpoints

#### Implementation Steps
1. Define project management entity schemas
2. Create project workflow templates
3. Implement resource allocation logic
4. Add project audit trails
5. Create milestone tracking mechanisms

## Integration Patterns

### Adapter System
The framework includes a pluggable adapter system for connecting with external systems:

```python
# Example adapter implementation
from integration.adapters.base_adapter import BaseIntegrationAdapter

class CustomAdapter(BaseIntegrationAdapter):
    def _execute_internal(self, event):
        # Handle domain-specific events
        if event.get('action') == 'custom_action':
            # Process custom logic
            result = self.process_custom_logic(event)
            return {
                'adapter': 'custom',
                'success': True,
                'result': result
            }
        return None
```

### Workflow Extension
Extend the workflow engine with domain-specific processes:

```python
# Example workflow extension
from workflow.workflow_engine import WorkflowDefinition

class CustomWorkflow(WorkflowDefinition):
    def __init__(self):
        super().__init__(
            name="custom_process",
            description="Custom business process",
            tasks=[
                "initiate_process",
                "perform_action",
                "review_result", 
                "finalize_process"
            ]
        )
    
    def initiate_process(self, context):
        # Domain-specific initiation logic
        pass
    
    def perform_action(self, context):
        # Domain-specific action logic
        pass
```

## Best Practices for Reusability

### 1. Configuration Over Code
- Use configuration files for domain-specific settings
- Avoid hardcoding domain-specific logic in framework code
- Implement feature flags for domain-specific functionality

### 2. Entity Abstraction
- Design generic entity systems that can accommodate domain-specific attributes
- Use metadata to define domain-specific behaviors
- Implement flexible schema validation

### 3. Role Mapping
- Map domain-specific roles to framework roles
- Use role inheritance for complex permission hierarchies
- Implement role-based UI customization

### 4. Event-Driven Architecture
- Use framework events for cross-domain communication
- Implement event handlers for domain-specific reactions
- Maintain audit trails for all cross-domain interactions

### 5. Tenant Isolation
- Ensure all domain-specific data respects tenant boundaries
- Implement tenant-aware custom entities
- Validate cross-tenant access at all levels

## Getting Started

### 1. Environment Setup
```bash
# Clone the framework
git clone <repository-url>
cd runtime-core

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### 2. Framework Initialization
```python
from main import app
import uvicorn

# The framework is ready to use
# Add your domain-specific endpoints/routes
app.include_router(your_domain_router, prefix="/api/v1/your-domain")
```

### 3. Domain-Specific Implementation
```python
# Create your domain-specific modules
# - entities: Define your domain entities
# - workflows: Create domain-specific workflows
# - adapters: Implement custom adapters if needed
# - api: Build domain-specific API endpoints
# - ui: Develop domain-specific user interfaces
```

### 4. Testing and Validation
- Use the framework's built-in testing capabilities
- Validate tenant isolation for your domain
- Test audit logging for domain-specific events
- Verify role-based access controls

## Performance Considerations

### Scalability
- The framework is designed to handle multiple tenants
- Use database indexing for custom entities
- Implement caching for frequently accessed data
- Monitor workflow execution performance

### Resource Management
- Implement proper connection pooling
- Use async operations where possible
- Monitor memory usage with multiple domains
- Plan for horizontal scaling

## Security Guidelines

### Data Protection
- Encrypt sensitive domain-specific data
- Implement proper access controls
- Validate all inputs thoroughly
- Use parameterized queries to prevent injection

### Compliance
- Maintain audit trails for all operations
- Implement data retention policies
- Support right to deletion requirements
- Ensure compliance with regional regulations

## Troubleshooting

### Common Issues
- **Tenant Isolation Problems**: Verify tenant_id is passed correctly in all requests
- **Role Access Issues**: Check role assignments and permissions mapping
- **Workflow Failures**: Review workflow definitions and dependencies
- **Performance Problems**: Check database indexes and connection pools

### Debugging
- Enable detailed logging for troubleshooting
- Monitor audit logs for access patterns
- Use framework health checks to verify components
- Check adapter status for integration issues

## Migration Considerations

### From Existing Systems
- Plan gradual migration of data and functionality
- Maintain backward compatibility during transition
- Test tenant isolation with migrated data
- Validate audit trails for migrated operations

### Multi-Domain Deployment
- Plan for resource allocation across domains
- Consider database partitioning strategies
- Implement domain-specific monitoring
- Plan for domain-specific scaling needs

---

**Document Version**: 1.0  
**Last Updated**: January 17, 2026  
**Owner**: BHIV Development Team  
**Review Cycle**: Quarterly