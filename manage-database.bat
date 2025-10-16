@echo off
echo Database Management Tool

:menu
echo.
echo 1. Backup database
echo 2. Restore database
echo 3. View database info
echo 4. Reset database
echo 5. Exit

set /p choice="Choose option (1-5): "

if "%choice%"=="1" (
    call backup-database.bat
    goto menu
)

if "%choice%"=="2" (
    call restore-database.bat
    goto menu
)

if "%choice%"=="3" (
    echo.
    echo Database location: data\database.json
    if exist "data\database.json" (
        echo ✅ Database exists
        for %%i in ("data\database.json") do echo File size: %%~zi bytes
        echo Last modified: %%~ti
    ) else (
        echo ❌ Database not found
    )
    pause
    goto menu
)

if "%choice%"=="4" (
    echo.
    echo ⚠️ WARNING: This will reset the database to default values!
    set /p confirm="Are you sure? (y/N): "
    if /i "%confirm%"=="y" (
        if exist "data\database.json" del "data\database.json"
        echo ✅ Database reset. Restart server to initialize new database.
    ) else (
        echo Operation cancelled.
    )
    pause
    goto menu
)

if "%choice%"=="5" (
    exit
)

echo Invalid choice. Please try again.
goto menu
