# Frontend Automation Implementation Guide

## Executive Summary

This guide provides detailed instructions for implementing backend automation endpoints that exist but are not yet accessible through the frontend UI. It includes API specifications, implementation code, UI/UX designs, and integration strategies.

---

## Section 1: Frontend Test Results

### Tests Executed (February 28, 2026)

| Test | Endpoint | Frontend Location | Status |
|------|----------|-------------------|--------|
| 1 | `GET /health` | AutomationPanel.tsx | ✅ PASS |
| 2 | `POST /automation/notifications/send` | AutomationPanel.tsx | ✅ PASS |
| 3 | `POST /automation/test/sequence` | AutomationPanel.tsx | ✅ PASS |
| 4 | `POST /automation/notifications/bulk` | BatchOperations.tsx | ✅ PASS |
| 5 | `POST /v1/automation/trigger` | api.ts | ⚠️ PARTIAL |

**Result: 4/5 fully operational, 1 partial (gateway auth)**

---

## Section 2: Non-Implemented Endpoints Analysis

### Endpoints Available in Backend but NOT in Frontend

| # | Endpoint | Method | Purpose | Priority |
|---|----------|--------|---------|----------|
| 1 | `/automation/info` | GET | Service metadata | Medium |
| 2 | `/automation/test/integration` | GET | Test all integrations | High |
| 3 | `/automation/workflows/trigger` | POST | Trigger workflow by event | High |
| 4 | `/automation/workflows/application/start` | POST | Start application workflow | High |
| 5 | `/automation/workflows/{id}/status` | GET | Get workflow status | High |
| 6 | `/automation/workflows` | GET | List all workflows | High |
| 7 | `/automation/rl/analytics` | GET | RL model analytics | Medium |
| 8 | `/automation/rl/predict` | POST | Get AI prediction | Medium |
| 9 | `/automation/test/whatsapp-buttons` | POST | Interactive WhatsApp | Low |

---

## Section 3: API Specifications for Non-Implemented Endpoints

### 3.1 Service Info Endpoint

```
GET /automation/info
Authorization: Bearer {API_KEY}
```

**Purpose:** Returns detailed service metadata including version, active components, and endpoint count.

**Expected Response:**
```json
{
  "service": "LangGraph Automation Service",
  "version": "1.0.0",
  "status": "operational",
  "endpoints_available": 13,
  "active_components": {
    "workflow_engine": true,
    "notification_handler": true,
    "rl_service": true,
    "mongodb_tracker": true
  }
}
```

**Frontend Integration:**
- Display in AutomationPanel.tsx service status card
- Show component status badges

---

### 3.2 Integration Test Endpoint

```
GET /automation/test/integration
Authorization: Bearer {API_KEY}
```

**Purpose:** Tests all external service integrations (email, WhatsApp, Telegram, MongoDB).

**Expected Response:**
```json
{
  "status": "operational",
  "components_tested": ["email", "whatsapp", "telegram", "workflow_engine"],
  "mongodb_connected": true,
  "warnings": []
}
```

**Frontend Integration:**
- Add "Test All Integrations" button
- Display integration health dashboard

---

### 3.3 Workflow Trigger Endpoint

```
POST /automation/workflows/trigger
Authorization: Bearer {API_KEY}
Content-Type: application/json

{
  "workflow_type": "application_received" | "interview_scheduled" | "offer_extended" | "rejection",
  "candidate_id": "string",
  "job_id": "string",
  "trigger_source": "api" | "frontend" | "webhook"
}
```

**Purpose:** Triggers automated workflow based on HR events.

**Expected Response:**
```json
{
  "success": true,
  "workflow_id": "wf_abc123",
  "status": "automation_triggered",
  "candidate_id": "123",
  "job_id": "456",
  "actions_queued": ["send_confirmation", "notify_recruiter", "update_database"]
}
```

---

### 3.4 Start Application Workflow

