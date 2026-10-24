from typing import Optional
from pydantic import BaseModel, Field

class ProfileUpdate(BaseModel):
    display_name: str = Field(min_length=1, max_length=100)

class ProfileResponse(BaseModel):
    id: str
    email: str
    display_name: Optional[str] = None
    created_at: str
    updated_at: Optional[str] = None
