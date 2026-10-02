"""Assessment and Evaluation REST Endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, Query, status

from backend.app.api.dependencies import get_assessment_service, get_current_user
from backend.app.database.models.user import User
from backend.app.schemas.assessment import (
    AnswerResultRead,
    AnswerSubmitRequest,
    AssessmentCreate,
    AssessmentDetailRead,
    AssessmentRead,
)
from backend.app.schemas.common import ApiResponse
from backend.app.services.assessment_service import AssessmentService

router = APIRouter(prefix="/assessment", tags=["Assessments & Grading"])


@router.post(
    "/create",
    response_model=ApiResponse[AssessmentDetailRead],
    status_code=status.HTTP_201_CREATED,
    summary="Create a new assessment",
)
async def create_assessment(
    payload: AssessmentCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    assessment_service: Annotated[AssessmentService, Depends(get_assessment_service)],
) -> ApiResponse[AssessmentDetailRead]:
    """Instantiate a new assessment with embedded questions."""
    assessment = await assessment_service.create_assessment(current_user.id, payload)
    return ApiResponse(data=assessment)


@router.get(
    "/list",
    response_model=ApiResponse[list[AssessmentRead]],
    status_code=status.HTTP_200_OK,
    summary="List assessments for current learner",
)
async def list_assessments(
    current_user: Annotated[User, Depends(get_current_user)],
    assessment_service: Annotated[AssessmentService, Depends(get_assessment_service)],
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
) -> ApiResponse[list[AssessmentRead]]:
    """Retrieve history of assessments taken or scheduled for the caller."""
    records = await assessment_service.list_user_assessments(
        current_user.id, limit=limit, skip=skip
    )
    return ApiResponse(data=records)


@router.get(
    "/{assessment_id}",
    response_model=ApiResponse[AssessmentDetailRead],
    status_code=status.HTTP_200_OK,
    summary="Get assessment details and questions",
)
async def get_assessment_detail(
    assessment_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    assessment_service: Annotated[AssessmentService, Depends(get_assessment_service)],
) -> ApiResponse[AssessmentDetailRead]:
    """Retrieve a specific assessment including question prompts and response options."""
    assessment = await assessment_service.get_assessment(current_user.id, assessment_id)
    return ApiResponse(data=assessment)


@router.post(
    "/{assessment_id}/submit",
    response_model=ApiResponse[AnswerResultRead],
    status_code=status.HTTP_200_OK,
    summary="Submit answer for assessment question",
)
async def submit_answer(
    assessment_id: str,
    payload: AnswerSubmitRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    assessment_service: Annotated[AssessmentService, Depends(get_assessment_service)],
) -> ApiResponse[AnswerResultRead]:
    """Submit a question answer for grading, score update, and misconception detection."""
    result = await assessment_service.submit_answer(current_user.id, assessment_id, payload)
    return ApiResponse(data=result)
