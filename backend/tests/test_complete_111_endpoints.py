#!/usr/bin/env python3
"""BHIV HR Platform - Complete 111 Endpoint Test Suite"""
import requests, json, time, os
from datetime import datetime

import dotenv

# Load environment variables from .env file
dotenv.load_dotenv()

BASE_URLS = {
    "gw": os.getenv("GATEWAY_SERVICE_URL", "http://localhost:8000"),
    "ag": os.getenv("AGENT_SERVICE_URL", "http://localhost:9000"),
    "lg": os.getenv("LANGGRAPH_SERVICE_URL", "http://localhost:9001")
}
API_KEY = os.getenv("API_KEY_SECRET", "prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o")
results = []

def test(name, method, url, headers=None, data=None, exp=200):
    try:
        start = time.time()
        # Use longer timeout for more complex operations
        if "/workflow/" in url or "/match/" in url or "/analyze/" in url:
            timeout_val = 60  # 60 seconds for complex operations
        elif "/ai/" in url or "/gemini/" in url or "/rl/" in url:
            timeout_val = 90  # 90 seconds for AI/ML operations
        else:
            timeout_val = 45  # 45 seconds for regular operations
        r = requests.request(method, url, headers=headers, json=data, timeout=timeout_val)
        t = time.time() - start
        ok = r.status_code == exp
        results.append({"name": name, "ok": ok, "time": f"{t:.2f}s", "code": r.status_code})
        return ok, f"{'PASS' if ok else 'FAIL'} {r.status_code}", t
    except Exception as e:
        results.append({"name": name, "ok": False, "time": "ERR", "code": 0})
        return False, f"FAIL ERR", 0

