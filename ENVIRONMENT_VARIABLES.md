# Environment Variables - Standardized Naming Convention

This document defines the **standardized environment variable names** used across the backend and frontend for consistency and integrity.

## 📋 Standard Variable Names

### Backend Environment Variables

#### Authentication & Security
| Variable Name | Purpose | Required | Default | Notes |
|--------------|---------|----------|---------|-------|
| `JWT_SECRET_KEY` | Client/Admin JWT token signing secret | ✅ Yes | - | Used for client/admin authentication |
| `CANDIDATE_JWT_SECRET_KEY` | Candidate JWT token signing secret | ✅ Yes | - | Used for candidate authentication |
| `API_KEY_SECRET` | Service-to-service API key | ✅ Yes | - | Used for inter-service communication |

#### Database
| Variable Name | Purpose | Required | Default | Notes |
|--------------|---------|----------|---------|-------|
| `DATABASE_URL` | MongoDB connection string | ✅ Yes | - | MongoDB Atlas connection URL |

#### Service URLs
| Variable Name | Purpose | Required | Default | Notes |
|--------------|---------|----------|---------|-------|
| `AGENT_SERVICE_URL` | AI Agent service URL | ✅ Yes | - | URL for agent service |
| `LANGGRAPH_SERVICE_URL` | LangGraph service URL | ✅ Yes | - | URL for LangGraph service |

#### Configuration
| Variable Name | Purpose | Required | Default | Notes |
|--------------|---------|----------|---------|-------|
| `ENVIRONMENT` | Environment name | ❌ No | `development` | Values: `development`, `production`, `staging` |
| `LOG_LEVEL` | Logging level | ❌ No | `INFO` | Values: `DEBUG`, `INFO`, `WARNING`, `ERROR` |

### Frontend Environment Variables

#### API Configuration
| Variable Name | Purpose | Required | Default | Notes |
|--------------|---------|----------|---------|-------|
| `VITE_API_BASE_URL` | Backend API Gateway URL | ✅ Yes | `http://localhost:8000` | Main API endpoint |

---

---

## 📝 Example .env Files

### Backend `.env` (Required Variables)
```env
# Authentication & Security
JWT_SECRET_KEY=your_client_jwt_secret_key_here_min_32_chars
CANDIDATE_JWT_SECRET_KEY=your_candidate_jwt_secret_key_here_min_32_chars
API_KEY_SECRET=your_api_key_secret_here

# Database
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# Service URLs
AGENT_SERVICE_URL=http://localhost:9000
LANGGRAPH_SERVICE_URL=http://localhost:9001

# Configuration (Optional)
ENVIRONMENT=development
LOG_LEVEL=INFO
```

### Frontend `.env` (Required Variables)
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
```

---

---

## ✅ Validation Checklist

Before deploying, ensure:

- [ ] All required variables are set in `.env` files
- [ ] Variable names match exactly (case-sensitive)
- [ ] No extra spaces or quotes around values
- [ ] Secrets are at least 32 characters long
- [ ] Database URL includes authentication credentials
- [ ] Service URLs don't have trailing slashes

---

## 🔐 Security Notes

1. **Never commit `.env` files** to version control
2. **Use different secrets** for development and production
3. **Rotate secrets** regularly in production
4. **Use strong, random secrets** (minimum 32 characters)
5. **Keep secrets secure** - use environment variable management tools in production

---

## 📚 Code References

### Backend Usage
- `backend/services/gateway/jwt_auth.py` - JWT authentication
- `backend/services/gateway/config.py` - Gateway configuration
- `backend/services/agent/config.py` - Agent configuration
- `backend/services/langgraph/config.py` - LangGraph configuration

### Frontend Usage
- `frontend/src/services/api.ts` - API base URL
- `frontend/src/services/authService.ts` - Authentication service

---

**Last Updated:** January 26, 2026
**Version:** 1.0.0