```
POST /automation/workflows/application/start
Authorization: Bearer {API_KEY}
Content-Type: application/json

{
  "candidate_id": "string",
  "candidate_name": "string",
  "candidate_email": "string",
  "candidate_phone": "string (optional)",
  "job_id": "string",
  "job_title": "string",
  "company_name": "string",
  "application_source": "string"
}
```

**Purpose:** Initiates complete application workflow with all automated actions.

**Expected Response:**
```json
{
  "success": true,
  "workflow_id": "840835e5-6ecb-4142-afdc-270eff86e248",
  "status": "started",
  "candidate_id": "real_cand_123",
  "job_id": "job_456",
  "steps_completed": ["initialization", "confirmation_email_queued"],
  "next_step": "recruiter_notification"
}
```

---

### 3.5 Get Workflow Status

```
GET /automation/workflows/{workflow_id}/status
Authorization: Bearer {API_KEY}
```

**Purpose:** Retrieves current status and progress of a specific workflow.

**Expected Response:**
```json
{
  "workflow_id": "840835e5-6ecb-4142-afdc-270eff86e248",
  "status": "completed" | "in_progress" | "failed" | "completed_with_warnings",
  "candidate_id": "real_cand_123",
  "job_id": "job_456",
  "steps_completed": ["all"],
  "created_at": "2026-02-28T12:00:00Z",
  "updated_at": "2026-02-28T12:05:00Z",
  "data_source": "mongodb"
}
```

---

### 3.6 List All Workflows

```
GET /automation/workflows?limit=10&offset=0
Authorization: Bearer {API_KEY}
```

**Purpose:** Lists recent workflows with pagination for monitoring.

**Expected Response:**
```json
{
  "workflows": [
    {
      "workflow_id": "abc123",
      "workflow_type": "application_received",
      "status": "completed",
      "candidate_name": "John Doe",
      "job_title": "Software Engineer",
      "created_at": "2026-02-28T12:00:00Z"
    }
  ],
  "count": 5,
  "total": 25,
  "status": "operational",
  "tracking_source": "database_with_fallback"
}
```

---

### 3.7 RL Analytics

```
GET /automation/rl/analytics
Authorization: Bearer {API_KEY}
```

**Purpose:** Provides AI/ML model performance analytics.

**Expected Response:**
```json
{
  "total_predictions": 25,
  "total_feedback": 19,
  "feedback_rate": 76.0,
  "accuracy": 0.91,
  "model_performance": {
    "precision": 0.89,
    "recall": 0.87,
    "f1_score": 0.88
  },
  "recent_decisions": {
    "shortlist": 15,
    "reject": 8,
    "interview": 2
  }
}
```

---

### 3.8 RL Prediction

```
POST /automation/rl/predict
Authorization: Bearer {API_KEY}
Content-Type: application/json

{
  "candidate_id": "string",
  "job_id": "string",
  "features": {
    "skills": ["Python", "JavaScript", "React"],
    "experience_years": 5,
    "education_level": "Bachelors",
    "skill_match_score": 0.85
  }
}
```

**Purpose:** Gets AI recommendation for candidate-job match.

**Expected Response:**
```json
{
  "prediction_id": "pred_abc123",
  "candidate_id": "100",
  "job_id": "50",
  "decision_type": "shortlist" | "reject" | "interview",
  "confidence_level": 85.0,
  "factors_considered": ["skill_match", "experience", "education"],
  "recommendation": "Strong candidate match. Recommend proceeding to interview."
}
```

---

## Section 4: Frontend Implementation Code

### 4.1 Add to api.ts (Service Layer)

