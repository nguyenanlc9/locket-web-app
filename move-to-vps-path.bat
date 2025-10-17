@echo off
echo ========================================
echo Moving Server to VPS Path
echo ========================================

echo Step 1: Stopping current PM2 processes...
pm2 delete all

echo Step 2: Creating VPS directory structure...
if not exist "C:\actions-runner\_work\locket-web-app\locket-web-app" (
    mkdir "C:\actions-runner\_work\locket-web-app\locket-web-app"
)

echo Step 3: Copying server files to VPS path...
xcopy "server" "C:\actions-runner\_work\locket-web-app\locket-web-app\server" /E /I /Y
xcopy "admin" "C:\actions-runner\_work\locket-web-app\locket-web-app\admin" /E /I /Y
xcopy "locket" "C:\actions-runner\_work\locket-web-app\locket-web-app\locket" /E /I /Y
xcopy "images" "C:\actions-runner\_work\locket-web-app\locket-web-app\images" /E /I /Y
xcopy "download" "C:\actions-runner\_work\locket-web-app\locket-web-app\download" /E /I /Y
copy "*.html" "C:\actions-runner\_work\locket-web-app\locket-web-app\"
copy "*.json" "C:\actions-runner\_work\locket-web-app\locket-web-app\"
copy "package*.json" "C:\actions-runner\_work\locket-web-app\locket-web-app\"

echo Step 4: Installing dependencies in VPS path...
cd "C:\actions-runner\_work\locket-web-app\locket-web-app"
npm install

echo Step 5: Starting server from VPS path...
pm2 start server/server.js --name "locketweb-server"

echo Step 6: Saving PM2 configuration...
pm2 save

echo ========================================
echo Server Status:
pm2 list

echo ========================================
echo Server is now running from VPS path!
echo Access: http://localhost:3000
echo ========================================
