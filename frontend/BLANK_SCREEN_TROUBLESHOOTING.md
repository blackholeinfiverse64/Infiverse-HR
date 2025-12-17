# Blank Screen Troubleshooting Guide

If you're seeing a blank screen after deploying to Vercel, follow these steps:

## Step 1: Check Browser Console

1. Open your deployed site
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. Look for any **red error messages**

### Common Errors:

#### Error: "Cannot read property of undefined"
- **Fix**: Environment variables not set correctly
- **Solution**: Check Vercel environment variables

#### Error: "Failed to fetch" or CORS errors
- **Fix**: Backend API not accessible
- **Solution**: Verify backend URLs are correct

#### Error: "Module not found"
- **Fix**: Build issue
- **Solution**: Rebuild in Vercel

## Step 2: Verify Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

**Required Variables:**
```
VITE_API_BASE_URL=https://bhiv-hr-gateway-l0xp.onrender.com
VITE_AGENT_SERVICE_URL=https://bhiv-hr-agent-cato.onrender.com
VITE_LANGGRAPH_URL=https://bhiv-hr-langgraph-luy9.onrender.com
VITE_API_KEY=prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o
```

**Important:**
- Make sure they're set for **Production**, **Preview**, and **Development**
- No trailing slashes in URLs
- No quotes around values

## Step 3: Check Network Tab

1. Open Developer Tools → **Network** tab
2. Refresh the page
3. Look for failed requests (red status codes)

### Common Issues:

- **404 errors**: Files not found - rebuild needed
- **CORS errors**: Backend not allowing your Vercel domain
- **500 errors**: Backend server issues

## Step 4: Verify Build Output

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Check **Build Logs** for errors

### If Build Failed:
- Check for TypeScript errors
- Verify all dependencies are installed
- Check Node.js version (should be 18+)

## Step 5: Test Locally First

Before deploying, test the production build locally:

```bash
cd frontend
npm run build
npm run preview
```

If it works locally but not on Vercel, it's likely an environment variable issue.

## Step 6: Common Fixes

### Fix 1: Clear Browser Cache
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or clear browser cache completely

### Fix 2: Check Base Path
- Verify `vercel.json` exists in `frontend` directory
- Ensure rewrites are configured correctly

### Fix 3: Supabase Configuration
If you're using Supabase:
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to Vercel
- Or remove Supabase if not needed (app will use localStorage auth)

### Fix 4: Rebuild Deployment
1. Go to Vercel Dashboard
2. Click on your project
3. Go to Deployments tab
4. Click "..." on latest deployment
5. Click "Redeploy"

## Step 7: Debug Mode

Add this to `src/main.tsx` temporarily to see errors:

```typescript
// Add before ReactDOM.createRoot
console.log('Environment:', {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  NODE_ENV: import.meta.env.MODE
})
```

## Step 8: Check Error Boundary

The app now has an ErrorBoundary that should catch React errors. If you see the error screen:
- Click "Reload Page"
- Check "Error Details" for the actual error
- Share the error message for debugging

## Quick Checklist

- [ ] Browser console shows no errors
- [ ] All environment variables are set in Vercel
- [ ] Build completed successfully in Vercel
- [ ] Network tab shows no failed requests
- [ ] Tried hard refresh (Ctrl+Shift+R)
- [ ] Checked Vercel deployment logs
- [ ] Tested production build locally (`npm run preview`)

## Still Not Working?

1. **Share the error message** from browser console
2. **Check Vercel build logs** for any warnings
3. **Verify backend services** are running on Render
4. **Test API endpoints** directly using Postman/curl

## Most Common Cause

**90% of blank screen issues are caused by:**
- Missing or incorrect environment variables in Vercel
- JavaScript errors in the console (check F12)

Fix these first!

