# backend/app/api/endpoints/analytics.py

# Import required dependencies for analytics endpoint
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from ...models.user import UserInDB
from ...services.analytics_service import AnalyticsService
from ...api.deps import get_current_user

# Initialize router for analytics endpoints
router = APIRouter()

# Initialize analytics service instance
analytics_service = AnalyticsService()

# Endpoint to get user analytics data with time period filter
@router.get("/user-analytics")
async def get_user_analytics(
    # Allow filtering by day, week, or month
    time_period: str = Query("week", enum=["day", "week", "month"]),
    # Require authenticated user
    current_user: UserInDB = Depends(get_current_user)
):
    """Get analytics for the current user."""
    # Call analytics service to fetch user data
    return await analytics_service.get_user_analytics(
        str(current_user.id),
        time_period
    )

# Endpoint to get user interaction patterns and recommendations
@router.get("/interaction-patterns")
async def get_interaction_patterns(
    # Require authenticated user
    current_user: UserInDB = Depends(get_current_user)
):
    """Get user's interaction patterns and recommendations."""
    # Get analytics data for the user
    analytics = await analytics_service.get_user_analytics(str(current_user.id))
    
    # Extract peak activity hours
    peak_hours = analytics["interaction_times"]["peak_hours"]
    # Get most active days
    most_active_days = analytics["most_active_days"]
    
    # Return analyzed patterns and recommendations
    return {
        "peak_hours": peak_hours,
        "most_active_days": most_active_days,
        "recommended_meeting_times": [
            f"{day} {hour}:00"
            for day in most_active_days
            for hour in peak_hours
        ]
    }