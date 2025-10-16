@echo off
echo Testing order creation and Telegram notification...

echo.
echo 1. Creating test order...
curl -s -X POST "http://localhost:3000/api/orders" -H "Content-Type: application/json" -d "{\"customer\":{\"fullName\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"0901234567\"},\"items\":[{\"id\":\"locket-gold\",\"name\":\"Locket Gold Key\",\"price\":30000,\"downloads\":1}],\"paymentMethod\":\"vietqr\",\"total\":30000}"

echo.
echo 2. Check server logs for Telegram notification...
echo If you see "✅ New order notification sent" in server logs, Telegram is working.

echo.
echo 3. Check if Telegram config exists...
curl -s "http://localhost:3000/api/admin/telegram-config?adminKey=admin123"

echo.
echo 4. Test Telegram directly...
curl -s -X POST "http://localhost:3000/api/admin/test-telegram" -H "Content-Type: application/json" -d "{\"adminKey\":\"admin123\"}"

pause
