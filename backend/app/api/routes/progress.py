"""Progress and Diagnostics REST Endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, status

from backend.app.api.dependencies import get_current_user, get_progress_service
from backend.app.database.models.user import User
from backend.app.schemas.common import ApiResponse
from backend.app.schemas.progress import (
    MisconceptionRead,
    ProgressOverviewRead,
    ProgressRead,
    StudyActivityLogRequest,
)
from backend.app.services.progress_service import ProgressService

router = APIRouter(prefix="/progress", tags=["Progress & Analytics"])


@router.get(
    "/overview",
    response_model=ApiResponse[ProgressOverviewRead],
    status_code=status.HTTP_200_OK,
    summary="Get learner analytics overview",
)
async def get_progress_overview(
    current_user: Annotated[User, Depends(get_current_user)],
    progress_service: Annotated[ProgressService, Depends(get_progress_service)],
) -> ApiResponse[ProgressOverviewRead]:
    """Retrieve aggregate mastery metrics, study time, streak, and recent progress records."""
    overview = await progress_service.get_overview(current_user.id)
    return ApiResponse(data=overview)


@router.post(
    "/activity",
    response_model=ApiResponse[ProgressRead],
    status_code=status.HTTP_201_CREATED,
    summary="Log study activity and update mastery",
)
async def log_activity(
    payload: StudyActivityLogRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    progress_service: Annotated[ProgressService, Depends(get_progress_service)],
) -> ApiResponse[ProgressRead]:
    """Record completed study duration and update module mastery level."""
    progress = await progress_service.log_activity(current_user.id, payload)
    return ApiResponse(data=progress)


@router.get(
    "/misconceptions",
    response_model=ApiResponse[list[MisconceptionRead]],
    status_code=status.HTTP_200_OK,
    summary="List active misconceptions",
)
async def get_misconceptions(
    current_user: Annotated[User, Depends(get_current_user)],
    progress_service: Annotated[ProgressService, Depends(get_progress_service)],
) -> ApiResponse[list[MisconceptionRead]]:
    """Retrieve unresolved cognitive misconceptions identified during assessments."""
    misconceptions = await progress_service.list_misconceptions(current_user.id)
    return ApiResponse(data=misconceptions)
