#!/bin/bash

# Locket Gold Shop - VPS Start Script

echo "🚀 Starting Locket Gold Shop..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the application with PM2
echo "🚀 Starting application with PM2..."
pm2 start server.js --name locket-gold

echo "✅ Locket Gold Shop is now running!"
echo "🌐 Access your shop at: http://your-vps-ip:3000"
echo "👨‍💼 Admin panel: http://your-vps-ip:3000/admin.html"
echo ""
echo "📋 Useful commands:"
echo "  pm2 status          - Check status"
echo "  pm2 logs locket-gold - View logs"
echo "  pm2 restart locket-gold - Restart app"
echo "  pm2 stop locket-gold - Stop app"
