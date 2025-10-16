@echo off
echo Migrating database to new location...

set OLD_DB=database.json
set NEW_DIR=data
set NEW_DB=%NEW_DIR%\database.json

echo.
echo 1. Checking old database...
if exist "%OLD_DB%" (
    echo ✅ Old database found
    echo File size: 
    for %%i in ("%OLD_DB%") do echo %%~zi bytes
    
    echo.
    echo 2. Creating data directory...
    if not exist "%NEW_DIR%" mkdir "%NEW_DIR%"
    
    echo.
    echo 3. Moving database...
    move "%OLD_DB%" "%NEW_DB%"
    echo ✅ Database moved to %NEW_DB%
    
    echo.
    echo 4. Verifying migration...
    if exist "%NEW_DB%" (
        echo ✅ Migration successful!
        echo New location: %NEW_DB%
    ) else (
        echo ❌ Migration failed!
    )
) else (
    echo ❌ Old database not found
    echo Creating new database structure...
    if not exist "%NEW_DIR%" mkdir "%NEW_DIR%"
    echo ✅ Data directory created
)

echo.
echo 5. Database location: %NEW_DB%
echo You can now restart the server.

pause
