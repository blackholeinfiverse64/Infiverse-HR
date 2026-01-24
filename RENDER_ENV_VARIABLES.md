# 🔧 Render Environment Variables Setup Guide

## ✅ MongoDB Connection Status

**Current Status:** MongoDB connection string is configured in `run_services.py`

**Connection String Format:**
```
mongodb+srv://blackholeinfiverse56_db_user:Blackhole%40056@cluster0.gx7tlvm.mongodb.net/bhiv_hr?retryWrites=true&w=majority
```

**Database:** `bhiv_hr`  
**Cluster:** `cluster0.gx7tlvm.mongodb.net`

---

## 📋 Required Environment Variables for Render

### **1. MongoDB Connection (CRITICAL)**

#### **Variable:** `DATABASE_URL`
**Value:**
```
mongodb+srv://blackholeinfiverse56_db_user:Blackhole%40056@cluster0.gx7tlvm.mongodb.net/bhiv_hr?retryWrites=true&w=majority
```

**Important Notes:**
- Password is URL-encoded: `@` becomes `%40`
- Database name: `bhiv_hr`
- Make sure MongoDB Atlas Network Access allows Render IPs (or use `0.0.0.0/0` for all IPs)

---

### **2. Authentication Secrets (REQUIRED)**

#### **Variable:** `API_KEY_SECRET`
**Value:**
```
prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o
```

#### **Variable:** `JWT_SECRET_KEY`
**Value:**
```
bhiv_jwt_secret_key_12345
```
**⚠️ SECURITY WARNING:** Change this to a secure random string in production!

#### **Variable:** `CANDIDATE_JWT_SECRET_KEY`
**Value:**
```
bhiv_candidate_jwt_secret_key_12345
```
**⚠️ SECURITY WARNING:** Change this to a secure random string in production!

#### **Variable:** `GATEWAY_SECRET_KEY`
**Value:**
```
bhiv_gateway_secret_key_12345
```
**⚠️ SECURITY WARNING:** Change this to a secure random string in production!

**To Generate Secure Secrets:**
```python
import secrets
print("API_KEY_SECRET=" + secrets.token_urlsafe(32))
print("JWT_SECRET_KEY=" + secrets.token_urlsafe(32))
print("CANDIDATE_JWT_SECRET_KEY=" + secrets.token_urlsafe(32))
print("GATEWAY_SECRET_KEY=" + secrets.token_urlsafe(32))
```

---

### **3. Service URLs (REQUIRED)**

#### **Variable:** `GATEWAY_SERVICE_URL`
**Value:**
```
https://bhiv-hr-gateway-l0xp.onrender.com
```
(Your actual Render service URL)

#### **Variable:** `AGENT_SERVICE_URL`
**Value:**
```
https://your-agent-service.onrender.com
```
(If deployed separately, otherwise use gateway URL)

#### **Variable:** `LANGGRAPH_SERVICE_URL`
**Value:**
```
https://your-langgraph-service.onrender.com
```
(If deployed separately, otherwise use gateway URL)

---

### **4. Environment Settings**

#### **Variable:** `ENVIRONMENT`
**Value:** `production`

#### **Variable:** `LOG_LEVEL`
**Value:** `INFO` (or `DEBUG` for troubleshooting)

---

### **5. Optional: AI Services**

#### **Variable:** `GEMINI_API_KEY`
**Value:** Your Google Gemini API key (if using AI features)
```
AIzaSyC8vbb0qAgcFlHw6fA14Ta6Nr7zsG5ELIs
```

#### **Variable:** `GEMINI_MODEL`
**Value:** `gemini-pro` (default)

---

## 📝 Complete Render Environment Variables List

Copy and paste these into Render's Environment Variables section:

