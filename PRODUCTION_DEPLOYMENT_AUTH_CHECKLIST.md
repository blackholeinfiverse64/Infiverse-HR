# 🚀 Production Deployment Authentication Checklist

## ✅ **Yes, Authentication Will Work the Same Way!**

The authentication system uses **browser localStorage** which works identically in production. However, you need to configure several things correctly.

---

## 🔐 **Critical Requirements for Production**

### **1. Environment Variables (MUST BE SET)**

All these variables **MUST** be set in your production environment (Render, Vercel, etc.):

#### **Backend Environment Variables:**

```env
# MongoDB Connection
DATABASE_URL=mongodb+srv://user:pass@cluster.net/bhiv_hr?retryWrites=true&w=majority

# JWT Secrets (CRITICAL - Must match!)
CANDIDATE_JWT_SECRET_KEY=<same-secret-as-local>
JWT_SECRET_KEY=<same-secret-as-local>

# API Key
API_KEY_SECRET=<same-secret-as-local>

# Service URLs
AGENT_SERVICE_URL=https://your-agent-service.onrender.com
LANGGRAPH_SERVICE_URL=https://your-langgraph-service.onrender.com
GATEWAY_SERVICE_URL=https://your-gateway-service.onrender.com

# Environment
ENVIRONMENT=production
LOG_LEVEL=INFO
```

#### **Frontend Environment Variables:**

```env
# API Base URL (CRITICAL!)
VITE_API_BASE_URL=https://your-gateway-service.onrender.com
```

**⚠️ IMPORTANT:** The frontend code already handles this:
- **Local dev**: Uses `http://localhost:8000`
- **Production**: Uses `VITE_API_BASE_URL` or falls back to `https://bhiv-hr-gateway-l0xp.onrender.com`

---

## 🔒 **JWT Secret Consistency (CRITICAL!)**

### **Problem:**
If you use **different JWT secrets** in production vs local, tokens created locally won't work in production (and vice versa).

### **Solution:**
Use the **SAME** `CANDIDATE_JWT_SECRET_KEY` in both environments:

```env
# Local .env file
CANDIDATE_JWT_SECRET_KEY=your-secret-here

# Production (Render/Vercel/etc.)
CANDIDATE_JWT_SECRET_KEY=your-secret-here  # SAME VALUE!
```

**⚠️ SECURITY WARNING:** 
- Use a **strong, random secret** (at least 32 characters)
- Never commit secrets to Git
- Use environment variables in production

**Generate Secure Secret:**
```python
import secrets
print(secrets.token_urlsafe(32))
```

---

## 🌐 **CORS Configuration**

### **Current Status:**
The backend needs to allow requests from your frontend domain.

