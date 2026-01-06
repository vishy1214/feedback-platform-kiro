import React, { useState, useMemo } from "react";
import { useFeedback } from "../context/FeedbackContext";

export default function FeedbackList() {
  const { feedback, loading, error, fetchFeedback } = useFeedback();
  
  // State for sorting
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  
  // State for theme search
  const [themeSearch, setThemeSearch] = useState('');

  // Format date for display
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Format sentiment score with color
  const getSentimentColor = (score) => {
    if (score === null || score === undefined) return '#999';
    if (score > 0.3) return '#28a745'; // Green for positive
    if (score < -0.3) return '#dc3545'; // Red for negative
    return '#ffc107'; // Yellow for neutral
  };

  // Toggle sort order
  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Filter and sort feedback
  const processedFeedback = useMemo(() => {
    let result = [...feedback];
    
    // Filter by theme search
    if (themeSearch.trim()) {
      const searchLower = themeSearch.toLowerCase();
      result = result.filter(item => {
        if (!item.themes || item.themes.length === 0) return false;
        return item.themes.some(theme => 
          theme.toLowerCase().includes(searchLower)
        );
      });
    }
    
    // Sort by sentiment score
    result.sort((a, b) => {
      const scoreA = a.sentiment_score ?? -999; // Put null values at end
      const scoreB = b.sentiment_score ?? -999;
      
      if (sortOrder === 'asc') {
        return scoreA - scoreB;
      } else {
        return scoreB - scoreA;
      }
    });
    
    return result;
  }, [feedback, themeSearch, sortOrder]);

  // Limit to 10 items by default
  const displayedFeedback = processedFeedback.slice(0, 10);

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e9ecef',
      borderRadius: '8px',
      overflow: 'hidden',
      width: '100%'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #e9ecef',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <h3 style={{ 
          margin: 0, 
          color: '#333',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Feedback with Insights
        </h3>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Theme Search */}
          <input
            type="text"
            placeholder="Search themes..."
            value={themeSearch}
            onChange={(e) => setThemeSearch(e.target.value)}
            style={{
              padding: '6px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '12px',
              width: '150px'
            }}
          />
          
          {/* Refresh Button */}
          <button
            onClick={fetchFeedback}
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
      </div>

      {/* Table Container with Scroll */}
      <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '600px' }}>
        {/* Loading State */}
        {loading.feedback && feedback.length === 0 && (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#666'
          }}>
            <div style={{ marginBottom: '10px' }}>Loading feedback...</div>
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
            Failed to load feedback: {error.feedback}
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
          </div>
        )}

        {/* No Results from Search */}
        {!loading.feedback && !error.feedback && feedback.length > 0 && displayedFeedback.length === 0 && (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#666'
          }}>
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>No feedback matches your search</div>
            <button
              onClick={() => setThemeSearch('')}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Table */}
        {displayedFeedback.length > 0 && (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: '#495057',
                  width: '30%'
                }}>
                  Message
                </th>
                <th 
                  onClick={toggleSort}
                  style={{ 
                    padding: '12px', 
                    textAlign: 'center', 
                    fontWeight: '600',
                    color: '#495057',
                    width: '10%',
                    cursor: 'pointer',
                    userSelect: 'none',
                    position: 'relative'
                  }}
                >
                  Score {sortOrder === 'asc' ? '↑' : '↓'}
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: '#495057',
                  width: '20%'
                }}>
                  Themes
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: '#495057',
                  width: '25%'
                }}>
                  Recommendations
                </th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  color: '#495057',
                  width: '15%'
                }}>
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedFeedback.map((item, index) => (
                <tr 
                  key={item.id}
                  style={{
                    borderBottom: '1px solid #e9ecef',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {/* Message */}
                  <td style={{ 
                    padding: '12px', 
                    verticalAlign: 'top',
                    wordWrap: 'break-word',
                    maxWidth: '300px'
                  }}>
                    {item.message}
                  </td>
                  
                  {/* Sentiment Score */}
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'center',
                    verticalAlign: 'top'
                  }}>
                    {item.sentiment_score !== null && item.sentiment_score !== undefined ? (
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: getSentimentColor(item.sentiment_score) + '20',
                        color: getSentimentColor(item.sentiment_score),
                        fontWeight: '600'
                      }}>
                        {item.sentiment_score.toFixed(2)}
                      </span>
                    ) : (
                      <span style={{ color: '#999', fontSize: '11px' }}>Processing...</span>
                    )}
                  </td>
                  
                  {/* Themes */}
                  <td style={{ 
                    padding: '12px',
                    verticalAlign: 'top'
                  }}>
                    {item.themes && item.themes.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {item.themes.map((theme, idx) => (
                          <span
                            key={idx}
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              backgroundColor: '#e7f3ff',
                              color: '#0066cc',
                              borderRadius: '12px',
                              fontSize: '11px'
                            }}
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#999', fontSize: '11px' }}>-</span>
                    )}
                  </td>
                  
                  {/* Recommendations */}
                  <td style={{ 
                    padding: '12px',
                    verticalAlign: 'top'
                  }}>
                    {item.recommendations && item.recommendations.length > 0 ? (
                      <ul style={{ 
                        margin: 0, 
                        paddingLeft: '16px',
                        fontSize: '11px',
                        lineHeight: '1.6'
                      }}>
                        {item.recommendations.slice(0, 2).map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                        {item.recommendations.length > 2 && (
                          <li style={{ color: '#666', fontStyle: 'italic' }}>
                            +{item.recommendations.length - 2} more
                          </li>
                        )}
                      </ul>
                    ) : (
                      <span style={{ color: '#999', fontSize: '11px' }}>-</span>
                    )}
                  </td>
                  
                  {/* Date */}
                  <td style={{ 
                    padding: '12px',
                    verticalAlign: 'top',
                    fontSize: '11px',
                    color: '#666'
                  }}>
                    {formatDate(item.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      {displayedFeedback.length > 0 && (
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid #e9ecef',
          backgroundColor: '#f8f9fa',
          fontSize: '12px',
          color: '#666',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>
            Showing {displayedFeedback.length} of {processedFeedback.length} feedback items
            {themeSearch && ` (filtered by "${themeSearch}")`}
          </span>
          {themeSearch && (
            <button
              onClick={() => setThemeSearch('')}
              style={{
                backgroundColor: 'transparent',
                color: '#007bff',
                border: 'none',
                padding: '4px 8px',
                fontSize: '11px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Clear filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
