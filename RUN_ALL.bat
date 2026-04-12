@echo off
REM ============================================
REM Travel Assistant - Start Both Backend & Frontend (Windows)
REM ============================================

echo.
echo ========================================
echo   Travel Assistant - Quick Start
echo ========================================
echo.

REM Get the directory where this script is located
cd /d "%~dp0"

echo [1/2] Starting Backend (Spring Boot)...
echo.
start /d "travel-assistant\backend" cmd /k "mvn spring-boot:run"

REM Wait 10 seconds for backend to start
echo Waiting for backend to initialize...
timeout /t 10 /nobreak

echo.
echo [2/2] Starting Frontend (Angular)...
echo.
start /d "travel-assistant\frontend" cmd /k "npm start"

echo.
echo ========================================
echo Services Starting...
echo ========================================
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:4200
echo Admin:    http://localhost:4200/admin
echo.
echo Email:    admin@tripx.com
echo Password: Admin@Tripx2026
echo ========================================
echo.
pause
