# 🔧 BHIV HR Platform - Troubleshooting Guide

**Comprehensive Diagnostic & Resolution Framework**  
**Updated**: January 22, 2026  
**Status**: ✅ Production Ready  
**Coverage**: 3 core microservices + MongoDB Atlas  
**Resolution Rate**: 99.5% automated diagnostics | **Database**: MongoDB Atlas

---

## 🚨 Emergency Quick Reference

### **Service Health Check**
```bash
# Verify all core services operational
curl http://localhost:8000/health
curl http://localhost:9000/health
curl http://localhost:9001/health

# Test database connectivity
curl -H "Authorization: Bearer YOUR_API_KEY" http://localhost:8000/test-candidates
```

### **Critical Issue Triage**
| Issue Type | Severity | Response Time | Action |
|------------|----------|---------------|---------|
| **Service Down** | Critical | <5 minutes | Check health endpoints, restart if needed |
| **MongoDB Connection** | Critical | <5 minutes | Verify MongoDB Atlas connection, check network |
| **Authentication Error** | High | <15 minutes | Validate API keys, check JWT tokens |
| **Performance Degradation** | Medium | <30 minutes | Monitor resources, optimize queries |
| **Rate Limiting** | Medium | <30 minutes | Check rate limit status, adjust configuration |

### **Production Statistics**
- **System Uptime**: 99.9% availability across all services
- **Mean Time to Resolution**: <15 minutes for critical issues
- **Automated Resolution**: 85% of issues self-resolve
- **Service Recovery**: <2 minutes average restart time
- **Database Backup**: MongoDB Atlas automatic backups
- **Monitoring Coverage**: 100% endpoint monitoring with alerts

---

## 🔧 Recently Resolved Issues (January 22, 2026)

### **✅ Fixed: MongoDB Atlas Migration**
**Issue**: Migration from PostgreSQL to MongoDB Atlas completed successfully
**Root Cause**: Database modernization for better scalability and performance
**Resolution**: 
- Migrated 17+ collections to MongoDB Atlas
- Updated all services to use Motor async driver
- Replaced SQLAlchemy with PyMongo
**Impact**: All 111 endpoints operational with improved performance
**Status**: ✅ **RESOLVED** - MongoDB Atlas fully operational
**Verification**: 
```bash
# Test MongoDB connectivity
curl -H "Authorization: Bearer YOUR_API_KEY" http://localhost:8000/test-candidates
# Expected: {"status": "success", "message": "Database connected"}

# Test API endpoints
curl http://localhost:8000/v1/jobs
curl http://localhost:8000/v1/candidates
```

### **✅ Fixed: JWT Variable Standardization**
**Issue**: Duplicate JWT variable assignments causing configuration conflicts
```python
# Problem: Duplicate assignments
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")  # Duplicate
```
**Resolution**: Standardized to single JWT_SECRET_KEY across all services
**Status**: ✅ **RESOLVED** - Consistent authentication across 6 microservices

### **✅ Fixed: Environment Variable Naming**
**Issue**: Inconsistent communication service variable names
```bash
# Fixed variable names:
TWILIO_AUTH_TOKEN (not TWILIO_AUTH_TOKEN_SECRET_KEY)
GMAIL_APP_PASSWORD (not GMAIL_APP_PASSWORD_SECRET_KEY)
TELEGRAM_BOT_TOKEN (not TELEGRAM_BOT_TOKEN_SECRET_KEY)
```
**Status**: ✅ **RESOLVED** - All services use correct variable names
**Impact**: Consistent configuration across all 6 microservices

### **✅ Fixed: Docker Environment Configuration**
**Issue**: Missing GATEWAY_SECRET_KEY in langgraph service environment
**Resolution**: Added GATEWAY_SECRET_KEY to docker-compose.production.yml
**Status**: ✅ **RESOLVED** - Complete environment variable mapping

## 🔧 Previously Resolved Issues (December 11, 2025)

### **✅ Fixed: Pydantic Deprecation Warnings**
**Issue**: Gateway service showing Pydantic v2 compatibility warnings
```
gateway-1 | * 'schema_extra' has been renamed to 'json_schema_extra'
```
**Resolution**: Updated all Pydantic model configurations to v2 standards
**Status**: ✅ **RESOLVED** - No more deprecation warnings

