# Quick Deployment Checklist

## Before Deploying to Vercel

- [ ] Code is committed and pushed to GitHub
- [ ] Build works locally (`npm run build`)
- [ ] All environment variables are documented

## Vercel Deployment Steps

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "Add New Project"**
3. **Import your GitHub repository**
4. **Configure project:**
   - Root Directory: `frontend`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Add Environment Variables:**
   ```
   VITE_API_BASE_URL=https://bhiv-hr-gateway-l0xp.onrender.com
   VITE_AGENT_SERVICE_URL=https://bhiv-hr-agent-cato.onrender.com
   VITE_LANGGRAPH_URL=https://bhiv-hr-langgraph-luy9.onrender.com
   VITE_API_KEY=prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o
   ```
6. **Click "Deploy"**
7. **Wait for build to complete**
8. **Test your deployed application**

## Backend Services (Already Deployed on Render)

- **Gateway**: https://bhiv-hr-gateway-l0xp.onrender.com
- **Agent**: https://bhiv-hr-agent-cato.onrender.com
- **LangGraph**: https://bhiv-hr-langgraph-luy9.onrender.com

## Need Help?

See `VERCEL_DEPLOYMENT.md` for detailed instructions.

