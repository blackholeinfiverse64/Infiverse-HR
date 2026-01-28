
# BHIV LangGraph Service

AI-powered workflow orchestration and automation for the BHIV HR Platform, built with FastAPI, LangGraph, and MongoDB. This service provides intelligent candidate application processing, reinforcement learning-based matching, and multi-channel communication capabilities.

---

## Overview

The LangGraph Service is a sophisticated workflow orchestration engine that automates the entire candidate application lifecycle. It leverages LangGraph's state machine capabilities to create intelligent, persistent workflows that can handle complex business logic, multi-step processes, and real-time updates. The service integrates advanced AI/ML capabilities including reinforcement learning for adaptive matching and Google Gemini for natural language processing.

## Architecture

The service follows a modular microservice architecture with the following key components:

```
langgraph/
├── app/
│   ├── main.py                 # FastAPI application with 25 endpoints
│   ├── graphs.py               # LangGraph workflow definitions
│   ├── state.py                # Workflow state definitions
│   ├── agents.py               # AI agents for screening and processing
│   ├── communication.py        # Multi-channel communication manager
│   ├── mongodb_checkpointer.py # Custom MongoDB checkpointing
│   ├── mongodb_tracker.py      # Workflow tracking and monitoring
│   ├── rl_engine.py            # Reinforcement learning engine
│   ├── rl_database.py          # RL data management
│   ├── rl_performance_monitor.py # RL performance tracking
│   ├── tools.py                # LangChain tools for external integration
│   ├── monitoring.py           # Service monitoring utilities
│   └── rl_integration/         # RL-specific modules
│       ├── rl_endpoints.py     # RL API endpoints
│       ├── mongodb_adapter.py  # RL database adapter
│       ├── decision_engine.py  # RL decision making
│       └── ml_models.py        # ML model implementations
├── config.py                   # Pydantic-based configuration
├── dependencies.py             # Authentication dependencies
├── jwt_auth.py                 # JWT authentication utilities
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Container configuration
├── tests/                      # Integration and unit tests
└── README.md                   # This documentation
```

## Key Features

### Workflow Orchestration
- **LangGraph Integration:** Advanced state machine workflows with persistent checkpointing
- **Multi-Stage Processing:** Automated candidate screening, notification, HR updates, and feedback collection
- **Real-Time Updates:** WebSocket support for live workflow status monitoring
- **Persistent State Management:** MongoDB-based checkpointing for workflow recovery
- **Conditional Logic:** Dynamic routing based on application status and business rules

### AI/ML Capabilities
- **Reinforcement Learning:** Adaptive matching with continuous learning from feedback
- **Google Gemini Integration:** Advanced natural language processing for decision making
- **Semantic Matching:** AI-powered candidate-job compatibility scoring
- **Feedback Loop:** Closed-loop learning system that improves over time
- **Confidence Scoring:** Dynamic confidence levels based on historical performance

### Communication Systems
- **Multi-Channel Support:** Email, WhatsApp, and Telegram notifications
- **Interactive Messaging:** WhatsApp buttons and Telegram keyboards
- **Automated Sequences:** Predefined notification templates for common scenarios
- **Bulk Notifications:** Mass communication capabilities
- **Webhook Integration:** Real-time response handling for interactive features

### Monitoring & Analytics
- **Real-Time Tracking:** Detailed workflow progress monitoring
- **Performance Metrics:** RL system analytics and model performance tracking
- **Audit Logging:** Comprehensive event logging for compliance
- **Health Monitoring:** Built-in service health checks
- **Error Handling:** Graceful degradation with fallback mechanisms

## API Endpoints

### Core API Endpoints (2 endpoints)
- `GET /` — Service information and available endpoints
- `GET /health` — Service health check and monitoring status

### Workflow Management (2 endpoints)
- `POST /workflows/application/start` — Start candidate application workflow
- `POST /workflows/{workflow_id}/resume` — Resume paused workflow
- `GET /workflows/{workflow_id}/status` — Get detailed workflow status

### Workflow Monitoring (3 endpoints)
- `GET /workflows/{workflow_id}/status` — Get detailed workflow status
- `GET /workflows` — List all workflows with filtering options
- `GET /workflows/stats` — Workflow statistics and analytics