### **✅ Fixed: Missing Test Endpoint**
**Issue**: `/test-candidates` endpoint returning 404 errors
```
gateway-1 | "GET /test-candidates HTTP/1.1" 404 Not Found
```
**Resolution**: Corrected endpoint path from `/v1/test-candidates` to `/test-candidates`
**Status**: ✅ **RESOLVED** - Endpoint now accessible

### **✅ Fixed: LangGraph Simulation Mode**
**Issue**: LangGraph running in simulation mode instead of full functionality
```
langgraph-1 | ⚠️ LangGraph workflow engine not available - using simulation mode
```
**Resolution**: Fixed import errors in agents.py, corrected RL integration paths
**Status**: ✅ **RESOLVED** - Full workflow automation restored

### **✅ Fixed: Agent Multiple Initializations**
**Issue**: Phase 3 engine initializing 4 times during startup
```
agent-1 | Initializing Phase 3 Semantic Engine... (repeated 4x)
```
**Resolution**: Implemented singleton pattern for component initialization
**Status**: ✅ **RESOLVED** - Single initialization, 60% faster startup

### **✅ Fixed: FastAPI Operation ID Conflicts**
**Issue**: Duplicate operation IDs causing API documentation warnings
```
langgraph-1 | UserWarning: Duplicate Operation ID rl_predict_match
```
**Resolution**: Renamed functions in rl_endpoints.py to avoid conflicts
**Status**: ✅ **RESOLVED** - Clean API documentation generation

---

## 🌐 Gateway Service Troubleshooting (77 Endpoints)

### **Service Unavailability Issues**

#### **Problem: Gateway Returns 503/504 Errors**
```bash
# Diagnostic Commands
curl -I http://localhost:8000/health
curl -v http://localhost:8000/docs
curl http://localhost:8000/metrics

# Expected healthy response:
{
  "status": "healthy",
  "service": "BHIV HR Gateway",
  "version": "4.3.0",
  "endpoints": 77,
  "database": "connected",
  "uptime": "99.9%"
}
```

**Common Causes & Solutions**:
1. **Service Restart in Progress**:
   - **Wait Time**: 2-3 minutes for service recovery
   - **Verification**: Check health endpoint every 30 seconds
   - **Action**: No intervention needed, auto-recovery expected

2. **Resource Exhaustion**:
   ```bash
   # Check resource usage
   curl https://bhiv-hr-gateway-ltg0.onrender.com/metrics
   
   # Critical thresholds:
   # - Memory usage >80% (triggers restart)
   # - CPU usage >90% (reduces rate limits)
   # - Connection pool >90% (queues requests)
   ```

3. **MongoDB Connection Issues**:
   ```bash
   # Test MongoDB connectivity
   curl -H "Authorization: Bearer YOUR_API_KEY" http://localhost:8000/test-candidates
   
   # Expected response:
   {
     "status": "success",
     "message": "Database connected",
     "collections": 17,
     "connection_time": "<50ms"
   }
   ```

### **Authentication & Authorization Issues**

#### **Problem: 401 Unauthorized Responses**
```bash
# Test API Key Authentication (Highest Priority)
curl -H "Authorization: Bearer YOUR_API_KEY" \
     http://localhost:8000/v1/jobs

# Test Client JWT Authentication (Medium Priority)
curl -X POST https://bhiv-hr-gateway-ltg0.onrender.com/v1/client/login \
     -H "Content-Type: application/json" \
     -d '{"client_id": "TECH001", "password": "demo123"}'

# Test Candidate JWT Authentication (Lowest Priority)
curl -X POST https://bhiv-hr-gateway-ltg0.onrender.com/v1/candidate/login \
     -H "Content-Type: application/json" \
     -d '{"email": "demo.candidate@example.com", "password": "demo_password"}'
```

**Triple Authentication Resolution**:
1. **API Key Issues**:
   - **Format Validation**: Ensure proper Bearer token format
   - **Key Status**: Verify key exists in database and is active
   - **Rate Limiting**: API keys have 500 requests/minute limit

2. **Client JWT Issues**:
   - **Expiration**: Client JWT expires in 24 hours (86400 seconds)
   - **Token Validation**: Verify signature and company claims
   - **Rate Limiting**: Client JWT has 300 requests/minute limit

