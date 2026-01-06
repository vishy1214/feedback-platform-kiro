import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
from app import app

# Test database URL (in-memory SQLite)
TEST_DATABASE_URL = "sqlite:///./test_feedback.db"

# Create test engine
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Create test session
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="function")
def test_db():
    """Create a fresh database for each test"""
    Base.metadata.create_all(bind=test_engine)
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="function")
def client(test_db):
    """Create a test client with test database"""
    def override_get_db():
        try:
            yield test_db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()


@pytest.fixture
def sample_feedback_data():
    """Sample feedback data for testing"""
    return {
        "message": "This is a test feedback message"
    }


@pytest.fixture
def sample_positive_feedback():
    """Sample positive feedback for testing"""
    return {
        "message": "This app is amazing! I love the features and the interface is beautiful."
    }


@pytest.fixture
def sample_negative_feedback():
    """Sample negative feedback for testing"""
    return {
        "message": "This app is terrible. It crashes constantly and the UI is confusing."
    }
