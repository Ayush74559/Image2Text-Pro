#!/bin/bash

echo "🔧 Alternative Tesseract Installation Methods"
echo "=============================================="

# Method 1: Try installing via Python package manager (easier)
echo "📦 Method 1: Installing via Python packages (no system dependency)"
echo ""

cd /Users/ayush/Desktop/image-text/backend
source ../.venv/bin/activate

echo "Installing alternative OCR packages..."
pip install easyocr opencv-python

echo ""
echo "✅ Installed EasyOCR as alternative to Tesseract"
echo ""

# Method 2: Download pre-compiled Tesseract
echo "📥 Method 2: Download pre-compiled Tesseract binary"
echo ""

# Create local bin directory
mkdir -p /Users/ayush/Desktop/image-text/bin

# Download tesseract binary for macOS (if available)
echo "Downloading Tesseract binary..."
curl -L -o /tmp/tesseract "https://github.com/tesseract-ocr/tesseract/releases/download/5.3.3/tesseract"
chmod +x /tmp/tesseract
cp /tmp/tesseract /Users/ayush/Desktop/image-text/bin/

echo ""
echo "🛠️  Method 3: Manual Homebrew installation"
echo "If other methods fail, complete Homebrew installation manually:"
echo ""
echo "1. Run: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
echo "2. When prompted, press ENTER to continue"
echo "3. Wait for installation to complete"
echo "4. Add to PATH: echo 'export PATH=\"/opt/homebrew/bin:\$PATH\"' >> ~/.zshrc"
echo "5. Reload shell: source ~/.zshrc"
echo "6. Install Tesseract: brew install tesseract tesseract-lang"
echo ""

echo "🎯 Quick Test (Alternative Solution)"
echo "For immediate testing, we can create a mock OCR service:"
