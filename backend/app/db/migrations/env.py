# backend/app/db/migrations/env.py

from logging.config import fileConfig
from alembic import context
from motor.motor_asyncio import AsyncIOMotorClient
from ...core.config import settings
import asyncio
import logging

logger = logging.getLogger(__name__)

# Migration operations
async def upgrade_v1():
    """Initial database setup"""
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]
    
    try:
        # Create collections
        await db.create_collection("users")
        await db.create_collection("mood_entries")
        await db.create_collection("support_groups")
        await db.create_collection("group_memberships")
        await db.create_collection("messages")
        await db.create_collection("checkins")
        
        # Create indexes
        await db.users.create_index("email", unique=True)
        await db.users.create_index("username", unique=True)
        await db.mood_entries.create_index([("user_id", 1), ("timestamp", -1)])
        await db.support_groups.create_index("type")
        await db.messages.create_index([("user_id", 1), ("timestamp", -1)])
        
        logger.info("Successfully created database schema v1")
    except Exception as e:
        logger.error(f"Error creating schema: {str(e)}")
        raise
    finally:
        client.close()