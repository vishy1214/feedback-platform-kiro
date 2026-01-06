import pytest
from feedback_pipeline import analyze_feedback


class TestInsightProcessingPipeline:
    """Test cases for insight processing pipeline"""
    
    def test_sentiment_analysis_positive_text(self):
        """Test sentiment analysis with positive text"""
        text = "This is amazing! I love it so much. Great work!"
        result = analyze_feedback(text)
        
        assert "sentiment_score" in result
        assert "sentiment_label" in result
        assert result["sentiment_score"] > 0
        assert result["sentiment_label"] == "positive"
    
    def test_sentiment_analysis_negative_text(self):
        """Test sentiment analysis with negative text"""
        text = "This is terrible. I hate it. Very disappointing and frustrating."
        result = analyze_feedback(text)
        
        assert "sentiment_score" in result
        assert "sentiment_label" in result
        assert result["sentiment_score"] < 0
        assert result["sentiment_label"] == "negative"
    
    def test_sentiment_analysis_neutral_text(self):
        """Test sentiment analysis with neutral text"""
        text = "This is a product. It has features."
        result = analyze_feedback(text)
        
        assert "sentiment_score" in result
        assert "sentiment_label" in result
        assert result["sentiment_label"] == "neutral"
    
    def test_theme_extraction_returns_list(self):
        """Test theme extraction returns a list"""
        text = "The performance is great and the quality is excellent"
        result = analyze_feedback(text)
        
        assert "themes" in result
        assert isinstance(result["themes"], list)
    
    def test_theme_extraction_from_text(self):
        """Test theme extraction identifies key topics"""
        text = "The user interface is intuitive and the performance is fast"
        result = analyze_feedback(text)
        
        assert "themes" in result
        assert len(result["themes"]) > 0
        # Should extract nouns/adjectives
        themes_lower = [theme.lower() for theme in result["themes"]]
        assert any(word in themes_lower for word in ["interface", "performance", "user"])
    
    def test_recommendation_generation(self):
        """Test recommendation generation logic"""
        text = "The app is good but could use more features"
        result = analyze_feedback(text)
        
        assert "recommendations" in result
        assert isinstance(result["recommendations"], list)
        assert len(result["recommendations"]) > 0
    
    def test_recommendation_based_on_sentiment(self):
        """Test recommendations vary based on sentiment"""
        positive_text = "Excellent app! Love everything about it!"
        negative_text = "Terrible app. Nothing works properly."
        
        positive_result = analyze_feedback(positive_text)
        negative_result = analyze_feedback(negative_text)
        
        # Both should have recommendations
        assert len(positive_result["recommendations"]) > 0
        assert len(negative_result["recommendations"]) > 0
        
        # Recommendations should be different based on sentiment
        assert positive_result["recommendations"] != negative_result["recommendations"]
    
    def test_empty_text_handling(self):
        """Test handling of empty text"""
        text = ""
        result = analyze_feedback(text)
        
        # Should not crash, should return valid structure
        assert "sentiment_score" in result
        assert "themes" in result
        assert "recommendations" in result
        assert isinstance(result["themes"], list)
        assert isinstance(result["recommendations"], list)
    
    def test_special_characters_handling(self):
        """Test handling of special characters"""
        text = "Great app!!! 😊 #awesome @developer"
        result = analyze_feedback(text)
        
        # Should not crash
        assert "sentiment_score" in result
        assert "themes" in result
        assert "recommendations" in result
    
    def test_very_long_text_handling(self):
        """Test handling of very long text"""
        text = "This is a test. " * 100  # 100 repetitions
        result = analyze_feedback(text)
        
        # Should not crash
        assert "sentiment_score" in result
        assert "themes" in result
        assert "recommendations" in result
    
    def test_result_structure(self):
        """Test that result has all required fields"""
        text = "Test feedback message"
        result = analyze_feedback(text)
        
        required_fields = ["sentiment_score", "sentiment_label", "themes", "recommendations"]
        for field in required_fields:
            assert field in result
        
        # Check types
        assert isinstance(result["sentiment_score"], (int, float))
        assert isinstance(result["sentiment_label"], str)
        assert isinstance(result["themes"], list)
        assert isinstance(result["recommendations"], list)
    
    def test_sentiment_score_range(self):
        """Test sentiment score is within valid range"""
        texts = [
            "Amazing wonderful excellent",
            "Terrible horrible awful",
            "Okay fine normal"
        ]
        
        for text in texts:
            result = analyze_feedback(text)
            # Sentiment score should be between -1 and 1
            assert -1 <= result["sentiment_score"] <= 1
