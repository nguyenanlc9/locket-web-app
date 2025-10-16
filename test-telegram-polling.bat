@echo off
echo Testing Telegram polling...

echo.
echo 1. Check server status...
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
echo 2. Test Telegram config...
powershell -Command "try { $result = Invoke-RestMethod -Uri 'http://localhost:3000/api/admin/telegram-config?adminKey=admin123'; Write-Host 'Telegram config:'; $result | ConvertTo-Json } catch { Write-Host 'Error:' $_.Exception.Message }"

echo.
echo 3. Create test order to trigger Telegram notification...
powershell -Command "try { $orderData = @{ customer = @{ fullName = 'Test User'; email = 'test@example.com'; phone = '0901234567' }; items = @( @{ id = 'locket-gold'; name = 'Locket Gold Key'; price = 30000; downloads = 1 } ); paymentMethod = 'vietqr'; total = 30000 } | ConvertTo-Json -Depth 10; $result = Invoke-RestMethod -Uri 'http://localhost:3000/api/orders' -Method POST -ContentType 'application/json' -Body $orderData; Write-Host 'Order created:' $result.orderId } catch { Write-Host 'Error:' $_.Exception.Message }"

echo.
echo 4. Check server logs for:
echo    - "✅ Telegram polling started"
echo    - "📱 Processing Telegram callback"
echo    - "✅ Processing confirm for order"
echo    - "❌ Processing reject for order"

echo.
echo 5. Now try clicking the buttons in Telegram and watch the logs!

pause
