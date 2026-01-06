# Project Structure

## Root Level
```
├── client/           # React frontend application
├── server/           # FastAPI backend application
├── docker-compose.yml # Multi-service container orchestration
└── README.md         # Project documentation
```

## Frontend Structure (`client/`)
```
client/
├── Dockerfile        # Container configuration
├── package.json      # Dependencies and scripts
└── src/
    ├── App.jsx       # Main application component
    ├── index.jsx     # Application entry point
    ├── components/   # Reusable UI components
    │   ├── FeedbackForm.jsx    # Feedback submission form
    │   ├── FeedbackList.jsx    # Display feedback items
    │   └── InsightsPanel.jsx   # AI analysis results
    └── context/      # React Context providers
        └── FeedbackContext.jsx # Global feedback state
```

## Backend Structure (`server/`)
```
server/
├── Dockerfile           # Container configuration
├── requirements.txt     # Python dependencies
├── app.py              # FastAPI application entry
├── feedback_pipeline.py # AI processing logic
└── tests/              # Test suite
    └── test_pipeline.py # Pipeline unit tests
```

## Conventions

### File Naming
- **React Components:** PascalCase (e.g., `FeedbackForm.jsx`)
- **Python Modules:** snake_case (e.g., `feedback_pipeline.py`)
- **Configuration:** lowercase with extensions (e.g., `docker-compose.yml`)

### Component Organization
- Components are organized by feature in `/components/` directory
- Context providers live in `/context/` directory
- Each component is a default export in its own file

### API Structure
- Backend follows RESTful conventions
- Main application logic in `app.py`
- AI processing isolated in `feedback_pipeline.py`
- Tests mirror the source structure in `/tests/`