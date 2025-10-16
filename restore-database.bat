@echo off
echo Restoring database...

echo Available backups:
dir /b backups\database_*.json

echo.
set /p BACKUP_FILE="Enter backup filename (e.g., database_20251016_182200.json): "

if exist "backups\%BACKUP_FILE%" (
    copy "backups\%BACKUP_FILE%" "data\database.json"
    echo ✅ Database restored successfully!
) else (
    echo ❌ Backup file not found!
)

pause
