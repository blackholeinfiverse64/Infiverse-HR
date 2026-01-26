# 🗄️ BHIV HR Platform - Database Service

## **MongoDB Atlas Database Service**
**Updated**: January 22, 2026  
**Status**: ✅ Production Ready - MongoDB Migration Complete  
**Database**: MongoDB Atlas (Cloud)  
**Collections**: 17+ MongoDB collections  

---

## 📋 Database Overview

The BHIV HR Platform has **fully migrated from PostgreSQL to MongoDB Atlas**. All database operations now use MongoDB with the following characteristics:

### **Current Database Configuration**
- **Engine**: MongoDB Atlas (Cloud-hosted NoSQL)
- **Database Name**: `bhiv_hr`
- **Connection Drivers**: 
  - Motor (Async) - Gateway Service
  - PyMongo (Sync) - Agent & LangGraph Services
- **Connection Pooling**: maxPoolSize=10, minPoolSize=2
- **Collections**: 17+ collections with 75+ indexes

### **Migration Status**
- ✅ **PostgreSQL Deprecated**: All PostgreSQL schemas and dependencies have been removed
- ✅ **MongoDB Active**: All services now connect to MongoDB Atlas
- ✅ **Data Migrated**: All production data transferred to MongoDB
- ✅ **Performance Optimized**: Indexes and queries optimized for MongoDB

---

## 🔗 Database Connection

### **Environment Configuration**
```env
# MongoDB Atlas Connection (Replace with your actual connection string)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/bhiv_hr

# Authentication Secrets
API_KEY_SECRET=<your-api-key>
JWT_SECRET_KEY=<your-jwt-secret>
CANDIDATE_JWT_SECRET_KEY=<your-candidate-jwt-secret>
GATEWAY_SECRET_KEY=<your-gateway-secret>
```

### **Connection Settings**
```python
# services/gateway/app/database.py
from motor.motor_asyncio import AsyncIOMotorClient

MONGODB_URI = os.getenv("MONGODB_URI")

client = AsyncIOMotorClient(
    MONGODB_URI,
    maxPoolSize=10,          # Maximum connections in the pool
    minPoolSize=2,           # Minimum connections in the pool
    maxIdleTimeMS=30000,     # Close connections after 30 seconds of inactivity
    serverSelectionTimeoutMS=5000,  # Wait 5 seconds for server selection
    socketTimeoutMS=45000,   # Close sockets after 45 seconds of inactivity
    connectTimeoutMS=20000,  # Connect timeout
)

db = client.bhiv_hr
```

---

## 🏗️ MongoDB Collections

### **Core Application Collections (8)**
1. `candidates` - Candidate profiles and authentication
2. `jobs` - Job postings and requirements  
3. `applications` - Job application tracking
4. `feedback` - BHIV values assessment
5. `interviews` - Interview scheduling and results
6. `offers` - Job offers and negotiations
7. `users` - HR user management
8. `clients` - Client company information

### **System Collections (5)**
9. `api_keys` - API authentication management
10. `rate_limits` - Dynamic rate limiting data
11. `audit_logs` - Complete system audit trail
12. `notifications` - Multi-channel notification log
13. `sessions` - User session management

### **Reinforcement Learning Collections (4)**
14. `ml_feedback` - Reinforcement learning feedback
15. `performance_metrics` - System performance data
16. `matching_cache` - AI matching results cache
17. `company_scoring_preferences` - Client-specific scoring weights

---

## 📊 Collection Schema Examples

### **Candidates Collection**
```javascript
{
  "_id": ObjectId("..."),
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "location": "San Francisco, CA",
  "experience_years": 5,
  "technical_skills": "Python, Django, FastAPI, MongoDB",
  "seniority_level": "Senior",
  "education_level": "Bachelor's",
  "resume_path": "/resumes/john_doe.pdf",
  "password_hash": "$2b$12$...",  // bcrypt hashed
  "status": "applied",  // applied, screening, interview, offer, hired, rejected
  "created_at": ISODate("2026-01-22T10:00:00Z"),
  "updated_at": ISODate("2026-01-22T10:00:00Z")
}
```

### **Jobs Collection**
```javascript
{
  "_id": ObjectId("..."),
  "title": "Senior Python Developer",
  "department": "Engineering",
  "location": "Remote",
  "experience_level": "Senior",
  "requirements": "Python, Django, FastAPI, MongoDB, REST APIs, 5+ years",
  "description": "We are looking for a senior Python developer...",
  "client_id": "client123",
  "employment_type": "Full-time",
  "status": "active",  // active, paused, closed, draft
  "created_at": ISODate("2026-01-22T10:00:00Z"),
  "updated_at": ISODate("2026-01-22T10:00:00Z")
}
```

---

## 🔧 Maintenance & Operations

### **Database Health Checks**
```bash
# Test MongoDB connection
mongo "mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/bhiv_hr" --eval "db.runCommand({serverStatus: 1})"

# Test from application
python -c "
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def test_connection():
    client = AsyncIOMotorClient('your_connection_string')
    await client.admin.command('ping')
    print('Connected successfully!')
    client.close()

asyncio.run(test_connection())
"
```

### **Data Verification**
```javascript
// Verify current data counts
db.candidates.countDocuments()
db.jobs.countDocuments()
db.clients.countDocuments()
db.feedback.countDocuments()
db.applications.countDocuments()

// Expected results (January 22, 2026):
// candidates: 34
// jobs: 27
// clients: 6+
// feedback: 15+
// applications: 150+
```

---

## 📈 Performance & Security

### **Performance Optimization**
- **Response Time**: <50ms for typical queries
- **AI Matching**: <0.02s with caching
- **Full-text Search**: <100ms for complex searches
- **Connection Pooling**: Optimized for 3 core microservices

### **Security Features**
- **Authentication**: JWT tokens, API keys, 2FA
- **Rate Limiting**: Dynamic per-endpoint limits
- **Input Validation**: XSS and injection protection
- **Audit Logging**: Complete activity tracking
- **Encryption**: Password hashing with bcrypt

---

**BHIV HR Platform Database Service** - Complete MongoDB Atlas NoSQL implementation replacing deprecated PostgreSQL system.

*Built with Integrity, Honesty, Discipline, Hard Work & Gratitude*

**Last Updated**: January 22, 2026 | **Status**: ✅ Production Ready | **Database**: MongoDB Atlas | **Migration**: Complete