import pytest
import json
from database import Feedback, Insight


class TestFeedbackAPI:
    """Test cases for Feedback API endpoints"""
    
    def test_post_feedback_valid_input(self, client, sample_feedback_data):
        """Test POST /api/feedback with valid input"""
        response = client.post("/api/feedback", json=sample_feedback_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["message"] == sample_feedback_data["message"]
        assert "id" in data
        assert "timestamp" in data
        assert "created_at" in data
    
    def test_post_feedback_empty_message(self, client):
        """Test POST /api/feedback with empty message"""
        response = client.post("/api/feedback", json={"message": ""})
        
        assert response.status_code == 400
        assert "empty" in response.json()["detail"].lower()
    
    def test_post_feedback_whitespace_only(self, client):
        """Test POST /api/feedback with whitespace-only message"""
        response = client.post("/api/feedback", json={"message": "   "})
        
        assert response.status_code == 400
    
    def test_post_feedback_missing_message(self, client):
        """Test POST /api/feedback with missing message field"""
        response = client.post("/api/feedback", json={})
        
        assert response.status_code == 422  # Validation error
    
    def test_get_feedback_empty_database(self, client):
        """Test GET /api/feedback with empty database"""
        response = client.get("/api/feedback")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 0
    
    def test_get_feedback_returns_all_feedback(self, client, test_db):
        """Test GET /api/feedback returns all feedback"""
        # Create test feedback
        feedback1 = Feedback(message="Test message 1")
        feedback2 = Feedback(message="Test message 2")
        test_db.add(feedback1)
        test_db.add(feedback2)
        test_db.commit()
        
        response = client.get("/api/feedback")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["message"] in ["Test message 1", "Test message 2"]
    
    def test_get_feedback_with_insights(self, client, test_db):
        """Test GET /api/feedback includes insight data"""
        # Create feedback with insight
        feedback = Feedback(message="Test message")
        test_db.add(feedback)
        test_db.commit()
        test_db.refresh(feedback)
        
        insight = Insight(
            feedback_id=feedback.id,
            sentiment_score=0.5,
            sentiment_label="positive",
            themes=json.dumps(["quality", "performance"]),
            recommendations=json.dumps(["Keep up the good work"])
        )
        test_db.add(insight)
        test_db.commit()
        
        response = client.get("/api/feedback")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["sentiment_score"] == 0.5
        assert data[0]["sentiment_label"] == "positive"
        assert data[0]["themes"] == ["quality", "performance"]
        assert data[0]["recommendations"] == ["Keep up the good work"]
    
    def test_get_feedback_without_insights(self, client, test_db):
        """Test GET /api/feedback handles feedback without insights"""
        # Create feedback without insight
        feedback = Feedback(message="Test message")
        test_db.add(feedback)
        test_db.commit()
        
        response = client.get("/api/feedback")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["sentiment_score"] is None
        assert data[0]["themes"] is None
        assert data[0]["recommendations"] is None
    
    def test_feedback_ordering(self, client, test_db):
        """Test GET /api/feedback returns feedback in descending order by created_at"""
        import time
        
        # Create feedback with slight delay
        feedback1 = Feedback(message="First message")
        test_db.add(feedback1)
        test_db.commit()
        
        time.sleep(0.1)
        
        feedback2 = Feedback(message="Second message")
        test_db.add(feedback2)
        test_db.commit()
        
        response = client.get("/api/feedback")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        # Most recent should be first
        assert data[0]["message"] == "Second message"
        assert data[1]["message"] == "First message"
