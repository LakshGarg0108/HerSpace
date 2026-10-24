from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from ..core.security import get_current_user, AuthenticatedUser
from ..schemas.reminder import ReminderCreate, ReminderUpdate, ReminderResponse
from ..services.supabase_service import storage

router = APIRouter(prefix="/api/reminders", tags=["Reminders"])

@router.get("", response_model=List[ReminderResponse])
async def list_reminders(user: AuthenticatedUser = Depends(get_current_user)):
    items = storage.get_reminders(user.id)
    return [ReminderResponse(**r) for r in items]

@router.post("", response_model=ReminderResponse, status_code=status.HTTP_201_CREATED)
async def create_reminder(
    body: ReminderCreate,
    user: AuthenticatedUser = Depends(get_current_user),
):
    item = storage.create_reminder(
        user_id=user.id,
        title=body.title,
        message=body.message,
        category=body.category,
        is_pinned=body.is_pinned,
    )
    return ReminderResponse(**item)

@router.patch("/{reminder_id}", response_model=ReminderResponse)
async def update_reminder(
    reminder_id: str,
    body: ReminderUpdate,
    user: AuthenticatedUser = Depends(get_current_user),
):
    updated = storage.update_reminder(
        user_id=user.id,
        reminder_id=reminder_id,
        title=body.title,
        message=body.message,
        category=body.category,
        is_pinned=body.is_pinned,
    )
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reminder not found or unauthorized.",
        )
    return ReminderResponse(**updated)

@router.delete("/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reminder(
    reminder_id: str,
    user: AuthenticatedUser = Depends(get_current_user),
):
    deleted = storage.delete_reminder(user.id, reminder_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reminder not found or unauthorized.",
        )
