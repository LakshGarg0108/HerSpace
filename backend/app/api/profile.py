from fastapi import APIRouter, Depends
from ..core.security import get_current_user, AuthenticatedUser
from ..schemas.profile import ProfileUpdate, ProfileResponse
from ..services.supabase_service import storage

router = APIRouter(prefix="/api/profile", tags=["Profile"])

@router.get("", response_model=ProfileResponse)
async def get_profile(user: AuthenticatedUser = Depends(get_current_user)):
    data = storage.get_profile(user.id, user.email)
    return ProfileResponse(**data)

@router.patch("", response_model=ProfileResponse)
async def update_profile(
    body: ProfileUpdate,
    user: AuthenticatedUser = Depends(get_current_user),
):
    data = storage.update_profile(user.id, body.display_name)
    return ProfileResponse(**data)
