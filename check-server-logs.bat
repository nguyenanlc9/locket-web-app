@echo off
echo Checking server logs...

echo.
echo 1. Checking if server is running...
netstat -an | findstr :3000
if %ERRORLEVEL% == 0 (
    echo ✅ Server is running on port 3000
) else (
    echo ❌ Server is NOT running on port 3000
    echo Starting server...
    cd /d "%USERPROFILE%\web"
    start /B node server.js
    timeout /t 3 /nobreak >nul
)

echo.
echo 2. Testing server response...
powershell -Command "try { Invoke-RestMethod -Uri 'http://localhost:3000/api/payment-config' | ConvertTo-Json } catch { Write-Host 'Error:' $_.Exception.Message }"

echo.
echo 3. Check server console for any error messages
echo Look for:
echo - "📤 Sending Telegram notification"
echo - "✅ New order notification sent"
echo - "❌ Error" messages

pause
