# 🗄️ MongoDB Connection & Render Environment Variables Guide

## ✅ MongoDB Connection Check

### **How to Test MongoDB Connection Locally:**

```bash
cd backend
python test_mongodb_atlas.py
```

Or test manually:
```python
from pymongo import MongoClient
import os

DATABASE_URL = os.getenv("DATABASE_URL")
client = MongoClient(DATABASE_URL, serverSelectionTimeoutMS=5000)
client.admin.command('ping')
print("✅ MongoDB connected successfully!")
```

---

## 🔧 Required Environment Variables for Render

### **1. MongoDB Connection (REQUIRED)**

#### **Variable Name:** `DATABASE_URL`
**Value Format:**
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database_name>?retryWrites=true&w=majority
```

**Example:**
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/bhiv_hr?retryWrites=true&w=majority
```

**How to Get:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `bhiv_hr` (or your database name)

**Alternative Variable Name:** `MONGODB_URI` (also supported)

---

### **2. Database Name (OPTIONAL)**

#### **Variable Name:** `MONGODB_DB_NAME`
**Value:** `bhiv_hr` (default if not set)

**Note:** If your connection string already includes the database name, this is optional.

---

### **3. Authentication Secrets (REQUIRED)**

#### **Variable Name:** `API_KEY_SECRET`
**Value:** Your API key for service-to-service authentication
**Generate:** 
```python
import secrets
print(secrets.token_urlsafe(32))
```

#### **Variable Name:** `JWT_SECRET_KEY`
**Value:** Secret key for JWT token signing (HR/Recruiter tokens)
**Generate:**
```python
import secrets
print(secrets.token_urlsafe(32))
```

#### **Variable Name:** `CANDIDATE_JWT_SECRET_KEY`
**Value:** Secret key for candidate JWT tokens
**Generate:**
```python
import secrets
print(secrets.token_urlsafe(32))
```

#### **Variable Name:** `GATEWAY_SECRET_KEY`
**Value:** Secret key for gateway service authentication
**Generate:**
```python
import secrets
print(secrets.token_urlsafe(32))
```

---

### **4. Service URLs (REQUIRED for Gateway Service)**

#### **Variable Name:** `GATEWAY_SERVICE_URL`
**Value:** `https://bhiv-hr-gateway-l0xp.onrender.com` (your Render URL)

#### **Variable Name:** `AGENT_SERVICE_URL`
**Value:** `https://your-agent-service.onrender.com` (if deployed separately)

#### **Variable Name:** `LANGGRAPH_SERVICE_URL`
**Value:** `https://your-langgraph-service.onrender.com` (if deployed separately)

---

### **5. Optional: AI Services**

#### **Variable Name:** `GEMINI_API_KEY`
**Value:** Your Google Gemini API key (if using AI features)

#### **Variable Name:** `GEMINI_MODEL`
**Value:** `gemini-pro` (default)

---

### **6. Environment Settings**

#### **Variable Name:** `ENVIRONMENT`
**Value:** `production` (for Render deployment)

#### **Variable Name:** `LOG_LEVEL`
**Value:** `INFO` or `DEBUG`

---

## 📋 Complete Render Environment Variables List

### **For Gateway Service on Render:**

```env
# MongoDB Connection (REQUIRED)
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/bhiv_hr?retryWrites=true&w=majority

# Database Name (OPTIONAL - defaults to bhiv_hr)
MONGODB_DB_NAME=bhiv_hr

# Authentication Secrets (REQUIRED)
API_KEY_SECRET=your_generated_api_key_here
JWT_SECRET_KEY=your_generated_jwt_secret_here
CANDIDATE_JWT_SECRET_KEY=your_generated_candidate_jwt_secret_here
GATEWAY_SECRET_KEY=your_generated_gateway_secret_here

# Service URLs (REQUIRED)
GATEWAY_SERVICE_URL=https://bhiv-hr-gateway-l0xp.onrender.com
AGENT_SERVICE_URL=https://your-agent-service.onrender.com
LANGGRAPH_SERVICE_URL=https://your-langgraph-service.onrender.com

# Environment
ENVIRONMENT=production
LOG_LEVEL=INFO

# Optional: AI Services
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-pro
```

