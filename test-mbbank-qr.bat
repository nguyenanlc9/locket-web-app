@echo off
echo Testing MBBank QR code with correct bank code...

echo.
echo 1. Check server status...
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
echo 2. Test payment config (should show MBBank)...
powershell -Command "try { $result = Invoke-RestMethod -Uri 'http://localhost:3000/api/payment-config'; Write-Host 'Bank Name:' $result.config.bankName; Write-Host 'Account Number:' $result.config.accountNumber } catch { Write-Host 'Error:' $_.Exception.Message }"

echo.
echo 3. Test QR code generation...
echo Opening VietQR page to test QR code...
start http://localhost:3000/vietqr?orderId=TEST123&amount=30000&customer=Test%20User

echo.
echo 4. Expected QR code URL should be:
echo https://img.vietqr.io/image/970422-1613072005-compact.jpg?amount=30000&addInfo=LOCKET%20ORDTEST123

echo.
echo 5. Check if QR code displays correctly with MBBank logo

pause
