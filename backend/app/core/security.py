from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from pydantic import BaseModel
from .config import settings

security_bearer = HTTPBearer(auto_error=False)

class AuthenticatedUser(BaseModel):
    id: str
    email: str
    is_demo: bool = False

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer),
) -> AuthenticatedUser:
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is missing. Please sign in.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials.strip()

    # 1. Demo token handling for local test/demo workflows
    if token.startswith("demo-token"):
        # Extract optional user suffix: demo-token:user-id-123
        parts = token.split(":")
        user_id = parts[1] if len(parts) > 1 else "demo-user-id"
        return AuthenticatedUser(
            id=user_id,
            email=f"{user_id}@hersafespace.app",
            is_demo=True,
        )

    # 2. Supabase JWT validation
    if settings.is_supabase_configured and settings.SUPABASE_JWT_SECRET:
        try:
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated",
            )
            user_id = payload.get("sub")
            email = payload.get("email", "")
            if not user_id:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token payload: missing subject identifier.",
                )
            return AuthenticatedUser(id=user_id, email=email, is_demo=False)
        except jwt.PyJWTError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid authentication token: {str(e)}",
            )

    # 3. If Supabase secret is not configured but a standard JWT is provided, attempt decoding unverified payload safely for dev/staging
    try:
        unverified = jwt.decode(token, options={"verify_signature": False})
        user_id = unverified.get("sub") or unverified.get("id")
        email = unverified.get("email", "friend@hersafespace.app")
        if user_id:
            return AuthenticatedUser(id=str(user_id), email=str(email), is_demo=True)
    except Exception:
        pass

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )
