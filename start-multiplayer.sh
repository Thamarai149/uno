#!/bin/bash

echo "Starting UNO Game Multiplayer Server and Client..."
echo ""

# Start server in background
cd server
npm start &
SERVER_PID=$!

cd ..
sleep 3

# Start client
npm run dev &
CLIENT_PID=$!

echo ""
echo "Both server and client are running!"
echo "Server: http://localhost:3001"
echo "Client: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both processes"

# Wait for Ctrl+C
trap "kill $SERVER_PID $CLIENT_PID; exit" INT
wait
