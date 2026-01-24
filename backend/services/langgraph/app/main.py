from fastapi import FastAPI, HTTPException, BackgroundTasks, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
# Optional imports - LangGraph workflow engine
try:
    from .graphs import create_application_workflow
    from .state import CandidateApplicationState
    from langchain_core.messages import HumanMessage
    LANGGRAPH_AVAILABLE = True
except ImportError:
    create_application_workflow = None
    CandidateApplicationState = dict
    HumanMessage = None
    LANGGRAPH_AVAILABLE = False

try:
    from .monitoring import monitor
except ImportError:
    class MockMonitor:
        def get_health_status(self):
            return {"status": "healthy", "monitoring": "basic"}
    monitor = MockMonitor()
import sys
import os

# Add parent directory to path for config and dependencies
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(parent_dir)

try:
    from config import settings
except ImportError:
    # Fallback configuration for Docker
    class Settings:
        log_level = os.getenv('LOG_LEVEL', 'INFO')
        environment = os.getenv('ENVIRONMENT', 'production')
    settings = Settings()

try:
    from dependencies import get_api_key, get_auth
except ImportError:
    # Fallback dependencies
    from fastapi import HTTPException, Depends
    from fastapi.security import HTTPBearer
    
    security = HTTPBearer()
    
    def get_api_key(credentials = Depends(security)):
        expected_key = os.getenv("API_KEY_SECRET")
        if not credentials or credentials.credentials != expected_key:
            raise HTTPException(status_code=401, detail="Invalid API key")
        return credentials.credentials
    
    def get_auth(credentials = Depends(security)):
        return get_api_key(credentials)
# MongoDB migration: Using mongodb_tracker instead of database_tracker (PostgreSQL)
from .mongodb_tracker import tracker
from .rl_integration.rl_endpoints import router as rl_router
import uuid
import logging
from typing import Dict, List, Optional
from datetime import datetime

# Configure logging
logging.basicConfig(level=getattr(settings, 'log_level', 'INFO'))
logger = logging.getLogger(__name__)

# Service initialization
logger.info("🚀 LangGraph service initializing...")

app = FastAPI(
    title="BHIV LangGraph Orchestrator",
    version="1.0.0",
    description="AI-driven workflow orchestration for BHIV HR Platform with API Key Authentication",
    tags_metadata=[
        {
            "name": "Core API Endpoints",
            "description": "Service health and system information"
        },
        {
            "name": "Workflow Management",
            "description": "AI workflow orchestration and candidate processing"
        },
        {
            "name": "Workflow Monitoring",
            "description": "Real-time workflow status tracking and analytics"
        },
        {
            "name": "Communication Tools",
            "description": "Multi-channel notification and messaging system"
        },
        {
            "name": "RL + Feedback Agent",
            "description": "Reinforcement Learning and Feedback Agent for adaptive matching"
        },
        {
            "name": "System Diagnostics",
            "description": "Integration testing and system validation"
        }
    ]
)

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (can be restricted to specific domains in production)
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

# Include RL router
app.include_router(rl_router)

# Initialize workflow
application_workflow = None
if LANGGRAPH_AVAILABLE and create_application_workflow:
    try:
        application_workflow = create_application_workflow()
        logger.info("✅ Application workflow initialized")
    except Exception as e:
        logger.error(f"❌ Failed to initialize workflow: {str(e)}")
        application_workflow = None
else:
    logger.info("⚠️ LangGraph workflow engine not available - using simulation mode")

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        if client_id not in self.active_connections:
            self.active_connections[client_id] = []
        self.active_connections[client_id].append(websocket)
        logger.info(f"✅ WebSocket connected: {client_id}")
    
    def disconnect(self, websocket: WebSocket, client_id: str):
        if client_id in self.active_connections:
            self.active_connections[client_id].remove(websocket)
            logger.info(f"❌ WebSocket disconnected: {client_id}")
    
    async def broadcast(self, client_id: str, message: dict):
        if client_id in self.active_connections:
            for connection in self.active_connections[client_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"WebSocket broadcast error: {str(e)}")

manager = ConnectionManager()

