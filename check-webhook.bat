@echo off
echo Checking Telegram webhook status...

set /p BOT_TOKEN="Enter your bot token: "

echo.
echo 1. Getting webhook info...
curl -s "https://api.telegram.org/bot%BOT_TOKEN%/getWebhookInfo"

echo.
echo 2. Testing bot with getMe...
curl -s "https://api.telegram.org/bot%BOT_TOKEN%/getMe"

echo.
echo 3. If webhook is not set, run setup-webhook.bat
echo 4. If webhook is set but not working, check your server logs

pause
