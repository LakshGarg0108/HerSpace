from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from ..core.security import get_current_user, AuthenticatedUser
from ..schemas.mood import MoodCreate, MoodResponse
from ..services.supabase_service import storage

router = APIRouter(prefix="/api/moods", tags=["Moods"])

@router.get("", response_model=List[MoodResponse])
async def list_moods(user: AuthenticatedUser = Depends(get_current_user)):
    items = storage.get_moods(user.id)
    return [MoodResponse(**item) for item in items]

@router.post("", response_model=MoodResponse, status_code=status.HTTP_201_CREATED)
async def log_mood(
    body: MoodCreate,
    user: AuthenticatedUser = Depends(get_current_user),
):
    entry = storage.create_mood(user.id, body.mood.value, body.note)
    return MoodResponse(**entry)

@router.delete("/{mood_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_mood(
    mood_id: str,
    user: AuthenticatedUser = Depends(get_current_user),
):
    success = storage.delete_mood(user.id, mood_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mood entry not found or unauthorized.",
        )
