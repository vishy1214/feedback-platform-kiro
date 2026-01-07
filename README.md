# AI Feedback Platform

A minimal feedback collection and analysis platform that combines React frontend with FastAPI backend to process user feedback using AI.


## Features

- 📝 Feedback submission form
- 📊 Real-time feedback display with insights
- 🤖 AI-powered sentiment analysis (TextBlob)
- 🏷️ Theme extraction (NLTK)
- 💡 Actionable recommendations
- 🔍 Sortable and searchable feedback table
- ☁️ Word cloud visualization
- ✅ Comprehensive backend testing (29 tests)

## Project Documentation

- **Requirements**: `.kiro/specs/feedback-insights-platform/requirements.md`
- **Design**: `.kiro/specs/feedback-insights-platform/design.md`
- **Tasks**: `.kiro/specs/feedback-insights-platform/tasks*.md`
- **Steering**: `.kiro/steering/*.md`

## Key Features Explained

### Feedback Table
- Displays all feedback with sentiment scores, themes, and recommendations
- Sortable by sentiment score (ascending/descending)
- Searchable by themes
- Shows 10 items by default with scrolling

### Insights Panel
- **Themes Table**: Lists all identified themes with frequency counts
- **Word Cloud**: Visual representation of themes sized by frequency

### AI Processing
- Automatic sentiment analysis on feedback submission
- Asynchronous processing to avoid blocking
- Theme extraction using NLP
- Recommendation generation based on sentiment and themes


## Structure
- `client/` - React 18 + Vite frontend
- `server/` - FastAPI backend with SQLite database
- `docker-compose.yml` - Multi-service orchestration

## Quick Start

### Run the Application
```bash
docker-compose up --build
```

### Access the Application

**Frontend:**
- URL: http://localhost:5173
- Description: React application with feedback form, table, and insights

**Backend API:**
- Base URL: http://localhost:8000
- Health Check: http://localhost:8000/health
- API Documentation: http://localhost:8000/docs (Swagger UI)
- Alternative Docs: http://localhost:8000/redoc (ReDoc)

## API Endpoints

### Feedback Endpoints

**Submit Feedback**
- **POST** `/api/feedback`
- Body: `{"message": "Your feedback message"}`
- Response: Feedback object with ID, timestamp, and created_at

**Get All Feedback**
- **GET** `/api/feedback`
- Response: Array of feedback with integrated insights (sentiment scores, themes, recommendations)

### Insights Endpoints

**Get Insights Analytics**
- **GET** `/api/insights`
- Response: Aggregated analytics including:
  - Top 5 positive sentiment feedbacks
  - Top 5 negative sentiment feedbacks
  - Theme frequency counts
  - Actionable recommendations

### System Endpoints

**Root**
- **GET** `/`
- Response: API status message

**Health Check**
- **GET** `/health`
- Response: Service health status



## Technology Stack

### Frontend
- React 18
- Vite 5.0
- Axios for API calls
- react-tagcloud for word cloud visualization

### Backend
- FastAPI
- Python 3
- SQLite database
- SQLAlchemy ORM
- TextBlob for sentiment analysis
- NLTK for theme extraction

### Development
- Docker & Docker Compose
- pytest for backend testing
- vitest for frontend testing (configured)

## Development

### Frontend Only
```bash
cd client
npm install
npm run dev
```
Access at: http://localhost:5173

### Backend Only
```bash
cd server
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```
Access at: http://localhost:8000


## Testing

### Run Backend Tests
```bash
docker run --rm feedback-platform-kiro-server pytest tests/ -v
```

### Run Tests with Coverage
```bash
docker run --rm feedback-platform-kiro-server pytest tests/ --cov=. --cov-report=html
```

### Test Results
- ✅ 29 backend unit tests passing
- Coverage: API endpoints, insight processing, database models



## License

MIT