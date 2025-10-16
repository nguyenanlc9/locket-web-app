@echo off
echo Testing complete system...

echo.
echo 1. Testing server status...
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
powershell -Command "try { $result = Invoke-RestMethod -Uri 'http://localhost:3000/api/payment-config'; Write-Host 'Payment config loaded successfully' } catch { Write-Host 'Error:' $_.Exception.Message }"

echo.
echo 3. Testing Telegram config...
powershell -Command "try { $result = Invoke-RestMethod -Uri 'http://localhost:3000/api/admin/telegram-config?adminKey=admin123'; Write-Host 'Telegram config loaded' } catch { Write-Host 'Error:' $_.Exception.Message }"

echo.
echo 4. Creating test order...
powershell -Command "try { $orderData = @{ customer = @{ fullName = 'Test User'; email = 'test@example.com'; phone = '0901234567' }; items = @( @{ id = 'locket-gold'; name = 'Locket Gold Key'; price = 30000; downloads = 1 } ); paymentMethod = 'vietqr'; total = 30000 } | ConvertTo-Json -Depth 10; $result = Invoke-RestMethod -Uri 'http://localhost:3000/api/orders' -Method POST -ContentType 'application/json' -Body $orderData; Write-Host 'Order created:' $result.orderId } catch { Write-Host 'Error:' $_.Exception.Message }"

echo.
echo 5. Check server logs for:
echo    - "📤 Sending Telegram notification"
echo    - "✅ New order notification sent"
echo    - Any error messages

echo.
echo 6. Test admin confirmation...
set /p ORDER_ID="Enter order ID to confirm: "
powershell -Command "try { $body = @{ adminKey = 'admin123'; orderId = '%ORDER_ID%' } | ConvertTo-Json; $result = Invoke-RestMethod -Uri 'http://localhost:3000/api/admin/confirm-order' -Method POST -ContentType 'application/json' -Body $body; Write-Host 'Confirmation result:'; $result | ConvertTo-Json } catch { Write-Host 'Error:' $_.Exception.Message }"

echo.
echo 7. Check for Telegram notifications:
echo    - New order notification
echo    - Confirmation success notification

pause
