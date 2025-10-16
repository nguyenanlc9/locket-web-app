@echo off
echo Testing Telegram callback directly...

set /p ORDER_ID="Enter order ID to test: "
set /p CHAT_ID="Enter your chat ID: "

echo.
echo 1. Testing confirm callback...
curl -s -X POST "http://localhost:3000/api/telegram/callback" -H "Content-Type: application/json" -d "{\"callback_query\":{\"id\":\"test123\",\"from\":{\"id\":123456,\"first_name\":\"Test\"},\"message\":{\"message_id\":1,\"chat\":{\"id\":%CHAT_ID%}},\"data\":\"confirm_%ORDER_ID%\"}}"

echo.
echo 2. Testing reject callback...
curl -s -X POST "http://localhost:3000/api/telegram/callback" -H "Content-Type: application/json" -d "{\"callback_query\":{\"id\":\"test456\",\"from\":{\"id\":123456,\"first_name\":\"Test\"},\"message\":{\"message_id\":1,\"chat\":{\"id\":%CHAT_ID%}},\"data\":\"reject_%ORDER_ID%\"}}"

echo.
echo 3. Check server logs for callback processing...
echo Look for: "Order XXX confirmed via Telegram" or "Order XXX rejected"

pause
