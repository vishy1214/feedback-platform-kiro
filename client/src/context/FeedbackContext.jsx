import React, { createContext, useContext, useState, useEffect } from "react";
import { feedbackAPI } from "../utils/api";

export const FeedbackContext = createContext(null);

export const FeedbackProvider = ({ children }) => {
  // State for feedback data
  const [feedback, setFeedback] = useState([]);
  const [insights, setInsights] = useState({
    top_positive: [],
    top_negative: [],
    themes: [],
    recommendations: []
  });

  // Loading and error states
  const [loading, setLoading] = useState({
    feedback: false,
    insights: false,
    submitting: false
  });
  const [error, setError] = useState({
    feedback: null,
    insights: null,
    submit: null
  });

  // Fetch all feedback
  const fetchFeedback = async () => {
    setLoading(prev => ({ ...prev, feedback: true }));
    setError(prev => ({ ...prev, feedback: null }));
    
    try {
      const data = await feedbackAPI.getAllFeedback();
      setFeedback(data);
    } catch (err) {
      setError(prev => ({ ...prev, feedback: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, feedback: false }));
    }
  };

  // Fetch insights
  const fetchInsights = async () => {
    setLoading(prev => ({ ...prev, insights: true }));
    setError(prev => ({ ...prev, insights: null }));
    
    try {
      const data = await feedbackAPI.getInsights();
      setInsights(data);
    } catch (err) {
      setError(prev => ({ ...prev, insights: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, insights: false }));
    }
  };

  // Submit new feedback
  const submitFeedback = async (message) => {
    setLoading(prev => ({ ...prev, submitting: true }));
    setError(prev => ({ ...prev, submit: null }));
    
    try {
      const newFeedback = await feedbackAPI.submitFeedback(message);
      
      // Add new feedback to the list
      setFeedback(prev => [newFeedback, ...prev]);
      
      // Refresh insights after a short delay to allow processing
      setTimeout(() => {
        fetchInsights();
      }, 2000);
      
      return newFeedback;
    } catch (err) {
      setError(prev => ({ ...prev, submit: err.message }));
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  // Load initial data on mount
  useEffect(() => {
    fetchFeedback();
    fetchInsights();
  }, []);

  const contextValue = {
    // Data
    feedback,
    insights,
    
    // Loading states
    loading,
    
    // Error states
    error,
    
    // Actions
    submitFeedback,
    fetchFeedback,
    fetchInsights,
    
    // Utility functions
    refreshData: () => {
      fetchFeedback();
      fetchInsights();
    }
  };

  return (
    <FeedbackContext.Provider value={contextValue}>
      {children}
    </FeedbackContext.Provider>
  );
};

// Custom hook for using feedback context
export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};
