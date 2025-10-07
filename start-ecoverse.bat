@echo off
echo 🌍 Starting EcoVerse Environmental Dashboard...
echo.

REM Check if we're in the right directory
if not exist "backend\server-new.js" (
    echo ❌ Error: Please run this script from the ecoverse-dashboard directory
    echo Current directory: %CD%
    echo Expected files: backend\server-new.js, frontend\package.json
    pause
    exit /b 1
)

echo ✅ Found project files!
echo.

REM Kill any existing node processes
echo 🛑 Stopping any running Node.js processes...
taskkill /f /im node.exe >nul 2>&1

REM Start backend in a new window
echo 🚀 Starting Backend Server...
start "EcoVerse Backend" cmd /k "cd backend && echo 🌍 Starting EcoVerse Backend Server... && node server-new.js"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in a new window  
echo 🌐 Starting Frontend Server...
start "EcoVerse Frontend" cmd /k "cd frontend && echo 🎨 Starting EcoVerse Frontend... && npm start"

REM Wait a moment then open browser
echo ⏳ Waiting for servers to start...
timeout /t 10 /nobreak >nul

echo 🌐 Opening EcoVerse Dashboard in your browser...
start http://localhost:3000

echo.
echo ✅ EcoVerse Dashboard is starting!
echo.
echo 📋 What's happening:
echo    • Backend Server: http://localhost:5000
echo    • Frontend App: http://localhost:3000  
echo    • Two terminal windows opened for backend and frontend
echo.
echo 💡 To stop: Close the terminal windows or run "taskkill /f /im node.exe"
echo.
pause