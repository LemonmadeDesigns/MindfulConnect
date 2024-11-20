# backend/app/debug_auth.py

# Import required dependencies for debugging
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import asyncio

async def check_user(user_id):
    """
    Debug utility to check user data and associated tokens
    
    Args:
        user_id: MongoDB ObjectID of user to check
    
    Prints:
        - Full user document
        - Recent authentication tokens
    """
    # Create direct database connection for debugging
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.mindfulconnect
    
    # Check if user exists and print user data
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    print(f"User data: {user}")
    
    # Retrieve and print recent authentication tokens
    tokens = await db.tokens.find().to_list(length=10)
    print(f"Recent tokens: {tokens}")

# Debug script entry point
if __name__ == "__main__":
    # Replace with target user ID for debugging
    user_id = "67398d8f71d77409496ac1bc"
    asyncio.run(check_user(user_id))