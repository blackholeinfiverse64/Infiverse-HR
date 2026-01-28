# AI Agent Service

AI-powered semantic candidate matching and learning engine for the BHIV HR Platform, built with FastAPI and Python 3.12.7.

---

## Overview

The AI Agent Service is a specialized microservice that provides advanced semantic candidate-job matching capabilities using state-of-the-art NLP techniques. This service acts as the intelligence layer of the HR platform, implementing sophisticated algorithms to match candidates with job positions based on multiple factors including semantic similarity, experience, skills, location, and cultural fit. The service is designed for high-performance batch processing and company-specific learning.

## Architecture

The agent service follows a microservice architecture with the following components:

```
agent/
├── app.py                 # Main FastAPI application with 6 endpoints
├── config.py             # Configuration and environment variable validation
├── database.py           # MongoDB connection management
├── jwt_auth.py           # Authentication and authorization utilities
├── requirements.txt      # Python dependencies
├── Dockerfile           # Containerization configuration
├── __init__.py          # Package initialization
├── semantic_engine/     # Advanced AI/ML semantic matching module
│   ├── __init__.py
│   └── phase3_engine.py # Production Phase 3 semantic matching engine
```

## Key Features

- **Production-Grade Semantic Matching:** Uses sentence transformers (all-MiniLM-L6-v2) for advanced NLP-based candidate-job matching
- **Phase 3 AI Engine:** Advanced semantic matching with company-specific learning capabilities
- **Batch Processing:** Efficient processing of multiple job/candidate matches simultaneously
- **Adaptive Scoring:** Dynamic scoring weights based on company preferences and historical feedback
- **Company Preference Learning:** Tracks hiring patterns and adjusts scoring algorithms accordingly
- **Cultural Fit Analysis:** Incorporates cultural fit metrics based on historical feedback data
- **Reinforcement Learning Integration:** Continuous learning from successful matches and feedback
- **Real-Time Analysis:** Fast response times for live HR workflows
- **MongoDB Integration:** Scalable NoSQL database integration with connection pooling
- **Multi-Factor Scoring:** Comprehensive evaluation across semantic similarity (40%), experience (30%), skills (20%), and location (10%)

## API Endpoints

### Core API Endpoints
- `GET /` — Service information and available endpoints
- `GET /health` — Service health check

### AI Matching Engine
- `POST /match` — AI-powered candidate-job matching using Phase 3 semantic engine
- `POST /batch-match` — Batch AI matching for multiple jobs

### Candidate Analysis
- `GET /analyze/{candidate_id}` — Detailed candidate profile analysis

### System Diagnostics
- `GET /test-db` — Database connectivity test

## Detailed API Documentation

### POST /match
AI-powered candidate matching endpoint that uses Phase 3 semantic engine for advanced matching.

**Request Body:**
```json
{
  "job_id": "string"
}
```

**Response:**
```json
{
  "job_id": "string",
  "matches": ["Array of candidate matches"],
  "top_candidates": ["Top 10 candidates"],
  "total_candidates": "Total number of candidates processed",
  "algorithm_version": "3.0.0-phase3-production",
  "processing_time": "Time taken for processing",
  "ai_analysis": "Type of analysis performed",
  "agent_status": "Status of the agent connection",
  "status": "Processing status"
}
```

### POST /batch-match
Batch processing endpoint for matching multiple jobs simultaneously.

**Request Body:**
```json
{
  "job_ids": ["Array of job IDs"]
}
```

**Response:**
```json
{
  "batch_results": {"Object containing results for each job"},
  "total_jobs_processed": "Number of jobs processed",
  "total_candidates_analyzed": "Total candidates analyzed",
  "algorithm_version": "3.0.0-phase3-production-batch",
  "status": "Processing status",
  "agent_status": "Agent connection status"
}
```

### GET /analyze/{candidate_id}
Detailed analysis of a specific candidate's profile.

**Response:**
```json
{
  "candidate_id": "string",
  "name": "string",
  "email": "string",
  "experience_years": "integer",
  "seniority_level": "string",
  "education_level": "string",
  "location": "string",
  "skills_analysis": "Categorized skills analysis",
  "semantic_skills": "Semantically extracted skills",
  "total_skills": "Total number of skills",
  "ai_analysis_enabled": "boolean",
  "analysis_timestamp": "ISO timestamp"
}
```