---

## 🔍 How to Check MongoDB Connection Status

### **Method 1: Check Render Logs**

1. Go to your Render dashboard
2. Click on your service
3. Go to "Logs" tab
4. Look for:
   - ✅ `MongoDB client (async) initialized`
   - ✅ `Connected to MongoDB database: bhiv_hr`
   - ❌ `Failed to connect to MongoDB` (if there's an error)

### **Method 2: Health Check Endpoint**

Visit: `https://your-service.onrender.com/health`

Should return:
```json
{
  "status": "healthy",
  "service": "BHIV HR Gateway",
  "database": "connected"
}
```

### **Method 3: Test Connection Script**

Create a test endpoint or run:
```python
from app.database import get_mongo_db
db = await get_mongo_db()
result = await db.command('ping')
print("✅ Connected!" if result else "❌ Not connected")
```

---

## 🐛 Common MongoDB Connection Issues

### **Issue 1: "Authentication failed"**
**Solution:** 
- Check username/password in connection string
- Ensure password is URL-encoded (e.g., `@` becomes `%40`)
- Verify MongoDB Atlas user has correct permissions

### **Issue 2: "Connection timeout"**
**Solution:**
- Check MongoDB Atlas Network Access (whitelist Render IPs)
- Add `0.0.0.0/0` to allow all IPs (for testing)
- Or add Render's IP ranges

### **Issue 3: "Database not found"**
**Solution:**
- Database will be created automatically on first write
- Or set `MONGODB_DB_NAME=bhiv_hr` explicitly

### **Issue 4: "Invalid connection string"**
**Solution:**
- Ensure connection string format is correct
- Check for special characters in password (URL encode them)
- Verify cluster name is correct

---

## 🔐 MongoDB Atlas Setup Steps

### **1. Create MongoDB Atlas Account**
- Go to https://www.mongodb.com/cloud/atlas/register
- Sign up for free tier (M0 cluster)

### **2. Create Cluster**
- Choose free tier (M0)
- Select region closest to your Render region
- Wait for cluster to be created (~5 minutes)

### **3. Create Database User**
- Go to "Database Access"
- Click "Add New Database User"
- Username: `your_username`
- Password: Generate secure password
- Database User Privileges: "Read and write to any database"

### **4. Whitelist IP Addresses**
- Go to "Network Access"
- Click "Add IP Address"
- For Render: Add `0.0.0.0/0` (allows all IPs) OR add Render's specific IPs
- Click "Confirm"

### **5. Get Connection String**
- Go to "Database" → Click "Connect"
- Choose "Connect your application"
- Copy connection string
- Replace `<password>` with your actual password
- Replace `<dbname>` with `bhiv_hr`

---

## 📝 Quick Checklist for Render Deployment

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with read/write permissions
- [ ] Network Access configured (IP whitelist)
- [ ] Connection string copied and password replaced
- [ ] `DATABASE_URL` set in Render environment variables
- [ ] All authentication secrets generated and set
- [ ] Service URLs configured
- [ ] Test connection after deployment

---

## 🧪 Test Connection After Setup

Once deployed on Render, test the connection:

```bash
# Check health endpoint
curl https://your-service.onrender.com/health

# Should return:
{
  "status": "healthy",
  "service": "BHIV HR Gateway",
  "database": "connected"
}
```

---

## 📚 Additional Resources

- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/
- **Connection String Format:** https://docs.mongodb.com/manual/reference/connection-string/
- **Render Environment Variables:** https://render.com/docs/environment-variables

---

**Last Updated:** January 2026  
**Status:** ✅ Production Ready

