@echo off
echo Setting up Telegram webhook...

set /p BOT_TOKEN="Enter your bot token: "
set /p WEBHOOK_URL="Enter your webhook URL (e.g., https://yourdomain.com/api/telegram/callback): "

echo.
echo 1. Setting webhook...
curl -s -X POST "https://api.telegram.org/bot%BOT_TOKEN%/setWebhook" -H "Content-Type: application/json" -d "{\"url\":\"%WEBHOOK_URL%\"}"

echo.
echo 2. Checking webhook info...
curl -s "https://api.telegram.org/bot%BOT_TOKEN%/getWebhookInfo"

echo.
echo 3. Testing webhook...
curl -s -X POST "https://api.telegram.org/bot%BOT_TOKEN%/sendMessage" -H "Content-Type: application/json" -d "{\"chat_id\":\"YOUR_CHAT_ID\",\"text\":\"Webhook setup complete!\"}"

echo.
echo ✅ Webhook setup completed!
echo Make sure your server is running and accessible from the internet.

pause