```typescript
// ==================== WORKFLOW API ====================

export const getServiceInfo = async () => {
  const langgraphUrl = import.meta.env.VITE_LANGGRAPH_URL || 'http://localhost:9001'
  const apiKey = import.meta.env.VITE_API_KEY
  
  const response = await fetch(`${langgraphUrl}/automation/info`, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })
  return response.json()
}

export const testIntegrations = async () => {
  const langgraphUrl = import.meta.env.VITE_LANGGRAPH_URL || 'http://localhost:9001'
  const apiKey = import.meta.env.VITE_API_KEY
  
  const response = await fetch(`${langgraphUrl}/automation/test/integration`, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })
  return response.json()
}

export const triggerWorkflow = async (data: {
  workflow_type: string
  candidate_id: string
  job_id: string
  trigger_source?: string
}) => {
  const langgraphUrl = import.meta.env.VITE_LANGGRAPH_URL || 'http://localhost:9001'
  const apiKey = import.meta.env.VITE_API_KEY
  
  const response = await fetch(`${langgraphUrl}/automation/workflows/trigger`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ ...data, trigger_source: data.trigger_source || 'frontend' })
  })
  return response.json()
}

export const startApplicationWorkflow = async (data: {
  candidate_id: string
  candidate_name: string
  candidate_email: string
  candidate_phone?: string
  job_id: string
  job_title: string
  company_name: string
}) => {
  const langgraphUrl = import.meta.env.VITE_LANGGRAPH_URL || 'http://localhost:9001'
  const apiKey = import.meta.env.VITE_API_KEY
  
  const response = await fetch(`${langgraphUrl}/automation/workflows/application/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ ...data, application_source: 'frontend' })
  })
  return response.json()
}

export const getWorkflowStatus = async (workflowId: string) => {
  const langgraphUrl = import.meta.env.VITE_LANGGRAPH_URL || 'http://localhost:9001'
  const apiKey = import.meta.env.VITE_API_KEY
  
  const response = await fetch(`${langgraphUrl}/automation/workflows/${workflowId}/status`, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })
  return response.json()
}

export const listWorkflows = async (limit = 10, offset = 0) => {
  const langgraphUrl = import.meta.env.VITE_LANGGRAPH_URL || 'http://localhost:9001'
  const apiKey = import.meta.env.VITE_API_KEY
  
  const response = await fetch(`${langgraphUrl}/automation/workflows?limit=${limit}&offset=${offset}`, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })
  return response.json()
}

// ==================== RL/AI API ====================

export const getRLAnalytics = async () => {
  const langgraphUrl = import.meta.env.VITE_LANGGRAPH_URL || 'http://localhost:9001'
  const apiKey = import.meta.env.VITE_API_KEY
  
  const response = await fetch(`${langgraphUrl}/automation/rl/analytics`, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  })
  return response.json()
}

