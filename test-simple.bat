@echo off
echo Testing simple system...

echo.
echo 1. Check server...
netstat -an | findstr :3000
if %ERRORLEVEL% == 0 (
    echo ✅ Server is running
) else (
    echo ❌ Server not running
    echo Starting server...
    cd /d "%USERPROFILE%\web"
    start /B node server.js
    timeout /t 3 /nobreak >nul
)

echo.
echo 2. Test payment config...
powershell -Command "try { Invoke-RestMethod -Uri 'http://localhost:3000/api/payment-config' } catch { Write-Host 'Error:' $_.Exception.Message }"

echo.
echo 3. Test Telegram config...
powershell -Command "try { Invoke-RestMethod -Uri 'http://localhost:3000/api/admin/telegram-config?adminKey=admin123' } catch { Write-Host 'Error:' $_.Exception.Message }"

echo.
echo 4. Create test order...
powershell -Command "try { $orderData = @{ customer = @{ fullName = 'Test User'; email = 'test@example.com'; phone = '0901234567' }; items = @( @{ id = 'locket-gold'; name = 'Locket Gold Key'; price = 30000; downloads = 1 } ); paymentMethod = 'vietqr'; total = 30000 } | ConvertTo-Json -Depth 10; $result = Invoke-RestMethod -Uri 'http://localhost:3000/api/orders' -Method POST -ContentType 'application/json' -Body $orderData; Write-Host 'Order created:' $result.orderId } catch { Write-Host 'Error:' $_.Exception.Message }"

echo.
echo 5. Check server logs for Telegram notification...

pause
