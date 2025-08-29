import React, { useState } from 'react';
import { FiCopy, FiDownload, FiCheck } from 'react-icons/fi';
import { copyToClipboard, downloadTextFile } from '../utils/helpers';

const TextResult = ({ result, isLoading }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (result?.extracted_text) {
      const success = await copyToClipboard(result.extracted_text);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleDownload = () => {
    if (result?.extracted_text && result?.filename) {
      const filename = `extracted_text_${result.filename.split('.')[0]}.txt`;
      downloadTextFile(result.extracted_text, filename);
    }
  };

  if (isLoading) {
    return (
      <div className="card animate-fadeInUp">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Image...</h3>
            <p className="text-gray-500">Extracting text using OCR technology</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="card animate-fadeInUp">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Extracted Text</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={!result.extracted_text}
          >
            {copied ? (
              <>
                <FiCheck className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <FiCopy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg transition-colors"
            disabled={!result.extracted_text}
          >
            <FiDownload className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {result.extracted_text ? (
        <>
          <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
              {result.extracted_text}
            </pre>
          </div>
          
          <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 border-t pt-4">
            <div className="flex flex-wrap gap-4">
              {result.confidence && (
                <span>Confidence: {result.confidence}%</span>
              )}
              {result.processing_time && (
                <span>Processing Time: {result.processing_time}</span>
              )}
              {result.language && (
                <span>Language: {result.language.toUpperCase()}</span>
              )}
            </div>
            {result.file_size && (
              <span>File Size: {(result.file_size / 1024).toFixed(1)} KB</span>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <FiCopy className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-500">No text could be extracted from this image.</p>
          <p className="text-sm text-gray-400 mt-2">
            Try uploading an image with clearer text or different language settings.
          </p>
        </div>
      )}
    </div>
  );
};

export default TextResult;
