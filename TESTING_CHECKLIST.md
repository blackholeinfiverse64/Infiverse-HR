# Testing Checklist - After Authentication Fixes

## 🧪 Automated Testing

### Run Automated Test Suites
```bash
# Test authentication flows (candidate, recruiter, client)
python backend/test_authentication_changes.py

# Test MongoDB schema management scripts
python backend/test_mongodb_scripts.py

# Test all API endpoints
cd backend/tests
python comprehensive_endpoint_tests.py
```

**See [TESTING_GUIDE.md](TESTING_GUIDE.md) for complete testing documentation.**

---

## ✅ All Fixes Applied

### Endpoints Fixed:
1. ✅ `/v1/interviews` - Now supports JWT + candidate_id filtering
2. ✅ `/v1/offers` - Now supports JWT + candidate_id filtering  
3. ✅ `/v1/feedback` (GET) - Now supports JWT + candidate_id filtering
4. ✅ `/v1/feedback` (POST) - Now supports JWT + authorization check
5. ✅ `/v1/candidate/stats/{candidate_id}` - NEW endpoint created

## 🧪 Testing Steps

### Step 1: Restart Backend
```bash
# Stop the current backend service
# Restart the gateway service
```

### Step 2: Clear Browser (Optional)
Open browser console and run:
```javascript
localStorage.clear()
location.reload()
```

### Step 3: Test Login
1. Go to login page
2. Login as candidate
3. Check browser console - should see:
   - ✅ Login successful message
   - ✅ No errors
   - ✅ Token stored in localStorage

### Step 4: Test Dashboard
After login, dashboard should load:
- ✅ No 401 errors
- ✅ No 404 errors (except tasks which is handled)
- ✅ Stats display correctly
- ✅ Applications show
- ✅ Interviews show
- ✅ Offers show

### Step 5: Test Each Page

#### Profile Page (`/candidate/profile`)
- ✅ Profile loads without errors
- ✅ Can view profile data
- ✅ Can update profile (if needed)

#### Job Search (`/candidate/jobs`)
- ✅ Jobs list loads (public endpoint)
- ✅ Can apply for jobs
- ✅ No authentication errors

#### Applications (`/candidate/applied-jobs`)
- ✅ Applications list loads
- ✅ No 401 errors
- ✅ Shows correct applications

#### Interviews/Tasks (`/candidate/interviews`)
- ✅ Interviews load
- ✅ No 401 errors
- ✅ Tasks endpoint gracefully handles 404 (returns empty array)

#### Feedback (`/candidate/feedback`)
- ✅ Feedback list loads
- ✅ No 401 errors
- ✅ Can submit feedback (if needed)

## 🔍 What to Check in Browser Console

### ✅ Good Signs:
- No red errors
- API calls return 200 status
- Data loads successfully
- Token is present in localStorage

### ❌ Bad Signs (Should Not See):
- `401 Unauthorized` errors
- `404 Not Found` errors (except tasks)
- `403 Forbidden` errors (unless trying to access other user's data)
- `Authentication failed` messages

## 🐛 If You Still See Errors

### 401 Errors:
1. Check if token is being sent:
   - Open Network tab
   - Click on failed request
   - Check Headers → Authorization
   - Should see: `Bearer <token>`

2. Check token validity:
   ```javascript
   const token = localStorage.getItem('auth_token');
   if (token) {
     const payload = JSON.parse(atob(token.split('.')[1]));
     console.log('Token expires:', new Date(payload.exp * 1000));
     console.log('Token valid:', new Date(payload.exp * 1000) > new Date());
   }
   ```

3. Check backend logs for authentication errors

### 404 Errors:
- Check if endpoint exists in backend
- Verify URL is correct
- Check backend is running

### 403 Errors:
- This is expected if trying to access another candidate's data
- Verify you're using your own candidate_id

## 📊 Expected API Calls

After login, you should see these successful API calls:

1. `GET /v1/candidate/stats/{candidate_id}` - 200 OK
2. `GET /v1/candidate/applications/{candidate_id}` - 200 OK
3. `GET /v1/interviews?candidate_id={candidate_id}` - 200 OK
4. `GET /v1/offers?candidate_id={candidate_id}` - 200 OK
5. `GET /v1/feedback?candidate_id={candidate_id}` - 200 OK (when viewing feedback page)
6. `GET /v1/jobs` - 200 OK (public endpoint, no auth needed)

## ✅ Success Criteria

All tests pass when:
- ✅ No console errors
- ✅ All pages load successfully
- ✅ Data displays correctly
- ✅ Can perform actions (apply, update profile, etc.)
- ✅ Authentication works for all candidate endpoints

## 📝 Notes

- Tasks endpoint (`/v1/tasks`) doesn't exist in backend - this is handled gracefully by frontend
- Jobs endpoint is public - no authentication needed
- All candidate-specific endpoints now require JWT authentication
- Authorization checks ensure candidates can only access their own data

