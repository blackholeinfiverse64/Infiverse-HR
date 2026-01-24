# 🔐 Authentication Structure Documentation

## 📁 File Structure

```
frontend/
├── src/
│   ├── services/
│   │   ├── authService.ts           # JWT auth functions & token management
│   │   └── api.ts                   # API service with JWT interceptors
│   ├── context/
│   │   └── AuthContext.tsx          # React context for auth state
│   ├── components/
│   │   └── ProtectedRoute.tsx      # Route protection component
│   ├── pages/
│   │   └── auth/
│   │       └── AuthPage.tsx         # Signup/Login UI
│   └── App.tsx                      # Main app with route definitions
└── .env                             # Environment variables
```

## 🏗️ Architecture Overview

### **JWT-Based Authentication System**

The system uses a **JWT (JSON Web Token) approach** that integrates with the backend authentication system:
1. **JWT Tokens** (primary) - Tokens issued by backend and stored in localStorage
2. **Backend Integration** - Direct connection to backend JWT authentication endpoints

```
┌─────────────────────────────────────────────────────────┐
│                    User Action                          │
│              (Signup / Login / Logout)                 │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              AuthPage.tsx                               │
│  - Handles form submission                             │
│  - Validates input                                     │
│  - Calls auth context functions                        │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              AuthContext.tsx                            │
│  - Manages auth state                                  │
│  - Calls authService methods                           │
│  - Updates user state                                  │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              authService.ts                             │
│  - signIn() / signUp() / signOut()                     │
│  - JWT token management                                │
│  - API calls to backend                                │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              Backend API                                │
│  - /v1/candidate/login                                 │
│  - /v1/candidate/register                              │
│  - Issues JWT tokens                                   │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              localStorage                               │
│  - Stores JWT token                                    │
│  - Stores user data                                    │
│  - Stores user role                                    │
└─────────────────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              api.ts (Axios Interceptor)               │
│  - Attaches JWT tokens to requests                     │
│  - Handles auth errors                                 │
└─────────────────────────────────────────────────────────┘
```

## 📦 Core Components

### 1. **Auth Service** (`src/services/authService.ts`)

**Purpose:** Low-level JWT token management and API integration

**Key Functions:**
- `login(email, password)` - Authenticate user and get JWT token
- `register(userData)` - Create new user and get JWT token
- `logout()` - Sign out user and clear stored data
- `getAuthToken()` - Get stored JWT token
- `setAuthToken(token)` - Set JWT token in storage and axios
- `isAuthenticated()` - Check if user is authenticated
- `getUserData()` - Get stored user data

**Features:**
- JWT token management in localStorage
- Axios defaults configuration for auth headers
- Token expiration checking
- Error handling with user-friendly messages

### 2. **Auth Context** (`src/context/AuthContext.tsx`)

**Purpose:** Global authentication state management

**State:**
```typescript
{
  user: User | null              // Current user object
  loading: boolean               // Auth check in progress
  userRole: string | null        // User's role (candidate/recruiter/client)
  userName: string | null       // User's name
}
```

**Methods:**
- `signIn(email, password)` - Login
- `signUp(email, password, userData)` - Register
- `signOut()` - Logout

**Initialization Flow:**
1. Check localStorage for existing auth
2. If found, restore user from localStorage
3. Verify JWT token validity
4. Update state accordingly

### 3. **Auth Page** (`src/pages/auth/AuthPage.tsx`)

**Purpose:** Signup and login UI

**Features:**
- Dual mode: Signup / Login
- Role selection (candidate/recruiter/client)
- Form validation
- Error handling
- Profile creation in database
- Role recovery mechanism

**Signup Flow:**
1. Validate form inputs
2. Call `authService.register()` with role
3. Save to localStorage
4. Create/update user profile in database
5. Store user data in localStorage
6. Redirect to role-specific dashboard

**Login Flow:**
1. Validate credentials
2. Call `authService.login()`
3. Get user role from multiple sources (priority order):
   - User role from localStorage
   - Retrieved from backend on login
4. If role not found, create profile with default role
5. Save to localStorage
6. Redirect to role-specific dashboard

### 4. **Protected Route** (`src/components/ProtectedRoute.tsx`)

**Purpose:** Route protection and role-based access control

**Props:**
```typescript
{
  children: ReactNode
  allowedRoles?: string[]    // Roles that can access
  requireAuth?: boolean      // Require authentication (default: true)
}
```

**Protection Logic:**
1. Check if user is authenticated
2. If not authenticated → redirect to `/auth`
3. If authenticated, check role
4. If role doesn't match → redirect to correct dashboard
5. If authorized → render children

**Usage:**
```tsx
<ProtectedRoute allowedRoles={['candidate']}>
  <CandidateDashboard />
</ProtectedRoute>
```

### 5. **Public Route** (`src/components/ProtectedRoute.tsx`)

**Purpose:** Redirect authenticated users away from auth pages

**Usage:**
```tsx
<PublicRoute>
  <AuthPage />
</PublicRoute>
```

## 🗄️ Database Schema

### **Backend User Management**

The user authentication is handled by the backend system which manages user accounts in the PostgreSQL database. The frontend only stores JWT tokens and user metadata locally.

### **Frontend Storage (localStorage)**

The frontend stores authentication data in localStorage:

- `auth_token` - JWT token for API authentication
- `user_data` - User information received from backend
- `user_role` - User role (candidate, recruiter, client)
- `user_email` - User's email address
- `user_name` - User's name

## 🔄 Authentication Flows

### **Signup Flow**

