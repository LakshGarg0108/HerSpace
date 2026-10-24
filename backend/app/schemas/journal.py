from typing import Optional
from pydantic import BaseModel, Field
from .mood import MoodType

class JournalCreate(BaseModel):
    title: Optional[str] = Field(default="", max_length=200)
    content: str = Field(min_length=1, max_length=50000)
    mood: Optional[MoodType] = None

class JournalUpdate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=200)
    content: Optional[str] = Field(default=None, min_length=1, max_length=50000)
    mood: Optional[MoodType] = None

class JournalResponse(BaseModel):
    id: str
    user_id: str
    title: Optional[str] = ""
    content: str
    mood: Optional[str] = None
    created_at: str
    updated_at: str
