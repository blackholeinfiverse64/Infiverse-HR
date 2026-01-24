# Client Portal Service

Streamlit-based portal for external clients to post jobs, review candidates, and manage interviews in the BHIV HR Platform.

---

## Overview
Allows enterprise clients to securely post jobs, review AI-matched candidates, and coordinate interviews. Integrates with backend via secure API and JWT authentication.

## Key Features
- **Enterprise Authentication:** JWT-secured login and session management
- **Job Posting:** Create, edit, and manage job listings
- **Candidate Review:** View and shortlist AI-matched candidates
- **Interview Coordination:** Schedule and manage interviews
- **Real-Time Sync:** Instant updates with HR and candidate portals

## Architecture
```
client_portal/
├── app.py           # Streamlit UI
├── auth_manager.py  # Authentication logic
├── config.py        # Configuration
└── requirements.txt # Dependencies
```

## Security & Environment
- JWT tokens for secure sessions
- API keys and secrets loaded from environment variables

## Local Development
```bash
cd services/client_portal
pip install -r requirements.txt
streamlit run app.py --server.port 8502
```

## Notes
- Demo credentials available for testing
- Integrates with backend and gateway services
