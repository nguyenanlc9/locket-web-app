@echo off
echo Testing Telegram notification with full customer info...

echo.
echo 1. Creating test order with full customer info...
curl -s -X POST "http://localhost:3000/api/orders" -H "Content-Type: application/json" -d "{\"customer\":{\"fullName\":\"Nguyen Huynh Tuong An\",\"email\":\"test@example.com\",\"phone\":\"0901234567\"},\"items\":[{\"id\":\"locket-gold\",\"name\":\"Locket Gold Key\",\"price\":35000,\"downloads\":1}],\"paymentMethod\":\"vietqr\",\"total\":35000}"

echo.
echo 2. Check Telegram for notification with:
echo    - Customer name: Nguyen Huynh Tuong An
echo    - Email: test@example.com  
echo    - Phone: 0901234567
echo    - IP Address: (should show client IP)

echo.
echo 3. Check server logs for notification sending...

pause
