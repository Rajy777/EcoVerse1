#!/usr/bin/env powershell

Write-Host "🌍 Starting EcoVerse Environmental Dashboard..." -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (!(Test-Path "backend\server-new.js") -or !(Test-Path "frontend\package.json")) {
    Write-Host "❌ Error: Please run this script from the ecoverse-dashboard directory" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
    Write-Host "Expected files: backend\server-new.js, frontend\package.json" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Found project files!" -ForegroundColor Green
Write-Host ""

# Kill any existing node processes
Write-Host "🛑 Stopping any running Node.js processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1

# Start backend server in background job
Write-Host "🚀 Starting Backend Server..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock { 
    Set-Location "C:\projects\ecoverse-dashboard\backend"
    node server-new.js 
}

Write-Host "Backend job started with ID: $($backendJob.Id)" -ForegroundColor Gray

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend server in background job  
Write-Host "🌐 Starting Frontend Server..." -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
    Set-Location "C:\projects\ecoverse-dashboard\frontend" 
    npm start
}

Write-Host "Frontend job started with ID: $($frontendJob.Id)" -ForegroundColor Gray

# Wait for servers to start
Write-Host "⏳ Waiting for servers to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Test if backend is responding
try {
    $healthCheck = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -TimeoutSec 5
    Write-Host "✅ Backend is responding!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend may still be starting..." -ForegroundColor Yellow
}

# Open browser
Write-Host "🌐 Opening EcoVerse Dashboard in your browser..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "✅ EcoVerse Dashboard is running!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Server Status:" -ForegroundColor White
Write-Host "   • Backend Server: http://localhost:5000 (Job ID: $($backendJob.Id))" -ForegroundColor Gray
Write-Host "   • Frontend App: http://localhost:3000 (Job ID: $($frontendJob.Id))" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Management Commands:" -ForegroundColor White
Write-Host "   • Check jobs: Get-Job" -ForegroundColor Gray
Write-Host "   • Stop all: Get-Job | Stop-Job; Get-Job | Remove-Job" -ForegroundColor Gray
Write-Host "   • Kill processes: taskkill /f /im node.exe" -ForegroundColor Gray
Write-Host ""

# Keep script running and show job status
Write-Host "🔄 Monitoring servers (Ctrl+C to exit)..." -ForegroundColor Blue
try {
    while ($true) {
        Start-Sleep -Seconds 5
        $jobs = Get-Job
        $runningJobs = $jobs | Where-Object { $_.State -eq "Running" }
        Write-Host "$(Get-Date -Format 'HH:mm:ss') - Running jobs: $($runningJobs.Count)" -ForegroundColor DarkGray
    }
} catch {
    Write-Host ""
    Write-Host "👋 Script interrupted. Servers are still running in background." -ForegroundColor Yellow
    Write-Host "Use 'Get-Job' to check status or 'taskkill /f /im node.exe' to stop all." -ForegroundColor Yellow
}