### Communication Tools (9 endpoints)
- `POST /tools/send-notification` — Multi-channel notification system
- `POST /test/send-email` — Test email sending functionality
- `POST /test/send-whatsapp` — Test WhatsApp messaging
- `POST /test/send-telegram` — Test Telegram messaging
- `POST /test/send-whatsapp-buttons` — Test interactive WhatsApp buttons
- `POST /test/send-automated-sequence` — Test automated notification sequences
- `POST /automation/trigger-workflow` — Trigger portal integration workflows
- `POST /automation/bulk-notifications` — Send bulk notifications
- `POST /webhook/whatsapp` — Handle WhatsApp interactive responses

### RL + Feedback Agent (8 endpoints)
- `POST /rl/predict` — RL-enhanced candidate matching prediction
- `POST /rl/feedback` — Submit feedback for RL learning
- `GET /rl/analytics` — RL system analytics and performance metrics
- `GET /rl/performance/{model_version}` — RL model performance data
- `GET /rl/history/{candidate_id}` — Candidate RL decision history
- `POST /rl/retrain` — Trigger RL model retraining
- `GET /rl/performance` — RL performance monitoring data
- `POST /rl/start-monitoring` — Start RL performance monitoring

### System Diagnostics (1 endpoint)
- `GET /test-integration` — Integration testing and system validation

## Detailed API Documentation

### POST /workflows/application/start
Starts a new candidate application workflow with AI processing.

**Request Body:**
```json
{
  "candidate_id": "string",
  "job_id": "string",
  "application_id": "string",
  "candidate_email": "string",
  "candidate_phone": "string",
  "candidate_name": "string",
  "job_title": "string",
  "job_description": "string (optional)"
}
```

**Response:**
```json
{
  "workflow_id": "string",
  "status": "started",
  "message": "Application workflow started for John Doe",
  "timestamp": "ISO timestamp"
}
```

### GET /workflows/{workflow_id}/status
Retrieves detailed status information for a specific workflow.

**Response:**
```json
{
  "workflow_id": "string",
  "workflow_type": "candidate_application",
  "status": "running|completed|failed",
  "progress_percentage": 75,
  "current_step": "notification",
  "total_steps": 5,
  "candidate_id": "string",
  "job_id": "string",
  "input_data": {},
  "output_data": {},
  "error_message": "string (if applicable)",
  "started_at": "ISO timestamp",
  "completed_at": "ISO timestamp (if completed)",
  "updated_at": "ISO timestamp",
  "completed": true|false,
  "estimated_time_remaining": "2-4 minutes",
  "source": "database|langgraph_fallback"
}
```

### POST /rl/predict
Makes RL-enhanced candidate matching predictions.

**Request Body:**
```json
{
  "candidate_id": "integer",
  "job_id": "integer",
  "candidate_features": {},
  "job_features": {}
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "prediction_id": "string",
    "rl_prediction": {
      "rl_score": 85.5,
      "confidence_level": 75,
      "decision_type": "shortlist",
      "features_used": {}
    },
    "feedback_samples_used": 50
  },
  "message": "RL prediction completed successfully",
  "timestamp": "ISO timestamp"
}
```

## AI/ML Engine Specifications

### LangGraph Workflow Engine
The core workflow engine implements a sophisticated state machine with the following characteristics:

- **State Management:** TypedDict-based state definitions with automatic serialization
- **Checkpointing:** Custom MongoDB-based checkpointing for workflow persistence
- **Conditional Routing:** Dynamic workflow paths based on business logic
- **Parallel Processing:** Concurrent execution of independent workflow steps
- **Error Recovery:** Automatic rollback and retry mechanisms

### Reinforcement Learning System
The RL engine provides adaptive matching capabilities:

- **Decision Engine:** Calculates RL-adjusted scores based on feedback history
- **Feedback Processing:** Transforms outcomes into reward signals for learning
- **Model Evolution:** Continuous model improvement through online learning
- **Confidence Estimation:** Dynamic confidence scoring based on data volume
- **Performance Monitoring:** Real-time tracking of model accuracy and effectiveness

### Communication Framework
Multi-channel communication system with advanced features:

- **Channel Abstraction:** Unified interface for email, WhatsApp, and Telegram
- **Template System:** Predefined message templates for common scenarios
- **Interactive Features:** Support for buttons, keyboards, and user responses
- **Rate Limiting:** Intelligent throttling to prevent spam
- **Delivery Tracking:** Confirmation and error handling for all messages

## Authentication and Security

### Authentication Methods
Supports multiple authentication schemes:

- **API Keys:** Service-to-service communication with secure key validation
- **JWT Tokens:** User authentication with dual secret support (client/candidate)
- **Role-Based Access:** Fine-grained permissions for different user types

