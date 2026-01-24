LANGGRAPH  ENDPOINTS: (25 total)



**RL + Feedback Agent:-**

POST/rl/predict; Rl Predict Match



POST/rl/feedback; Submit Rl Feedback



GET/rl/analytics; Get Rl Analytics



GET/rl/performance/{model\_version}; Get Rl Performance



GET/rl/history/{candidate\_id}; Get Candidate Rl History



POST/rl/retrain; Trigger Rl Retrain



GET/rl/performance; Get Rl Performance



POST/rl/start-monitoring; Start Rl Monitoring



**Core API Endpoints:-**

GET/; Read Root



GET/health; Health Check



**Workflow Management:-**

POST/workflows/application/start; Start Application Workflow



POST/workflows/{workflow\_id}/resume; Resume Workflow



**Workflow Monitoring:-**

GET/workflows/{workflow\_id}/status; Get Workflow Status



GET/workflows; List Workflows



GET/workflows/stats; Get Workflow Stats



**Communication Tools:-**

POST/tools/send-notification; Send Notification



POST/test/send-email; Test Send Email



POST/test/send-whatsApp; Test Send Whatsapp



POST/test/send-telegram; Test Send Telegram



POST/test/send-whatsapp-buttons; Test Send Whatsapp Buttons



POST/test/send-automated-sequence; Test Send Automated Sequence



POST/automation/trigger-workflow; Trigger Workflow Automation



POST/automation/bulk-notifications; Send Bulk Notifications



POST/webhook/whatsapp; Whatsapp Webhook



**System Diagnostics:-**

GET/test-integration; Test Integration

