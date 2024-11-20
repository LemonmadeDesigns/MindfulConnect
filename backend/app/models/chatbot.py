# backend/app/models/chatbot.py
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from .user import PyObjectId

class Message(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    content: str
    is_bot: bool = False
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    message_type: str = "general"  # general, check_in, crisis, support
    
    class Config:
        populate_by_name = True
        json_encoders = {PyObjectId: str}

class CheckIn(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    completed: bool = False
    mood_score: Optional[int] = None
    sleep_quality: Optional[int] = None
    anxiety_level: Optional[int] = None
    date: datetime = Field(default_factory=datetime.utcnow)
    responses: dict = {}
    
    class Config:
        populate_by_name = True
        json_encoders = {PyObjectId: str}
        