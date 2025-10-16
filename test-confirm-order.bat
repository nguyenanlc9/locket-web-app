@echo off
echo Testing order confirmation...

set /p ORDER_ID="Enter order ID to confirm: "

echo.
echo 1. Confirming order...
powershell -Command "try { $body = @{ adminKey = 'admin123'; orderId = '%ORDER_ID%' } | ConvertTo-Json; $result = Invoke-RestMethod -Uri 'http://localhost:3000/api/admin/confirm-order' -Method POST -ContentType 'application/json' -Body $body; Write-Host 'Result:'; $result | ConvertTo-Json } catch { Write-Host 'Error:' $_.Exception.Message }"

echo.
echo 2. Check server logs for confirmation processing...

pause
