import React from "react";
import { useFeedback } from "../context/FeedbackContext";
import WordCloud from "./WordCloud";

export default function InsightsPanel() {
  const { insights, loading, error, fetchInsights } = useFeedback();

  // Handle refresh
  const handleRefresh = () => {
    fetchInsights();
  };

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
        alignItems: 'center'
      }}>
        <h3 style={{ 
          margin: 0, 
          color: '#333',
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Insights Overview
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
      <div style={{ padding: '20px' }}>
        {/* Loading State */}
        {loading.insights && (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#666'
          }}>
            <div style={{ marginBottom: '10px' }}>Analyzing themes...</div>
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
            borderRadius: '4px'
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

        {/* Two-Column Layout: Themes Table + Word Cloud */}
        {!loading.insights && !error.insights && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px'
          }}>
            {/* Left Column: Key Themes Table */}
            <div>
              <h4 style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: '#333'
              }}>
                Key Themes
              </h4>
              
              {insights.themes.length === 0 ? (
                <div style={{ 
                  fontSize: '14px', 
                  color: '#666',
                  textAlign: 'center',
                  padding: '40px 20px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏷️</div>
                  <div>No themes identified yet</div>
                  <div style={{ fontSize: '12px', marginTop: '8px' }}>
                    Themes will appear as feedback is analyzed
                  </div>
                </div>
              ) : (
                <div style={{
                  border: '1px solid #e9ecef',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  {/* Table Header */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    backgroundColor: '#f8f9fa',
                    padding: '12px 16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#495057',
                    borderBottom: '2px solid #dee2e6',
                    position: 'sticky',
                    top: 0
                  }}>
                    <div>Theme</div>
                    <div style={{ textAlign: 'right' }}>Count</div>
                  </div>
                  
                  {/* Table Rows */}
                  {insights.themes.map((theme, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        padding: '12px 16px',
                        fontSize: '13px',
                        borderBottom: index < insights.themes.length - 1 ? '1px solid #e9ecef' : 'none',
                        backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e7f3ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#f8f9fa';
                      }}
                    >
                      <div style={{ 
                        color: '#333',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          display: 'inline-block',
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#007bff',
                          borderRadius: '50%',
                          marginRight: '10px'
                        }}></span>
                        {theme.theme}
                      </div>
                      <div style={{ 
                        color: '#007bff', 
                        fontWeight: '600',
                        textAlign: 'right',
                        fontSize: '14px'
                      }}>
                        {theme.count}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Word Cloud */}
            <div>
              <h4 style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: '#333'
              }}>
                Theme Visualization
              </h4>
              
              <div style={{
                border: '1px solid #e9ecef',
                borderRadius: '4px',
                backgroundColor: '#fafbfc',
                minHeight: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <WordCloud themes={insights.themes} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {!loading.insights && !error.insights && insights.themes.length > 0 && (
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid #e9ecef',
          backgroundColor: '#f8f9fa',
          fontSize: '12px',
          color: '#666',
          textAlign: 'center'
        }}>
          {insights.themes.length} theme{insights.themes.length !== 1 ? 's' : ''} identified across all feedback
        </div>
      )}

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
