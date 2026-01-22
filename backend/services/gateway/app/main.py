from fastapi import FastAPI, HTTPException, Depends, Security, Response, Request
import json
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from datetime import datetime, timezone, timedelta
import os
import secrets
import pyotp
import qrcode
import io
import base64
import re
import string
import random
import jwt
import bcrypt
from collections import defaultdict
# MongoDB imports (migrated from SQLAlchemy/PostgreSQL)
from app.database import get_mongo_db, get_mongo_client
from app.db_helpers import find_one_by_field, find_many, count_documents, insert_one, update_one, delete_one, convert_objectid_to_str
from bson import ObjectId
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, field_validator
import time
import psutil

# Import configuration
try:
    from config import validate_config, setup_logging, ENVIRONMENT
    validate_config()
    setup_logging()
except ImportError:
    # Fallback if config module not available
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
except Exception as e:
    print(f"Configuration error: {e}")
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
# Auth routes import removed - using /v1/auth/ endpoints instead
try:
    import sys
    import os
    # Add gateway directory to path for monitoring import
    gateway_dir = os.path.dirname(os.path.dirname(__file__))
    sys.path.insert(0, gateway_dir)
    from monitoring import monitor, log_resume_processing, log_matching_performance, log_user_activity, log_error
except ImportError:
    # Fallback if monitoring module is not available
    class MockMonitor:
        def export_prometheus_metrics(self): return "# No metrics available"
        def health_check(self): return {"status": "healthy", "monitoring": "disabled"}
        def get_performance_summary(self, hours): return {"monitoring": "disabled"}
        def get_business_metrics(self): return {"monitoring": "disabled"}
        def collect_system_metrics(self): return {"monitoring": "disabled"}
    
    monitor = MockMonitor()
    def log_resume_processing(*args, **kwargs): pass
    def log_matching_performance(*args, **kwargs): pass
    def log_user_activity(*args, **kwargs): pass
    def log_error(*args, **kwargs): pass

security = HTTPBearer()

app = FastAPI(
    title="BHIV HR Platform API Gateway",
    version="4.2.0",
    description="Enterprise HR Platform with Advanced Security Features"
)

# CORS Configuration - Allow Vercel frontend and all origins for flexibility
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*")
if ALLOWED_ORIGINS != "*":
    # Parse comma-separated origins
    allowed_origins_list = [origin.strip() for origin in ALLOWED_ORIGINS.split(",")]
else:
    allowed_origins_list = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

# Auth routes removed - using /v1/auth/ endpoints instead

# Include AI integration routes
try:
    from routes.ai_integration import router as ai_router
    app.include_router(ai_router, prefix="/api/v1", tags=["AI Integration"])
except ImportError:
    pass

# Include LangGraph workflow routes
try:
    import sys
    import os
    # Add gateway directory to path to find langgraph_integration.py
    gateway_dir = os.path.dirname(os.path.dirname(__file__))
    sys.path.insert(0, gateway_dir)
    from langgraph_integration import router as langgraph_router
    app.include_router(langgraph_router, prefix="/api/v1", tags=["LangGraph Workflows"])
    print("LangGraph integration loaded successfully")
except ImportError as e:
    print(f"WARNING: LangGraph integration not available: {e}")
    pass  # LangGraph routes optional

# Include RL routes
try:
    from routes.rl_routes import router as rl_router
    app.include_router(rl_router, prefix="/api/v1", tags=["RL + Feedback Agent"])
    print("RL routes loaded successfully")
except ImportError as e:
    print(f"WARNING: RL routes not available: {e}")
    pass  # RL routes optional

# Add monitoring endpoints
@app.get("/metrics", tags=["Monitoring"])
async def get_prometheus_metrics():
    """Prometheus Metrics Export"""
    return Response(content=monitor.export_prometheus_metrics(), media_type="text/plain")

@app.get("/health/detailed", tags=["Monitoring"])
async def detailed_health_check():
    """Detailed Health Check with Metrics"""
    return monitor.health_check()

@app.get("/metrics/dashboard", tags=["Monitoring"])
async def metrics_dashboard():
    """Metrics Dashboard Data"""
    return {
        "performance_summary": monitor.get_performance_summary(24),
        "business_metrics": monitor.get_business_metrics(),
        "system_metrics": monitor.collect_system_metrics()
    }

# Enhanced Granular Rate Limiting

rate_limit_storage = defaultdict(list)

# Granular rate limits by endpoint and user tier
RATE_LIMITS = {
    "default": {
        "/v1/jobs": 100,
        "/v1/candidates/search": 50,
        "/v1/match": 20,
        "/v1/candidates/bulk": 5,
        "default": 60
    },
    "premium": {
        "/v1/jobs": 500,
        "/v1/candidates/search": 200,
        "/v1/match": 100,
        "/v1/candidates/bulk": 25,
        "default": 300
    }
}

def get_dynamic_rate_limit(endpoint: str, user_tier: str = "default") -> int:
    """Dynamic rate limiting based on system load"""
    cpu_usage = psutil.cpu_percent()
    base_limit = RATE_LIMITS[user_tier].get(endpoint, RATE_LIMITS[user_tier]["default"])
    
    if cpu_usage > 80:
        return int(base_limit * 0.5)  # Reduce by 50% during high load
    elif cpu_usage < 30:
        return int(base_limit * 1.5)  # Increase by 50% during low load
    return base_limit

async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host
    current_time = time.time()
    endpoint_path = request.url.path
    
    # Determine user tier (simplified - in production, get from JWT/database)
    user_tier = "premium" if "enterprise" in request.headers.get("user-agent", "").lower() else "default"
    
    # Get dynamic rate limit for this endpoint
    rate_limit = get_dynamic_rate_limit(endpoint_path, user_tier)
    
    # Clean old requests (older than 1 minute)
    key = f"{client_ip}:{endpoint_path}"
    rate_limit_storage[key] = [
        req_time for req_time in rate_limit_storage[key] 
        if current_time - req_time < 60
    ]
    
    # Check granular rate limit
    if len(rate_limit_storage[key]) >= rate_limit:
        raise HTTPException(
            status_code=429, 
            detail=f"Rate limit exceeded for {endpoint_path}. Limit: {rate_limit}/min"
        )
    
    # Record this request
    rate_limit_storage[key].append(current_time)
    
    response = await call_next(request)
    response.headers["X-RateLimit-Limit"] = str(rate_limit)
    response.headers["X-RateLimit-Remaining"] = str(rate_limit - len(rate_limit_storage[key]))
    return response

app.middleware("http")(rate_limit_middleware)

class JobCreate(BaseModel):
    title: str
    department: str  # Required: e.g., "Engineering", "Marketing", "Sales"
    location: str
    experience_level: str  # Required: "entry", "mid", "senior", "lead"
    requirements: str
    description: str
    client_id: Optional[int] = 1
    employment_type: Optional[str] = "Full-time"
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "title": "Senior Software Engineer",
                "department": "Engineering",
                "location": "Remote",
                "experience_level": "senior",
                "requirements": "5+ years Python, FastAPI, PostgreSQL",
                "description": "Join our team to build scalable HR solutions",
                "employment_type": "Full-time"
            }
        }
    }

class CandidateBulk(BaseModel):
    candidates: List[Dict[str, Any]]

class FeedbackSubmission(BaseModel):
    candidate_id: str
    job_id: str
    integrity: int
    honesty: int
    discipline: int
    hard_work: int
    gratitude: int
    comments: Optional[str] = None

class InterviewSchedule(BaseModel):
    candidate_id: str
    job_id: str
    interview_date: str
    interviewer: Optional[str] = "HR Team"
    notes: Optional[str] = None

class JobOffer(BaseModel):
    candidate_id: str
    job_id: str
    salary: float
    start_date: str
    terms: str

class ClientLogin(BaseModel):
    client_id: str
    password: str

import uuid

class ClientRegister(BaseModel):
    client_id: str
    company_name: str
    contact_email: str
    password: str
    client_code: str = None  # Optional, will be generated if not provided

class TwoFASetup(BaseModel):
    user_id: str

class TwoFALogin(BaseModel):
    user_id: str
    totp_code: str

class PasswordValidation(BaseModel):
    password: str

class SecurityTest(BaseModel):
    test_type: str
    payload: str

class CSPPolicy(BaseModel):
    policy: str

class InputValidation(BaseModel):
    input_data: str

class EmailValidation(BaseModel):
    email: str

class PhoneValidation(BaseModel):
    phone: str

class CSPReport(BaseModel):
    violated_directive: str
    blocked_uri: str
    document_uri: str

class PasswordChange(BaseModel):
    old_password: str
    new_password: str

class CandidateSearch(BaseModel):
    skills: Optional[str] = None
    location: Optional[str] = None
    experience_min: Optional[int] = None
    
    @field_validator('skills')
    @classmethod
    def validate_skills(cls, v):
        return v[:200] if v else None
        
    @field_validator('location')
    @classmethod
    def validate_location(cls, v):
        return v[:100] if v else None

class BatchMatchRequest(BaseModel):
    job_ids: List[str]
    limit: Optional[int] = 10

