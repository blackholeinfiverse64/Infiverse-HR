# Test Your Integration: https://infiverse-hr.vercel.app/

## Quick Test Steps

### 1. Test Backend Services (Run in Terminal)

```bash
# Test Gateway
curl https://bhiv-hr-gateway-l0xp.onrender.com/health

# Test Agent
curl https://bhiv-hr-agent-cato.onrender.com/health

# Test LangGraph  
curl https://bhiv-hr-langgraph-luy9.onrender.com/health
```

**Expected**: All should return `{"status": "healthy"}` or similar

### 2. Test Frontend → Backend Connection

1. **Open**: https://infiverse-hr.vercel.app/
2. **Press F12** → Go to **Network** tab
3. **Try to use the app** (login, view dashboard, etc.)
4. **Check Network tab**:
   - Look for requests to `bhiv-hr-gateway-l0xp.onrender.com`
   - Status should be **200** (green)
   - No **CORS** errors
   - No **401** (Unauthorized) errors
   - No **404** (Not Found) errors

### 3. Check Browser Console

1. **Press F12** → Go to **Console** tab
2. **Look for**:
   - ✅ No red errors
   - ✅ API calls are being made
   - ✅ Environment variables are loaded

### 4. Verify Environment Variables

In browser console, run:
```javascript
console.log({
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  AGENT_URL: import.meta.env.VITE_AGENT_SERVICE_URL,
  LANGGRAPH_URL: import.meta.env.VITE_LANGGRAPH_URL
})
```

**Expected**: Should show your Render URLs (not undefined)

## Common Issues

### ❌ Blank Screen
**Fix**: 
- Check console for errors
- Verify environment variables in Vercel
- Redeploy after setting variables

### ❌ CORS Errors
**Fix**: 
- Backend CORS is configured ✅
- Check backend services are running

### ❌ 401 Errors
**Fix**: 
- Verify `VITE_API_KEY` is set correctly
- Check it matches backend API key

### ❌ 404 Errors
**Fix**: 
- Verify backend URLs are correct
- Check backend services are deployed

## Success Indicators

✅ **Working Integration:**
- Page loads (not blank)
- No console errors
- Network tab shows API calls to Render
- Status codes are 200
- Data appears in the app

## Next Steps After Integration

1. Test all features:
   - Login/Authentication
   - Dashboard loading
   - Job creation
   - Candidate search
   - AI matching
   - Interview scheduling

2. Monitor for errors:
   - Check Vercel logs
   - Check Render logs
   - Monitor browser console

3. Optimize:
   - Enable caching
   - Monitor performance
   - Set up alerts

