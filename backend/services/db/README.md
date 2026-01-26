# Database Service

PostgreSQL schema and SQL scripts for the BHIV HR Platform backend.

---

## Overview
The Database Service defines the comprehensive PostgreSQL schema for all HR platform operations, including candidates, jobs, feedback, interviews, AI learning engine, and more. The schema serves as the central data repository for all backend microservices, providing persistent storage with robust security, performance, and audit capabilities.

## Schema Structure
The database includes the following core application tables:

### Core Application Tables
- `candidates`: Candidate profiles and authentication with 2FA support
- `jobs`: Job postings for HR and client companies
- `feedback`: 5-point BHIV values assessment (Integrity, Honesty, Discipline, Hard Work, Gratitude)
- `interviews`: Interview scheduling and management
- `offers`: Job offer management and tracking
- `users`: Internal HR users with 2FA and role-based access control
- `clients`: External client companies with JWT authentication
- `job_applications`: Candidate job application tracking

### AI & Machine Learning Tables
- `matching_cache`: AI matching results cache for performance optimization
- `company_scoring_preferences`: Reinforcement learning/AI learning engine
- `rl_predictions`: Reinforcement learning predictions and scoring
- `rl_feedback`: Feedback and reward signals for RL engine
- `rl_model_performance`: RL model performance tracking
- `rl_training_data`: Training data for reinforcement learning

### Security & Audit Tables
- `audit_logs`: Comprehensive security and compliance logging
- `rate_limits`: API rate limiting and throttling
- `csp_violations`: Content Security Policy monitoring

### Workflow Management Tables
- `workflows`: LangGraph workflow tracking and management

### System Tables
- `client_auth`, `client_sessions`, `schema_version`, `pg_stat_statements`, `pg_stat_statements_info`

## Key Features
- **Data Validation:** Comprehensive CHECK constraints for data integrity
- **Performance Indexes:** 30+ performance indexes including GIN for full-text search
- **Audit Triggers:** Automated triggers for audit logging and timestamp updates
- **Generated Columns:** Automatic average score calculation and computed fields
- **PostgreSQL Functions:** Advanced operations and business logic
- **Security Features:** Row-level security, encryption, and access controls
- **2FA Support:** Built-in support for two-factor authentication
- **Full-Text Search:** Advanced search capabilities using pg_trgm extension

## Authentication & Security Implementation
- **Role-Based Access Control:** Fine-grained permissions for different user roles
- **Password Security:** Bcrypt-hashed passwords with automatic salting
- **2FA Integration:** Support for TOTP-based two-factor authentication
- **Audit Trail:** Comprehensive logging of all data changes and access
- **Rate Limiting:** Built-in rate limiting to prevent abuse
- **CSP Violation Tracking:** Content Security Policy violation monitoring

## Database Integration
- **Microservice Architecture:** Schema designed for use with multiple backend services
- **Connection Pooling:** Optimized for use with connection pooling solutions
- **Scalability:** Designed for horizontal scaling and partitioning
- **Backup & Recovery:** Structured for automated backup and disaster recovery
- **Monitoring:** Built-in performance and usage monitoring

## Configuration Requirements
The database requires the following extensions to be enabled:
- `uuid-ossp` - UUID generation functions
- `pg_stat_statements` - Query performance monitoring
- `pg_trgm` - Full-text search capabilities

## Deployment Instructions
### Local Development
```bash
# Using Docker
docker run -d --name bhiv-db \
  -e POSTGRES_DB=bhiv_hr \
  -e POSTGRES_USER=bhiv_user \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:17-alpine

# Initialize schema
psql postgresql://bhiv_user:password@localhost:5432/bhiv_hr -f consolidated_schema.sql
```

### Production Deployment
```bash
# Initialize with production settings
docker run -d --name bhiv-prod-db \
  -e POSTGRES_DB=bhiv_hr_prod \
  -e POSTGRES_USER=bhiv_user \
  -e POSTGRES_PASSWORD=secure_password \
  -e POSTGRES_INITDB_ARGS="--auth-host=scram-sha-256" \
  -v /path/to/data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:17-alpine

# Apply schema
psql postgresql://bhiv_user:secure_password@localhost:5432/bhiv_hr_prod -f consolidated_schema.sql
```

## Dependencies
- `postgresql:17-alpine` - PostgreSQL database server
- `pg_stat_statements` - Query performance extension
- `pg_trgm` - Text similarity extension
- `uuid-ossp` - UUID generation extension

## Integration Points
- **Gateway Service:** Primary integration point for all database operations
- **AI Agent Service:** Access to matching cache and learning data
- **LangGraph Service:** Workflow state and tracking data
- **All Portal Services:** Indirect access through Gateway API

## Error Handling & Monitoring
- **Constraint Validation:** Comprehensive constraint checking for data integrity
- **Transaction Management:** ACID-compliant transactions with rollback support
- **Connection Handling:** Robust connection management with retry logic
- **Performance Monitoring:** Built-in query performance tracking
- **Security Monitoring:** Audit trail for security events

## Backup and Maintenance
- **Schema Versioning:** Automatic schema version tracking with migration support
- **Performance Tuning:** Optimized for high-volume transaction processing
- **Index Management:** Regular maintenance and optimization of indexes
- **Statistics Collection:** Automatic collection of table and index statistics
