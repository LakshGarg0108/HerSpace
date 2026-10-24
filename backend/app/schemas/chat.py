from typing import Optional, List
from enum import Enum
from pydantic import BaseModel, Field

class SupportMode(str, Enum):
    LISTEN = "LISTEN"
    COMFORT = "COMFORT"
    CALM_DOWN = "CALM_DOWN"
    THINK_IT_THROUGH = "THINK_IT_THROUGH"

class ChatHistoryItem(BaseModel):
    role: str = Field(pattern="^(user|assistant|system)$")
    content: str = Field(max_length=10000)

class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    support_mode: SupportMode = Field(default=SupportMode.LISTEN)
    conversation_id: Optional[str] = None
    history: Optional[List[ChatHistoryItem]] = Field(default_factory=list)

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    is_demo: bool = False
    support_mode: SupportMode
    safety_warning: bool = False
