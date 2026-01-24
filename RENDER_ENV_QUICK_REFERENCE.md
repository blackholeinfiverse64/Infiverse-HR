# Render Environment Variables - Quick Reference

## Add to Each Render Backend Service

### Environment Variable to Add:

**Key:**
```
ALLOWED_ORIGINS
```

**Value:**
```
https://infiverse-hr.vercel.app,https://infiverse-hr-git-main.vercel.app,https://infiverse-hr-git-*.vercel.app
```

---

## Services to Update:

1. ✅ **Gateway** (bhiv-hr-gateway-l0xp)
2. ✅ **Agent** (bhiv-hr-agent-cato)
3. ✅ **LangGraph** (bhiv-hr-langgraph-luy9)

---

## Steps for Each Service:

1. Render Dashboard → Your Service
2. Click **"Environment"** (left sidebar)
3. Click **"Add Environment Variable"**
4. **Key**: `ALLOWED_ORIGINS`
5. **Value**: `https://infiverse-hr.vercel.app,https://infiverse-hr-git-main.vercel.app,https://infiverse-hr-git-*.vercel.app`
6. Click **"Save Changes"**
7. (Optional) Redeploy service

---

## Note:

**This is OPTIONAL** - Your backend already allows all origins (`["*"]`), so the integration will work without this. Adding it is for production security best practices.

