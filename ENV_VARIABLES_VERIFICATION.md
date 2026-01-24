# ✅ Environment Variables Verification Guide

## 🎯 Good News: No Conversion Needed!

**Render environment variables work directly** - no conversion or `.env` file needed!

Your backend services use `os.getenv()` which reads directly from environment variables that Render injects. No changes needed!

---

## 📋 How Each Service Reads Environment Variables

### **1. Gateway Service** (`backend/services/gateway/`)
- Uses: `os.getenv()` directly
- Reads from: Environment variables (Render provides these)
- ✅ **No .env file needed in Render**

### **2. Agent Service** (`backend/services/agent/`)
- Uses: `os.getenv()` directly  
- Reads from: Environment variables
- ✅ **No .env file needed in Render**

### **3. LangGraph Service** (`backend/services/langgraph/`)
- Uses: `pydantic_settings.BaseSettings` with `case_sensitive = False`
- Reads from: Environment variables first (then .env if not found)
- ✅ **Environment variables take precedence - perfect for Render!**

---

## ✅ Required Environment Variables Per Service

### **Gateway Service (Render)**

| Variable Name | Required? | Example |
|---------------|-----------|---------|
| `DATABASE_URL` | ✅ YES | `mongodb+srv://user:pass@cluster.net/bhiv_hr?retryWrites=true&w=majority` |
| `API_KEY_SECRET` | ✅ YES | `prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o` |
| `JWT_SECRET_KEY` | ✅ YES | `bhiv_jwt_secret_key_12345` |
| `CANDIDATE_JWT_SECRET_KEY` | ✅ YES | `bhiv_candidate_jwt_secret_key_12345` |
| `AGENT_SERVICE_URL` | ✅ YES | `https://your-service.onrender.com` |
| `LANGGRAPH_SERVICE_URL` | ✅ YES | `https://your-service.onrender.com` |
| `GATEWAY_SERVICE_URL` | ✅ YES | `https://bhiv-hr-gateway-l0xp.onrender.com` |
| `ENVIRONMENT` | ⚠️ Recommended | `production` |
| `LOG_LEVEL` | ⚠️ Optional | `INFO` |
| `GEMINI_API_KEY` | ⚠️ Optional | (if using AI features) |

### **Agent Service (Render)**

| Variable Name | Required? | Example |
|---------------|-----------|---------|
| `DATABASE_URL` | ✅ YES | Same as Gateway |
| `API_KEY_SECRET` | ✅ YES | Same as Gateway |
| `JWT_SECRET_KEY` | ✅ YES | Same as Gateway |
| `CANDIDATE_JWT_SECRET_KEY` | ✅ YES | Same as Gateway |
| `ENVIRONMENT` | ⚠️ Recommended | `production` |
| `LOG_LEVEL` | ⚠️ Optional | `INFO` |

**Note:** Agent doesn't need service URLs (it's called by Gateway, not the other way around)

### **LangGraph Service (Render)**

| Variable Name | Required? | Notes |
|---------------|-----------|-------|
| `DATABASE_URL` | ✅ YES | Same format |
| `API_KEY_SECRET` | ✅ YES | Same value |
| `JWT_SECRET_KEY` | ✅ YES | Same value |
| `CANDIDATE_JWT_SECRET_KEY` | ✅ YES | Same value |
| `GATEWAY_SERVICE_URL` | ✅ YES | Gateway URL |
| `GEMINI_API_KEY` | ⚠️ Optional | For AI workflows |
| `TWILIO_ACCOUNT_SID` | ⚠️ Optional | For WhatsApp/SMS |
| `GMAIL_EMAIL` | ⚠️ Optional | For email notifications |

**Note:** LangGraph uses `pydantic_settings` with `case_sensitive = False`, so:
- `DATABASE_URL` or `database_url` both work ✅
- `API_KEY_SECRET` or `api_key_secret` both work ✅

---

## 🔍 Variable Name Compatibility

### **Case Sensitivity**

| Service | Case Sensitivity | Notes |
|---------|------------------|-------|
| **Gateway** | ✅ Case-sensitive | Use exact names: `DATABASE_URL`, `API_KEY_SECRET` |
| **Agent** | ✅ Case-sensitive | Use exact names: `DATABASE_URL`, `API_KEY_SECRET` |
| **LangGraph** | ✅ Case-insensitive | Accepts both `DATABASE_URL` and `database_url` |

