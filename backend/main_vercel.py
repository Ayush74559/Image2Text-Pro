"""
FastAPI application for Vercel deployment
Uses demo OCR service for serverless compatibility
"""
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import io
import os
import sys
from typing import Optional

# Add the current directory to Python path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Simple OCR service for Vercel
class SimpleOCRService:
    def __init__(self):
        self.demo_mode = True
    
    def extract_text(self, image_file: bytes, language: str = 'en') -> dict:
        """Demo OCR service"""
        try:
            from PIL import Image
            image = Image.open(io.BytesIO(image_file))
            width, height = image.size
            format_name = image.format or "Unknown"
            
            demo_text = f"""🎯 Image2Text Pro Demo

✅ Image processed successfully!

📸 Image Details:
• Format: {format_name}
• Dimensions: {width} × {height} pixels
• Language: {language.upper()}

📝 Sample Extracted Text:
This is a demonstration of our OCR capabilities. In a full deployment, this would contain the actual text extracted from your uploaded image using advanced OCR technology.

🚀 Features:
• Multi-language support
• High accuracy text extraction
• File format validation
• Real-time processing

💡 Note: This is a demo version running on Vercel. For real OCR processing, deploy the full version on platforms that support larger dependencies."""

            return {
                'text': demo_text,
                'confidence': 95.0,
                'language': language,
                'demo_mode': True,
                'engine': 'Demo Engine v1.0'
            }
        except Exception as e:
            return {
                'text': f'❌ Error processing image: {str(e)}',
                'confidence': 0.0,
                'language': language,
                'demo_mode': True,
                'error': str(e)
            }
    
    def is_available(self) -> bool:
        return True

# Initialize FastAPI app
app = FastAPI(
    title="Image2Text Pro API (Vercel Demo)",
    description="OCR API for extracting text from images - Demo Version",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OCR service
ocr_service = SimpleOCRService()

# Constants
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return JSONResponse({
        "status": "healthy",
        "message": "Image2Text Pro API is running (Vercel Demo)",
        "ocr_available": ocr_service.is_available(),
        "deployment": "Vercel",
        "demo_mode": True
    })

@app.post("/api/ocr/extract")
async def extract_text(
    file: UploadFile = File(...),
    language: str = Form(default="en")
):
    """Extract text from uploaded image"""
    try:
        # Validate file
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")
        
        if not allowed_file(file.filename):
            raise HTTPException(
                status_code=400, 
                detail=f"File type not allowed. Supported formats: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        
        # Read and validate file size
        file_content = await file.read()
        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400, 
                detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024*1024)}MB"
            )
        
        if len(file_content) == 0:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        # Process with OCR
        result = ocr_service.extract_text(file_content, language)
        
        return JSONResponse({
            "success": True,
            "data": result,
            "filename": file.filename,
            "file_size": len(file_content),
            "deployment": "Vercel Demo"
        })
        
    except HTTPException:
        raise
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": "Internal server error",
                "message": str(e),
                "deployment": "Vercel Demo"
            }
        )

@app.get("/api/ocr/history")
async def get_history():
    """Get OCR history - Demo endpoint"""
    return JSONResponse({
        "success": True,
        "data": [
            {
                "id": 1,
                "filename": "demo_document.png",
                "text": "This is a sample history entry for the demo version.",
                "language": "en",
                "created_at": "2024-01-15T10:30:00Z",
                "confidence": 95.0
            },
            {
                "id": 2,
                "filename": "sample_image.jpg", 
                "text": "Another sample extraction from the demo history.",
                "language": "en",
                "created_at": "2024-01-15T11:15:00Z",
                "confidence": 92.5
            }
        ],
        "total": 2,
        "demo_mode": True,
        "message": "This is demo history. Real deployment would show actual extraction history."
    })

@app.get("/api/ocr/languages")
async def get_supported_languages():
    """Get supported languages"""
    return JSONResponse({
        "languages": [
            {"code": "en", "name": "English"},
            {"code": "hi", "name": "Hindi"}
        ],
        "demo_mode": True,
        "note": "Full deployment supports additional languages"
    })

@app.get("/")
async def root():
    """Root endpoint"""
    return JSONResponse({
        "message": "Image2Text Pro API (Vercel Demo)",
        "docs": "/api/docs",
        "health": "/api/health",
        "demo_mode": True
    })

# Export the app for Vercel
handler = app

# For local testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
