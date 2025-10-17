@echo off
echo Stopping old PM2 processes...
pm2 delete all

echo Starting server with correct path...
cd /d "C:\Users\Admin\OneDrive\Máy tính\locketweb"
pm2 start server/server.js --name "locketweb-server"

echo Server restarted successfully!
pm2 list
