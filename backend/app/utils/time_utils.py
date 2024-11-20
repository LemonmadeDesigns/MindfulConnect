# backend/app/utils/time_utils.py

# Import required dependencies
from datetime import datetime, timedelta
from typing import Dict
from ..core.config import settings

def get_time_ranges(
    period: str = "week"
) -> tuple[datetime, datetime]:
    """
    Get start and end dates for time period
    
    Args:
        period: Time period (day, week, month)
        
    Returns:
        tuple: (start_date, end_date)
    """
    end_date = datetime.utcnow()
    
    if period == "day":
        start_date = end_date - timedelta(days=1)
    elif period == "week":
        start_date = end_date - timedelta(days=7)
    elif period == "month":
        start_date = end_date - timedelta(days=30)
    else:
        raise ValueError("Invalid time period")
        
    return start_date, end_date

def format_timestamp(dt: datetime) -> str:
    """
    Format datetime for display
    
    Args:
        dt: Datetime to format
        
    Returns:
        str: Formatted timestamp
    """
    return dt.strftime("%Y-%m-%d %H:%M:%S")
