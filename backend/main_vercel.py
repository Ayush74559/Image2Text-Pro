"""
FastAPI application for Vercel deployment
Uses demo OCR service for serverless compatibility
"""
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import io
import os
import sys
from typing import Optional, List

# Add the backend directory to the Python path
backend_path = os.path.join(os.path.dirname(__file__), '..')
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

# Import Vercel-compatible OCR service
try:
    from app.services.ocr_service_vercel import OCRService
except ImportError:
    # Fallback import
    import importlib.util
    spec = importlib.util.spec_from_file_location("ocr_service_vercel", 
                                                  os.path.join(os.path.dirname(__file__), "services", "ocr_service_vercel.py"))
    ocr_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(ocr_module)
    OCRService = ocr_module.OCRService

# Initialize FastAPI app
app = FastAPI(
    title="Image2Text Pro API (Vercel)",
    description="OCR API for extracting text from images - Vercel Demo Version",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OCR service
ocr_service = OCRService()

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def allowed_file(filename: str) -> bool:
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    engine_info = ocr_service.get_engine_info()
    return JSONResponse({
        "status": "healthy",
        "message": "Image2Text Pro API is running (Vercel Demo)",
        "ocr_available": ocr_service.is_available(),
        "engine_info": engine_info,
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
    """Root endpoint redirect"""
    return JSONResponse({
        "message": "Image2Text Pro API (Vercel Demo)",
        "docs": "/api/docs",
        "health": "/api/health",
        "demo_mode": True
    })

# Vercel requires the app to be exported as 'app'
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
