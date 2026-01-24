# Vercel + Render Integration Checklist

## ✅ Quick Integration Steps

### 1. Frontend (Vercel) - Environment Variables

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Add these 4 variables (for Production, Preview, and Development):

```
VITE_API_BASE_URL=https://bhiv-hr-gateway-l0xp.onrender.com
VITE_AGENT_SERVICE_URL=https://bhiv-hr-agent-cato.onrender.com
VITE_LANGGRAPH_URL=https://bhiv-hr-langgraph-luy9.onrender.com
VITE_API_KEY=prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o
```

**After adding**: Redeploy your Vercel project

### 2. Backend (Render) - CORS Configuration

✅ **Already Done**: All backend services now have CORS configured to allow all origins

- Gateway: ✅ CORS enabled
- Agent: ✅ CORS enabled  
- LangGraph: ✅ CORS enabled

### 3. Test Integration

1. **Open your Vercel deployment URL**
2. **Open Browser Console** (F12)
3. **Go to Network tab**
4. **Try to use the app** (login, view dashboard, etc.)
5. **Check**:
   - ✅ API calls go to Render URLs (not localhost)
   - ✅ Status codes are 200 (not 401, 404, 500)
   - ✅ No CORS errors in console
   - ✅ Data loads correctly

### 4. Verify Backend Services

Test each backend service:

```bash
# Gateway
curl https://bhiv-hr-gateway-l0xp.onrender.com/health

# Agent  
curl https://bhiv-hr-agent-cato.onrender.com/health

# LangGraph
curl https://bhiv-hr-langgraph-luy9.onrender.com/health
```

All should return `{"status": "healthy"}` or similar.

## Common Issues & Quick Fixes

### Blank Screen
- ✅ Check browser console (F12) for errors
- ✅ Verify all 4 environment variables are set in Vercel
- ✅ Redeploy after setting environment variables

### CORS Errors
- ✅ Backend CORS is already configured
- ✅ Check backend services are running
- ✅ Verify frontend URLs are correct

### 401 Unauthorized
- ✅ Check `VITE_API_KEY` matches backend `API_KEY_SECRET`
- ✅ Verify Authorization header is being sent

### 404 Not Found
- ✅ Verify backend URLs are correct
- ✅ Check backend services are deployed

## Integration Status

- [x] Frontend deployed on Vercel
- [x] Backend services deployed on Render
- [x] CORS configured on all backend services
- [ ] Environment variables set in Vercel
- [ ] Frontend redeployed with environment variables
- [ ] Integration tested and working

## Next Steps

1. Set environment variables in Vercel
2. Redeploy frontend
3. Test the integration
4. Monitor for errors

See `VERCEL_RENDER_INTEGRATION.md` for detailed guide.

