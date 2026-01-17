from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
import httpx
import os
import sys

# CRITICAL: Set up paths BEFORE importing dependencies
# Render's Root Directory is: backend/services/gateway
# __file__ is at: backend/services/gateway/routes/rl_routes.py
gateway_dir = os.path.dirname(os.path.dirname(__file__))
gateway_dir = os.path.abspath(gateway_dir)  # Make absolute for Render deployment

# Ensure shared directory is accessible BEFORE importing dependencies
# shared is at: backend/services/shared (sibling to gateway)
# When Render root is backend/services/gateway, we need to go up one level
services_dir = os.path.dirname(gateway_dir)
shared_dir = os.path.abspath(os.path.join(services_dir, 'shared'))

# Add paths in correct order (shared must come first so jwt_auth can be found)
if shared_dir not in sys.path and os.path.exists(shared_dir):
    sys.path.insert(0, shared_dir)

if gateway_dir not in sys.path:
    sys.path.insert(0, gateway_dir)

# Now dependencies can be imported safely (it will import jwt_auth from shared)
from dependencies import get_api_key

router = APIRouter(prefix="/rl", tags=["RL + Feedback Agent"])

@router.post("/predict")
async def rl_predict_match(
    request_data: Dict[str, Any],
    api_key: str = Depends(get_api_key)
):
    """Proxy RL prediction to LangGraph service"""
    try:
        langgraph_url = os.getenv("LANGGRAPH_SERVICE_URL", "http://localhost:9001")
        
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{langgraph_url}/rl/predict",
                json=request_data,
                headers={"Authorization": f"Bearer {api_key}"}
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail=response.text)
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/feedback")
async def submit_rl_feedback(
    feedback_data: Dict[str, Any],
    api_key: str = Depends(get_api_key)
):
    """Proxy RL feedback to LangGraph service"""
    try:
        langgraph_url = os.getenv("LANGGRAPH_SERVICE_URL", "http://localhost:9001")
        
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{langgraph_url}/rl/feedback",
                json=feedback_data,
                headers={"Authorization": f"Bearer {api_key}"}
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail=response.text)
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analytics")
async def get_rl_analytics(api_key: str = Depends(get_api_key)):
    """Proxy RL analytics to LangGraph service"""
    try:
        langgraph_url = os.getenv("LANGGRAPH_SERVICE_URL", "http://localhost:9001")
        
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.get(
                f"{langgraph_url}/rl/analytics",
                headers={"Authorization": f"Bearer {api_key}"}
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail=response.text)
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/performance")
async def get_rl_performance(api_key: str = Depends(get_api_key)):
    """Proxy RL performance to LangGraph service"""
    try:
        langgraph_url = os.getenv("LANGGRAPH_SERVICE_URL", "http://localhost:9001")
        
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.get(
                f"{langgraph_url}/rl/performance",
                headers={"Authorization": f"Bearer {api_key}"}
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=response.status_code, detail=response.text)
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))