export const getRLPrediction = async (data: {
  candidate_id: string
  job_id: string
  features: {
    skills: string[]
    experience_years: number
    education_level: string
    skill_match_score: number
  }
}) => {
  const langgraphUrl = import.meta.env.VITE_LANGGRAPH_URL || 'http://localhost:9001'
  const apiKey = import.meta.env.VITE_API_KEY
  
  const response = await fetch(`${langgraphUrl}/automation/rl/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(data)
  })
  return response.json()
}
```

---

### 4.2 Workflow History Page Component

Create new file: `frontend/src/pages/recruiter/WorkflowHistory.tsx`

```typescript
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { listWorkflows, getWorkflowStatus } from '../../services/api'

interface Workflow {
  workflow_id: string
  workflow_type: string
  status: string
  candidate_name?: string
  job_title?: string
  created_at: string
  updated_at?: string
}

export default function WorkflowHistory() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [workflowDetails, setWorkflowDetails] = useState<any>(null)

  useEffect(() => {
    loadWorkflows()
  }, [])

  const loadWorkflows = async () => {
    setLoading(true)
    try {
      const data = await listWorkflows(20, 0)
      setWorkflows(data.workflows || [])
    } catch (error) {
      toast.error('Failed to load workflow history')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const viewWorkflowDetails = async (workflow: Workflow) => {
    setSelectedWorkflow(workflow)
    try {
      const details = await getWorkflowStatus(workflow.workflow_id)
      setWorkflowDetails(details)
    } catch (error) {
      toast.error('Failed to load workflow details')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'completed_with_warnings': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getWorkflowIcon = (type: string) => {
    switch (type) {
      case 'application_received':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'interview_scheduled':
        return (
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      case 'offer_extended':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/5 to-indigo-500/5 dark:from-purple-500/10 dark:to-indigo-500/10 backdrop-blur-xl border border-purple-300/20 dark:border-purple-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">📊 Workflow History</h1>
            <p className="text-gray-600 dark:text-gray-400">Track all automation workflows and their status</p>
          </div>
          <button
            onClick={loadWorkflows}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{workflows.length}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Workflows</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-green-600">{workflows.filter(w => w.status === 'completed').length}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-blue-600">{workflows.filter(w => w.status === 'in_progress').length}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">In Progress</div>
        </div>
        <div className="card p-4">
          <div className="text-2xl font-bold text-red-600">{workflows.filter(w => w.status === 'failed').length}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Failed</div>
        </div>
      </div>

      {/* Workflow List */}
      <div className="card">
        <h2 className="section-title mb-4">Recent Workflows</h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : workflows.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No workflows found. Workflows are created when candidates apply or status changes.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Candidate</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Job</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Created</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {workflows.map((workflow) => (
                  <tr key={workflow.workflow_id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getWorkflowIcon(workflow.workflow_type)}
                        <span className="text-sm text-gray-900 dark:text-white capitalize">
                          {workflow.workflow_type.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                      {workflow.candidate_name || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                      {workflow.job_title || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                        {workflow.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(workflow.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => viewWorkflowDetails(workflow)}
                        className="text-purple-600 hover:text-purple-700 dark:text-purple-400 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Workflow Details Modal */}
      {selectedWorkflow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Workflow Details</h3>
                <button
                  onClick={() => {
                    setSelectedWorkflow(null)
                    setWorkflowDetails(null)
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Workflow ID</label>
                  <p className="font-mono text-sm text-gray-900 dark:text-white">{selectedWorkflow.workflow_id}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Status</label>
                  <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedWorkflow.status)}`}>
                    {selectedWorkflow.status}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Type</label>
                  <p className="text-gray-900 dark:text-white capitalize">{selectedWorkflow.workflow_type.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">Created</label>
                  <p className="text-gray-900 dark:text-white">{new Date(selectedWorkflow.created_at).toLocaleString()}</p>
                </div>
              </div>
              
              {workflowDetails && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Execution Details</h4>
                  <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-x-auto">
                    {JSON.stringify(workflowDetails, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

---

### 4.3 AI Analytics Component

Create new file: `frontend/src/pages/recruiter/AIAnalytics.tsx`

```typescript
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getRLAnalytics } from '../../services/api'

interface Analytics {
  total_predictions: number
  total_feedback: number
  feedback_rate: number
  accuracy: number
  model_performance: {
    precision: number
    recall: number
    f1_score: number
  }
  recent_decisions: {
    shortlist: number
    reject: number
    interview: number
  }
}

export default function AIAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const data = await getRLAnalytics()
      setAnalytics(data)
    } catch (error) {
      toast.error('Failed to load AI analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 dark:from-blue-500/10 dark:to-cyan-500/10 backdrop-blur-xl border border-blue-300/20 dark:border-blue-500/20">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">🤖 AI Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Machine learning model performance and predictions</p>
      </div>

      {analytics && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{analytics.total_predictions}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Predictions</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-3xl font-bold text-green-600">{(analytics.accuracy * 100).toFixed(1)}%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Accuracy</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">{analytics.feedback_rate.toFixed(1)}%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Feedback Rate</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-3xl font-bold text-cyan-600">{analytics.total_feedback}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Feedback</div>
            </div>
          </div>

          {/* Model Performance */}
          <div className="card">
            <h2 className="section-title mb-4">Model Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(analytics.model_performance.precision * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Precision</div>
                <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${analytics.model_performance.precision * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(analytics.model_performance.recall * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Recall</div>
                <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${analytics.model_performance.recall * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(analytics.model_performance.f1_score * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">F1 Score</div>
                <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${analytics.model_performance.f1_score * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Decisions */}
          <div className="card">
            <h2 className="section-title mb-4">Recent Decision Distribution</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <span className="text-green-700 dark:text-green-400 font-medium">Shortlisted</span>
                  <span className="text-2xl font-bold text-green-600">{analytics.recent_decisions.shortlist}</span>
                </div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700 dark:text-blue-400 font-medium">Interview</span>
                  <span className="text-2xl font-bold text-blue-600">{analytics.recent_decisions.interview}</span>
                </div>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between">
                  <span className="text-red-700 dark:text-red-400 font-medium">Rejected</span>
                  <span className="text-2xl font-bold text-red-600">{analytics.recent_decisions.reject}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
```

---

## Section 5: Route and Navigation Updates

### 5.1 Add Routes (App.tsx or routes.tsx)

```typescript
// Add imports
import WorkflowHistory from './pages/recruiter/WorkflowHistory'
import AIAnalytics from './pages/recruiter/AIAnalytics'

// Add routes inside recruiter section
<Route path="workflow-history" element={<WorkflowHistory />} />
<Route path="ai-analytics" element={<AIAnalytics />} />
```

### 5.2 Update Sidebar Navigation (RecruiterSidebar.tsx)

```typescript
// Add new menu items
{
  title: 'Workflow History',
  path: '/recruiter/workflow-history',
  icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  )
},
{
  title: 'AI Analytics',
  path: '/recruiter/ai-analytics',
  icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}
```

---

## Section 6: UI/UX Integration Design

### 6.1 Where Features Appear in the Application

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         RECRUITER DASHBOARD                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │   Jobs (12)     │  │  Candidates(89) │  │  Interviews(5)  │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
│                                                                              │
│  Quick Actions: [Automation] [Batch Ops] [NEW: Workflows] [NEW: AI Insights]│
└─────────────────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  AUTOMATION   │    │   WORKFLOW    │    │  AI ANALYTICS │
│    PANEL      │    │   HISTORY     │    │   DASHBOARD   │
│               │    │               │    │               │
│ • Test Email  │    │ • List All    │    │ • Accuracy    │
│ • Test WA     │    │ • View Status │    │ • Precision   │
│ • Triggers    │    │ • Timeline    │    │ • Predictions │
│               │    │               │    │               │
│ [NEW: Service │    │ [NEW: Filter  │    │ [NEW: Get AI  │
│  Info Card]   │    │  by Status]   │    │  Suggestion]  │
└───────────────┘    └───────────────┘    └───────────────┘
```

### 6.2 User Journey: Viewing AI Prediction for a Candidate

```
Step 1: Recruiter views candidate profile
        └→ Candidate Details Page

Step 2: System automatically calls /automation/rl/predict
        └→ Sends candidate skills, experience, job requirements

Step 3: AI returns recommendation
        └→ Display badge: "AI Recommendation: Shortlist (85% confidence)"

Step 4: Recruiter can accept or override AI suggestion
        └→ Feedback sent to /automation/rl/feedback to improve model
```

### 6.3 User Journey: Workflow Automation

```
Step 1: Candidate applies to job
        └→ System calls /automation/workflows/application/start

Step 2: Workflow created with ID
        └→ Confirmation email auto-sent to candidate
        └→ Recruiter notification queued

Step 3: Recruiter checks Workflow History page
        └→ Sees workflow status: "in_progress" or "completed"

Step 4: Click "View Details" for full execution log
        └→ Modal shows all steps completed, timestamps, any errors
```

### 6.4 Enhanced AutomationPanel with Service Info

Add to existing AutomationPanel.tsx:

```typescript
// Add service info section after status check
const [serviceInfo, setServiceInfo] = useState<any>(null)

// Add to checkServiceStatus function:
try {
  const info = await getServiceInfo()
  setServiceInfo(info)
}

// Add UI section:
{serviceInfo && (
  <div className="card mt-4">
    <h2 className="section-title mb-4">Service Details</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-lg font-bold text-gray-900 dark:text-white">
          {serviceInfo.endpoints_available}
        </div>
        <div className="text-xs text-gray-500">Endpoints</div>
      </div>
      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-lg font-bold text-gray-900 dark:text-white">
          v{serviceInfo.version}
        </div>
        <div className="text-xs text-gray-500">Version</div>
      </div>
      {Object.entries(serviceInfo.active_components || {}).map(([key, value]) => (
        <div key={key} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className={`text-lg font-bold ${value ? 'text-green-600' : 'text-red-600'}`}>
            {value ? '✓' : '✗'}
          </div>
          <div className="text-xs text-gray-500 capitalize">{key.replace(/_/g, ' ')}</div>
        </div>
      ))}
    </div>
  </div>
)}
```

---

## Section 7: Impact on User Experience

### 7.1 Before vs After

| Feature | Before | After |
|---------|--------|-------|
| **Service Monitoring** | Only health status | Detailed component status, version, endpoint count |
| **Workflow Visibility** | No visibility | Full history with filtering, status tracking, details modal |
| **AI Insights** | Hidden | Dedicated analytics dashboard with accuracy, predictions |
| **Candidate Screening** | Manual only | AI-assisted recommendations with confidence scores |
| **Automation Triggers** | Limited | Event-driven workflows with full tracking |

### 7.2 Benefits

1. **Transparency**: Recruiters can see exactly what automation is doing
2. **Debugging**: Easy to track failed workflows and identify issues
3. **AI Trust**: Visible accuracy metrics build confidence in AI recommendations
4. **Efficiency**: Automated workflows reduce manual tasks
5. **Audit Trail**: Complete history for compliance and review

### 7.3 Performance Considerations

- Workflow list should lazy-load with pagination
- AI predictions should be cached per candidate-job pair
- Service status should refresh every 30 seconds, not continuously
- Use React Query or SWR for efficient data fetching

---

## Section 8: Implementation Checklist

### Phase 1: API Service Layer (1-2 hours)
- [ ] Add new functions to `api.ts`
- [ ] Add TypeScript interfaces

### Phase 2: Workflow History Page (2-3 hours)
- [ ] Create `WorkflowHistory.tsx`
- [ ] Add route in `App.tsx`
- [ ] Add sidebar navigation

### Phase 3: AI Analytics Page (2-3 hours)
- [ ] Create `AIAnalytics.tsx`
- [ ] Add route in `App.tsx`
- [ ] Add sidebar navigation

### Phase 4: Enhanced Automation Panel (1-2 hours)
- [ ] Add service info section
- [ ] Add integration test button
- [ ] Improve status display

### Phase 5: Candidate AI Predictions (3-4 hours)
- [ ] Add AI prediction to candidate detail page
- [ ] Create prediction badge component
- [ ] Add feedback mechanism

### Phase 6: Testing & Polish (2-3 hours)
- [ ] Test all new features
- [ ] Add loading states
- [ ] Handle error cases
- [ ] Mobile responsiveness

**Total Estimated Time: 12-17 hours**

---

## Appendix: Quick Reference

### Environment Variables Required
```env
VITE_LANGGRAPH_URL=http://localhost:9001
VITE_API_KEY=prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o
```

### Endpoints Quick Reference
```
Health:     GET  /health
Info:       GET  /automation/info
Test:       GET  /automation/test/integration
Send:       POST /automation/notifications/send
Bulk:       POST /automation/notifications/bulk
Sequence:   POST /automation/test/sequence
Trigger:    POST /automation/workflows/trigger
Start:      POST /automation/workflows/application/start
Status:     GET  /automation/workflows/{id}/status
List:       GET  /automation/workflows
Analytics:  GET  /automation/rl/analytics
Predict:    POST /automation/rl/predict
```

---

*Document Version: 1.0 | Generated: February 28, 2026*
