@echo off
echo Setting up Telegram webhook...

set /p BOT_TOKEN="Enter your bot token: "
set /p DOMAIN="Enter your domain (e.g., https://yourdomain.com): "

set WEBHOOK_URL=%DOMAIN%/api/telegram/callback

echo.
echo 1. Setting webhook to: %WEBHOOK_URL%
curl -s -X POST "https://api.telegram.org/bot%BOT_TOKEN%/setWebhook" -H "Content-Type: application/json" -d "{\"url\":\"%WEBHOOK_URL%\"}"

echo.
echo 2. Checking webhook info...
curl -s "https://api.telegram.org/bot%BOT_TOKEN%/getWebhookInfo"

echo.
echo 3. Testing webhook with test message...
curl -s -X POST "https://api.telegram.org/bot%BOT_TOKEN%/sendMessage" -H "Content-Type: application/json" -d "{\"chat_id\":\"YOUR_CHAT_ID\",\"text\":\"Webhook test message\"}"

echo.
echo ✅ Webhook setup completed!
echo Make sure your server is running and accessible from the internet.

pause
