@echo off
echo 🛑 Stopping EcoVerse Environmental Dashboard...
echo.

echo 🔄 Stopping all Node.js processes...
taskkill /f /im node.exe 2>nul

echo 🔄 Cleaning up PowerShell jobs...
powershell -Command "Get-Job | Stop-Job; Get-Job | Remove-Job" 2>nul

echo.
echo ✅ EcoVerse Dashboard stopped successfully!
echo.
echo 💡 All servers and processes have been terminated.
echo    You can now safely close this window.
echo.
pause