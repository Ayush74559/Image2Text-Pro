import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              © 2025 Image2Text Pro. Built with React & FastAPI.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Powered by Tesseract OCR technology
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Multi-language Support
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                High Accuracy OCR
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Supported Formats</h4>
              <p>JPEG, PNG, BMP, TIFF, WebP</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Languages</h4>
              <p>English, Hindi, and more</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Features</h4>
              <p>OCR, History, Download, Copy</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
