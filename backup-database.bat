@echo off
echo Backing up database...

set BACKUP_DIR=backups
set TIMESTAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo Creating backup: database_%TIMESTAMP%.json
copy "data\database.json" "%BACKUP_DIR%\database_%TIMESTAMP%.json"

echo.
echo Backup completed!
echo Backup location: %BACKUP_DIR%\database_%TIMESTAMP%.json

pause
