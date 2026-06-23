@echo off
title TASK - Hospital IT Task Management System
color 0B
cls

echo ============================================
echo   TASK - Hospital IT Task Management System
echo ============================================
echo.

REM Check for admin rights
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [INFO] Not running as Administrator.
    echo        Some Docker operations may require admin rights.
    echo.
)

set FRONTEND_URL=http://172.16.1.10:8080
set API_URL=http://172.16.1.10:3001/api/v1/auth/login

REM Check if Docker is installed
where docker >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Docker is not installed or not in PATH.
    echo         Please install Docker Desktop from https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo [CHECK] Verifying Docker services...
docker ps --format "{{.Names}} {{.Status}}" 2>nul | findstr /i "task" >nul
if %errorLevel% neq 0 (
    echo [WARN] TASK containers are not running.
    echo.
    echo Would you like to start the TASK system now?
    echo   1. Yes - Start containers and launch browser
    echo   2. No  - Just open the browser (may fail if not running)
    echo.
    set /p choice="Enter choice (1 or 2): "

    if "!choice!"=="1" (
        echo.
        echo [STARTING] Launching TASK containers...
        docker compose -f "%~dp0docker-compose.yml" up -d
        if !errorLevel! neq 0 (
            echo [ERROR] Failed to start Docker containers.
            pause
            exit /b 1
        )
        echo [OK] Containers started successfully.
    )
) else (
    echo [OK] TASK containers are running.
)

echo.
echo [LAUNCHING] Opening TASK System in your default browser...
echo.
echo  - Frontend: %FRONTEND_URL%
echo  - API:      %API_URL%
echo  - Login:    admin / Admin@2024
echo.
timeout /t 2 /nobreak >nul
start "" %FRONTEND_URL%
exit
