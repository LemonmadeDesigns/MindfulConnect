# backend/app/models/schemas/chat.py

# Import required dependencies
from datetime import datetime
from typing import Optional, Dict, List
from pydantic import BaseModel, Field
from ..base import MongoBaseModel, PyObjectId

# Message model for chat interactions
class Message(BaseModel):
    # MongoDB document ID
    # id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    # Reference to user who sent/received message
    user_id: PyObjectId
    # Message content
    content: str
    # Flag to distinguish between user and bot messages
    is_bot: bool = False
    # Message classification (general, check_in, crisis, support)
    message_type: str = "general"
    # Message timestamp
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # Model configuration for MongoDB compatibility
    model_config = {
        "json_schema_extra": {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "user_id": "507f1f77bcf86cd799439012",
                "content": "Hello, how are you?",
                "is_bot": False,
                "message_type": "general",
                "timestamp": "2024-01-01T00:00:00"
            }
        }
    }

# Check-in model for daily user assessments
class CheckIn(BaseModel):
    # MongoDB document ID
    # id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    # Reference to user
    user_id: PyObjectId
    # Check-in completion status
    completed: bool = False
    # Store responses to check-in questions
    responses: Dict[str, str] = {}
    # Mood score from 1-10
    mood_score: Optional[int] = None
    # Anxiety level from 1-10
    anxiety_level: Optional[int] = None
    # Sleep quality from 1-10
    sleep_quality: Optional[int] = None
    # Check-in timestamp
    date: datetime = Field(default_factory=datetime.utcnow)
    
    # Model configuration
    model_config = {
        "json_schema_extra": {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "user_id": "507f1f77bcf86cd799439012",
                "completed": False,
                "responses": {},
                "mood_score": 7,
                "anxiety_level": 3,
                "sleep_quality": 8,
                "date": "2024-01-01T00:00:00"
            }
        }
    }

# Model for chatbot responses
class ChatResponse(BaseModel):
    # Response message content
    message: str
    # Message type for client handling
    message_type: str
    # Optional list of suggested actions
    suggestions: Optional[List[str]] = None
    # Optional resources keyed by type
    resources: Optional[Dict[str, str]] = None
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "message": "How can I help you today?",
                "message_type": "general",
                "suggestions": ["Tell me more", "I need help"],
                "resources": {"support": "Available 24/7"}
            }
        }
    }