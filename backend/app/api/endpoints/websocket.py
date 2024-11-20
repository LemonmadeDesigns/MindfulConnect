# backend/app/api/endpoints/websocket.py

# Import required dependencies
from http.client import HTTPException
from fastapi import APIRouter, WebSocket, Depends, WebSocketDisconnect
from typing import Dict, List
from ...models.user import UserInDB
from ...api.deps import get_current_user
import json
import logging

# Initialize router and logger
router = APIRouter()
logger = logging.getLogger(__name__)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        """Initialize connection manager."""
        # Store active connections by user ID
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        """Connect new WebSocket client."""
        try:
            # Accept WebSocket connection
            await websocket.accept()
            # Initialize user connections list if needed
            if user_id not in self.active_connections:
                self.active_connections[user_id] = []
            # Add connection to user's list
            self.active_connections[user_id].append(websocket)
            logger.info(f"New WebSocket connection for user {user_id}")
        except Exception as e:
            logger.error(f"Error connecting WebSocket: {str(e)}")
            await websocket.close()

    def disconnect(self, websocket: WebSocket, user_id: str):
        """Disconnect WebSocket client."""
        try:
            if user_id in self.active_connections:
                # Remove connection from user's list
                self.active_connections[user_id].remove(websocket)
                # Clean up empty user entries
                if not self.active_connections[user_id]:
                    del self.active_connections[user_id]
            logger.info(f"WebSocket disconnected for user {user_id}")
        except Exception as e:
            logger.error(f"Error disconnecting WebSocket: {str(e)}")

    async def send_personal_message(self, message: dict, user_id: str):
        """Send message to specific user's connections."""
        try:
            if user_id in self.active_connections:
                # Send to all user's connections
                for connection in self.active_connections[user_id]:
                    try:
                        await connection.send_json(message)
                    except Exception as e:
                        logger.error(
                            f"Error sending message to connection: {str(e)}"
                        )
                        # Remove failed connection
                        await self.handle_failed_connection(
                            connection, 
                            user_id
                        )
        except Exception as e:
            logger.error(f"Error sending personal message: {str(e)}")

    async def handle_failed_connection(
        self, 
        websocket: WebSocket, 
        user_id: str
    ):
        """Handle failed connections."""
        try:
            # Close failed connection
            await websocket.close()
            # Remove from active connections
            self.disconnect(websocket, user_id)
        except Exception as e:
            logger.error(f"Error handling failed connection: {str(e)}")

    async def broadcast(self, message: dict):
        """Broadcast message to all connected clients."""
        try:
            for user_id in self.active_connections:
                await self.send_personal_message(message, user_id)
        except Exception as e:
            logger.error(f"Error broadcasting message: {str(e)}")

# Initialize connection manager
manager = ConnectionManager()

# WebSocket endpoint
@router.websocket("/ws/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str):
    """Handle WebSocket connections."""
    try:
        # Verify token and get user
        user = await get_current_user(token)
        # Connect WebSocket
        await manager.connect(websocket, str(user.id))
        
        try:
            while True:
                # Receive and process messages
                data = await websocket.receive_text()
                try:
                    # Parse message data
                    message_data = json.loads(data)
                    # Process message
                    await manager.send_personal_message(
                        {
                            "message": "Data received",
                            "data": message_data
                        },
                        str(user.id)
                    )
                except json.JSONDecodeError:
                    logger.error("Invalid JSON received")
                
        except WebSocketDisconnect:
            # Handle disconnection
            manager.disconnect(websocket, str(user.id))
            
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        await websocket.close()

# Health check endpoint for WebSocket
@router.get("/ws/health")
async def websocket_health():
    """Check WebSocket service health."""
    try:
        return {
            "status": "healthy",
            "active_connections": sum(
                len(connections) 
                for connections in manager.active_connections.values()
            ),
            "connected_users": len(manager.active_connections)
        }
    except Exception as e:
        logger.error(f"Error checking WebSocket health: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )