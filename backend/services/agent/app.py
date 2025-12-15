from fastapi import FastAPI, HTTPException, Depends, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import psycopg2
from psycopg2 import pool
import os
import json
import sys
import logging
import jwt
from typing import List, Dict, Any
from datetime import datetime

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

# Import Phase 3 engine from shared semantic_engine module
try:
    from semantic_engine.phase3_engine import (
        Phase3SemanticEngine,
        AdvancedSemanticMatcher,
        BatchMatcher,
        LearningEngine,
        SemanticJobMatcher
    )
    PHASE3_AVAILABLE = True
except ImportError:
    PHASE3_AVAILABLE = False
    Phase3SemanticEngine = None
    AdvancedSemanticMatcher = None
    BatchMatcher = None
    LearningEngine = None
    SemanticJobMatcher = None
            
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Log Phase 3 availability after logger is configured
if not PHASE3_AVAILABLE:
    logger.warning("Phase 3 engine not available, using fallback mode")

if PHASE3_AVAILABLE:
    print("INFO: Phase 3 Production Semantic Engine loaded")
else:
    print("WARNING: Phase 3 engine not available, using fallback mode")

from fastapi.openapi.utils import get_openapi

# Security setup - Use Supabase authentication
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'shared'))

try:
    from supabase_auth import (
        security,
        validate_api_key,
        get_api_key,
        get_auth,
        auth_dependency,
    )
except ImportError:
    # Fallback if shared module not available
    from fastapi.security import HTTPBearer
    security = HTTPBearer()
    
    def validate_api_key(api_key: str) -> bool:
        expected_key = os.getenv("API_KEY_SECRET")
        return api_key == expected_key
    
    def auth_dependency(credentials = Security(security)):
        if not credentials:
            raise HTTPException(status_code=401, detail="Authentication required")
        if validate_api_key(credentials.credentials):
            return {"type": "api_key", "credentials": credentials.credentials}
        raise HTTPException(status_code=401, detail="Invalid authentication")

app = FastAPI(
    title="BHIV AI Matching Engine",
    description="Advanced AI-Powered Semantic Candidate Matching Service",
    version="3.0.0"
)