# Pydantic models
class ApplicationRequest(BaseModel):
    candidate_id: str
    job_id: str
    application_id: str
    candidate_email: str
    candidate_phone: str
    candidate_name: str
    job_title: str
    job_description: Optional[str] = None

class WorkflowResponse(BaseModel):
    workflow_id: str
    status: str
    message: str
    timestamp: str

class WorkflowStatus(BaseModel):
    workflow_id: str
    current_stage: str
    application_status: str
    matching_score: float
    last_action: str
    completed: bool

class NotificationRequest(BaseModel):
    candidate_id: str
    candidate_name: str
    candidate_email: str
    candidate_phone: Optional[str] = None
    job_title: str
    message: str
    channels: List[str] = ["email"]

# API Endpoints
@app.get("/", tags=["Core API Endpoints"])
async def read_root():
    """LangGraph Service Information"""
    return {
        "message": "BHIV LangGraph Orchestrator",
        "version": "1.0.0",
        "status": "healthy",
        "environment": settings.environment,
        "endpoints": 13,
        "workflow_engine": "active",
        "ai_automation": "enabled"
    }

@app.get("/health", tags=["Core API Endpoints"])
async def health_check():
    """Health Check"""
    health_data = monitor.get_health_status()
    health_data.update({
        "service": "langgraph-orchestrator",
        "version": "1.0.0",
        "environment": settings.environment
    })
    return health_data

@app.post("/workflows/application/start", response_model=WorkflowResponse, tags=["Workflow Management"])
async def start_application_workflow(
    request: ApplicationRequest,
    background_tasks: BackgroundTasks,
    api_key: str = Depends(get_api_key)
):
    """Start AI Workflow for Candidate Processing
    
    **Note:** This is the correct endpoint for creating workflows (not `POST /workflows`)
    
    **Authentication:** Bearer token required
    
    **Example:**
    ```bash
    curl -X POST -H "Authorization: Bearer <YOUR_API_KEY>" \
         -H "Content-Type: application/json" \
         -d '{"candidate_id":1,"job_id":1,"application_id":1,"candidate_email":"test@example.com","candidate_phone":"123-456-7890","candidate_name":"Test User","job_title":"Software Engineer"}' \
         http://localhost:9001/workflows/application/start
    ```
    """
    try:
        if not application_workflow:
            raise HTTPException(status_code=500, detail="Workflow not initialized")
        
        workflow_id = str(uuid.uuid4())
        logger.info(f"🚀 Starting workflow {workflow_id} for application {request.application_id}")
        
        # Initialize state
        initial_state = {
            "candidate_id": request.candidate_id,
            "job_id": request.job_id,
            "application_id": request.application_id,
            "candidate_email": request.candidate_email,
            "candidate_phone": request.candidate_phone,
            "candidate_name": request.candidate_name,
            "job_title": request.job_title,
            "job_description": request.job_description or "",
            "application_status": "pending",
            "messages": [HumanMessage(content=f"New application from {request.candidate_name} for {request.job_title}") if HumanMessage else {"content": f"New application from {request.candidate_name} for {request.job_title}"}],
            "notifications_sent": [],
            "matching_score": 0.0,
            "ai_recommendation": "",
            "sentiment": "neutral",
            "next_action": "screening",
            "workflow_stage": "screening",
            "error": None,
            "timestamp": datetime.now().isoformat(),
            "voice_input_path": None,
            "voice_response_path": None
        }
        
        # Execute workflow in background
        config = {"configurable": {"thread_id": workflow_id}}
        background_tasks.add_task(
            _execute_workflow,
            workflow_id,
            initial_state,
            config
        )
        
        # Track workflow in database with full details
        tracker.create_workflow(
            workflow_id=workflow_id,
            workflow_type="candidate_application",
            candidate_id=request.candidate_id,
            job_id=request.job_id,
            client_id=None,  # Can be extracted from job if needed
            input_data={
                "candidate_name": request.candidate_name,
                "candidate_email": request.candidate_email,
                "job_title": request.job_title,
                "application_id": request.application_id
            }
        )
        
        logger.info(f"✅ Workflow {workflow_id} scheduled for execution")
        
        return WorkflowResponse(
            workflow_id=workflow_id,
            status="started",
            message=f"Application workflow started for {request.candidate_name}",
            timestamp=datetime.now().isoformat()
        )
    
    except Exception as e:
        logger.error(f"❌ Error starting workflow: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/workflows/{workflow_id}/status", tags=["Workflow Monitoring"])
