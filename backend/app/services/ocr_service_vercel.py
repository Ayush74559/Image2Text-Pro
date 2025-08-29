"""
Vercel-compatible OCR service
Uses demo mode since EasyOCR/Tesseract are too large for serverless
"""
import io
import logging
from typing import Dict, Any
from PIL import Image

logger = logging.getLogger(__name__)

class OCRService:
    def __init__(self):
        """Initialize OCR service in demo mode for Vercel"""
        self.demo_mode = True
        logger.info("🚀 OCR Service initialized in DEMO mode for Vercel deployment")
    
    def extract_text(self, image_file: bytes, language: str = 'en') -> Dict[str, Any]:
        """
        Extract text from image - Demo mode for Vercel
        """
        try:
            # Validate image
            image = Image.open(io.BytesIO(image_file))
            
            # Demo text responses based on image characteristics
            width, height = image.size
            format_name = image.format or "Unknown"
            
            # Generate demo text based on image properties
            demo_texts = [
                f"🎯 Image2Text Pro Demo\n\nThis is a demonstration of our OCR capabilities.\n\nImage Details:\n- Format: {format_name}\n- Dimensions: {width}×{height}\n- Language: {language.upper()}\n\n✨ In production, this would contain the actual extracted text from your image using advanced OCR technology.\n\n🚀 Deploy with full OCR capabilities on your own server!",
                
                f"📄 Sample Document Text\n\nDocument Analysis Complete\n\nFile: {format_name} Image\nSize: {width} × {height} pixels\nProcessed: Successfully\n\nContent Preview:\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n🔍 This is demonstration text. Real OCR would extract actual text from your uploaded image.",
                
                f"📊 Image Processing Report\n\n✅ Image loaded successfully\n✅ Format detected: {format_name}\n✅ Resolution: {width}×{height}\n✅ Language: {language}\n\n📝 Extracted Content:\nThis is a sample of what would be extracted from your image. Our OCR engine would analyze the actual text content and provide accurate transcription.\n\n⚡ Ready for production deployment!",
                
                f"🌟 Welcome to Image2Text Pro!\n\nYour image has been processed:\n\n📸 Image Type: {format_name}\n📏 Dimensions: {width} × {height}\n🌍 Language: {language.upper()}\n\n📋 Sample Extracted Text:\n\"This demonstration shows how our OCR system would extract text from your images. In a full deployment, you would see the actual text content from your uploaded image here.\"\n\n🎉 Ready to extract real text? Deploy the full version!"
            ]
            
            # Select demo text based on image size
            text_index = (width + height) % len(demo_texts)
            extracted_text = demo_texts[text_index]
            
            return {
                'text': extracted_text,
                'confidence': 95.0,
                'language': language,
                'demo_mode': True,
                'message': 'Demo mode active - Deploy full version for real OCR',
                'engine': 'Demo Engine v1.0',
                'processing_time': 0.5,
                'image_info': {
                    'format': format_name,
                    'width': width,
                    'height': height,
                    'mode': image.mode
                }
            }
            
        except Exception as e:
            logger.error(f"Error in demo OCR processing: {str(e)}")
            return {
                'text': '❌ Error processing image in demo mode. Please check the image format and try again.',
                'confidence': 0.0,
                'language': language,
                'demo_mode': True,
                'error': str(e),
                'engine': 'Demo Engine v1.0'
            }
    
    def is_available(self) -> bool:
        """Check if OCR service is available"""
        return True
    
    def get_engine_info(self) -> Dict[str, str]:
        """Get OCR engine information"""
        return {
            'primary_engine': 'Demo Mode',
            'fallback_engine': 'Not Available',
            'status': 'Active (Demo)',
            'deployment': 'Vercel Compatible',
            'note': 'This is a demonstration version. Deploy the full version for real OCR capabilities.'
        }
