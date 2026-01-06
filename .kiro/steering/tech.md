# Technology Stack

## Frontend
- **Framework:** React 18
- **Build Tool:** Vite 5.0
- **Package Manager:** npm
- **Port:** 5173 (development)
- **Visualization:** react-tagcloud for word cloud visualization

## Backend
- **Framework:** FastAPI
- **Runtime:** Python 3 with uvicorn server
- **Port:** 8000
- **Database:** SQLite (in-memory for POC)
- **ORM:** SQLAlchemy for database operations
- **AI Pipeline:** Custom feedback analysis module

## Database
- **Type:** SQLite in-memory database
- **ORM:** SQLAlchemy with FastAPI integration
- **Tables:** feedback, insights
- **Migration:** Automatic table creation on startup

## Insight Generation
- **Framework:** TextBlob for sentiment analysis
- **NLP Library:** NLTK for text processing and theme extraction
- **Processing:** Asyncio for background insight generation
- **Storage:** Results stored in insights table linked to feedback

## Development Environment
- **Containerization:** Docker with Docker Compose
- **Environment Variables:** VITE_API_URL for API endpoint configuration

## Common Commands

### Development
```bash
# Start entire application
docker-compose up --build

# Frontend only (from client/ directory)
npm run dev

# Backend only (from server/ directory)
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### Testing
```bash
# Run backend tests
cd server && python -m pytest tests/
```

### Build
```bash
# Build and run containers
docker-compose up --build

# Rebuild specific service
docker-compose build server
docker-compose build client
```

## Key Dependencies
- **Frontend:** react, react-dom, vite, react-tagcloud
- **Backend:** fastapi, uvicorn, sqlalchemy, sqlite3
- **AI/NLP:** textblob, nltk
- **Async Processing:** asyncio (built-in Python)