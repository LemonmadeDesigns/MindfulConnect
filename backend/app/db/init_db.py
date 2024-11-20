# backend/app/db/init_db.py

import asyncio
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from ..core.config import settings
from datetime import datetime

logger = logging.getLogger(__name__)

async def init_db():
    """Initialize database with required collections and indexes"""
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]
    
    try:
        # Create collections (if they don't exist)
        collections = [
            "users",
            "mood_entries",
            "support_groups",
            "group_memberships",
            "messages",
            "checkins",
            "chat_contexts"
        ]
        
        for collection in collections:
            if collection not in await db.list_collection_names():
                await db.create_collection(collection)
                logger.info(f"Created collection: {collection}")
        
        # Create indexes
        await db.users.create_index("email", unique=True)
        await db.users.create_index("username", unique=True)
        await db.mood_entries.create_index([("user_id", 1), ("timestamp", -1)])
        await db.support_groups.create_index("type")
        await db.messages.create_index([("user_id", 1), ("timestamp", -1)])
        
        # Create initial support groups
        support_groups = [
            {
                "name": "Criminal & Gang Anonymous",
                "type": "CGA",
                "description": "Support group for those affected by gang activity",
                "meeting_times": ["Monday 18:00", "Thursday 18:00"],
                "is_active": True,
                "created_at": datetime.utcnow()
            },
            {
                "name": "Alcoholics Anonymous",
                "type": "AA",
                "description": "Support group for alcohol recovery",
                "meeting_times": ["Tuesday 19:00", "Friday 19:00"],
                "is_active": True,
                "created_at": datetime.utcnow()
            },
            {
                "name": "Narcotics Anonymous",
                "type": "NA",
                "description": "Support group for drug recovery",
                "meeting_times": ["Wednesday 19:00", "Saturday 15:00"],
                "is_active": True,
                "created_at": datetime.utcnow()
            },
            {
                "name": "Emotional Intelligence",
                "type": "EI",
                "description": "Group for developing emotional intelligence",
                "meeting_times": ["Monday 17:00", "Wednesday 17:00"],
                "is_active": True,
                "created_at": datetime.utcnow()
            },
            {
                "name": "Anger Management",
                "type": "AM",
                "description": "Support group for anger management",
                "meeting_times": ["Tuesday 18:00", "Thursday 18:00"],
                "is_active": True,
                "created_at": datetime.utcnow()
            }
        ]
        
        # Insert support groups if they don't exist
        for group in support_groups:
            await db.support_groups.update_one(
                {"type": group["type"]},
                {"$setOnInsert": group},
                upsert=True
            )
        
        logger.info("Database initialized successfully")
        
    except Exception as e:
        logger.error(f"Database initialization error: {str(e)}")
        raise
    finally:
        client.close()

def run_init():
    """Run database initialization"""
    asyncio.run(init_db())

if __name__ == "__main__":
    run_init()