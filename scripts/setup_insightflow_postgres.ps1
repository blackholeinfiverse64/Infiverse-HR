# InsightFlow - PostgreSQL setup for bhiv-registry (idempotent, data NOT wiped on restart)
# Uses the local PostgreSQL 16 Windows service (persistent data under Program Files).
#
# One-time: set the postgres superuser password from winget install, then run:
#   $env:PGPASSWORD = '<postgres-superuser-password>'
#   .\scripts\setup_insightflow_postgres.ps1
#
# Safe to re-run - only creates role/database if missing.

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent

$DbName = "bhiv_registry"
$DbUser = "bhiv"
$DbPass = "bhiv_secret"
$DbHost = "127.0.0.1"
$DbPort = 5432

function Find-Psql {
    $candidates = @(
        "C:\Program Files\PostgreSQL\16\bin\psql.exe",
        "C:\Program Files\PostgreSQL\15\bin\psql.exe"
    )
    foreach ($p in $candidates) {
        if (Test-Path $p) { return $p }
    }
    return (Get-Command psql -ErrorAction SilentlyContinue).Source
}

function Test-PostgresPort {
    try {
        return (Test-NetConnection -ComputerName $DbHost -Port $DbPort -WarningAction SilentlyContinue).TcpTestSucceeded
    } catch { return $false }
}

Write-Host "InsightFlow PostgreSQL setup (persistent - no data wipe on re-run)"
Write-Host ""

$svc = Get-Service -Name "postgresql-x64-16" -ErrorAction SilentlyContinue
if ($svc -and $svc.Status -ne "Running") {
    Write-Host "Starting PostgreSQL service..."
    Start-Service "postgresql-x64-16"
    Start-Sleep -Seconds 3
}

if (-not (Test-PostgresPort)) {
    Write-Host "PostgreSQL is not listening on port $DbPort."
    Write-Host "Install and start PostgreSQL 16:"
    Write-Host "  winget install PostgreSQL.PostgreSQL.16"
    Write-Host "Then re-run this script."
    exit 1
}

$psql = Find-Psql
if (-not $psql) {
    Write-Host "psql not found. Reinstall PostgreSQL 16."
    exit 1
}

if (-not $env:PGPASSWORD) {
    Write-Host "Set postgres superuser password (from winget installer), then re-run:"
    Write-Host "  `$env:PGPASSWORD = '<postgres-superuser-password>'"
    Write-Host "  .\scripts\setup_insightflow_postgres.ps1"
    exit 1
}

$psqlBase = @("-h", $DbHost, "-p", "$DbPort", "-U", "postgres", "-d", "postgres", "-v", "ON_ERROR_STOP=1")

Write-Host "Testing postgres connection..."
& $psql @psqlBase -c "SELECT 1;" | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Authentication failed. Check PGPASSWORD."
    exit 1
}

Write-Host "Ensuring role '$DbUser'..."
$roleSql = 'DO $$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = ''bhiv'') THEN CREATE ROLE bhiv LOGIN PASSWORD ''bhiv_secret''; END IF; END $$;'
& $psql @psqlBase -c $roleSql

$dbExists = (& $psql @psqlBase -tAc "SELECT 1 FROM pg_database WHERE datname = '$DbName';").Trim()
if ($dbExists -ne "1") {
    Write-Host "Creating database '$DbName'..."
    & $psql @psqlBase -c "CREATE DATABASE $DbName OWNER $DbUser;"
} else {
    Write-Host "Database '$DbName' already exists - keeping existing data."
}

$envFile = Join-Path $Root "bhiv-registry\backend\.env"
$expectedUrl = "postgresql+asyncpg://${DbUser}:${DbPass}@${DbHost}:${DbPort}/${DbName}"
@(
    "DATABASE_URL=$expectedUrl",
    "APP_ENV=development",
    "DEBUG=true",
    "REGISTRY_ID=BHIV-IDU-REGISTRY-V1",
    "TANTRA_ECOSYSTEM_VERSION=V1"
) | Set-Content $envFile

Write-Host ""
Write-Host 'Ready. PostgreSQL data persists in Program Files\PostgreSQL\16\data across restarts.'
Write-Host 'InsightFlow init_db uses create_all only - existing tables are NOT dropped.'
Write-Host "Start all services: .\scripts\start_all_ecosystem_services.ps1"