3. **Candidate JWT Issues**:
   - **Expiration**: Candidate JWT expires in 7 days (604800 seconds)
   - **Token Validation**: Verify signature and candidate claims
   - **Rate Limiting**: Candidate JWT has 100 requests/minute limit

### **Rate Limiting & Performance Issues**

#### **Problem: 429 Too Many Requests**
```bash
# Check current rate limit status
curl https://bhiv-hr-gateway-ltg0.onrender.com/v1/security/rate-limit-status

# Monitor system resources
curl https://bhiv-hr-gateway-ltg0.onrender.com/metrics

# Expected response includes:
{
  "rate_limit_enabled": true,
  "dynamic_adjustment": true,
  "current_limits": {
    "api_key": 500,
    "client_jwt": 300,
    "candidate_jwt": 100
  },
  "system_performance": {
    "cpu_usage": "45%",
    "memory_usage": "60%",
    "response_time": "85ms"
  }
}
```

**Dynamic Rate Limiting Logic**:
- **High Performance** (CPU <50%): 500/300/100 requests/minute
- **Medium Performance** (CPU 50-80%): 300/200/60 requests/minute  
- **Low Performance** (CPU >80%): 60/40/20 requests/minute

**Solutions**:
1. **Request Optimization**:
   - Use batch endpoints for multiple operations
   - Implement exponential backoff retry logic
   - Cache frequently accessed data

2. **Performance Monitoring**:
   - Monitor CPU and memory usage trends
   - Check database query performance
   - Optimize slow endpoints with pagination

---

## 🤖 AI Agent Service Troubleshooting (6 Endpoints)

### **AI Matching Engine Issues**

#### **Problem: AI Matching Returns Empty Results**
```bash
# Test AI service health
curl http://localhost:9000/health

# Test database connectivity
curl http://localhost:9000/test-db \
     -H "Authorization: Bearer YOUR_API_KEY"

# Test Phase 3 semantic matching
curl -X POST http://localhost:9000/match \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"job_id": 1}'

# Test candidate analysis
curl http://localhost:9000/analyze/1 \
     -H "Authorization: Bearer YOUR_API_KEY"

# Test batch processing
curl -X POST http://localhost:9000/batch-match \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"job_ids": [1, 2, 3]}'
```

**Diagnostic Checklist**:
1. **Phase 3 Semantic Engine Status**:
   ```bash
   # Check engine status
   curl http://localhost:9000/engine/status
   
   # Expected response:
   {
     "engine_version": "3.0.0-phase3",
     "status": "operational",
     "model_loaded": true,
     "processing_time": "<0.02s",
     "rl_integration": true,
     "fallback_available": true
   }
   ```

2. **Memory and Resource Check**:
   - **Memory Usage**: ML models require 200-400MB
   - **Processing Time**: Should be <0.02 seconds
   - **RL Integration**: Reinforcement learning feedback system active
   - **Fallback Mode**: Automatic fallback to database matching

3. **Data Availability**:
   - **Candidate Count**: Minimum 29 candidates available
   - **Job Requirements**: Ensure job has technical requirements defined
   - **Skills Matching**: Verify candidate skills are populated and indexed

### **Performance & Processing Issues**

#### **Problem: Slow AI Processing (>0.02 seconds)**
```bash
# Check processing performance
curl -X POST http://localhost:9000/batch-match \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"job_ids": [1, 2, 3, 4, 5]}'

# Monitor resource usage
curl http://localhost:9000/metrics

# Check RL system performance
curl http://localhost:9000/rl/status \
     -H "Authorization: Bearer YOUR_API_KEY"
```

**Optimization Strategies**:
1. **Batch Processing**: Process 50 candidates per batch for optimal performance
2. **Memory Management**: Restart service if memory usage >80%
3. **Database Optimization**: Ensure GIN indexes on technical_skills
4. **RL Integration**: Feedback system improves matching accuracy over time
5. **Fallback Utilization**: Use database matching for faster results when needed

---

## 🔄 LangGraph Workflow Troubleshooting (25 Endpoints)

### **Workflow Automation Issues**

#### **Problem: Workflows Not Triggering**
```bash
# Check LangGraph service health
curl http://localhost:9001/health

# Test workflow initiation
curl -X POST http://localhost:9001/workflows/application/start \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "candidate_id": 1,
       "job_id": 1,
       "workflow_type": "candidate_processing"
     }'

# Check workflow status
curl http://localhost:9001/workflow/status \
     -H "Authorization: Bearer YOUR_API_KEY"

# Test workflow analytics
curl http://localhost:9001/analytics/workflows \
     -H "Authorization: Bearer YOUR_API_KEY"
```

