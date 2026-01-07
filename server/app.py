from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc
from database import create_tables, get_db, Feedback, Insight
from models import FeedbackCreate, FeedbackResponse, FeedbackWithInsights, InsightsAnalytics, TopSentimentFeedback, ThemeCount, Recommendation
from feedback_pipeline import process_feedback_async
from typing import List
import asyncio
import json
from collections import Counter

app = FastAPI(title="Feedback Insights Platform", version="1.0.0")

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables on startup
@app.on_event("startup")
def startup_event():
    print("Creating database tables...")
    create_tables()
    print("Database tables created successfully!")

@app.get("/")
def root():
    return {"message": "AI Feedback Platform Backend Running"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "feedback-insights-platform"}

# Feedback API Endpoints
@app.post("/api/feedback", response_model=FeedbackResponse, status_code=201)
def submit_feedback(feedback: FeedbackCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Submit new feedback message and trigger async insight processing
    """
    try:
        # Validate input
        if not feedback.message or not feedback.message.strip():
            raise HTTPException(status_code=400, detail="Feedback message cannot be empty")
        
        # Create new feedback record
        db_feedback = Feedback(message=feedback.message.strip())
        db.add(db_feedback)
        db.commit()
        db.refresh(db_feedback)
        
        # Trigger async insight processing with a new database session
        background_tasks.add_task(
            trigger_insight_processing, 
            db_feedback.id, 
            db_feedback.message
        )
        
        return db_feedback
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to submit feedback: {str(e)}")

def trigger_insight_processing(feedback_id: int, message: str):
    """
    Trigger insight processing with a new database session
    """
    from database import SessionLocal, Insight
    from feedback_pipeline import analyze_feedback
    import json
    
    db = SessionLocal()
    try:
        # Analyze feedback
        analysis = analyze_feedback(message)
        
        # Create insight record
        insight = Insight(
            feedback_id=feedback_id,
            sentiment_score=analysis["sentiment_score"],
            sentiment_label=analysis["sentiment_label"],
            themes=json.dumps(analysis["themes"]),
            recommendations=json.dumps(analysis["recommendations"]),
            priority_score=analysis["priority_score"],
            priority_level=analysis["priority_level"]
        )
        
        # Save to database
        db.add(insight)
        db.commit()
        
        print(f"Insight processing completed for feedback {feedback_id}")
        
    except Exception as e:
        print(f"Error in insight processing for feedback {feedback_id}: {str(e)}")
        db.rollback()
    finally:
        db.close()

@app.get("/api/feedback", response_model=List[FeedbackWithInsights])
def get_all_feedback(db: Session = Depends(get_db)):
    """
    Retrieve all feedback messages with their insights
    """
    try:
        # Query feedback with left join to insights
        feedback_query = db.query(Feedback, Insight).outerjoin(
            Insight, Feedback.id == Insight.feedback_id
        ).order_by(Feedback.created_at.desc()).all()
        
        # Transform to FeedbackWithInsights model
        result = []
        for feedback, insight in feedback_query:
            feedback_data = {
                "id": feedback.id,
                "message": feedback.message,
                "timestamp": feedback.timestamp,
                "created_at": feedback.created_at,
                "sentiment_score": None,
                "sentiment_label": None,
                "themes": None,
                "recommendations": None,
                "priority_score": None,
                "priority_level": None,
                "insight_processed_at": None
            }
            
            # Add insight data if available
            if insight:
                feedback_data["sentiment_score"] = insight.sentiment_score
                feedback_data["sentiment_label"] = insight.sentiment_label
                feedback_data["priority_score"] = insight.priority_score
                feedback_data["priority_level"] = insight.priority_level
                feedback_data["insight_processed_at"] = insight.processed_at
                
                # Parse JSON fields
                if insight.themes:
                    try:
                        feedback_data["themes"] = json.loads(insight.themes)
                    except json.JSONDecodeError:
                        feedback_data["themes"] = []
                
                if insight.recommendations:
                    try:
                        feedback_data["recommendations"] = json.loads(insight.recommendations)
                    except json.JSONDecodeError:
                        feedback_data["recommendations"] = []
            
            result.append(FeedbackWithInsights(**feedback_data))
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve feedback: {str(e)}")

# Insights API Endpoint
@app.get("/api/insights", response_model=InsightsAnalytics)
def get_insights_analytics(db: Session = Depends(get_db)):
    """
    Retrieve processed insights and analytics
    """
    try:
        # Get all insights with their associated feedback
        insights_query = db.query(Insight, Feedback).join(Feedback, Insight.feedback_id == Feedback.id).all()
        
        if not insights_query:
            # Return empty analytics if no insights available
            return InsightsAnalytics(
                top_positive=[],
                top_negative=[],
                themes=[],
                recommendations=[]
            )
        
        # Separate positive and negative sentiments
        positive_feedback = []
        negative_feedback = []
        all_themes = []
        all_recommendations = []
        
        for insight, feedback in insights_query:
            if insight.sentiment_score is not None:
                sentiment_item = TopSentimentFeedback(
                    feedback=feedback.message,
                    sentiment_score=insight.sentiment_score,
                    timestamp=feedback.timestamp
                )
                
                if insight.sentiment_score > 0:
                    positive_feedback.append(sentiment_item)
                elif insight.sentiment_score < 0:
                    negative_feedback.append(sentiment_item)
            
            # Collect themes
            if insight.themes:
                try:
                    themes = json.loads(insight.themes)
                    all_themes.extend(themes)
                except json.JSONDecodeError:
                    pass
            
            # Collect recommendations
            if insight.recommendations:
                try:
                    recommendations = json.loads(insight.recommendations)
                    all_recommendations.extend(recommendations)
                except json.JSONDecodeError:
                    pass
        
        # Sort and get top 5 positive and negative
        top_positive = sorted(positive_feedback, key=lambda x: x.sentiment_score, reverse=True)[:5]
        top_negative = sorted(negative_feedback, key=lambda x: x.sentiment_score)[:5]
        
        # Count themes and get top themes
        theme_counts = Counter(all_themes)
        themes = [ThemeCount(theme=theme, count=count) for theme, count in theme_counts.most_common(10)]
        
        # Get unique recommendations with priority
        unique_recommendations = list(set(all_recommendations))
        recommendations = [
            Recommendation(recommendation=rec, priority="high" if "urgent" in rec.lower() or "critical" in rec.lower() else "medium")
            for rec in unique_recommendations[:10]
        ]
        
        return InsightsAnalytics(
            top_positive=top_positive,
            top_negative=top_negative,
            themes=themes,
            recommendations=recommendations
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve insights: {str(e)}")
