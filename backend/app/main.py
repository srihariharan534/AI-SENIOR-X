"""AI-SENIOR-X FastAPI Application Gateway and Lifecycle."""

import time
import uuid
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

import backend.app.database.models  # noqa: F401 - ensure all models are registered
from backend.app.api.routes import api_router
from backend.app.core.config import settings
from backend.app.core.exceptions import register_exception_handlers
from backend.app.core.logging import logger, setup_logging
from backend.app.database.session import async_engine


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifecycle context manager for clean startup & shutdown."""
    # Startup
    setup_logging()
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION} [{settings.ENVIRONMENT}]")

    # Initialize & Sync Database Schema
    try:
        from backend.app.database.migration import sync_database_schema

        await sync_database_schema(async_engine)
        logger.info("Database schema synchronized and verified successfully.")
    except Exception as e:
        logger.error(f"Database schema initialization warning: {e}")

    yield
    # Shutdown
    logger.info("Disposing database connection pool...")
    await async_engine.dispose()
    logger.info("Application shutdown complete.")


def create_app() -> FastAPI:
    """FastAPI Application Factory."""
    application = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="AI-SENIOR-X: Enterprise AI-Powered Personalized Learning Platform API Gateway",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    # CORS Middleware with support for credentials and multiple local ports
    origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]
    if isinstance(settings.CORS_ORIGINS, list):
        for o in settings.CORS_ORIGINS:
            if o not in origins:
                origins.append(o)

    application.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_origin_regex=r"^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Request ID and Structured Logging Middleware
    @application.middleware("http")
    async def request_logging_middleware(request: Request, call_next) -> Response:
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        start_time = time.perf_counter()

        response = await call_next(request)

        process_time = (time.perf_counter() - start_time) * 1000
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"

        # Exclude noisy health endpoint logs if successful
        if not request.url.path.endswith("/health") or response.status_code >= 400:
            logger.info(
                f"{request.method} {request.url.path} - Status {response.status_code} ({process_time:.2f}ms)"
            )
        return response

    # Global Exception Handlers
    register_exception_handlers(application)

    # Root Level Endpoints
    @application.get("/health", tags=["Health & Status"])
    async def root_health():
        """Root health check probe returning standard ok status."""
        return {
            "status": "ok",
            "service": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "environment": settings.ENVIRONMENT,
        }

    @application.get("/", tags=["Root"])
    async def root_index():
        """Root welcome endpoint with service metadata."""
        return {
            "status": "ok",
            "service": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "docs": "/docs",
            "health": "/health",
            "api_v1": settings.API_V1_STR,
        }

    # Register API routes (both /api/v1 and /api aliases for maximum client compatibility)
    application.include_router(api_router, prefix=settings.API_V1_STR)
    application.include_router(api_router, prefix="/api")

    return application


app = create_app()
