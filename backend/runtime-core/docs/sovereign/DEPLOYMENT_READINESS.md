# Sovereign Deployment Readiness Guide

## Required Environment Variables
- DATABASE_URL
- JWT_SECRET
- TENANT_CONFIG
- REGION (KSA/UAE/IN)
- AI_SERVICE_ENDPOINT (optional, for AI/RL integration)
- RL_SERVICE_API_KEY (optional, for reinforcement learning)
- etc.

## Deployment Steps
1. Clone repository
2. Set environment variables (including optional AI/RL service endpoints)
3. Run database migrations
4. Start core services
5. Optionally start AI/RL integration services
6. Verify health checks for all services
7. Test AI/RL integration endpoints if enabled

## Regional Configurations
- KSA: Data residency rules
- UAE: Encryption requirements
- India: DPDPA compliance

## No BHIV Dependencies
- No hardcoded BHIV URLs
- No BHIV-specific infrastructure required
- Works standalone

---

**Created:** January 10, 2026  
**Status:** Template created, needs detailed configuration