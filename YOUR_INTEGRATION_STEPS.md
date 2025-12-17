# Integration Steps for https://infiverse-hr.vercel.app/

## ✅ Your Deployment URLs

- **Frontend (Vercel)**: https://infiverse-hr.vercel.app/
- **Backend Gateway**: https://bhiv-hr-gateway-l0xp.onrender.com
- **Backend Agent**: https://bhiv-hr-agent-cato.onrender.com
- **Backend LangGraph**: https://bhiv-hr-langgraph-luy9.onrender.com

## 🚀 Step-by-Step Integration

### Step 1: Set Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project (infiverse-hr)
3. Go to **Settings** → **Environment Variables**
4. Add these 4 variables:

   **Variable 1:**
   ```
   Name: VITE_API_BASE_URL
   Value: https://bhiv-hr-gateway-l0xp.onrender.com
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

   **Variable 2:**
   ```
   Name: VITE_AGENT_SERVICE_URL
   Value: https://bhiv-hr-agent-cato.onrender.com
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

   **Variable 3:**
   ```
   Name: VITE_LANGGRAPH_URL
   Value: https://bhiv-hr-langgraph-luy9.onrender.com
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

   **Variable 4:**
   ```
   Name: VITE_API_KEY
   Value: prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

5. Click **Save** after each variable

### Step 2: Redeploy Your Frontend

1. Go to **Deployments** tab in Vercel
2. Click **"..."** (three dots) on the latest deployment
3. Click **"Redeploy"**
4. Wait 2-3 minutes for the build to complete

### Step 3: Test the Integration

1. **Open your site**: https://infiverse-hr.vercel.app/
2. **Open Browser DevTools**: Press `F12`
3. **Go to Console tab**: Check for any errors
4. **Go to Network tab**: 
   - Try to login or use any feature
   - Look for API calls
   - Verify they go to Render URLs (not localhost)
   - Check status codes (should be 200, not 401/404/500)

### Step 4: Verify Backend Services

Test each backend service to ensure they're running:

```bash
# Test Gateway
curl https://bhiv-hr-gateway-l0xp.onrender.com/health

# Test Agent
curl https://bhiv-hr-agent-cato.onrender.com/health

# Test LangGraph
curl https://bhiv-hr-langgraph-luy9.onrender.com/health
```

All should return: `{"status": "healthy"}` or similar

## 🔍 Troubleshooting

### If you see a blank screen:

1. **Check Browser Console** (F12):
   - Look for red error messages
   - Share the error if you see one

2. **Verify Environment Variables**:
   - Go to Vercel → Settings → Environment Variables
   - Ensure all 4 variables are set
   - Check they're set for Production, Preview, AND Development

3. **Redeploy**:
   - After setting environment variables, you MUST redeploy
   - Go to Deployments → Click "..." → Redeploy

### If you see CORS errors:

- ✅ Backend CORS is already configured
- Check backend services are running on Render
- Verify frontend URLs are correct

### If you see 401 Unauthorized:

- Check `VITE_API_KEY` matches backend `API_KEY_SECRET`
- Verify Authorization header is being sent (check Network tab)

### If you see 404 Not Found:

- Verify backend URLs are correct
- Check backend services are deployed and running

## ✅ Integration Checklist

- [ ] All 4 environment variables set in Vercel
- [ ] Environment variables set for all environments (Production, Preview, Development)
- [ ] Frontend redeployed after setting environment variables
- [ ] Backend services running on Render (test health endpoints)
- [ ] No errors in browser console
- [ ] API calls visible in Network tab
- [ ] API calls return 200 status (not errors)
- [ ] Data loads correctly in the application

## 🎯 Quick Test

1. Visit: https://infiverse-hr.vercel.app/
2. Open DevTools (F12) → Network tab
3. Try to login or view dashboard
4. Check Network tab:
   - ✅ Requests go to `bhiv-hr-gateway-l0xp.onrender.com`
   - ✅ Status codes are 200 (green)
   - ✅ No CORS errors
   - ✅ Data appears in the app

## 📞 Need Help?

If you're still seeing issues:
1. Share the error message from browser console (F12)
2. Share any failed requests from Network tab
3. Verify backend services are running (test health endpoints)

Your integration should work once environment variables are set and frontend is redeployed!