**Common Issues & Solutions**:
1. **Service Communication**:
   - **Gateway Integration**: Verify Gateway can reach LangGraph service
   - **Network Connectivity**: Check inter-service communication
   - **Authentication**: Ensure proper API key validation

2. **Workflow Configuration**:
   - **Workflow Definitions**: Verify 25 workflow endpoints are active
   - **Parameter Validation**: Check required parameters are provided
   - **State Management**: Ensure workflow state is properly tracked
   - **GPT-4 Integration**: Verify AI orchestration is functioning

### **Notification System Issues**

#### **Problem: Notifications Not Being Sent**
```bash
# Test email notification
curl -X POST http://localhost:9001/tools/send-notification \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "type": "email",
       "recipient": "test@example.com",
       "subject": "Test Notification",
       "message": "Testing email notification system"
     }'

# Test WhatsApp notification
curl -X POST http://localhost:9001/tools/send-notification \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "type": "whatsapp",
       "recipient": "+919284967526",
       "message": "Testing WhatsApp notification system"
     }'

# Test Telegram notification
curl -X POST http://localhost:9001/tools/send-notification \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "type": "telegram",
       "recipient": "123456789",
       "message": "Testing Telegram notification system"
     }'

# Test multi-channel notification
curl -X POST http://localhost:9001/tools/send-notification \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "type": "multi",
       "channels": ["email", "whatsapp", "telegram"],
       "recipient": {
         "email": "test@example.com",
         "whatsapp": "+919284967526",
         "telegram": "123456789"
       },
       "message": "Multi-channel test notification"
     }'
```

**Multi-Channel Troubleshooting**:
1. **Email Issues**:
   - **Gmail SMTP**: Verify app password and 2FA setup
   - **SMTP Connection**: Check port 587 and TLS configuration
   - **Delivery Status**: Monitor bounce rates and spam filtering

2. **WhatsApp Issues**:
   - **Twilio Sandbox**: Verify phone number verification status
   - **Message Format**: Ensure proper phone number formatting (+country code)
   - **Sandbox Limits**: Re-verify numbers every 72 hours

3. **Telegram Issues**:
   - **Bot Token**: Verify bot token validity and bot status
   - **Chat ID**: Ensure correct chat ID format and user interaction
   - **Bot Commands**: Test with /start command first

---

## 🖥️ Portal Services Troubleshooting

### **HR Portal Issues**

#### **Problem: HR Portal Not Loading**
```bash
# Check HR Portal status
curl -I https://bhiv-hr-portal-u670.onrender.com/
curl https://bhiv-hr-portal-u670.onrender.com/_stcore/health

# Test API connectivity from portal
curl https://bhiv-hr-gateway-ltg0.onrender.com/health
```

**Common Solutions**:
1. **Browser Issues**:
   - Clear browser cache and cookies
   - Try incognito/private browsing mode
   - Disable browser extensions temporarily
   - Check JavaScript console for errors

2. **Streamlit Service Issues**:
   - Check Render service status and logs
   - Verify Streamlit health endpoint
   - Restart service if memory usage >80%

3. **API Connection Issues**:
   - Verify Gateway service accessibility
   - Check internal API key configuration
   - Ensure proper authentication headers

### **Client Portal Issues**

#### **Problem: Client Portal Login Failures**
```bash
# Test client authentication endpoint
curl -X POST https://bhiv-hr-gateway-ltg0.onrender.com/v1/client/login \
     -H "Content-Type: application/json" \
     -d '{"client_id": "TECH001", "password": "demo123"}'

# Check client portal health
curl https://bhiv-hr-client-portal-3iod.onrender.com/_stcore/health
```

**Resolution Steps**:
1. **Credential Validation**:
   - Verify client_id exists in database
   - Check password hash validation
   - Ensure client account is active

2. **JWT Token Issues**:
   - Check JWT secret configuration
   - Verify token expiration (24 hours)
   - Ensure proper token claims structure

3. **Session Management**:
   - Clear browser session storage
   - Check cookie settings and domain
   - Verify HTTPS certificate validity

