@echo off
echo 🚀 Starting Locket Gold Shop...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if PM2 is installed
pm2 --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing PM2...
    npm install -g pm2
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Start the application with PM2
echo 🚀 Starting application with PM2...
pm2 start server.js --name locket-gold

echo ✅ Locket Gold Shop is now running!
echo 🌐 Access your shop at: http://localhost:3000
echo 👨‍💼 Admin panel: http://localhost:3000/admin.html
echo.
echo 📋 Useful commands:
echo   pm2 status          - Check status
echo   pm2 logs locket-gold - View logs
echo   pm2 restart locket-gold - Restart app
echo   pm2 stop locket-gold - Stop app
pause