```
User fills form
    ↓
Select role (candidate/recruiter/client)
    ↓
Submit form
    ↓
AuthPage.tsx validates
    ↓
AuthContext.tsx → handleSignUp()
    ↓
authService.ts → register()
    ↓
┌─────────────────────────┐
│  Backend API            │
│  - /v1/candidate/register │
│  - Create user account  │
│  - Return JWT token     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Store JWT Token       │
│  - Save to localStorage │
│  - Update axios headers │
│  - Store user data      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Redirect to Dashboard  │
│  Based on role          │
└─────────────────────────┘
```

### **Login Flow**

```
User enters credentials
    ↓
AuthPage.tsx validates
    ↓
AuthContext.tsx → handleSignIn()
    ↓
authService.ts → login()
    ↓
┌─────────────────────────┐
│  Backend API            │
│  - /v1/candidate/login  │
│  - Verify credentials   │
│  - Return JWT token     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Store JWT Token       │
│  - Save to localStorage │
│  - Update axios headers │
│  - Store user data      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Get User Role          │
│  From localStorage      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Redirect to Dashboard  │
│  Based on role          │
└─────────────────────────┘
```

### **Logout Flow**

```
User clicks logout
    ↓
AuthContext → signOut()
    ↓
┌─────────────────────────┐
│  authService.signOut()  │
│  - Clear localStorage   │
│  - Remove axios headers │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Clear localStorage     │
│  - user_role            │
│  - user_email           │
│  - user_name            │
│  - auth_token           │
│  - user_data            │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Redirect to /auth      │
└─────────────────────────┘
```

## 🔑 Role-Based Access Control (RBAC)

### **Roles:**
- `candidate` - Job seekers
- `recruiter` - HR/Recruiters
- `client` - Companies/Employers

### **Role Storage:**
1. **Primary:** `user_profiles.role` (database)
2. **Secondary:** `auth.users.raw_user_meta_data.role` (metadata)
3. **Fallback:** `localStorage.user_role`

### **Route Protection:**

```tsx
// Candidate only
<ProtectedRoute allowedRoles={['candidate']}>
  <CandidateLayout />
</ProtectedRoute>

// Recruiter only
<ProtectedRoute allowedRoles={['recruiter']}>
  <RecruiterLayout />
</ProtectedRoute>

// Client only
<ProtectedRoute allowedRoles={['client']}>
  <ClientLayout />
</ProtectedRoute>
```

## 📝 localStorage Structure

```javascript
{
  isAuthenticated: 'true',
  user_id: 'backend-generated-id',
  user_email: 'user@example.com',
  user_name: 'John Doe',
  user_role: 'candidate' | 'recruiter' | 'client',
  candidate_id: '...',           // Optional
  backend_candidate_id: '...',   // Optional
  auth_token: '...'              // Optional
}
```

## ⚙️ Configuration

### **Environment Variables** (`.env`)

```env
VITE_API_BASE_URL=http://localhost:8000
```

### **API Configuration**

The authentication service uses axios for API calls and automatically attaches JWT tokens to requests via interceptors.

## 🛡️ Security Features

1. **Password Validation:**
   - Minimum 6 characters
   - Confirmation matching

2. **Role Validation:**
   - Only valid roles accepted
   - Database constraints

3. **Route Protection:**
   - Authentication required
   - Role-based access
   - Automatic redirects

4. **Error Handling:**
   - User-friendly messages
   - No sensitive data exposure
   - Graceful fallbacks

5. **Session Management:**
   - Auto-refresh tokens
   - Secure session storage
   - Automatic cleanup on logout

## 🔍 Debugging

### **Check Auth State:**
```javascript
// In browser console
const { user, userRole, session } = useAuth()
console.log({ user, userRole, session })
```

### **Check localStorage:**
```javascript
console.log({
  isAuthenticated: localStorage.getItem('isAuthenticated'),
  user_role: localStorage.getItem('user_role'),
  user_email: localStorage.getItem('user_email'),
  auth_token: localStorage.getItem('auth_token')
})
```
```

## 📚 Key Files Reference

| File | Purpose |
|------|---------|
| `src/services/authService.ts` | JWT auth functions & token management |
| `src/context/AuthContext.tsx` | Global auth state management |
| `src/pages/auth/AuthPage.tsx` | Signup/Login UI |
| `src/components/ProtectedRoute.tsx` | Route protection |
| `src/services/api.ts` | API service with JWT interceptors |
| `src/App.tsx` | Route definitions |
| `.env` | Environment configuration |

## 🚀 Usage Examples

### **Sign Up:**
```typescript
const { signUp } = useAuth()
const { error } = await signUp('user@example.com', 'password123', {
  name: 'John Doe',
  role: 'candidate'
})
```

### **Sign In:**
```typescript
const { signIn } = useAuth()
const { error } = await signIn('user@example.com', 'password123')
```

### **Sign Out:**
```typescript
const { signOut } = useAuth()
await signOut()
```

### **Check Auth:**
```typescript
const { user, userRole, loading } = useAuth()

if (loading) return <Loading />
if (!user) return <Login />
if (userRole === 'candidate') return <CandidateDashboard />
```

## 🎯 Best Practices

1. **Always use `useAuth()` hook** - Don't access localStorage directly
2. **Use `ProtectedRoute`** - For all protected pages
3. **Handle loading states** - Check `loading` before rendering
4. **Validate roles** - Always check role before showing content
5. **Error handling** - Show user-friendly error messages
6. **Token management** - Properly handle JWT token expiration

