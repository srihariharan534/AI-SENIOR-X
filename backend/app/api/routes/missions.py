"""AI Learning Missions & Capstone Quests REST Endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from pydantic import BaseModel, Field

from backend.app.agents.orchestrator.agent import orchestrator
from backend.app.api.dependencies import get_current_user
from backend.app.database.models.user import User
from backend.app.schemas.common import ApiResponse

router = APIRouter(prefix="/missions", tags=["AI Missions & Quests"])


class MissionGenerateRequest(BaseModel):
    """Request to initialize a topic capstone mission."""

    topic_id: str
    difficulty_level: str = Field(
        default="Intermediate", description="Beginner, Intermediate, Advanced"
    )


@router.get(
    "/active",
    response_model=ApiResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Get or generate current active learning mission",
)
async def get_active_mission(
    current_user: Annotated[User, Depends(get_current_user)],
    topic_id: str = Query("ml_supervised", description="Focus topic for mission"),
) -> ApiResponse[dict]:
    """Retrieve active quest or create a new gamified challenge."""
    agent_response = await orchestrator.handle_interaction(
        query=f"Create a learning mission for {topic_id}",
        learner_id=current_user.id,
        explicit_intent="MISSION",
        payload={"topic_id": topic_id},
    )
    return ApiResponse(data=agent_response.model_dump())


@router.post(
    "/create",
    response_model=ApiResponse[dict],
    status_code=status.HTTP_201_CREATED,
    summary="Create custom learning mission",
)
async def create_mission(
    payload: MissionGenerateRequest,
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[dict]:
    """Generate and bind a new capstone quest to learner profile."""
    agent_response = await orchestrator.handle_interaction(
        query=f"Initialize quest for {payload.topic_id}",
        learner_id=current_user.id,
        explicit_intent="MISSION",
        payload={
            "topic_id": payload.topic_id,
            "difficulty_level": payload.difficulty_level,
        },
    )
    return ApiResponse(data=agent_response.model_dump())
