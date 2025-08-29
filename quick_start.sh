#!/bin/bash

echo "🚀 Quick Start - Image2Text Pro (Test Mode)"
echo "=========================================="

# Check if backend is running
echo "📡 Checking if backend is running..."
if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
    echo "✅ Backend is running!"
else
    echo "❌ Backend is not running. Starting backend..."
    
    # Navigate to backend and start it
    cd backend
    
    # Check if virtual environment exists
    if [ -d "../.venv" ]; then
        echo "🔧 Activating virtual environment..."
        source ../.venv/bin/activate
    else
        echo "❌ Virtual environment not found!"
        exit 1
    fi
    
    echo "🚀 Starting backend server..."
    python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &
    
    # Wait a moment for server to start
    sleep 3
    
    # Check if server started successfully
    if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
        echo "✅ Backend started successfully!"
    else
        echo "❌ Backend failed to start. Check for errors above."
    fi
fi

echo ""
echo "🌐 Application Status:"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "📝 Note: If you get 'Failed to process image' errors,"
echo "it means Tesseract OCR is not installed yet."
echo "The Homebrew installation is running in the background."
