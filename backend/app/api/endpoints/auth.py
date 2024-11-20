# backend/app/api/endpoints/auth.py

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status, Cookie
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from typing import Optional
from datetime import datetime, timedelta
from jose import jwt, JWTError  # Make sure this import is here
from ...models.user import UserCreate, UserInDB, UserResponse
from ...core.config import settings
from ...utils.security import create_token, hash_password, verify_password
from ...db.mongodb import get_database
from bson import ObjectId
from fastapi.templating import Jinja2Templates
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
templates = Jinja2Templates(directory="backend/app/templates")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/token")

# backend/app/api/endpoints/auth.py

@router.post("/token")
async def login_for_access_token(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends()
):
    logger.debug(f"Login attempt for email: {form_data.username}")
    
    db = await get_database()
    
    # Find user by email
    user_data = await db.users.find_one({"email": form_data.username})
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    user = UserInDB.from_mongo(user_data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user data"
        )
    
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create token with expiration
    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "exp": datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    
    access_token = create_token(token_data)
    logger.debug("Created access token")
    
    # Set cookie
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        path="/"
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

async def get_current_user(request: Request) -> Optional[UserInDB]:
    try:
        cookie_authorization: str = request.cookies.get("access_token")
        if not cookie_authorization:
            logger.debug("No access_token cookie found")
            return None

        scheme, token = cookie_authorization.split()
        if scheme.lower() != 'bearer':
            logger.debug("Invalid token scheme")
            return None

        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM]
            )
        except JWTError as e:
            logger.debug(f"JWT decode error: {e}")
            return None

        user_id = payload.get("sub")
        if not user_id:
            logger.debug("No user_id in token")
            return None

        db = await get_database()
        user_data = await db.users.find_one({"_id": ObjectId(user_id)})
        
        if not user_data:
            logger.debug("User not found in database")
            return None

        return UserInDB.from_mongo(user_data)

    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        return None


# Protected route dependency
async def require_user(request: Request) -> UserInDB:
    user = await get_current_user(request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    return user


@router.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@router.post("/login")
async def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends()
):
    db = await get_database()
    
    # Find user by username
    user = await db.users.find_one({"username": form_data.username})
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )
    
    # Verify password
    if not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )
    
    # Create access token
    token_data = {
        "sub": str(user["_id"]),
        "username": user["username"]
    }
    access_token = create_token(
        token_data,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    # Create response with cookie
    response = RedirectResponse(
        url="/dashboard",
        status_code=status.HTTP_302_FOUND
    )
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        secure=settings.COOKIE_SECURE
    )
    
    return response

@router.get("/register", response_class=HTMLResponse)
async def register_page(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    db = await get_database()
    
    # Check if username or email already exists
    if await db.users.find_one({"username": user_data.username}):
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )
    if await db.users.find_one({"email": user_data.email}):
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Create new user
    user_in_db = UserInDB(
        **user_data.model_dump(exclude={"password"}),
        hashed_password=hash_password(user_data.password),
        created_at=datetime.utcnow()
    )
    
    result = await db.users.insert_one(user_in_db.model_dump())
    
    return {
        "_id": str(result.inserted_id),
        **user_data.model_dump(exclude={"password"})
    }

@router.get("/logout")
async def logout():
    """
    Logout user and redirect to login page
    """
    response = RedirectResponse(
        url="/login",  # Changed from "/auth/login" to "/login"
        status_code=status.HTTP_302_FOUND
    )
    
    # Clear the cookie
    response.delete_cookie(
        key="access_token",
        path="/",  # Important: must match the path used when setting
        secure=settings.COOKIE_SECURE,
    )
    
    return response