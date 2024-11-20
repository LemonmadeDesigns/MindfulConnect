# backend/app/models/support_group.py

# Import required dependencies
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from .user import PyObjectId

# Model for support group definition
class SupportGroup(BaseModel):
    # MongoDB document ID
    # id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    # Group name
    name: str
    # Group type identifier (CGA, AA, NA, EI, AM)
    type: str  
    # Detailed group description
    description: str
    # List of scheduled meeting times
    meeting_times: list[str]
    # Group active status
    is_active: bool = True
    # Group creation timestamp
    created_at: datetime = Field(default_factory=datetime.utcnow)
    # Maximum number of participants (optional)
    max_participants: Optional[int] = None
    # Reference to group facilitator
    facilitator_id: Optional[PyObjectId] = None
    
    model_config = {
        "populate_by_name": True,
        "json_encoders": {PyObjectId: str}
    }

# Model for user membership in support groups
class GroupMembership(BaseModel):
    # MongoDB document ID
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    # Reference to support group
    group_id: PyObjectId
    # Reference to member user
    user_id: PyObjectId
    # Membership start timestamp
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    # Membership status
    is_active: bool = True
    # Member role (member/facilitator)
    role: str = "member"  
    
    model_config = {
        "populate_by_name": True,
        "json_encoders": {PyObjectId: str}
    }