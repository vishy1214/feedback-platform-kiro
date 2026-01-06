from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

# SQLite file-based database for POC (more reliable than in-memory)
SQLALCHEMY_DATABASE_URL = "sqlite:///./feedback.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    echo=False  # Disable SQL logging for cleaner output
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Feedback(Base):
    __tablename__ = "feedback"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship to insights
    insights = relationship("Insight", back_populates="feedback")

class Insight(Base):
    __tablename__ = "insights"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    feedback_id = Column(Integer, ForeignKey("feedback.id"), nullable=False)
    sentiment_score = Column(Float, nullable=True)  # -1 to 1 range
    sentiment_label = Column(String(20), nullable=True)  # positive/negative/neutral
    themes = Column(Text, nullable=True)  # JSON array of extracted themes
    recommendations = Column(Text, nullable=True)  # JSON array of suggestions
    processed_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship to feedback
    feedback = relationship("Feedback", back_populates="insights")

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine)