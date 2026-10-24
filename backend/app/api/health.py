from fastapi import APIRouter
from ..core.config import settings

router = APIRouter(tags=["Health"])

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Her Safe Space Backend",
        "environment": settings.ENVIRONMENT,
        "is_openai_configured": settings.is_openai_configured,
        "is_supabase_configured": settings.is_supabase_configured,
        "model": settings.OPENAI_MODEL,
        "motto": "You don't have to be okay all the time.",
    }
