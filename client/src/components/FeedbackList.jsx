import React from "react";
import { useFeedback } from "../context/FeedbackContext";

export default function FeedbackList() {
  const { feedback, loading, error, fetchFeedback } = useFeedback();

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchFeedback();
  };

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e9ecef',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #e9ecef',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ 
          margin: 0, 
          color: '#333',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Recent Feedback
        </h3>
        
        <button
          onClick={handleRefresh}
          disabled={loading.feedback}
          style={{
            backgroundColor: 'transparent',
            color: '#007bff',
            border: '1px solid #007bff',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: loading.feedback ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {loading.feedback ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Content */}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {/* Loading State */}
        {loading.feedback && feedback.length === 0 && (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#666'
          }}>
            <div style={{ marginBottom: '10px' }}>Loading feedback...</div>
            <div style={{
              width: '30px',
              height: '30px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
          </div>
        )}

        {/* Error State */}
        {error.feedback && (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#dc3545',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            margin: '10px'
          }}>
            <div style={{ marginBottom: '10px' }}>
              Failed to load feedback: {error.feedback}
            </div>
            <button
              onClick={handleRefresh}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading.feedback && !error.feedback && feedback.length === 0 && (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#666'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>No feedback yet</div>
            <div style={{ fontSize: '14px' }}>
              Be the first to share your thoughts!
            </div>
          </div>
        )}

        {/* Feedback Items */}
        {feedback.length > 0 && (
          <div>
            {feedback.map((item, index) => (
              <div
                key={item.id}
                style={{
                  padding: '16px 20px',
                  borderBottom: index < feedback.length - 1 ? '1px solid #f0f0f0' : 'none',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{
                  fontSize: '14px',
                  lineHeight: '1.5',
                  color: '#333',
                  marginBottom: '8px',
                  wordWrap: 'break-word'
                }}>
                  {item.message}
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px',
                  color: '#666'
                }}>
                  <span>
                    ID: {item.id}
                  </span>
                  <span>
                    {formatTimestamp(item.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with count */}
      {feedback.length > 0 && (
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid #e9ecef',
          backgroundColor: '#f8f9fa',
          fontSize: '12px',
          color: '#666',
          textAlign: 'center'
        }}>
          Showing {feedback.length} feedback item{feedback.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* CSS for loading spinner */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
