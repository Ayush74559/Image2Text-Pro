# Image2Text Pro

A modern full-stack application for extracting text from images using OCR (Optical Character Recognition).

## Features

- 🖼️ Drag-and-drop image upload with preview
- 🔍 OCR text extraction using Tesseract
- 🌍 Multi-language support (English + Hindi)
- 📋 Copy-to-clipboard functionality
- 📄 Download extracted text as .txt file
- 📱 Responsive design for mobile and desktop
- 📊 History of past uploads and results
- ⚡ Loading animations and error handling
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Axios for API calls
- React Icons

### Backend
- FastAPI (Python)
- Tesseract OCR
- SQLite database
- Pillow for image processing
- CORS middleware

## Project Structure

```
image-text/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── utils/
│   │   └── ...
│   └── package.json
├── backend/           # FastAPI backend application
│   ├── app/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── services/
│   │   └── main.py
│   └── requirements.txt
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Tesseract OCR

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Install Tesseract OCR:
   - macOS: `brew install tesseract tesseract-lang`
   - Ubuntu: `sudo apt-get install tesseract-ocr tesseract-ocr-hin`
   - Windows: Download from [GitHub](https://github.com/UB-Mannheim/tesseract/wiki)

5. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

- `POST /api/extract-text` - Upload image and extract text
- `GET /api/history` - Get extraction history
- `DELETE /api/history/{id}` - Delete history item
- `GET /api/download/{id}` - Download extracted text as .txt file

## Deployment

The application is ready for deployment with:
- Frontend: Can be deployed to Vercel, Netlify, or any static hosting
- Backend: Can be deployed to Heroku, Railway, or any Python hosting platform

## License

MIT License