**Recommendation:** Use **UPPERCASE** for all variables to ensure compatibility:
- `DATABASE_URL` ✅ (works for all services)
- `API_KEY_SECRET` ✅ (works for all services)

---

## ✅ Verification Checklist

### **Step 1: Check Variable Names**
- [ ] All variables use **UPPERCASE** (recommended)
- [ ] Variable names match exactly (no typos)
- [ ] No extra spaces in variable names

### **Step 2: Check Required Variables**
**Gateway Service:**
- [ ] `DATABASE_URL` set
- [ ] `API_KEY_SECRET` set
- [ ] `JWT_SECRET_KEY` set
- [ ] `CANDIDATE_JWT_SECRET_KEY` set
- [ ] `AGENT_SERVICE_URL` set
- [ ] `LANGGRAPH_SERVICE_URL` set
- [ ] `GATEWAY_SERVICE_URL` set

**Agent Service:**
- [ ] `DATABASE_URL` set
- [ ] `API_KEY_SECRET` set
- [ ] `JWT_SECRET_KEY` set
- [ ] `CANDIDATE_JWT_SECRET_KEY` set

**LangGraph Service:**
- [ ] `DATABASE_URL` set
- [ ] `API_KEY_SECRET` set
- [ ] `JWT_SECRET_KEY` set
- [ ] `CANDIDATE_JWT_SECRET_KEY` set
- [ ] `GATEWAY_SERVICE_URL` set

### **Step 3: Check Value Format**
- [ ] `DATABASE_URL` starts with `mongodb+srv://`
- [ ] All secrets are set (not empty strings)
- [ ] Service URLs start with `https://` (for production)

---

## 🚫 What You DON'T Need to Do

### **❌ Don't create .env file in Render**
- Render injects environment variables directly
- No `.env` file needed in repository for Render deployment

### **❌ Don't convert variable names**
- Names are already correct
- Just ensure they're set in Render dashboard

### **❌ Don't change code**
- `os.getenv()` works perfectly with Render's environment variables
- No code changes needed

---

## 🔍 How to Verify in Render

### **Method 1: Check Render Logs**

After deployment, check logs for:
- ✅ `MongoDB client (async) initialized` - Database connected
- ✅ `Connected to MongoDB database: bhiv_hr` - DB connection successful
- ❌ `ValueError: DATABASE_URL environment variable is required` - Missing variable

### **Method 2: Test Health Endpoint**

Visit: `https://your-service.onrender.com/health`

Should return:
```json
{
  "status": "healthy",
  "service": "BHIV HR Gateway"
}
```

If you see errors about missing environment variables, check the Render dashboard.

### **Method 3: Check Variable Names**

In Render Dashboard:
1. Go to your service
2. Click "Environment"
3. Verify all variables are listed
4. Check for typos (extra spaces, wrong case)

---

## 📝 Example: Render Environment Variables Setup

```
✅ Correct Format (what to put in Render):

DATABASE_URL=mongodb+srv://user:pass@cluster.net/bhiv_hr?retryWrites=true&w=majority
API_KEY_SECRET=prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o
JWT_SECRET_KEY=bhiv_jwt_secret_key_12345
CANDIDATE_JWT_SECRET_KEY=bhiv_candidate_jwt_secret_key_12345
GATEWAY_SERVICE_URL=https://bhiv-hr-gateway-l0xp.onrender.com
AGENT_SERVICE_URL=https://bhiv-hr-gateway-l0xp.onrender.com
LANGGRAPH_SERVICE_URL=https://bhiv-hr-gateway-l0xp.onrender.com
ENVIRONMENT=production
LOG_LEVEL=INFO
```

**⚠️ Important:** 
- No spaces around `=`
- No quotes needed (Render handles them automatically)
- Use exact variable names

---

## 🎯 Summary

**✅ You're all set!** 

- ✅ No conversion needed
- ✅ No `.env` file needed in Render
- ✅ Just ensure all required variables are set in Render dashboard
- ✅ Use UPPERCASE variable names for best compatibility
- ✅ Code already supports Render's environment variable injection

**Next Step:** Just verify all variables are set correctly in Render dashboard and test the health endpoint!

---

**Last Updated:** January 2026  
**Status:** ✅ Ready for Render - No Code Changes Needed

