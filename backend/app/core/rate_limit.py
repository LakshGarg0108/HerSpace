import time
from typing import Dict, List
from fastapi import Request, HTTPException, status
from .config import settings

class InMemoryRateLimiter:
    def __init__(self, limit_per_minute: int = 60):
        self.limit = limit_per_minute
        self.requests: Dict[str, List[float]] = {}

    def is_rate_limited(self, identifier: str) -> bool:
        now = time.time()
        window_start = now - 60.0

        if identifier not in self.requests:
            self.requests[identifier] = [now]
            return False

        # Filter out timestamps older than 60 seconds
        recent = [t for t in self.requests[identifier] if t > window_start]
        recent.append(now)
        self.requests[identifier] = recent

        return len(recent) > self.limit

limiter = InMemoryRateLimiter(limit_per_minute=settings.RATE_LIMIT_PER_MINUTE)

async def check_rate_limit(request: Request):
    client_ip = request.client.host if request.client else "unknown"
    auth_header = request.headers.get("authorization", "")
    identifier = auth_header or client_ip

    if limiter.is_rate_limited(identifier):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please take a gentle breath and try again shortly.",
        )