## AI/ML Engine Specifications

### Phase 3 Semantic Engine
The core of the AI agent is the Phase 3 Semantic Engine, which implements:

- **Sentence Transformers:** Uses `all-MiniLM-L6-v2` model for semantic embeddings
- **Cosine Similarity:** Advanced similarity calculations between job requirements and candidate profiles
- **Adaptive Scoring:** Company-specific weight adjustments based on historical feedback
- **Multi-Factor Evaluation:** Combines semantic similarity, experience matching, skills assessment, location compatibility, and cultural fit
- **Company Learning:** Tracks hiring patterns to optimize scoring for individual companies
- **Cultural Fit Analysis:** Incorporates feedback-based cultural compatibility metrics
- **Async Processing:** Optimized for high-throughput batch operations
- **Caching Mechanisms:** Performance optimization through intelligent caching

### Scoring Algorithm
The algorithm uses dynamic weights that adapt based on company preferences:
- **Semantic Similarity (40%):** Job description vs. candidate profile semantic matching
- **Experience (30%):** Years and level of experience matching requirements
- **Skills (20%):** Technical and soft skills alignment
- **Location (10%):** Geographic compatibility
- **Cultural Fit:** Feedback-based cultural compatibility

## Authentication and Security

### Authentication Methods
The service supports multiple authentication methods:

- **API Keys:** For service-to-service communication
- **JWT Tokens:** For authenticated users from the frontend
- **Dual JWT Support:** Separate secrets for client and candidate tokens

### Security Features
- Token expiration validation
- Audience verification (supports both authenticated and custom audiences)
- Role-based access control (candidate, recruiter, client, admin)
- Environment-based security configuration
- Secure credential handling through environment variables

### JWT Configuration
- **JWT_SECRET_KEY:** Client authentication secret
- **CANDIDATE_JWT_SECRET_KEY:** Candidate authentication secret
- **API_KEY_SECRET:** Service-to-service communication key

## Database Integration

### MongoDB Connection
- **Driver:** PyMongo (sync) with connection pooling
- **Connection Pool:** Configured with maxPoolSize=10, minPoolSize=2
- **Timeouts:** Server selection timeout (5000ms), connection timeout (10000ms), socket timeout (20000ms)
- **Database Name:** Configurable via MONGODB_DB_NAME environment variable (defaults to bhiv_hr)

### Collections Used
- **Jobs:** Stores job postings with requirements and metadata
- **Candidates:** Stores candidate profiles with skills and experience
- **Feedback:** Stores historical feedback data for learning algorithms

## Configuration Requirements

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | MongoDB connection URI | Yes |
| API_KEY_SECRET | API key for service-to-service communication | Yes |
| JWT_SECRET_KEY | JWT secret for client authentication | Yes |
| CANDIDATE_JWT_SECRET_KEY | JWT secret for candidate authentication | Yes |
| ENVIRONMENT | Environment setting (development/production) | No (default: development) |
| LOG_LEVEL | Logging level (INFO, DEBUG, WARNING, ERROR) | No (default: INFO) |
| MONGODB_DB_NAME | MongoDB database name | No (default: bhiv_hr) |

### Python Dependencies

The service uses Python 3.12.7 with the following key dependencies:

- **FastAPI:** Web framework for API development
- **Uvicorn:** ASGI server for running the application
- **PyMongo:** MongoDB driver for database operations
- **PyJWT:** JWT token handling
- **Sentence Transformers:** NLP library for semantic matching
- **Scikit-learn:** Machine learning utilities
- **NumPy:** Numerical computing
- **Torch:** PyTorch for neural network operations
- **Transformers:** Hugging Face transformer models

## Deployment Instructions

### Docker Deployment

The service includes a Dockerfile optimized for production:

```dockerfile
FROM python:3.12.7-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --timeout 300 --retries 3 -r requirements.txt

COPY . .

EXPOSE 9000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "9000", "--timeout-keep-alive", "30"]
```

Build and run the container:

```bash
docker build -t ai-agent-service .
docker run -p 9000:9000 \
  -e DATABASE_URL=<your_mongodb_url> \
  -e API_KEY_SECRET=<your_api_key> \
  -e JWT_SECRET_KEY=<your_jwt_secret> \
  -e CANDIDATE_JWT_SECRET_KEY=<your_candidate_jwt_secret> \
  ai-agent-service
```

