@echo off
cd /d %~dp0

if not exist node_modules (
    echo Menginstall dependencies, mohon tunggu...
    call npm install
    if errorlevel 1 (
        echo.
        echo Install gagal. Pastikan Node.js sudah terinstall ^(nodejs.org^).
        pause
        exit /b 1
    )
)

echo Menjalankan Kebun ^& Ternak Manager di http://localhost:3000
echo Tutup jendela ini untuk menghentikan server.
call npm start
pause
