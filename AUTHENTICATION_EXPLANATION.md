# 🔐 Authentication Structure Explanation

## Current Authentication System

### **Three User Roles:**
1. **Candidate** - Job seekers who apply for jobs
2. **Recruiter** - HR personnel who manage jobs and candidates
3. **Client** - Companies that post jobs

---

## 📋 How Authentication Works

### **1. Signup Flow (Working Correctly)**
```
User fills form → Selects role → Submits → Backend creates account
→ JWT token received → Role stored in localStorage → Redirects to role-specific dashboard
```

**Code Path:**
- `AuthPage.tsx` (line 106-136): User selects role, calls `signUp()`
- `AuthContext.tsx` (line 83-102): Calls `authService.register()`
- `authService.ts` (line 70-138): Registers via `/v1/candidate/register`
- Role is stored in `localStorage` as `'user_role'`
- Redirects based on `selectedRole` from signup form

### **2. Login Flow (THE PROBLEM)**
```
User enters email/password → Backend authenticates → JWT token received
→ ❌ Role defaults to 'candidate' if not in localStorage → Always redirects to candidate dashboard
```

**The Problem:**
- `AuthPage.tsx` (line 148): Reads role from `localStorage.getItem('user_role')` which might not exist
- Defaults to `'candidate'` if not found: `|| 'candidate'`
- `authService.ts` (line 35-67): Only calls `/v1/candidate/login` - hardcoded for candidates
- Role should come from JWT token or backend response, not localStorage

---

## 🐛 Why All Logins Go to Candidate Dashboard

### **Current Login Logic:**
```typescript
// AuthPage.tsx line 138-153
const { error } = await signIn(formData.email, formData.password)

// ❌ PROBLEM: Reads from localStorage, defaults to 'candidate'
const userRole: UserRole = localStorage.getItem('user_role') as UserRole || 'candidate'

navigate(roleConfig[userRole].redirectPath)  // Always goes to candidate if role missing
```

**What Happens:**
1. User logs in (could be recruiter/client)
2. Backend authenticates and returns JWT token
3. Frontend tries to read `user_role` from localStorage
4. If not found → defaults to `'candidate'`
5. Always redirects to `/candidate/dashboard`

---

## ✅ Solution: Get Role from JWT Token

### **The Fix:**
1. **Extract role from JWT token** after login
2. **Store role in localStorage** if not already there
3. **Use role from token** instead of localStorage default

### **JWT Token Structure:**
```json
{
  "user_id": "123",
  "email": "user@example.com",
  "role": "recruiter" | "candidate" | "client",  // ← Role is in token!
  "exp": 1234567890
}
```

---

## 🔧 Files to Fix

### **1. `AuthContext.tsx`** (line 56-81)
**Current:** Only stores token and user data
**Fix:** Extract role from JWT token and store it

### **2. `AuthPage.tsx`** (line 148)
**Current:** `localStorage.getItem('user_role') || 'candidate'`
**Fix:** Get role from `user.role` (from JWT) or use `useAuth().userRole`

### **3. `authService.ts`** (line 35-67)
**Current:** Only calls `/v1/candidate/login`
**Future:** May need different endpoints for recruiter/client, or unified endpoint

---

## 🎯 How to Fix

### **Step 1: Update `AuthContext.tsx`**
After successful login, extract role from JWT token:
```typescript
const payload = JSON.parse(atob(result.token.split('.')[1]));
const role = payload.role || 'candidate';
localStorage.setItem('user_role', role);
```

### **Step 2: Update `AuthPage.tsx`**
Use role from `user` object instead of localStorage default:
```typescript
const { user, userRole } = useAuth();
const role = userRole || user?.role || 'candidate';
navigate(roleConfig[role].redirectPath);
```

### **Step 3: Ensure Backend Returns Role**
Backend should include `role` in JWT token payload for all login types.

---

## 📍 File Locations

- **Authentication Context:** `frontend/src/context/AuthContext.tsx`
- **Auth Page (Login/Signup):** `frontend/src/pages/auth/AuthPage.tsx`
- **Auth Service:** `frontend/src/services/authService.ts`
- **Protected Routes:** `frontend/src/components/ProtectedRoute.tsx`
- **App Routes:** `frontend/src/App.tsx`

---

## 🔍 Debugging Tips

1. **Check JWT token:** 
   ```javascript
   const token = localStorage.getItem('auth_token');
   const payload = JSON.parse(atob(token.split('.')[1]));
   console.log('Role in token:', payload.role);
   ```

2. **Check localStorage:**
   ```javascript
   console.log('Stored role:', localStorage.getItem('user_role'));
   ```

3. **Check user object:**
   ```javascript
   const { user, userRole } = useAuth();
   console.log('User role:', userRole, 'User object:', user);
   ```

