# backend/app/api/endpoints/support_groups.py

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from ...models.user import UserInDB
from ...models.support_group import SupportGroup, GroupMembership
from ...db.mongodb import get_database
from ...api.deps import get_current_user
from bson import ObjectId
import logging
from pydantic import BaseModel

router = APIRouter()
logger = logging.getLogger(__name__)

class CreateSupportGroup(BaseModel):
    """Request model for creating a support group"""
    name: str
    type: str  # CGA, AA, NA, EI, AM
    description: str
    meeting_times: List[str]
    max_participants: Optional[int] = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "name": "Alcoholics Anonymous Group 1",
                "type": "AA",
                "description": "Weekly support group for alcohol recovery",
                "meeting_times": ["Monday 18:00", "Thursday 18:00"],
                "max_participants": 20
            }
        }
    }

@router.get("/", response_model=List[SupportGroup])
async def get_support_groups(
    group_type: Optional[str] = Query(
        None,
        description="Filter by group type: CGA, AA, NA, EI, AM"
    ),
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get available support groups with optional type filter."""
    try:
        query = {"is_active": True}
        if group_type:
            query["type"] = group_type.upper()
        
        cursor = db["support_groups"].find(query)
        groups = await cursor.to_list(length=100)
        return [SupportGroup(**group) for group in groups]
    except Exception as e:
        logger.error(f"Error retrieving support groups: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.post("/", response_model=SupportGroup)
async def create_support_group(
    group: CreateSupportGroup,
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_database)
):
    """Create a new support group."""
    try:
        group_data = group.model_dump()
        group_data["is_active"] = True
        group_data["created_at"] = datetime.utcnow()
        group_data["facilitator_id"] = current_user.id

        result = await db["support_groups"].insert_one(group_data)
        created_group = await db["support_groups"].find_one(
            {"_id": result.inserted_id}
        )
        
        return SupportGroup(**created_group)
    except Exception as e:
        logger.error(f"Error creating support group: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# ... [remaining endpoints]

@router.get("/groups/", response_model=List[SupportGroup])
async def get_support_groups(
    group_type: Optional[str] = Query(None, description="Filter by group type: CGA, AA, NA, EI, AM"),
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get available support groups with optional type filter."""
    try:
        query = {"is_active": True}
        if group_type:
            query["type"] = group_type.upper()
        
        cursor = db["support_groups"].find(query)
        groups = await cursor.to_list(length=100)
        return groups
    except Exception as e:
        logger.error(f"Error getting support groups: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post(
    "/groups/{group_id}/join",
    operation_id="join_support_group"  # Unique operation ID
)
async def join_support_group(
    group_id: str,
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_database)
):
    """Join a support group."""
    try:
        # Check if group exists
        group = await db["support_groups"].find_one({"_id": ObjectId(group_id)})
        if not group:
            raise HTTPException(status_code=404, detail="Support group not found")
        
        # Check if user is already a member
        existing_membership = await db["group_memberships"].find_one({
            "group_id": ObjectId(group_id),
            "user_id": current_user.id,
            "is_active": True
        })
        
        if existing_membership:
            raise HTTPException(
                status_code=400,
                detail="Already a member of this group"
            )
        
       # Create membership
        membership = GroupMembership(
            group_id=ObjectId(group_id),
            user_id=current_user.id,
            joined_at=datetime.utcnow(),
            role="member"
        )
        
        await db["group_memberships"].insert_one(membership.dict(by_alias=True))
        return {"status": "success", "message": "Successfully joined group"}
        
    except Exception as e:
        logger.error(f"Error joining group: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get(
    "/groups/{group_id}/meetings",
    operation_id="get_group_meetings_schedule"  # Changed operation ID to be unique
)
async def get_group_meetings(
    group_id: str,
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get upcoming meetings for a support group."""
    # Verify membership
    try:
        # Verify membership
        membership = await db["group_memberships"].find_one({
            "group_id": ObjectId(group_id),
            "user_id": current_user.id,
            "is_active": True
        })
        
        if not membership:
            raise HTTPException(
                status_code=403,
                detail="Must be a group member to view meetings"
            )
        
        # Get upcoming meetings
        now = datetime.utcnow()
        cursor = db["group_meetings"].find({
            "group_id": ObjectId(group_id),
            "start_time": {"$gte": now}
        }).sort("start_time", 1)
        
        meetings = await cursor.to_list(length=10)
        return meetings
    except Exception as e:
        logger.error(f"Error getting meetings: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post(
    "/groups/{group_id}/share",
    operation_id="create_group_share"  # Changed operation ID to be unique
)
async def share_in_group(
    group_id: str,
    content: str,
    anonymous: bool = False,
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_database)
):
    """Share a message in a support group."""
    # Verify membership
    try:
        # Verify membership
        membership = await db["group_memberships"].find_one({
            "group_id": ObjectId(group_id),
            "user_id": current_user.id,
            "is_active": True
        })
        
        if not membership:
            raise HTTPException(
                status_code=403,
                detail="Must be a group member to share"
            )
        
        # Create share
        share = {
            "group_id": ObjectId(group_id),
            "user_id": current_user.id if not anonymous else None,
            "content": content,
            "anonymous": anonymous,
            "timestamp": datetime.utcnow()
        }
        
        await db["group_shares"].insert_one(share)
        return {"status": "success", "message": "Successfully shared in group"}
    except Exception as e:
        logger.error(f"Error sharing in group: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# backend/app/api/endpoints/support_groups.py (continued)

# Endpoint to get group activity
@router.get("/groups/{group_id}/activity")
async def get_group_activity(
    group_id: str,
    limit: int = 50,
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get recent activity in a support group."""
    try:
        # Verify membership
        membership = await db["group_memberships"].find_one({
            "group_id": ObjectId(group_id),
            "user_id": current_user.id,
            "is_active": True
        })
        
        if not membership:
            raise HTTPException(
                status_code=403,
                detail="Must be a group member to view activity"
            )
        
        # Get recent shares
        cursor = db["group_shares"].find({
            "group_id": ObjectId(group_id)
        }).sort("timestamp", -1).limit(limit)
        
        activity = await cursor.to_list(length=limit)
        return activity
        
    except Exception as e:
        logger.error(f"Error getting group activity: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
        