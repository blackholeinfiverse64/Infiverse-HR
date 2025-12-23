# Critical: Check Your Supabase Project Status

## ⚠️ Most Common Cause: Project is Paused

The "Failed to fetch" / "AuthRetryableFetchError" error **almost always** means your Supabase project is **paused**.

### How to Check & Fix:

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Login with your account

2. **Find Your Project:**
   - Look for project: `smcgaaecckvngkhvsanb`
   - Or search by the URL: `https://smcgaaecckvngkhvsanb.supabase.co`

3. **Check Project Status:**
   - If you see **"Paused"** or **"Inactive"** → Click **"Restore"** or **"Resume"**
   - Wait **1-2 minutes** for the project to fully start

4. **Verify Project is Active:**
   - Status should show **"Active"** (green)
   - You should be able to access the dashboard

## 🔑 Verify Your API Key

The anon key you provided starts with `sb_publishable_` which is unusual. 

**Standard Supabase anon keys:**
- Usually start with `eyJ` (JWT format)
- Or are labeled as "anon public" key

**To get the correct key:**

1. Go to Supabase Dashboard → Your Project
2. Click **Settings** (gear icon) → **API**
3. Under **"Project API keys"**, find **"anon public"** key
4. Copy that key (it should start with `eyJ` or be a long string)
5. Update your `.env` file:

```env
VITE_SUPABASE_URL=https://smcgaaecckvngkhvsanb.supabase.co
VITE_SUPABASE_ANON_KEY=<paste-the-anon-public-key-here>
```

6. **Restart your dev server** after updating

## 🧪 Test Connection

After ensuring project is active, test in browser console:

```javascript
// Test 1: Check if project is reachable
fetch('https://smcgaaecckvngkhvsanb.supabase.co/rest/v1/', {
  headers: { 'apikey': 'YOUR_ANON_KEY_HERE' }
})
.then(r => console.log('✅ Status:', r.status))
.catch(e => console.error('❌ Error:', e))
```

## 📋 Quick Checklist

- [ ] Supabase project is **Active** (not paused)
- [ ] Using correct **anon public** key (not service role key)
- [ ] Key starts with `eyJ` or is the "anon public" key from dashboard
- [ ] `.env` file is in `frontend/` directory
- [ ] Dev server was **restarted** after creating/updating `.env`
- [ ] No typos in URL (no trailing slash)
- [ ] Internet connection is working

## 🆘 Still Not Working?

1. **Check Supabase Status Page:**
   - https://status.supabase.com/
   - Ensure all services are operational

2. **Try Different Browser:**
   - Sometimes extensions block requests
   - Try Chrome/Firefox/Edge
   - Try incognito mode

3. **Check Browser Console Network Tab:**
   - Open DevTools → Network
   - Try to sign up
   - Look for requests to `*.supabase.co`
   - Check the error message in the failed request

4. **Verify Project URL:**
   - In Supabase Dashboard → Settings → API
   - Verify "Project URL" matches: `https://smcgaaecckvngkhvsanb.supabase.co`

## 💡 Important Notes

- **Free tier projects pause after 7 days of inactivity**
- You need to manually restore them from the dashboard
- After restoring, wait 1-2 minutes before testing
- The project URL and keys are case-sensitive

