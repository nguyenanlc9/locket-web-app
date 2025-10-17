@echo off
echo ========================================
echo    LOCKET DATABASE EXTERNAL SETUP
echo ========================================

echo.
echo This will move your database to C:\LocketDatabase\
echo to prevent data loss during git operations.

echo.
set /p confirm="Continue? (y/N): "
if /i not "%confirm%"=="y" (
    echo Cancelled
    pause
    exit /b 0
)

echo.
echo 1. Creating external database folder...
if not exist "C:\LocketDatabase" mkdir "C:\LocketDatabase"
if not exist "C:\LocketDatabase\backups" mkdir "C:\LocketDatabase\backups"
if not exist "C:\LocketDatabase\logs" mkdir "C:\LocketDatabase\logs"

echo.
echo 2. Migrating existing database...
call migrate-database-to-external.bat

echo.
echo 3. Setting up environment variable...
setx LOCKET_DB_DIR "C:\LocketDatabase" >nul 2>&1
echo ✅ Environment variable set

echo.
echo 4. Testing new database location...
if exist "C:\LocketDatabase\database.json" (
    echo ✅ Database exists at new location
    for %%A in ("C:\LocketDatabase\database.json") do echo    Size: %%~zA bytes
) else (
    echo ❌ Database not found at new location
)

echo.
echo 5. Creating database management scripts...
echo @echo off > "C:\LocketDatabase\backup.bat"
echo call "%~dp0..\backup-database-external.bat" >> "C:\LocketDatabase\backup.bat"

echo @echo off > "C:\LocketDatabase\restore.bat"
echo call "%~dp0..\backup-database-external.bat" >> "C:\LocketDatabase\restore.bat"

echo.
echo 6. Setting permissions...
icacls "C:\LocketDatabase" /grant Everyone:F /T >nul 2>&1
echo ✅ Permissions set

echo.
echo ========================================
echo           SETUP COMPLETE!
echo ========================================
echo.
echo Database location: C:\LocketDatabase\database.json
echo Backup location: C:\LocketDatabase\backups\
echo.
echo Benefits:
echo ✅ Safe from git pull/merge operations
echo ✅ Easy to backup and restore
echo ✅ Persistent across deployments
echo ✅ No data loss during code updates
echo.
echo Next steps:
echo 1. Restart your server
echo 2. Test that everything works
echo 3. You can now safely pull/merge code
echo.
echo Management commands:
echo - backup-database-external.bat (backup/restore)
echo - C:\LocketDatabase\backup.bat (quick backup)
echo - C:\LocketDatabase\restore.bat (quick restore)

echo.
pause
