#!/bin/bash

echo "========================================"
echo "Building UNO Game - Full Stack"
echo "========================================"
echo ""

echo "[1/4] Building Client..."
echo ""
npm run build
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Client build failed!"
    exit 1
fi
echo "Client build complete!"
echo ""

echo "[2/4] Installing Server Dependencies..."
echo ""
cd server
npm install
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Server dependency installation failed!"
    cd ..
    exit 1
fi
echo "Server dependencies installed!"
echo ""

echo "[3/4] Building Server..."
echo ""
npm run build
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Server build failed!"
    cd ..
    exit 1
fi
echo "Server build complete!"
echo ""

cd ..

echo "[4/4] Creating deployment package..."
echo ""
rm -rf deploy
mkdir -p deploy
cp -r dist deploy/client
cp -r server deploy/server
echo "Deployment package created!"
echo ""

echo "========================================"
echo "Build completed successfully!"
echo "========================================"
echo ""
echo "Client output: dist/"
echo "Server output: server/"
echo "Deployment package: deploy/"
echo ""
echo "To test locally:"
echo "  1. Start server: cd server && npm start"
echo "  2. Preview client: npm run preview"
echo ""
