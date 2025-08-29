# 🚨 Quick Fix for "Failed to process image" Error

## The Issue
The "Failed to process image" error occurs because **Tesseract OCR is not installed** on your system. The backend cannot process images without this essential component.

## ⚡ Quick Fix Solutions

### Option 1: Install Homebrew + Tesseract (Recommended for macOS)

1. **Install Homebrew** (if not already installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Add Homebrew to your PATH** (add to your ~/.zshrc file):
   ```bash
   echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

3. **Install Tesseract OCR**:
   ```bash
   brew install tesseract tesseract-lang
   ```

4. **Verify installation**:
   ```bash
   tesseract --version
   ```

### Option 2: Manual Download (Alternative for macOS)

1. **Download Tesseract installer** from:
   - [GitHub Releases](https://github.com/tesseract-ocr/tesseract/releases)
   - Or use MacPorts: `sudo port install tesseract`

### Option 3: Use Docker (No local installation needed)

If you can't install Tesseract locally, you can run the entire application using Docker:

```bash
cd /Users/ayush/Desktop/image-text
docker-compose up --build
```

This will create containers with Tesseract pre-installed.

## 🔧 After Installing Tesseract

1. **Restart the backend server**:
   ```bash
   cd /Users/ayush/Desktop/image-text
   ./start_backend.sh
   ```

2. **Test the application**:
   - Go to http://localhost:3000
   - Upload an image
   - Click "Extract Text"

## 🩺 Troubleshooting

### Check if Tesseract is properly installed:
```bash
tesseract --version
which tesseract
```

### If you see path issues:
```bash
# Add to ~/.zshrc
echo 'export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### For Linux users:
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install tesseract-ocr tesseract-ocr-eng tesseract-ocr-hin

# CentOS/RHEL
sudo yum install tesseract tesseract-langpack-eng tesseract-langpack-hin
```

## ✅ Verification Steps

1. Backend should start without errors
2. Visit http://localhost:8000/docs - API documentation should load
3. Try the health check: http://localhost:8000/api/health
4. Upload an image and extract text

## 🆘 Still Having Issues?

If you're still getting errors:

1. **Check backend logs** for specific error messages
2. **Ensure Python virtual environment** is activated
3. **Try the Docker approach** for a clean environment
4. **Check if all dependencies** are installed: `pip list`

The application is fully functional once Tesseract OCR is properly installed!
