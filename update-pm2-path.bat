@echo off
echo ========================================
echo Updating PM2 to VPS Path
echo ========================================

echo Step 1: Stopping current PM2 processes...
pm2 delete all

echo Step 2: Starting server from VPS path...
cd "C:\actions-runner\_work\locket-web-app\locket-web-app"
pm2 start server/server.js --name "locketweb-server"

echo Step 3: Saving PM2 configuration...
pm2 save

echo ========================================
echo Server Status:
pm2 list

echo ========================================
echo Server is now running from VPS path!
echo Path: C:\actions-runner\_work\locket-web-app\locket-web-app
echo Access: http://localhost:3000
echo ========================================