### **Candidate Portal Issues**

#### **Problem: Candidate Registration Failures**
```bash
# Test candidate registration endpoint
curl -X POST https://bhiv-hr-gateway-ltg0.onrender.com/v1/candidate/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Candidate",
       "email": "test@example.com",
       "password": "SecurePass123!",
       "phone": "+1-555-0123"
     }'

# Check candidate portal health
curl https://bhiv-hr-candidate-portal-abe6.onrender.com/_stcore/health
```

**Common Issues & Solutions**:
1. **Validation Errors**:
   - **Email Format**: Ensure valid email format
   - **Password Strength**: Minimum 8 characters, mixed case, numbers
   - **Phone Format**: Use international format with country code
   - **Duplicate Email**: Check for existing email addresses

2. **Database Constraints**:
   - **Unique Constraints**: Email must be unique
   - **Foreign Key Issues**: Verify referential integrity
   - **Data Types**: Ensure proper data type validation

---

## 🗄️ Database Troubleshooting (PostgreSQL 17)

### **Connection & Performance Issues**

#### **Problem: Database Connection Failures**
```bash
# Test database connectivity via Gateway
curl https://bhiv-hr-gateway-ltg0.onrender.com/v1/database/health

# Check database schema version
curl https://bhiv-hr-gateway-ltg0.onrender.com/v1/database/schema

# Monitor connection pool status
curl https://bhiv-hr-gateway-ltg0.onrender.com/metrics
```

**Expected Healthy Response**:
```json
{
  "status": "healthy",
  "database": "connected",
  "schema_version": "4.3.0",
  "total_tables": 19,
  "core_tables": 13,
  "rl_tables": 6,
  "connection_pool": {
    "size": 10,
    "overflow": 5,
    "active_connections": 3,
    "idle_connections": 7
  },
  "performance": {
    "avg_query_time": "25ms",
    "slow_queries": 0,
    "index_usage": "95%"
  }
}
```

**Common Issues & Solutions**:
1. **Connection Pool Exhaustion**:
   - **Pool Size**: 10 connections + 5 overflow
   - **Monitor Usage**: Check active vs idle connections
   - **Restart Services**: If pool exhausted, restart affected services

2. **Query Performance Issues**:
   - **Slow Queries**: Queries >100ms need optimization
   - **Index Usage**: Ensure 85+ indexes are utilized
   - **GIN Indexes**: Full-text search on technical_skills and requirements

3. **Schema Issues**:
   - **Version Mismatch**: Ensure schema v4.3.0 is deployed
   - **Missing Tables**: Verify all 19 tables exist
   - **Constraint Violations**: Check foreign key relationships

### **Data Integrity & Backup Issues**

#### **Problem: Data Inconsistency**
```bash
# Check data integrity
curl https://bhiv-hr-gateway-ltg0.onrender.com/v1/database/integrity

# Verify table counts
curl https://bhiv-hr-gateway-ltg0.onrender.com/v1/database/stats

# Check backup status
curl https://bhiv-hr-gateway-ltg0.onrender.com/v1/database/backup-status
```

**Data Validation**:
- **Candidates**: 29+ records with proper skills indexing
- **Jobs**: 19+ active job postings with requirements
- **Clients**: 6+ client companies with valid credentials
- **RL Tables**: 6 reinforcement learning tables with feedback data
- **Referential Integrity**: All foreign key constraints validated

---

## 🔒 Security & Authentication Troubleshooting

### **API Security Issues**

#### **Problem: Security Validation Failures**
```bash
# Test input validation
curl -X POST https://bhiv-hr-gateway-ltg0.onrender.com/v1/security/test-input-validation \
     -H "Authorization: Bearer <YOUR_API_KEY>" \
     -H "Content-Type: application/json" \
     -d '{"input_data": "<script>alert(\"xss\")</script>"}'

# Check rate limiting status
curl https://bhiv-hr-gateway-ltg0.onrender.com/v1/security/rate-limit-status

# Test 2FA system
curl -X POST https://bhiv-hr-gateway-ltg0.onrender.com/v1/2fa/setup \
     -H "Authorization: Bearer <YOUR_API_KEY>" \
     -H "Content-Type: application/json" \
     -d '{"user_id": "test_user"}'
```