### Security Features
- Token expiration and renewal handling
- Audience validation for JWT tokens
- Secure credential storage in environment variables
- Input validation and sanitization
- Rate limiting for API endpoints
- Audit logging for security events

### JWT Configuration
- **JWT_SECRET_KEY:** Client authentication secret
- **CANDIDATE_JWT_SECRET_KEY:** Candidate-specific authentication secret
- **API_KEY_SECRET:** Service-to-service communication key

## Database Integration

### MongoDB Architecture
The service uses MongoDB for all data persistence with the following collections:

- **workflows:** Workflow state and tracking information
- **langgraph_checkpoints:** LangGraph state machine checkpoints
- **rl_predictions:** Reinforcement learning predictions
- **rl_feedback:** Feedback data for RL learning
- **rl_training_data:** Training datasets for model improvement
- **rl_model_performance:** Model performance metrics
- **audit_logs:** Security and operational audit trails

### Connection Management
- **Connection Pooling:** Configured with optimal pool sizes for performance
- **Retry Logic:** Automatic reconnection handling for transient failures
- **Fallback Storage:** In-memory backup for critical operations when database is unavailable
- **Index Optimization:** Strategic indexing for query performance

## Configuration Requirements

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | MongoDB connection URI | Yes |
| API_KEY_SECRET | Service-to-service API key | Yes |
| JWT_SECRET_KEY | JWT secret for client authentication | Yes |
| CANDIDATE_JWT_SECRET_KEY | JWT secret for candidate authentication | Yes |
| GATEWAY_SERVICE_URL | URL for API Gateway service | Yes |
| GEMINI_API_KEY | Google Gemini API key | Optional (reduced functionality) |
| TWILIO_ACCOUNT_SID | Twilio account SID | Optional (WhatsApp disabled) |
| TWILIO_AUTH_TOKEN | Twilio auth token | Optional (WhatsApp disabled) |
| GMAIL_EMAIL | Gmail account for email notifications | Optional (email disabled) |
| GMAIL_APP_PASSWORD | Gmail app password | Optional (email disabled) |
| TELEGRAM_BOT_TOKEN | Telegram bot token | Optional (Telegram disabled) |
| ENVIRONMENT | Environment setting (development/production) | No (default: production) |
| LOG_LEVEL | Logging level (INFO, DEBUG, WARNING, ERROR) | No (default: INFO) |
| MONGODB_DB_NAME | MongoDB database name | No (default: bhiv_hr) |

### Python Dependencies

Key dependencies include:

- **LangGraph/LangChain:** Workflow orchestration and AI agent framework
- **FastAPI:** High-performance web framework
- **PyMongo:** MongoDB database driver
- **Google Generative AI:** Gemini integration for NLP
- **Twilio:** WhatsApp messaging capabilities
- **PyJWT:** JWT token handling and validation
- **Pydantic:** Data validation and settings management

## Deployment Instructions

### Docker Deployment

Production-ready Docker configuration:

```dockerfile
FROM python:3.12.7-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y gcc curl && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

EXPOSE 9001

CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-9001} --timeout-keep-alive 30
```

Build and deploy:

```bash
docker build -t bhiv-langgraph .
docker run -p 9001:9001 \
  -e DATABASE_URL=<your_mongodb_url> \
  -e API_KEY_SECRET=<your_api_key> \
  -e JWT_SECRET_KEY=<your_jwt_secret> \
  -e CANDIDATE_JWT_SECRET_KEY=<your_candidate_jwt_secret> \
  -e GATEWAY_SERVICE_URL=http://gateway:8000 \
  bhiv-langgraph
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: langgraph-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: langgraph-service
  template:
    metadata:
      labels:
        app: langgraph-service
    spec:
      containers:
      - name: langgraph-service
        image: bhiv-langgraph:latest
        ports:
        - containerPort: 9001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: langgraph-secrets
              key: database_url
        - name: API_KEY_SECRET
          valueFrom:
            secretKeyRef:
              name: langgraph-secrets
              key: api_key_secret
        # Add other environment variables
        readinessProbe:
          httpGet:
            path: /health
            port: 9001
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: langgraph-service
spec:
  selector:
    app: langgraph-service
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9001
  type: LoadBalancer
```

### Local Development

```bash
cd backend/services/langgraph
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 9001 --reload
```

## Integration Points

### With Gateway Service
- API key-based authentication for service communication
- REST API calls for candidate and job data retrieval
- Shared JWT authentication secrets
- Asynchronous communication for non-blocking operations

