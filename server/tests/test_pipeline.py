from feedback_pipeline import analyze_feedback

def test_analyze_feedback_structure():
    result = analyze_feedback("Test feedback")
    assert "sentiment_score" in result
    assert "sentiment_label" in result
    assert "themes" in result
    assert "recommendations" in result
    
    # Verify types
    assert isinstance(result["sentiment_score"], (int, float))
    assert isinstance(result["sentiment_label"], str)
    assert isinstance(result["themes"], list)
    assert isinstance(result["recommendations"], list)
