# 🚀 Quick Start Guide - BHIV HR Platform

This guide will help you run the complete HR platform project.

## ✅ Prerequisites Check

Before starting, ensure you have:
- ✅ Python 3.12+ installed
- ✅ Node.js 18+ installed
- ✅ MongoDB Atlas connection (configured in `run_services.py`)

## 📦 Setup (Already Done!)

The project has been set up with:
- ✅ Backend virtual environment created
- ✅ Backend dependencies installed
- ✅ Frontend dependencies installed

## 🎯 Running the Project

### Option 1: Run Everything (Recommended)

**Windows Batch Script:**
```bash
run_project.bat
```

**PowerShell Script:**
```powershell
.\run_project.ps1
```

This will start:
- Backend services (Gateway, Agent, LangGraph)
- Frontend (React app)

### Option 2: Run Services Separately

#### Backend Only

**Windows PowerShell:**
```powershell
cd backend
.\run_with_venv.bat
```

**Or manually in PowerShell:**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python run_services.py
```

**Windows CMD:**
```cmd
cd backend
run_with_venv.bat
```

This starts:
- **Gateway**: http://localhost:8000 (API docs: http://localhost:8000/docs)
- **Agent**: http://localhost:9000 (API docs: http://localhost:9000/docs)
- **LangGraph**: http://localhost:9001 (API docs: http://localhost:9001/docs)

#### Frontend Only

```bash
cd frontend
npm run dev
```

Frontend will be available at: **http://localhost:3000**

## 🌐 Service URLs

Once running, access:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main web application |
| **Gateway API** | http://localhost:8000 | Main API gateway |
| **Gateway Docs** | http://localhost:8000/docs | API documentation |
| **Agent API** | http://localhost:9000 | AI matching service |
| **Agent Docs** | http://localhost:9000/docs | Agent API docs |
| **LangGraph API** | http://localhost:9001 | Workflow automation |
| **LangGraph Docs** | http://localhost:9001/docs | LangGraph API docs |

## 🔍 Verify Services Are Running

### Check Backend Health

Open PowerShell and run:
```powershell
# Gateway
Invoke-WebRequest -Uri http://localhost:8000/health

# Agent
Invoke-WebRequest -Uri http://localhost:9000/health

# LangGraph
Invoke-WebRequest -Uri http://localhost:9001/health
```

### Check Frontend

Simply open http://localhost:3000 in your browser.

## 🛑 Stopping Services

- **Backend**: Press `Ctrl+C` in the terminal running backend services
- **Frontend**: Press `Ctrl+C` in the terminal running frontend
- **Both**: Close both terminal windows

## 📝 Notes

1. **MongoDB**: The backend uses MongoDB Atlas. Connection details are in `backend/run_services.py`
2. **Environment Variables**: If you need to customize, create a `.env` file in the `backend` directory
3. **Port Conflicts**: If ports 8000, 9000, 9001, or 3000 are in use, you'll need to stop those services first

## 🐛 Troubleshooting

### Port Already in Use

**Windows:**
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Backend Not Starting

1. Check if virtual environment is activated
2. Verify dependencies are installed: `pip list`
3. Check MongoDB connection in `run_services.py`

### Frontend Not Starting

1. Verify Node.js is installed: `node --version`
2. Reinstall dependencies: `cd frontend && npm install`
3. Clear cache: `npm cache clean --force`

## 📚 More Information

- **Backend Documentation**: `backend/README.md`
- **Frontend Documentation**: `frontend/README.md`
- **API Documentation**: http://localhost:8000/docs (when backend is running)

---

**Happy Coding! 🎉**