### With Agent Service
- RL prediction requests for enhanced matching
- Feedback submission for continuous learning
- Shared MongoDB database for RL data persistence
- Cross-service coordination for workflow execution

### With Frontend Applications
- WebSocket connections for real-time updates
- JWT token validation for authenticated users
- Multi-channel notification delivery
- Audit trail for compliance and tracking

## Error Handling and Monitoring

### Error Handling Strategies
- **Graceful Degradation:** Fallback to mock services when external dependencies fail
- **Retry Logic:** Exponential backoff for transient failures
- **Circuit Breaker:** Prevent cascading failures in distributed systems
- **Detailed Logging:** Structured logging with correlation IDs
- **User-Friendly Errors:** Meaningful error messages for different failure scenarios

### Monitoring Capabilities
- **Health Checks:** Comprehensive service health monitoring
- **Performance Metrics:** Response times, throughput, and error rates
- **Business Metrics:** Workflow completion rates and success metrics
- **Alerting:** Integration with monitoring systems for proactive issue detection
- **Tracing:** Distributed tracing for complex workflow debugging

### Logging Framework
- Structured JSON logging for easy parsing
- Configurable log levels per environment
- Correlation IDs for request tracing
- Performance timing logs
- Security event logging

## Performance Considerations

### Scalability Features
- **Horizontal Scaling:** Stateless design enables easy horizontal scaling
- **Database Connection Pooling:** Optimized database connection management
- **Asynchronous Processing:** Non-blocking I/O for high concurrency
- **Caching Strategies:** Intelligent caching for frequently accessed data
- **Resource Management:** Proper cleanup and connection management

### Optimization Techniques
- **Batch Processing:** Efficient handling of bulk operations
- **Lazy Initialization:** Deferred loading of expensive resources
- **Memory Management:** Optimized data structures and garbage collection
- **Network Efficiency:** Connection reuse and compression
- **Query Optimization:** Indexed queries and efficient data retrieval

## Testing and Validation

### Test Suite Structure
- **Unit Tests:** Component-level testing for individual modules
- **Integration Tests:** End-to-end testing of service interactions
- **Load Testing:** Performance validation under stress conditions
- **Security Testing:** Authentication and authorization validation
- **Regression Testing:** Automated testing for preventing regressions

### Quality Assurance
- **Code Coverage:** Target 80%+ test coverage
- **Continuous Integration:** Automated testing on every commit
- **Static Analysis:** Code quality and security scanning
- **Performance Benchmarks:** Regular performance validation
- **Manual Testing:** Exploratory testing for edge cases

## Maintenance and Operations

### Operational Procedures
- **Backup and Recovery:** Regular database backups and restore procedures
- **Monitoring and Alerting:** Proactive issue detection and response
- **Capacity Planning:** Resource allocation based on usage patterns
- **Security Updates:** Regular patching and vulnerability management
- **Documentation:** Keeping documentation synchronized with code changes

### Upgrade Process
- **Blue-Green Deployment:** Zero-downtime deployment strategy
- **Rollback Procedures:** Quick rollback capability for failed deployments
- **Data Migration:** Safe migration of existing data during upgrades
- **Compatibility Testing:** Ensuring backward compatibility
- **Gradual Rollout:** Phased deployment to minimize risk

## Relationship with Other Services

### Shared Components with Agent Service
Both services utilize several shared components and patterns:

- **Authentication System:** Shared JWT authentication module with dual secret support
- **Database Integration:** Both use MongoDB with similar connection patterns
- **Configuration Management:** Consistent environment variable-based configuration
- **Error Handling:** Similar fallback and graceful degradation patterns
- **Logging Framework:** Unified logging structure and format

### Ishan's LangGraph Implementation Origins
This service incorporates and extends several concepts originally developed in Ishan's LangGraph implementation:

- **Workflow State Management:** Core LangGraph state machine concepts
- **Checkpointing Patterns:** Persistent workflow state storage mechanisms
- **Agent-Based Processing:** Decomposition of complex workflows into specialized agents
- **Multi-Step Orchestration:** Sequential and conditional workflow execution
- **External Tool Integration:** Standardized interfaces for external service communication

The current implementation has been significantly enhanced with:
- MongoDB migration (replacing PostgreSQL dependencies)
- Reinforcement learning integration
- Advanced communication capabilities
- Comprehensive monitoring and observability
- Improved error handling and resilience
- Production-ready deployment configurations