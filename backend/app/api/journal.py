from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from ..core.security import get_current_user, AuthenticatedUser
from ..schemas.journal import JournalCreate, JournalUpdate, JournalResponse
from ..services.supabase_service import storage

router = APIRouter(prefix="/api/journal", tags=["Journal"])

@router.get("", response_model=List[JournalResponse])
async def list_journal_entries(user: AuthenticatedUser = Depends(get_current_user)):
    entries = storage.get_journal(user.id)
    return [JournalResponse(**e) for e in entries]

@router.post("", response_model=JournalResponse, status_code=status.HTTP_201_CREATED)
async def create_journal_entry(
    body: JournalCreate,
    user: AuthenticatedUser = Depends(get_current_user),
):
    entry = storage.create_journal_entry(
        user_id=user.id,
        title=body.title or "",
        content=body.content,
        mood=body.mood.value if body.mood else None,
    )
    return JournalResponse(**entry)

@router.get("/{entry_id}", response_model=JournalResponse)
async def get_journal_entry(
    entry_id: str,
    user: AuthenticatedUser = Depends(get_current_user),
):
    entry = storage.get_journal_entry(user.id, entry_id)
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found or unauthorized.",
        )
    return JournalResponse(**entry)

@router.patch("/{entry_id}", response_model=JournalResponse)
async def update_journal_entry(
    entry_id: str,
    body: JournalUpdate,
    user: AuthenticatedUser = Depends(get_current_user),
):
    updated = storage.update_journal_entry(
        user_id=user.id,
        entry_id=entry_id,
        title=body.title,
        content=body.content,
        mood=body.mood.value if body.mood else None,
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found or unauthorized.",
        )
    return JournalResponse(**updated)

@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_journal_entry(
    entry_id: str,
    user: AuthenticatedUser = Depends(get_current_user),
):
    deleted = storage.delete_journal_entry(user.id, entry_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found or unauthorized.",
        )
