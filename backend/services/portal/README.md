# HR Portal Service

Streamlit-based internal dashboard for HR teams to manage candidates, jobs, and AI-powered matching in the BHIV HR Platform.

---

## Overview
Centralized HR dashboard for managing candidates, posting jobs, running AI-powered matching, and tracking analytics. Integrates with backend and gateway for real-time data.

## Key Features
- **Dashboard:** Real-time metrics and analytics
- **Candidate Search:** Advanced filtering and AI matching
- **Job Management:** Create, edit, and manage job postings
- **Values Assessment:** 5-point BHIV values evaluation
- **Batch Upload:** Secure candidate data import
- **Security:** File validation, path traversal protection, and 2FA

## Architecture
```
portal/
├── app.py           # Streamlit UI
├── batch_upload.py  # Batch processing
├── config.py        # Configuration
├── file_security.py # File security
├── components/      # UI components
└── requirements.txt # Dependencies
```

## Security & Environment
- 2FA integration (QR code generation)
- API keys and secrets loaded from environment variables

## Local Development
```bash
cd services/portal
pip install -r requirements.txt
streamlit run app.py --server.port 8501
```

## Notes
- Real-time data from Gateway API
- Optimized Streamlit components for performance
