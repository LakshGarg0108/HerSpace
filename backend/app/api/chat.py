import uuid
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from ..core.security import get_current_user, AuthenticatedUser
from ..core.rate_limit import check_rate_limit
from ..schemas.chat import ChatRequest, ChatResponse
from ..services.ai_service import ai_service

router = APIRouter(tags=["AI Companion"])

@router.post(
    "/api/chat",
    response_model=ChatResponse,
    dependencies=[Depends(check_rate_limit)],
)
async def chat_with_companion(
    body: ChatRequest,
    user: AuthenticatedUser = Depends(get_current_user),
):
    convo_id = body.conversation_id or str(uuid.uuid4())
    
    reply, is_demo, safety_warning = await ai_service.generate_response(
        user_message=body.message,
        support_mode=body.support_mode,
        history=body.history or [],
    )

    return ChatResponse(
        response=reply,
        conversation_id=convo_id,
        is_demo=is_demo,
        support_mode=body.support_mode,
        safety_warning=safety_warning,
    )

@router.get("/api/conversations")
async def list_conversations(user: AuthenticatedUser = Depends(get_current_user)):
    return [
        {
            "id": "active-convo",
            "title": "Gentle Conversation",
            "user_id": user.id,
            "created_at": "2024-01-01T00:00:00Z",
        }
    ]

@router.delete("/api/conversations/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_conversation(
    conversation_id: str,
    user: AuthenticatedUser = Depends(get_current_user),
):
    # In memory / local mode, conversation deletion clears session
    return