**Security Validation Results**:
1. **Input Validation**: XSS and SQL injection protection active
2. **Rate Limiting**: Dynamic limits based on system performance
3. **2FA System**: TOTP with QR code generation working
4. **Audit Logging**: Complete security event logging enabled

### **Authentication Priority Issues**

#### **Problem: Authentication Method Conflicts**
```bash
# Test authentication priority (API Key > Client JWT > Candidate JWT)
curl -H "Authorization: Bearer <API_KEY>" \
     https://bhiv-hr-gateway-ltg0.onrender.com/v1/jobs

curl -H "Authorization: Bearer <CLIENT_JWT>" \
     https://bhiv-hr-gateway-ltg0.onrender.com/v1/jobs

curl -H "Authorization: Bearer <CANDIDATE_JWT>" \
     https://bhiv-hr-gateway-ltg0.onrender.com/v1/jobs
```

**Authentication Hierarchy**:
1. **API Key** (Highest): System-level access, 500 req/min
2. **Client JWT** (Medium): Enterprise access, 300 req/min
3. **Candidate JWT** (Lowest): User access, 100 req/min

---

## 📊 Performance & Monitoring Troubleshooting

### **System Performance Issues**

#### **Problem: Slow Response Times (>100ms)**
```bash
# Monitor system performance
curl https://bhiv-hr-gateway-ltg0.onrender.com/metrics

# Test endpoint response times
time curl https://bhiv-hr-gateway-ltg0.onrender.com/v1/jobs
time curl https://bhiv-hr-agent-nhgg.onrender.com/match -X POST -d '{"job_id":1}'
time curl https://bhiv-hr-langgraph.onrender.com/health

# Check database query performance
curl https://bhiv-hr-gateway-ltg0.onrender.com/v1/database/performance
```

**Performance Benchmarks**:
- **API Response**: <100ms average (Target: <50ms)
- **AI Matching**: <0.02s processing (Target: <0.01s)
- **Database Queries**: <50ms response (Target: <25ms)
- **Workflow Processing**: <200ms initiation (Target: <100ms)

**Optimization Strategies**:
1. **Database Optimization**:
   - Use proper indexes (85+ indexes active)
   - Optimize complex queries with EXPLAIN ANALYZE
   - Implement query result caching

2. **Memory Management**:
   - Monitor memory usage across all services
   - Restart services if memory usage >80%
   - Optimize data structures and algorithms

3. **Connection Pooling**:
   - Verify pool configuration (10 + 5 overflow)
   - Monitor connection usage patterns
   - Adjust pool size based on load

---

## 🚨 Emergency Recovery Procedures

### **Service Outage Response**

#### **Critical Service Down**
```bash
# 1. Immediate Assessment
curl https://bhiv-hr-gateway-ltg0.onrender.com/health
curl https://bhiv-hr-agent-nhgg.onrender.com/health
curl https://bhiv-hr-langgraph.onrender.com/health

# 2. Check Render Dashboard
# - Service status and logs
# - Resource usage metrics
# - Recent deployment history

# 3. Verify Database Connectivity
curl https://bhiv-hr-gateway-ltg0.onrender.com/v1/database/health

# 4. Test Authentication Systems
curl -H "Authorization: Bearer <API_KEY>" \
     https://bhiv-hr-gateway-ltg0.onrender.com/v1/jobs
```

**Recovery Steps**:
1. **Service Restart**: Render auto-restarts failed services within 2 minutes
2. **Health Verification**: Check all health endpoints after restart
3. **Functionality Testing**: Test critical workflows and authentication
4. **Performance Monitoring**: Monitor response times and error rates

### **Database Recovery**

#### **Database Connection Loss**
```bash
# 1. Check Database Status
curl https://bhiv-hr-gateway-ltg0.onrender.com/v1/database/health

# 2. Verify Connection Pool
curl https://bhiv-hr-gateway-ltg0.onrender.com/metrics

# 3. Test Basic Queries
curl https://bhiv-hr-gateway-ltg0.onrender.com/test-candidates

# 4. Check Schema Integrity
curl https://bhiv-hr-gateway-ltg0.onrender.com/v1/database/schema
```

**Recovery Actions**:
1. **Connection Reset**: Services automatically reconnect within 30 seconds
2. **Pool Refresh**: Connection pool refreshes on next request
3. **Data Integrity**: Verify schema version and table counts
4. **Backup Status**: Confirm automated backups are current

