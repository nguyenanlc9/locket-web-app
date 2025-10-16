@echo off
echo Checking if server is running...
netstat -an | findstr :3000
if %ERRORLEVEL% == 0 (
    echo Server is running on port 3000
) else (
    echo Server is NOT running on port 3000
)

echo.
echo Testing API endpoint...
curl -s "http://localhost:3000/api/admin/telegram-config?adminKey=admin123" || echo "API call failed"

echo.
echo Checking server logs...
cd /d "%USERPROFILE%\web"
if exist "server.js" (
    echo Server.js exists
    node --check server.js
    if %ERRORLEVEL% == 0 (
        echo Server.js syntax is OK
    ) else (
        echo Server.js has syntax errors
    )
) else (
    echo Server.js not found in %USERPROFILE%\web\
)

pause
