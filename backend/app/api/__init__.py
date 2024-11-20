# backend/app/main.py or backend/app/api/__init__.py
from fastapi import FastAPI
from .endpoints import auth

app = FastAPI()

# Include the auth router
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
