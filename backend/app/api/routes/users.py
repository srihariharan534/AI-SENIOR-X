"""User Profile Management REST Endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.api.dependencies import get_current_user
from backend.app.core.exceptions import EntityNotFoundException
from backend.app.database.models.user import User
from backend.app.database.repositories.learner_profile_repository import LearnerProfileRepository
from backend.app.database.session import get_db
from backend.app.schemas.common import ApiResponse
from backend.app.schemas.user import LearnerProfileRead, LearnerProfileUpdate

router = APIRouter(prefix="/users", tags=["User & Learner Profile"])


@router.get(
    "/profile",
    response_model=ApiResponse[LearnerProfileRead],
    status_code=status.HTTP_200_OK,
    summary="Get learner profile",
)
async def get_learner_profile(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ApiResponse[LearnerProfileRead]:
    """Retrieve detailed cognitive and progress state of the current learner."""
    profile_repo = LearnerProfileRepository(db)
    profile = await profile_repo.get_by_user_id(current_user.id)
    if not profile:
        raise EntityNotFoundException("Learner profile not found.")
    return ApiResponse(data=LearnerProfileRead.model_validate(profile))


@router.patch(
    "/profile",
    response_model=ApiResponse[LearnerProfileRead],
    status_code=status.HTTP_200_OK,
    summary="Update learner profile settings",
)
async def update_learner_profile(
    payload: LearnerProfileUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ApiResponse[LearnerProfileRead]:
    """Update preferred language, learning style, grade level, and target goals."""
    profile_repo = LearnerProfileRepository(db)
    profile = await profile_repo.get_by_user_id(current_user.id)
    if not profile:
        raise EntityNotFoundException("Learner profile not found.")

    update_data = payload.model_dump(exclude_unset=True)
    if update_data:
        updated = await profile_repo.update(profile.id, **update_data)
        return ApiResponse(data=LearnerProfileRead.model_validate(updated))
    return ApiResponse(data=LearnerProfileRead.model_validate(profile))
