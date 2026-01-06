import React from "react";
import { useFeedback } from "../context/FeedbackContext";

export default function InsightsPanel() {
  const { insights, loading, error, fetchInsights } = useFeedback();

  // Format sentiment score for display
  const formatSentimentScore = (score) => {
    return (score >= 0 ? '+' : '') + score.toFixed(2);
  };

  // Get sentiment color
  const getSentimentColor = (score) => {
    if (score > 0.1) return '#28a745'; // Green for positive
    if (score < -0.1) return '#dc3545'; // Red for negative
    return '#6c757d'; // Gray for neutral
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchInsights();
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
          AI Insights
        </h3>
        
        <button
          onClick={handleRefresh}
          disabled={loading.insights}
          style={{
            backgroundColor: 'transparent',
            color: '#007bff',
            border: '1px solid #007bff',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: loading.insights ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {loading.insights ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Content */}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {/* Loading State */}
        {loading.insights && (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#666'
          }}>
            <div style={{ marginBottom: '10px' }}>Analyzing feedback...</div>
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
        {error.insights && (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#dc3545',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            margin: '10px'
          }}>
            <div style={{ marginBottom: '10px' }}>
              Failed to load insights: {error.insights}
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

        {/* Insights Content */}
        {!loading.insights && !error.insights && (
          <div style={{ padding: '20px' }}>
            
            {/* Top Positive Feedback */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ 
                margin: '0 0 12px 0', 
                fontSize: '14px', 
                fontWeight: '600',
                color: '#28a745',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '8px' }}>😊</span>
                Top Positive Feedback
              </h4>
              
              {insights.top_positive.length === 0 ? (
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666',
                  fontStyle: 'italic',
                  padding: '8px 0'
                }}>
                  No positive feedback yet
                </div>
              ) : (
                <div>
                  {insights.top_positive.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#f8fff9',
                        border: '1px solid #d4edda',
                        borderRadius: '4px',
                        marginBottom: '6px',
                        fontSize: '12px'
                      }}
                    >
                      <div style={{ 
                        fontWeight: '500',
                        color: getSentimentColor(item.sentiment_score),
                        marginBottom: '4px'
                      }}>
                        Score: {formatSentimentScore(item.sentiment_score)}
                      </div>
                      <div style={{ color: '#333', lineHeight: '1.4' }}>
                        {item.feedback}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Negative Feedback */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ 
                margin: '0 0 12px 0', 
                fontSize: '14px', 
                fontWeight: '600',
                color: '#dc3545',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '8px' }}>😞</span>
                Top Negative Feedback
              </h4>
              
              {insights.top_negative.length === 0 ? (
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666',
                  fontStyle: 'italic',
                  padding: '8px 0'
                }}>
                  No negative feedback yet
                </div>
              ) : (
                <div>
                  {insights.top_negative.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#fff5f5',
                        border: '1px solid #f5c6cb',
                        borderRadius: '4px',
                        marginBottom: '6px',
                        fontSize: '12px'
                      }}
                    >
                      <div style={{ 
                        fontWeight: '500',
                        color: getSentimentColor(item.sentiment_score),
                        marginBottom: '4px'
                      }}>
                        Score: {formatSentimentScore(item.sentiment_score)}
                      </div>
                      <div style={{ color: '#333', lineHeight: '1.4' }}>
                        {item.feedback}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Themes Table */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ 
                margin: '0 0 12px 0', 
                fontSize: '14px', 
                fontWeight: '600',
                color: '#333',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '8px' }}>🏷️</span>
                Key Themes
              </h4>
              
              {insights.themes.length === 0 ? (
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666',
                  fontStyle: 'italic',
                  padding: '8px 0'
                }}>
                  No themes identified yet
                </div>
              ) : (
                <div style={{
                  border: '1px solid #e9ecef',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    backgroundColor: '#f8f9fa',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#666',
                    borderBottom: '1px solid #e9ecef'
                  }}>
                    <div>Theme</div>
                    <div>Count</div>
                  </div>
                  
                  {insights.themes.slice(0, 8).map((theme, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        padding: '8px 12px',
                        fontSize: '12px',
                        borderBottom: index < Math.min(insights.themes.length - 1, 7) ? '1px solid #f0f0f0' : 'none',
                        backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa'
                      }}
                    >
                      <div style={{ color: '#333' }}>{theme.theme}</div>
                      <div style={{ 
                        color: '#007bff', 
                        fontWeight: '500',
                        textAlign: 'right'
                      }}>
                        {theme.count}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div>
              <h4 style={{ 
                margin: '0 0 12px 0', 
                fontSize: '14px', 
                fontWeight: '600',
                color: '#333',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '8px' }}>💡</span>
                Recommendations
              </h4>
              
              {insights.recommendations.length === 0 ? (
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666',
                  fontStyle: 'italic',
                  padding: '8px 0'
                }}>
                  No recommendations available yet
                </div>
              ) : (
                <div>
                  {insights.recommendations.slice(0, 6).map((rec, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#fff9e6',
                        border: '1px solid #ffeaa7',
                        borderRadius: '4px',
                        marginBottom: '6px',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'flex-start'
                      }}
                    >
                      <div style={{
                        backgroundColor: rec.priority === 'high' ? '#dc3545' : '#ffc107',
                        color: 'white',
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '2px',
                        marginRight: '8px',
                        marginTop: '1px',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        minWidth: 'fit-content'
                      }}>
                        {rec.priority}
                      </div>
                      <div style={{ color: '#333', lineHeight: '1.4' }}>
                        {rec.recommendation}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

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
