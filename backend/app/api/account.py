from fastapi import APIRouter, Depends, status
from ..core.security import get_current_user, AuthenticatedUser
from ..services.supabase_service import storage

router = APIRouter(prefix="/api/account", tags=["Account"])

@router.delete("", status_code=status.HTTP_200_OK)
async def delete_account(user: AuthenticatedUser = Depends(get_current_user)):
    storage.delete_all_user_data(user.id)
    return {
        "status": "success",
        "message": "All private personal data has been erased completely.",
    }
