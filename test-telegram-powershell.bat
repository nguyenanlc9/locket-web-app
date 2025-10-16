@echo off
echo Testing Telegram with PowerShell...

echo.
echo 1. Testing order creation...
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3000/api/orders' -Method POST -ContentType 'application/json' -Body '{\"customer\":{\"fullName\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"0901234567\"},\"items\":[{\"id\":\"locket-gold\",\"name\":\"Locket Gold Key\",\"price\":30000,\"downloads\":1}],\"paymentMethod\":\"vietqr\",\"total\":30000}'"

echo.
echo 2. Testing payment config API...
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3000/api/payment-config'"

echo.
echo 3. Testing admin Telegram config...
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3000/api/admin/telegram-config?adminKey=admin123'"

echo.
echo 4. Testing Telegram callback...
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3000/api/telegram/callback' -Method POST -ContentType 'application/json' -Body '{\"callback_query\":{\"id\":\"test123\",\"from\":{\"id\":123456,\"first_name\":\"Test\"},\"message\":{\"message_id\":1,\"chat\":{\"id\":123456}},\"data\":\"confirm_TEST123\"}}'"

echo.
echo Check server console for logs!

pause
