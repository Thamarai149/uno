@echo off
echo ========================================
echo Building UNO Game - Full Stack
echo ========================================
echo.

echo [1/4] Building Client...
echo.
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Client build failed!
    pause
    exit /b %errorlevel%
)
echo Client build complete!
echo.

echo [2/4] Installing Server Dependencies...
echo.
cd server
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Server dependency installation failed!
    cd ..
    pause
    exit /b %errorlevel%
)
echo Server dependencies installed!
echo.

echo [3/4] Building Server...
echo.
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Server build failed!
    cd ..
    pause
    exit /b %errorlevel%
)
echo Server build complete!
echo.

cd ..

echo [4/4] Creating deployment package...
echo.
if not exist "deploy" mkdir deploy
xcopy /E /I /Y dist deploy\client
xcopy /E /I /Y server deploy\server
echo Deployment package created!
echo.

echo ========================================
echo Build completed successfully!
echo ========================================
echo.
echo Client output: dist/
echo Server output: server/
echo Deployment package: deploy/
echo.
echo To test locally:
echo   1. Start server: cd server ^&^& npm start
echo   2. Preview client: npm run preview
echo.
pause
