@echo off
echo Restarting server with new database location...

echo.
echo 1. Stopping existing server...
taskkill /F /IM node.exe 2>nul || echo "No Node.js processes running"

echo.
echo 2. Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo.
echo 3. Starting server...
cd /d "%USERPROFILE%\web"
node server.js

pause