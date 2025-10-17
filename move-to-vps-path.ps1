# Move Server to VPS Path
# This script will copy all necessary files to the VPS path and start the server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Moving Server to VPS Path" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

try {
    # Step 1: Stop current PM2 processes
    Write-Host "Step 1: Stopping current PM2 processes..." -ForegroundColor Yellow
    pm2 delete all
    
    # Step 2: Create VPS directory structure
    $vpsPath = "C:\actions-runner\_work\locket-web-app\locket-web-app"
    Write-Host "Step 2: Creating VPS directory: $vpsPath" -ForegroundColor Yellow
    
    if (!(Test-Path $vpsPath)) {
        New-Item -ItemType Directory -Path $vpsPath -Force
    }
    
    # Step 3: Copy all necessary files
    Write-Host "Step 3: Copying files to VPS path..." -ForegroundColor Yellow
    
    # Copy directories
    $directories = @("server", "admin", "locket", "images", "download")
    foreach ($dir in $directories) {
        if (Test-Path $dir) {
            Copy-Item -Path $dir -Destination $vpsPath -Recurse -Force
            Write-Host "Copied $dir" -ForegroundColor Green
        }
    }
    
    # Copy files
    $files = @("*.html", "*.json", "package*.json")
    foreach ($pattern in $files) {
        Get-ChildItem -Path . -Name $pattern | ForEach-Object {
            Copy-Item -Path $_ -Destination $vpsPath -Force
            Write-Host "Copied $_" -ForegroundColor Green
        }
    }
    
    # Step 4: Install dependencies
    Write-Host "Step 4: Installing dependencies..." -ForegroundColor Yellow
    Set-Location $vpsPath
    npm install
    
    # Step 5: Start server from VPS path
    Write-Host "Step 5: Starting server from VPS path..." -ForegroundColor Yellow
    pm2 start server/server.js --name "locketweb-server"
    
    # Step 6: Save PM2 configuration
    Write-Host "Step 6: Saving PM2 configuration..." -ForegroundColor Yellow
    pm2 save
    
    # Step 7: Show status
    Write-Host "Step 7: PM2 Status:" -ForegroundColor Yellow
    pm2 list
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Server is now running from VPS path!" -ForegroundColor Green
    Write-Host "Path: $vpsPath" -ForegroundColor Green
    Write-Host "Access: http://localhost:3000" -ForegroundColor Green
    Write-Host "Admin: http://localhost:3000/admin" -ForegroundColor Green
    Write-Host "Locket: http://localhost:3000/locket" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    
} catch {
    Write-Host "Error occurred: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please run this script as Administrator" -ForegroundColor Red
}