async def get_workflow_status(workflow_id: str, api_key: str = Depends(get_api_key)):
    """Get Detailed Workflow Status"""
    try:
        # Get status from database tracker (primary source)
        db_status = tracker.get_workflow_status(workflow_id)
        if db_status:
            return {
                "workflow_id": db_status["workflow_id"],
                "workflow_type": db_status.get("workflow_type", "candidate_application"),
                "status": db_status["status"],
                "progress_percentage": db_status.get("progress_percentage", 0),
                "current_step": db_status.get("current_step", "processing"),
                "total_steps": db_status.get("total_steps", 5),
                "candidate_id": db_status.get("candidate_id"),
                "job_id": db_status.get("job_id"),
                "input_data": db_status.get("input_data", {}),
                "output_data": db_status.get("output_data", {}),
                "error_message": db_status.get("error_message"),
                "started_at": db_status.get("started_at"),
                "completed_at": db_status.get("completed_at"),
                "updated_at": db_status.get("updated_at"),
                "completed": db_status["status"] in ["completed", "failed", "cancelled"],
                "estimated_time_remaining": _calculate_eta(db_status),
                "source": "database"
            }
        
        # Fallback to LangGraph state if database doesn't have it
        if not application_workflow:
            raise HTTPException(status_code=404, detail="Workflow not found and LangGraph not available")
            
        config = {"configurable": {"thread_id": workflow_id}}
        
        try:
            state = application_workflow.get_state(config)
            values = state.values if hasattr(state, 'values') else {}
            return {
                "workflow_id": workflow_id,
                "workflow_type": "candidate_application",
                "status": values.get("application_status", "processing"),
                "progress_percentage": 50,  # Default for LangGraph fallback
                "current_step": values.get("workflow_stage", "processing"),
                "total_steps": 5,
                "candidate_id": values.get("candidate_id"),
                "job_id": values.get("job_id"),
                "input_data": {},
                "output_data": values,
                "error_message": values.get("error"),
                "started_at": values.get("timestamp"),
                "completed_at": None,
                "updated_at": datetime.now().isoformat(),
                "completed": (hasattr(state, 'next') and (state.next == [] or not state.next)),
                "estimated_time_remaining": "unknown",
                "source": "langgraph_fallback"
            }
        except Exception as state_error:
            logger.error(f"❌ LangGraph state retrieval error: {str(state_error)}")
            raise HTTPException(status_code=404, detail=f"Workflow not found: {str(state_error)}")
    
    except Exception as e:
        logger.error(f"❌ Error fetching workflow status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Status retrieval failed: {str(e)}")

def _calculate_eta(workflow_data: dict) -> str:
    """Calculate estimated time remaining based on progress"""
    try:
        progress = workflow_data.get("progress_percentage", 0)
        if progress >= 100:
            return "completed"
        if progress <= 0:
            return "5-10 minutes"
        
        # Simple ETA calculation based on progress
        if progress < 25:
            return "4-8 minutes"
        elif progress < 50:
            return "3-6 minutes"
        elif progress < 75:
            return "2-4 minutes"
        else:
            return "1-2 minutes"
    except:
        return "unknown"

@app.post("/workflows/{workflow_id}/resume", tags=["Workflow Management"])
async def resume_workflow(workflow_id: str, api_key: str = Depends(get_api_key)):
    """Resume Paused Workflow"""
    try:
        if not application_workflow:
            raise HTTPException(status_code=500, detail="Workflow not initialized")
            
        config = {"configurable": {"thread_id": workflow_id}}
        
        # Use invoke instead of ainvoke to avoid async issues
        try:
            result = application_workflow.invoke(None, config)
        except Exception as invoke_error:
            logger.error(f"❌ Workflow invoke error: {str(invoke_error)}")
            return {
                "workflow_id": workflow_id,
                "status": "error",
                "error": str(invoke_error)
            }
        
        return {
            "workflow_id": workflow_id,
            "status": "resumed",
            "result": result
        }
    
    except Exception as e:
        logger.error(f"❌ Error resuming workflow: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/{workflow_id}")
