# Vercel Frontend + Render Backend Integration Guide

This guide will help you integrate your Vercel-deployed frontend with your Render-deployed backend services.

## Current Setup

### Frontend (Vercel)
- **URL**: https://infiverse-hr.vercel.app/
- **Framework**: React + Vite
- **Status**: ✅ Deployed

### Backend Services (Render)
- **Gateway**: https://bhiv-hr-gateway-l0xp.onrender.com
- **Agent**: https://bhiv-hr-agent-cato.onrender.com
- **LangGraph**: https://bhiv-hr-langgraph-luy9.onrender.com

## Step 1: Verify Frontend Environment Variables in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. Ensure these 4 variables are set for **Production**, **Preview**, and **Development**:

   ```
   VITE_API_BASE_URL=https://bhiv-hr-gateway-l0xp.onrender.com
   VITE_AGENT_SERVICE_URL=https://bhiv-hr-agent-cato.onrender.com
   VITE_LANGGRAPH_URL=https://bhiv-hr-langgraph-luy9.onrender.com
   VITE_API_KEY=prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o
   ```

3. **Important**: 
   - No trailing slashes in URLs
   - No quotes around values
   - Set for all environments (Production, Preview, Development)

4. **Redeploy** after adding/updating variables:
   - Go to **Deployments** tab
   - Click "..." on latest deployment
   - Click "Redeploy"

## Step 2: Verify Backend CORS Configuration

The backend services have been updated to allow CORS from all origins. However, for production, you may want to restrict this.

### Gateway Service (Already Configured)
- ✅ CORS configured with `allow_origins=["*"]`
- ✅ Allows all methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
- ✅ Allows all headers

### Agent Service (Updated)
- ✅ CORS middleware added
- ✅ Allows all origins and methods

### LangGraph Service
- Check if CORS is configured (may need to add)

## Step 3: Test the Integration

### Test 1: Check Backend Health
Open in browser:
```
https://bhiv-hr-gateway-l0xp.onrender.com/health
```

Should return: `{"status": "healthy"}`

### Test 2: Test from Frontend
1. Open your Vercel deployment
2. Open Browser DevTools (F12)
3. Go to **Network** tab
4. Try to use the application
5. Check if API calls are being made to Render URLs
6. Look for any CORS errors (red status codes)

### Test 3: Test API Endpoint Directly
```bash
curl -X GET https://bhiv-hr-gateway-l0xp.onrender.com/v1/jobs \
  -H "Authorization: Bearer prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o"
```

## Step 4: Common Integration Issues & Fixes

### Issue 1: CORS Errors
**Symptoms**: Browser console shows "CORS policy" errors

**Fix**:
- Backend CORS is already configured to allow all origins
- If you see CORS errors, check:
  1. Backend services are running on Render
  2. Frontend is using correct backend URLs
  3. No typos in environment variables

### Issue 2: 401 Unauthorized Errors
**Symptoms**: API calls return 401 status

**Fix**:
- Verify `VITE_API_KEY` is set correctly in Vercel
- Check the API key matches the backend's `API_KEY_SECRET`
- Ensure Authorization header is being sent (check Network tab)

### Issue 3: 404 Not Found Errors
**Symptoms**: API calls return 404

**Fix**:
- Verify backend URLs are correct
- Check backend services are deployed and running
- Verify API endpoint paths are correct

### Issue 4: Timeout Errors
**Symptoms**: Requests timeout after 15 seconds

**Fix**:
- Render services may be sleeping (free tier)
- First request may take longer to wake up
- Consider upgrading Render plan for always-on services

## Step 5: Update Render Environment Variables (Optional)

If you want to restrict CORS to only your Vercel domain:

1. Go to **Render Dashboard** → Your Gateway Service → **Environment**
2. Add environment variable:
   ```
   ALLOWED_ORIGINS=https://infiverse-hr.vercel.app,https://infiverse-hr-git-main.vercel.app,https://infiverse-hr-git-*.vercel.app
   ```
3. Redeploy the service

**Note**: Currently CORS is set to `["*"]` which allows all origins. The above is optional for production security.

**Note**: Currently set to `["*"]` which allows all origins. This is fine for development but consider restricting in production.

## Step 6: Verify Integration Checklist

- [ ] All 4 environment variables set in Vercel
- [ ] Environment variables set for all environments (Production, Preview, Development)
- [ ] Frontend redeployed after setting environment variables
- [ ] Backend services are running on Render
- [ ] Backend health check returns success
- [ ] No CORS errors in browser console
- [ ] API calls visible in Network tab
- [ ] API calls return 200 status (not 401, 404, or 500)

## Step 7: Monitor Integration

### Frontend Monitoring (Vercel)
- Check **Deployments** tab for build status
- Check **Analytics** for errors
- Monitor **Function Logs** if using serverless functions

### Backend Monitoring (Render)
- Check **Logs** tab for each service
- Monitor **Metrics** for performance
- Check **Events** for deployment status

## Step 8: Production Best Practices

### Security
1. **Restrict CORS** to only your Vercel domain (optional but recommended)
2. **Use HTTPS** for all communications
3. **Rotate API keys** regularly
4. **Monitor** for unauthorized access

### Performance
1. **Enable caching** where appropriate
2. **Use CDN** for static assets (Vercel handles this)
3. **Optimize API calls** (batch requests when possible)
4. **Monitor** response times

### Reliability
1. **Set up monitoring** alerts
2. **Configure health checks**
3. **Set up backups** for database
4. **Plan for scaling** as traffic grows

## Troubleshooting Commands

### Test Gateway Service
```bash
curl https://bhiv-hr-gateway-l0xp.onrender.com/health
```

### Test Agent Service
```bash
curl https://bhiv-hr-agent-cato.onrender.com/health
```

### Test LangGraph Service
```bash
curl https://bhiv-hr-langgraph-luy9.onrender.com/health
```

### Test with API Key
```bash
curl -X GET https://bhiv-hr-gateway-l0xp.onrender.com/v1/jobs \
  -H "Authorization: Bearer prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o" \
  -H "Content-Type: application/json"
```

## Quick Integration Test

1. **Open your Vercel deployment**
2. **Open Browser Console** (F12)
3. **Try to login or use any feature**
4. **Check Network tab** for API calls
5. **Verify**:
   - API calls go to Render URLs (not localhost)
   - Status codes are 200 (not errors)
   - No CORS errors in console
   - Data loads correctly

## Support

If integration issues persist:
1. Check browser console for errors
2. Check Vercel build logs
3. Check Render service logs
4. Verify all environment variables
5. Test backend endpoints directly

## Next Steps

After successful integration:
- [ ] Set up monitoring and alerts
- [ ] Configure custom domain (if needed)
- [ ] Set up staging environment
- [ ] Implement error tracking
- [ ] Set up analytics

