import axios from 'axios';

// API base URL - will use environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// API functions
export const feedbackAPI = {
  // Submit new feedback
  submitFeedback: async (message) => {
    try {
      const response = await api.post('/api/feedback', { message });
      return response.data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw new Error(error.response?.data?.detail || 'Failed to submit feedback');
    }
  },

  // Get all feedback
  getAllFeedback: async () => {
    try {
      const response = await api.get('/api/feedback');
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch feedback');
    }
  },

  // Get insights analytics
  getInsights: async () => {
    try {
      const response = await api.get('/api/insights');
      return response.data;
    } catch (error) {
      console.error('Error fetching insights:', error);
      throw new Error(error.response?.data?.detail || 'Failed to fetch insights');
    }
  },
};

export default api;