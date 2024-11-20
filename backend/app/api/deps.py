# backend/app/api/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from ..core.config import settings
from ..db.mongodb import get_database
from ..models.user import UserInDB
from bson import ObjectId
import logging

# Initialize logger
logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

async def get_current_user(token: str = Depends(oauth2_scheme), db=Depends(get_database)):
    # credentials_exception = HTTPException(
    #     status_code=status.HTTP_401_UNAUTHORIZED,
    #     detail="Could not validate credentials",
    #     headers={"WWW-Authenticate": "Bearer"},
    # )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            logger.error("User ID not found in token")
            raise credentials_exception
        
        logger.info(f"Decoded user ID: {user_id}")
        user = await db.users.find_one({"_id": user_id})
        if user is None:
            logger.error(f"User with ID {user_id} not found in database")
            raise credentials_exception
        
        return UserInDB(**user)
    except JWTError as e:
        logger.error(f"JWT decoding error: {str(e)}")
        raise credentials_exception
