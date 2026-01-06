import React, { useState } from "react";
import { useFeedback } from "../context/FeedbackContext";

export default function FeedbackForm() {
  const [message, setMessage] = useState("");
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const { submitFeedback, loading, error } = useFeedback();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setLocalError("");
    setSuccessMessage("");
    
    // Validate input
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setLocalError("Please enter your feedback before submitting.");
      return;
    }
    
    if (trimmedMessage.length < 10) {
      setLocalError("Please provide more detailed feedback (at least 10 characters).");
      return;
    }
    
    try {
      await submitFeedback(trimmedMessage);
      
      // Clear form and show success message
      setMessage("");
      setSuccessMessage("Thank you! Your feedback has been submitted and is being analyzed.");
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      
    } catch (err) {
      setLocalError("Failed to submit feedback. Please try again.");
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    // Clear errors when user starts typing
    if (localError) setLocalError("");
    if (successMessage) setSuccessMessage("");
  };

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      padding: '24px',
      borderRadius: '8px',
      border: '1px solid #e9ecef',
      marginBottom: '20px'
    }}>
      <h2 style={{ 
        margin: '0 0 16px 0', 
        color: '#333',
        fontSize: '20px',
        fontWeight: '600'
      }}>
        Share Your Feedback
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <textarea
            value={message}
            onChange={handleChange}
            placeholder="Tell us about your experience, suggestions for improvement, or any issues you've encountered..."
            disabled={loading.submitting}
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              backgroundColor: loading.submitting ? '#f5f5f5' : 'white',
              color: loading.submitting ? '#666' : '#333',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ddd';
            }}
          />
          
          <div style={{ 
            fontSize: '12px', 
            color: '#666', 
            marginTop: '4px',
            textAlign: 'right'
          }}>
            {message.length} characters
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <button
            type="submit"
            disabled={loading.submitting || !message.trim()}
            style={{
              backgroundColor: loading.submitting || !message.trim() ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading.submitting || !message.trim() ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              minWidth: '120px'
            }}
          >
            {loading.submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
          
          {message.trim() && (
            <button
              type="button"
              onClick={() => {
                setMessage("");
                setLocalError("");
                setSuccessMessage("");
              }}
              disabled={loading.submitting}
              style={{
                backgroundColor: 'transparent',
                color: '#6c757d',
                border: '1px solid #6c757d',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: loading.submitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Error Messages */}
        {(localError || error.submit) && (
          <div style={{
            marginTop: '12px',
            padding: '10px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {localError || error.submit}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div style={{
            marginTop: '12px',
            padding: '10px',
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {successMessage}
          </div>
        )}
      </form>
    </div>
  );
}
