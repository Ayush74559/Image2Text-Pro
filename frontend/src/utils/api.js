import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for OCR processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Extract text from image
  extractText: async (file, language = 'eng') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);
    
    const response = await api.post('/api/extract-text', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get extraction history
  getHistory: async (limit = 50, offset = 0) => {
    const response = await api.get('/api/history', {
      params: { limit, offset }
    });
    return response.data;
  },

  // Delete history item
  deleteHistoryItem: async (itemId) => {
    const response = await api.delete(`/api/history/${itemId}`);
    return response.data;
  },

  // Download text file
  downloadText: async (itemId) => {
    const response = await api.get(`/api/download/${itemId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Get supported languages
  getSupportedLanguages: async () => {
    const response = await api.get('/api/languages');
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/api/health');
    return response.data;
  },
};

export default api;
