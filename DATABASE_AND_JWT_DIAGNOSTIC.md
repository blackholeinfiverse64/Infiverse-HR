# Database and JWT Diagnostic Guide

## Current Issue: 401 Unauthorized Errors

The token is being:
- ✅ Stored correctly in localStorage
- ✅ Sent in Authorization header
- ❌ Rejected by backend (401 error)

This suggests a **JWT validation issue**, not a database issue.

## Database Structure Check

### Candidate Storage
- **Collection**: `candidates`
- **Primary Key**: `_id` (MongoDB ObjectId)
- **Login Query**: `{"email": login_data.email}`
- **Token Creation**: Uses `str(candidate["_id"])` as candidate_id

### Data Consistency
All collections store `candidate_id` as **string**:
- ✅ `job_applications.candidate_id` - stored as string
- ✅ `interviews.candidate_id` - stored as string (from request)
- ✅ `offers.candidate_id` - stored as string (from request)
- ✅ `feedback.candidate_id` - stored as string

### Query Format
All queries use string matching:
- `{"candidate_id": candidate_id}` - direct string match
- Some endpoints try ObjectId conversion as fallback

## Most Likely Issue: JWT Secret Mismatch

### Problem
The JWT token is signed with one secret but verified with a different (or missing) secret.

### How to Check

1. **Check Backend Logs** (after restart with new logging):
   ```
   🔐 Attempting authentication with token...
   Attempting candidate JWT validation with secret...
   ❌ Candidate JWT token validation failed
   ❌ JWT token signature invalid: ...
   ```

2. **Verify Environment Variables**:
   ```bash
   # In backend .env file, check:
   CANDIDATE_JWT_SECRET_KEY=<must-match-secret>
   ```

3. **Check Token Signing vs Verification**:
   - **Signing** (login): Uses `os.getenv("CANDIDATE_JWT_SECRET_KEY")`
   - **Verification** (auth): Uses `CANDIDATE_JWT_SECRET_KEY` from `jwt_auth.py`
   - **Both must be the same value!**

## Database Issues (Less Likely)

### Potential Issues

1. **Candidate Not Found**:
   - Login would fail if candidate doesn't exist
   - Since login works, candidate exists ✅

2. **Candidate ID Format Mismatch**:
   - Token contains: `"69772c8069b9eedc6be47ca9"` (string)
   - MongoDB stores: `ObjectId("69772c8069b9eedc6be47ca9")`
   - Queries handle both formats ✅

3. **Missing Collections**:
   - If collections don't exist, queries return empty arrays (not 401)
   - 401 happens before database queries ❌

## Quick Fixes to Try

### Fix 1: Verify JWT Secret
```bash
# In backend .env file:
CANDIDATE_JWT_SECRET_KEY=your-secret-here-must-match
```

### Fix 2: Check Backend Logs
After restarting backend, look for:
- `❌ JWT token signature invalid` - Secret mismatch
- `❌ CANDIDATE_JWT_SECRET_KEY not configured` - Secret missing
- `❌ Candidate JWT token validation failed` - Validation error

### Fix 3: Test Token Manually
```python
# In Python console (backend directory):
import jwt
import os
from dotenv import load_dotenv

load_dotenv()
secret = os.getenv("CANDIDATE_JWT_SECRET_KEY")
token = "your-token-from-localStorage"  # Get from browser console

try:
    payload = jwt.decode(token, secret, algorithms=["HS256"])
    print("✅ Token valid!")
    print(f"Payload: {payload}")
except jwt.InvalidSignatureError:
    print("❌ Secret mismatch!")
except Exception as e:
    print(f"❌ Error: {e}")
```

## Expected Backend Log Output

After restarting backend with enhanced logging, you should see:

### ✅ If Working:
```
🔐 Attempting authentication with token (first 30 chars): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Attempting candidate JWT validation with secret (exists: True, length: 32)
✅ Authentication successful: Candidate JWT token for user 69772c8069b9eedc6be47ca9
```

### ❌ If Failing:
```
🔐 Attempting authentication with token (first 30 chars): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Attempting candidate JWT validation with secret (exists: True, length: 32)
❌ Candidate JWT token validation failed. Token (first 50 chars): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
❌ JWT token signature invalid: ...
Secret provided: True, Secret length: 32
```

## Next Steps

1. **Restart Backend** - To see new logging
2. **Check Backend Terminal** - Look for JWT validation errors
3. **Verify JWT Secret** - Ensure it matches in .env file
4. **Test Token** - Use Python script above to verify token manually

## Summary

- ✅ Database structure looks correct
- ✅ Candidate exists (login works)
- ✅ Data format is consistent (strings)
- ❌ **JWT validation is failing** - This is the root cause

The 401 errors are happening during **authentication**, not during database queries. The enhanced logging will show exactly why the token is being rejected.

