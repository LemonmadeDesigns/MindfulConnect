# backend/app/api/endpoints/dashboard.py

# Import required dependencies
from asyncio.log import logger
from fastapi import APIRouter, Depends, Request, BackgroundTasks, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from typing import Optional
from datetime import datetime, timedelta
from .auth import require_user  # Add this import
from ...models.user import UserInDB
from ...services.analytics_service import AnalyticsService
from ...api.deps import get_current_user
from fastapi.security import OAuth2PasswordBearer
from .websocket import manager

import os
import json
import asyncio
import logging


# Initialize router and services
router = APIRouter()
analytics_service = AnalyticsService()

# Setup OAuth2 bearer token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"/api/v1/auth/token")

# Setup templates directory
logger = logging.getLogger(__name__)
templates = Jinja2Templates(directory="backend/app/templates")


# Background task for real-time stats updates
async def update_real_time_stats(user_id: str):
    """Background task to update real-time dashboard stats."""
    try:
        while True:
            # Get analytics data
            analytics = await analytics_service.get_user_analytics(user_id)
            current_mood = await analytics_service.get_current_mood(user_id)
            
            # Send updates via WebSocket
            await manager.send_personal_message({
                "active_sessions": len(
                    manager.active_connections.get(user_id, [])
                ),
                "recent_interactions": analytics["total_interactions"],
                "current_mood": current_mood,
                "activity_data": {
                    "labels": [f"{hour}:00" for hour in range(24)],
                    "datasets": [{
                        "label": "Activity Level",
                        "data": analytics["interaction_times"]["hour_distribution"]
                    }]
                },
                "mood_data": {
                    "labels": ["1-2", "3-4", "5-6", "7-8", "9-10"],
                    "datasets": [{
                        "label": "Mood Distribution",
                        "data": analytics.get("mood_distribution", [0, 0, 0, 0, 0])
                    }]
                },
                "recent_activity": analytics.get("recent_activities", [])
            }, user_id)
            
            # Wait before next update
            await asyncio.sleep(5)
    except Exception as e:
        logger.error(f"Error updating real-time stats: {str(e)}")

# Main dashboard endpoint
# backend/app/api/endpoints/dashboard.py

from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import HTMLResponse
from typing import Optional
from ...models.user import UserInDB
from ...services.analytics_service import AnalyticsService
from .auth import require_user
from fastapi.templating import Jinja2Templates

router = APIRouter()
templates = Jinja2Templates(directory="backend/app/templates")
analytics_service = AnalyticsService()

@router.get("/", response_class=HTMLResponse)
async def dashboard(request: Request, user: UserInDB = Depends(require_user)):
    """Render dashboard with user analytics"""
    try:
        analytics = await analytics_service.get_user_analytics(str(user.id))
        return templates.TemplateResponse(
            "dashboard.html",
            {
                "request": request,
                "user": user,
                "analytics": analytics
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Login page endpoint
@router.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    """Render login page."""
    return templates.TemplateResponse("login.html", {"request": request})

# Mood trends endpoint
@router.get("/api/mood-trends")
async def mood_trends(
    period: str = "week",
    current_user: UserInDB = Depends(get_current_user)
):
    """Get mood trends over time."""
    try:
        return await analytics_service.get_mood_trends(
            str(current_user.id), 
            period
        )
    except Exception as e:
        logger.error(f"Error getting mood trends: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
        
@router.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request, user: UserInDB = Depends(require_user)):
    """
    Render dashboard with user analytics
    """
    # Get user analytics
    analytics = await analytics_service.get_user_analytics(str(user.id))
    
    return templates.TemplateResponse(
        "dashboard.html",
        {
            "request": request,
            "user": user,
            "analytics": analytics
        }
    )

# Support group stats endpoint
@router.get("/api/support-group-stats")
async def support_group_stats(
    current_user: UserInDB = Depends(get_current_user)
):
    """Get support group participation statistics."""
    try:
        return await analytics_service.get_support_group_stats(
            str(current_user.id)
        )
    except Exception as e:
        logger.error(f"Error getting support group stats: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# Interaction patterns endpoint
@router.get("/api/interaction-patterns")
async def interaction_patterns(
    current_user: UserInDB = Depends(get_current_user)
):
    """Get user interaction patterns."""
    try:
        return await analytics_service.get_interaction_patterns(
            str(current_user.id)
        )
    except Exception as e:
        logger.error(f"Error getting interaction patterns: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )