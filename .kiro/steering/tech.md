# Technology Stack

## Frontend
- **Framework:** React 18
- **Build Tool:** Vite 5.0
- **Package Manager:** npm
- **Port:** 5173 (development)

## Backend
- **Framework:** FastAPI
- **Runtime:** Python with uvicorn server
- **Port:** 8000
- **AI Pipeline:** Custom feedback analysis module

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
- **Frontend:** react, react-dom, vite
- **Backend:** fastapi, uvicorn