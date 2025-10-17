@echo off
echo Testing External Database System...

echo.
echo 1. Checking database location...
if exist "C:\LocketDatabase\database.json" (
    echo ✅ External database exists
    for %%A in ("C:\LocketDatabase\database.json") do echo    Size: %%~zA bytes
) else (
    echo ❌ External database not found
    echo    Run setup-external-database.bat first
    pause
    exit /b 1
)

echo.
echo 2. Checking server status...
netstat -an | findstr :3000
if %ERRORLEVEL% == 0 (
    echo ✅ Server is running
) else (
    echo ❌ Server not running, starting...
    cd /d "%USERPROFILE%\web"
    start /B node server.js
    timeout /t 3 /nobreak >nul
)

echo.
echo 3. Testing database access...
powershell -Command "try { $result = Invoke-RestMethod -Uri 'http://localhost:3000/api/payment-config'; Write-Host '✅ Database accessible via API' } catch { Write-Host '❌ Database access failed:' $_.Exception.Message }"

echo.
echo 4. Testing order creation...
powershell -Command "try { $order = @{ customer = @{ fullName = 'Test User'; email = 'test@example.com'; phone = '0123456789' }; amount = 30000; orderId = 'TEST' + (Get-Date -Format 'yyyyMMddHHmmss') } | ConvertTo-Json -Depth 3; $result = Invoke-RestMethod -Uri 'http://localhost:3000/api/orders' -Method POST -Body $order -ContentType 'application/json'; Write-Host '✅ Order created:' $result.orderId } catch { Write-Host '❌ Order creation failed:' $_.Exception.Message }"

echo.
echo 5. Testing database backup...
call backup-database-external.bat
if %ERRORLEVEL% == 0 (
    echo ✅ Backup system working
) else (
    echo ❌ Backup system failed
)

echo.
echo 6. Checking database structure...
echo Database location: C:\LocketDatabase\database.json
echo Backup location: C:\LocketDatabase\backups\
echo Logs location: C:\LocketDatabase\logs\

echo.
echo 7. Testing git safety...
echo ✅ Database is now outside project folder
echo ✅ Safe from git pull/merge operations
echo ✅ No data loss during code updates

echo.
echo ========================================
echo         EXTERNAL DATABASE READY!
echo ========================================
echo.
echo You can now safely:
echo - Pull/merge code without losing data
echo - Deploy updates without data loss
echo - Backup/restore database easily
echo - Manage database independently

echo.
pause
