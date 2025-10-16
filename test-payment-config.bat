@echo off
echo Testing payment config API...

echo.
echo 1. Testing public API...
curl -s "http://localhost:3000/api/payment-config"

echo.
echo 2. Testing admin API...
curl -s "http://localhost:3000/api/admin/payment-config?adminKey=admin123"

echo.
echo 3. Expected result should show MBBank instead of VietinBank

pause
