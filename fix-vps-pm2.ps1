# Fix PM2 Server Path Issue on VPS
# This script will fix the PM2 configuration to use the correct server path

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fixing PM2 Server Path on VPS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

try {
    # Step 1: Stop all PM2 processes
    Write-Host "Step 1: Stopping all PM2 processes..." -ForegroundColor Yellow
    pm2 delete all
    
    # Step 2: Change to correct directory
    $correctPath = "C:\Users\Admin\OneDrive\Máy tính\locketweb"
    Write-Host "Step 2: Changing to correct directory: $correctPath" -ForegroundColor Yellow
    Set-Location $correctPath
    
    # Step 3: Start server with correct path
    Write-Host "Step 3: Starting server with correct path..." -ForegroundColor Yellow
    pm2 start server/server.js --name "locketweb-server" --cwd $correctPath
    
    # Step 4: Save PM2 configuration
    Write-Host "Step 4: Saving PM2 configuration..." -ForegroundColor Yellow
    pm2 save
    
    # Step 5: Show status
    Write-Host "Step 5: PM2 Status:" -ForegroundColor Yellow
    pm2 list
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Server should now be running correctly!" -ForegroundColor Green
    Write-Host "Access: http://localhost:3000" -ForegroundColor Green
    Write-Host "Admin: http://localhost:3000/admin" -ForegroundColor Green
    Write-Host "Locket: http://localhost:3000/locket" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    
} catch {
    Write-Host "Error occurred: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please run this script as Administrator" -ForegroundColor Red
}
