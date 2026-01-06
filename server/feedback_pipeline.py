import asyncio
import json
import re
from typing import Dict, List, Tuple
from textblob import TextBlob
import nltk
from collections import Counter
from datetime import datetime
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.tag import pos_tag

def analyze_sentiment(message: str) -> Tuple[float, str]:
    """
    Analyze sentiment using TextBlob
    Returns: (sentiment_score, sentiment_label)
    """
    blob = TextBlob(message)
    polarity = blob.sentiment.polarity  # Range: -1 (negative) to 1 (positive)
    
    # Classify sentiment
    if polarity > 0.1:
        label = "positive"
    elif polarity < -0.1:
        label = "negative"
    else:
        label = "neutral"
    
    return polarity, label

def extract_themes(message: str) -> List[str]:
    """
    Extract key themes and topics from feedback using NLTK
    """
    # Clean and tokenize text
    text = message.lower()
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    tokens = word_tokenize(text)
    
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [word for word in tokens if word not in stop_words and len(word) > 2]
    
    # Get part-of-speech tags and extract nouns and adjectives
    pos_tags = pos_tag(filtered_tokens)
    themes = [word for word, pos in pos_tags if pos.startswith('NN') or pos.startswith('JJ')]
    
    # Count frequency and return top themes
    theme_counts = Counter(themes)
    top_themes = [theme for theme, count in theme_counts.most_common(5)]
    
    return top_themes

def generate_recommendations(message: str, sentiment_score: float, themes: List[str]) -> List[str]:
    """
    Generate actionable recommendations based on feedback analysis
    """
    recommendations = []
    
    # Sentiment-based recommendations
    if sentiment_score < -0.3:
        recommendations.append("Address negative feedback promptly to improve user satisfaction")
        recommendations.append("Investigate underlying issues mentioned in this feedback")
    elif sentiment_score > 0.3:
        recommendations.append("Leverage positive aspects mentioned to enhance similar features")
        recommendations.append("Consider this feedback for testimonials or case studies")
    else:
        recommendations.append("Follow up with user to gather more specific feedback")
    
    # Theme-based recommendations
    common_improvement_themes = ['bug', 'error', 'slow', 'difficult', 'confusing', 'problem']
    common_feature_themes = ['feature', 'functionality', 'option', 'tool', 'capability']
    
    if any(theme in themes for theme in common_improvement_themes):
        recommendations.append("Prioritize technical improvements and bug fixes")
    
    if any(theme in themes for theme in common_feature_themes):
        recommendations.append("Consider feature enhancement or new feature development")
    
    # Length-based recommendations
    if len(message.split()) > 50:
        recommendations.append("Detailed feedback - schedule follow-up discussion with user")
    
    return recommendations[:3]  # Return top 3 recommendations

def analyze_feedback(message: str) -> Dict:
    """
    Complete feedback analysis pipeline
    Input: feedback message
    Output: dict with sentiment, topics, recommendations, etc.
    """
    print("starting analyze_feedback")
    try:
        # Analyze sentiment
        sentiment_score, sentiment_label = analyze_sentiment(message)
        print(f"sentiment_score: {str(sentiment_score)}")
        # Extract themes
        themes = extract_themes(message)
        
        # Generate recommendations
        recommendations = generate_recommendations(message, sentiment_score, themes)
        
        return {
            "sentiment_score": sentiment_score,
            "sentiment_label": sentiment_label,
            "themes": themes,
            "recommendations": recommendations,
            "processed_at": datetime.utcnow().isoformat()
        }
    
    except Exception as e:
        print(f"Error analyzing feedback: {str(e)}")
        return {
            "sentiment_score": 0.0,
            "sentiment_label": "neutral",
            "themes": [],
            "recommendations": ["Error processing feedback - manual review required"],
            "processed_at": datetime.utcnow().isoformat()
        }

async def process_feedback_async(feedback_id: int, message: str, db_session):
    """
    Asynchronous feedback processing function
    """
    from database import Insight
    
    try:
        # Analyze feedback
        analysis = analyze_feedback(message)
        
        # Create insight record
        insight = Insight(
            feedback_id=feedback_id,
            sentiment_score=analysis["sentiment_score"],
            sentiment_label=analysis["sentiment_label"],
            themes=json.dumps(analysis["themes"]),
            recommendations=json.dumps(analysis["recommendations"])
        )
        
        # Save to database
        db_session.add(insight)
        db_session.commit()
        
        print(f"Insight processing completed for feedback {feedback_id}")
        
    except Exception as e:
        print(f"Error in async processing for feedback {feedback_id}: {str(e)}")
        db_session.rollback()
