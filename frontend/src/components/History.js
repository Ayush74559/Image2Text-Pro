import React, { useState, useEffect } from 'react';
import { FiClock, FiTrash2, FiDownload, FiEye, FiX } from 'react-icons/fi';
import { apiService } from '../utils/api';
import { formatDate, formatFileSize, truncateText } from '../utils/helpers';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await apiService.getHistory();
      setHistory(response.history || []);
    } catch (err) {
      setError('Failed to load history');
      console.error('History fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await apiService.deleteHistoryItem(itemId);
      setHistory(history.filter(item => item.id !== itemId));
    } catch (err) {
      setError('Failed to delete item');
      console.error('Delete error:', err);
    }
  };

  const downloadItem = async (itemId) => {
    try {
      const blob = await apiService.downloadText(itemId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `extracted_text_${itemId}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download file');
      console.error('Download error:', err);
    }
  };

  const viewFullText = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full"></div>
          <span className="ml-3 text-gray-600">Loading history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <FiClock className="mr-2" />
          Extraction History
        </h2>
        {history.length > 0 && (
          <span className="text-sm text-gray-500">
            {history.length} item{history.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {history.length === 0 ? (
        <div className="text-center py-8">
          <FiClock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No extraction history yet</p>
          <p className="text-sm text-gray-400">Upload an image to get started</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {history.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {item.filename}
                    </h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                      {item.language.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                    {truncateText(item.extracted_text, 150)}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span>{formatDate(item.created_at)}</span>
                    {item.file_size && (
                      <span>{formatFileSize(item.file_size)}</span>
                    )}
                    {item.processing_time && (
                      <span>Processed in {item.processing_time}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => viewFullText(item)}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="View full text"
                  >
                    <FiEye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => downloadItem(item.id)}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Download as .txt"
                  >
                    <FiDownload className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for viewing full text */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedItem.filename}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                  {selectedItem.full_text}
                </pre>
              </div>
              
              <div className="flex flex-wrap items-center justify-between text-sm text-gray-500">
                <div className="flex flex-wrap gap-4">
                  <span>Language: {selectedItem.language.toUpperCase()}</span>
                  <span>Extracted: {formatDate(selectedItem.created_at)}</span>
                  {selectedItem.processing_time && (
                    <span>Processing Time: {selectedItem.processing_time}</span>
                  )}
                </div>
                {selectedItem.file_size && (
                  <span>File Size: {formatFileSize(selectedItem.file_size)}</span>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => downloadItem(selectedItem.id)}
                className="btn-secondary flex items-center space-x-2"
              >
                <FiDownload className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button onClick={closeModal} className="btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
