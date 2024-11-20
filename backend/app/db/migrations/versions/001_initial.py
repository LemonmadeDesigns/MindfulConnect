# backend/app/db/migrations/versions/001_initial.py

"""Initial migration

Revision ID: 001
Revises: None
Create Date: 2024-01-01
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from ....core.config import settings

async def upgrade():
    """Run migration"""
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]
    
    # Create initial support groups
    support_groups = [
        {
            "name": "Criminal & Gang Anonymous",
            "type": "CGA",
            "description": "Support group for those affected by gang activity",
            "meeting_times": ["Monday 18:00", "Thursday 18:00"],
            "is_active": True
        },
        {
            "name": "Alcoholics Anonymous",
            "type": "AA",
            "description": "Support group for alcohol recovery",
            "meeting_times": ["Tuesday 19:00", "Friday 19:00"],
            "is_active": True
        }
        # Add more groups as needed
    ]
    
    await db.support_groups.insert_many(support_groups)
    client.close()