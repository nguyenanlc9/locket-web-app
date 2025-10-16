@echo off
echo Testing Telegram callback...

set /p ORDER_ID="Enter order ID to test: "

echo.
echo 1. Testing confirm callback...
curl -s -X POST "http://localhost:3000/api/telegram/callback" -H "Content-Type: application/json" -d "{\"callback_query\":{\"id\":\"test123\",\"from\":{\"id\":123456,\"first_name\":\"Test\"},\"message\":{\"message_id\":1,\"chat\":{\"id\":123456}},\"data\":\"confirm_%ORDER_ID%\"}}"

echo.
echo 2. Testing reject callback...
curl -s -X POST "http://localhost:3000/api/telegram/callback" -H "Content-Type: application/json" -d "{\"callback_query\":{\"id\":\"test456\",\"from\":{\"id\":123456,\"first_name\":\"Test\"},\"message\":{\"message_id\":1,\"chat\":{\"id\":123456}},\"data\":\"reject_%ORDER_ID%\"}}"

echo.
echo 3. Check server logs for callback processing...

pause
