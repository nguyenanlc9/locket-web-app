@echo off
echo Setting up separate database folder...

echo.
echo 1. Creating database folder outside project...
if not exist "C:\LocketDatabase" mkdir "C:\LocketDatabase"
if not exist "C:\LocketDatabase\backups" mkdir "C:\LocketDatabase\backups"

echo.
echo 2. Database folder structure:
echo    C:\LocketDatabase\
echo    ├── database.json (main database)
echo    ├── backups\ (backup files)
echo    └── logs\ (database logs)

if not exist "C:\LocketDatabase\logs" mkdir "C:\LocketDatabase\logs"

echo.
echo 3. Setting permissions...
icacls "C:\LocketDatabase" /grant Everyone:F /T >nul 2>&1

echo.
echo 4. Creating initial database if not exists...
if not exist "C:\LocketDatabase\database.json" (
    echo Creating new database...
    echo { > "C:\LocketDatabase\database.json"
    echo   "orders": [], >> "C:\LocketDatabase\database.json"
    echo   "keys": [], >> "C:\LocketDatabase\database.json"
    echo   "paymentConfig": { >> "C:\LocketDatabase\database.json"
    echo     "bankName": "MBBank", >> "C:\LocketDatabase\database.json"
    echo     "accountNumber": "1613072005", >> "C:\LocketDatabase\database.json"
    echo     "accountHolder": "NGUYEN VAN A", >> "C:\LocketDatabase\database.json"
    echo     "productPrice": 30000 >> "C:\LocketDatabase\database.json"
    echo   }, >> "C:\LocketDatabase\database.json"
    echo   "telegramConfig": { >> "C:\LocketDatabase\database.json"
    echo     "botToken": "", >> "C:\LocketDatabase\database.json"
    echo     "chatId": "" >> "C:\LocketDatabase\database.json"
    echo   } >> "C:\LocketDatabase\database.json"
    echo } >> "C:\LocketDatabase\database.json"
    echo ✅ New database created
) else (
    echo ✅ Database already exists
)

echo.
echo 5. Database location: C:\LocketDatabase\database.json
echo    - Safe from git pull/merge
echo    - Persistent across deployments
echo    - Easy to backup/restore

echo.
echo ✅ Database folder setup complete!
pause
