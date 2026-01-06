# Requirements Document

## Introduction

A simple Feedback Insights Platform POC that allows users to submit feedback messages and automatically generates AI-powered insights including sentiment analysis, themes, and actionable recommendations. The system prioritizes speed to launch over performance optimization.

## Glossary

- **Feedback_System**: The complete platform for collecting and analyzing feedback
- **Insight_Engine**: The AI processing component that analyzes feedback
- **Feedback_Message**: User-submitted text feedback
- **Sentiment_Score**: Numerical value representing positive/negative sentiment (-1 to 1)
- **Theme**: Key topic or category extracted from feedback
- **Recommendation**: Actionable suggestion derived from feedback analysis
- **Database**: In-memory SQLite database for data persistence

## Requirements

### Requirement 1: Feedback Submission

**User Story:** As a user, I want to submit feedback messages through a simple UI, so that I can share my thoughts and experiences.

#### Acceptance Criteria

1. WHEN a user enters feedback text and submits the form, THE Feedback_System SHALL persist the message to the Database
2. WHEN feedback is successfully submitted, THE Feedback_System SHALL clear the input field and show confirmation
3. WHEN feedback submission fails, THE Feedback_System SHALL display an error message and retain the input
4. THE Feedback_System SHALL accept feedback messages of any reasonable length without authentication

### Requirement 2: Feedback Storage and Retrieval

**User Story:** As a system, I want to store and retrieve feedback messages, so that they can be displayed and analyzed.

#### Acceptance Criteria

1. THE Feedback_System SHALL use an in-memory SQLite database for data persistence
2. WHEN feedback is submitted, THE Feedback_System SHALL store it with a timestamp and unique identifier
3. THE Feedback_System SHALL provide an API endpoint that returns all feedback messages as a list
4. WHEN feedback is retrieved, THE Feedback_System SHALL include message content, timestamp, and identifier

### Requirement 3: Feedback Display

**User Story:** As a user, I want to view all submitted feedback messages, so that I can see the complete feedback history.

#### Acceptance Criteria

1. THE Feedback_System SHALL display all feedback messages in a list format
2. WHEN new feedback is submitted, THE Feedback_System SHALL update the display automatically
3. WHEN displaying feedback, THE Feedback_System SHALL show message content and submission timestamp
4. THE Feedback_System SHALL handle empty feedback lists gracefully

### Requirement 4: Insight Generation

**User Story:** As a system, I want to automatically analyze feedback for insights, so that actionable intelligence can be extracted.

#### Acceptance Criteria

1. WHEN feedback is persisted to the Database, THE Insight_Engine SHALL trigger asynchronous analysis
2. THE Insight_Engine SHALL generate sentiment analysis with numerical scores
3. THE Insight_Engine SHALL extract themes and key topics from feedback content
4. THE Insight_Engine SHALL generate actionable recommendations based on feedback
5. THE Insight_Engine SHALL store analysis results in the Database with reference to original feedback

### Requirement 5: Insight Storage

**User Story:** As a system, I want to persist insight analysis results, so that they can be retrieved and displayed.

#### Acceptance Criteria

1. THE Feedback_System SHALL store sentiment scores, themes, and recommendations in the Database
2. WHEN insights are generated, THE Feedback_System SHALL link them to the original feedback message
3. THE Feedback_System SHALL provide API endpoints for retrieving insight data
4. THE Feedback_System SHALL handle cases where insight generation fails gracefully

### Requirement 6: Insight Display

**User Story:** As a user, I want to view feedback insights and analytics, so that I can understand patterns and take action.

#### Acceptance Criteria

1. THE Feedback_System SHALL display the top 5 positive sentiment feedbacks with scores
2. THE Feedback_System SHALL display the top 5 negative sentiment feedbacks with scores
3. THE Feedback_System SHALL show all themes with their frequency counts in a table
4. THE Feedback_System SHALL display actionable recommendations in a separate table
5. WHEN new insights are generated, THE Feedback_System SHALL update the display automatically

### Requirement 7: Technical Architecture

**User Story:** As a developer, I want a simple and maintainable technical architecture, so that the POC can be developed and deployed quickly.

#### Acceptance Criteria

