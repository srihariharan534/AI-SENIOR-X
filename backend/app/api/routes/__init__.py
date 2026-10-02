"""API Router aggregation module."""

from fastapi import APIRouter

from backend.app.api.routes import (
    assessment,
    auth,
    certificate,
    curriculum,
    dashboard,
    health,
    job_readiness,
    learning,
    learning_twin,
    materials,
    metrics,
    missions,
    multimodal_doubt,
    practice,
    progress,
    providers,
    rag,
    real_world,
    recommendations,
    skill_intelligence,
    tutor,
    university,
    users,
    video_lessons,
    voice,
)

api_router = APIRouter()

# Register sub-routers
api_router.include_router(dashboard.router)
api_router.include_router(health.router)
api_router.include_router(metrics.router)
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(providers.router)
api_router.include_router(university.router)
api_router.include_router(learning.router)
api_router.include_router(progress.router)
api_router.include_router(assessment.router)
api_router.include_router(tutor.router)
api_router.include_router(video_lessons.router)
api_router.include_router(curriculum.router)
api_router.include_router(learning_twin.router)
api_router.include_router(materials.router)
api_router.include_router(rag.router)
api_router.include_router(practice.router)
api_router.include_router(recommendations.router)
api_router.include_router(missions.router)
api_router.include_router(voice.router)
api_router.include_router(real_world.router)
api_router.include_router(job_readiness.router)
api_router.include_router(multimodal_doubt.router)
api_router.include_router(skill_intelligence.router)
api_router.include_router(certificate.router)

__all__ = ["api_router"]
