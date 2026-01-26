# JWT Authentication Guide

## Overview

The frontend uses a JWT-based authentication system that communicates with the backend services.

## Architecture

### Components
- `src/services/authService.ts` - Core JWT authentication functions
- `src/services/api.ts` - API service with JWT interceptors
- `src/context/AuthContext.tsx` - Authentication state management
- Backend JWT authentication service

### Flow
1. User registers/logs in via authentication forms
2. Backend validates credentials and issues JWT token
3. JWT token is stored in localStorage
4. Token is attached to all API requests automatically
5. Backend validates token on each request

## Configuration

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:8000
```

## Key Features

### Token Management
- JWT tokens stored securely in localStorage
- Automatic token attachment to API requests
- Token validation and expiration checking

### User Registration/Login
- Candidate registration via `/v1/candidate/register`
- Candidate login via `/v1/candidate/login`
- Role assignment (candidate, recruiter, client)

### API Integration
- All API calls automatically include Authorization header
- Error handling for authentication failures
- Automatic token refresh if implemented on backend

## Error Handling

Common authentication errors:
- 401 Unauthorized: Invalid or expired JWT token
- 403 Forbidden: Insufficient permissions for requested action
- Network errors: Backend service unavailable

## Architecture Notes

All authentication logic flows through the backend JWT system. The frontend stores JWT tokens in localStorage and automatically includes them in API requests.