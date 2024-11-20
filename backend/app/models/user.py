# backend/app/models/user.py

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, validator
from .base import MongoBaseModel, PyObjectId
from bson import ObjectId  # Add this import


class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool = True
    is_anonymous: bool = False

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one number')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c in '!@#$%^&*()' for c in v):
            raise ValueError('Password must contain at least one special character')
        return v

class UserInDB(MongoBaseModel, UserBase):
    hashed_password: str
    last_login: Optional[datetime] = None

    @classmethod
    def from_mongo(cls, data: dict):
        if not data:
            return None
        
        if "_id" in data:
            data["_id"] = str(data["_id"])
            
        return cls.model_validate(data)

class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = Field(None, min_length=8)

class UserResponse(UserBase):
    id: PyObjectId = Field(alias="_id")