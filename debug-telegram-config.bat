@echo off
echo Debugging Telegram configuration...

echo.
echo 1. Checking if server is running...
netstat -an | findstr :3000
if %ERRORLEVEL% == 0 (
    echo ✅ Server is running
) else (
    echo ❌ Server not running, starting...
    cd /d "%USERPROFILE%\web"
    start /B node server.js
    timeout /t 3 /nobreak >nul
)

echo.
echo 2. Testing payment config...
powershell -Command "try { $result = Invoke-RestMethod -Uri 'http://localhost:3000/api/payment-config'; Write-Host 'Payment config loaded successfully' } catch { Write-Host 'Error loading payment config:' $_.Exception.Message }"

echo.
echo 3. Testing admin Telegram config...
powershell -Command "try { $result = Invoke-RestMethod -Uri 'http://localhost:3000/api/admin/telegram-config?adminKey=admin123'; Write-Host 'Telegram config:'; $result | ConvertTo-Json } catch { Write-Host 'Error loading Telegram config:' $_.Exception.Message }"

echo.
echo 4. Testing Telegram test API...
powershell -Command "try { $body = @{ adminKey = 'admin123' } | ConvertTo-Json; Invoke-RestMethod -Uri 'http://localhost:3000/api/admin/test-telegram' -Method POST -ContentType 'application/json' -Body $body } catch { Write-Host 'Error testing Telegram:' $_.Exception.Message }"

echo.
echo 5. Check server console for any errors...

pause
