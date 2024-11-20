# backend/app/db/setup.py

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from ..core.config import settings
import logging

logger = logging.getLogger(__name__)

async def init_db():
    """Initialize database with required collections and indexes"""
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]
    
    try:
        # Create indexes
        await db.users.create_index("email", unique=True)
        await db.users.create_index("username", unique=True)
        await db.mood_entries.create_index([("user_id", 1), ("timestamp", -1)])
        await db.support_groups.create_index("type")
        await db.messages.create_index([("user_id", 1), ("timestamp", -1)])
        
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization error: {str(e)}")
        raise
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(init_db())