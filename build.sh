#!/bin/bash

echo "========================================"
echo "Building UNO Game for Production"
echo "========================================"
echo ""

echo "[1/3] Cleaning previous build..."
rm -rf dist
echo "Done!"
echo ""

echo "[2/3] Running TypeScript compiler..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: TypeScript compilation failed!"
    echo "Please fix the errors above and try again."
    exit 1
fi
echo "Done!"
echo ""

echo "[3/3] Building production bundle..."
npm run build
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Build failed!"
    exit 1
fi
echo ""

echo "========================================"
echo "Build completed successfully!"
echo "========================================"
echo ""
echo "Output directory: dist/"
echo ""
echo "To preview the build, run:"
echo "  npm run preview"
echo ""
echo "To deploy, upload the 'dist' folder to your hosting service."
echo ""
