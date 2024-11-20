

# backend/app/utils/security.py

# Import required dependencies
from datetime import datetime, timedelta
from jose import jwt  # Changed from import jwt
from typing import Dict, Optional
import logging
import re
import bcrypt
from ..core.config import settings

logger = logging.getLogger(__name__)

# Password validation pattern
PASSWORD_PATTERN = re.compile(
    r"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
)

def validate_password(password: str) -> bool:
    """
    Validate password strength

    Args:
        password: Password string to validate

    Returns:
        bool: True if password meets requirements
    """
    return bool(PASSWORD_PATTERN.match(password))

def hash_password(password: str) -> str:
    """
    Hash password using bcrypt

    Args:
        password: Plain text password

    Returns:
        str: Hashed password
    """
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt).decode()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password against hash

    Args:
        plain_password: Plain text password
        hashed_password: Hashed password to verify against

    Returns:
        bool: True if password matches
    """
    return bcrypt.checkpw(
        plain_password.encode(), 
        hashed_password.encode()
    )
def create_token(data: Dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create JWT token

    Args:
        data: Data to encode in token
        expires_delta: Optional expiration time

    Returns:
        str: Encoded JWT token
    """
    try:
        to_encode = data.copy()
        expire = datetime.utcnow() + (
            expires_delta if expires_delta 
            else timedelta(minutes=15)
        )
        to_encode.update({"exp": expire})

        # Create token
        token = jwt.encode(
            to_encode,
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM
        )

        return token
    except Exception as e:
        logger.error(f"Error creating token: {str(e)}")
        raise
