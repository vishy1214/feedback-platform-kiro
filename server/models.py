from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# Request Models
class FeedbackCreate(BaseModel):
    message: str

# Response Models
class FeedbackResponse(BaseModel):
    id: int
    message: str
    timestamp: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True

class InsightResponse(BaseModel):
    id: int
    feedback_id: int
    sentiment_score: Optional[float]
    sentiment_label: Optional[str]
    themes: Optional[str]
    recommendations: Optional[str]
    processed_at: datetime
    
    class Config:
        from_attributes = True

# Combined Feedback with Insights Response
class FeedbackWithInsights(BaseModel):
    id: int
    message: str
    timestamp: datetime
    created_at: datetime
    sentiment_score: Optional[float] = None
    sentiment_label: Optional[str] = None
    themes: Optional[List[str]] = None
    recommendations: Optional[List[str]] = None
    priority_score: Optional[int] = None
    priority_level: Optional[str] = None
    insight_processed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Analytics Response Models
class TopSentimentFeedback(BaseModel):
    feedback: str
    sentiment_score: float
    timestamp: datetime

class ThemeCount(BaseModel):
    theme: str
    count: int

class Recommendation(BaseModel):
    recommendation: str
    priority: str

class InsightsAnalytics(BaseModel):
    top_positive: List[TopSentimentFeedback]
    top_negative: List[TopSentimentFeedback]
    themes: List[ThemeCount]
    recommendations: List[Recommendation]