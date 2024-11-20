# backend/app/models/auth.py
from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    sub: str | None = None
    exp: int | None = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"