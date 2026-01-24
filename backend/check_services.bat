@echo off
echo ========================================
echo 🔍 BHIV HR Platform - Service Health Check
echo ========================================
echo.

echo Checking all services...
echo.

REM Check Gateway Service
echo 🌐 Gateway Service (Port 8000):
curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Running
) else (
    echo ❌ Not responding
)

REM Check Agent Service
echo 🤖 AI Agent Service (Port 9000):
curl -s http://localhost:9000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Running
) else (
    echo ❌ Not responding
)

REM Check LangGraph Service
echo 🔄 LangGraph Service (Port 9001):
curl -s http://localhost:9001/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Running
) else (
    echo ❌ Not responding
)

REM Check HR Portal
echo 🏢 HR Portal (Port 8501):
curl -s http://localhost:8501 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Running
) else (
    echo ❌ Not responding
)

REM Check Client Portal
echo 👥 Client Portal (Port 8502):
curl -s http://localhost:8502 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Running
) else (
    echo ❌ Not responding
)

REM Check Candidate Portal
echo 📝 Candidate Portal (Port 8503):
curl -s http://localhost:8503 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Running
) else (
    echo ❌ Not responding
)

echo.
echo 🌐 Quick Access URLs:
echo ├── HR Portal:        http://localhost:8501
echo ├── Client Portal:    http://localhost:8502
echo ├── Candidate Portal: http://localhost:8503
echo ├── Gateway API:      http://localhost:8000/docs
echo ├── Agent API:        http://localhost:9000/docs
echo └── LangGraph API:    http://localhost:9001/docs
echo.
echo 🔑 Demo Login: TECH001 / demo123
echo.
pause