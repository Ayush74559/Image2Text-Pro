#!/bin/bash

# Image2Text Pro Setup Script
echo "🚀 Setting up Image2Text Pro..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js v16 or higher."
        exit 1
    fi
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.8 or higher."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    print_success "All basic requirements are met!"
}

# Install Tesseract OCR
install_tesseract() {
    print_status "Checking Tesseract OCR installation..."
    
    if command -v tesseract &> /dev/null; then
        print_success "Tesseract OCR is already installed!"
        tesseract --version | head -n 1
    else
        print_warning "Tesseract OCR is not installed."
        
        # Detect OS and provide installation instructions
        if [[ "$OSTYPE" == "darwin"* ]]; then
            print_status "Installing Tesseract OCR on macOS..."
            if command -v brew &> /dev/null; then
                brew install tesseract tesseract-lang
                print_success "Tesseract OCR installed successfully!"
            else
                print_error "Homebrew is not installed. Please install Homebrew first or install Tesseract manually."
                echo "Run: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
                exit 1
            fi
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            print_status "Installing Tesseract OCR on Linux..."
            if command -v apt-get &> /dev/null; then
                sudo apt-get update
                sudo apt-get install -y tesseract-ocr tesseract-ocr-hin
                print_success "Tesseract OCR installed successfully!"
            elif command -v yum &> /dev/null; then
                sudo yum install -y tesseract tesseract-langpack-hin
                print_success "Tesseract OCR installed successfully!"
            else
                print_error "Unable to install Tesseract automatically. Please install it manually."
                exit 1
            fi
        else
            print_error "Unsupported OS. Please install Tesseract OCR manually."
            echo "Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki"
            exit 1
        fi
    fi
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Create virtual environment
    if [ ! -d "venv" ]; then
        print_status "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    print_status "Activating virtual environment..."
    source venv/bin/activate
    
    # Upgrade pip
    print_status "Upgrading pip..."
    pip install --upgrade pip
    
    # Install dependencies
    print_status "Installing Python dependencies..."
    pip install -r requirements.txt
    
    print_success "Backend setup completed!"
    
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing Node.js dependencies..."
    npm install
    
    print_success "Frontend setup completed!"
    
    cd ..
}

# Create startup scripts
create_scripts() {
    print_status "Creating startup scripts..."
    
    # Backend startup script
    cat > start_backend.sh << 'EOF'
#!/bin/bash
echo "Starting Image2Text Pro Backend..."
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
EOF
    
    # Frontend startup script
    cat > start_frontend.sh << 'EOF'
#!/bin/bash
echo "Starting Image2Text Pro Frontend..."
cd frontend
npm start
EOF
    
    # Make scripts executable
    chmod +x start_backend.sh
    chmod +x start_frontend.sh
    
    print_success "Startup scripts created!"
}

# Main setup process
main() {
    echo "================================================"
    echo "           Image2Text Pro Setup"
    echo "================================================"
    echo ""
    
    check_requirements
    install_tesseract
    setup_backend
    setup_frontend
    create_scripts
    
    echo ""
    echo "================================================"
    print_success "Setup completed successfully! 🎉"
    echo "================================================"
    echo ""
    echo "To start the application:"
    echo ""
    echo "1. Start the backend (Terminal 1):"
    echo "   ./start_backend.sh"
    echo ""
    echo "2. Start the frontend (Terminal 2):"
    echo "   ./start_frontend.sh"
    echo ""
    echo "3. Open your browser and go to:"
    echo "   http://localhost:3000"
    echo ""
    echo "API documentation will be available at:"
    echo "   http://localhost:8000/docs"
    echo ""
    print_warning "Note: Make sure both backend and frontend are running simultaneously!"
}

# Run main function
main
