# 🏠 Local Development Setup Guide

## 📋 Overview

This guide helps you configure the BHIV HR Platform for **local development and testing** before deploying to production. The platform supports automatic environment detection for seamless switching between local and production environments.

---

## 🔧 Quick Setup

### **1. Backend Configuration**

**File:** `backend/.env`

```bash
# Set environment to development for local testing
ENVIRONMENT=development

# Local Service URLs (auto-used when ENVIRONMENT=development)
GATEWAY_SERVICE_URL=http://localhost:8000
AGENT_SERVICE_URL=http://localhost:9000
LANGGRAPH_SERVICE_URL=http://localhost:9001
LANGGRAPH_URL=http://localhost:9001
```

**For Production:** Change `ENVIRONMENT=production` and the URLs will automatically use Render production URLs.

---

### **2. Frontend Configuration**

**File:** `frontend/.env`

```bash
# API Gateway
VITE_API_BASE_URL=http://localhost:8000
VITE_REACT_APP_GATEWAY_URL=http://localhost:8000

# LangGraph Service (auto-detects based on hostname)
VITE_LANGGRAPH_URL=http://localhost:9001
```

**Auto-Detection:** The frontend automatically detects:
- `localhost` or `127.0.0.1` → Uses local URL (`http://localhost:9001`)
- Any other hostname → Uses production URL (`https://bhiv-hr-langgraph-luy9.onrender.com`)

---

## 🚀 Starting Local Services

### **Option A: Docker Compose (Recommended)**

```bash
# Start all services
docker-compose up -d

# Start specific services
docker-compose up backend-gateway-1 -d

# View logs
docker logs backend-gateway-1 --follow
```

**Services Running:**
- Gateway: `http://localhost:8000`
- LangGraph: `http://localhost:9001` (if configured)
- Frontend: `http://localhost:5173` (via npm)

---

### **Option B: Manual Start**

#### **Backend:**
```bash
cd backend
python -m uvicorn services.gateway.app.main:app --reload --port 8000
```

#### **LangGraph Service:**
```bash
cd backend/services/langgraph
python -m uvicorn app:app --reload --port 9001
```

#### **Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🧪 Testing Configuration

### **Test 1: Verify Environment Detection (Backend)**

```bash
# Check backend logs when starting
docker logs backend-gateway-1 --tail 100 | grep "LangGraph URL"

# Expected output:
🔧 [Welcome Email] Using LangGraph URL: http://localhost:9001 (Environment: development)
🔧 [Grouped Notifications] Using LangGraph URL: http://localhost:9001 (Environment: development)
🔧 [Per-Job Notifications] Using LangGraph URL: http://localhost:9001 (Environment: development)
```

### **Test 2: Verify Environment Detection (Frontend)**

```bash
# Open browser console (F12)
# Trigger a notification send
# Look for:
🔧 Using LangGraph URL: http://localhost:9001 (Development: true)
```

### **Test 3: Test Welcome Email (Local)**

```bash
# 1. Register a new candidate
curl -X POST http://localhost:8000/v1/candidate/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "SecurePass123"
  }'

# 2. Check backend logs
docker logs backend-gateway-1 --tail 20

# Expected output:
🔧 [Welcome Email] Using LangGraph URL: http://localhost:9001 (Environment: development)
✅ Welcome email sent successfully to test@example.com
```

---

## 🔄 Switching Environments

### **Local Development → Production**

#### **Backend:**
```bash
# Edit backend/.env
ENVIRONMENT=production

# Restart backend
docker-compose restart backend-gateway-1
```

#### **Frontend:**
```bash
# Option 1: Change .env
VITE_LANGGRAPH_URL=https://bhiv-hr-langgraph-luy9.onrender.com

# Option 2: Remove VITE_LANGGRAPH_URL entirely (auto-detects)
# (Remove the line or comment it out)

# Rebuild
npm run build
```

---

### **Production → Local Development**

#### **Backend:**
```bash
# Edit backend/.env
ENVIRONMENT=development

# Restart backend
docker-compose restart backend-gateway-1
```

#### **Frontend:**
```bash
# Edit frontend/.env
VITE_LANGGRAPH_URL=http://localhost:9001

# Restart dev server
npm run dev
```

---

## 🌐 Environment Detection Logic

### **Backend (Python)**

```python
# Auto-detects from ENVIRONMENT variable
environment = os.getenv("ENVIRONMENT", "production").lower()

if environment == "development" or environment == "local":
    langgraph_url = "http://localhost:9001"  # Local
else:
    langgraph_url = "https://bhiv-hr-langgraph-luy9.onrender.com"  # Production

# Can override with LANGGRAPH_URL or LANGGRAPH_SERVICE_URL
langgraph_url = os.getenv("LANGGRAPH_URL", langgraph_url)
```

### **Frontend (TypeScript)**

```typescript
// Auto-detects from hostname
const isDevelopment = 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1'

const langgraphUrl = import.meta.env.VITE_LANGGRAPH_URL || 
  (isDevelopment ? 'http://localhost:9001' : 'https://bhiv-hr-langgraph-luy9.onrender.com')
```

