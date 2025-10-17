@echo off
echo Testing Telegram polling fixes...

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
echo 2. Test Telegram configuration...
powershell -Command "try { $result = Invoke-RestMethod -Uri 'http://localhost:3000/api/payment-config'; if ($result.config.telegramConfig.botToken) { Write-Host '✅ Telegram configured' } else { Write-Host '❌ Telegram not configured' } } catch { Write-Host 'Error:' $_.Exception.Message }"

echo.
echo 3. Create test order...
powershell -Command "try { $order = @{ customer = @{ fullName = 'Test User'; email = 'test@example.com'; phone = '0123456789' }; amount = 30000; orderId = 'TEST' + (Get-Date -Format 'yyyyMMddHHmmss') } | ConvertTo-Json -Depth 3; $result = Invoke-RestMethod -Uri 'http://localhost:3000/api/orders' -Method POST -Body $order -ContentType 'application/json'; Write-Host '✅ Test order created:' $result.orderId } catch { Write-Host 'Error:' $_.Exception.Message }"

echo.
echo 4. Check server logs for Telegram polling...
echo Look for these messages in server logs:
echo - "✅ Telegram polling started"
echo - "📱 Processing Telegram callback"
echo - "⚠️ Telegram polling timeout, retrying..." (if network issues)

echo.
echo 5. Test callback handling...
echo Now try clicking Confirm/Reject buttons in Telegram
echo Expected behavior:
echo - If order already paid: "⚠️ Đơn hàng đã được xác nhận rồi!"
echo - If order already cancelled: "⚠️ Đơn hàng đã bị hủy rồi!"
echo - If order pending: Process normally

echo.
echo 6. Check for timeout errors...
echo If you see "ConnectTimeoutError", the server will retry automatically
echo Polling interval increased to 2 seconds with 15-second timeout

pause
