from typing import Optional
from pydantic import BaseModel, Field

class ReminderCreate(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    message: str = Field(min_length=1, max_length=2000)
    category: Optional[str] = Field(default="General", max_length=50)
    is_pinned: bool = False

class ReminderUpdate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=150)
    message: Optional[str] = Field(default=None, max_length=2000)
    category: Optional[str] = Field(default=None, max_length=50)
    is_pinned: Optional[bool] = None

class ReminderResponse(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    category: Optional[str] = "General"
    is_pinned: bool = False
    author_type: str = "personal"
    created_at: str
    updated_at: str
