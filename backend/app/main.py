from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from .core.config import settings
from .api import health, profile, mood, journal, chat, reminders, account

# Set up quiet logger that does NOT log raw request bodies or private emotional reflections
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("her_safe_space")

app = FastAPI(
    title="Her Safe Space API",
    description="Empathetic, private, and secure backend supporting the Her Safe Space emotional wellness sanctuary.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware with restrictive allowed origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Global Exception Handler: Sanitize errors and never leak stack traces
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Handled application error: {type(exc).__name__}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "A quiet error occurred. We are attending to it gently."},
    )

# Include Routers
app.include_router(health.router)
app.include_router(profile.router)
app.include_router(mood.router)
app.include_router(journal.router)
app.include_router(chat.router)
app.include_router(reminders.router)
app.include_router(account.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
