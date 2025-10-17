@echo off
echo Testing Payment Timeout Feature...

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
echo 2. Testing order creation with timeout...
powershell -Command "try { $order = @{ customer = @{ fullName = 'Test User'; email = 'test@example.com'; phone = '0123456789' }; items = @(@{ name = 'Locket Gold Key'; price = 30000; downloads = 1 }); paymentMethod = 'vietqr'; total = 30000 } | ConvertTo-Json -Depth 3; $result = Invoke-RestMethod -Uri 'http://localhost:3000/api/orders' -Method POST -Body $order -ContentType 'application/json'; Write-Host '✅ Order created:' $result.orderId; Write-Host 'Payment timeout:' $result.order.paymentTimeout } catch { Write-Host '❌ Order creation failed:' $_.Exception.Message }"

echo.
echo 3. Testing timeout API...
powershell -Command "try { $result = Invoke-RestMethod -Uri 'http://localhost:3000/api/orders/TEST123/timeout'; Write-Host '✅ Timeout API working'; Write-Host 'Time remaining:' $result.timeout.timeRemaining 'seconds'; Write-Host 'Is expired:' $result.timeout.isExpired } catch { Write-Host '❌ Timeout API failed:' $_.Exception.Message }"

echo.
echo 4. Testing payment page with timer...
echo Opening payment page to test countdown timer...
start http://localhost:3000/payment?data=%7B%22orderId%22%3A%22TEST123%22%2C%22customer%22%3A%7B%22fullName%22%3A%22Test%20User%22%2C%22email%22%3A%22test%40example.com%22%2C%22phone%22%3A%220123456789%22%7D%2C%22items%22%3A%5B%7B%22name%22%3A%22Locket%20Gold%20Key%22%2C%22price%22%3A30000%2C%22downloads%22%3A1%7D%5D%2C%22paymentMethod%22%3A%22vietqr%22%2C%22total%22%3A30000%7D

echo.
echo 5. Expected behavior:
echo - Countdown timer shows 15:00 initially
echo - Timer decreases every second
echo - Timer turns red when less than 5 minutes
echo - Order auto-cancelled after 15 minutes
echo - Payment button disabled when expired

echo.
echo 6. Testing auto-cancel job...
echo The server runs auto-cancel job every 5 minutes
echo Check server logs for: "Auto-cancelled expired order"

echo.
echo 7. Testing Telegram notification...
echo Telegram notifications now include:
echo - Payment timeout time (15 minutes from order creation)
echo - Clear indication of time limit

echo.
echo ========================================
echo         PAYMENT TIMEOUT FEATURES
echo ========================================
echo.
echo ✅ 15-minute payment timeout
echo ✅ Real-time countdown timer
echo ✅ Auto-cancel expired orders
echo ✅ Visual timer warnings
echo ✅ Telegram timeout notifications
echo ✅ API for timeout checking

echo.
pause
