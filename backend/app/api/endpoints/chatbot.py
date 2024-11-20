# backend/app/api/endpoints/chatbot.py

# Import required dependencies
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime
from ...models.schemas.chat import Message, CheckIn, ChatResponse
from ...models.user import UserInDB
from ...db.mongodb import get_database
from ...api.deps import get_current_user
from ...services.chatbot_service import ChatbotService

# Initialize router and chatbot service
router = APIRouter()
chatbot_service = ChatbotService()

# Endpoint to send message to chatbot
@router.post("/message/", response_model=Message)
async def send_message(
    # Message content from user
    content: str,
    # Require authenticated user
    current_user: UserInDB = Depends(get_current_user),
    # Get database connection
    db = Depends(get_database)
):
    """Send a message to the chatbot and get a response."""
    try:
        # Get user's chat context
        user_context = await db["chat_contexts"].find_one(
            {"user_id": current_user.id}
        ) or {}
        
        # Create and save user's message
        user_message = Message(
            user_id=current_user.id,
            content=content,
            is_bot=False
        )
        await db["messages"].insert_one(user_message.dict(by_alias=True))
        
        # Get bot response
        response_text, message_type = await chatbot_service.get_response(
            content, user_context
        )
        
        # Create and save bot's response
        bot_message = Message(
            user_id=current_user.id,
            content=response_text,
            is_bot=True,
            message_type=message_type
        )
        await db["messages"].insert_one(bot_message.dict(by_alias=True))
        
        # Update context if check-in
        if message_type == "check_in":
            await db["chat_contexts"].update_one(
                {"user_id": current_user.id},
                {"$set": user_context},
                upsert=True
            )
        
        return bot_message
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing message: {str(e)}"
        )

# Endpoint to start daily check-in
@router.post("/checkin/start/", response_model=Message)
async def start_checkin(
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_database)
):
    """Start daily check-in process."""
    try:
        # Check if already completed today
        today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        existing_checkin = await db["checkins"].find_one({
            "user_id": current_user.id,
            "date": {"$gte": today_start}
        })
        
        if existing_checkin and existing_checkin.get("completed"):
            raise HTTPException(
                status_code=400,
                detail="Daily check-in already completed"
            )
        
        # Start new check-in
        response_text, context = await chatbot_service.start_daily_checkin()
        
        # Save context
        await db["chat_contexts"].update_one(
            {"user_id": current_user.id},
            {"$set": context},
            upsert=True
        )
        
        # Create check-in record
        checkin = CheckIn(user_id=current_user.id)
        await db["checkins"].insert_one(checkin.dict(by_alias=True))
        
        # Return bot message
        return Message(
            user_id=current_user.id,
            content=response_text,
            is_bot=True,
            message_type="check_in"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error starting check-in: {str(e)}"
        )

# Endpoint to get chat history
@router.get("/messages/", response_model=List[Message])
async def get_messages(
    limit: int = 50,
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get recent chat messages."""
    try:
        # Get messages sorted by timestamp
        cursor = db["messages"].find(
            {"user_id": current_user.id}
        ).sort("timestamp", -1).limit(limit)
        
        return await cursor.to_list(length=limit)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching messages: {str(e)}"
        )

# Endpoint to get check-in history
@router.get("/checkins/", response_model=List[CheckIn])
async def get_checkins(
    limit: int = 7,
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get recent check-ins."""
    try:
        # Get check-ins sorted by date
        cursor = db["checkins"].find(
            {"user_id": current_user.id}
        ).sort("date", -1).limit(limit)
        
        return await cursor.to_list(length=limit)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching check-ins: {str(e)}"
        )