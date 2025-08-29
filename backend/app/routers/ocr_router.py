from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.models.database import get_db, ExtractionHistory
from app.services.ocr_service import OCRService
from typing import List, Optional
import io
from datetime import datetime

router = APIRouter(prefix="/api", tags=["ocr"])
ocr_service = OCRService()

@router.post("/extract-text")
async def extract_text(
    file: UploadFile = File(...),
    language: str = "eng",
    db: Session = Depends(get_db)
):
    """
    Extract text from uploaded image using OCR
    """
    try:
        # Read file content
        file_content = await file.read()
        
        # Validate image
        validation_result = ocr_service.validate_image(file_content)
        if not validation_result['valid']:
            raise HTTPException(status_code=400, detail=validation_result['message'])
        
        # Extract text using OCR
        ocr_result = ocr_service.extract_text_from_image(file_content, language)
        
        if not ocr_result['success']:
            raise HTTPException(status_code=500, detail=f"OCR processing failed: {ocr_result.get('error', 'Unknown error')}")
        
        # Save to database
        history_entry = ExtractionHistory(
            filename=file.filename,
            extracted_text=ocr_result['text'],
            language=language,
            file_size=len(file_content),
            processing_time=ocr_result['processing_time']
        )
        db.add(history_entry)
        db.commit()
        db.refresh(history_entry)
        
        return {
            "id": history_entry.id,
            "filename": file.filename,
            "extracted_text": ocr_result['text'],
            "confidence": ocr_result['confidence'],
            "processing_time": ocr_result['processing_time'],
            "language": language,
            "file_size": len(file_content),
            "created_at": history_entry.created_at.isoformat(),
            "success": True
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@router.get("/history")
async def get_history(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """
    Get extraction history with pagination
    """
    try:
        # Get total count
        total = db.query(ExtractionHistory).count()
        
        # Get paginated results
        history = db.query(ExtractionHistory)\
                   .order_by(ExtractionHistory.created_at.desc())\
                   .offset(offset)\
                   .limit(limit)\
                   .all()
        
        history_list = []
        for item in history:
            history_list.append({
                "id": item.id,
                "filename": item.filename,
                "extracted_text": item.extracted_text[:200] + "..." if len(item.extracted_text) > 200 else item.extracted_text,
                "full_text": item.extracted_text,
                "language": item.language,
                "file_size": item.file_size,
                "processing_time": item.processing_time,
                "created_at": item.created_at.isoformat()
            })
        
        return {
            "history": history_list,
            "total": total,
            "limit": limit,
            "offset": offset
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.delete("/history/{item_id}")
async def delete_history_item(
    item_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a specific history item
    """
    try:
        item = db.query(ExtractionHistory).filter(ExtractionHistory.id == item_id).first()
        if not item:
            raise HTTPException(status_code=404, detail="History item not found")
        
        db.delete(item)
        db.commit()
        
        return {"message": "History item deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/download/{item_id}")
async def download_text(
    item_id: int,
    db: Session = Depends(get_db)
):
    """
    Download extracted text as a .txt file
    """
    try:
        item = db.query(ExtractionHistory).filter(ExtractionHistory.id == item_id).first()
        if not item:
            raise HTTPException(status_code=404, detail="History item not found")
        
        # Create text file content
        content = f"Extracted Text from {item.filename}\n"
        content += f"Language: {item.language}\n"
        content += f"Extracted on: {item.created_at.strftime('%Y-%m-%d %H:%M:%S')}\n"
        content += f"Processing time: {item.processing_time}\n"
        content += "\n" + "="*50 + "\n\n"
        content += item.extracted_text
        
        # Return as downloadable file
        filename = f"extracted_text_{item.id}_{item.filename.split('.')[0]}.txt"
        
        return Response(
            content=content,
            media_type="text/plain",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Download error: {str(e)}")

@router.get("/languages")
async def get_supported_languages():
    """
    Get list of supported OCR languages
    """
    return ocr_service.get_supported_languages()

@router.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy", "service": "Image2Text Pro API"}