def run():
    gw, ag, lg = BASE_URLS["gw"], BASE_URLS["ag"], BASE_URLS["lg"]
    # Different authentication headers for different endpoint requirements
    api_key_auth = {"Authorization": f"Bearer {API_KEY}"}
    # Some endpoints may require different auth, we'll use API key as default for protected endpoints
    
    tests = [
        # GW Core (5)
        ("GW-Root", "GET", f"{gw}/", None, None, 200),
        ("GW-Health", "GET", f"{gw}/health", None, None, 200),
        ("GW-OpenAPI", "GET", f"{gw}/openapi.json", None, None, 200),
        ("GW-Docs", "GET", f"{gw}/docs", None, None, 200),
        ("GW-TestDB", "GET", f"{gw}/v1/test-candidates", api_key_auth, None, 200),
        # GW Jobs (2)
        ("GW-CreateJob", "POST", f"{gw}/v1/jobs", api_key_auth, {"title":"Test","department":"Eng","location":"Remote","experience_level":"senior","requirements":"Python","description":"Test"}, 200),
        ("GW-ListJobs", "GET", f"{gw}/v1/jobs", None, None, 200),
        # GW Candidates (6)
        ("GW-ListCandidates", "GET", f"{gw}/v1/candidates", api_key_auth, None, 200),
        ("GW-CandidateStats", "GET", f"{gw}/v1/candidates/stats", api_key_auth, None, 200),
        ("GW-SearchCandidates", "GET", f"{gw}/v1/candidates/search?skills=Python", api_key_auth, None, 200),
        ("GW-CandidatesByJob", "GET", f"{gw}/v1/candidates/job/1", api_key_auth, None, 200),
        ("GW-CandidateByID", "GET", f"{gw}/v1/candidates/1", api_key_auth, None, 200),
        ("GW-BulkUpload", "POST", f"{gw}/v1/candidates/bulk", api_key_auth, {"candidates":[{"name":"Test","email":"test@ex.com"}]}, 200),
        # GW Analytics & Statistics (2)
        ("GW-DatabaseSchema", "GET", f"{gw}/v1/database/schema", api_key_auth, None, 200),
        ("GW-ExportJobReport", "GET", f"{gw}/v1/reports/job/1/export.csv", api_key_auth, None, 200),
        # GW AI Matching (2)
        ("GW-TopMatches", "GET", f"{gw}/v1/match/1/top", api_key_auth, None, 200),
        ("GW-BatchMatch", "POST", f"{gw}/v1/match/batch", api_key_auth, {"job_ids":["1"]}, 200),
        # GW Assessment & Workflow (6)
        ("GW-SubmitFeedback", "POST", f"{gw}/v1/feedback", api_key_auth, {"candidate_id":"1","job_id":"1","integrity":5,"honesty":5,"discipline":4,"hard_work":5,"gratitude":4}, 200),
        ("GW-GetFeedback", "GET", f"{gw}/v1/feedback", api_key_auth, None, 200),
        ("GW-ListInterviews", "GET", f"{gw}/v1/interviews", api_key_auth, None, 200),
        ("GW-ScheduleInterview", "POST", f"{gw}/v1/interviews", api_key_auth, {"candidate_id":"1","job_id":"1","interview_date":"2025-12-20T10:00:00Z"}, 200),
        ("GW-CreateOffer", "POST", f"{gw}/v1/offers", api_key_auth, {"candidate_id":"1","job_id":"1","salary":100000,"start_date":"2026-01-15","terms":"Full-time"}, 200),
        ("GW-ListOffers", "GET", f"{gw}/v1/offers", api_key_auth, None, 200),
        # GW Client Portal (2)
        ("GW-ClientRegister", "POST", f"{gw}/v1/client/register", None, {"client_id":"test123","company_name":"Test","contact_email":"test@example.com","password":"Test123!"}, 200),
        ("GW-ClientLogin", "POST", f"{gw}/v1/client/login", None, {"client_id":"test123","password":"Test123!"}, 200),
        # GW Security Testing (12)
        ("GW-RateLimitStatus", "GET", f"{gw}/v1/security/rate-limit-status", api_key_auth, None, 200),
        ("GW-BlockedIPs", "GET", f"{gw}/v1/security/blocked-ips", api_key_auth, None, 200),
        ("GW-TestInputValidation", "POST", f"{gw}/v1/security/test-input-validation", api_key_auth, {"input_data":"test"}, 200),
        ("GW-ValidateEmail", "POST", f"{gw}/v1/security/validate-email", api_key_auth, {"email":"test@example.com"}, 200),
        ("GW-TestEmailValidation", "POST", f"{gw}/v1/security/test-email-validation", api_key_auth, {"email":"test@example.com"}, 200),
        ("GW-ValidatePhone", "POST", f"{gw}/v1/security/validate-phone", api_key_auth, {"phone":"9876543210"}, 200),
        ("GW-TestPhoneValidation", "POST", f"{gw}/v1/security/test-phone-validation", api_key_auth, {"phone":"9876543210"}, 200),
        ("GW-SecurityHeaders", "GET", f"{gw}/v1/security/test-headers", api_key_auth, None, 200),
        ("GW-PentestEndpoints", "GET", f"{gw}/v1/security/penetration-test-endpoints", api_key_auth, None, 200),
        ("GW-PenetrationTest", "POST", f"{gw}/v1/security/penetration-test", api_key_auth, {"test_type":"sql_injection","payload":"test"}, 200),
        ("GW-TestAuth", "GET", f"{gw}/v1/security/test-auth", api_key_auth, None, 200),
        ("GW-SecurityHeadersLegacy", "GET", f"{gw}/v1/security/security-headers-test", api_key_auth, None, 200),
        # GW CSP Management (4)
        ("GW-CSPReport", "POST", f"{gw}/v1/security/csp-report", api_key_auth, {"violated_directive":"script-src","blocked_uri":"https://evil.com","document_uri":"https://bhiv.com"}, 200),
        ("GW-CSPViolations", "GET", f"{gw}/v1/security/csp-violations", api_key_auth, None, 200),
        ("GW-CSPPolicies", "GET", f"{gw}/v1/security/csp-policies", api_key_auth, None, 200),
        ("GW-TestCSPPolicy", "POST", f"{gw}/v1/security/test-csp-policy", api_key_auth, {"policy":"default-src 'self'"}, 200),
        # GW Two-Factor Authentication (8)
        ("GW-2FASetup", "POST", f"{gw}/v1/auth/2fa/setup", api_key_auth, {"user_id":"test_user"}, 200),
        ("GW-2FAVerify", "POST", f"{gw}/v1/auth/2fa/verify", api_key_auth, {"user_id":"test_user","totp_code":"123456"}, 401),
        ("GW-2FALogin", "POST", f"{gw}/v1/auth/2fa/login", api_key_auth, {"user_id":"test_user","totp_code":"123456"}, 401),
        ("GW-2FAStatus", "GET", f"{gw}/v1/auth/2fa/status/test_user", api_key_auth, None, 200),
        ("GW-2FADisable", "POST", f"{gw}/v1/auth/2fa/disable", api_key_auth, {"user_id":"test_user"}, 200),
        ("GW-2FABackupCodes", "POST", f"{gw}/v1/auth/2fa/backup-codes", api_key_auth, {"user_id":"test_user"}, 200),
        ("GW-2FATestToken", "POST", f"{gw}/v1/auth/2fa/test-token", api_key_auth, {"user_id":"test_user","totp_code":"123456"}, 401),
        ("GW-2FAQRCODE", "GET", f"{gw}/v1/auth/2fa/qr/test_user", api_key_auth, None, 200),
        # GW Password Management (6)
        ("GW-ValidatePassword", "POST", f"{gw}/v1/auth/password/validate", api_key_auth, {"password":"TestPass123!"}, 200),
        ("GW-GeneratePassword", "GET", f"{gw}/v1/auth/password/generate", api_key_auth, None, 200),
        ("GW-PasswordPolicy", "GET", f"{gw}/v1/auth/password/policy", api_key_auth, None, 200),
        ("GW-ChangePassword", "POST", f"{gw}/v1/auth/password/change", api_key_auth, {"old_password":"old_pass","new_password":"new_pass"}, 200),
        ("GW-PasswordStrength", "POST", f"{gw}/v1/auth/password/strength", api_key_auth, {"password":"TestPass123!"}, 200),
        ("GW-SecurityTips", "GET", f"{gw}/v1/auth/password/security-tips", api_key_auth, None, 200),
        # GW Candidate Portal (5)
        ("GW-CandidateRegister", "POST", f"{gw}/v1/candidate/register", None, {"name":"Test","email":"test@ex.com","password":"Test123!","phone":"9876543210","location":"Test City"}, 200),
        ("GW-CandidateLogin", "POST", f"{gw}/v1/candidate/login", None, {"email":"test@ex.com","password":"Test123!"}, 200),
        ("GW-UpdateCandidateProfile", "PUT", f"{gw}/v1/candidate/profile/1", api_key_auth, {"name":"Updated Name"}, 200),
        ("GW-CandidateApply", "POST", f"{gw}/v1/candidate/apply", api_key_auth, {"candidate_id":"1","job_id":"1","cover_letter":"Cover letter"}, 200),
        ("GW-CandidateApplications", "GET", f"{gw}/v1/candidate/applications/1", api_key_auth, None, 200),
        # GW Auth Routes (4) - These are from the routes/auth.py
        ("GW-AuthSetup2FA", "POST", f"{gw}/auth/2fa/setup", api_key_auth, {"user_id":"test_user"}, 200),
        ("GW-AuthVerify2FA", "POST", f"{gw}/auth/2fa/verify", api_key_auth, {"user_id":"test_user","totp_code":"123456"}, 401),
        ("GW-AuthLogin", "POST", f"{gw}/auth/login", None, {"username":"admin","password":"admin123","totp_code":"123456"}, 200),
        ("GW-Auth2FAStatus", "GET", f"{gw}/auth/2fa/status/test_user", api_key_auth, None, 200),
        # GW AI Integration (2)
        ("GW-TestAICommunication", "POST", f"{gw}/api/v1/test-communication", api_key_auth, {"channel":"email"}, 200),
        ("GW-GeminiAnalyze", "POST", f"{gw}/api/v1/gemini/analyze", api_key_auth, {"text":"test"}, 200),
        # GW LangGraph Workflows (8)
        ("GW-TriggerWorkflow", "POST", f"{gw}/api/v1/workflow/trigger", api_key_auth, {"candidate_id":"1","job_id":"1","candidate_name":"Test","candidate_email":"test@ex.com","job_title":"Test Job"}, 200),
        ("GW-WorkflowStatus", "GET", f"{gw}/api/v1/workflow/status/test_wf", api_key_auth, None, 200),
        ("GW-ListWorkflows", "GET", f"{gw}/api/v1/workflow/list", api_key_auth, None, 200),
        ("GW-WorkflowHealth", "GET", f"{gw}/api/v1/workflow/health", api_key_auth, None, 200),
        ("GW-WebhookCandidateApplied", "POST", f"{gw}/api/v1/webhooks/candidate-applied", api_key_auth, {"candidate_id":"1","job_id":"1","candidate_name":"Test","candidate_email":"test@ex.com","job_title":"Test Job"}, 200),
        ("GW-WebhookCandidateShortlisted", "POST", f"{gw}/api/v1/webhooks/candidate-shortlisted", api_key_auth, {"candidate_id":"1","job_id":"1","candidate_name":"Test","candidate_email":"test@ex.com","job_title":"Test Job"}, 200),
        ("GW-WebhookInterviewScheduled", "POST", f"{gw}/api/v1/webhooks/interview-scheduled", api_key_auth, {"candidate_id":"1","job_id":"1","candidate_name":"Test","candidate_email":"test@ex.com","job_title":"Test Job"}, 200),
        ("GW-WorkflowList", "GET", f"{gw}/api/v1/workflows", api_key_auth, None, 200),
        # GW RL Routes (4)
        ("GW-RLPredict", "POST", f"{gw}/api/v1/rl/predict", api_key_auth, {"candidate_id":"1","job_id":"1"}, 200),
        ("GW-RLFeedback", "POST", f"{gw}/api/v1/rl/feedback", api_key_auth, {"candidate_id":"1","job_id":"1","actual_outcome":"hired","feedback_score":5.0}, 200),
        ("GW-RLAnalytics", "GET", f"{gw}/api/v1/rl/analytics", api_key_auth, None, 200),
        ("GW-RLPerformance", "GET", f"{gw}/api/v1/rl/performance", api_key_auth, None, 200),
        # GW Monitoring (3)
        ("GW-Metrics", "GET", f"{gw}/metrics", None, None, 200),
        ("GW-MetricsDashboard", "GET", f"{gw}/metrics/dashboard", None, None, 200),
        ("GW-HealthDetailed", "GET", f"{gw}/health/detailed", None, None, 200),
        # Agent (6)
        ("AG-Root", "GET", f"{ag}/", None, None, 200),
        ("AG-Health", "GET", f"{ag}/health", None, None, 200),
        ("AG-TestDB", "GET", f"{ag}/test-db", api_key_auth, None, 200),
        ("AG-Match", "POST", f"{ag}/match", api_key_auth, {"job_id":"1"}, 200),
        ("AG-BatchMatch", "POST", f"{ag}/batch-match", api_key_auth, {"job_ids":["1"]}, 200),
        ("AG-Analyze", "GET", f"{ag}/analyze/1", api_key_auth, None, 200),
        # LangGraph Core (2)
        ("LG-Root", "GET", f"{lg}/", None, None, 200),
        ("LG-Health", "GET", f"{lg}/health", None, None, 200),
        # LangGraph Workflows (5)
        ("LG-StartWorkflow", "POST", f"{lg}/workflows/application/start", api_key_auth, {"candidate_id":"1","job_id":"1","application_id":"1","candidate_email":"test@example.com","candidate_phone":"9876543210","candidate_name":"Test","job_title":"Test Job"}, 200),
        ("LG-ResumeWorkflow", "POST", f"{lg}/workflows/test_wf/resume", api_key_auth, None, 200),
        ("LG-WorkflowStatus", "GET", f"{lg}/workflows/test_wf/status", api_key_auth, None, 200),
        ("LG-ListWorkflows", "GET", f"{lg}/workflows", api_key_auth, None, 200),
        ("LG-WorkflowStats", "GET", f"{lg}/workflows/stats", api_key_auth, None, 200),
        # LangGraph Communication (9)
        ("LG-SendNotification", "POST", f"{lg}/tools/send-notification", api_key_auth, {"candidate_id":"1","candidate_name":"Test","candidate_email":"test@example.com","job_title":"Test Job","message":"Test message","channels":["email"]}, 200),
        ("LG-TestEmail", "POST", f"{lg}/test/send-email", api_key_auth, None, 200),
        ("LG-TestWhatsApp", "POST", f"{lg}/test/send-whatsapp", api_key_auth, None, 200),
        ("LG-TestTelegram", "POST", f"{lg}/test/send-telegram", api_key_auth, None, 200),
        ("LG-TestWhatsAppButtons", "POST", f"{lg}/test/send-whatsapp-buttons", api_key_auth, None, 200),
        ("LG-TestAutomatedSequence", "POST", f"{lg}/test/send-automated-sequence", api_key_auth, None, 200),
        ("LG-TriggerWorkflowAutomation", "POST", f"{lg}/automation/trigger-workflow", api_key_auth, {"event_type":"test","payload":{}}, 200),
        ("LG-BulkNotifications", "POST", f"{lg}/automation/bulk-notifications", api_key_auth, {"candidates":[{}],"sequence_type":"test","job_data":{}}, 200),
        ("LG-WhatsAppWebhook", "POST", f"{lg}/webhook/whatsapp", api_key_auth, {}, 200),
        # LangGraph RL (8)
        ("LG-RLPredict", "POST", f"{lg}/rl/predict", api_key_auth, {"candidate_id":"1","job_id":"1","candidate_features":{},"job_features":{}}, 200),
        ("LG-RLFeedback", "POST", f"{lg}/rl/feedback", api_key_auth, {"candidate_id":"1","job_id":"1","actual_outcome":"hired","feedback_score":5.0}, 200),
        ("LG-RLAnalytics", "GET", f"{lg}/rl/analytics", api_key_auth, None, 200),
        ("LG-RLPerformanceByVersion", "GET", f"{lg}/rl/performance/v1.0.0", api_key_auth, None, 200),
        ("LG-RLHistory", "GET", f"{lg}/rl/history/1", api_key_auth, None, 200),
        ("LG-RLRetrain", "POST", f"{lg}/rl/retrain", api_key_auth, None, 200),
        ("LG-RLPerformance", "GET", f"{lg}/rl/performance", api_key_auth, None, 200),
        ("LG-RLStartMonitoring", "POST", f"{lg}/rl/start-monitoring", api_key_auth, None, 200),
        # LangGraph Integration (1)
        ("LG-TestIntegration", "GET", f"{lg}/test-integration", api_key_auth, None, 200),
    ]
    
    print(f"\n{'='*80}\nBHIV HR Platform - Testing {len(tests)} Endpoints\n{'='*80}\n")
    for i, (name, method, url, headers, data, exp) in enumerate(tests, 1):
        ok, msg, t = test(name, method, url, headers, data, exp)
        print(f"{i:3d}. {msg} {name:30s} ({t:.2f}s)")
        # Add appropriate delays based on endpoint type
        if "/workflow/" in url or "/match/" in url or "/analyze/" in url or "/ai/" in url or "/gemini/" in url or "/rl/" in url:
            time.sleep(2)  # 2 seconds delay for complex operations
        elif "/test/" in url or "/health/" in url:
            time.sleep(0.5)  # 0.5 seconds for simple test endpoints
        else:
            time.sleep(1)  # 1 second delay for regular operations
    
    total = len(results)
    passed = sum(1 for r in results if r["ok"])
    print(f"\n{'='*80}\nRESULTS: {passed}/{total} passed ({passed/total*100:.1f}%)\n{'='*80}\n")
    
    with open("test_results.json", "w") as f:
        json.dump({"timestamp": datetime.now().isoformat(), "total": total, "passed": passed, "results": results}, f, indent=2)
    print("Report saved: test_results.json\n")

if __name__ == "__main__":
    print(f"\nBHIV HR Platform - Complete Endpoint Test Suite\nStarted: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    run()
    print(f"Completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