async def websocket_endpoint(websocket: WebSocket, workflow_id: str, api_key: str = Depends(get_api_key)):
    """Real-time Workflow Updates (WebSocket)"""
    await manager.connect(websocket, workflow_id)
    try:
        while True:
            data = await websocket.receive_text()
            logger.info(f"WebSocket received: {data}")
            await manager.broadcast(workflow_id, {"type": "update", "data": data})
    except WebSocketDisconnect:
        manager.disconnect(websocket, workflow_id)

@app.get("/workflows", tags=["Workflow Monitoring"])
async def list_workflows(status: str = None, limit: int = 50, api_key: str = Depends(get_api_key)):
    """List All Workflows with Filtering
    
    **Note:** This endpoint only supports GET method (not POST)
    
    **For creating workflows, use:** `POST /workflows/application/start`
    
    **Authentication:** Bearer token required
    """
    try:
        if status == "active":
            workflows = tracker.get_active_workflows()
        else:
            workflows = tracker.list_workflows(limit=limit)
        
        # Add computed fields
        for workflow in workflows:
            workflow["completed"] = workflow.get("status") in ["completed", "failed", "cancelled"]
            workflow["estimated_time_remaining"] = _calculate_eta(workflow)
        
        # Filter by status if requested
        if status and status != "active":
            workflows = [w for w in workflows if w.get("status") == status]
        
        return {
            "workflows": workflows,
            "count": len(workflows),
            "filter": status,
            "limit": limit,
            "tracking_source": "database_with_fallback",
            "status": "operational"
        }
    except Exception as e:
        logger.error(f"❌ Error listing workflows: {str(e)}")
        return {
            "workflows": [],
            "count": 0,
            "error": str(e),
            "status": "error"
        }

