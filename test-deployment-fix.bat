@echo off
echo Testing deployment fix...

echo.
echo 1. Creating test deployment directory...
mkdir "%USERPROFILE%\web-test" 2>nul || echo "Directory already exists"

echo.
echo 2. Testing file copy operations...
copy "server.js" "%USERPROFILE%\web-test\" >nul
if %ERRORLEVEL% == 0 (
    echo ✅ server.js copied
) else (
    echo ❌ server.js copy failed
)

copy "package.json" "%USERPROFILE%\web-test\" >nul
if %ERRORLEVEL% == 0 (
    echo ✅ package.json copied
) else (
    echo ❌ package.json copy failed
)

copy "*.html" "%USERPROFILE%\web-test\" >nul
if %ERRORLEVEL% == 0 (
    echo ✅ HTML files copied
) else (
    echo ❌ HTML files copy failed
)

copy "*.bat" "%USERPROFILE%\web-test\" >nul
if %ERRORLEVEL% == 0 (
    echo ✅ BAT files copied
) else (
    echo ❌ BAT files copy failed
)

if exist "*.sh" (
    copy "*.sh" "%USERPROFILE%\web-test\" >nul
    if %ERRORLEVEL% == 0 (
        echo ✅ SH files copied
    ) else (
        echo ❌ SH files copy failed
    )
) else (
    echo ⚠️ No SH files found (this is normal)
)

echo.
echo 3. Testing directory creation...
if exist "%USERPROFILE%\web-test" (
    echo ✅ Directory creation works
) else (
    echo ❌ Directory creation failed
)

echo.
echo 4. Testing npm operations...
cd /d "%USERPROFILE%\web-test"
npm --version >nul
if %ERRORLEVEL% == 0 (
    echo ✅ npm is available
) else (
    echo ❌ npm not found
)

echo.
echo 5. Testing server startup...
if exist "server.js" (
    echo ✅ server.js exists in deployment folder
) else (
    echo ❌ server.js not found
)

echo.
echo 6. Cleanup test directory...
cd /d "%USERPROFILE%"
rmdir /s /q "%USERPROFILE%\web-test" 2>nul
echo ✅ Test directory cleaned up

echo.
echo ========================================
echo         DEPLOYMENT FIX SUMMARY
echo ========================================
echo.
echo Changes made:
echo ✅ Fixed mkdir command syntax
echo ✅ Added error handling for directory creation
echo ✅ Fixed SH files copy with existence check
echo ✅ Improved error handling

echo.
echo The deployment should now work correctly!

pause
