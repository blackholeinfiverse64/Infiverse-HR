# 🚀 BHIV HR Platform - Complete Deployment Guide

**Enterprise AI-Powered Recruiting Platform Deployment**  
**Version**: v4.3.1 with Complete RL Integration  
**Updated**: December 16, 2025  
**Status**: ✅ Production Ready  
**Services**: 6/6 Operational | **Cost**: $0/month | **Uptime**: 99.9% | **Database**: Authentication Fixed

---

## 📊 Current Production Status

### **Live System Overview**
- **Platform**: Render Cloud (Oregon, US West)
- **Services**: 6 microservices fully operational
- **Database**: PostgreSQL 17 with Schema v4.3.0
- **Total Endpoints**: 111 (80 Gateway + 6 Agent + 25 LangGraph)
- **Performance**: <100ms API response, <0.02s AI matching
- **Security**: Triple authentication with 2FA support

### **Service Status Dashboard**
| Service | URL | Status | Endpoints |
|---------|-----|--------|-----------|
| **API Gateway** | [bhiv-hr-gateway-ltg0.onrender.com](https://bhiv-hr-gateway-ltg0.onrender.com/docs) | ✅ Live | 74 |
| **AI Agent** | [bhiv-hr-agent-nhgg.onrender.com](https://bhiv-hr-agent-nhgg.onrender.com/docs) | ✅ Live | 6 |
| **LangGraph** | [bhiv-hr-langgraph.onrender.com](https://bhiv-hr-langgraph.onrender.com) | ✅ Live | 25 |
| **HR Portal** | [bhiv-hr-portal-u670.onrender.com](https://bhiv-hr-portal-u670.onrender.com/) | ✅ Live | 2 |
| **Client Portal** | [bhiv-hr-client-portal-3iod.onrender.com](https://bhiv-hr-client-portal-3iod.onrender.com/) | ✅ Live | 2 |
| **Candidate Portal** | [bhiv-hr-candidate-portal-abe6.onrender.com](https://bhiv-hr-candidate-portal-abe6.onrender.com/) | ✅ Live | 2 |

**Demo Access**: Username: `demo_user` | Password: `demo_password` | Client: `TECH001` / `demo123`

---

## 🎯 Deployment Options

### **Option 1: Use Live Production System (Recommended)**
**Best for**: Testing, evaluation, immediate use  
**Time**: 2 minutes  
**Cost**: Free

1. **Access Live Platform**
   - Visit [API Documentation](https://bhiv-hr-gateway-ltg0.onrender.com/docs)
   - Use [HR Portal](https://bhiv-hr-portal-u670.onrender.com/) with demo credentials
   - Test [Client Portal](https://bhiv-hr-client-portal-3iod.onrender.com/) with `TECH001` / `demo123`

2. **Get API Access**
   - API Key available in Render dashboard
   - All 111 endpoints ready for testing
   - Real-time AI matching and workflow automation

### **Option 2: Local Development Setup**
**Best for**: Development, customization, learning  
**Time**: 15-30 minutes  
**Requirements**: Docker, Git, 4GB RAM

### **Option 3: Cloud Deployment (Render)**
**Best for**: Production deployment, scaling  
**Time**: 45-60 minutes  
**Cost**: Free tier available

---

## 💻 Local Development Deployment

### **Prerequisites**
```bash
# Required software
- Docker Desktop 4.0+
- Git 2.30+
- Python 3.12.7
- 4GB RAM minimum
- 10GB disk space
```

### **Quick Start (5 Minutes)**
```bash
# 1. Clone repository
git clone https://github.com/Shashank-0208/BHIV-HR-PLATFORM.git
cd BHIV-HR-Platform

# 2. Setup environment
cp .env.example .env
# Edit .env with your credentials (optional for local testing)

# 3. Start all services
docker-compose -f docker-compose.production.yml up -d

# 4. Verify deployment
curl http://localhost:8000/health
```

### **Detailed Local Setup**

#### **Step 1: Environment Configuration**
```bash
# Create environment file
cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://bhiv_user:bhiv_password@db:5432/bhiv_hr
POSTGRES_DB=bhiv_hr
POSTGRES_USER=bhiv_user
POSTGRES_PASSWORD=bhiv_password

# API Configuration
API_KEY_SECRET=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here

# AI Configuration (Optional)
OPENAI_API_KEY=your-openai-key-here

# Environment
ENVIRONMENT=development
DEBUG=true
EOF
```

#### **Step 2: Database Initialization**
```bash
# Start database first
docker-compose -f docker-compose.production.yml up -d db

# Wait for database to be ready
sleep 10

# Initialize schema
docker exec -i bhiv_hr_db psql -U bhiv_user -d bhiv_hr < services/db/consolidated_schema.sql

# Verify schema
docker exec bhiv_hr_db psql -U bhiv_user -d bhiv_hr -c "\dt"
```

#### **Step 3: Service Deployment**
```bash
# Start all services
docker-compose -f docker-compose.production.yml up -d

# Check service status
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f
```

#### **Step 4: Verification**
```bash
# Test API Gateway
curl http://localhost:8000/health
curl http://localhost:8000/docs

# Test AI Agent
curl http://localhost:8001/health
curl http://localhost:8001/docs

# Test LangGraph
curl http://localhost:8002/health

# Test Portals
curl -I http://localhost:8501  # HR Portal
curl -I http://localhost:8502  # Client Portal
curl -I http://localhost:8503  # Candidate Portal
```

### **Local Service URLs**
- **API Gateway**: http://localhost:8000/docs
- **AI Agent**: http://localhost:8001/docs
- **LangGraph**: http://localhost:8002
- **HR Portal**: http://localhost:8501
- **Client Portal**: http://localhost:8502
- **Candidate Portal**: http://localhost:8503
- **Database**: localhost:5432

---

## ☁️ Cloud Deployment (Render)

### **Prerequisites**
- GitHub account with repository access
- Render account (free tier available)
- PostgreSQL database (Render provides free tier)

### **Step 1: Database Deployment**

#### **Create PostgreSQL Database**
1. **Login to Render Dashboard**
   - Go to [render.com](https://render.com)
   - Create account or login

2. **Create Database**
   - Click "New +" → "PostgreSQL"
   - Name: `bhiv-hr-database`
   - Database: `bhiv_hr`
   - User: `bhiv_user`
   - Region: `Oregon (US West)`
   - Plan: `Free` (0.1 CPU, 256MB RAM)

3. **Initialize Schema**
   ```bash
   # Get connection details from Render dashboard
   psql postgresql://bhiv_user:password@hostname/bhiv_hr < services/db/consolidated_schema.sql
   ```

### **Step 2: Service Deployment**

#### **Deploy API Gateway**
1. **Create Web Service**
   - Repository: `https://github.com/Shashank-0208/BHIV-HR-PLATFORM`
   - Root Directory: `services/gateway`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`

2. **Environment Variables**
   ```
   DATABASE_URL=postgresql://bhiv_user:password@hostname/bhiv_hr
   API_KEY_SECRET=your-secret-key
   JWT_SECRET_KEY=your-jwt-secret
   ENVIRONMENT=production
   ```

#### **Deploy AI Agent**
1. **Create Web Service**
   - Root Directory: `services/agent`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python -m uvicorn app:app --host 0.0.0.0 --port $PORT`

2. **Environment Variables**
   ```
   DATABASE_URL=postgresql://bhiv_user:password@hostname/bhiv_hr
   OPENAI_API_KEY=your-openai-key
   GATEWAY_SERVICE_URL=https://your-gateway-url.onrender.com
   ```

#### **Deploy LangGraph Service**
1. **Create Web Service**
   - Root Directory: `services/langgraph`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`

2. **Environment Variables**
   ```
   DATABASE_URL=postgresql://bhiv_user:password@hostname/bhiv_hr
   GATEWAY_SERVICE_URL=https://your-gateway-url.onrender.com
   OPENAI_API_KEY=your-openai-key
   ```

#### **Deploy Portal Services**

**HR Portal:**
```
Root Directory: services/portal
Build Command: pip install -r requirements.txt
Start Command: streamlit run app.py --server.port $PORT --server.address 0.0.0.0
```

**Client Portal:**
```
Root Directory: services/client_portal
Build Command: pip install -r requirements.txt
Start Command: streamlit run app.py --server.port $PORT --server.address 0.0.0.0
```

**Candidate Portal:**
```
Root Directory: services/candidate_portal
Build Command: pip install -r requirements.txt
Start Command: streamlit run app.py --server.port $PORT --server.address 0.0.0.0
```

### **Step 3: Service Integration**

#### **Update Service URLs**
After all services are deployed, update environment variables:

```bash
# Gateway Service
AGENT_SERVICE_URL=https://your-agent-url.onrender.com
LANGGRAPH_URL=https://your-langgraph-url.onrender.com

# Portal Services
GATEWAY_SERVICE_URL=https://your-gateway-url.onrender.com
API_BASE_URL=https://your-gateway-url.onrender.com
```

---

## 🔧 Advanced Configuration

### **Environment Variables Reference**

#### **Database Configuration**
```bash
DATABASE_URL=postgresql://user:password@host:port/database
POSTGRES_DB=bhiv_hr
POSTGRES_USER=bhiv_user
POSTGRES_PASSWORD=secure_password
DB_POOL_SIZE=10
DB_MAX_OVERFLOW=20
```

#### **Security Configuration**
```bash
API_KEY_SECRET=your-256-bit-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=30
BCRYPT_ROUNDS=12
```

#### **AI Configuration**
```bash
OPENAI_API_KEY=sk-your-openai-key
OPENAI_MODEL=gpt-4
SEMANTIC_MODEL=sentence-transformers/all-MiniLM-L6-v2
BATCH_SIZE=50
CACHE_TTL=3600
```

#### **LangGraph Configuration**
```bash
LANGGRAPH_API_KEY=your-langgraph-key
WORKFLOW_TIMEOUT=300
MAX_RETRIES=3
NOTIFICATION_CHANNELS=email,whatsapp,telegram
```

#### **Performance Configuration**
```bash
WORKERS=4
MAX_CONNECTIONS=100
TIMEOUT=30
RATE_LIMIT=500
CACHE_SIZE=1000
```

### **Docker Configuration**

#### **Production Docker Compose**
```yaml
version: '3.8'
services:
  db:
    image: postgres:17
    environment:
      POSTGRES_DB: bhiv_hr
      POSTGRES_USER: bhiv_user
      POSTGRES_PASSWORD: bhiv_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./services/db/consolidated_schema.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bhiv_user -d bhiv_hr"]
      interval: 30s
      timeout: 10s
      retries: 3

  gateway:
    build: ./services/gateway
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://bhiv_user:bhiv_password@db:5432/bhiv_hr
      - AGENT_SERVICE_URL=http://agent:8001
      - LANGGRAPH_URL=http://langgraph:8002
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  agent:
    build: ./services/agent
    ports:
      - "8001:8001"
    environment:
      - DATABASE_URL=postgresql://bhiv_user:bhiv_password@db:5432/bhiv_hr
      - GATEWAY_SERVICE_URL=http://gateway:8000
    depends_on:
      db:
        condition: service_healthy

  langgraph:
    build: ./services/langgraph
    ports:
      - "8002:8002"
    environment:
      - DATABASE_URL=postgresql://bhiv_user:bhiv_password@db:5432/bhiv_hr
      - GATEWAY_SERVICE_URL=http://gateway:8000
    depends_on:
      db:
        condition: service_healthy

volumes:
  postgres_data:
```

---

## ✅ Verification & Testing

### **Automated Verification Script**
```bash
#!/bin/bash
# verify_deployment.sh

echo "🔍 BHIV HR Platform Deployment Verification"
echo "=========================================="

# Check service health
services=(
    "https://bhiv-hr-gateway-ltg0.onrender.com/health"
    "https://bhiv-hr-agent-nhgg.onrender.com/health"
    "https://bhiv-hr-langgraph.onrender.com/health"
)

for service in "${services[@]}"; do
    echo "Checking $service..."
    if curl -f -s "$service" > /dev/null; then
        echo "✅ Service healthy"
    else
        echo "❌ Service unhealthy"
    fi
done

# Test API endpoints
echo "🧪 Testing API Endpoints..."
curl -H "Authorization: Bearer demo_key" \
     "https://bhiv-hr-gateway-ltg0.onrender.com/v1/jobs" | jq '.total'

# Test AI matching
echo "🤖 Testing AI Matching..."
curl -X POST -H "Content-Type: application/json" \
     -H "Authorization: Bearer demo_key" \
     "https://bhiv-hr-agent-nhgg.onrender.com/match" \
     -d '{"candidate_id": 1, "job_id": 1}' | jq '.score'

# Test LangGraph workflow
echo "🔄 Testing LangGraph Workflow..."
curl -X POST -H "Content-Type: application/json" \
     "https://bhiv-hr-langgraph.onrender.com/workflows/test" \
     -d '{"test": true}' | jq '.status'

echo "✅ Verification Complete"
```

### **Manual Testing Checklist**

#### **API Gateway (77 endpoints)**
```bash
# Authentication
curl -X POST -H "Content-Type: application/json" \
     -d '{"username":"demo_user","password":"demo_password"}' \
     https://bhiv-hr-gateway-ltg0.onrender.com/v1/auth/login

# Jobs API
curl -H "Authorization: Bearer <token>" \
     https://bhiv-hr-gateway-ltg0.onrender.com/v1/jobs

# Candidates API
curl -H "Authorization: Bearer <token>" \
     https://bhiv-hr-gateway-ltg0.onrender.com/v1/candidates
```

#### **AI Agent (6 endpoints)**
```bash
# Semantic matching
curl -X POST -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>" \
     https://bhiv-hr-agent-nhgg.onrender.com/match \
     -d '{"candidate_id": 1, "job_id": 1}'

# Batch processing
curl -X POST -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>" \
     https://bhiv-hr-agent-nhgg.onrender.com/batch_match \
     -d '{"job_id": 1, "candidate_ids": [1,2,3]}'
```

#### **LangGraph (25 endpoints)**
```bash
# Workflow creation
curl -X POST -H "Content-Type: application/json" \
     https://bhiv-hr-langgraph.onrender.com/workflows/application/start \
     -d '{"candidate_id": 1, "job_id": 1}'

# Notification testing
curl -X POST -H "Content-Type: application/json" \
     https://bhiv-hr-langgraph.onrender.com/tools/send-notification \
     -d '{"type": "email", "recipient": "test@example.com", "message": "Test"}'
```

#### **Portal Services**
```bash
# HR Portal
curl -I https://bhiv-hr-portal-u670.onrender.com/
# Expected: 200 OK with Streamlit headers

# Client Portal
curl -I https://bhiv-hr-client-portal-3iod.onrender.com/
# Expected: 200 OK with authentication page

# Candidate Portal
curl -I https://bhiv-hr-candidate-portal-abe6.onrender.com/
# Expected: 200 OK with job listings
```

### **Performance Testing**
```bash
# Load testing with Apache Bench
ab -n 100 -c 10 https://bhiv-hr-gateway-ltg0.onrender.com/health

# Expected results:
# - Requests per second: >50
# - Time per request: <100ms
# - Failed requests: 0
```

---

## 🔒 Security Configuration

### **SSL/TLS Setup**
```bash
# Render automatically provides SSL certificates
# Verify SSL configuration
curl -I https://bhiv-hr-gateway-ltg0.onrender.com/
# Expected: HTTP/2 200 with security headers
```

### **API Key Management**
```bash
# Generate secure API keys
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Set in environment variables
API_KEY_SECRET=your-generated-key
```

### **Database Security**
```sql
-- Create read-only user for monitoring
CREATE USER bhiv_readonly WITH PASSWORD 'readonly_password';
GRANT CONNECT ON DATABASE bhiv_hr TO bhiv_readonly;
GRANT USAGE ON SCHEMA public TO bhiv_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO bhiv_readonly;
```

---

## 📊 Monitoring & Maintenance

### **Health Monitoring**
```bash
# Service health check script
#!/bin/bash
services=(
    "gateway:https://bhiv-hr-gateway-ltg0.onrender.com/health"
    "agent:https://bhiv-hr-agent-nhgg.onrender.com/health"
    "langgraph:https://bhiv-hr-langgraph.onrender.com/health"
)

for service in "${services[@]}"; do
    name=${service%%:*}
    url=${service#*:}
    
    if curl -f -s "$url" > /dev/null; then
        echo "✅ $name: Healthy"
    else
        echo "❌ $name: Unhealthy"
        # Send alert notification
    fi
done
```

### **Performance Monitoring**
```bash
# Database performance
psql $DATABASE_URL -c "
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"

# API performance
curl -w "@curl-format.txt" -o /dev/null -s https://bhiv-hr-gateway-ltg0.onrender.com/v1/jobs
```

### **Log Management**
```bash
# View service logs (Render dashboard)
# Or use CLI tools for local deployment
docker-compose -f docker-compose.production.yml logs -f gateway
docker-compose -f docker-compose.production.yml logs -f agent
```

---

## 🚨 Troubleshooting

### **Common Issues & Solutions**

#### **Database Connection Issues**
```bash
# Check database connectivity
psql $DATABASE_URL -c "SELECT version();"

# Common fixes:
# 1. Verify DATABASE_URL format
# 2. Check firewall settings
# 3. Ensure database is running
# 4. Verify credentials
```

#### **Service Startup Issues**
```bash
# Check service logs
docker-compose logs service_name

# Common fixes:
# 1. Verify environment variables
# 2. Check port conflicts
# 3. Ensure dependencies are running
# 4. Verify Docker image builds
```

#### **API Authentication Issues**
```bash
# Test API key
curl -H "Authorization: Bearer your_api_key" \
     https://bhiv-hr-gateway-ltg0.onrender.com/v1/auth/verify

# Common fixes:
# 1. Verify API key format
# 2. Check JWT secret configuration
# 3. Ensure proper headers
# 4. Verify token expiration
```

#### **Performance Issues**
```bash
# Check resource usage
docker stats

# Common fixes:
# 1. Increase memory allocation
# 2. Optimize database queries
# 3. Enable caching
# 4. Scale services horizontally
```

### **Emergency Recovery**
```bash
# Quick service restart
docker-compose -f docker-compose.production.yml restart

# Database backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Service rollback (Render)
# Use Render dashboard to rollback to previous deployment
```

---

## 📈 Scaling & Optimization

### **Horizontal Scaling**
```yaml
# docker-compose.scale.yml
version: '3.8'
services:
  gateway:
    deploy:
      replicas: 3
    ports:
      - "8000-8002:8000"
  
  agent:
    deploy:
      replicas: 2
    ports:
      - "8010-8011:8001"
```

### **Performance Optimization**
```bash
# Database optimization
psql $DATABASE_URL -c "
-- Update statistics
ANALYZE;

-- Rebuild indexes
REINDEX DATABASE bhiv_hr;

-- Vacuum for space reclamation
VACUUM ANALYZE;
"

# Application optimization
# 1. Enable Redis caching
# 2. Implement connection pooling
# 3. Use CDN for static assets
# 4. Enable gzip compression
```

### **Cost Optimization**
```bash
# Render free tier limits:
# - 750 hours/month per service
# - 0.1 CPU, 512MB RAM
# - 100GB bandwidth

# Optimization strategies:
# 1. Use sleep schedules for non-critical services
# 2. Implement efficient caching
# 3. Optimize database queries
# 4. Use compression for API responses
```

---

## 🎯 Success Criteria

### **Deployment Success Checklist**
- ✅ **All 6 services operational** (Gateway, Agent, LangGraph, 3 Portals)
- ✅ **All 111 endpoints functional** (80+6+25)
- ✅ **Database schema v4.3.0** with 19 tables (13 core + 6 RL)
- ✅ **Authentication working** (API keys, JWT, 2FA)
- ✅ **AI matching operational** (<0.02s response time)
- ✅ **LangGraph workflows** creating and processing
- ✅ **RL system active** (Q-learning, feedback integration)
- ✅ **Notifications working** (Email, WhatsApp, Telegram)
- ✅ **Performance targets met** (<100ms API, 99.9% uptime)
- ✅ **Security measures active** (Rate limiting, audit logging)

### **Performance Benchmarks**
- **API Response Time**: <100ms (95th percentile)
- **AI Matching Speed**: <0.02s with caching
- **Database Query Time**: <50ms average
- **Service Uptime**: >99.9%
- **Concurrent Users**: 100+ supported
- **Throughput**: 500+ requests/minute

### **Production Readiness**
- **Monitoring**: Health checks, performance metrics
- **Backup**: Automated daily database backups
- **Security**: SSL/TLS, authentication, rate limiting
- **Scalability**: Horizontal scaling ready
- **Documentation**: Complete API and deployment docs
- **Testing**: 100% endpoint coverage

---

## 📞 Support & Resources

### **Quick Links**
- **Live API**: [bhiv-hr-gateway-ltg0.onrender.com/docs](https://bhiv-hr-gateway-ltg0.onrender.com/docs)
- **HR Portal**: [bhiv-hr-portal-u670.onrender.com](https://bhiv-hr-portal-u670.onrender.com/)
- **Client Portal**: [bhiv-hr-client-portal-3iod.onrender.com](https://bhiv-hr-client-portal-3iod.onrender.com/)
- **GitHub**: [BHIV-HR-Platform Repository](https://github.com/Shashank-0208/BHIV-HR-PLATFORM)

### **Documentation**
- [Quick Start Guide](QUICK_START_GUIDE.md)
- [API Documentation](../api/API_DOCUMENTATION.md)
- [Database Documentation](../database/DATABASE_DOCUMENTATION.md)
- [Security Audit](../security/SECURITY_AUDIT.md)

### **Demo Credentials**
- **API Key**: Available in Render dashboard
- **HR Portal**: `demo_user` / `demo_password`
- **Client Portal**: `TECH001` / `demo123`
- **Database**: Read-only access for testing

---

**BHIV HR Platform Deployment Guide v4.3.0** - Complete deployment instructions for enterprise AI-powered recruiting platform with 6 microservices, 111 endpoints, and production-grade security.

*Built with Integrity, Honesty, Discipline, Hard Work & Gratitude*

**Last Updated**: December 9, 2025 | **Version**: v4.3.0 | **Services**: 6/6 Live | **Status**: ✅ Production Ready