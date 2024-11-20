# backend/app/models/base.py

from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, Field, GetJsonSchemaHandler
from pydantic.json_schema import JsonSchemaValue
from pydantic_core.core_schema import CoreSchema, str_schema
from bson import ObjectId

class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(
        cls,
        _source_type: type[Any],
        _handler: GetJsonSchemaHandler,
    ) -> CoreSchema:
        return str_schema()

    @classmethod
    def validate(cls, value):
        if isinstance(value, ObjectId):
            return str(value)
        if isinstance(value, str) and ObjectId.is_valid(value):
            return value
        raise ValueError("Invalid ObjectId")

class MongoBaseModel(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        populate_by_name = True

    @classmethod
    def from_mongo(cls, data: dict):
        """Convert MongoDB document to Model instance"""
        if not data:
            return None
        
        if "_id" in data:
            data["_id"] = str(data["_id"])
            
        return cls.model_validate(data)