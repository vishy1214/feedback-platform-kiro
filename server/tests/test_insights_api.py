import pytest
import json
from database import Feedback, Insight


class TestInsightsAPI:
    """Test cases for Insights API endpoint"""
    
    def test_get_insights_empty_database(self, client):
        """Test GET /api/insights with no data"""
        response = client.get("/api/insights")
        
        assert response.status_code == 200
        data = response.json()
        assert data["top_positive"] == []
        assert data["top_negative"] == []
        assert data["themes"] == []
        assert data["recommendations"] == []
    
    def test_get_insights_with_positive_feedback(self, client, test_db):
        """Test GET /api/insights returns top positive sentiments"""
        # Create positive feedback with insights
        for i in range(3):
            feedback = Feedback(message=f"Positive message {i}")
            test_db.add(feedback)
            test_db.commit()
            test_db.refresh(feedback)
            
            insight = Insight(
                feedback_id=feedback.id,
                sentiment_score=0.5 + (i * 0.1),
                sentiment_label="positive",
                themes=json.dumps(["quality"]),
                recommendations=json.dumps(["Keep it up"])
            )
            test_db.add(insight)
        
        test_db.commit()
        
        response = client.get("/api/insights")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data["top_positive"]) == 3
        # Should be sorted by score descending
        assert data["top_positive"][0]["sentiment_score"] >= data["top_positive"][1]["sentiment_score"]
    
    def test_get_insights_with_negative_feedback(self, client, test_db):
        """Test GET /api/insights returns top negative sentiments"""
        # Create negative feedback with insights
        for i in range(3):
            feedback = Feedback(message=f"Negative message {i}")
            test_db.add(feedback)
            test_db.commit()
            test_db.refresh(feedback)
            
            insight = Insight(
                feedback_id=feedback.id,
                sentiment_score=-0.5 - (i * 0.1),
                sentiment_label="negative",
                themes=json.dumps(["bugs"]),
                recommendations=json.dumps(["Fix issues"])
            )
            test_db.add(insight)
        
        test_db.commit()
        
        response = client.get("/api/insights")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data["top_negative"]) == 3
        # Should be sorted by score ascending (most negative first)
        assert data["top_negative"][0]["sentiment_score"] <= data["top_negative"][1]["sentiment_score"]
    
    def test_get_insights_theme_counting(self, client, test_db):
        """Test GET /api/insights counts theme frequencies correctly"""
        themes_data = [
            ["performance", "quality"],
            ["performance", "usability"],
            ["performance", "quality"],
        ]
        
        for i, themes in enumerate(themes_data):
            feedback = Feedback(message=f"Message {i}")
            test_db.add(feedback)
            test_db.commit()
            test_db.refresh(feedback)
            
            insight = Insight(
                feedback_id=feedback.id,
                sentiment_score=0.5,
                sentiment_label="positive",
                themes=json.dumps(themes),
                recommendations=json.dumps([])
            )
            test_db.add(insight)
        
        test_db.commit()
        
        response = client.get("/api/insights")
        
        assert response.status_code == 200
        data = response.json()
        
        # Find theme counts
        theme_dict = {theme["theme"]: theme["count"] for theme in data["themes"]}
        assert theme_dict["performance"] == 3
        assert theme_dict["quality"] == 2
        assert theme_dict["usability"] == 1
    
    def test_get_insights_recommendation_aggregation(self, client, test_db):
        """Test GET /api/insights aggregates recommendations"""
        recommendations_data = [
            ["Improve performance", "Add more features"],
            ["Improve performance", "Fix bugs"],
            ["Add more features"],
        ]
        
        for i, recs in enumerate(recommendations_data):
            feedback = Feedback(message=f"Message {i}")
            test_db.add(feedback)
            test_db.commit()
            test_db.refresh(feedback)
            
            insight = Insight(
                feedback_id=feedback.id,
                sentiment_score=0.5,
                sentiment_label="positive",
                themes=json.dumps([]),
                recommendations=json.dumps(recs)
            )
            test_db.add(insight)
        
        test_db.commit()
        
        response = client.get("/api/insights")
        
        assert response.status_code == 200
        data = response.json()
        
        # Should have unique recommendations
        rec_texts = [rec["recommendation"] for rec in data["recommendations"]]
        assert "Improve performance" in rec_texts
        assert "Add more features" in rec_texts
        assert "Fix bugs" in rec_texts
    
    def test_get_insights_limits_top_sentiments(self, client, test_db):
        """Test GET /api/insights limits to top 5 positive and negative"""
        # Create 10 positive feedback items
        for i in range(10):
            feedback = Feedback(message=f"Positive {i}")
            test_db.add(feedback)
            test_db.commit()
            test_db.refresh(feedback)
            
            insight = Insight(
                feedback_id=feedback.id,
                sentiment_score=0.1 + (i * 0.05),
                sentiment_label="positive",
                themes=json.dumps([]),
                recommendations=json.dumps([])
            )
            test_db.add(insight)
        
        test_db.commit()
        
        response = client.get("/api/insights")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data["top_positive"]) == 5
    
    def test_get_insights_handles_invalid_json(self, client, test_db):
        """Test GET /api/insights handles invalid JSON in themes/recommendations"""
        feedback = Feedback(message="Test message")
        test_db.add(feedback)
        test_db.commit()
        test_db.refresh(feedback)
        
        # Create insight with invalid JSON
        insight = Insight(
            feedback_id=feedback.id,
            sentiment_score=0.5,
            sentiment_label="positive",
            themes="invalid json",
            recommendations="invalid json"
        )
        test_db.add(insight)
        test_db.commit()
        
        response = client.get("/api/insights")
        
        # Should not crash, should handle gracefully
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data["themes"], list)
        assert isinstance(data["recommendations"], list)
