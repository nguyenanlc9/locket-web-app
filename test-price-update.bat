@echo off
echo Testing price update functionality...

echo.
echo 1. Testing API endpoint...
curl -s "http://localhost:3000/api/payment-config"

echo.
echo 2. Testing admin price update...
curl -s -X POST "http://localhost:3000/api/admin/payment-config" -H "Content-Type: application/json" -d "{\"adminKey\":\"admin123\",\"productPrice\":50000}"

echo.
echo 3. Testing API again to see updated price...
curl -s "http://localhost:3000/api/payment-config"

echo.
echo 4. Check if server is running...
netstat -an | findstr :3000

pause