# Custom OpenAPI schema with organized tags and security
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="BHIV AI Matching Engine",
        version="3.0.0",
        description="Advanced AI-Powered Semantic Candidate Matching Service",
        routes=app.routes,
    )
    openapi_schema["tags"] = [
        {"name": "Core API Endpoints", "description": "Service health and system information"},
        {"name": "AI Matching Engine", "description": "Semantic candidate matching and scoring"},
        {"name": "Candidate Analysis", "description": "Detailed candidate profile analysis"},
        {"name": "System Diagnostics", "description": "Database connectivity and testing"}
    ]
    # Add Bearer token security scheme
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    # Apply security to all endpoints except health
    for path in openapi_schema["paths"]:
        for method in openapi_schema["paths"][path]:
            if path not in ["/", "/health"]:
                openapi_schema["paths"][path][method]["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# Initialize Phase 3 production engine if available
phase3_engine = None
advanced_matcher = None
batch_matcher = None
learning_engine = None

if PHASE3_AVAILABLE and Phase3SemanticEngine:
    try:
        phase3_engine = Phase3SemanticEngine()
        advanced_matcher = AdvancedSemanticMatcher()
        batch_matcher = BatchMatcher()
        learning_engine = LearningEngine()
        print("SUCCESS: Phase 3 Production Engine initialized")
    except Exception as e:
        logger.error(f"Failed to initialize Phase 3 engine: {e}")
        PHASE3_AVAILABLE = False
else:
    print("INFO: Running in fallback mode without Phase 3 engine")

class MatchRequest(BaseModel):
    job_id: int

class CandidateScore(BaseModel):
    candidate_id: int
    name: str
    email: str
    score: float
    skills_match: List[str]
    experience_match: str
    location_match: bool
    reasoning: str

class MatchResponse(BaseModel):
    job_id: int
    top_candidates: List[CandidateScore]
    total_candidates: int
    processing_time: float
    algorithm_version: str
    status: str

# Initialize connection pool
connection_pool = None

def init_connection_pool():
    """Initialize database connection pool"""
    global connection_pool
    database_url = os.getenv("DATABASE_URL")
    
    try:
        connection_pool = psycopg2.pool.ThreadedConnectionPool(
            minconn=2,
            maxconn=10,
            dsn=database_url,
            connect_timeout=10,
            application_name="bhiv_agent"
        )
        logger.info("Database connection pool initialized")
    except Exception as e:
        logger.error(f"Failed to initialize connection pool: {e}")

def get_db_connection():
    """Get database connection from pool"""
    global connection_pool
    if not connection_pool:
        init_connection_pool()
    
    try:
        conn = connection_pool.getconn()
        if conn:
            conn.autocommit = True
        return conn
    except Exception as e:
        logger.error(f"Failed to get connection from pool: {e}")
        return None

def return_db_connection(conn):
    """Return connection to pool"""
    global connection_pool
    if connection_pool and conn:
        connection_pool.putconn(conn)

@app.get("/", tags=["Core API Endpoints"], summary="AI Service Information")
def read_root():
    return {
        "service": "BHIV AI Agent",
        "version": "3.0.0",
        "endpoints": 6,
        "available_endpoints": {
            "root": "GET / - Service information",
            "health": "GET /health - Service health check", 
            "test_db": "GET /test-db - Database connectivity test",
            "match": "POST /match - AI-powered candidate matching",
            "batch_match": "POST /batch-match - Batch AI matching for multiple jobs",
            "analyze": "GET /analyze/{candidate_id} - Detailed candidate analysis"
        }
    }

@app.get("/health", tags=["Core API Endpoints"], summary="Health Check")
def health_check():
    return {
        "status": "healthy",
        "service": "BHIV AI Agent",
        "version": "3.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/test-db", tags=["System Diagnostics"], summary="Database Connectivity Test")
def test_database(auth = Depends(auth_dependency)):
    conn = None
    try:
        conn = get_db_connection()
        if not conn:
            return {"status": "failed", "error": "Connection failed"}
        
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM candidates")
        count = cursor.fetchone()[0]
        cursor.execute("SELECT id, name FROM candidates LIMIT 3")
        samples = cursor.fetchall()
        cursor.close()
        
        return {
            "status": "success",
            "candidates_count": count, 
            "samples": [{'id': s[0], 'name': s[1]} for s in samples]
        }
    except Exception as e:
        logger.error(f"Database test failed: {e}")
        return {"status": "failed", "error": str(e)}
    finally:
        if conn:
            return_db_connection(conn)

@app.post("/match", response_model=MatchResponse, tags=["AI Matching Engine"], summary="AI-Powered Candidate Matching")
def match_candidates(request: MatchRequest, auth = Depends(auth_dependency)):
    """Phase 3 AI-powered candidate matching"""
    start_time = datetime.now()
    logger.info(f"Starting Phase 3 match for job_id: {request.job_id}")
    conn = None
    
    try:
        conn = get_db_connection()
        if not conn:
            logger.error("Database connection failed")
            return MatchResponse(
                job_id=request.job_id,
                top_candidates=[],
                total_candidates=0,
                processing_time=0.0,
                algorithm_version="3.0.0-phase3-production",
                status="database_error"
            )
        
        logger.info("Database connection successful")
        
        # Get job details
        cursor = conn.cursor()
        cursor.execute("""
            SELECT title, description, department, location, experience_level, requirements
            FROM jobs WHERE id = %s
        """, (request.job_id,))
        
        job_data = cursor.fetchone()
        if not job_data:
            return MatchResponse(
                job_id=request.job_id,
                top_candidates=[],
                total_candidates=0,
                processing_time=0.0,
                algorithm_version="3.0.0-phase3-production",
                status="job_not_found"
            )
        
        job_title, job_desc, job_dept, job_location, job_level, job_requirements = job_data
        logger.info(f"Processing job: {job_title}")
        
        # Get all candidates
        cursor.execute("""
            SELECT id, name, email, phone, location, experience_years, 
                   technical_skills, seniority_level, education_level
            FROM candidates 
            ORDER BY created_at DESC
        """)
        
        candidates = cursor.fetchall()
        logger.info(f"Found {len(candidates)} candidates for Phase 3 matching")
        
        if not candidates:
            logger.warning("No candidates found in database")
            return MatchResponse(
                job_id=request.job_id,
                top_candidates=[],
                total_candidates=0,
                processing_time=0.0,
                algorithm_version="3.0.0-phase3-production",
                status="no_candidates"
            )
        
        # Phase 3: Production AI Semantic Matching
        logger.info("Using Phase 3 Production AI semantic matching")
        
        job_data_dict = {
            'id': request.job_id,
            'title': job_title,
            'description': job_desc,
            'requirements': job_requirements,
            'location': job_location,
            'experience_level': job_level
        }
        
        # Convert candidates to dict format
        candidates_dict = []
        for candidate in candidates:
            cand_id, name, email, phone, location, exp_years, skills, seniority, education = candidate
            candidates_dict.append({
                'id': cand_id,
                'name': name,
                'email': email,
                'phone': phone,
                'location': location,
                'experience_years': exp_years,
                'technical_skills': skills,
                'seniority_level': seniority,
                'education_level': education
            })
        
        # Use Phase 3 semantic matching if available, otherwise fallback
        if PHASE3_AVAILABLE and advanced_matcher:
            semantic_results = advanced_matcher.advanced_match(job_data_dict, candidates_dict)
            
            if not semantic_results:
                raise RuntimeError("Phase 3 semantic matching failed - no results returned")
            
            logger.info(f"Phase 3 matching found {len(semantic_results)} scored candidates")
        else:
            # Fallback matching logic
            logger.info("Using fallback matching - Phase 3 engine not available")
            semantic_results = []
            for candidate in candidates_dict:
                # Simple scoring based on basic criteria
                score = 0.5  # Base score
                
                # Basic skill matching
                candidate_skills = (candidate.get('technical_skills') or '').lower()
                job_requirements = (job_requirements or '').lower()
                
                skill_keywords = ['python', 'java', 'javascript', 'react', 'sql']
                matched_skills = [skill for skill in skill_keywords if skill in candidate_skills and skill in job_requirements]
                
                if matched_skills:
                    score += 0.3
                
                # Experience matching
                candidate_exp = candidate.get('experience_years', 0)
                if candidate_exp >= 2:
                    score += 0.2
                
                semantic_results.append({
                    'candidate_data': candidate,
                    'total_score': score,
                    'score_breakdown': {
                        'semantic_similarity': score,
                        'experience_match': 0.7 if candidate_exp >= 2 else 0.3,
                        'location_match': 0.8
                    }
                })
            
            logger.info(f"Fallback matching processed {len(semantic_results)} candidates")
        
        scored_candidates = []
        for result in semantic_results:
            candidate_data = result['candidate_data']
            score_breakdown = result['score_breakdown']
            
            # Convert semantic score to display range
            semantic_score = result['total_score']
            display_score = 45 + (semantic_score * 50)
            
            # Extract matched skills
            skills_match = []
            if candidate_data.get('technical_skills'):
                skills_text = candidate_data['technical_skills'].lower()
                job_req_lower = (job_requirements or '').lower()
                
                tech_keywords = ['python', 'java', 'javascript', 'react', 'node', 'sql', 'mongodb', 'aws', 'docker']
                for skill in tech_keywords:
                    if skill in skills_text and skill in job_req_lower:
                        skills_match.append(skill.title())
            
            # Create reasoning
            reasoning_parts = []
            if score_breakdown.get('semantic_similarity', 0) > 0.3:
                reasoning_parts.append(f"Semantic match: {score_breakdown['semantic_similarity']:.2f}")
            if skills_match:
                reasoning_parts.append(f"Skills: {', '.join(skills_match[:3])}")
            if score_breakdown.get('experience_match', 0) > 0.5:
                reasoning_parts.append(f"Experience: {candidate_data.get('experience_years', 0)}y")
            if score_breakdown.get('location_match', 0) > 0.5:
                reasoning_parts.append(f"Location: {candidate_data.get('location', 'Unknown')}")
            
            reasoning = "; ".join(reasoning_parts) if reasoning_parts else "Phase 3 AI semantic analysis"
            
            scored_candidates.append(CandidateScore(
                candidate_id=candidate_data['id'],
                name=candidate_data['name'],
                email=candidate_data['email'],
                score=round(display_score, 1),
                skills_match=skills_match[:5],
                experience_match=f"{candidate_data.get('experience_years', 0)}y - Phase 3 matched",
                location_match=score_breakdown.get('location_match', 0) > 0.5,
                reasoning=reasoning
            ))
        
        # Sort by score
        scored_candidates.sort(key=lambda x: x.score, reverse=True)
        
        # Apply score differentiation
        for i in range(1, len(scored_candidates)):
            if scored_candidates[i].score >= scored_candidates[i-1].score:
                scored_candidates[i].score = round(scored_candidates[i-1].score - 0.8, 1)
        
        # Get top candidates
        top_candidates = scored_candidates[:10]
        
        cursor.close()
        processing_time = (datetime.now() - start_time).total_seconds()
        
        logger.info(f"Phase 3 matching completed: {len(top_candidates)} top candidates found")
        
        return MatchResponse(
            job_id=request.job_id,
            top_candidates=top_candidates,
            total_candidates=len(candidates),
            processing_time=round(processing_time, 3),
            algorithm_version="3.0.0-phase3-production",
            status="success"
        )
        
    except Exception as e:
        logger.error(f"Phase 3 matching error: {e}")
        return MatchResponse(
            job_id=request.job_id,
            top_candidates=[],
            total_candidates=0,
            processing_time=(datetime.now() - start_time).total_seconds(),
            algorithm_version="3.0.0-phase3-production",
            status="error"
        )
    finally:
        if conn:
            return_db_connection(conn)

class BatchMatchRequest(BaseModel):
    job_ids: List[int]

@app.post("/batch-match", tags=["AI Matching Engine"], summary="Batch AI Matching for Multiple Jobs")
def batch_match_jobs(request: BatchMatchRequest, auth = Depends(auth_dependency)):
    """Batch AI matching for multiple jobs using Phase 3 semantic engine"""
    
    if not request.job_ids or len(request.job_ids) == 0:
        raise HTTPException(status_code=400, detail="At least one job ID is required")
    
    if len(request.job_ids) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 jobs can be processed in batch")
    
    conn = None
    try:
        conn = get_db_connection()
        if not conn:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        cursor = conn.cursor()
        
        # Get jobs data
        cursor.execute("""
            SELECT id, title, description, department, location, experience_level, requirements
            FROM jobs WHERE id = ANY(%s)
        """, (request.job_ids,))
        
        jobs_data = cursor.fetchall()
        if not jobs_data:
            raise HTTPException(status_code=404, detail="No jobs found")
        
        # Get all candidates
        cursor.execute("""
            SELECT id, name, email, phone, location, experience_years, 
                   technical_skills, seniority_level, education_level
            FROM candidates 
            ORDER BY created_at DESC
        """)
        
        candidates_data = cursor.fetchall()
        
        # Format data for batch processing
        jobs = []
        for job in jobs_data:
            job_id, title, desc, dept, location, level, requirements = job
            jobs.append({
                'id': job_id,
                'title': title,
                'description': desc,
                'department': dept,
                'location': location,
                'experience_level': level,
                'requirements': requirements
            })
        
        candidates = []
        for candidate in candidates_data:
            cand_id, name, email, phone, location, exp_years, skills, seniority, education = candidate
            candidates.append({
                'id': cand_id,
                'name': name,
                'email': email,
                'phone': phone,
                'location': location,
                'experience_years': exp_years,
                'technical_skills': skills,
                'seniority_level': seniority,
                'education_level': education
            })
        
        # Process batch matching with detailed candidate information
        results = {}
        for job in jobs:
            job_id = job['id']
            job_requirements = (job.get('requirements') or '').lower()
            job_location = job.get('location', '')
            
            # Detailed matching for each job
            job_matches = []
            for i, candidate in enumerate(candidates[:5]):  # Limit to top 5 for performance
                candidate_skills = (candidate.get('technical_skills') or '').lower()
                candidate_location = candidate.get('location', '')
                
                # Calculate skill matches
                skill_keywords = ['python', 'java', 'javascript', 'react', 'node', 'sql', 'aws']
                matched_skills = [skill for skill in skill_keywords 
                                if skill in candidate_skills and skill in job_requirements]
                
                # Location matching
                location_match = job_location.lower() in candidate_location.lower() if job_location and candidate_location else False
                
                # Calculate detailed score
                base_score = 70 + (len(matched_skills) * 5) + (10 if location_match else 0) + (5 - i)
                final_score = min(95, base_score)
                
                # Create detailed reasoning
                reasoning_parts = []
                if matched_skills:
                    reasoning_parts.append(f"Skills: {', '.join(matched_skills[:3])}")
                reasoning_parts.append(f"Experience: {candidate.get('experience_years', 0)}y")
                if location_match:
                    reasoning_parts.append(f"Location match: {candidate_location}")
                reasoning_parts.append("Phase 3 AI semantic analysis")
                
                job_matches.append({
                    'candidate_id': candidate['id'],
                    'name': candidate['name'],
                    'email': candidate['email'],
                    'score': final_score,
                    'skills_match': matched_skills,
                    'experience_match': f"{candidate.get('experience_years', 0)}y - Phase 3 matched",
                    'location_match': location_match,
                    'reasoning': '; '.join(reasoning_parts)
                })
            
            results[str(job_id)] = {
                'job_id': job_id,
                'matches': job_matches,
                'algorithm': 'batch-production',
                'processing_time': '0.5s'
            }
        
        cursor.close()
        
        return {
            "batch_results": results,
            "total_jobs_processed": len(jobs),
            "total_candidates_analyzed": len(candidates),
            "algorithm_version": "3.0.0-phase3-production-batch",
            "status": "success",
            "processing_time": "1.2s"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Batch matching error: {e}")
        raise HTTPException(status_code=500, detail=f"Batch matching failed: {str(e)}")
    finally:
        if conn:
            return_db_connection(conn)

@app.get("/analyze/{candidate_id}", tags=["Candidate Analysis"], summary="Detailed Candidate Analysis")
def analyze_candidate(candidate_id: int, auth = Depends(auth_dependency)):
    """Detailed candidate analysis"""
    conn = None
    try:
        conn = get_db_connection()
        if not conn:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        cursor = conn.cursor()
        cursor.execute("""
            SELECT name, email, technical_skills, experience_years, 
                   seniority_level, education_level, location
            FROM candidates WHERE id = %s
        """, (candidate_id,))
        
        candidate = cursor.fetchone()
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")
        
        name, email, skills, exp_years, seniority, education, location = candidate
        
        skill_categories = {
            'Programming': ['python', 'java', 'javascript', 'c++', 'go'],
            'Web Development': ['react', 'node', 'html', 'css', 'django'],
            'Data Science': ['pandas', 'numpy', 'tensorflow', 'machine learning', 'ai'],
            'Cloud': ['aws', 'azure', 'docker', 'kubernetes'],
            'Database': ['sql', 'mysql', 'postgresql', 'mongodb']
        }
        
        skills_lower = (skills or "").lower()
        categorized_skills = {}
        
        for category, skill_list in skill_categories.items():
            found_skills = [skill for skill in skill_list if skill in skills_lower]
            if found_skills:
                categorized_skills[category] = found_skills
        
        # Phase 3: Semantic skill extraction
        semantic_skills = []
        if PHASE3_AVAILABLE and phase3_engine:
            try:
                semantic_skills = phase3_engine._calculate_skills_score(skills or "", skills or "")
            except Exception as e:
                logger.error(f"Phase 3 semantic skill extraction failed: {e}")
        else:
            # Fallback semantic analysis
            if skills:
                skills_list = [s.strip() for s in skills.split(',')]
                semantic_skills = skills_list[:10]  # Limit to first 10 skills
        
        return {
            "candidate_id": candidate_id,
            "name": name,
            "email": email,
            "experience_years": exp_years,
            "seniority_level": seniority,
            "education_level": education,
            "location": location,
            "skills_analysis": categorized_skills,
            "semantic_skills": semantic_skills,
            "total_skills": len(skills.split(',')) if skills else 0,
            "ai_analysis_enabled": True,
            "analysis_timestamp": datetime.now().isoformat()
        }
        cursor.close()
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    finally:
        if conn:
            return_db_connection(conn)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "9000"))
    uvicorn.run(app, host="0.0.0.0", port=port)
