@echo off
echo Testing GitHub Actions workflow locally...

echo.
echo 1. Setting up environment variables...
set GITHUB_WORKSPACE=%CD%
set USERPROFILE=%USERPROFILE%

echo GITHUB_WORKSPACE: %GITHUB_WORKSPACE%
echo USERPROFILE: %USERPROFILE%

echo.
echo 2. Testing step: Install dependencies and generate lock file
cd /d "%GITHUB_WORKSPACE%"
npm install
if %ERRORLEVEL% == 0 (
    echo ✅ npm install successful
) else (
    echo ❌ npm install failed
)

echo.
echo 3. Testing step: Copy files to deployment folder
mkdir "%USERPROFILE%\web" 2>nul || echo "Directory already exists"
copy "%GITHUB_WORKSPACE%\server.js" "%USERPROFILE%\web\"
copy "%GITHUB_WORKSPACE%\package.json" "%USERPROFILE%\web\"
if exist "%GITHUB_WORKSPACE%\package-lock.json" copy "%GITHUB_WORKSPACE%\package-lock.json" "%USERPROFILE%\web\"
copy "%GITHUB_WORKSPACE%\*.html" "%USERPROFILE%\web\"
copy "%GITHUB_WORKSPACE%\*.mobileconfig" "%USERPROFILE%\web\"
copy "%GITHUB_WORKSPACE%\*.md" "%USERPROFILE%\web\"
copy "%GITHUB_WORKSPACE%\*.bat" "%USERPROFILE%\web\"
if exist "%GITHUB_WORKSPACE%\*.sh" copy "%GITHUB_WORKSPACE%\*.sh" "%USERPROFILE%\web\"
if exist "%GITHUB_WORKSPACE%\data" xcopy /E /I /Y "%GITHUB_WORKSPACE%\data" "%USERPROFILE%\web\data\"
if exist "%USERPROFILE%\web\.env" del "%USERPROFILE%\web\.env"

echo.
echo 4. Checking copied files...
cd /d "%USERPROFILE%\web"
dir /b

echo.
echo 5. Testing step: Install production dependencies
npm ci --omit=dev
if %ERRORLEVEL% == 0 (
    echo ✅ npm ci successful
) else (
    echo ❌ npm ci failed
)

echo.
echo 6. Testing step: Create startup script
echo @echo off > "%USERPROFILE%\web\start-server.bat"
echo cd /d "%USERPROFILE%\web" >> "%USERPROFILE%\web\start-server.bat"
echo node server.js >> "%USERPROFILE%\web\start-server.bat"

echo.
echo 7. Testing step: Stop and restart application
taskkill /F /IM node.exe 2>nul || echo "No Node.js processes running"
timeout /t 2 /nobreak >nul
echo Database is now external at C:\LocketDatabase\
echo Starting server with external database...

echo.
echo 8. Testing server startup...
start /B node server.js
timeout /t 3 /nobreak >nul

echo.
echo 9. Checking server status...
netstat -an | findstr :3000
if %ERRORLEVEL% == 0 (
    echo ✅ Server is running on port 3000
) else (
    echo ❌ Server not running
)

echo.
echo 10. Testing API endpoints...
powershell -Command "try { $result = Invoke-RestMethod -Uri 'http://localhost:3000/api/payment-config'; Write-Host '✅ API working' } catch { Write-Host '❌ API failed:' $_.Exception.Message }"

echo.
echo 11. Cleanup...
taskkill /F /IM node.exe 2>nul || echo "No Node.js processes running"

echo.
echo ========================================
echo         GITHUB ACTIONS TEST COMPLETE
echo ========================================
echo.
echo If all steps passed, the deployment should work!

pause
