# Verify Your Supabase API Key

## ⚠️ Important: Check Your API Key Format

The key you're using starts with `sb_publishable_` which is **unusual**. 

### Standard Supabase Anon Keys:

1. **JWT Format (Most Common):**
   - Starts with: `eyJ`
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - This is the **anon public** key

2. **Publishable Key (Newer Format):**
   - Starts with: `sb_publishable_`
   - This might be a newer Supabase format
   - **But verify it's the "anon public" key, not a different key type**

## 🔍 How to Get the Correct Key:

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Select your project: `smcgaaecckvngkhvsanb`

2. **Navigate to API Settings:**
   - Click **Settings** (gear icon) in the left sidebar
   - Click **API** under Project Settings

3. **Find the "anon public" Key:**
   - Look for **"Project API keys"** section
   - Find **"anon public"** key (NOT "service_role" key)
   - Copy the entire key

4. **Update Your .env File:**
   ```env
   VITE_SUPABASE_URL=https://smcgaaecckvngkhvsanb.supabase.co
   VITE_SUPABASE_ANON_KEY=<paste-the-anon-public-key-here>
   ```

5. **Restart Dev Server:**
   ```bash
   # Stop server (Ctrl+C)
   cd frontend
   npm run dev
   ```

## 🧪 Test the Connection:

I've created a test file for you:

1. **Open in Browser:**
   - Open `frontend/test-supabase-connection.html` in your browser
   - Click "Test Connection" button
   - Check the results

2. **Or Test in Browser Console:**
   ```javascript
   // Replace with your actual anon key from dashboard
   const key = 'YOUR_ANON_KEY_FROM_DASHBOARD';
   const url = 'https://smcgaaecckvngkhvsanb.supabase.co';
   
   fetch(`${url}/rest/v1/`, {
     headers: { 'apikey': key }
   })
   .then(r => console.log('✅ Status:', r.status))
   .catch(e => console.error('❌ Error:', e));
   ```

## 📋 Key Verification Checklist:

- [ ] Using **"anon public"** key (NOT service_role)
- [ ] Key is from: Dashboard → Settings → API → "anon public"
- [ ] Key format is either:
  - Starts with `eyJ` (JWT format) ✅
  - OR starts with `sb_publishable_` (if that's what dashboard shows) ✅
- [ ] Key is complete (not truncated)
- [ ] No extra spaces or quotes in `.env` file
- [ ] Dev server restarted after updating `.env`

## 🔑 Key Types Explained:

| Key Type | Starts With | Usage | Security |
|----------|-------------|-------|----------|
| **anon public** | `eyJ` or `sb_publishable_` | ✅ Frontend/client | Safe to expose |
| **service_role** | `eyJ` (different) | ❌ Backend only | ⚠️ NEVER expose! |
| **JWT secret** | Various | Backend | ⚠️ Secret |

**For frontend, you MUST use "anon public" key only!**

## 🆘 If Still Not Working:

1. **Double-check the key in dashboard:**
   - Make sure you copied the **entire** key
   - No spaces before/after
   - Copy it again fresh from dashboard

2. **Try regenerating the key:**
   - In Supabase Dashboard → Settings → API
   - Click "Reset" next to anon key (if available)
   - Copy the new key
   - Update `.env` and restart

3. **Check browser console:**
   - Open DevTools (F12)
   - Look for the debug message: `🔧 Supabase Configuration:`
   - Check what it says about key format

4. **Test with curl (if available):**
   ```bash
   curl -H "apikey: YOUR_ANON_KEY" https://smcgaaecckvngkhvsanb.supabase.co/rest/v1/
   ```

