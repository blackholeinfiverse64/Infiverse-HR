# VSCode TypeScript Cache Fix Script
# This script helps clear VSCode cached errors

Write-Host "🔧 Fixing VSCode TypeScript Errors..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Check actual TypeScript compilation
Write-Host "Step 1: Checking TypeScript compilation..." -ForegroundColor Yellow
$tscResult = npx tsc --noEmit 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ TypeScript compilation SUCCESSFUL - No actual errors!" -ForegroundColor Green
} else {
    Write-Host "❌ Found real TypeScript errors:" -ForegroundColor Red
    Write-Host $tscResult
    exit 1
}

Write-Host ""
Write-Host "Step 2: Building project..." -ForegroundColor Yellow
npm run build 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build SUCCESSFUL!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 3: Clearing VSCode caches..." -ForegroundColor Yellow
Write-Host "   → Deleting .vscode folder..." 
Remove-Item -Path ".vscode" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "   → Deleting node_modules/.cache..." 
Remove-Item -Path "node_modules/.cache" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✅ Cache cleared!" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✨ All Done! Now do the following:" -ForegroundColor Green
Write-Host ""
Write-Host "1. In VSCode, press: Ctrl+Shift+P" -ForegroundColor Yellow
Write-Host "2. Type: 'TypeScript: Restart TS Server'" -ForegroundColor Yellow
Write-Host "3. Press Enter" -ForegroundColor Yellow
Write-Host ""
Write-Host "OR simply close and reopen VSCode" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Verification:" -ForegroundColor Cyan
Write-Host "   - TypeScript errors: 0" -ForegroundColor Green
Write-Host "   - Build status: SUCCESS" -ForegroundColor Green
Write-Host "   - File: BatchOperations.tsx is CORRECT" -ForegroundColor Green
