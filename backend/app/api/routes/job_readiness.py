"""Job Readiness & Explainable Recommendations Endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, status

from backend.app.api.dependencies import get_current_user
from backend.app.database.models.user import User
from backend.app.schemas.common import ApiResponse
from backend.app.schemas.real_world import (
    ExplainableRecommendation,
    JobReadinessProfile,
)
from backend.app.services.job_readiness_service import JobReadinessService
from backend.app.services.recovery_engine import RecoveryEngineService

router = APIRouter(prefix="/job-readiness", tags=["Job Readiness & Evidence"])


@router.get(
    "/profile",
    response_model=ApiResponse[JobReadinessProfile],
    status_code=status.HTTP_200_OK,
    summary="Get Evidence-Based Job Readiness Profile",
)
async def get_readiness_profile(
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[JobReadinessProfile]:
    """
    Retrieve empirical, evidence-backed job readiness breakdown.
    Never fabricates a synthetic percentage score; shows verified competencies and missing proof.
    """
    profile = JobReadinessService.get_readiness_profile(current_user.id)
    return ApiResponse(data=profile)


@router.get(
    "/explainable-recommendations",
    response_model=ApiResponse[list[ExplainableRecommendation]],
    status_code=status.HTTP_200_OK,
    summary="Get Explainable Next Best Actions (WHAT, WHY, EVIDENCE, NEXT ACTION)",
)
async def get_explainable_recommendations(
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[list[ExplainableRecommendation]]:
    """
    Retrieve fully explainable recommendations that show WHY the action is suggested,
    what evidence triggered it, and the concrete next step.
    """
    recs = RecoveryEngineService.get_explainable_recommendations(current_user.id)
    return ApiResponse(data=recs)