1. THE Feedback_System SHALL use React 18 with Vite for the frontend
2. THE Feedback_System SHALL use FastAPI with Python 3 for the backend
3. THE Feedback_System SHALL use SQLite in-memory database for data persistence
4. THE Feedback_System SHALL implement modular, maintainable code structure
5. THE Feedback_System SHALL use Docker Compose for containerized deployment
6. THE Feedback_System SHALL prioritize speed to launch over performance optimization

### Requirement 8: API Structure

**User Story:** As a frontend developer, I want simple REST APIs, so that I can easily integrate with the backend services.

#### Acceptance Criteria

1. THE Feedback_System SHALL provide POST /api/feedback endpoint for submitting feedback
2. THE Feedback_System SHALL provide GET /api/feedback endpoint for retrieving all feedback
3. THE Feedback_System SHALL provide GET /api/insights endpoint for retrieving insight analytics
4. WHEN API calls fail, THE Feedback_System SHALL return appropriate HTTP status codes and error messages
5. THE Feedback_System SHALL use JSON format for all API request and response payloads


## Updated Requirements (Enhancement Phase)

### Requirement 9: Enhanced Feedback API with Insights

**User Story:** As a frontend developer, I want feedback data to include associated insights, so that I can display comprehensive information in a single view.

#### Acceptance Criteria

1. THE Feedback_System SHALL modify GET /api/feedback endpoint to include associated insight data
2. WHEN feedback is retrieved, THE Feedback_System SHALL join insight information based on feedback-insight relationship
3. THE Feedback_System SHALL include sentiment score, themes, and recommendations with each feedback item
4. THE Feedback_System SHALL handle cases where insights are not yet available for feedback

### Requirement 10: Enhanced Feedback Table Display

**User Story:** As a user, I want to view feedback with insights in a comprehensive table format, so that I can analyze all information at once.

#### Acceptance Criteria

1. THE Feedback_System SHALL display feedback in a full-width table format
2. THE Feedback_System SHALL show feedback message, sentiment score, themes, recommendations, and creation date for each item
3. THE Feedback_System SHALL enable sorting by sentiment score in ascending or descending order
4. THE Feedback_System SHALL default to ascending order for sentiment score sorting
5. THE Feedback_System SHALL provide search functionality for the themes column
6. THE Feedback_System SHALL enable scrolling with a default view of 10 feedback items
7. THE Feedback_System SHALL display feedback creation date in the table

### Requirement 11: Simplified Insights Panel

**User Story:** As a user, I want a focused insights panel showing only key themes, so that I can quickly understand the main topics.

#### Acceptance Criteria

1. THE Feedback_System SHALL display the insights panel below the feedback table
2. THE Feedback_System SHALL show only the key themes section in the insights panel
3. THE Feedback_System SHALL remove top positive/negative sentiment displays from insights panel
4. THE Feedback_System SHALL remove recommendations display from insights panel
5. THE Feedback_System SHALL maintain theme frequency counts in the insights panel

### Requirement 12: Responsive Layout Updates

**User Story:** As a user, I want the feedback table to use the full screen width, so that I can see more information at once.

#### Acceptance Criteria

1. THE Feedback_System SHALL render the feedback table at full screen width
2. THE Feedback_System SHALL position the insights panel below the feedback table
3. THE Feedback_System SHALL maintain responsive design for different screen sizes
4. THE Feedback_System SHALL ensure proper scrolling for both table and insights panel

### Requirement 13: Word Cloud Visualization

**User Story:** As a user, I want to see a visual word cloud of key themes, so that I can quickly understand the most prominent topics at a glance.

#### Acceptance Criteria

1. THE Feedback_System SHALL divide the insights section into two equal parts
2. THE Feedback_System SHALL display the key themes table in the left section
3. THE Feedback_System SHALL display a word cloud visualization in the right section
4. THE Feedback_System SHALL generate the word cloud based on theme names and their frequency counts
5. WHEN themes are updated, THE Feedback_System SHALL refresh the word cloud visualization
6. THE Feedback_System SHALL scale word sizes proportionally to theme frequency counts
7. THE Feedback_System SHALL use appropriate colors and styling for the word cloud
8. THE Feedback_System SHALL handle cases where no themes are available gracefully