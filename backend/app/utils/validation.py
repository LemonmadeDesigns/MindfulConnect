
# backend/app/utils/validation.py

from typing import List, Dict, Any
import re
from datetime import datetime, timedelta

# Email validation pattern
EMAIL_PATTERN = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")

def validate_email(email: str) -> bool:
    """
    Validate email format
    
    Args:
        email: Email address to validate
        
    Returns:
        bool: True if email is valid
    """
    return bool(EMAIL_PATTERN.match(email))

def sanitize_input(text: str) -> str:
    """
    Sanitize user input
    
    Args:
        text: Input text to sanitize
        
    Returns:
        str: Sanitized text
    """
    # Remove HTML tags
    text = re.sub(r'<[^>]*>', '', text)
    # Remove special characters
    text = re.sub(r'[^\w\s@.-]', '', text)
    return text.strip()

def validate_mood_score(score: int) -> bool:
    """
    Validate mood score range
    
    Args:
        score: Mood score to validate
        
    Returns:
        bool: True if score is valid
    """
    return 1 <= score <= 10