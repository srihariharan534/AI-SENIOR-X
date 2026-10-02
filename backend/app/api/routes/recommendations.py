"""AI Recommendations & Dynamic Learning Paths REST Endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel

from backend.app.agents.orchestrator.agent import orchestrator
from backend.app.api.dependencies import get_current_user
from backend.app.database.models.user import User
from backend.app.pedagogy.learning_path import DynamicLearningPath, learning_path_generator
from backend.app.schemas.common import ApiResponse

router = APIRouter(prefix="/recommendations", tags=["AI Recommendations & Paths"])


class LearningPathRequest(BaseModel):
    """Request dynamic learning path to reach a specific target topic."""

    target_topic_id: str


@router.get(
    "/next-actions",
    response_model=ApiResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Get prioritized next-best learning actions",
)
async def get_next_learning_actions(
    current_user: Annotated[User, Depends(get_current_user)],
    subject: str = Query("AI/ML", description="Primary subject focus"),
) -> ApiResponse[dict]:
    """Retrieve explainable, prioritized next-best lessons and reviews."""
    agent_response = await orchestrator.handle_interaction(
        query="What should I learn or review next?",
        learner_id=current_user.id,
        explicit_intent="RECOMMEND",
        payload={"subject": subject},
    )
    return ApiResponse(data=agent_response.model_dump())


@router.post(
    "/learning-path",
    response_model=ApiResponse[DynamicLearningPath],
    status_code=status.HTTP_200_OK,
    summary="Generate dynamic milestone learning path",
)
async def generate_learning_path(
    payload: LearningPathRequest,
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[DynamicLearningPath]:
    """Calculate the personalized DAG milestone roadmap to master a target topic."""
    snapshot = orchestrator.twin_updater.get_snapshot(current_user.id)
    path = learning_path_generator.generate_path(
        target_topic_id=payload.target_topic_id,
        current_knowledge_map=snapshot.mastery_levels,
    )
    return ApiResponse(data=path)