### **Check CORS in `main.py`:**
```python
# Should allow your frontend domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ In production, use specific domains!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **Production CORS (Recommended):**
```python
# Replace "*" with your actual frontend domain
allow_origins=[
    "https://your-frontend-domain.com",
    "https://www.your-frontend-domain.com",
    "http://localhost:5173"  # Keep for local testing
]
```

---

## 📱 **localStorage Behavior**

### **✅ Works the Same in Production:**
- `localStorage` is **browser-based** and works identically
- Tokens stored in `localStorage` persist across:
  - Page refreshes ✅
  - Browser tabs ✅
  - Browser sessions (until logout) ✅
  - Different devices ❌ (each device has separate localStorage)

### **Token Storage:**
```javascript
// These work the same in production:
localStorage.setItem('auth_token', token);
localStorage.setItem('candidate_id', candidateId);
localStorage.setItem('user_data', JSON.stringify(userData));
```

### **Token Retrieval:**
```javascript
// Frontend automatically retrieves and sends token:
const token = localStorage.getItem('auth_token');
// Axios interceptor adds: Authorization: Bearer {token}
```

---

## 🔄 **Authentication Flow (Same in Production)**

### **1. Login:**
```
User → Frontend → POST /v1/candidate/login
Backend → Validates credentials → Returns JWT token
Frontend → Stores token in localStorage
```

### **2. Subsequent Requests:**
```
Frontend → Axios interceptor → Adds Authorization header
Backend → Validates JWT token → Returns data
```

### **3. Logout:**
```
Frontend → Clears localStorage → Redirects to login
```

**✅ This flow works identically in production!**

---

## ✅ **Pre-Deployment Checklist**

### **Backend:**
- [ ] Set `CANDIDATE_JWT_SECRET_KEY` in production environment
- [ ] Set `JWT_SECRET_KEY` in production environment
- [ ] Set `API_KEY_SECRET` in production environment
- [ ] Set `DATABASE_URL` to production MongoDB
- [ ] Configure CORS to allow frontend domain
- [ ] Set `ENVIRONMENT=production`
- [ ] Verify all service URLs are correct

### **Frontend:**
- [ ] Set `VITE_API_BASE_URL` to production backend URL
- [ ] Build frontend: `npm run build`
- [ ] Test that API calls go to production backend
- [ ] Verify CORS allows your frontend domain

### **Testing:**
- [ ] Test login with production backend
- [ ] Verify token is stored in localStorage
- [ ] Test API calls after login (should work!)
- [ ] Test logout (should clear localStorage)
- [ ] Test token expiration handling

---

## 🐛 **Common Production Issues**

### **Issue 1: "401 Unauthorized" After Login**
**Cause:** JWT secret mismatch between local and production
**Fix:** Use the same `CANDIDATE_JWT_SECRET_KEY` in both environments

### **Issue 2: "CORS Error"**
**Cause:** Backend doesn't allow frontend domain
**Fix:** Update CORS `allow_origins` in `main.py`

### **Issue 3: "Network Error" or "Connection Refused"**
**Cause:** Frontend pointing to wrong backend URL
**Fix:** Set `VITE_API_BASE_URL` correctly

### **Issue 4: "Token Not Found"**
**Cause:** localStorage cleared or not set
**Fix:** Check browser console for localStorage errors

---

## 🔍 **How to Verify Production Auth Works**

### **Step 1: Check Environment Variables**
```bash
# In production backend logs, verify:
✅ CANDIDATE_JWT_SECRET_KEY is set
✅ DATABASE_URL is set
✅ API_BASE_URL is correct
```

### **Step 2: Test Login**
```javascript
// In browser console (production frontend):
// 1. Login
// 2. Check localStorage:
console.log(localStorage.getItem('auth_token'));
console.log(localStorage.getItem('candidate_id'));

// 3. Check Network tab:
// - Login request should return 200
// - Subsequent requests should include Authorization header
```

### **Step 3: Check Backend Logs**
```
✅ Authentication successful: Candidate JWT token for user {id}
✅ Token validated successfully
```

---

## 📊 **Production vs Local Comparison**

| Feature | Local | Production | Notes |
|---------|-------|------------|-------|
| **localStorage** | ✅ Works | ✅ Works | Same behavior |
| **JWT Tokens** | ✅ Works | ✅ Works | Must use same secret |
| **API Calls** | `localhost:8000` | Production URL | Set via env var |
| **CORS** | Usually permissive | Must configure | Set allowed origins |
| **Database** | Local/Dev DB | Production DB | Different connection |
| **Environment** | `development` | `production` | Set via env var |

---

## 🎯 **Summary**

### **✅ Authentication WILL work in production IF:**
1. ✅ Same JWT secrets are used (local and production)
2. ✅ Frontend `VITE_API_BASE_URL` points to production backend
3. ✅ Backend CORS allows frontend domain
4. ✅ All environment variables are set correctly
5. ✅ Database connection is configured

### **✅ localStorage works identically:**
- Tokens stored in browser localStorage
- Persist across page refreshes
- Work the same in production

### **⚠️ Important Notes:**
- **JWT secrets must match** between environments
- **CORS must be configured** for production domain
- **Environment variables must be set** in production platform
- **Test thoroughly** before going live

---

## 🚀 **Quick Start for Production**

1. **Set Backend Environment Variables:**
   ```env
   CANDIDATE_JWT_SECRET_KEY=<your-secret>
   DATABASE_URL=<production-mongodb-url>
   VITE_API_BASE_URL=https://your-backend.onrender.com
   ```

2. **Set Frontend Environment Variable:**
   ```env
   VITE_API_BASE_URL=https://your-backend.onrender.com
   ```

3. **Update CORS in `main.py`:**
   ```python
   allow_origins=["https://your-frontend-domain.com"]
   ```

4. **Deploy and Test:**
   - Login → Should work ✅
   - API calls → Should work ✅
   - Logout → Should clear localStorage ✅

---

**✅ Your authentication will work the same way in production as it does locally, as long as you configure the environment variables correctly!**

