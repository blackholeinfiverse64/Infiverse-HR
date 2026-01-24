#!/usr/bin/env python3
"""
BHIV HR Platform - Authentication and Parameter Verification
Analyzes all 89 endpoints for proper auth requirements and parameters
"""

import asyncio
import httpx
import json
import os
from typing import Dict, List, Any

class AuthParamVerifier:
    def __init__(self):
        self.services = {
            "gateway": "http://localhost:8000",
            "agent": "http://localhost:9000", 
            "langgraph": "http://localhost:9001"
        }
        
        self.api_key = os.getenv("API_KEY_SECRET", "<YOUR_API_KEY>")
        
        # Endpoint authentication mapping based on code analysis
        self.auth_requirements = {
            # Gateway endpoints requiring API Key
            "api_key_required": [
                "/v1/test-candidates", "/v1/candidates/stats", "/v1/database/schema",
                "/v1/reports/job/{job_id}/export.csv", "/v1/jobs", "/v1/candidates",
                "/v1/candidates/{id}", "/v1/candidates/search", "/v1/candidates/bulk",
                "/v1/candidates/job/{job_id}", "/v1/match/{job_id}/top", "/v1/match/batch",
                "/v1/feedback", "/v1/interviews", "/v1/offers", "/health/detailed",
                "/metrics/dashboard", "/v1/security/*", "/v1/auth/*", "/v1/2fa/*"
            ],
            
            # Gateway endpoints requiring Client JWT
            "client_jwt_required": [
                "/v1/jobs"  # POST only - dual auth endpoint
            ],
            
            # Gateway endpoints requiring Candidate JWT  
            "candidate_jwt_required": [
                "/v1/candidate/profile/{id}", "/v1/candidate/apply", 
                "/v1/candidate/applications/{id}"
            ],
            
            # No authentication required
            "no_auth": [
                "/", "/health", "/openapi.json", "/docs", "/metrics",
                "/v1/client/register", "/v1/client/login", 
                "/v1/candidate/register", "/v1/candidate/login"
            ]
        }
        
        # Parameter requirements for each endpoint
        self.param_requirements = {
            # POST endpoints with required body parameters
            "POST /v1/jobs": {
                "title": "Senior Python Developer",
                "department": "Engineering", 
                "location": "Remote",
                "experience_level": "senior",
                "requirements": "Python, Django, PostgreSQL, 5+ years",
                "description": "Senior Python developer position"
            },
            
            "POST /v1/candidates/bulk": {
                "candidates": [{
                    "name": "Test Candidate",
                    "email": "test@example.com",
                    "location": "Mumbai",
                    "experience_years": 5,
                    "technical_skills": "Python, Django"
                }]
            },
            
            "POST /v1/feedback": {
                "candidate_id": 1,
                "job_id": 1,
                "integrity": 5,
                "honesty": 4,
                "discipline": 4,
                "hard_work": 5,
                "gratitude": 4
            },
            
            "POST /v1/interviews": {
                "candidate_id": 1,
                "job_id": 1,
                "interview_date": "2025-12-01T10:00:00Z",
                "interviewer": "HR Team"
            },
            
            "POST /v1/offers": {
                "candidate_id": 1,
                "job_id": 1,
                "salary": 120000.00,
                "start_date": "2025-12-15",
                "terms": "Full-time position"
            },
            
            "POST /v1/client/register": {
                "client_id": "TEST_CLIENT",
                "company_name": "Test Company",
                "contact_email": "test@company.com",
                "password": "TestPass123!"
            },
            
            "POST /v1/client/login": {
                "client_id": "TEST_CLIENT",
                "password": "TestPass123!"
            },
            
            "POST /v1/candidate/register": {
                "name": "Test Candidate",
                "email": "test@candidate.com",
                "password": "TestPass123!",
                "location": "Mumbai",
                "experience_years": 5,
                "technical_skills": "Python, Django"
            },
            
            "POST /v1/candidate/login": {
                "email": "test@candidate.com",
                "password": "TestPass123!"
            },
            
            "POST /v1/candidate/apply": {
                "candidate_id": 1,
                "job_id": 1,
                "cover_letter": "I am interested in this position"
            },
            
            "PUT /v1/candidate/profile/{id}": {
                "name": "Updated Name",
                "technical_skills": "Python, Django, React"
            },
            
            # Agent endpoints
            "POST /match": {
                "job_id": 1
            },
            
            "POST /batch-match": {
                "job_ids": [1, 2]
            },
            
            # LangGraph endpoints
            "POST /workflows/application/start": {
                "candidate_id": 1,
                "job_id": 1,
                "application_id": 1,
                "candidate_email": "test@example.com",
                "candidate_phone": "+919876543210",
                "candidate_name": "Test User",
                "job_title": "Software Engineer"
            },
            
            "POST /tools/send-notification": {
                "candidate_name": "Test",
                "job_title": "Developer",
                "message": "Test notification",
                "channels": ["email"]
            },
            
            # Security endpoints
            "POST /v1/security/test-input-validation": {
                "input_data": "test input"
            },
            
            "POST /v1/security/test-email-validation": {
                "email": "test@example.com"
            },
            
            "POST /v1/security/test-phone-validation": {
                "phone": "+919876543210"
            },
            
            # 2FA endpoints
            "POST /v1/auth/2fa/setup": {
                "user_id": "test_user"
            },
            
            "POST /v1/auth/2fa/verify": {
                "user_id": "test_user",
                "totp_code": "123456"
            },
            
            "POST /v1/auth/password/validate": {
                "password": "TestPass123!"
            }
        }

    async def verify_all_endpoints(self):
        """Verify authentication and parameters for all 89 endpoints"""
        print("BHIV HR Platform - Authentication & Parameter Verification")
        print("=" * 70)
        
        # Get OpenAPI schemas to verify actual endpoints
        gateway_endpoints = await self.get_openapi_endpoints("gateway")
        agent_endpoints = await self.get_openapi_endpoints("agent") 
        langgraph_endpoints = await self.get_openapi_endpoints("langgraph")
        
        print(f"Gateway Endpoints: {len(gateway_endpoints)}")
        print(f"Agent Endpoints: {len(agent_endpoints)}")
        print(f"LangGraph Endpoints: {len(langgraph_endpoints)}")
        print(f"Total: {len(gateway_endpoints) + len(agent_endpoints) + len(langgraph_endpoints)}")
        
        # Verify authentication requirements
        print("\n" + "=" * 70)
        print("AUTHENTICATION REQUIREMENTS ANALYSIS")
        print("=" * 70)
        
        await self.verify_auth_requirements(gateway_endpoints, "gateway")
        await self.verify_auth_requirements(agent_endpoints, "agent")
        await self.verify_auth_requirements(langgraph_endpoints, "langgraph")
        
        # Verify parameter requirements
        print("\n" + "=" * 70)
        print("PARAMETER REQUIREMENTS ANALYSIS")
        print("=" * 70)
        
        await self.verify_param_requirements(gateway_endpoints, "gateway")
        await self.verify_param_requirements(agent_endpoints, "agent")
        await self.verify_param_requirements(langgraph_endpoints, "langgraph")

    async def get_openapi_endpoints(self, service: str) -> List[Dict]:
        """Get all endpoints from OpenAPI schema"""
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.get(f"{self.services[service]}/openapi.json")
                if response.status_code == 200:
                    schema = response.json()
                    endpoints = []
                    
                    for path, methods in schema.get("paths", {}).items():
                        for method, details in methods.items():
                            if method.upper() in ["GET", "POST", "PUT", "DELETE", "PATCH"]:
                                endpoints.append({
                                    "method": method.upper(),
                                    "path": path,
                                    "summary": details.get("summary", ""),
                                    "parameters": details.get("parameters", []),
                                    "requestBody": details.get("requestBody", {}),
                                    "security": details.get("security", [])
                                })
                    
                    return endpoints
        except Exception as e:
            print(f"Error getting OpenAPI for {service}: {e}")
            return []

    async def verify_auth_requirements(self, endpoints: List[Dict], service: str):
        """Verify authentication requirements for endpoints"""
        print(f"\n{service.upper()} Service Authentication:")
        
        for endpoint in endpoints:
            method = endpoint["method"]
            path = endpoint["path"]
            security = endpoint.get("security", [])
            
            # Determine auth requirement
            auth_type = "NONE"
            if security:
                if any("BearerAuth" in sec for sec in security):
                    auth_type = "API_KEY"
                elif any("ClientJWT" in sec for sec in security):
                    auth_type = "CLIENT_JWT"
                elif any("CandidateJWT" in sec for sec in security):
                    auth_type = "CANDIDATE_JWT"
            
            # Special cases based on path analysis
            if service == "gateway":
                if path.startswith("/v1/candidate/profile") or path.startswith("/v1/candidate/apply"):
                    auth_type = "CANDIDATE_JWT"
                elif path in ["/", "/health", "/openapi.json", "/docs", "/metrics"]:
                    auth_type = "NONE"
                elif path.startswith("/v1/client/") and method == "POST":
                    auth_type = "NONE" if "login" in path or "register" in path else "CLIENT_JWT"
                elif path.startswith("/v1/"):
                    auth_type = "API_KEY"
            
            print(f"  {method:6} {path:40} -> {auth_type}")

    async def verify_param_requirements(self, endpoints: List[Dict], service: str):
        """Verify parameter requirements for endpoints"""
        print(f"\n{service.upper()} Service Parameters:")
        
        for endpoint in endpoints:
            method = endpoint["method"]
            path = endpoint["path"]
            endpoint_key = f"{method} {path}"
            
            # Check if endpoint requires parameters
            has_params = bool(endpoint.get("parameters", []))
            has_body = bool(endpoint.get("requestBody", {}))
            
            param_info = "NO_PARAMS"
            if has_body and endpoint_key in self.param_requirements:
                param_info = "BODY_REQUIRED"
            elif has_params:
                param_info = "QUERY_PARAMS"
            elif method in ["POST", "PUT", "PATCH"]:
                param_info = "BODY_EXPECTED"
            
            print(f"  {method:6} {path:40} -> {param_info}")
            
            # Show required parameters if defined
            if endpoint_key in self.param_requirements:
                params = self.param_requirements[endpoint_key]
                print(f"    Required: {list(params.keys())}")

    async def test_sample_endpoints(self):
        """Test a few sample endpoints to verify auth and params work"""
        print("\n" + "=" * 70)
        print("SAMPLE ENDPOINT TESTING")
        print("=" * 70)
        
        # Test no-auth endpoint
        await self.test_endpoint("GET", "gateway", "/health", None, None)
        
        # Test API key endpoint
        await self.test_endpoint("GET", "gateway", "/v1/candidates/stats", self.api_key, None)
        
        # Test POST with parameters
        job_data = self.param_requirements.get("POST /v1/jobs", {})
        await self.test_endpoint("POST", "gateway", "/v1/jobs", self.api_key, job_data)
        
        # Test Agent endpoint
        match_data = self.param_requirements.get("POST /match", {})
        await self.test_endpoint("POST", "agent", "/match", self.api_key, match_data)

    async def test_endpoint(self, method: str, service: str, path: str, 
                          auth_token: str, data: Dict):
        """Test individual endpoint"""
        url = f"{self.services[service]}{path}"
        headers = {"Content-Type": "application/json"}
        
        if auth_token:
            headers["Authorization"] = f"Bearer {auth_token}"
        
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                if method == "GET":
                    response = await client.get(url, headers=headers)
                elif method == "POST":
                    response = await client.post(url, json=data, headers=headers)
                
                status = "PASS" if response.status_code in [200, 201, 202] else "FAIL"
                print(f"  {status} {method} {path} ({response.status_code})")
                
        except Exception as e:
            print(f"  ERROR {method} {path}: {str(e)}")

async def main():
    verifier = AuthParamVerifier()
    await verifier.verify_all_endpoints()
    await verifier.test_sample_endpoints()

if __name__ == "__main__":
    asyncio.run(main())