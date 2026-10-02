"""Health, Liveness, and Readiness Probe Endpoints."""

from typing import Any

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import settings
from backend.app.database.session import get_db

router = APIRouter(tags=["Health & Status"])


@router.get("/health", summary="Liveness Probe")
async def health_check() -> dict[str, Any]:
    """Liveness probe to check if the FastAPI gateway is responding."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
    }


@router.get("/ready", summary="Readiness Probe")
async def readiness_check(db: AsyncSession = Depends(get_db)) -> JSONResponse:
    """Readiness probe verifying active database connectivity."""
    db_status = "connected"
    http_status = status.HTTP_200_OK

    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"disconnected: {str(e)}"
        http_status = status.HTTP_503_SERVICE_UNAVAILABLE

    return JSONResponse(
        status_code=http_status,
        content={
            "status": "ready" if http_status == 200 else "degraded",
            "service": settings.PROJECT_NAME,
            "database": db_status,
            "version": settings.VERSION,
        },
    )
