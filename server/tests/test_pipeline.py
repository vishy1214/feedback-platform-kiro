from feedback_pipeline import analyze_feedback

def test_analyze_feedback_structure():
    result = analyze_feedback("Test feedback")
    assert "sentiment" in result
    assert "topics" in result
    assert "recommendations" in result
