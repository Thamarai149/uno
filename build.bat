@echo off
echo ========================================
echo Building UNO Game for Production
echo ========================================
echo.

echo [1/3] Cleaning previous build...
if exist dist rmdir /s /q dist
echo Done!
echo.

echo [2/3] Running TypeScript compiler...
call npx tsc --noEmit
if %errorlevel% neq 0 (
    echo.
    echo ERROR: TypeScript compilation failed!
    echo Please fix the errors above and try again.
    pause
    exit /b %errorlevel%
)
echo Done!
echo.

echo [3/3] Building production bundle...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b %errorlevel%
)
echo.

echo ========================================
echo Build completed successfully!
echo ========================================
echo.
echo Output directory: dist/
echo.
echo To preview the build, run:
echo   npm run preview
echo.
echo To deploy, upload the 'dist' folder to your hosting service.
echo.
pause
