# backend/app/core/openapi.py

from fastapi.openapi.utils import get_openapi
from ..core.config import settings

def get_custom_openapi_schema(app):
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=settings.PROJECT_NAME,
        version=settings.PROJECT_VERSION,
        description="A mental health support platform API",
        routes=app.routes,
    )

    # Add components
    openapi_schema["components"] = {
        "securitySchemes": {
            "bearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT",
            }
        },
        "schemas": {
            "HTTPValidationError": {
                "title": "HTTPValidationError",
                "type": "object",
                "properties": {
                    "detail": {
                        "title": "Detail",
                        "type": "array",
                        "items": {"$ref": "#/components/schemas/ValidationError"},
                    }
                },
            },
            "ValidationError": {
                "title": "ValidationError",
                "type": "object",
                "properties": {
                    "loc": {
                        "title": "Location",
                        "type": "array",
                        "items": {"type": "string"},
                    },
                    "msg": {"title": "Message", "type": "string"},
                    "type": {"title": "Error Type", "type": "string"},
                },
            },
            "ObjectId": {
                "type": "string",
                "format": "objectid",
                "pattern": "^[0-9a-fA-F]{24}$",
                "example": "507f1f77bcf86cd799439011",
            },
            "Message": {
                "title": "Message",
                "type": "object",
                "properties": {
                    "_id": {"$ref": "#/components/schemas/ObjectId"},
                    "user_id": {"$ref": "#/components/schemas/ObjectId"},
                    "content": {"type": "string"},
                    "is_bot": {"type": "boolean", "default": False},
                    "message_type": {"type": "string", "default": "general"},
                    "timestamp": {"type": "string", "format": "date-time"},
                },
                "required": ["user_id", "content"],
            },
            "CheckIn": {
                "title": "CheckIn",
                "type": "object",
                "properties": {
                    "_id": {"$ref": "#/components/schemas/ObjectId"},
                    "user_id": {"$ref": "#/components/schemas/ObjectId"},
                    "completed": {"type": "boolean", "default": False},
                    "responses": {
                        "type": "object",
                        "additionalProperties": {"type": "string"},
                        "default": {},
                    },
                    "mood_score": {"type": "integer", "nullable": True},
                    "anxiety_level": {"type": "integer", "nullable": True},
                    "sleep_quality": {"type": "integer", "nullable": True},
                    "date": {"type": "string", "format": "date-time"},
                },
                "required": ["user_id"],
            },
            "ChatResponse": {
                "title": "ChatResponse",
                "type": "object",
                "properties": {
                    "message": {"type": "string"},
                    "message_type": {"type": "string"},
                    "suggestions": {
                        "type": "array",
                        "items": {"type": "string"},
                        "nullable": True,
                    },
                    "resources": {
                        "type": "object",
                        "additionalProperties": {"type": "string"},
                        "nullable": True,
                    },
                },
                "required": ["message", "message_type"],
            },
            "MoodEntry": {
                "title": "MoodEntry",
                "type": "object",
                "properties": {
                    "_id": {"$ref": "#/components/schemas/ObjectId"},
                    "user_id": {"$ref": "#/components/schemas/ObjectId"},
                    "mood_score": {"type": "integer", "minimum": 1, "maximum": 10},
                    "mood_description": {"type": "string"},
                    "activities": {
                        "type": "array",
                        "items": {"type": "string"},
                        "default": [],
                    },
                    "emotions": {
                        "type": "array",
                        "items": {"type": "string"},
                        "default": [],
                    },
                    "sentiment_score": {"type": "number", "nullable": True},
                    "ai_analysis": {"type": "object", "nullable": True},
                    "timestamp": {"type": "string", "format": "date-time"},
                },
                "required": ["user_id", "mood_score", "mood_description"],
            },
            "MoodAnalysis": {
                "title": "MoodAnalysis",
                "type": "object",
                "properties": {
                    "overall_sentiment": {"type": "number"},
                    "identified_emotions": {
                        "type": "array",
                        "items": {"type": "string"},
                    },
                    "triggers": {"type": "array", "items": {"type": "string"}},
                    "suggestions": {"type": "array", "items": {"type": "string"}},
                    "risk_level": {"type": "string", "enum": ["low", "medium", "high"]},
                },
                "required": [
                    "overall_sentiment",
                    "identified_emotions",
                    "triggers",
                    "suggestions",
                    "risk_level",
                ],
            },
            "MoodPattern": {
                "title": "MoodPattern",
                "type": "object",
                "properties": {
                    "trigger": {"type": "string"},
                    "frequency": {"type": "integer"},
                    "average_mood_score": {"type": "number"},
                    "common_emotions": {"type": "array", "items": {"type": "string"}},
                    "time_patterns": {
                        "type": "object",
                        "additionalProperties": {"type": "integer"},
                    },
                },
            },
            "MoodGoal": {
                "title": "MoodGoal",
                "type": "object",
                "properties": {
                    "_id": {"$ref": "#/components/schemas/ObjectId"},
                    "user_id": {"$ref": "#/components/schemas/ObjectId"},
                    "title": {"type": "string"},
                    "description": {"type": "string"},
                    "target_mood_score": {"type": "integer", "nullable": True},
                    "start_date": {"type": "string", "format": "date-time"},
                    "end_date": {
                        "type": "string",
                        "format": "date-time",
                        "nullable": True,
                    },
                    "status": {"type": "string", "default": "active"},
                    "progress_notes": {
                        "type": "array",
                        "items": {"type": "object", "additionalProperties": True},
                        "default": [],
                    },
                },
                "required": ["user_id", "title", "description", "start_date"],
            },
            "HTTPValidationError": {
                "title": "HTTPValidationError",
                "type": "object",
                "properties": {
                    "detail": {
                        "title": "Detail",
                        "type": "array",
                        "items": {"$ref": "#/components/schemas/ValidationError"},
                    }
                },
            },
            "ValidationError": {
                "title": "ValidationError",
                "type": "object",
                "properties": {
                    "loc": {
                        "title": "Location",
                        "type": "array",
                        "items": {"type": "string"},
                    },
                    "msg": {"title": "Message", "type": "string"},
                    "type": {"title": "Error Type", "type": "string"},
                },
            },
            # Add to the schemas in custom_openapi function
            "MoodEntryCreate": {
                "title": "MoodEntryCreate",
                "type": "object",
                "properties": {
                    "mood_score": {
                        "title": "Mood Score",
                        "type": "integer",
                        "minimum": 1,
                        "maximum": 10,
                    },
                    "mood_description": {"title": "Mood Description", "type": "string"},
                    "activities": {
                        "title": "Activities",
                        "type": "array",
                        "items": {"type": "string"},
                        "default": [],
                    },
                    "emotions": {
                        "title": "Emotions",
                        "type": "array",
                        "items": {"type": "string"},
                        "default": [],
                    },
                },
                "required": ["mood_score", "mood_description"],
                "example": {
                    "mood_score": 7,
                    "mood_description": "Feeling good today",
                    "activities": ["exercise", "meditation"],
                    "emotions": ["happy", "energetic"],
                },
            },
            # Add to components/schemas in custom_openapi function in main.py
            "SupportGroup": {
                "title": "Support Group",
                "type": "object",
                "properties": {
                    "_id": {"$ref": "#/components/schemas/ObjectId"},
                    "name": {"type": "string"},
                    "type": {"type": "string", "enum": ["CGA", "AA", "NA", "EI", "AM"]},
                    "description": {"type": "string"},
                    "meeting_times": {"type": "array", "items": {"type": "string"}},
                    "is_active": {"type": "boolean", "default": True},
                    "max_participants": {"type": "integer", "nullable": True},
                    "facilitator_id": {
                        "$ref": "#/components/schemas/ObjectId",
                        "nullable": True,
                    },
                    "created_at": {"type": "string", "format": "date-time"},
                },
                "required": ["name", "type", "description", "meeting_times"],
                "example": {
                    "_id": "507f1f77bcf86cd799439011",
                    "name": "Alcoholics Anonymous Group 1",
                    "type": "AA",
                    "description": "Weekly support group for alcohol recovery",
                    "meeting_times": ["Monday 18:00", "Thursday 18:00"],
                    "is_active": True,
                    "max_participants": 20,
                    "created_at": "2024-01-01T00:00:00",
                },
            },
            "GroupMembership": {
                "title": "Group Membership",
                "type": "object",
                "properties": {
                    "_id": {"$ref": "#/components/schemas/ObjectId"},
                    "group_id": {"$ref": "#/components/schemas/ObjectId"},
                    "user_id": {"$ref": "#/components/schemas/ObjectId"},
                    "joined_at": {"type": "string", "format": "date-time"},
                    "is_active": {"type": "boolean", "default": True},
                    "role": {
                        "type": "string",
                        "enum": ["member", "facilitator"],
                        "default": "member",
                    },
                },
                "required": ["group_id", "user_id"],
                "example": {
                    "_id": "507f1f77bcf86cd799439012",
                    "group_id": "507f1f77bcf86cd799439011",
                    "user_id": "507f1f77bcf86cd799439013",
                    "joined_at": "2024-01-01T00:00:00",
                    "is_active": True,
                    "role": "member",
                },
            },
            "CreateSupportGroup": {
                "title": "Create Support Group",
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "type": {"type": "string", "enum": ["CGA", "AA", "NA", "EI", "AM"]},
                    "description": {"type": "string"},
                    "meeting_times": {"type": "array", "items": {"type": "string"}},
                    "max_participants": {"type": "integer", "nullable": True},
                },
                "required": ["name", "type", "description", "meeting_times"],
                "example": {
                    "name": "Alcoholics Anonymous Group 1",
                    "type": "AA",
                    "description": "Weekly support group for alcohol recovery",
                    "meeting_times": ["Monday 18:00", "Thursday 18:00"],
                    "max_participants": 20,
                },
            },
            # Add to components/schemas in custom_openapi function in main.py
            "UserBase": {
                "title": "User Base",
                "type": "object",
                "properties": {
                    "username": {"type": "string", "minLength": 3, "maxLength": 50},
                    "email": {"type": "string", "format": "email"},
                    "full_name": {"type": "string", "nullable": True},
                    "is_active": {"type": "boolean", "default": True},
                    "is_anonymous": {"type": "boolean", "default": False},
                },
                "required": ["username", "email"],
            },
            "UserCreate": {
                "title": "User Create",
                "allOf": [
                    {"$ref": "#/components/schemas/UserBase"},
                    {
                        "type": "object",
                        "properties": {"password": {"type": "string", "minLength": 8}},
                        "required": ["password"],
                    },
                ],
                "example": {
                    "username": "johndoe",
                    "email": "john@example.com",
                    "password": "strongpassword123",
                    "full_name": "John Doe",
                },
            },
            "UserInDB": {
                "title": "User In DB",
                "allOf": [
                    {"$ref": "#/components/schemas/UserBase"},
                    {
                        "type": "object",
                        "properties": {
                            "_id": {"$ref": "#/components/schemas/ObjectId"},
                            "hashed_password": {"type": "string"},
                            "created_at": {"type": "string", "format": "date-time"},
                            "last_login": {
                                "type": "string",
                                "format": "date-time",
                                "nullable": True,
                            },
                        },
                        "required": ["_id", "hashed_password"],
                    },
                ],
            },
            "UserResponse": {
                "title": "User Response",
                "allOf": [
                    {"$ref": "#/components/schemas/UserBase"},
                    {
                        "type": "object",
                        "properties": {
                            "_id": {"$ref": "#/components/schemas/ObjectId"}
                        },
                        "required": ["_id"],
                    },
                ],
            },
            "TokenResponse": {
                "title": "Token Response",
                "type": "object",
                "properties": {
                    "access_token": {"type": "string"},
                    "token_type": {"type": "string", "default": "bearer"},
                },
                "required": ["access_token", "token_type"],
                "example": {
                    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    "token_type": "bearer",
                },
            },
            "LoginForm": {
                "title": "Login Form",
                "type": "object",
                "properties": {
                    "username": {"type": "string"},
                    "password": {"type": "string"},
                },
                "required": ["username", "password"],
                "example": {
                    "username": "john@example.com",
                    "password": "strongpassword123",
                },
            },
        },
    }
    
    # Apply security globally
    openapi_schema["security"] = [{"bearerAuth": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema
