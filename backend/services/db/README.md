# Database Service

PostgreSQL schema and SQL scripts for the BHIV HR Platform backend.

---

## Overview
Defines the relational database schema for all HR platform operations, including candidates, jobs, feedback, interviews, and more. Used by backend services for persistent storage.

## Schema Structure
**Core Application Tables:**
- `candidates`: Candidate profiles and authentication
- `jobs`: Job postings (HR and client)
- `feedback`: 5-point BHIV values assessment
- `interviews`: Scheduling and management
- `offers`: Job offer management
- `users`: Internal HR users (with 2FA)
- `clients`: External client companies (JWT auth)
- `audit_logs`: Security and compliance
- `rate_limits`: API rate limiting
- `csp_violations`: Content Security Policy monitoring
- `matching_cache`: AI matching results cache
- `company_scoring_preferences`: RL/AI learning engine

**System Tables:**
- `client_auth`, `client_sessions`, `schema_version`, `pg_stat_statements`, `pg_stat_statements_info`

## Key Features
- Data validation with CHECK constraints
- 25+ performance indexes (GIN for full-text search)
- Triggers for audit logging and timestamps
- PostgreSQL functions for advanced operations

## Usage
- Used by backend microservices for persistent storage
- Schema managed via SQL scripts in this folder
- **Generated Columns**: Automatic average score calculation

## Local Development

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
