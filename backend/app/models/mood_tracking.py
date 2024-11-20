# backend/app/models/mood_tracking.py

from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel, Field
from .base import MongoBaseModel, PyObjectId

class MoodEntry(MongoBaseModel):
    """Model for individual mood entries"""
    user_id: PyObjectId
    mood_score: int = Field(..., ge=1, le=10)
    mood_description: str
    activities: List[str] = []
    emotions: List[str] = []
    sentiment_score: Optional[float] = None
    ai_analysis: Optional[Dict] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    model_config = {
        "json_schema_extra": {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "user_id": "507f1f77bcf86cd799439012",
                "mood_score": 7,
                "mood_description": "Feeling good today",
                "activities": ["exercise", "meditation"],
                "emotions": ["happy", "energetic"],
                "sentiment_score": 0.8,
                "timestamp": "2024-01-01T00:00:00"
            }
        }
    }

class MoodAnalysis(BaseModel):
    """Model for aggregated mood analysis"""
    overall_sentiment: float
    identified_emotions: List[str]
    triggers: List[str]
    suggestions: List[str]
    risk_level: str  # low, medium, high

    model_config = {
        "json_schema_extra": {
            "example": {
                "overall_sentiment": 0.75,
                "identified_emotions": ["happy", "calm", "focused"],
                "triggers": ["exercise", "good sleep"],
                "suggestions": ["Continue regular exercise", "Maintain sleep schedule"],
                "risk_level": "low"
            }
        }
    }

class MoodPattern(BaseModel):
    """Model for identifying mood patterns"""
    trigger: str
    frequency: int
    average_mood_score: float
    common_emotions: List[str]
    time_patterns: Dict[str, int]

class MoodGoal(MongoBaseModel):
    """Model for mood improvement goals"""
    user_id: PyObjectId
    title: str
    description: str
    target_mood_score: Optional[int] = None
    start_date: datetime
    end_date: Optional[datetime] = None
    status: str = "active"
    progress_notes: List[Dict] = []

    model_config = {
        "json_schema_extra": {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "user_id": "507f1f77bcf86cd799439012",
                "title": "Improve Morning Mood",
                "description": "Work on having better mornings",
                "target_mood_score": 8,
                "start_date": "2024-01-01T00:00:00",
                "status": "active"
            }
        }
    }