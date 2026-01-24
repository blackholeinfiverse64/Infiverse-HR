# Candidate Portal Service

Streamlit-based portal for job seekers to register, search jobs, and manage applications in the BHIV HR Platform.

---

## Overview
Enables candidates to register, manage profiles, search and apply for jobs, and track application status. Integrates with backend via secure API calls.

## Key Features
- **Registration & Login:** Secure account creation and authentication
- **Profile Management:** Edit and update candidate information
- **Job Search:** Browse, filter, and view job details
- **Application Tracking:** Submit and monitor job applications
- **Dashboard:** Overview of applications and activity
- **Resume Upload:** Multi-format file support

## Architecture
```
candidate_portal/
├── app.py           # Streamlit UI
├── config.py        # Configuration
└── requirements.txt # Dependencies
```

## Security & Environment
- Passwords hashed with bcrypt
- API keys and secrets loaded from environment variables

## Local Development
```bash
cd services/candidate_portal
pip install -r requirements.txt
streamlit run app.py --server.port 8503
```

## Notes
- Real-time updates for job postings and application status
- Integrates with backend and gateway services
