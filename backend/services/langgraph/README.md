
# BHIV LangGraph Service

AI-powered workflow orchestration and automation for the BHIV HR Platform, built with FastAPI, LangGraph, and MongoDB.

---

## Overview
LangGraph orchestrates candidate application workflows, AI-driven matching, multi-channel notifications, and real-time updates. All workflow state and RL data are stored in MongoDB (no PostgreSQL required).

## Key Features
- **Automated Workflows:** Candidate application, screening, notification, HR updates, feedback collection
- **AI/ML Integration:** Google Gemini, transformers, RL-based scoring, adaptive matching
- **Multi-Channel Notifications:** Email, WhatsApp, Telegram (optional)
- **Real-Time Updates:** WebSocket endpoints for live workflow status
- **Custom MongoDB Checkpointing:** Reliable workflow state persistence
- **Monitoring:** Built-in health and performance monitoring

## Major Modules
- `app/main.py` — FastAPI app, API endpoints, WebSocket
- `app/graphs.py` — Workflow graph definitions
- `app/agents.py` — AI/ML agents for screening, feedback, etc.
- `app/rl_engine.py` — Reinforcement learning engine
- `app/rl_database.py` — RL data manager (MongoDB)
- `app/communication.py` — Email, WhatsApp, Telegram integration
- `app/mongodb_checkpointer.py` — Custom MongoDB checkpointing
- `config.py` — Pydantic-based settings loader

## API Endpoints (Core)
- `GET /health` — Service health check
- `POST /workflows/application/start` — Start candidate application workflow
- `GET /workflows/{workflow_id}/status` — Get workflow status
- `POST /workflows/{workflow_id}/resume` — Resume paused workflow
- `WebSocket /ws/{workflow_id}` — Real-time workflow updates

## Environment Variables
**Required:**
- `MONGODB_URI` — MongoDB connection string
- `MONGODB_DB_NAME` — Database name (default: `bhiv_hr`)
- `GATEWAY_SERVICE_URL` — URL for API Gateway
- `API_KEY_SECRET` — Service-to-service API key
- `JWT_SECRET_KEY` — JWT secret for auth
- `CANDIDATE_JWT_SECRET_KEY` — JWT secret for candidate tokens

**Optional (for full features):**
- `GEMINI_API_KEY`, `GEMINI_MODEL` — Google Gemini AI
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_NUMBER` — WhatsApp notifications
- `GMAIL_EMAIL`, `GMAIL_APP_PASSWORD` — Email notifications
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME` — Telegram notifications
- `ENVIRONMENT`, `LOG_LEVEL` — Service environment and logging

## Local Development
```bash
cd services/langgraph
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 9001 --reload
```

## Docker Deployment
```bash
docker build -t bhiv-langgraph .
docker run -p 9001:9001 bhiv-langgraph
```

## Production Deployment
- Deployable to any cloud/container platform (Render, AWS, Azure, etc.)
- Example start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## Integration
- Called by the Gateway service for workflow automation
- Exposes its own API for direct use

## Testing
Run all tests with:
```bash
pytest
```
Or test health endpoint:
```bash
curl http://localhost:9001/health
```

## Notes
- No PostgreSQL dependencies — all workflow and RL data are in MongoDB
- RL and AI features are modular; service runs even if some API keys are missing (with reduced functionality)
- See `LOCAL_SETUP.md` for detailed local setup instructions