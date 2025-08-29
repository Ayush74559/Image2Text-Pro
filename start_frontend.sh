#!/bin/bash

# Start Frontend Script
echo "🚀 Starting Image2Text Pro Frontend..."

# Navigate to frontend directory
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ Dependencies not found!"
    echo "Installing dependencies..."
    npm install
fi

# Start the React development server
echo "🌟 Starting React development server on http://localhost:3000"
echo "🔗 Make sure the backend is running on http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
