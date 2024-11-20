# backend/app/core/config.py

# Import required dependencies for configuration management
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
import secrets

# Application settings class that loads configuration from environment variables
class Settings(BaseSettings):
    # Basic application metadata
    PROJECT_NAME: str = "MindfulConnect"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # MongoDB connection settings
    # These should be overridden in production via environment variables
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "mindfulconnect"
    
    # Templates
    TEMPLATES_DIR: str = "backend/app/templates"
    
    # JWT authentication settings
    # WARNING: JWT_SECRET_KEY should be set via environment variable in production
    JWT_SECRET_KEY: str = secrets.token_urlsafe(32)  # Generates a random key for development
    JWT_ALGORITHM: str = "HS256"  # Algorithm used for JWT encoding/decoding
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # Token validity: 24 hours
    COOKIE_SECURE: bool = False  # Set to True in production
    
    # Redis cache settings
    # Used for session management and rate limiting
    REDIS_URL: str = "redis://localhost:6379"
    
    # OpenAI API settings for sentiment analysis
    # Should be set via environment variable
    OPENAI_API_KEY: Optional[str] = None
    
    # Development and debugging settings
    DEBUG: bool = True  # Enable debug mode for development
    ENVIRONMENT: str = "development"  # Current environment (development/staging/production)
    
    class Config:
        env_file = ".env"

# Create a global settings instance
# This will be imported and used throughout the application
settings = Settings()