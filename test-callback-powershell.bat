@echo off
echo Testing Telegram callback with PowerShell...

set /p ORDER_ID="Enter order ID to test: "
set /p CHAT_ID="Enter your chat ID: "

echo.
echo 1. Testing confirm callback...
powershell -Command "try { $body = @{ callback_query = @{ id = 'test123'; from = @{ id = 123456; first_name = 'Test' }; message = @{ message_id = 1; chat = @{ id = %CHAT_ID% } }; data = 'confirm_%ORDER_ID%' } } | ConvertTo-Json -Depth 10; Invoke-RestMethod -Uri 'http://localhost:3000/api/telegram/callback' -Method POST -ContentType 'application/json' -Body $body } catch { Write-Host 'Error:' $_.Exception.Message }"

echo.
echo 2. Testing reject callback...
powershell -Command "try { $body = @{ callback_query = @{ id = 'test456'; from = @{ id = 123456; first_name = 'Test' }; message = @{ message_id = 1; chat = @{ id = %CHAT_ID% } }; data = 'reject_%ORDER_ID%' } } | ConvertTo-Json -Depth 10; Invoke-RestMethod -Uri 'http://localhost:3000/api/telegram/callback' -Method POST -ContentType 'application/json' -Body $body } catch { Write-Host 'Error:' $_.Exception.Message }"

echo.
echo 3. Check server console for callback processing logs...

pause
