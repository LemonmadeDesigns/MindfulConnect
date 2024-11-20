# backend/app/db/reset_db.py

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from ..core.config import settings
import logging
from .init_db import init_db

logger = logging.getLogger(__name__)

async def reset_db():
    """Reset database by dropping all collections and reinitializing"""
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]
    
    try:
        # Drop all collections
        collections = await db.list_collection_names()
        for collection in collections:
            await db[collection].drop()
            logger.info(f"Dropped collection: {collection}")
        
        # Reinitialize database
        await init_db()
        
        logger.info("Database reset successfully")
    except Exception as e:
        logger.error(f"Database reset error: {str(e)}")
        raise
    finally:
        client.close()

def run_reset():
    """Run database reset"""
    asyncio.run(reset_db())

if __name__ == "__main__":
    run_reset()