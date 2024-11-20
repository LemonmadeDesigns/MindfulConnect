# backend/app/db/mongodb.py

from motor.motor_asyncio import AsyncIOMotorClient
from ..core.config import settings
import logging

logger = logging.getLogger(__name__)

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

mongodb = MongoDB()

async def connect_to_mongo():
    """
    Connect to MongoDB
    """
    try:
        mongodb.client = AsyncIOMotorClient(settings.MONGODB_URL)
        mongodb.db = mongodb.client[settings.MONGODB_DB_NAME]
        logger.info("Connected to MongoDB")
    except Exception as e:
        logger.error(f"Error connecting to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """
    Close MongoDB connection
    """
    if mongodb.client:
        mongodb.client.close()
        mongodb.client = None
        mongodb.db = None
        logger.info("Closed MongoDB connection")

async def get_database():
    """
    Get database instance
    """
    if mongodb.client is None:
        await connect_to_mongo()
    return mongodb.db

def get_client() -> AsyncIOMotorClient:
    """
    Get MongoDB client instance
    """
    return mongodb.client