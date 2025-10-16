@echo off
echo Testing Telegram Config API...

echo.
echo 1. Testing with curl...
curl -s "http://localhost:3000/api/admin/telegram-config?adminKey=admin123"

echo.
echo 2. Testing with PowerShell...
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/admin/telegram-config?adminKey=admin123' -Method Get; $response | ConvertTo-Json } catch { Write-Host 'Error:' $_.Exception.Message }"

echo.
echo 3. Testing server status...
netstat -an | findstr :3000

pause
