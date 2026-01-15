#!/usr/bin/env python3
"""
Fix the authentication issues in the 111 endpoint test by properly authenticating first
"""

import requests
import json
import time
import os
from datetime import datetime

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

BASE_URLS = {
    "gw": os.getenv("GATEWAY_URL", "http://localhost:8000"),
    "ag": os.getenv("AGENT_URL", "http://localhost:9000"),
    "lg": os.getenv("LANGGRAPH_URL", "http://localhost:9001")
}

# Get the API key from environment
API_KEY = os.getenv("API_KEY_SECRET", "YOUR_API_KEY")

print(f"Using API Key: {API_KEY[:10]}...")  # Show only first 10 chars for security

results = []

def test(name, method, url, headers=None, data=None, exp=200):
    try:
        start = time.time()
        r = requests.request(method, url, headers=headers, json=data, timeout=30)
        t = time.time() - start
        ok = r.status_code == exp
        results.append({"name": name, "ok": ok, "time": f"{t:.2f}s", "code": r.status_code})
        return ok, f"{'PASS' if ok else 'FAIL'} {r.status_code}", t
    except Exception as e:
        results.append({"name": name, "ok": False, "time": "ERR", "code": 0})
        return False, f"FAIL ERR", 0

def get_auth_headers(token_type="api_key"):
    """Get proper authentication headers based on token type"""
    if token_type == "api_key":
        return {"Authorization": f"Bearer {API_KEY}"}
    return {}