```env
# MongoDB Connection
DATABASE_URL=mongodb+srv://blackholeinfiverse56_db_user:Blackhole%40056@cluster0.gx7tlvm.mongodb.net/bhiv_hr?retryWrites=true&w=majority

# Database Name (optional - already in connection string)
MONGODB_DB_NAME=bhiv_hr

# Authentication Secrets
API_KEY_SECRET=prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o
JWT_SECRET_KEY=bhiv_jwt_secret_key_12345
CANDIDATE_JWT_SECRET_KEY=bhiv_candidate_jwt_secret_key_12345
GATEWAY_SECRET_KEY=bhiv_gateway_secret_key_12345

# Service URLs
GATEWAY_SERVICE_URL=https://bhiv-hr-gateway-l0xp.onrender.com
AGENT_SERVICE_URL=https://bhiv-hr-gateway-l0xp.onrender.com
LANGGRAPH_SERVICE_URL=https://bhiv-hr-gateway-l0xp.onrender.com

# Environment
ENVIRONMENT=production
LOG_LEVEL=INFO

# Optional: AI Services
GEMINI_API_KEY=AIzaSyC8vbb0qAgcFlHw6fA14Ta6Nr7zsG5ELIs
GEMINI_MODEL=gemini-pro
```

---

## 🔍 How to Check MongoDB Connection on Render

### **Step 1: Check Render Logs**

1. Go to Render Dashboard → Your Service → Logs
2. Look for these messages:
   - ✅ `MongoDB client (async) initialized`
   - ✅ `Connected to MongoDB database: bhiv_hr`
   - ❌ `Failed to connect to MongoDB` (if error)

### **Step 2: Test Health Endpoint**

Visit: `https://bhiv-hr-gateway-l0xp.onrender.com/health`

Expected response:
```json
{
  "status": "healthy",
  "service": "BHIV HR Gateway",
  "version": "4.2.0"
}
```

### **Step 3: Check Database Connection**

If health endpoint shows database status, verify it says "connected"

---

## 🐛 Troubleshooting MongoDB Connection

### **Issue: "Authentication failed"**

**Solutions:**
1. Verify username/password in connection string
2. Check password is URL-encoded (`@` = `%40`, `#` = `%23`, etc.)
3. Verify MongoDB Atlas user has read/write permissions

### **Issue: "Connection timeout"**

**Solutions:**
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Add `0.0.0.0/0` (allows all IPs) OR add Render's specific IP ranges
4. Wait 2-3 minutes for changes to propagate

### **Issue: "Database not found"**

**Solution:**
- Database `bhiv_hr` will be created automatically on first write
- Or explicitly set `MONGODB_DB_NAME=bhiv_hr`

### **Issue: "Invalid connection string"**

**Solutions:**
1. Verify format: `mongodb+srv://user:pass@cluster.net/db?params`
2. Check for special characters in password (URL encode them)
3. Ensure cluster name is correct

---

## ✅ Verification Checklist

Before deploying to Render:

- [ ] MongoDB Atlas cluster is running
- [ ] Database user created with read/write permissions
- [ ] Network Access configured (IP whitelist)
- [ ] Connection string copied correctly
- [ ] Password URL-encoded in connection string
- [ ] `DATABASE_URL` set in Render
- [ ] All authentication secrets set
- [ ] Service URLs configured
- [ ] Test connection after deployment

---

## 🔐 Security Recommendations

**⚠️ IMPORTANT:** For production, generate new secure secrets:

```python
import secrets

# Generate secure secrets
print("API_KEY_SECRET=" + secrets.token_urlsafe(32))
print("JWT_SECRET_KEY=" + secrets.token_urlsafe(32))
print("CANDIDATE_JWT_SECRET_KEY=" + secrets.token_urlsafe(32))
print("GATEWAY_SECRET_KEY=" + secrets.token_urlsafe(32))
```

**Never commit secrets to Git!** Always use Render's environment variables.

---

## 📚 Additional Resources

- **MongoDB Atlas Dashboard:** https://cloud.mongodb.com/
- **Render Environment Variables:** https://render.com/docs/environment-variables
- **MongoDB Connection String Guide:** https://docs.mongodb.com/manual/reference/connection-string/

---

**Last Updated:** January 2026  
**Status:** ✅ Ready for Render Deployment

