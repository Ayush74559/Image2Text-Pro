import React from 'react';
import { FiImage, FiFileText } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <FiImage className="w-8 h-8 text-primary-600" />
                <FiFileText className="w-4 h-4 text-primary-400 absolute -bottom-1 -right-1" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Image2Text Pro
                </h1>
                <p className="text-xs text-gray-500 -mt-1">
                  OCR Text Extraction
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>AI-Powered OCR</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
