import React, { useState, useEffect } from 'react';
import { FiZap, FiAlertCircle } from 'react-icons/fi';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageUpload from './components/ImageUpload';
import LanguageSelector from './components/LanguageSelector';
import TextResult from './components/TextResult';
import History from './components/History';
import { apiService } from './utils/api';
import './index.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('eng');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Check API health on component mount
    checkAPIHealth();
  }, []);

  const checkAPIHealth = async () => {
    try {
      await apiService.healthCheck();
    } catch (err) {
      console.error('API health check failed:', err);
      setError('Backend API is not available. Please ensure the server is running.');
    }
  };

  const handleImageUpload = (file) => {
    setSelectedFile(file);
    setResult(null);
    setError('');
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const processImage = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsProcessing(true);
    setError('');
    setResult(null);

    try {
      const response = await apiService.extractText(selectedFile, selectedLanguage);
      setResult(response);
      
      // Show success message if text was extracted
      if (response.extracted_text && response.extracted_text.trim()) {
        // Optional: Show a toast notification here
      }
    } catch (err) {
      console.error('OCR processing error:', err);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.code === 'NETWORK_ERROR') {
        setError('Network error. Please check if the backend server is running.');
      } else {
        setError('Failed to process image. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Extract Text from Images
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Upload any image and extract text instantly using advanced OCR technology. 
              Support for multiple languages with high accuracy results.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <FiZap className="w-4 h-4 mr-2 text-yellow-500" />
                Fast & Accurate OCR
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Multi-language Support
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Download & Copy Results
              </div>
            </div>
          </div>

          {/* Global Error Alert */}
          {error && (
            <div className="mb-8 max-w-4xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                <FiAlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800 mb-1">Error</h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Upload & Controls */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Upload Image
                </h2>
                
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={handleLanguageChange}
                  disabled={isProcessing}
                />
                
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  isProcessing={isProcessing}
                />
                
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={processImage}
                    disabled={!selectedFile || isProcessing}
                    className="btn-primary flex-1 flex items-center justify-center space-x-2 py-3"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <FiZap className="w-4 h-4" />
                        <span>Extract Text</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={toggleHistory}
                    className="btn-secondary flex items-center justify-center space-x-2 py-3 px-6"
                  >
                    <span>{showHistory ? 'Hide History' : 'View History'}</span>
                  </button>
                </div>
              </div>
              
              {/* Result Section */}
              <TextResult 
                result={result} 
                isLoading={isProcessing}
              />
            </div>

            {/* Right Column - History */}
            <div className="lg:col-span-1">
              {showHistory && <History />}
              
              {/* Tips Card */}
              {!showHistory && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    💡 Tips for Better Results
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      Use high-resolution images with clear text
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      Ensure good lighting and contrast
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      Select the correct language for better accuracy
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      Avoid blurry or rotated text when possible
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      Supported formats: JPEG, PNG, BMP, TIFF, WebP
                    </li>
                  </ul>
                </div>
              )}
              
              {/* Features Card */}
              {!showHistory && (
                <div className="card mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    ✨ Features
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      Drag & drop image upload
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                      Copy text to clipboard
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                      Download as .txt file
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                      Extraction history
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                      Multi-language support
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                      Mobile responsive design
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
