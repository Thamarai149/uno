@echo off
echo Starting UNO Game Multiplayer Server and Client...
echo.

cd server
start cmd /k "echo Starting Server... && npm start"

cd ..
timeout /t 3 /nobreak > nul

start cmd /k "echo Starting Client... && npm run dev"

echo.
echo Both server and client are starting in separate windows!
echo Server: http://localhost:3001
echo Client: http://localhost:3000
echo.
pause
