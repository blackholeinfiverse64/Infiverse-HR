# Quick Start: Integrate Vercel Frontend with Render Backend

## ⚡ 5-Minute Setup

### Step 1: Set Environment Variables in Vercel (2 minutes)

1. Go to [vercel.com](https://vercel.com) → Your Project
2. Click **Settings** → **Environment Variables**
3. Add these 4 variables (one at a time):

   **Variable 1:**
   - Name: `VITE_API_BASE_URL`
   - Value: `https://bhiv-hr-gateway-l0xp.onrender.com`
   - Environments: ✅ Production ✅ Preview ✅ Development

   **Variable 2:**
   - Name: `VITE_AGENT_SERVICE_URL`
   - Value: `https://bhiv-hr-agent-cato.onrender.com`
   - Environments: ✅ Production ✅ Preview ✅ Development

   **Variable 3:**
   - Name: `VITE_LANGGRAPH_URL`
   - Value: `https://bhiv-hr-langgraph-luy9.onrender.com`
   - Environments: ✅ Production ✅ Preview ✅ Development

   **Variable 4:**
   - Name: `VITE_API_KEY`
   - Value: `prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o`
   - Environments: ✅ Production ✅ Preview ✅ Development

### Step 2: Redeploy (1 minute)

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Wait 2-3 minutes for build to complete

### Step 3: Test (2 minutes)

1. Open your Vercel deployment URL
2. Press **F12** to open Developer Tools
3. Go to **Console** tab - should have no errors
4. Go to **Network** tab
5. Try to use the app (login, view dashboard)
6. Check Network tab:
   - ✅ API calls go to Render URLs
   - ✅ Status codes are 200 (green)
   - ✅ No CORS errors

## ✅ Done!

Your frontend is now integrated with your backend!

## Troubleshooting

**Blank Screen?**
- Check browser console (F12) for errors
- Verify all 4 environment variables are set
- Redeploy after setting variables

**CORS Errors?**
- Backend CORS is already configured ✅
- Check backend services are running on Render

**401 Errors?**
- Verify `VITE_API_KEY` is correct
- Check it matches backend API key

## Backend Services Status

Check if services are running:
- Gateway: https://bhiv-hr-gateway-l0xp.onrender.com/health
- Agent: https://bhiv-hr-agent-cato.onrender.com/health
- LangGraph: https://bhiv-hr-langgraph-luy9.onrender.com/health

All should return `{"status": "healthy"}`

