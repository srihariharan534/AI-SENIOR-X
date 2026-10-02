"""AI Practice & Interactive Exercises REST Endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, Field

from backend.app.agents.orchestrator.agent import orchestrator
from backend.app.api.dependencies import get_current_user
from backend.app.database.models.user import User
from backend.app.schemas.common import ApiResponse

router = APIRouter(prefix="/practice", tags=["AI Practice & Exercises"])


class PracticeGenerateRequest(BaseModel):
    """Request to create targeted interactive practice."""

    topic_id: str = Field(..., description="Target curriculum topic node")
    concept_id: str | None = None
    difficulty: float = Field(default=0.5, ge=0.0, le=1.0)
    target_weakness: str | None = None


class PracticeSubmitRequest(BaseModel):
    """Submission of a practice exercise solution."""

    exercise_id: str
    topic_id: str
    concept_id: str
    submitted_code: str
    time_spent_seconds: float = 15.0


@router.post(
    "/generate",
    response_model=ApiResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Generate targeted interactive practice exercise",
)
async def generate_practice_exercise(
    payload: PracticeGenerateRequest,
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[dict]:
    """Create interactive practice challenge targeting learner mastery gaps."""
    agent_response = await orchestrator.handle_interaction(
        query=f"Practice exercises for {payload.topic_id}",
        learner_id=current_user.id,
        explicit_intent="PRACTICE",
        payload={
            "topic_id": payload.topic_id,
            "concept_id": payload.concept_id or payload.topic_id,
            "difficulty": payload.difficulty,
            "target_weakness": payload.target_weakness,
        },
    )
    return ApiResponse(data=agent_response.model_dump())


@router.post(
    "/submit",
    response_model=ApiResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Submit practice solution for AI grading and feedback",
)
async def submit_practice_solution(
    payload: PracticeSubmitRequest,
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[dict]:
    """Grade learner practice submission and update cognitive twin."""
    agent_response = await orchestrator.handle_interaction(
        query=payload.submitted_code,
        learner_id=current_user.id,
        explicit_intent="GRADE",
        payload={
            "question_type": "code",
            "learner_response": payload.submitted_code,
            "topic_id": payload.topic_id,
            "concept_id": payload.concept_id,
            "response_time_seconds": payload.time_spent_seconds,
        },
    )
    return ApiResponse(data=agent_response.model_dump())
