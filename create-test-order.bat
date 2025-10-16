@echo off
echo Creating test order and checking logs...

echo.
echo 1. Creating test order...
powershell -Command "try { $orderData = @{ customer = @{ fullName = 'Nguyen Huynh Tuong An'; email = 'test@example.com'; phone = '0901234567' }; items = @( @{ id = 'locket-gold'; name = 'Locket Gold Key'; price = 35000; downloads = 1 } ); paymentMethod = 'vietqr'; total = 35000 } | ConvertTo-Json -Depth 10; $result = Invoke-RestMethod -Uri 'http://localhost:3000/api/orders' -Method POST -ContentType 'application/json' -Body $orderData; Write-Host 'Order created successfully:'; $result | ConvertTo-Json } catch { Write-Host 'Error creating order:' $_.Exception.Message }"

echo.
echo 2. Check server console for these logs:
echo - "📤 Sending Telegram notification for order XXX"
echo - "✅ New order notification sent" or "❌ Error sending notification"
echo - Any error messages

echo.
echo 3. If you see "📤 Sending Telegram notification" but no success message,
echo    check your Telegram bot token and chat ID in admin panel

pause
