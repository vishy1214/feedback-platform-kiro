import React from "react";
import { FeedbackProvider } from "./context/FeedbackContext";
import FeedbackForm from "./components/FeedbackForm";
import FeedbackList from "./components/FeedbackList";
import InsightsPanel from "./components/InsightsPanel";

export default function App() {
  return (
    <FeedbackProvider>
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '20px'
        }}>
          {/* Header */}
          <header style={{ 
            marginBottom: '30px', 
            textAlign: 'center',
            padding: '20px 0'
          }}>
            <h1 style={{ 
              color: '#2c3e50', 
              marginBottom: '10px',
              fontSize: '32px',
              fontWeight: '700',
              letterSpacing: '-0.5px'
            }}>
              🤖 Feedback Platform
            </h1>
            <p style={{ 
              color: '#7f8c8d', 
              fontSize: '16px',
              margin: '0'
            }}>
              Submit feedback
            </p>
          </header>
          
          {/* Main Content */}
          <main>
            {/* Feedback Form Section */}
            <section style={{ marginBottom: '30px' }}>
              <FeedbackForm />
            </section>
            
            {/* Feedback Table - Full Width */}
            <section style={{ marginBottom: '30px' }}>
              <FeedbackList />
            </section>
            
            {/* Insights Panel - Full Width Below */}
            <section style={{ marginBottom: '30px' }}>
              <InsightsPanel />
            </section>
          </main>
          
          {/* Footer */}
          <footer style={{
            marginTop: '40px',
            padding: '20px 0',
            textAlign: 'center',
            color: '#95a5a6',
            fontSize: '14px',
            borderTop: '1px solid #e9ecef'
          }}>
            <p style={{ margin: '0' }}>
              Powered by AI • Built with React & FastAPI
            </p>
          </footer>
        </div>
      </div>

      {/* Global Styles */}
      <style>{`
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </FeedbackProvider>
  );
}