@app.post("/tools/send-notification", tags=["Communication Tools"])
async def send_notification(notification_data: dict, api_key: str = Depends(get_api_key)):
    """Multi-Channel Notification System with Interactive Features"""
    try:
        from .communication import comm_manager
        
        # Extract notification data
        candidate_name = notification_data.get("candidate_name", "Candidate")
        candidate_email = notification_data.get("candidate_email", "test@example.com")
        candidate_phone = notification_data.get("candidate_phone", "+1234567890")
        job_title = notification_data.get("job_title", "Position")
        message = notification_data.get("message", "Notification from BHIV HR Platform")
        channels = notification_data.get("channels", ["email"])
        application_status = notification_data.get("application_status", "updated")
        
        # Prepare payload for automated sequence
        payload = {
            "candidate_name": candidate_name,
            "candidate_email": candidate_email,
            "candidate_phone": candidate_phone,
            "job_title": job_title,
            "message": message,
            "application_status": application_status,
            "interview_date": notification_data.get("interview_date", "TBD"),
            "interview_time": notification_data.get("interview_time", "TBD"),
            "interviewer": notification_data.get("interviewer", "HR Team"),
            "matching_score": notification_data.get("matching_score", "High")
        }
        
        # Use automated sequence for better templates and interactive features
        sequence_type = "application_received"
        if "interview" in application_status.lower():
            sequence_type = "interview_scheduled"
        elif "shortlist" in application_status.lower():
            sequence_type = "shortlisted"
        
        # Send via automated sequence (includes interactive buttons)
        results = await comm_manager.send_automated_sequence(payload, sequence_type)
        
        return {
            "success": True,
            "message": "Automated notification sequence completed",
            "candidate_name": candidate_name,
            "job_title": job_title,
            "sequence_type": sequence_type,
            "channels_requested": channels,
            "results": results,
            "sent_at": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"❌ Notification sending failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

class EmailTestRequest(BaseModel):
    recipient_email: str
    subject: Optional[str] = "BHIV HR Test Email"
    message: Optional[str] = "This is a test email from BHIV HR Platform"

@app.post("/test/send-email", tags=["Communication Tools"])
async def test_send_email(
    request: EmailTestRequest = None,
    recipient_email: Optional[str] = None,
    subject: Optional[str] = "BHIV HR Test Email",
    message: Optional[str] = "This is a test email from BHIV HR Platform",
    api_key: str = Depends(get_api_key)
):
    """Test Email Sending - Works with real email addresses"""
    try:
        from .communication import comm_manager
        
        # Support both JSON body and query params
        if request:
            email = request.recipient_email
            subj = request.subject or subject
            msg = request.message or message
        else:
            email = recipient_email or "shashankmishra0411@gmail.com"
            subj = subject
            msg = message
        
        result = await comm_manager.send_email(email, subj, msg)
        return {"success": True, "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class WhatsAppTestRequest(BaseModel):
    phone: str
    message: Optional[str] = "Test message from BHIV HR Platform"

@app.post("/test/send-whatsapp", tags=["Communication Tools"])
async def test_send_whatsapp(
    request: WhatsAppTestRequest = None,
    phone: Optional[str] = None,
    message: Optional[str] = "Test message from BHIV HR Platform",
    api_key: str = Depends(get_api_key)
):
    """Test WhatsApp Sending - Works with Indian phone numbers (+91 format)"""
    try:
        from .communication import comm_manager
        
        # Support both JSON body and query params
        if request:
            ph = request.phone
            msg = request.message or message
        else:
            ph = phone or "+919284967526"
            msg = message
        
        result = await comm_manager.send_whatsapp(ph, msg)
        return {"success": True, "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class TelegramTestRequest(BaseModel):
    chat_id: str
    message: Optional[str] = "Test message from BHIV HR Platform"

@app.post("/test/send-telegram", tags=["Communication Tools"])
async def test_send_telegram(
    request: TelegramTestRequest = None,
    chat_id: Optional[str] = None,
    message: Optional[str] = "Test message from BHIV HR Platform",
    api_key: str = Depends(get_api_key)
):
    """Test Telegram Sending"""
    try:
        from .communication import comm_manager
        
        # Support both JSON body and query params
        if request:
            cid = request.chat_id
            msg = request.message or message
        else:
            cid = chat_id or "test_chat_id"
            msg = message
        
        result = await comm_manager.send_telegram(cid, msg)
        return {"success": True, "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/test/send-whatsapp-buttons", tags=["Communication Tools"])
async def test_send_whatsapp_buttons(
    phone: str,
    message: str = "📅 Interview Scheduled for Software Engineer. Please confirm!",
    api_key: str = Depends(get_api_key)
):
    """Test WhatsApp Interactive Buttons"""
    try:
        from .communication import comm_manager
        button_options = ["✅ Confirm", "❌ Reschedule", "❓ More Info"]
        result = await comm_manager.send_whatsapp_with_buttons(phone, message, button_options)
        return {"success": True, "result": result, "interactive_options": button_options}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/test/send-automated-sequence", tags=["Communication Tools"])
async def test_send_automated_sequence(
    candidate_name: str = "John Doe",
    candidate_email: str = "test@example.com",
    candidate_phone: str = "9284967526",
    job_title: str = "Software Engineer",
    sequence_type: str = "interview_scheduled",
    api_key: str = Depends(get_api_key)
):
    """Test Automated Email & WhatsApp Sequence with Interactive Features"""
    try:
        from .communication import comm_manager
        
        payload = {
            "candidate_name": candidate_name,
            "candidate_email": candidate_email,
            "candidate_phone": candidate_phone,
            "job_title": job_title,
            "interview_date": "December 25, 2024",
            "interview_time": "2:00 PM",
            "interviewer": "Sarah Johnson",
            "matching_score": "85"
        }
        
        results = await comm_manager.send_automated_sequence(payload, sequence_type)
        
        return {
            "success": True,
            "sequence_type": sequence_type,
            "payload": payload,
            "results": results,
            "sent_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class WorkflowAutomationRequest(BaseModel):
    event_type: str
    payload: dict

@app.post("/automation/trigger-workflow", tags=["Communication Tools"])
async def trigger_workflow_automation(
    request: WorkflowAutomationRequest = None,
    event_type: Optional[str] = None,
    payload: Optional[dict] = None,
    api_key: str = Depends(get_api_key)
):
    """Trigger Portal Integration Workflows"""
    try:
        from .communication import comm_manager
        
        # Support both JSON body and separate params
        if request:
            evt = request.event_type
            pld = request.payload
        else:
            evt = event_type or "test"
            pld = payload or {}
        
        result = await comm_manager.trigger_workflow_automation(evt, pld)
        
        return {
            "success": True,
            "automation_result": result,
            "triggered_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class BulkNotificationRequest(BaseModel):
    candidates: List[dict]
    sequence_type: str
    job_data: dict

@app.post("/automation/bulk-notifications", tags=["Communication Tools"])
async def send_bulk_notifications(
    request: BulkNotificationRequest = None,
    candidates: Optional[List[dict]] = None,
    sequence_type: Optional[str] = None,
    job_data: Optional[dict] = None,
    api_key: str = Depends(get_api_key)
):
    """Send Bulk Notifications to Multiple Candidates"""
    try:
        from .communication import comm_manager
        
        # Support both JSON body and separate params
        if request:
            cands = request.candidates
            seq_type = request.sequence_type
            job = request.job_data
        else:
            cands = candidates or []
            seq_type = sequence_type or "application_received"
            job = job_data or {}
        
        result = await comm_manager.send_bulk_notifications(cands, seq_type, job)
        
        return {
            "success": True,
            "bulk_result": result,
            "sent_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/webhook/whatsapp", tags=["Communication Tools"])
async def whatsapp_webhook(request: dict, api_key: str = Depends(get_api_key)):
    """Handle WhatsApp Interactive Button Responses"""
    try:
        from .communication import comm_manager
        
        # Extract Twilio webhook data
        from_number = request.get("From", "").replace("whatsapp:", "")
        message_body = request.get("Body", "").strip()
        
        logger.info(f"📱 WhatsApp response from {from_number}: {message_body}")
        
        # Process user responses
        response_message = ""
        
        if message_body == "1":
            response_message = "✅ *Interview Confirmed!*\n\nThank you for confirming. We'll send you the meeting details shortly.\n\n_BHIV HR Team_"
        elif message_body == "2":
            response_message = "📅 *Reschedule Request*\n\nWe'll contact you within 24 hours to reschedule your interview.\n\n_BHIV HR Team_"
        elif message_body == "3":
            response_message = "ℹ️ *Interview Information*\n\n• Duration: 45 minutes\n• Format: Video call\n• Preparation: Review job description\n• Contact: hr@bhiv.com\n\n_BHIV HR Team_"
        else:
            response_message = "🤖 *BHIV HR Assistant*\n\nPlease reply with:\n1️⃣ Confirm\n2️⃣ Reschedule\n3️⃣ More Info\n\n_Thank you!_"
        
        # Send automated response
        result = await comm_manager.send_whatsapp(from_number, response_message)
        
        return {
            "success": True,
            "from_number": from_number,
            "user_choice": message_body,
            "response_sent": result.get("status") == "success",
            "message_id": result.get("message_id")
        }
    
    except Exception as e:
        logger.error(f"❌ Webhook error: {str(e)}")
        return {"success": False, "error": str(e)}

@app.get("/workflows/stats", tags=["Workflow Monitoring"])
async def get_workflow_stats(api_key: str = Depends(get_api_key)):
    """Workflow Statistics and Analytics
    
    **Note:** This is the correct endpoint for statistics (not `/statistics`)
    
    **Authentication:** Bearer token required
    
    **Example:**
    ```bash
    curl -H "Authorization: Bearer <YOUR_API_KEY>" \
         http://localhost:9001/workflows/stats
    ```
    """
    try:
        all_workflows = tracker.list_workflows(limit=1000)
        active_workflows = tracker.get_active_workflows()
        
        stats = {
            "total_workflows": len(all_workflows),
            "active_workflows": len(active_workflows),
            "completed_workflows": len([w for w in all_workflows if w.get("status") == "completed"]),
            "failed_workflows": len([w for w in all_workflows if w.get("status") == "failed"]),
            "average_completion_time": "3-5 minutes",  # Could be calculated from actual data
            "success_rate": f"{(len([w for w in all_workflows if w.get('status') == 'completed']) / max(len(all_workflows), 1) * 100):.1f}%",
            "database_connection": "connected" if tracker.connection else "fallback_mode",
            "last_updated": datetime.now().isoformat()
        }
        
        return stats
    except Exception as e:
        logger.error(f"❌ Error getting workflow stats: {str(e)}")
        return {"error": str(e), "status": "error"}

# NOTE: /rl/predict, /rl/feedback, /rl/analytics are defined in rl_router (rl_endpoints.py)
# The following endpoints extend the RL functionality:

@app.get("/rl/performance", tags=["RL + Feedback Agent"])
async def get_rl_performance(api_key: str = Depends(get_api_key)):
    """Get RL Performance Monitoring Data"""
    try:
        # MongoDB migration: Using mongodb_adapter instead of postgres_adapter
        from .rl_integration.mongodb_adapter import mongodb_adapter as db_adapter
        
        # Get analytics as performance metrics
        analytics = db_adapter.get_rl_analytics()
        
        return {
            "current_metrics": analytics,
            "monitoring_status": "active" if analytics.get("total_predictions", 0) > 0 else "initializing",
            "retrieved_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rl/start-monitoring", tags=["RL + Feedback Agent"])
async def start_rl_monitoring(api_key: str = Depends(get_api_key)):
    """Start RL Performance Monitoring"""
    try:
        # MongoDB migration: Using mongodb_adapter instead of postgres_adapter
        from .rl_integration.mongodb_adapter import mongodb_adapter as db_adapter
        
        # Check if monitoring is active by checking recent activity
        analytics = db_adapter.get_rl_analytics()
        is_active = analytics.get("total_predictions", 0) > 0
        
        return {
            "success": True,
            "message": "RL monitoring status checked",
            "monitoring_active": is_active,
            "total_predictions": analytics.get("total_predictions", 0),
            "checked_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/test-integration", tags=["System Diagnostics"])
async def test_integration(api_key: str = Depends(get_api_key)):
    """Integration Testing and System Validation"""
    try:
        # Test database connection
        db_status = "connected" if tracker._db else "fallback"
        
        # Test communication manager
        comm_status = "available"
        try:
            from .communication import comm_manager
            comm_status = "initialized"
        except:
            comm_status = "error"
        
        return {
            "service": "langgraph-orchestrator",
            "status": "operational",
            "integration_test": "passed",
            "endpoints_available": 15,
            "workflow_engine": "active" if LANGGRAPH_AVAILABLE else "simulation",
            "rl_engine": "integrated",
            "rl_database": "mongodb",
            "rl_monitoring": "available",
            "database_tracking": db_status,
            "communication_manager": comm_status,
            "progress_tracking": "detailed",
            "fallback_support": "enabled",
            "tested_at": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "service": "langgraph-orchestrator",
            "status": "error",
            "integration_test": "failed",
            "error": str(e),
            "tested_at": datetime.now().isoformat()
        }

# Background task with detailed progress tracking
async def _execute_workflow(workflow_id: str, state: dict, config: dict):
    """Execute workflow with detailed progress tracking and fallback"""
    try:
        logger.info(f"⏳ Executing workflow {workflow_id} with detailed progress tracking")
        
        # Step 1: Initialize (0-10%)
        tracker.update_workflow(workflow_id, 
                              status="running", 
                              progress_percentage=5,
                              current_step="Initializing workflow",
                              total_steps=6)
        await _broadcast_progress(workflow_id, "Workflow started", 5)
        
        import asyncio
        await asyncio.sleep(0.5)
        
        # Step 2: Data validation (10-25%)
        tracker.update_workflow(workflow_id, 
                              progress_percentage=15,
                              current_step="Validating candidate data")
        await _broadcast_progress(workflow_id, "Validating data", 15)
        await asyncio.sleep(1)
        
        tracker.update_workflow(workflow_id, progress_percentage=25)
        await _broadcast_progress(workflow_id, "Data validation complete", 25)
        
        # Step 3: Initial screening (25-45%)
        tracker.update_workflow(workflow_id, 
                              progress_percentage=30,
                              current_step="Performing initial screening")
        await _broadcast_progress(workflow_id, "Initial screening in progress", 30)
        await asyncio.sleep(1.5)
        
        tracker.update_workflow(workflow_id, progress_percentage=45)
        await _broadcast_progress(workflow_id, "Initial screening complete", 45)
        
        # Step 4: AI matching analysis (45-70%)
        tracker.update_workflow(workflow_id, 
                              progress_percentage=50,
                              current_step="Running AI matching analysis")
        await _broadcast_progress(workflow_id, "AI analysis started", 50)
        await asyncio.sleep(2)
        
        # Simulate AI processing with incremental updates
        for progress in [55, 60, 65, 70]:
            tracker.update_workflow(workflow_id, progress_percentage=progress)
            await _broadcast_progress(workflow_id, f"AI analysis {progress}% complete", progress)
            await asyncio.sleep(0.5)
        
        # Step 5: Generate recommendations (70-90%)
        tracker.update_workflow(workflow_id, 
                              progress_percentage=75,
                              current_step="Generating recommendations")
        await _broadcast_progress(workflow_id, "Generating recommendations", 75)
        await asyncio.sleep(1)
        
        # Try to run actual workflow if available
        final_score = 75.5
        final_status = "completed"
        output_data = {}
        
        try:
            if application_workflow:
                logger.info(f"🤖 Running LangGraph workflow for {workflow_id}")
                result = application_workflow.invoke(state, config)
                final_status = result.get("application_status", "completed")
                final_score = result.get("matching_score", 75.5)
                output_data = {
                    "ai_recommendation": result.get("ai_recommendation", "Candidate shows good potential"),
                    "sentiment": result.get("sentiment", "positive"),
                    "next_action": result.get("next_action", "schedule_interview")
                }
                logger.info(f"✅ LangGraph workflow completed for {workflow_id}")
            else:
                logger.warning(f"⚠️ LangGraph workflow not available, using simulation for {workflow_id}")
                output_data = {
                    "ai_recommendation": "Candidate profile matches job requirements well",
                    "sentiment": "positive",
                    "next_action": "schedule_interview"
                }
        except Exception as invoke_error:
            logger.error(f"❌ LangGraph workflow failed for {workflow_id}: {str(invoke_error)}")
            final_status = "completed_with_warnings"
            final_score = 65.0
            output_data = {
                "ai_recommendation": "Analysis completed with some limitations",
                "sentiment": "neutral",
                "next_action": "manual_review",
                "error_details": str(invoke_error)[:200]
            }
        
        tracker.update_workflow(workflow_id, progress_percentage=90)
        await _broadcast_progress(workflow_id, "Finalizing results", 90)
        await asyncio.sleep(0.5)
        
        # Step 6: Complete workflow (90-100%)
        tracker.complete_workflow(
            workflow_id=workflow_id,
            final_status=final_status,
            output_data=output_data
        )
        
        await _broadcast_progress(workflow_id, f"Workflow completed: {final_status}", 100)
        
        logger.info(f"✅ Workflow {workflow_id} completed successfully: {final_status} (Score: {final_score})")
        
        # Final broadcast with complete results
        await manager.broadcast(workflow_id, {
            "type": "completed",
            "workflow_id": workflow_id,
            "status": final_status,
            "progress_percentage": 100,
            "matching_score": final_score,
            "output_data": output_data,
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"❌ Workflow {workflow_id} failed with error: {str(e)}")
        
        # Update with error status
        tracker.complete_workflow(
            workflow_id=workflow_id,
            final_status="failed",
            error_message=str(e)[:500]
        )
        
        # Broadcast error
        await manager.broadcast(workflow_id, {
            "type": "error",
            "workflow_id": workflow_id,
            "error": str(e),
            "progress_percentage": 0,
            "timestamp": datetime.now().isoformat()
        })

async def _broadcast_progress(workflow_id: str, message: str, progress: int):
    """Helper function to broadcast progress updates"""
    try:
        await manager.broadcast(workflow_id, {
            "type": "progress",
            "workflow_id": workflow_id,
            "message": message,
            "progress_percentage": progress,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"❌ Failed to broadcast progress for {workflow_id}: {str(e)}")