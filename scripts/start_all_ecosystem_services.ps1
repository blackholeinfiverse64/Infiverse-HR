# BHIV Ecosystem — start all local services (Windows PowerShell)
# Run from repo root: .\scripts\start_all_ecosystem_services.ps1
#
# One-shot launcher for all ecosystem services. Prerequisites:
#   - Partner .env files configured
#   - InsightFlow: run .\scripts\setup_insightflow_postgres.ps1 once (persistent Postgres)

$Root = Split-Path $PSScriptRoot -Parent
$Py = Join-Path $Root "backend\venv\Scripts\python.exe"
$Uvicorn = Join-Path $Root "backend\venv\Scripts\uvicorn.exe"
$Npm = "npm"

function Test-PortListening($Port) {
    try {
        return (Test-NetConnection -ComputerName 127.0.0.1 -Port $Port -WarningAction SilentlyContinue).TcpTestSucceeded
    } catch { return $false }
}

function Start-ServiceWindow($Title, $WorkDir, $Command) {
    Write-Host "Starting $Title ..."
    Start-Process powershell -ArgumentList @(
        "-NoExit", "-Command",
        "cd '$WorkDir'; `$Host.UI.RawUI.WindowTitle='$Title'; $Command"
    ) | Out-Null
}

# InsightFlow needs PostgreSQL Windows service on :5432
if (-not (Test-PortListening 5432)) {
    Write-Host "PostgreSQL not on :5432 - run setup first (needs PGPASSWORD once):"
    Write-Host "  `$env:PGPASSWORD = '<postgres-superuser-password>'; .\scripts\setup_insightflow_postgres.ps1"
    Write-Host ""
}

# Sampada
Start-ServiceWindow "Sampada Gateway :8000" (Join-Path $Root "backend\services\gateway") "& '$Uvicorn' app.main:app --host 0.0.0.0 --port 8000 --reload"
Start-ServiceWindow "Sampada Frontend :5173" (Join-Path $Root "frontend") "$Npm run dev"

# Partners (ports chosen to avoid collisions)
# Clear inherited Sampada shell env so each repo's .env wins (dotenv does not override by default)
Start-ServiceWindow "Artha :5000" (Join-Path $Root "Artha\backend") "Remove-Item Env:MONGODB_URI,Env:DATABASE_URL -ErrorAction SilentlyContinue; `$env:PORT=5000; $Npm start"
Start-ServiceWindow "Niyantran :5001" (Join-Path $Root "workflow-blackhole\server") "Remove-Item Env:MONGODB_URI,Env:DATABASE_URL -ErrorAction SilentlyContinue; `$env:PORT=5001; $Npm start"
Start-ServiceWindow "ai-crm Node :8002" (Join-Path $Root "ai-crm\backend-nodejs") "Remove-Item Env:MONGODB_URI,Env:DATABASE_URL -ErrorAction SilentlyContinue; `$env:PORT=8002; $Npm start"
# Isolate from Sampada backend/.env DATABASE_URL (Mongo) — ai-crm Python uses SQLAlchemy + SQLite locally
Start-ServiceWindow "ai-crm Python :8001" (Join-Path $Root "ai-crm\backend") "Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue; & '$Py' crm_api.py"
Start-ServiceWindow "Bucket :8010" (Join-Path $Root "bucket") "Remove-Item Env:MONGODB_URI,Env:DATABASE_URL -ErrorAction SilentlyContinue; `$env:PORT=8010; & '$Uvicorn' main:app --host 0.0.0.0 --port 8010 --reload"
Start-ServiceWindow "InsightFlow :8020" (Join-Path $Root "bhiv-registry\backend") "Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue; & '$Uvicorn' app.main:app --host 0.0.0.0 --port 8020 --reload"
Start-ServiceWindow "Karma :8030" (Join-Path $Root "Karma-Tracker\karma-tracker") "`$env:PORT=8030; & '$Uvicorn' main:app --host 0.0.0.0 --port 8030 --reload"

Write-Host ""
Write-Host "All service windows launched. Port map:"
Write-Host "  8000  Sampada Gateway"
Write-Host "  5173  Sampada Frontend"
Write-Host "  5000  Artha"
Write-Host "  5001  Niyantran"
Write-Host "  8001  ai-crm Python"
Write-Host "  8002  ai-crm Node"
Write-Host "  8010  Bucket"
Write-Host "  8020  InsightFlow (bhiv-registry)"
Write-Host "  8030  Karma"
Write-Host ""
Write-Host "Ensure MongoDB/Atlas URIs are set in partner .env files."
Write-Host "InsightFlow Postgres (one-time): .\scripts\setup_insightflow_postgres.ps1"
