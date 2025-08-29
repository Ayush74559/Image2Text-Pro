#!/bin/bash

echo "🔧 Image2Text Pro - Tesseract Installation Guide"
echo "================================================"

# Check current OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "📱 Detected: macOS"
    echo ""
    echo "🚀 QUICK SOLUTION: Use Docker (Recommended)"
    echo "This will work immediately without installing Tesseract locally:"
    echo ""
    echo "1. Install Docker Desktop from: https://docs.docker.com/desktop/install/mac/"
    echo "2. Run the application with Docker:"
    echo "   cd /Users/ayush/Desktop/image-text"
    echo "   docker-compose up --build"
    echo "3. Access: http://localhost:3000"
    echo ""
    echo "OR"
    echo ""
    echo "🛠️  MANUAL TESSERACT INSTALLATION:"
    echo ""
    echo "Option 1: Install Homebrew first"
    echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo "  echo 'export PATH=\"/opt/homebrew/bin:\$PATH\"' >> ~/.zshrc"
    echo "  source ~/.zshrc"
    echo "  brew install tesseract tesseract-lang"
    echo ""
    echo "Option 2: Use MacPorts"
    echo "  1. Install MacPorts from: https://www.macports.org/install.php"
    echo "  2. sudo port install tesseract"
    echo ""
    echo "Option 3: Download pre-compiled binary"
    echo "  1. Download from: https://github.com/tesseract-ocr/tesseract/wiki"
    echo "  2. Follow macOS installation instructions"
    echo ""
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Detected: Linux"
    echo ""
    if command -v apt-get &> /dev/null; then
        echo "Installing Tesseract using apt-get..."
        sudo apt-get update
        sudo apt-get install -y tesseract-ocr tesseract-ocr-eng tesseract-ocr-hin
    elif command -v yum &> /dev/null; then
        echo "Installing Tesseract using yum..."
        sudo yum install -y tesseract tesseract-langpack-eng tesseract-langpack-hin
    else
        echo "Please install Tesseract manually for your Linux distribution"
    fi
else
    echo "❓ Unknown OS: $OSTYPE"
    echo "Please install Tesseract OCR manually for your operating system"
fi

echo ""
echo "🧪 VERIFICATION:"
echo "After installation, run:"
echo "  tesseract --version"
echo ""
echo "Then restart the backend:"
echo "  cd /Users/ayush/Desktop/image-text"
echo "  ./start_backend.sh"