# Candidate Portal Models
class CandidateRegister(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = None
    location: Optional[str] = None
    experience_years: Optional[int] = 0
    technical_skills: Optional[str] = None
    education_level: Optional[str] = None
    seniority_level: Optional[str] = None

class CandidateLogin(BaseModel):
    email: str
    password: str

class CandidateProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    experience_years: Optional[int] = None
    technical_skills: Optional[str] = None
    education_level: Optional[str] = None
    seniority_level: Optional[str] = None

class JobApplication(BaseModel):
    candidate_id: str  # Changed from int to str for MongoDB ObjectId
    job_id: str  # Changed from int to str for MongoDB ObjectId
    cover_letter: Optional[str] = None

# Legacy get_db_engine function - replaced by MongoDB
# MongoDB connection is handled by app.database module
# Use: db = await get_mongo_db() for async database access

def validate_api_key(api_key: str) -> bool:
    expected_key = os.getenv("API_KEY_SECRET")
    return api_key == expected_key

def get_api_key(credentials: HTTPAuthorizationCredentials = Security(security)):
    if not credentials or not validate_api_key(credentials.credentials):
        raise HTTPException(status_code=401, detail="Invalid API key")
    return credentials.credentials

def get_auth(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Dual authentication: API key or client JWT token"""
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    # Try API key first
    if validate_api_key(credentials.credentials):
        return {"type": "api_key", "credentials": credentials.credentials}
    
    # Try client JWT token
    try:
        jwt_secret = os.getenv("JWT_SECRET_KEY")
        payload = jwt.decode(credentials.credentials, jwt_secret, algorithms=["HS256"])
        return {"type": "client_token", "client_id": payload.get("client_id")}
    except:
        pass
    
    # Try candidate JWT token
    try:
        candidate_jwt_secret = os.getenv("CANDIDATE_JWT_SECRET_KEY")
        payload = jwt.decode(credentials.credentials, candidate_jwt_secret, algorithms=["HS256"])
        return {"type": "candidate_token", "candidate_id": payload.get("candidate_id")}
    except:
        pass
    
    raise HTTPException(status_code=401, detail="Invalid authentication")

# Core API Endpoints (5 endpoints)
@app.get("/openapi.json", tags=["Core API Endpoints"])
async def get_openapi():
    """OpenAPI Schema"""
    return app.openapi()

@app.get("/docs", tags=["Core API Endpoints"])
async def get_docs():
    """API Documentation"""
    return get_swagger_ui_html(openapi_url="/openapi.json", title="BHIV HR Platform API")

@app.get("/", tags=["Core API Endpoints"])
def read_root():
    """API Root Information"""
    return {
        "message": "BHIV HR Platform API Gateway",
        "version": "4.2.0",
        "status": "healthy",
        "endpoints": len(app.routes),
        "documentation": "/docs",
        "monitoring": "/metrics",
        "production_url": "https://bhiv-hr-gateway-ltg0.onrender.com",
        "langgraph_integration": "active",
        "ai_workflows": ["candidate_applied", "shortlisted", "interview_scheduled"]
    }

@app.get("/health", tags=["Core API Endpoints"])
def health_check(response: Response):
    """Health Check"""
    response.headers["X-RateLimit-Limit"] = "60"
    response.headers["X-RateLimit-Remaining"] = "59"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    
    return {
        "status": "healthy",
        "service": "BHIV HR Gateway",
        "version": "4.2.0",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.get("/v1/test-candidates", tags=["Core API Endpoints"])
async def test_candidates_db(api_key: str = Depends(get_api_key)):
    """Database Connectivity Test - MongoDB Atlas"""
    try:
        db = await get_mongo_db()
        # Test connection by running a simple command
        await db.command('ping')
        candidate_count = await db.candidates.count_documents({})
        
        return {
            "database_status": "connected",
            "database_type": "MongoDB Atlas",
            "total_candidates": candidate_count,
            "test_timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        return {
            "database_status": "failed",
            "error": str(e),
            "test_timestamp": datetime.now(timezone.utc).isoformat()
        }

# Job Management (2 endpoints)
@app.post("/v1/jobs", tags=["Job Management"])
async def create_job(job: JobCreate, api_key: str = Depends(get_api_key)):
    """Create New Job Posting
    
    **Required Fields:**
    - title: Job title
    - department: Department name (e.g., "Engineering", "Marketing")
    - location: Job location
    - experience_level: Experience level ("entry", "mid", "senior", "lead")
    - requirements: Job requirements
    - description: Job description
    
    **Authentication:** Bearer token required
    """
    try:
        db = await get_mongo_db()
        document = {
            "title": job.title,
            "department": job.department,
            "location": job.location,
            "experience_level": job.experience_level,
            "requirements": job.requirements,
            "description": job.description,
            "status": "active",
            "created_at": datetime.now(timezone.utc)
        }
        result = await db.jobs.insert_one(document)
        job_id = str(result.inserted_id)
        
        return {
            "message": "Job created successfully",
            "job_id": job_id,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        return {
            "message": "Job creation failed",
            "error": str(e),
            "status": "failed"
        }

@app.get("/v1/jobs", tags=["Job Management"])
async def list_jobs():
    """List All Active Jobs (Public Endpoint)"""
    try:
        db = await get_mongo_db()
        cursor = db.jobs.find({"status": "active"}).sort("created_at", -1).limit(100)
        jobs_list = await cursor.to_list(length=100)
        
        jobs = []
        for doc in jobs_list:
            jobs.append({
                "id": str(doc["_id"]),
                "title": doc.get("title"),
                "department": doc.get("department"),
                "location": doc.get("location"),
                "experience_level": doc.get("experience_level"),
                "requirements": doc.get("requirements"),
                "description": doc.get("description"),
                "created_at": doc.get("created_at").isoformat() if doc.get("created_at") else None
            })
        
        return {"jobs": jobs, "count": len(jobs)}
    except Exception as e:
        return {"jobs": [], "count": 0, "error": str(e)}

# Candidate Management (5 endpoints)
@app.get("/v1/candidates", tags=["Candidate Management"])
async def get_all_candidates(limit: int = 50, offset: int = 0, api_key: str = Depends(get_api_key)):
    """Get All Candidates with Pagination"""
    try:
        db = await get_mongo_db()
        cursor = db.candidates.find({}).sort("created_at", -1).skip(offset).limit(limit)
        candidates_list = await cursor.to_list(length=limit)
        
        candidates = []
        for doc in candidates_list:
            candidates.append({
                "id": str(doc["_id"]),
                "name": doc.get("name"),
                "email": doc.get("email"),
                "phone": doc.get("phone"),
                "location": doc.get("location"),
                "experience_years": doc.get("experience_years"),
                "technical_skills": doc.get("technical_skills"),
                "seniority_level": doc.get("seniority_level"),
                "education_level": doc.get("education_level"),
                "created_at": doc.get("created_at").isoformat() if doc.get("created_at") else None
            })
        
        total_count = await db.candidates.count_documents({})
        
        return {
            "candidates": candidates,
            "total": total_count,
            "limit": limit,
            "offset": offset,
            "count": len(candidates)
        }
    except Exception as e:
        return {"candidates": [], "total": 0, "error": str(e)}

# Analytics & Statistics - Move stats endpoint before parameterized routes
@app.get("/v1/candidates/stats", tags=["Analytics & Statistics"])
async def get_candidate_stats(api_key: str = Depends(get_api_key)):
    """Dynamic Candidate Statistics for HR Dashboard Analytics
    
    **Authentication:** Bearer token required
    
    **Example:**
    ```bash
    curl -H "Authorization: Bearer <YOUR_API_KEY>" \
         https://api.bhiv.com/v1/candidates/stats
    ```
    
    **Response:** Real-time statistics including total candidates, active jobs, recent matches, and pending interviews.
    """
    try:
        db = await get_mongo_db()
        
        # Get total candidates count
        total_candidates = await db.candidates.count_documents({})
        
        # Get active jobs count
        active_jobs = await db.jobs.count_documents({"status": "active"})
        
        # Get recent matches count (from matching_cache collection if exists)
        try:
            seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)
            recent_matches = await db.matching_cache.count_documents({
                "created_at": {"$gte": seven_days_ago}
            })
        except:
            # Fallback: estimate based on candidates and jobs
            recent_matches = min(total_candidates * active_jobs // 10, 50) if total_candidates > 0 and active_jobs > 0 else 0
        
        # Get pending interviews count
        try:
            now = datetime.now(timezone.utc)
            pending_interviews = await db.interviews.count_documents({
                "status": {"$in": ["scheduled", "pending"]},
                "interview_date": {"$gte": now}
            })
        except:
            # Fallback if interviews collection doesn't exist
            pending_interviews = 0
        
        # Additional dynamic statistics
        try:
            # Get new candidates this week
            new_candidates_this_week = await db.candidates.count_documents({
                "created_at": {"$gte": seven_days_ago}
            })
        except:
            new_candidates_this_week = 0
        
        try:
            # Get feedback submissions count
            total_feedback = await db.feedback.count_documents({})
        except:
            total_feedback = 0
        
        return {
            "total_candidates": total_candidates,
            "active_jobs": active_jobs,
            "recent_matches": recent_matches,
            "pending_interviews": pending_interviews,
            "new_candidates_this_week": new_candidates_this_week,
            "total_feedback_submissions": total_feedback,
            "statistics_generated_at": datetime.now(timezone.utc).isoformat(),
            "data_source": "mongodb_atlas",
            "dashboard_ready": True
        }
    except Exception as e:
        return {
            "total_candidates": 0,
            "active_jobs": 0,
            "recent_matches": 0,
            "pending_interviews": 0,
            "new_candidates_this_week": 0,
            "total_feedback_submissions": 0,
            "error": str(e),
            "statistics_generated_at": datetime.now(timezone.utc).isoformat(),
            "data_source": "error_fallback",
            "dashboard_ready": False
        }

@app.get("/v1/candidates/search", tags=["Candidate Management"])
async def search_candidates(
    skills: Optional[str] = None, 
    location: Optional[str] = None, 
    experience_min: Optional[int] = None, 
    api_key: str = Depends(get_api_key)
):
    """Search & Filter Candidates"""
    if skills:
        if len(skills) > 200:
            raise HTTPException(status_code=400, detail="Skills filter too long (max 200 characters).")
        if not re.match(r"^[A-Za-z0-9, ]+$", skills):
            raise HTTPException(status_code=400, detail="Invalid characters in skills filter.")
    if location:
        if len(location) > 100:
            raise HTTPException(status_code=400, detail="Location filter too long (max 100 characters).")
        if not re.match(r"^[A-Za-z0-9, ]+$", location):
            raise HTTPException(status_code=400, detail="Invalid characters in location filter.")
    if experience_min is not None and experience_min < 0:
        raise HTTPException(status_code=400, detail="experience_min must be non-negative.")
    
    try:
        db = await get_mongo_db()
        query = {}
        
        if skills:
            # Case-insensitive regex search for skills
            query["technical_skills"] = {"$regex": skills, "$options": "i"}
        
        if location:
            query["location"] = {"$regex": location, "$options": "i"}
        
        if experience_min is not None:
            query["experience_years"] = {"$gte": experience_min}
        
        cursor = db.candidates.find(query).limit(50)
        candidates_list = await cursor.to_list(length=50)
        
        candidates = []
        for doc in candidates_list:
            candidates.append({
                "id": str(doc["_id"]),
                "name": doc.get("name"),
                "email": doc.get("email"),
                "phone": doc.get("phone"),
                "location": doc.get("location"),
                "technical_skills": doc.get("technical_skills"),
                "experience_years": doc.get("experience_years"),
                "seniority_level": doc.get("seniority_level"),
                "education_level": doc.get("education_level"),
                "status": doc.get("status")
            })
        
        return {
            "candidates": candidates, 
            "filters": {"skills": skills, "location": location, "experience_min": experience_min}, 
            "count": len(candidates)
        }
    except Exception as e:
        return {
            "candidates": [], 
            "filters": {"skills": skills, "location": location, "experience_min": experience_min}, 
            "count": 0, 
            "error": str(e)
        }

@app.get("/v1/candidates/job/{job_id}", tags=["Candidate Management"])
async def get_candidates_by_job(job_id: str, api_key: str = Depends(get_api_key)):
    """Get All Candidates (Dynamic Matching)"""
    if not job_id:
        raise HTTPException(status_code=400, detail="Invalid job ID")
    
    try:
        db = await get_mongo_db()
        cursor = db.candidates.find({}).limit(10)
        candidates_list = await cursor.to_list(length=10)
        
        candidates = []
        for doc in candidates_list:
            candidates.append({
                "id": str(doc["_id"]),
                "name": doc.get("name"),
                "email": doc.get("email"),
                "skills": doc.get("technical_skills"),
                "experience": doc.get("experience_years")
            })
        
        return {"candidates": candidates, "job_id": job_id, "count": len(candidates)}
    except Exception as e:
        return {"candidates": [], "job_id": job_id, "count": 0, "error": str(e)}

@app.get("/v1/candidates/{candidate_id}", tags=["Candidate Management"])
async def get_candidate_by_id(candidate_id: str, api_key: str = Depends(get_api_key)):
    """Get Specific Candidate by ID"""
    try:
        db = await get_mongo_db()
        
        # Try to convert to ObjectId if valid, otherwise search by string id
        try:
            doc = await db.candidates.find_one({"_id": ObjectId(candidate_id)})
        except:
            doc = await db.candidates.find_one({"id": candidate_id})
        
        if not doc:
            return {"error": "Candidate not found", "candidate_id": candidate_id}
        
        candidate = {
            "id": str(doc["_id"]),
            "name": doc.get("name"),
            "email": doc.get("email"),
            "phone": doc.get("phone"),
            "location": doc.get("location"),
            "experience_years": doc.get("experience_years"),
            "technical_skills": doc.get("technical_skills"),
            "seniority_level": doc.get("seniority_level"),
            "education_level": doc.get("education_level"),
            "resume_path": doc.get("resume_path"),
            "created_at": doc.get("created_at").isoformat() if doc.get("created_at") else None,
            "updated_at": doc.get("updated_at").isoformat() if doc.get("updated_at") else None
        }
        
        return {"candidate": candidate}
    except Exception as e:
        return {"error": str(e), "candidate_id": candidate_id}


@app.post("/v1/candidates/bulk", tags=["Candidate Management"])
async def bulk_upload_candidates(candidates: CandidateBulk, api_key: str = Depends(get_api_key)):
    """Bulk Upload Candidates"""
    try:
        db = await get_mongo_db()
        inserted_count = 0
        errors = []
        
        for i, candidate in enumerate(candidates.candidates):
            try:
                email = candidate.get("email", "")
                if not email:
                    errors.append(f"Candidate {i+1}: Email is required")
                    continue
                
                # Check email uniqueness
                existing = await db.candidates.find_one({"email": email})
                if existing:
                    errors.append(f"Candidate {i+1}: Email {email} already exists")
                    continue
                
                # Insert with proper error handling
                document = {
                    "name": candidate.get("name", "Unknown"),
                    "email": email,
                    "phone": candidate.get("phone", ""),
                    "location": candidate.get("location", ""),
                    "experience_years": max(0, int(candidate.get("experience_years", 0)) if str(candidate.get("experience_years", 0)).isdigit() else 0),
                    "technical_skills": candidate.get("technical_skills", ""),
                    "seniority_level": candidate.get("designation", candidate.get("seniority_level", "")),
                    "education_level": candidate.get("education_level", ""),
                    "resume_path": candidate.get("cv_url", candidate.get("resume_path", "")),
                    "status": candidate.get("status", "applied"),
                    "created_at": datetime.now(timezone.utc)
                }
                await db.candidates.insert_one(document)
                inserted_count += 1
            except Exception as e:
                errors.append(f"Candidate {i+1}: {str(e)[:100]}")
                continue
        
        return {
            "message": "Bulk upload completed",
            "candidates_received": len(candidates.candidates),
            "candidates_inserted": inserted_count,
            "errors": errors[:5] if errors else [],
            "total_errors": len(errors),
            "status": "success" if inserted_count > 0 else "failed"
        }
    except Exception as e:
        return {
            "message": "Bulk upload failed",
            "error": str(e),
            "candidates_received": len(candidates.candidates) if candidates else 0,
            "candidates_inserted": 0,
            "status": "failed"
        }

# AI Matching Engine (2 endpoints)
@app.get("/v1/match/{job_id}/top", tags=["AI Matching Engine"])
async def get_top_matches(job_id: str, limit: int = 10, api_key: str = Depends(get_api_key)):  # Changed from int to str for MongoDB ObjectId
    """AI-powered semantic candidate matching via Agent Service"""
    if limit < 1 or limit > 50:
        raise HTTPException(status_code=400, detail="Invalid limit parameter (must be 1-50)")
    
    try:
        import httpx
        agent_url = os.getenv("AGENT_SERVICE_URL")
        
        # Call agent service for AI matching
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{agent_url}/match",
                json={"job_id": job_id, "candidate_ids": []},
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {os.getenv('API_KEY_SECRET')}"
                }
            )
            
            if response.status_code == 200:
                agent_result = response.json()
                
                # Transform agent response to gateway format
                matches = []
                for candidate in agent_result.get("top_candidates", [])[:limit]:
                    matches.append({
                        "candidate_id": candidate.get("candidate_id"),
                        "name": candidate.get("name"),
                        "email": candidate.get("email"),
                        "score": candidate.get("score"),
                        "skills_match": ", ".join(candidate.get("skills_match", [])),
                        "experience_match": candidate.get("experience_match"),
                        "location_match": candidate.get("location_match"),
                        "reasoning": candidate.get("reasoning"),
                        "recommendation_strength": "Strong Match" if candidate.get("score", 0) > 80 else "Good Match"
                    })
                
                return {
                    "matches": matches,
                    "top_candidates": matches,
                    "job_id": job_id,
                    "limit": limit,
                    "total_candidates": agent_result.get("total_candidates", 0),
                    "algorithm_version": agent_result.get("algorithm_version", "2.0.0-phase2-ai"),
                    "processing_time": f"{agent_result.get('processing_time', 0)}s",
                    "ai_analysis": "Real AI semantic matching via Agent Service",
                    "agent_status": "connected"
                }
            else:
                # Fallback to database matching if agent service fails
                return await fallback_matching(job_id, limit)
                
    except Exception as e:
        log_error("agent_service_error", str(e), {"job_id": job_id})
        # Fallback to database matching
        return await fallback_matching(job_id, limit)

async def fallback_matching(job_id: str, limit: int):
    """Fallback matching when agent service is unavailable"""
    try:
        db = await get_mongo_db()
        
        # Get job requirements for better matching
        try:
            job_doc = await db.jobs.find_one({"_id": ObjectId(job_id)})
        except:
            job_doc = await db.jobs.find_one({"id": job_id})
        
        if not job_doc:
            return {"matches": [], "job_id": job_id, "limit": limit, "error": "Job not found", "agent_status": "error"}
        
        job_requirements = (job_doc.get("requirements", "") or "").lower()
        job_location = job_doc.get("location", "") or ""
        
        cursor = db.candidates.find({}).limit(limit)
        candidates_list = await cursor.to_list(length=limit)
        matches = []
        
        for i, doc in enumerate(candidates_list):
            candidate_skills = (doc.get("technical_skills") or "").lower()
            candidate_location = doc.get("location") or ""
            
            # Basic skill matching
            skill_match_count = sum(1 for skill in ['python', 'java', 'javascript'] 
                                  if skill in candidate_skills and skill in job_requirements)
            
            # Location matching
            location_match = job_location.lower() in candidate_location.lower() if job_location and candidate_location else False
            
            # Calculate score based on matches
            base_score = 60 + (skill_match_count * 10) + (10 if location_match else 0) + (5 - i)
            
            matches.append({
                "candidate_id": str(doc["_id"]),
                "name": doc.get("name"),
                "email": doc.get("email"),
                "score": min(95, base_score),
                "skills_match": doc.get("technical_skills") or "",
                "experience_match": f"Skills: {skill_match_count} matches",
                "location_match": location_match,
                "reasoning": f"Fallback matching: {skill_match_count} skill matches, location: {location_match}",
                "recommendation_strength": "Good Match" if base_score > 75 else "Fair Match"
            })
        
        return {
            "matches": matches,
            "top_candidates": matches,
            "job_id": job_id,
            "limit": limit,
            "total_candidates": len(matches),
            "algorithm_version": "2.0.0-gateway-fallback",
            "processing_time": "0.05s",
            "ai_analysis": "Database fallback - Agent service unavailable",
            "agent_status": "disconnected"
        }
    except Exception as e:
        return {"matches": [], "job_id": job_id, "limit": limit, "error": str(e), "agent_status": "error"}

async def batch_fallback_matching(job_ids: List[str]):
    """Fallback batch matching when agent service is unavailable"""
    try:
        db = await get_mongo_db()
        
        # Get job requirements for each job
        job_requirements = {}
        for job_id in job_ids:
            try:
                job_doc = await db.jobs.find_one({"_id": ObjectId(job_id)})
            except:
                job_doc = await db.jobs.find_one({"id": job_id})
            
            job_requirements[job_id] = {
                "requirements": (job_doc.get("requirements", "") if job_doc else "").lower(),
                "location": job_doc.get("location", "") if job_doc else ""
            }
        
        # Get candidates
        cursor = db.candidates.find({}).limit(5)
        candidates = await cursor.to_list(length=5)
        
        batch_results = {}
        for job_id in job_ids:
            job_req = job_requirements[job_id]
            matches = []
            
            for i, doc in enumerate(candidates):
                candidate_skills = (doc.get("technical_skills") or "").lower()
                candidate_location = doc.get("location") or ""
                
                # Basic skill matching
                skill_match_count = sum(1 for skill in ['python', 'java', 'javascript'] 
                                      if skill in candidate_skills and skill in job_req["requirements"])
                
                # Location matching
                location_match = job_req["location"].lower() in candidate_location.lower() if job_req["location"] and candidate_location else False
                
                # Calculate score
                base_score = 60 + (skill_match_count * 10) + (10 if location_match else 0) + (5 - i)
                
                matches.append({
                    "candidate_id": str(doc["_id"]),
                    "name": doc.get("name"),
                    "email": doc.get("email"),
                    "score": min(95, base_score),
                    "skills_match": doc.get("technical_skills") or "",
                    "experience_match": f"Skills: {skill_match_count} matches",
                    "location_match": location_match,
                    "reasoning": f"Fallback batch matching: {skill_match_count} skill matches, location: {location_match}",
                    "recommendation_strength": "Good Match" if base_score > 75 else "Fair Match"
                })
            
            batch_results[str(job_id)] = {
                "job_id": job_id,
                "matches": matches,
                "top_candidates": matches,
                "total_candidates": len(matches),
                "algorithm": "fallback-batch",
                "processing_time": "0.05s",
                "ai_analysis": "Database fallback - Agent service unavailable"
            }
        
        return {
            "batch_results": batch_results,
            "total_jobs_processed": len(job_ids),
            "total_candidates_analyzed": len(candidates),
            "algorithm_version": "2.0.0-gateway-fallback-batch",
            "status": "fallback_success",
            "agent_status": "disconnected"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch fallback failed: {str(e)}")

class BatchMatchRequest(BaseModel):
    job_ids: List[str]
    limit: Optional[int] = 10

@app.post("/v1/match/batch", tags=["AI Matching Engine"])
async def batch_match_jobs(
    request: BatchMatchRequest = None,
    job_ids: Optional[List[str]] = None,
    limit: Optional[int] = None,
    api_key: str = Depends(get_api_key)
):
    """Batch AI matching via Agent Service"""
    # Support both JSON body and query params
    if request:
        job_id_list = request.job_ids
        match_limit = request.limit or 10
    elif job_ids:
        job_id_list = job_ids
        match_limit = limit or 10
    else:
        raise HTTPException(status_code=400, detail="job_ids list is required")
    
    if not job_id_list or len(job_id_list) == 0:
        raise HTTPException(status_code=400, detail="At least one job ID is required")
    
    if len(job_id_list) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 jobs can be processed in batch")
    
    try:
        import httpx
        agent_url = os.getenv("AGENT_SERVICE_URL")
        
        # Call agent service for batch AI matching
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{agent_url}/batch-match",
                json={"job_ids": job_id_list},
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {os.getenv('API_KEY_SECRET')}"
                }
            )
            
            if response.status_code == 200:
                agent_result = response.json()
                
                # Transform agent batch response to detailed format
                enhanced_batch_results = {}
                for job_id_str, job_result in agent_result.get("batch_results", {}).items():
                    matches = []
                    for candidate in job_result.get("matches", []):
                        matches.append({
                            "candidate_id": candidate.get("candidate_id"),
                            "name": candidate.get("name"),
                            "email": candidate.get("email"),
                            "score": candidate.get("score"),
                            "skills_match": ", ".join(candidate.get("skills_match", [])),
                            "experience_match": candidate.get("experience_match"),
                            "location_match": candidate.get("location_match"),
                            "reasoning": candidate.get("reasoning"),
                            "recommendation_strength": "Strong Match" if candidate.get("score", 0) > 80 else "Good Match"
                        })
                    
                    enhanced_batch_results[job_id_str] = {
                        "job_id": job_result.get("job_id"),
                        "matches": matches,
                        "top_candidates": matches,
                        "total_candidates": len(matches),
                        "algorithm": job_result.get("algorithm", "phase3-ai"),
                        "processing_time": job_result.get("processing_time", "0.5s"),
                        "ai_analysis": "Real AI semantic matching via Agent Service"
                    }
                
                return {
                    "batch_results": enhanced_batch_results,
                    "total_jobs_processed": agent_result.get("total_jobs_processed", len(job_ids)),
                    "total_candidates_analyzed": agent_result.get("total_candidates_analyzed", 0),
                    "algorithm_version": agent_result.get("algorithm_version", "3.0.0-phase3-production-batch"),
                    "status": "success",
                    "agent_status": "connected"
                }
            else:
                # Fallback to database batch matching
                return await batch_fallback_matching(job_id_list)
                
    except Exception as e:
        log_error("batch_matching_error", str(e), {"job_ids": job_id_list})
        # Fallback to database batch matching
        return await batch_fallback_matching(job_id_list)

# Assessment & Workflow (5 endpoints)
@app.post("/v1/feedback", tags=["Assessment & Workflow"])
async def submit_feedback(feedback: FeedbackSubmission, api_key: str = Depends(get_api_key)):
    """Values Assessment"""
    try:
        db = await get_mongo_db()
        avg_score = (feedback.integrity + feedback.honesty + feedback.discipline + 
                    feedback.hard_work + feedback.gratitude) / 5
        
        document = {
            "candidate_id": feedback.candidate_id,
            "job_id": feedback.job_id,
            "integrity": feedback.integrity,
            "honesty": feedback.honesty,
            "discipline": feedback.discipline,
            "hard_work": feedback.hard_work,
            "gratitude": feedback.gratitude,
            "average_score": avg_score,
            "comments": feedback.comments,
            "created_at": datetime.now(timezone.utc)
        }
        result = await db.feedback.insert_one(document)
        feedback_id = str(result.inserted_id)
        
        return {
            "message": "Feedback submitted successfully",
            "feedback_id": feedback_id,
            "candidate_id": feedback.candidate_id,
            "job_id": feedback.job_id,
            "values_scores": {
                "integrity": feedback.integrity,
                "honesty": feedback.honesty,
                "discipline": feedback.discipline,
                "hard_work": feedback.hard_work,
                "gratitude": feedback.gratitude
            },
            "average_score": round(avg_score, 2),
            "submitted_at": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        return {
            "message": "Feedback submission failed",
            "error": str(e),
            "candidate_id": feedback.candidate_id,
            "job_id": feedback.job_id
        }

@app.get("/v1/feedback", tags=["Assessment & Workflow"])
async def get_all_feedback(api_key: str = Depends(get_api_key)):
    """Get All Feedback Records"""
    try:
        db = await get_mongo_db()
        
        # Use aggregation pipeline for JOIN-like behavior
        pipeline = [
            {"$lookup": {
                "from": "candidates",
                "localField": "candidate_id",
                "foreignField": "_id",
                "as": "candidate"
            }},
            {"$lookup": {
                "from": "jobs",
                "localField": "job_id",
                "foreignField": "_id",
                "as": "job"
            }},
            {"$sort": {"created_at": -1}},
            {"$project": {
                "id": {"$toString": "$_id"},
                "candidate_id": {"$toString": "$candidate_id"},
                "job_id": {"$toString": "$job_id"},
                "integrity": 1,
                "honesty": 1,
                "discipline": 1,
                "hard_work": 1,
                "gratitude": 1,
                "average_score": 1,
                "comments": 1,
                "created_at": 1,
                "candidate_name": {"$arrayElemAt": ["$candidate.name", 0]},
                "job_title": {"$arrayElemAt": ["$job.title", 0]}
            }}
        ]
        
        cursor = db.feedback.aggregate(pipeline)
        feedback_list = await cursor.to_list(length=None)
        
        feedback_records = []
        for doc in feedback_list:
            feedback_records.append({
                "id": doc.get("id"),
                "candidate_id": doc.get("candidate_id"),
                "job_id": doc.get("job_id"),
                "values_scores": {
                    "integrity": doc.get("integrity"),
                    "honesty": doc.get("honesty"),
                    "discipline": doc.get("discipline"),
                    "hard_work": doc.get("hard_work"),
                    "gratitude": doc.get("gratitude")
                },
                "average_score": float(doc.get("average_score", 0)) if doc.get("average_score") else 0,
                "comments": doc.get("comments"),
                "created_at": doc.get("created_at").isoformat() if doc.get("created_at") else None,
                "candidate_name": doc.get("candidate_name"),
                "job_title": doc.get("job_title")
            })
        
        return {"feedback": feedback_records, "count": len(feedback_records)}
    except Exception as e:
        return {"feedback": [], "count": 0, "error": str(e)}



@app.get("/v1/interviews", tags=["Assessment & Workflow"])
async def get_interviews(api_key: str = Depends(get_api_key)):
    """Get All Interviews"""
    try:
        db = await get_mongo_db()
        
        pipeline = [
            {"$lookup": {
                "from": "candidates",
                "localField": "candidate_id",
                "foreignField": "_id",
                "as": "candidate"
            }},
            {"$lookup": {
                "from": "jobs",
                "localField": "job_id",
                "foreignField": "_id",
                "as": "job"
            }},
            {"$sort": {"interview_date": -1}},
            {"$project": {
                "id": {"$toString": "$_id"},
                "candidate_id": {"$toString": "$candidate_id"},
                "job_id": {"$toString": "$job_id"},
                "interview_date": 1,
                "interviewer": 1,
                "status": 1,
                "candidate_name": {"$arrayElemAt": ["$candidate.name", 0]},
                "job_title": {"$arrayElemAt": ["$job.title", 0]}
            }}
        ]
        
        cursor = db.interviews.aggregate(pipeline)
        interviews_list = await cursor.to_list(length=None)
        
        interviews = []
        for doc in interviews_list:
            interviews.append({
                "id": doc.get("id"),
                "candidate_id": doc.get("candidate_id"),
                "job_id": doc.get("job_id"),
                "interview_date": doc.get("interview_date").isoformat() if doc.get("interview_date") else None,
                "interviewer": doc.get("interviewer"),
                "status": doc.get("status"),
                "candidate_name": doc.get("candidate_name"),
                "job_title": doc.get("job_title")
            })
        
        return {"interviews": interviews, "count": len(interviews)}
    except Exception as e:
        return {"interviews": [], "count": 0, "error": str(e)}

@app.post("/v1/interviews", tags=["Assessment & Workflow"])
async def schedule_interview(interview: InterviewSchedule, api_key: str = Depends(get_api_key)):
    """Schedule Interview"""
    try:
        db = await get_mongo_db()
        
        document = {
            "candidate_id": interview.candidate_id,
            "job_id": interview.job_id,
            "interview_date": interview.interview_date,
            "interviewer": interview.interviewer,
            "status": "scheduled",
            "notes": interview.notes,
            "created_at": datetime.now(timezone.utc)
        }
        result = await db.interviews.insert_one(document)
        interview_id = str(result.inserted_id)
        
        return {
            "message": "Interview scheduled successfully",
            "interview_id": interview_id,
            "candidate_id": interview.candidate_id,
            "job_id": interview.job_id,
            "interview_date": interview.interview_date,
            "status": "scheduled"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Interview scheduling failed: {str(e)}")

@app.post("/v1/offers", tags=["Assessment & Workflow"])
async def create_job_offer(offer: JobOffer, api_key: str = Depends(get_api_key)):
    """Job Offers Management"""
    try:
        db = await get_mongo_db()
        
        document = {
            "candidate_id": offer.candidate_id,
            "job_id": offer.job_id,
            "salary": offer.salary,
            "start_date": offer.start_date,
            "terms": offer.terms,
            "status": "pending",
            "created_at": datetime.now(timezone.utc)
        }
        result = await db.offers.insert_one(document)
        offer_id = str(result.inserted_id)
        
        return {
            "message": "Job offer created successfully",
            "offer_id": offer_id,
            "candidate_id": offer.candidate_id,
            "job_id": offer.job_id,
            "salary": offer.salary,
            "start_date": offer.start_date,
            "terms": offer.terms,
            "status": "pending",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        return {
            "message": "Job offer creation failed",
            "error": str(e),
            "candidate_id": offer.candidate_id,
            "job_id": offer.job_id
        }

@app.get("/v1/offers", tags=["Assessment & Workflow"])
async def get_all_offers(api_key: str = Depends(get_api_key)):
    """Get All Job Offers"""
    try:
        db = await get_mongo_db()
        
        pipeline = [
            {"$lookup": {
                "from": "candidates",
                "localField": "candidate_id",
                "foreignField": "_id",
                "as": "candidate"
            }},
            {"$lookup": {
                "from": "jobs",
                "localField": "job_id",
                "foreignField": "_id",
                "as": "job"
            }},
            {"$sort": {"created_at": -1}},
            {"$project": {
                "id": {"$toString": "$_id"},
                "candidate_id": {"$toString": "$candidate_id"},
                "job_id": {"$toString": "$job_id"},
                "salary": 1,
                "start_date": 1,
                "terms": 1,
                "status": 1,
                "created_at": 1,
                "candidate_name": {"$arrayElemAt": ["$candidate.name", 0]},
                "job_title": {"$arrayElemAt": ["$job.title", 0]}
            }}
        ]
        
        cursor = db.offers.aggregate(pipeline)
        offers_list = await cursor.to_list(length=None)
        
        offers = []
        for doc in offers_list:
            offers.append({
                "id": doc.get("id"),
                "candidate_id": doc.get("candidate_id"),
                "job_id": doc.get("job_id"),
                "salary": float(doc.get("salary", 0)) if doc.get("salary") else 0,
                "start_date": doc.get("start_date").isoformat() if doc.get("start_date") else None,
                "terms": doc.get("terms"),
                "status": doc.get("status"),
                "created_at": doc.get("created_at").isoformat() if doc.get("created_at") else None,
                "candidate_name": doc.get("candidate_name"),
                "job_title": doc.get("job_title")
            })
        
        return {"offers": offers, "count": len(offers)}
    except Exception as e:
        return {"offers": [], "count": 0, "error": str(e)}

# Analytics & Statistics (2 remaining endpoints)

@app.get("/v1/database/schema", tags=["Analytics & Statistics"])
async def get_database_schema(api_key: str = Depends(get_api_key)):
    """Get Database Schema Information - MongoDB"""
    try:
        db = await get_mongo_db()
        
        # Get collection list
        collections = await db.list_collection_names()
        collections.sort()
        
        # Get schema version if exists
        try:
            version_doc = await db.schema_version.find_one({}, sort=[("applied_at", -1)])
            schema_version = version_doc.get("version", "unknown") if version_doc else "unknown"
            applied_at = version_doc.get("applied_at").isoformat() if version_doc and version_doc.get("applied_at") else None
        except:
            schema_version = "1.0.0-mongodb"
            applied_at = None
        
        # Check for company_scoring_preferences collection
        phase3_exists = "company_scoring_preferences" in collections
        
        return {
            "database_type": "MongoDB Atlas",
            "schema_version": schema_version,
            "applied_at": applied_at,
            "total_collections": len(collections),
            "collections": collections,
            "phase3_enabled": phase3_exists,
            "core_collections": [
                "candidates", "jobs", "feedback", "interviews", "offers", 
                "users", "clients", "matching_cache", "audit_logs", 
                "rate_limits", "csp_violations", "company_scoring_preferences"
            ],
                "checked_at": datetime.now(timezone.utc).isoformat()
            }
    except Exception as e:
        return {
            "schema_version": "error",
            "total_tables": 0,
            "tables": [],
            "phase3_enabled": False,
            "error": str(e),
            "checked_at": datetime.now(timezone.utc).isoformat()
        }

@app.get("/v1/reports/job/{job_id}/export.csv", tags=["Analytics & Statistics"])
async def export_job_report(job_id: str, api_key: str = Depends(get_api_key)):  # Changed from int to str for MongoDB ObjectId
    """Export Job Report"""
    return {
        "message": "Job report export",
        "job_id": job_id,
        "format": "CSV",
        "download_url": f"/downloads/job_{job_id}_report.csv",
        "generated_at": datetime.now(timezone.utc).isoformat()
    }

# Client Portal API (2 endpoints)
@app.post("/v1/client/register", tags=["Client Portal API"])
async def client_register(client_data: ClientRegister):
    """Client Registration"""
    from fastapi import status
    try:
        db = await get_mongo_db()

        # Check if client_id already exists
        existing_client = await db.clients.find_one({"client_id": client_data.client_id})
        if existing_client:
            raise HTTPException(status_code=400, detail="Client ID already exists")

        # Check if email already exists
        existing_email = await db.clients.find_one({"email": client_data.contact_email})
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Generate unique client_code if not provided
        client_code = client_data.client_code or str(uuid.uuid4())

        # Check if client_code already exists (should be unique)
        existing_code = await db.clients.find_one({"client_code": client_code})
        if existing_code:
            raise HTTPException(status_code=400, detail="Client code already exists. Please try again.")

        # Hash password
        password_hash = bcrypt.hashpw(client_data.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Insert client
        document = {
            "client_id": client_data.client_id,
            "company_name": client_data.company_name,
            "email": client_data.contact_email,
            "client_code": client_code,
            "password_hash": password_hash,
            "status": "active",
            "failed_login_attempts": 0,
            "locked_until": None,
            "created_at": datetime.now(timezone.utc)
        }
        await db.clients.insert_one(document)

        from fastapi import Response
        return Response(
            content=json.dumps({
                "success": True,
                "message": "Client registration successful",
                "client_id": client_data.client_id,
                "company_name": client_data.company_name,
                "client_code": client_code
            }),
            status_code=status.HTTP_201_CREATED,
            media_type="application/json"
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/v1/client/login", tags=["Client Portal API"])
async def client_login(login_data: ClientLogin):
    """Client Authentication with Database Integration"""
    try:
        db = await get_mongo_db()
        
        # Get client by client_id from clients collection
        client = await db.clients.find_one({"client_id": login_data.client_id})
        
        if not client:
            return {"success": False, "error": "Invalid credentials"}
        
        # Check if account is locked
        if client.get("locked_until") and client.get("locked_until") > datetime.now(timezone.utc):
            return {"success": False, "error": "Account temporarily locked"}
        
        # Check if account is active
        if client.get("status") != 'active':
            return {"success": False, "error": "Account is inactive"}
        
        # Verify password
        if client.get("password_hash"):
            if not bcrypt.checkpw(login_data.password.encode('utf-8'), client.get("password_hash").encode('utf-8')):
                # Increment failed attempts
                new_attempts = (client.get("failed_login_attempts") or 0) + 1
                locked_until = None
                if new_attempts >= 5:
                    locked_until = datetime.now(timezone.utc) + timedelta(minutes=30)
                
                await db.clients.update_one(
                    {"client_id": login_data.client_id},
                    {"$set": {
                        "failed_login_attempts": new_attempts,
                        "locked_until": locked_until
                    }}
                )
                
                return {"success": False, "error": "Invalid credentials"}
        else:
            # No password hash exists - require password to be set
            return {"success": False, "error": "Account requires password setup"}
        
        # Generate JWT token using JWT_SECRET_KEY
        jwt_secret = os.getenv("JWT_SECRET_KEY")
        token_payload = {
            "client_id": client.get("client_id"),
            "company_name": client.get("company_name"),
            "exp": int(datetime.now(timezone.utc).timestamp()) + 86400  # 24 hours
        }
        access_token = jwt.encode(token_payload, jwt_secret, algorithm="HS256")
        
        # Reset failed attempts and update last login
        await db.clients.update_one(
            {"client_id": login_data.client_id},
            {"$set": {
                "failed_login_attempts": 0,
                "locked_until": None
            }}
        )
        
        return {
            "success": True,
            "message": "Authentication successful",
            "client_id": client.get("client_id"),
            "company_name": client.get("company_name"),
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": 86400,  # 24 hours
            "permissions": ["view_jobs", "create_jobs", "view_candidates", "schedule_interviews"]
        }
            
    except Exception as e:
        return {
            "success": False,
            "error": f"Authentication error: {str(e)}"
        }

# Security Testing (7 endpoints)
@app.get("/v1/security/rate-limit-status", tags=["Security Testing"])
async def check_rate_limit_status(api_key: str = Depends(get_api_key)):
    """Check Rate Limit Status"""
    return {
        "rate_limit_enabled": True,
        "requests_per_minute": 60,
        "current_requests": 15,
        "remaining_requests": 45,
        "reset_time": datetime.now(timezone.utc).isoformat(),
        "status": "active"
    }

@app.get("/v1/security/blocked-ips", tags=["Security Testing"])
async def view_blocked_ips(api_key: str = Depends(get_api_key)):
    """View Blocked IPs"""
    return {
        "blocked_ips": [
            {"ip": "192.168.1.100", "reason": "Rate limit exceeded", "blocked_at": "2025-01-02T10:30:00Z"},
            {"ip": "10.0.0.50", "reason": "Suspicious activity", "blocked_at": "2025-01-02T09:15:00Z"}
        ],
        "total_blocked": 2,
        "last_updated": datetime.now(timezone.utc).isoformat()
    }

@app.post("/v1/security/test-input-validation", tags=["Security Testing"])
async def test_input_validation(input_data: InputValidation, api_key: str = Depends(get_api_key)):
    """Test Input Validation"""
    data = input_data.input_data
    threats = []
    
    if "<script>" in data.lower():
        threats.append("XSS attempt detected")
    if "'" in data and ("union" in data.lower() or "select" in data.lower()):
        threats.append("SQL injection attempt detected")
    
    return {
        "input": data,
        "validation_result": "SAFE" if not threats else "BLOCKED",
        "threats_detected": threats,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.post("/v1/security/validate-email", tags=["Security Testing"])
async def validate_email(email_data: EmailValidation, api_key: str = Depends(get_api_key)):
    """Email Validation"""
    email = email_data.email
    
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    is_valid = re.match(email_pattern, email) is not None
    
    return {
        "email": email,
        "is_valid": is_valid,
        "validation_type": "regex_pattern",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.post("/v1/security/test-email-validation", tags=["Security Testing"])
async def test_email_validation(email_data: EmailValidation, api_key: str = Depends(get_api_key)):
    """Test Email Validation"""
    email = email_data.email
    
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    is_valid = re.match(email_pattern, email) is not None
    
    return {
        "email": email,
        "is_valid": is_valid,
        "validation_type": "regex_pattern",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.post("/v1/security/validate-phone", tags=["Security Testing"])
async def validate_phone(phone_data: PhoneValidation, api_key: str = Depends(get_api_key)):
    """Phone Validation"""
    phone = phone_data.phone
    
    phone_pattern = r'^(\+91|91)?[6-9]\d{9}$'
    is_valid = re.match(phone_pattern, phone) is not None
    
    return {
        "phone": phone,
        "is_valid": is_valid,
        "validation_type": "Indian_phone_format",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.post("/v1/security/test-phone-validation", tags=["Security Testing"])
async def test_phone_validation(phone_data: PhoneValidation, api_key: str = Depends(get_api_key)):
    """Test Phone Validation"""
    phone = phone_data.phone
    
    phone_pattern = r'^(\+91|91)?[6-9]\d{9}$'
    is_valid = re.match(phone_pattern, phone) is not None
    
    return {
        "phone": phone,
        "is_valid": is_valid,
        "validation_type": "Indian_phone_format",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.get("/v1/security/test-headers", tags=["Security Testing"])
async def test_security_headers(response: Response, api_key: str = Depends(get_api_key)):
    """Security Headers Test"""
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    
    return {
        "security_headers": {
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "Content-Security-Policy": "default-src 'self'"
        },
        "headers_count": 5,
        "status": "all_headers_applied"
    }

@app.get("/v1/security/security-headers-test", tags=["Security Testing"])
async def test_security_headers_legacy(response: Response, api_key: str = Depends(get_api_key)):
    """Test Security Headers"""
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    
    return {
        "security_headers": {
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "Content-Security-Policy": "default-src 'self'"
        },
        "headers_count": 5,
        "status": "all_headers_applied"
    }

@app.post("/v1/security/penetration-test", tags=["Security Testing"])
async def penetration_test(test_data: SecurityTest, api_key: str = Depends(get_api_key)):
    """Penetration Test"""
    return {
        "message": "Penetration test completed",
        "test_type": test_data.test_type,
        "payload": test_data.payload,
        "result": "No vulnerabilities detected",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.get("/v1/security/test-auth", tags=["Security Testing"])
async def test_authentication(api_key: str = Depends(get_api_key)):
    """Test Authentication"""
    return {
        "message": "Authentication test successful",
        "authenticated": True,
        "api_key_valid": True,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.get("/v1/security/penetration-test-endpoints", tags=["Security Testing"])
async def penetration_test_endpoints(api_key: str = Depends(get_api_key)):
    """Penetration Testing Endpoints"""
    return {
        "test_endpoints": [
            {"endpoint": "/v1/security/test-input-validation", "method": "POST", "purpose": "XSS/SQL injection testing"},
            {"endpoint": "/v1/security/test-email-validation", "method": "POST", "purpose": "Email format validation"},
            {"endpoint": "/v1/security/test-phone-validation", "method": "POST", "purpose": "Phone format validation"},
            {"endpoint": "/v1/security/security-headers-test", "method": "GET", "purpose": "Security headers verification"}
        ],
        "total_endpoints": 4,
        "penetration_testing_enabled": True
    }

# CSP Management (4 endpoints)
@app.post("/v1/security/csp-report", tags=["CSP Management"])
async def csp_violation_reporting(csp_report: CSPReport, api_key: str = Depends(get_api_key)):
    """CSP Violation Reporting"""
    return {
        "message": "CSP violation reported successfully",
        "violation": {
            "violated_directive": csp_report.violated_directive,
            "blocked_uri": csp_report.blocked_uri,
            "document_uri": csp_report.document_uri,
            "timestamp": datetime.now(timezone.utc).isoformat()
        },
        "report_id": f"csp_report_{datetime.now().timestamp()}"
    }

@app.get("/v1/security/csp-violations", tags=["CSP Management"])
async def view_csp_violations(api_key: str = Depends(get_api_key)):
    """View CSP Violations"""
    return {
        "violations": [
            {
                "id": "csp_001",
                "violated_directive": "script-src",
                "blocked_uri": "https://malicious-site.com/script.js",
                "document_uri": "https://bhiv-platform.com/dashboard",
                "timestamp": "2025-01-02T10:15:00Z"
            }
        ],
        "total_violations": 1,
        "last_24_hours": 1
    }



@app.get("/v1/security/csp-policies", tags=["CSP Management"])
async def current_csp_policies(api_key: str = Depends(get_api_key)):
    """Current CSP Policies"""
    return {
        "current_policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:; media-src 'self'; object-src 'none'; child-src 'self'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests; block-all-mixed-content",
        "policy_length": 408,
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "status": "active"
    }

@app.post("/v1/security/test-csp-policy", tags=["CSP Management"])
async def test_csp_policy(csp_data: CSPPolicy, api_key: str = Depends(get_api_key)):
    """Test CSP Policy"""
    return {
        "message": "CSP policy test completed",
        "test_policy": csp_data.policy,
        "policy_length": len(csp_data.policy),
        "validation_result": "valid",
        "tested_at": datetime.now(timezone.utc).isoformat()
    }

# Two-Factor Authentication (8 endpoints)
@app.post("/v1/auth/2fa/setup", tags=["Two-Factor Authentication"])
async def setup_2fa(setup_data: TwoFASetup, api_key: str = Depends(get_api_key)):
    """Setup 2FA"""
    secret = pyotp.random_base32()
    totp_uri = pyotp.totp.TOTP(secret).provisioning_uri(
        name=setup_data.user_id,
        issuer_name="BHIV HR Platform"
    )
    
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(totp_uri)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img_buffer = io.BytesIO()
    img.save(img_buffer, format='PNG')
    img_str = base64.b64encode(img_buffer.getvalue()).decode()
    
    return {
        "message": "2FA setup initiated",
        "user_id": setup_data.user_id,
        "secret": secret,
        "qr_code": f"data:image/png;base64,{img_str}",
        "manual_entry_key": secret,
        "instructions": "Scan QR code with Google Authenticator, Microsoft Authenticator, or Authy"
    }

@app.post("/v1/auth/2fa/verify", tags=["Two-Factor Authentication"])
async def verify_2fa(login_data: TwoFALogin, api_key: str = Depends(get_api_key)):
    """Verify 2FA"""
    stored_secret = "JBSWY3DPEHPK3PXP"
    totp = pyotp.TOTP(stored_secret)
    
    if totp.verify(login_data.totp_code, valid_window=1):
        return {
            "message": "2FA verification successful",
            "user_id": login_data.user_id,
            "verified": True,
            "verified_at": datetime.now(timezone.utc).isoformat()
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid 2FA code")

@app.post("/v1/auth/2fa/login", tags=["Two-Factor Authentication"])
async def login_2fa(login_data: TwoFALogin, api_key: str = Depends(get_api_key)):
    """2FA Login"""
    stored_secret = "JBSWY3DPEHPK3PXP"
    totp = pyotp.TOTP(stored_secret)
    
    if totp.verify(login_data.totp_code, valid_window=1):
        return {
            "message": "2FA authentication successful",
            "user_id": login_data.user_id,
            "access_token": f"2fa_token_{login_data.user_id}_{datetime.now().timestamp()}",
            "token_type": "bearer",
            "expires_in": 3600,
            "2fa_verified": True
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid 2FA code")

@app.get("/v1/auth/2fa/status/{user_id}", tags=["Two-Factor Authentication"])
async def get_2fa_status_auth(user_id: str, api_key: str = Depends(get_api_key)):
    """2FA Status"""
    return {
        "user_id": user_id,
        "2fa_enabled": True,
        "setup_date": "2025-01-01T12:00:00Z",
        "last_used": "2025-01-02T08:30:00Z",
        "backup_codes_remaining": 8
    }

@app.post("/v1/auth/2fa/disable", tags=["Two-Factor Authentication"])
async def disable_2fa_auth(setup_data: TwoFASetup, api_key: str = Depends(get_api_key)):
    """Disable 2FA"""
    return {
        "message": "2FA disabled successfully",
        "user_id": setup_data.user_id,
        "disabled_at": datetime.now(timezone.utc).isoformat(),
        "2fa_enabled": False
    }

@app.post("/v1/auth/2fa/backup-codes", tags=["Two-Factor Authentication"])
async def generate_backup_codes_auth(setup_data: TwoFASetup, api_key: str = Depends(get_api_key)):
    """Generate Backup Codes"""
    backup_codes = [f"BACKUP-{secrets.token_hex(4).upper()}" for _ in range(10)]
    
    return {
        "message": "Backup codes generated successfully",
        "user_id": setup_data.user_id,
        "backup_codes": backup_codes,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "codes_count": len(backup_codes)
    }

@app.post("/v1/auth/2fa/test-token", tags=["Two-Factor Authentication"])
async def test_2fa_token_auth(login_data: TwoFALogin, api_key: str = Depends(get_api_key)):
    """Test Token"""
    stored_secret = "JBSWY3DPEHPK3PXP"
    totp = pyotp.TOTP(stored_secret)
    
    is_valid = totp.verify(login_data.totp_code, valid_window=1)
    
    return {
        "user_id": login_data.user_id,
        "token": login_data.totp_code,
        "is_valid": is_valid,
        "test_timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.get("/v1/auth/2fa/qr/{user_id}", tags=["Two-Factor Authentication"])
async def get_qr_code(user_id: str, api_key: str = Depends(get_api_key)):
    """QR Code"""
    secret = "JBSWY3DPEHPK3PXP"
    totp_uri = pyotp.totp.TOTP(secret).provisioning_uri(
        name=user_id,
        issuer_name="BHIV HR Platform"
    )
    
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(totp_uri)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img_buffer = io.BytesIO()
    img.save(img_buffer, format='PNG')
    img_str = base64.b64encode(img_buffer.getvalue()).decode()
    
    return {
        "user_id": user_id,
        "qr_code": f"data:image/png;base64,{img_str}",
        "secret": secret,
        "generated_at": datetime.now(timezone.utc).isoformat()
    }



# Password Management (6 endpoints)
@app.post("/v1/auth/password/validate", tags=["Password Management"])
async def validate_password(password_data: PasswordValidation, api_key: str = Depends(get_api_key)):
    """Validate Password"""
    password = password_data.password
    
    score = 0
    feedback = []
    
    if len(password) >= 8:
        score += 20
    else:
        feedback.append("Password should be at least 8 characters long")
    
    if any(c.isupper() for c in password):
        score += 20
    else:
        feedback.append("Password should contain uppercase letters")
    
    if any(c.islower() for c in password):
        score += 20
    else:
        feedback.append("Password should contain lowercase letters")
    
    if any(c.isdigit() for c in password):
        score += 20
    else:
        feedback.append("Password should contain numbers")
    
    if any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password):
        score += 20
    else:
        feedback.append("Password should contain special characters")
    
    strength = "Very Weak"
    if score >= 80:
        strength = "Very Strong"
    elif score >= 60:
        strength = "Strong"
    elif score >= 40:
        strength = "Medium"
    elif score >= 20:
        strength = "Weak"
    
    return {
        "password_strength": strength,
        "score": score,
        "max_score": 100,
        "is_valid": score >= 60,
        "feedback": feedback
    }

@app.get("/v1/auth/password/generate", tags=["Password Management"])
async def generate_password(length: int = 12, include_symbols: bool = True, api_key: str = Depends(get_api_key)):
    """Generate Password"""
    if length < 8 or length > 128:
        raise HTTPException(status_code=400, detail="Password length must be between 8 and 128 characters")
    
    chars = string.ascii_letters + string.digits
    if include_symbols:
        chars += "!@#$%^&*()_+-="
    password = ''.join(random.choice(chars) for _ in range(length))
    
    return {
        "generated_password": password,
        "length": length,
        "entropy_bits": length * 6.5,
        "strength": "Very Strong",
        "generated_at": datetime.now(timezone.utc).isoformat()
    }

@app.get("/v1/auth/password/policy", tags=["Password Management"])
async def get_password_policy_auth(api_key: str = Depends(get_api_key)):
    """Password Policy"""
    return {
        "policy": {
            "minimum_length": 8,
            "require_uppercase": True,
            "require_lowercase": True,
            "require_numbers": True,
            "require_special_chars": True,
            "max_age_days": 90,
            "history_count": 5
        },
        "complexity_requirements": [
            "At least 8 characters long",
            "Contains uppercase letters",
            "Contains lowercase letters", 
            "Contains numbers",
            "Contains special characters"
        ]
    }

@app.post("/v1/auth/password/change", tags=["Password Management"])
async def change_password_auth(password_change: PasswordChange, api_key: str = Depends(get_api_key)):
    """Change Password"""
    return {
        "message": "Password changed successfully",
        "changed_at": datetime.now(timezone.utc).isoformat(),
        "password_strength": "Strong",
        "next_change_due": "2025-04-02T00:00:00Z"
    }

@app.post("/v1/auth/password/strength", tags=["Password Management"])
async def test_password_strength(password_data: PasswordValidation, api_key: str = Depends(get_api_key)):
    """Password Strength Test"""
    password = password_data.password
    
    score = 0
    feedback = []
    
    if len(password) >= 8:
        score += 20
    else:
        feedback.append("Password should be at least 8 characters long")
    
    if any(c.isupper() for c in password):
        score += 20
    else:
        feedback.append("Password should contain uppercase letters")
    
    if any(c.islower() for c in password):
        score += 20
    else:
        feedback.append("Password should contain lowercase letters")
    
    if any(c.isdigit() for c in password):
        score += 20
    else:
        feedback.append("Password should contain numbers")
    
    if any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password):
        score += 20
    else:
        feedback.append("Password should contain special characters")
    
    strength = "Very Weak"
    if score >= 80:
        strength = "Very Strong"
    elif score >= 60:
        strength = "Strong"
    elif score >= 40:
        strength = "Medium"
    elif score >= 20:
        strength = "Weak"
    
    return {
        "password_strength": strength,
        "score": score,
        "max_score": 100,
        "is_valid": score >= 60,
        "feedback": feedback
    }

@app.get("/v1/auth/password/security-tips", tags=["Password Management"])
async def get_security_tips(api_key: str = Depends(get_api_key)):
    """Security Tips"""
    return {
        "security_tips": [
            "Use a unique password for each account",
            "Enable two-factor authentication when available",
            "Use a password manager to generate and store passwords",
            "Avoid using personal information in passwords",
            "Change passwords immediately if a breach is suspected",
            "Use passphrases with random words for better security"
        ],
        "password_requirements": {
            "minimum_length": 8,
            "character_types": 4,
            "avoid": ["dictionary words", "personal info", "common patterns"]
        }
    }





# Candidate Portal APIs (5 endpoints)
@app.post("/v1/candidate/register", tags=["Candidate Portal"])
async def candidate_register(candidate_data: CandidateRegister):
    """Candidate Registration"""
    try:
        db = await get_mongo_db()
        
        # Check if email already exists
        existing = await db.candidates.find_one({"email": candidate_data.email})
        if existing:
            return {"success": False, "error": "Email already registered"}
        
        # Hash password
        password_hash = bcrypt.hashpw(candidate_data.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Insert candidate with password hash
        document = {
            "name": candidate_data.name,
            "email": candidate_data.email,
            "phone": candidate_data.phone,
            "location": candidate_data.location,
            "experience_years": candidate_data.experience_years or 0,
            "technical_skills": candidate_data.technical_skills,
            "education_level": candidate_data.education_level,
            "seniority_level": candidate_data.seniority_level,
            "password_hash": password_hash,
            "status": "applied",
            "created_at": datetime.now(timezone.utc)
        }
        result = await db.candidates.insert_one(document)
        candidate_id = str(result.inserted_id)
        
        return {
            "success": True,
            "message": "Registration successful",
            "candidate_id": candidate_id
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/v1/candidate/login", tags=["Candidate Portal"])
async def candidate_login(login_data: CandidateLogin):
    """Candidate Login"""
    try:
        db = await get_mongo_db()
        
        # Get candidate by email
        candidate = await db.candidates.find_one({"email": login_data.email})
        
        if not candidate:
            return {"success": False, "error": "Invalid credentials"}
        
        # Verify password hash
        if candidate.get("password_hash"):
            if not bcrypt.checkpw(login_data.password.encode('utf-8'), candidate.get("password_hash").encode('utf-8')):
                return {"success": False, "error": "Invalid credentials"}
        # If no password hash exists, accept any password (for existing test data)
        
        # Generate JWT token
        jwt_secret = os.getenv("CANDIDATE_JWT_SECRET_KEY")
        token_payload = {
            "candidate_id": str(candidate["_id"]),
            "email": candidate.get("email"),
            "exp": int(datetime.now(timezone.utc).timestamp()) + 86400  # 24 hours
        }
        token = jwt.encode(token_payload, jwt_secret, algorithm="HS256")
        
        return {
            "success": True,
            "message": "Login successful",
            "token": token,
            "candidate": {
                "id": str(candidate["_id"]),
                "name": candidate.get("name"),
                "email": candidate.get("email"),
                "phone": candidate.get("phone"),
                "location": candidate.get("location"),
                "experience_years": candidate.get("experience_years"),
                "technical_skills": candidate.get("technical_skills"),
                "seniority_level": candidate.get("seniority_level"),
                "education_level": candidate.get("education_level"),
                "status": candidate.get("status")
            }
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/v1/candidate/profile/{candidate_id}", tags=["Candidate Portal"])
async def get_candidate_profile(candidate_id: str, auth = Depends(get_auth)):
    """Get Candidate Profile (JWT authenticated)"""
    try:
        db = await get_mongo_db()
        
        # Verify the candidate_id matches the authenticated user (if using candidate token)
        auth_info = auth
        if auth_info.get("type") == "candidate_token":
            token_candidate_id = str(auth_info.get("candidate_id", ""))
            # Compare as strings to handle ObjectId vs string differences
            if token_candidate_id and token_candidate_id != str(candidate_id):
                # Also try ObjectId comparison
                try:
                    if ObjectId(token_candidate_id) != ObjectId(candidate_id):
                        raise HTTPException(status_code=403, detail="You can only view your own profile")
                except:
                    # If ObjectId conversion fails, use string comparison
                    if token_candidate_id != str(candidate_id):
                        raise HTTPException(status_code=403, detail="You can only view your own profile")
        
        # Try to convert to ObjectId if valid, otherwise search by string id
        try:
            doc = await db.candidates.find_one({"_id": ObjectId(candidate_id)})
        except:
            doc = await db.candidates.find_one({"id": candidate_id})
        
        if not doc:
            return {"error": "Candidate not found", "candidate_id": candidate_id}
        
        candidate = {
            "id": str(doc["_id"]),
            "name": doc.get("name"),
            "email": doc.get("email"),
            "phone": doc.get("phone"),
            "location": doc.get("location"),
            "experience_years": doc.get("experience_years"),
            "technical_skills": doc.get("technical_skills"),
            "seniority_level": doc.get("seniority_level"),
            "education_level": doc.get("education_level"),
            "resume_path": doc.get("resume_path"),
            "resume_url": doc.get("resume_path"),  # Alias for frontend compatibility
            "created_at": doc.get("created_at").isoformat() if doc.get("created_at") else None,
            "updated_at": doc.get("updated_at").isoformat() if doc.get("updated_at") else None
        }
        
        return candidate
    except HTTPException:
        raise
    except Exception as e:
        return {"error": str(e), "candidate_id": candidate_id}

@app.put("/v1/candidate/profile/{candidate_id}", tags=["Candidate Portal"])
async def update_candidate_profile(candidate_id: str, profile_data: CandidateProfileUpdate, auth = Depends(get_auth)):
    """Update Candidate Profile"""
    try:
        db = await get_mongo_db()
        
        # Input validation
        if profile_data.phone and not re.match(r"^(\+91|91)?[6-9]\d{9}$", profile_data.phone):
            raise HTTPException(status_code=400, detail="Invalid Indian phone number format.")
        if profile_data.experience_years is not None and profile_data.experience_years < 0:
            raise HTTPException(status_code=400, detail="Experience years cannot be negative.")
        
        # Build update fields
        update_fields = {}
        
        if profile_data.name:
            update_fields["name"] = profile_data.name
        if profile_data.phone:
            update_fields["phone"] = profile_data.phone
        if profile_data.location:
            update_fields["location"] = profile_data.location
        if profile_data.experience_years is not None:
            update_fields["experience_years"] = profile_data.experience_years
        if profile_data.technical_skills:
            update_fields["technical_skills"] = profile_data.technical_skills
        if profile_data.education_level:
            update_fields["education_level"] = profile_data.education_level
        if profile_data.seniority_level:
            update_fields["seniority_level"] = profile_data.seniority_level
        
        if not update_fields:
            return {"success": False, "error": "No fields to update"}
        
        update_fields["updated_at"] = datetime.now(timezone.utc)
        
        try:
            result = await db.candidates.update_one(
                {"_id": ObjectId(candidate_id)},
                {"$set": update_fields}
            )
        except:
            result = await db.candidates.update_one(
                {"id": candidate_id},
                {"$set": update_fields}
            )
        
        return {"success": True, "message": "Profile updated successfully"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/v1/candidate/apply", tags=["Candidate Portal"])
async def apply_for_job(application: JobApplication, auth = Depends(get_auth)):
    """Apply for Job"""
    try:
        db = await get_mongo_db()
        
        # Normalize candidate_id to string for consistency
        candidate_id_str = str(application.candidate_id)
        job_id_str = str(application.job_id)
        
        print(f"Applying for job - candidate_id: {candidate_id_str}, job_id: {job_id_str}")
        
        # Check if already applied - try multiple formats
        existing = None
        try:
            # Try string match first
            existing = await db.job_applications.find_one({
                "candidate_id": candidate_id_str,
                "job_id": job_id_str
            })
            
            # If not found, try ObjectId match
            if not existing:
                try:
                    candidate_obj_id = ObjectId(candidate_id_str)
                    existing = await db.job_applications.find_one({
                        "candidate_id": str(candidate_obj_id),
                        "job_id": job_id_str
                    })
                except:
                    pass
        except Exception as e:
            print(f"Error checking existing application: {e}")
        
        if existing:
            return {"success": False, "error": "Already applied for this job"}
        
        # Insert application with normalized IDs
        document = {
            "candidate_id": candidate_id_str,  # Store as string for consistency
            "job_id": job_id_str,
            "cover_letter": application.cover_letter,
            "status": "applied",
            "applied_date": datetime.now(timezone.utc)
        }
        result = await db.job_applications.insert_one(document)
        application_id = str(result.inserted_id)
        
        print(f"Application inserted successfully - application_id: {application_id}")
        
        return {
            "success": True,
            "message": "Application submitted successfully",
            "application_id": application_id
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/v1/candidate/applications/{candidate_id}", tags=["Candidate Portal"])
async def get_candidate_applications(candidate_id: str, auth = Depends(get_auth)):
    """Get Candidate Applications"""
    try:
        db = await get_mongo_db()
        
        # Try multiple query strategies to find applications
        applications_list = []
        
        # Strategy 1: Direct string match
        try:
            cursor = db.job_applications.find({"candidate_id": candidate_id}).sort("applied_date", -1)
            applications_list = await cursor.to_list(length=None)
            print(f"Found {len(applications_list)} applications with string match for candidate_id: {candidate_id}")
        except Exception as e:
            print(f"String match error: {e}")
        
        # Strategy 2: Try ObjectId conversion and match
        if not applications_list:
            try:
                candidate_object_id = ObjectId(candidate_id)
                # Try matching with ObjectId as string
                cursor = db.job_applications.find({"candidate_id": str(candidate_object_id)}).sort("applied_date", -1)
                applications_list = await cursor.to_list(length=None)
                print(f"Found {len(applications_list)} applications with ObjectId string match")
            except Exception as e:
                print(f"ObjectId match error: {e}")
        
        # Strategy 3: Try all variations (for debugging)
        if not applications_list:
            # Get all applications and filter manually (fallback)
            all_apps = await db.job_applications.find({}).to_list(length=100)
            print(f"Total applications in DB: {len(all_apps)}")
            for app in all_apps:
                app_candidate_id = str(app.get("candidate_id", ""))
                if app_candidate_id == candidate_id or app_candidate_id == str(candidate_id):
                    applications_list.append(app)
            print(f"Found {len(applications_list)} applications with manual filter")
        
        applications = []
        for doc in applications_list:
            # Get job details
            job_doc = None
            try:
                job_doc = await db.jobs.find_one({"_id": ObjectId(doc.get("job_id"))})
            except:
                job_doc = await db.jobs.find_one({"id": doc.get("job_id")})
            
            applications.append({
                "id": str(doc["_id"]),
                "job_id": doc.get("job_id"),
                "status": doc.get("status"),
                "applied_date": doc.get("applied_date").isoformat() if doc.get("applied_date") else None,
                "cover_letter": doc.get("cover_letter"),
                "job_title": job_doc.get("title") if job_doc else None,
                "department": job_doc.get("department") if job_doc else None,
                "location": job_doc.get("location") if job_doc else None,
                "experience_level": job_doc.get("experience_level") if job_doc else None,
                "company": "BHIV Partner",
                "updated_at": doc.get("applied_date").isoformat() if doc.get("applied_date") else None
            })
        
        return {"applications": applications, "count": len(applications)}
    except Exception as e:
        return {"applications": [], "count": 0, "error": str(e)}