### Local Development

```bash
cd backend/services/agent
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 9000 --reload
```

### Kubernetes Deployment

The service can be deployed to Kubernetes with the following configuration:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-agent-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ai-agent-service
  template:
    metadata:
      labels:
        app: ai-agent-service
    spec:
      containers:
      - name: ai-agent-service
        image: ai-agent-service:latest
        ports:
        - containerPort: 9000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: agent-secrets
              key: database_url
        - name: API_KEY_SECRET
          valueFrom:
            secretKeyRef:
              name: agent-secrets
              key: api_key_secret
        # Add other environment variables as needed
---
apiVersion: v1
kind: Service
metadata:
  name: ai-agent-service
spec:
  selector:
    app: ai-agent-service
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9000
  type: LoadBalancer
```

## Integration Points

### With Gateway Service
- API key-based authentication for service-to-service communication
- Receives job and candidate data for matching
- Returns scored candidate lists to gateway service

### With LangGraph Service
- Provides AI matching scores to LangGraph workflows
- Receives feedback data for continuous learning
- Shared MongoDB database for RL data persistence
- Cross-service coordination for candidate processing workflows
- **Shared Components:** Both services use the same JWT authentication module and database connection patterns

### With Frontend Application
- JWT token validation for authenticated requests
- Provides real-time matching results to UI
- Supplies detailed candidate analysis for user interfaces

### With Database Layer
- Direct MongoDB integration for data access
- Implements connection pooling and error handling
- Supports ObjectId and string-based document identification

## Relationship with Other Services

### Shared Components with LangGraph Service
Both services utilize several shared components and patterns:

- **Authentication System:** Shared JWT authentication module with dual secret support
- **Database Integration:** Both use MongoDB with similar connection patterns
- **Configuration Management:** Consistent environment variable-based configuration
- **Error Handling:** Similar fallback and graceful degradation patterns
- **Logging Framework:** Unified logging structure and format

### Ishan's LangGraph Implementation Origins
While this agent service focuses specifically on AI-powered candidate matching, it shares architectural patterns and concepts with the LangGraph service that originated from Ishan's implementation:

- **Modular Design:** Decomposition of complex functionality into specialized components
- **State Management:** Consistent approaches to data state and persistence
- **External Integration:** Standardized interfaces for communicating with other services
- **Error Resilience:** Similar fallback mechanisms and graceful degradation strategies
- **Configuration Patterns:** Shared approaches to environment-based configuration

The agent service has been specifically optimized for:
- High-performance semantic matching using sentence transformers
- Company-specific adaptive scoring algorithms
- Integration with the RL feedback system
- Real-time candidate analysis capabilities
- Scalable batch processing for large datasets

## Error Handling and Monitoring

### Error Handling
- Comprehensive exception handling throughout all endpoints
- Database connection failure handling
- Job/candidate not found scenarios
- Invalid authentication handling
- Semantic engine failure fallbacks

### Logging
- Structured logging with configurable log levels
- Request/response logging for debugging
- Performance timing logs
- Error tracking and reporting

### Health Checks
- `/health` endpoint for service status monitoring
- Database connectivity verification
- Semantic engine availability checks

## Performance Considerations

- Async processing for batch operations
- Connection pooling for database operations
- Caching mechanisms for repeated requests
- Optimized semantic model loading (singleton pattern)
- Thread pool executor for CPU-intensive operations
- Efficient MongoDB queries with indexing

## Testing and Validation

### API Testing
All endpoints are protected by authentication and return structured responses with status indicators.

### Model Validation
- Semantic model initialization verification
- Embedding generation validation
- Cosine similarity calculation verification
- Score normalization validation

## Maintenance and Operations

### Scaling
- Horizontal scaling through multiple service instances
- Database connection pooling for efficient resource utilization
- Async processing for high-throughput scenarios

### Backup and Recovery
- MongoDB native backup capabilities
- Semantic model reinitialization on failure
- Cache invalidation strategies

### Updates and Versioning
- Semantic versioning following 3.0.0-phase3-production pattern
- Backward compatibility maintained through wrapper classes
- Environment-based configuration for different environments
