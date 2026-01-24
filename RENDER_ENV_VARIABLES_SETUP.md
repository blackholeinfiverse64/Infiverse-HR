# Render Backend Environment Variables Setup

## Add Vercel Frontend URL to Render Backend Services

You need to add your Vercel frontend URL to each Render backend service so they can allow CORS requests from your frontend.

## Your Vercel Frontend URL
**https://infiverse-hr.vercel.app/**

---

## Step-by-Step: Add Environment Variable to Render

### For Gateway Service (bhiv-hr-gateway-l0xp)

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Click on your Gateway service**: `bhiv-hr-gateway-l0xp`
3. **Click "Environment"** (left sidebar)
4. **Click "Add Environment Variable"**
5. **Add this variable**:
   - **Key**: `ALLOWED_ORIGINS`
   - **Value**: `https://infiverse-hr.vercel.app,https://infiverse-hr-git-main.vercel.app,https://infiverse-hr-git-*.vercel.app`
   - **Click "Save Changes"**
6. **Redeploy** the service (optional but recommended)

### For Agent Service (bhiv-hr-agent-cato)

1. **Go to Render Dashboard**
2. **Click on your Agent service**: `bhiv-hr-agent-cato`
3. **Click "Environment"** (left sidebar)
4. **Click "Add Environment Variable"**
5. **Add this variable**:
   - **Key**: `ALLOWED_ORIGINS`
   - **Value**: `https://infiverse-hr.vercel.app,https://infiverse-hr-git-main.vercel.app,https://infiverse-hr-git-*.vercel.app`
   - **Click "Save Changes"**
6. **Redeploy** the service (optional but recommended)

### For LangGraph Service (bhiv-hr-langgraph-luy9)

1. **Go to Render Dashboard**
2. **Click on your LangGraph service**: `bhiv-hr-langgraph-luy9`
3. **Click "Environment"** (left sidebar)
4. **Click "Add Environment Variable"**
5. **Add this variable**:
   - **Key**: `ALLOWED_ORIGINS`
   - **Value**: `https://infiverse-hr.vercel.app,https://infiverse-hr-git-main.vercel.app,https://infiverse-hr-git-*.vercel.app`
   - **Click "Save Changes"**
6. **Redeploy** the service (optional but recommended)

---

## Environment Variable Details

### Key (Variable Name):
```
ALLOWED_ORIGINS
```

### Value (Variable Value):
```
https://infiverse-hr.vercel.app,https://infiverse-hr-git-main.vercel.app,https://infiverse-hr-git-*.vercel.app
```

**Explanation:**
- `https://infiverse-hr.vercel.app` - Your main production URL
- `https://infiverse-hr-git-main.vercel.app` - Preview deployment URL
- `https://infiverse-hr-git-*.vercel.app` - All preview branch URLs

**Note**: Currently, backend CORS is set to `["*"]` which allows all origins. Adding this variable is optional but recommended for production security.

---

## Quick Copy-Paste

### For Gateway Service:
```
Key: ALLOWED_ORIGINS
Value: https://infiverse-hr.vercel.app,https://infiverse-hr-git-main.vercel.app,https://infiverse-hr-git-*.vercel.app
```

### For Agent Service:
```
Key: ALLOWED_ORIGINS
Value: https://infiverse-hr.vercel.app,https://infiverse-hr-git-main.vercel.app,https://infiverse-hr-git-*.vercel.app
```

### For LangGraph Service:
```
Key: ALLOWED_ORIGINS
Value: https://infiverse-hr.vercel.app,https://infiverse-hr-git-main.vercel.app,https://infiverse-hr-git-*.vercel.app
```

---

## After Adding Variables

1. **Redeploy each service** (optional but recommended):
   - Go to each service → **Manual Deploy** → **Deploy latest commit**
   - Or wait for auto-deploy (if enabled)

2. **Test the integration**:
   - Open https://infiverse-hr.vercel.app/
   - Check browser console (F12) for errors
   - Verify API calls work

---

## Important Notes

- **Current Status**: Backend CORS is already set to `["*"]` which allows all origins
- **This is Optional**: Adding `ALLOWED_ORIGINS` is for production security best practices
- **If you don't add it**: The integration will still work because CORS allows all origins
- **If you add it**: The backend will only accept requests from your specific Vercel domain

---

## Alternative: Keep CORS Open (Current Setup)

If you want to keep CORS open to all origins (current setup), you don't need to add this variable. The backend will work with your Vercel frontend without any changes.

The integration will work either way!

