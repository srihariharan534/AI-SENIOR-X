"""Learning Pathways, Curriculum, and Recommendations REST Endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, Query, status

from backend.app.api.dependencies import (
    get_current_user,
    get_learning_service,
    get_recommendation_service,
)
from backend.app.database.models.user import User
from backend.app.schemas.common import ApiResponse
from backend.app.schemas.learning import CurriculumNode, LearningRecommendation, MissionRead
from backend.app.services.learning_service import LearningService
from backend.app.services.recommendation_service import RecommendationService

router = APIRouter(prefix="/learning", tags=["Learning Pathways & Missions"])


@router.get(
    "/curriculum",
    response_model=ApiResponse[list[CurriculumNode]],
    status_code=status.HTTP_200_OK,
    summary="Get curriculum topic nodes",
)
async def get_curriculum(
    learning_service: Annotated[LearningService, Depends(get_learning_service)],
    subject: str | None = Query(None, description="Filter by subject name"),
) -> ApiResponse[list[CurriculumNode]]:
    """Fetch structured curriculum knowledge graph nodes and learning modules."""
    nodes = await learning_service.get_curriculum_nodes(subject=subject)
    return ApiResponse(data=nodes)


@router.get(
    "/missions",
    response_model=ApiResponse[list[MissionRead]],
    status_code=status.HTTP_200_OK,
    summary="Get available learning missions",
)
async def get_missions(
    current_user: Annotated[User, Depends(get_current_user)],
    learning_service: Annotated[LearningService, Depends(get_learning_service)],
) -> ApiResponse[list[MissionRead]]:
    """Retrieve active learning missions/quests tailored to the current user."""
    missions = await learning_service.get_available_missions(current_user.id)
    return ApiResponse(data=missions)


@router.get(
    "/recommendations",
    response_model=ApiResponse[list[LearningRecommendation]],
    status_code=status.HTTP_200_OK,
    summary="Get personalized learning recommendations",
)
async def get_recommendations(
    current_user: Annotated[User, Depends(get_current_user)],
    recommendation_service: Annotated[RecommendationService, Depends(get_recommendation_service)],
    limit: int = Query(5, ge=1, le=20),
) -> ApiResponse[list[LearningRecommendation]]:
    """Compute and retrieve personalized recommendations based on mastery gaps and misconceptions."""
    recommendations = await recommendation_service.get_personalized_recommendations(
        user_id=current_user.id, limit=limit
    )
    return ApiResponse(data=recommendations)
