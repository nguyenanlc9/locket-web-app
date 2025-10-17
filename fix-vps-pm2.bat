@echo off
echo ========================================
echo Fixing PM2 Server Path on VPS
echo ========================================

echo Step 1: Stopping all PM2 processes...
pm2 delete all

echo Step 2: Changing to correct directory...
cd /d "C:\Users\Admin\OneDrive\Máy tính\locketweb"

echo Step 3: Starting server with correct path...
pm2 start server/server.js --name "locketweb-server" --cwd "C:\Users\Admin\OneDrive\Máy tính\locketweb"

echo Step 4: Saving PM2 configuration...
pm2 save

echo Step 5: Setting PM2 to start on boot...
pm2 startup

echo ========================================
echo Server Status:
pm2 list

echo ========================================
echo Server should now be running correctly!
echo Access: http://localhost:3000
echo Admin: http://localhost:3000/admin
echo Locket: http://localhost:3000/locket
echo ========================================
