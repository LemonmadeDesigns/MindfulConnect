# backend/app/services/mock_sentiment_analysis.py

from typing import Dict, List, Tuple
import random
from datetime import datetime

class MockSentimentAnalyzer:
    """
    Mock sentiment analyzer for development and testing
    Provides realistic-looking sentiment analysis without API calls
    """
    
    def __init__(self):
        """Initialize mock data arrays for generating responses"""
        # Possible emotions for analysis
        self.emotions = [
            "happy", "sad", "anxious", "calm", "frustrated",
            "excited", "tired", "hopeful", "worried", "content"
        ]
        
        # Coping strategy suggestions
        self.coping_strategies = [
            "Take a 10-minute walk outside",
            "Practice deep breathing exercises",
            "Write in your journal",
            "Talk to a friend or family member",
            "Listen to calming music",
            "Do some light stretching",
            "Try a mindfulness meditation",
            "Make a cup of herbal tea",
            "Draw or color for relaxation",
            "Practice progressive muscle relaxation"
        ]
        
        # Common mood triggers
        self.triggers = [
            "work stress", "relationship issues",
            "lack of sleep", "health concerns",
            "financial worry", "family matters",
            "social situations", "past experiences",
            "future uncertainty", "daily responsibilities"
        ]

    async def analyze_mood_entry(self, description: str) -> Tuple[float, Dict]:
        """
        Generate mock sentiment analysis for mood description
        
        Args:
            description: User's mood description text
            
        Returns:
            Tuple of (sentiment_score, detailed_analysis)
        """
        # Generate random sentiment score
        sentiment_score = round(random.uniform(-1, 1), 2)
        
        # Check for risk keywords
        risk_keywords = ["hopeless", "worthless", "suicide", "die", "end it"]
        risk_level = "low"
        if any(word in description.lower() for word in risk_keywords):
            risk_level = "high"
        elif sentiment_score < -0.6:
            risk_level = "medium"
        
        # Generate random emotions and triggers
        selected_emotions = random.sample(self.emotions, random.randint(2, 4))
        selected_triggers = random.sample(self.triggers, random.randint(1, 3))
        
        # Select random coping suggestions
        suggestions = random.sample(self.coping_strategies, 3)
        
        # Compile analysis results
        analysis = {
            "sentiment_score": sentiment_score,
            "emotions": selected_emotions,
            "triggers": selected_triggers,
            "suggestions": suggestions,
            "risk_level": risk_level,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        return sentiment_score, analysis

    async def generate_coping_strategies(self, mood_data: dict) -> List[str]:
        """
        Generate appropriate coping strategies based on mood
        
        Args:
            mood_data: Dictionary containing mood information
            
        Returns:
            List of suggested coping strategies
        """
        # Get mood score or default to medium mood
        mood_score = mood_data.get("mood_score", 5)
        
        if mood_score <= 3:
            # Strategies for low mood
            strategies = [
                "Call or message a supportive friend",
                "Go for a 10-minute walk, even if inside",
                "Do one small task you've been putting off"
            ]
        elif mood_score <= 6:
            # Strategies for moderate mood
            strategies = [
                "Practice 5 minutes of deep breathing",
                "Write down three things you're grateful for",
                "Take a short break to stretch"
            ]
        else:
            # Strategies for good mood
            strategies = [
                "Continue your positive activities",
                "Share your good mood with others",
                "Plan something enjoyable for tomorrow"
            ]
            
        return strategies