---

## 📊 Service URLs Reference

### **Local Development**

| Service | URL | Port |
|---------|-----|------|
| Gateway API | `http://localhost:8000` | 8000 |
| Agent Service | `http://localhost:9000` | 9000 |
| **LangGraph Automation** | **`http://localhost:9001`** | **9001** |
| Frontend | `http://localhost:5173` | 5173 |

### **Production (Render)**

| Service | URL |
|---------|-----|
| Gateway API | `https://bhiv-hr-gateway-ltg0.onrender.com` |
| Agent Service | `https://bhiv-hr-agent-nhgg.onrender.com` |
| **LangGraph Automation** | **`https://bhiv-hr-langgraph-luy9.onrender.com`** |
| Frontend | `https://your-frontend.vercel.app` |

---

## 🐛 Troubleshooting

### **Issue: Backend still using production URL**

**Check:**
```bash
# 1. Verify .env file
cat backend/.env | grep ENVIRONMENT
# Should show: ENVIRONMENT=development

# 2. Restart backend
docker-compose restart backend-gateway-1

# 3. Check logs
docker logs backend-gateway-1 --tail 50 | grep "LangGraph URL"
# Should show: http://localhost:9001 (Environment: development)
```

---

### **Issue: Frontend still using production URL**

**Check:**
```bash
# 1. Verify .env file
cat frontend/.env | grep LANGGRAPH
# Should show: VITE_LANGGRAPH_URL=http://localhost:9001

# 2. Restart dev server
npm run dev

# 3. Clear browser cache and reload
# Ctrl+Shift+R (hard reload)

# 4. Check browser console
# Should show: Using LangGraph URL: http://localhost:9001 (Development: true)
```

---

### **Issue: Connection refused to localhost:9001**

**Cause:** LangGraph service not running

**Fix:**
```bash
# Check if service is running
curl http://localhost:9001/health

# If not running, start it
docker-compose up langgraph-service -d
# OR manually:
cd backend/services/langgraph
python -m uvicorn app:app --reload --port 9001
```

---

### **Issue: Welcome emails not sending locally**

**Expected Behavior:** If LangGraph service is not running locally, emails will fail BUT registration still succeeds (non-blocking).

**Check:**
```bash
# Backend logs should show:
❌ Failed to send welcome email to test@example.com: Connection refused

# This is OK for local testing without LangGraph running
# Registration still completes successfully
```

**To test emails locally:**
1. Start LangGraph service: `docker-compose up langgraph-service -d`
2. Configure email provider (Twilio/SendGrid) in `.env`
3. Retry registration

---

## ✅ Verification Checklist

| Check | Command | Expected Result |
|-------|---------|----------------|
| **Backend Environment** | `cat backend/.env \\| grep ENVIRONMENT` | `ENVIRONMENT=development` |
| **Backend Detecting Local** | `docker logs backend-gateway-1 \\| grep "LangGraph URL"` | `http://localhost:9001 (Environment: development)` |
| **Frontend Environment** | `cat frontend/.env \\| grep LANGGRAPH` | `VITE_LANGGRAPH_URL=http://localhost:9001` |
| **Frontend Detecting Local** | Check browser console | `Using LangGraph URL: http://localhost:9001 (Development: true)` |
| **Local Services Running** | `curl http://localhost:8000/health` | `{"status": "healthy"}` |
| **LangGraph Available** | `curl http://localhost:9001/health` | `200 OK` or connection msg |

---

## 🚢 Deployment to Production

### **1. Update Environment**

**Backend `.env`:**
```bash
ENVIRONMENT=production
```

**Frontend `.env` (or remove VITE_LANGGRAPH_URL):**
```bash
# Comment out or remove to use auto-detection
# VITE_LANGGRAPH_URL=http://localhost:9001
```

### **2. Build**

```bash
# Frontend
cd frontend
npm run build

# Deploy dist/ to Vercel/Netlify
```

### **3. Verify Production**

```bash
# Check production logs (Render dashboard)
# Should show:
🔧 [Welcome Email] Using LangGraph URL: https://bhiv-hr-langgraph-luy9.onrender.com (Environment: production)
```

---

## 📚 Additional Resources

- **Backend Environment Variables:** `backend/.env`
- **Frontend Environment Variables:** `frontend/.env`
- **Docker Compose:** `docker-compose.yml`
- **Full Documentation:** [NOTIFICATION_SYSTEM_CHANGES.md](NOTIFICATION_SYSTEM_CHANGES.md)

---

## 🎯 Summary

**Local Development:**
- Set `ENVIRONMENT=development` in `backend/.env`
- Set `VITE_LANGGRAPH_URL=http://localhost:9001` in `frontend/.env`
- Restart services
- URLs automatically use `localhost:9001`

**Production:**
- Set `ENVIRONMENT=production` in `backend/.env`
- Remove or comment `VITE_LANGGRAPH_URL` in `frontend/.env`
- Deploy
- URLs automatically use Render production URLs

**Auto-Detection:** Both backend and frontend intelligently detect the environment and use appropriate URLs. No manual code changes needed! 🎉
