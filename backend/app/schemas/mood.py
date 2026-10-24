from typing import Optional
from enum import Enum
from pydantic import BaseModel, Field
from datetime import datetime

class MoodType(str, Enum):
    OKAY = "okay"
    SAD = "sad"
    OVERWHELMED = "overwhelmed"
    ANXIOUS = "anxious"
    ANGRY = "angry"
    EXHAUSTED = "exhausted"
    LONELY = "lonely"
    UNKNOWN = "unknown"

class MoodCreate(BaseModel):
    mood: MoodType
    note: Optional[str] = Field(default=None, max_length=500)

class MoodResponse(BaseModel):
    id: str
    user_id: str
    mood: MoodType
    note: Optional[str] = None
    created_at: str