def run():
    gw, ag, lg = BASE_URLS["gw"], BASE_URLS["ag"], BASE_URLS["lg"]
    
    print(f"\n{'='*80}\nBHIV HR Platform - Fixed Authentication Test Suite\n{'='*80}\n")
    
    # First, test public endpoints that don't require authentication
    public_tests = [
        # GW Core (5)
        ("GW-Root", "GET", f"{gw}/", None, None, 200),
        ("GW-Health", "GET", f"{gw}/health", None, None, 200),
        ("GW-OpenAPI", "GET", f"{gw}/openapi.json", None, None, 200),
        ("GW-Docs", "GET", f"{gw}/docs", None, None, 200),
        ("GW-ListJobs", "GET", f"{gw}/v1/jobs", None, None, 200),  # This is public endpoint
        
        # Agent and LangGraph health checks
        ("AG-Root", "GET", f"{ag}/", None, None, 200),
        ("AG-Health", "GET", f"{ag}/health", None, None, 200),
        ("LG-Root", "GET", f"{lg}/", None, None, 200),
        ("LG-Health", "GET", f"{lg}/health", None, None, 200),
        
        # Public password endpoints
        ("GW-ValidatePassword", "POST", f"{gw}/v1/password/validate", None, {"password":"Test123!"}, 200),
        ("GW-GeneratePassword", "GET", f"{gw}/v1/password/generate", None, None, 200),
        ("GW-PasswordPolicy", "GET", f"{gw}/v1/password/policy", None, None, 200),
        ("GW-PasswordStrength", "POST", f"{gw}/v1/password/strength", None, {"password":"test"}, 200),
        ("GW-PasswordTips", "GET", f"{gw}/v1/password/tips", None, None, 200),
    ]
    
    print(f"Testing {len(public_tests)} public endpoints...\n")
    for i, (name, method, url, headers, data, exp) in enumerate(public_tests, 1):
        ok, msg, t = test(name, method, url, headers, data, exp)
        print(f"{i:3d}. {msg} {name:30s} ({t:.2f}s)")
        time.sleep(0.1)
    
    # Now test endpoints that require authentication using API key
    api_key_tests = [
        # GW Core
        ("GW-TestDB", "GET", f"{gw}/v1/test-candidates", get_auth_headers("api_key"), None, 200),
        
        # GW Jobs (require auth for creation)
        ("GW-CreateJob", "POST", f"{gw}/v1/jobs", get_auth_headers("api_key"), {"title":"Test","department":"Eng","location":"Remote","experience_level":"senior","requirements":"Python","description":"Test"}, 200),
        
        # GW Candidates
        ("GW-ListCandidates", "GET", f"{gw}/v1/candidates", get_auth_headers("api_key"), None, 200),
        ("GW-CandidateStats", "GET", f"{gw}/v1/candidates/stats", get_auth_headers("api_key"), None, 200),
        ("GW-SearchCandidates", "GET", f"{gw}/v1/candidates/search?skills=Python", get_auth_headers("api_key"), None, 200),
        
        # GW Analytics
        ("GW-Schema", "GET", f"{gw}/v1/analytics/schema", get_auth_headers("api_key"), None, 200),
        ("GW-Export", "GET", f"{gw}/v1/analytics/export", get_auth_headers("api_key"), None, 200),
        
        # GW AI Matching
        ("GW-TopMatches", "GET", f"{gw}/v1/match/1/top", get_auth_headers("api_key"), None, 200),
        ("GW-BatchMatch", "POST", f"{gw}/v1/match/batch", get_auth_headers("api_key"), {"job_ids":[1,2]}, 200),
        
        # GW Assessment
        ("GW-SubmitFeedback", "POST", f"{gw}/v1/feedback", get_auth_headers("api_key"), {"candidate_id":1,"job_id":1,"integrity":5,"honesty":5,"discipline":4,"hard_work":5,"gratitude":4}, 200),
        ("GW-GetFeedback", "GET", f"{gw}/v1/feedback", get_auth_headers("api_key"), None, 200),
        ("GW-ListInterviews", "GET", f"{gw}/v1/interviews", get_auth_headers("api_key"), None, 200),
        ("GW-ScheduleInterview", "POST", f"{gw}/v1/interviews", get_auth_headers("api_key"), {"candidate_id":1,"job_id":1,"interview_date":"2025-12-20T10:00:00Z"}, 201),
        ("GW-CreateOffer", "POST", f"{gw}/v1/offers", get_auth_headers("api_key"), {"candidate_id":1,"job_id":1,"salary":100000,"start_date":"2026-01-15","terms":"Full-time"}, 201),
        ("GW-ListOffers", "GET", f"{gw}/v1/offers", get_auth_headers("api_key"), None, 200),
        
        # GW Security
        ("GW-RateLimitStatus", "GET", f"{gw}/v1/security/rate-limit-status", get_auth_headers("api_key"), None, 200),
        ("GW-BlockedIPs", "GET", f"{gw}/v1/security/blocked-ips", get_auth_headers("api_key"), None, 200),
        ("GW-TestInputValidation", "POST", f"{gw}/v1/security/test-input-validation", get_auth_headers("api_key"), {"input_data":"test"}, 200),
        ("GW-ValidateEmail", "POST", f"{gw}/v1/security/validate-email", get_auth_headers("api_key"), {"email":"test@example.com"}, 200),
        ("GW-ValidatePhone", "POST", f"{gw}/v1/security/validate-phone", get_auth_headers("api_key"), {"phone":"+1234567890"}, 200),
        ("GW-PentestEndpoints", "GET", f"{gw}/v1/security/penetration-test-endpoints", get_auth_headers("api_key"), None, 200),
        
        # GW 2FA
        ("GW-2FASetup", "POST", f"{gw}/v1/auth/2fa/setup", get_auth_headers("api_key"), {"user_id":1}, 200),
        ("GW-2FAVerify", "POST", f"{gw}/v1/auth/2fa/verify", get_auth_headers("api_key"), {"user_id":1,"code":"123456"}, 200),
        ("GW-2FAStatus", "GET", f"{gw}/v1/auth/2fa/status/1", get_auth_headers("api_key"), None, 200),
        ("GW-2FADisable", "POST", f"{gw}/v1/auth/2fa/disable", get_auth_headers("api_key"), {"user_id":1}, 200),
        ("GW-2FATestToken", "POST", f"{gw}/v1/auth/2fa/test-token", get_auth_headers("api_key"), {"token":"test"}, 200),
        
        # GW Password (some require auth)
        ("GW-ChangePassword", "POST", f"{gw}/v1/password/change", get_auth_headers("api_key"), {"old":"test","new":"test"}, 200),
        
        # GW AI Integration
        ("GW-TestAICommunication", "GET", f"{gw}/v1/ai/test-communication", get_auth_headers("api_key"), None, 200),
        ("GW-GeminiAnalyze", "POST", f"{gw}/v1/ai/gemini/analyze", get_auth_headers("api_key"), {"text":"test"}, 200),
        
        # GW Workflows
        ("GW-TriggerWorkflow", "POST", f"{gw}/api/v1/workflow/trigger", get_auth_headers("api_key"), {"workflow_type":"candidate_application","candidate_id":1,"job_id":1}, 200),
        ("GW-WorkflowStatus", "GET", f"{gw}/api/v1/workflow/status/wf_test", get_auth_headers("api_key"), None, 200),
        ("GW-ListWorkflows", "GET", f"{gw}/api/v1/workflows", get_auth_headers("api_key"), None, 200),
        ("GW-WorkflowStats", "GET", f"{gw}/api/v1/workflow/stats", get_auth_headers("api_key"), None, 200),
        ("GW-ResumeWorkflow", "POST", f"{gw}/api/v1/workflow/resume/wf_test", get_auth_headers("api_key"), None, 200),
        ("GW-CancelWorkflow", "POST", f"{gw}/api/v1/workflow/cancel/wf_test", get_auth_headers("api_key"), None, 200),
        ("GW-WorkflowHistory", "GET", f"{gw}/api/v1/workflow/history/1", get_auth_headers("api_key"), None, 200),
        
        # GW RL
        ("GW-RLPredict", "POST", f"{gw}/v1/rl/predict", get_auth_headers("api_key"), {"candidate_id":1,"job_id":1}, 200),
        ("GW-RLFeedback", "POST", f"{gw}/v1/rl/feedback", get_auth_headers("api_key"), {"prediction_id":1,"actual_outcome":"hired","feedback_score":5.0}, 200),
        ("GW-RLAnalytics", "GET", f"{gw}/v1/rl/analytics", get_auth_headers("api_key"), None, 200),
        ("GW-RLPerformance", "GET", f"{gw}/v1/rl/performance", get_auth_headers("api_key"), None, 200),
        
        # GW Monitoring
        ("GW-Metrics", "GET", f"{gw}/metrics", None, None, 200),
        ("GW-MetricsDashboard", "GET", f"{gw}/metrics/dashboard", None, None, 200),
        ("GW-HealthDetailed", "GET", f"{gw}/health/detailed", None, None, 200),
        
        # Agent endpoints with API key
        ("AG-TestDB", "GET", f"{ag}/test-db", get_auth_headers("api_key"), None, 200),
        ("AG-Match", "POST", f"{ag}/match", get_auth_headers("api_key"), {"job_id":1}, 200),
        ("AG-BatchMatch", "POST", f"{ag}/batch-match", get_auth_headers("api_key"), {"job_ids":[1,2]}, 200),
        ("AG-Analyze", "GET", f"{ag}/analyze/1", get_auth_headers("api_key"), None, 200),
        
        # LangGraph endpoints with API key
        ("LG-StartWorkflow", "POST", f"{lg}/workflows/application/start", get_auth_headers("api_key"), {"candidate_id":1,"job_id":1}, 200),
        ("LG-ResumeWorkflow", "POST", f"{lg}/workflows/wf_test/resume", get_auth_headers("api_key"), None, 200),
        ("LG-WorkflowStatus", "GET", f"{lg}/workflows/wf_test/status", get_auth_headers("api_key"), None, 200),
        ("LG-ListWorkflows", "GET", f"{lg}/workflows", get_auth_headers("api_key"), None, 200),
        ("LG-WorkflowStats", "GET", f"{lg}/workflows/stats", get_auth_headers("api_key"), None, 200),
        
        # LangGraph Communication with API key
        ("LG-SendNotification", "POST", f"{lg}/tools/send-notification", get_auth_headers("api_key"), {"channel":"email","to":"test@ex.com","message":"Test"}, 200),
        ("LG-TestEmail", "POST", f"{lg}/test/send-email", get_auth_headers("api_key"), {"to":"test@ex.com","subject":"Test","body":"Test"}, 200),
        ("LG-TestWhatsApp", "POST", f"{lg}/test/send-whatsapp", get_auth_headers("api_key"), {"to":"+1234567890","message":"Test"}, 200),
        ("LG-TestTelegram", "POST", f"{lg}/test/send-telegram", get_auth_headers("api_key"), {"chat_id":"123","message":"Test"}, 200),
        ("LG-TestWhatsAppButtons", "POST", f"{lg}/test/send-whatsapp-buttons", get_auth_headers("api_key"), {"to":"+1234567890","message":"Test","buttons":["Yes","No"]}, 200),
        ("LG-TestAutomatedSequence", "POST", f"{lg}/test/send-automated-sequence", get_auth_headers("api_key"), {"candidate_id":1,"job_id":1}, 200),
        ("LG-TriggerWorkflow", "POST", f"{lg}/automation/trigger-workflow", get_auth_headers("api_key"), {"workflow_type":"candidate_application","candidate_id":1}, 200),
        ("LG-BulkNotifications", "POST", f"{lg}/automation/bulk-notifications", get_auth_headers("api_key"), {"candidate_ids":[1,2],"message":"Test"}, 200),
        ("LG-WhatsAppWebhook", "POST", f"{lg}/webhook/whatsapp", get_auth_headers("api_key"), {"test":"data"}, 200),
        
        # LangGraph RL with API key
        ("LG-RLPredict", "POST", f"{lg}/rl/predict", get_auth_headers("api_key"), {"candidate_id":1,"job_id":1,"features":{}}, 200),
        ("LG-RLFeedback", "POST", f"{lg}/rl/feedback", get_auth_headers("api_key"), {"prediction_id":1,"actual_outcome":"hired","feedback_score":5.0}, 200),
        ("LG-RLAnalytics", "GET", f"{lg}/rl/analytics", get_auth_headers("api_key"), None, 200),
        ("LG-RLPerformanceByVersion", "GET", f"{lg}/rl/performance/v1.0.0", get_auth_headers("api_key"), None, 200),
        ("LG-RLHistory", "GET", f"{lg}/rl/history/1", get_auth_headers("api_key"), None, 200),
        ("LG-RLRetrain", "POST", f"{lg}/rl/retrain", get_auth_headers("api_key"), None, 200),
        ("LG-RLPerformance", "GET", f"{lg}/rl/performance", get_auth_headers("api_key"), None, 200),
        ("LG-RLStartMonitoring", "POST", f"{lg}/rl/start-monitoring", get_auth_headers("api_key"), None, 200),
        ("LG-TestIntegration", "GET", f"{lg}/test-integration", get_auth_headers("api_key"), None, 200),
    ]
    
    print(f"\nTesting {len(api_key_tests)} endpoints with API key authentication...\n")
    for i, (name, method, url, headers, data, exp) in enumerate(api_key_tests, len(public_tests)+1):
        ok, msg, t = test(name, method, url, headers, data, exp)
        print(f"{i:3d}. {msg} {name:30s} ({t:.2f}s)")
        time.sleep(0.1)
    
    # Test client portal login and get JWT token
    print(f"\nTesting client portal authentication...\n")
    client_login_test = [
        ("GW-ClientLogin", "POST", f"{gw}/v1/client/login", None, {"client_id":"TECH001","password":"demo123"}, 200),
    ]
    
    for i, (name, method, url, headers, data, exp) in enumerate(client_login_test, len(public_tests)+len(api_key_tests)+1):
        ok, msg, t = test(name, method, url, headers, data, exp)
        print(f"{i:3d}. {msg} {name:30s} ({t:.2f}s)")
        time.sleep(0.1)
    
    # Test candidate portal registration and login
    print(f"\nTesting candidate portal authentication...\n")
    candidate_tests = [
        ("GW-CandidateRegister", "POST", f"{gw}/v1/candidate/register", None, {"name":"Test","email":"test@register.com","password":"Test123!"}, 201),
        ("GW-CandidateLogin", "POST", f"{gw}/v1/candidate/login", None, {"email":"test@register.com","password":"Test123!"}, 200),
    ]
    
    for i, (name, method, url, headers, data, exp) in enumerate(candidate_tests, len(public_tests)+len(api_key_tests)+len(client_login_test)+1):
        ok, msg, t = test(name, method, url, headers, data, exp)
        print(f"{i:3d}. {msg} {name:30s} ({t:.2f}s)")
        time.sleep(0.1)
    
    total = len(results)
    passed = sum(1 for r in results if r["ok"])
    print(f"\n{'='*80}\nRESULTS: {passed}/{total} passed ({passed/total*100:.1f}%)\n{'='*80}\n")
    
    with open("fixed_test_results.json", "w") as f:
        json.dump({"timestamp": datetime.now().isoformat(), "total": total, "passed": passed, "results": results}, f, indent=2)
    print("Report saved: fixed_test_results.json\n")

if __name__ == "__main__":
    print(f"\nBHIV HR Platform - Fixed Authentication Test Suite\nStarted: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    run()
    print(f"Completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")