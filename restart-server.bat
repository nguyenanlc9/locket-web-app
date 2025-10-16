@echo off
echo Stopping existing Node.js processes...
taskkill /F /IM node.exe 2>nul || echo "No Node.js processes running"

echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo Starting server...
cd /d "%USERPROFILE%\web"
node server.js

pause
