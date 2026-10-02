"""AI Tutor & Interactive Session REST Endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, Query, status

from backend.app.api.dependencies import get_current_user, get_tutor_service
from backend.app.database.models.user import User
from backend.app.schemas.common import ApiResponse
from backend.app.schemas.tutor import (
    SessionCreate,
    SessionEndRequest,
    SessionRead,
    TutorInteractionPrompt,
    TutorInteractionResponse,
)
from backend.app.services.tutor_service import TutorService

router = APIRouter(prefix="/tutor", tags=["AI Tutor & Sessions"])


@router.post(
    "/session/start",
    response_model=ApiResponse[SessionRead],
    status_code=status.HTTP_201_CREATED,
    summary="Start a new tutoring session",
)
async def start_session(
    payload: SessionCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    tutor_service: Annotated[TutorService, Depends(get_tutor_service)],
) -> ApiResponse[SessionRead]:
    """Initialize a new active AI tutoring session."""
    session_obj = await tutor_service.start_session(current_user.id, payload)
    return ApiResponse(data=session_obj)


@router.get(
    "/session/active",
    response_model=ApiResponse[SessionRead | None],
    status_code=status.HTTP_200_OK,
    summary="Get current active session",
)
async def get_active_session(
    current_user: Annotated[User, Depends(get_current_user)],
    tutor_service: Annotated[TutorService, Depends(get_tutor_service)],
) -> ApiResponse[SessionRead | None]:
    """Retrieve current ongoing tutoring session if active."""
    session_obj = await tutor_service.get_active_session(current_user.id)
    return ApiResponse(data=session_obj)


@router.get(
    "/session/list",
    response_model=ApiResponse[list[SessionRead]],
    status_code=status.HTTP_200_OK,
    summary="List historical sessions",
)
async def list_sessions(
    current_user: Annotated[User, Depends(get_current_user)],
    tutor_service: Annotated[TutorService, Depends(get_tutor_service)],
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
) -> ApiResponse[list[SessionRead]]:
    """List historical tutoring sessions for learner."""
    sessions = await tutor_service.list_user_sessions(current_user.id, limit=limit, skip=skip)
    return ApiResponse(data=sessions)


@router.post(
    "/session/{session_id}/end",
    response_model=ApiResponse[SessionRead],
    status_code=status.HTTP_200_OK,
    summary="End an active tutoring session",
)
async def end_session(
    session_id: str,
    payload: SessionEndRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    tutor_service: Annotated[TutorService, Depends(get_tutor_service)],
) -> ApiResponse[SessionRead]:
    """Conclude an active tutoring session and record final session metadata."""
    session_obj = await tutor_service.end_session(current_user.id, session_id, payload)
    return ApiResponse(data=session_obj)


@router.post(
    "/interact",
    response_model=ApiResponse[TutorInteractionResponse],
    status_code=status.HTTP_200_OK,
    summary="Interact with AI Tutor agent",
)
async def interact_with_tutor(
    payload: TutorInteractionPrompt,
    current_user: Annotated[User, Depends(get_current_user)],
    tutor_service: Annotated[TutorService, Depends(get_tutor_service)],
) -> ApiResponse[TutorInteractionResponse]:
    """Interact with the AI Tutor agent interface."""
    response = await tutor_service.interact(current_user.id, payload)
    return ApiResponse(data=response)
