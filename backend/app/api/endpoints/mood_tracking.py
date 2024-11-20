# backend/app/api/endpoints/mood_tracking.py

from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime, timedelta
from ...models.mood_tracking import (
    MoodEntry, 
    MoodAnalysis,
    MoodPattern,
    MoodGoal
)
from ...models.user import UserInDB
from ...db.mongodb import get_database
from ...api.deps import get_current_user
from ...services.mock_sentiment_analysis import MockSentimentAnalyzer
from pydantic import BaseModel

router = APIRouter()
sentiment_analyzer = MockSentimentAnalyzer()

# Request models
class MoodEntryCreate(BaseModel):
    """Request model for creating mood entries"""
    mood_score: int
    mood_description: str
    activities: List[str] = []
    emotions: List[str] = []

    model_config = {
        "json_schema_extra": {
            "example": {
                "mood_score": 7,
                "mood_description": "Feeling good today",
                "activities": ["exercise", "meditation"],
                "emotions": ["happy", "energetic"]
            }
        }
    }

@router.post("/entries/", response_model=MoodEntry)
async def create_mood_entry(
    entry: MoodEntryCreate,
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_database)
):
    """Create a new mood entry with AI analysis."""
    try:
        # Analyze sentiment
        sentiment_score, analysis = await sentiment_analyzer.analyze_mood_entry(
            entry.mood_description
        )
        
        # Create mood entry
        mood_entry = MoodEntry(
            user_id=current_user.id,
            mood_score=entry.mood_score,
            mood_description=entry.mood_description,
            activities=entry.activities,
            emotions=entry.emotions,
            sentiment_score=sentiment_score,
            ai_analysis=analysis,
            timestamp=datetime.utcnow()
        )
        
        # Save to database
        result = await db["mood_entries"].insert_one(
            mood_entry.model_dump(by_alias=True)
        )
        
        # Return created entry
        created_entry = await db["mood_entries"].find_one(
            {"_id": result.inserted_id}
        )
        return MoodEntry(**created_entry)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating mood entry: {str(e)}"
        )

@router.get("/entries/", response_model=List[MoodEntry])
async def get_mood_entries(
    days: int = 7,
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get mood entries for the specified number of days."""
    try:
        # Calculate date range
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Fetch entries
        cursor = db["mood_entries"].find({
            "user_id": current_user.id,
            "timestamp": {"$gte": start_date}
        }).sort("timestamp", -1)
        
        entries = await cursor.to_list(length=100)
        return [MoodEntry(**entry) for entry in entries]
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving mood entries: {str(e)}"
        )

@router.get("/analysis/", response_model=MoodAnalysis)
async def get_mood_analysis(
    days: int = 7,
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get aggregated mood analysis for the specified period."""
    try:
        # Calculate date range
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Fetch entries
        entries = await db["mood_entries"].find({
            "user_id": current_user.id,
            "timestamp": {"$gte": start_date}
        }).to_list(length=None)
        
        if not entries:
            return MoodAnalysis(
                overall_sentiment=0.0,
                identified_emotions=[],
                triggers=[],
                suggestions=[
                    "Start tracking your moods regularly",
                    "Try to identify what affects your mood",
                    "Consider setting some mood-related goals"
                ],
                risk_level="low"
            )
        
        # Calculate average sentiment
        avg_sentiment = sum(
            entry.get("sentiment_score", 0) for entry in entries
        ) / len(entries)
        
        # Aggregate emotions and triggers
        all_emotions = []
        all_triggers = []
        for entry in entries:
            analysis = entry.get("ai_analysis", {})
            all_emotions.extend(analysis.get("emotions", []))
            all_triggers.extend(analysis.get("triggers", []))
        
        return MoodAnalysis(
            overall_sentiment=avg_sentiment,
            identified_emotions=list(set(all_emotions))[:5],
            triggers=list(set(all_triggers))[:5],
            suggestions=await sentiment_analyzer.generate_coping_strategies({
                "mood_score": sum(
                    entry.get("mood_score", 5) for entry in entries
                ) / len(entries)
            }),
            risk_level="low" if avg_sentiment > 0 else "medium"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting mood analysis: {str(e)}"
        )