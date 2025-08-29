#!/bin/bash

# Development Environment Setup for Image2Text Pro
echo "🔧 Setting up Image2Text Pro development environment..."

# Make scripts executable
chmod +x setup.sh
chmod +x start_backend.sh
chmod +x start_frontend.sh

# Run the main setup
./setup.sh

echo ""
echo "✅ Development environment is ready!"
echo ""
echo "Quick Start:"
echo "1. Start backend:  ./start_backend.sh"
echo "2. Start frontend: ./start_frontend.sh"
echo "3. Open http://localhost:3000"