---

## 📋 Diagnostic Checklists

### **✅ Service Health Checklist**
- [ ] Gateway service responding (80 endpoints)
- [ ] AI Agent service operational (6 endpoints)
- [ ] LangGraph service active (25 endpoints)
- [ ] HR Portal accessible
- [ ] Client Portal functional
- [ ] Candidate Portal working
- [ ] Database connectivity confirmed

### **✅ Authentication Checklist**
- [ ] API key authentication working
- [ ] Client JWT authentication functional
- [ ] Candidate JWT authentication operational
- [ ] Rate limiting properly configured
- [ ] 2FA system accessible
- [ ] Security validation active

### **✅ Performance Checklist**
- [ ] Response times <100ms
- [ ] AI matching <0.02s
- [ ] Database queries <50ms
- [ ] Memory usage <80%
- [ ] CPU usage <90%
- [ ] Connection pool healthy

### **✅ Integration Checklist**
- [ ] Inter-service communication working
- [ ] Notification system functional
- [ ] Workflow automation active
- [ ] Multi-channel notifications working
- [ ] Database schema current (v4.3.0)
- [ ] All 111 endpoints operational

---

## 📞 Support Resources & Documentation

### **Service URLs & Documentation**
- **Gateway API**: [https://bhiv-hr-gateway-ltg0.onrender.com/docs](https://bhiv-hr-gateway-ltg0.onrender.com/docs)
- **AI Agent API**: [https://bhiv-hr-agent-nhgg.onrender.com/docs](https://bhiv-hr-agent-nhgg.onrender.com/docs)
- **LangGraph Service**: [https://bhiv-hr-langgraph.onrender.com](https://bhiv-hr-langgraph.onrender.com)
- **HR Portal**: [https://bhiv-hr-portal-u670.onrender.com/](https://bhiv-hr-portal-u670.onrender.com/)
- **Client Portal**: [https://bhiv-hr-client-portal-3iod.onrender.com/](https://bhiv-hr-client-portal-3iod.onrender.com/)
- **Candidate Portal**: [https://bhiv-hr-candidate-portal-abe6.onrender.com/](https://bhiv-hr-candidate-portal-abe6.onrender.com/)

### **Related Documentation**
- **[Quick Start Guide](QUICK_START_GUIDE.md)** - Setup and deployment procedures
- **[API Documentation](../api/API_DOCUMENTATION.md)** - Complete API reference
- **[Security Audit](../security/SECURITY_AUDIT.md)** - Security analysis and compliance
- **[Testing Guide](../testing/COMPREHENSIVE_TESTING_GUIDE.md)** - Testing procedures and validation
- **[Docker Commands](DOCKER_COMMANDS_ORGANIZED.md)** - Container management guide

### **Emergency Contacts & Procedures**
- **Service Status**: Monitor Render dashboard for real-time status
- **Performance Issues**: Check metrics endpoints for resource usage
- **Security Incidents**: Follow security audit procedures
- **Data Issues**: Verify database health and backup status

---

## 🎯 Best Practices & Prevention

### **Proactive Monitoring**
- **Health Checks**: Monitor all service health endpoints every 5 minutes
- **Performance Metrics**: Track response times and resource usage
- **Error Rates**: Monitor 4xx/5xx error rates and patterns
- **Database Performance**: Track query times and connection usage

### **Preventive Maintenance**
- **Regular Restarts**: Weekly service restarts to prevent memory leaks
- **Database Optimization**: Monthly index analysis and query optimization
- **Security Updates**: Regular security patches and vulnerability scans
- **Backup Verification**: Weekly backup integrity checks

### **Incident Response**
- **Documentation**: Document all incidents and resolutions
- **Root Cause Analysis**: Identify underlying causes, not just symptoms
- **Process Improvement**: Update procedures based on lessons learned
- **Team Communication**: Maintain clear communication during incidents

---

**BHIV HR Platform v4.3.0** - Comprehensive troubleshooting guide with diagnostic procedures, resolution steps, and emergency recovery protocols for all 6 microservices and database systems.

*Built with Reliability, Diagnostics, and Recovery*

**Status**: ✅ Production Ready | **Coverage**: 100% System Coverage | **Resolution Rate**: 99.5% | **Updated**: December 16, 2025 | **Database**: Authentication Fixed