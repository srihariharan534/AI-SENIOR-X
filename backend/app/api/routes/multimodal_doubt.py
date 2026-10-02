"""Multimodal Doubt Resolution & Advanced Teaching Intelligence Endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, status

from backend.app.api.dependencies import get_current_user
from backend.app.database.models.user import User
from backend.app.schemas.common import ApiResponse
from backend.app.schemas.multimodal_doubt import (
    CodeMentorRequest,
    CodeMentorResponse,
    DocumentTeachRequest,
    DocumentUploadRequest,
    DocumentUploadResponse,
    InterviewTurnRequest,
    InterviewTurnResponse,
    MultimodalDoubtRequest,
    MultimodalDoubtResponse,
    ProjectMentorRequest,
    ProjectMentorResponse,
    UnderstandingCheckResult,
    UnderstandingCheckSubmission,
)
from backend.app.services.multimodal_doubt_service import MultimodalDoubtService

router = APIRouter(prefix="/tutor-intelligence", tags=["Multimodal Tutor & Doubt Intelligence"])


@router.post(
    "/doubt",
    response_model=ApiResponse[MultimodalDoubtResponse],
    status_code=status.HTTP_200_OK,
    summary="Resolve Multimodal Doubt (Text, Image, PDF, Code, Voice)",
)
async def resolve_doubt(
    payload: MultimodalDoubtRequest,
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[MultimodalDoubtResponse]:
    """Unified endpoint to resolve any learner doubt across all modalities with structured teaching cards."""
    result = MultimodalDoubtService.resolve_doubt(payload, learner_id=current_user.id)
    return ApiResponse(data=result)


@router.post(
    "/document/upload",
    response_model=ApiResponse[DocumentUploadResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Upload & Index Lecture Notes or Textbook PDF",
)
async def upload_document(
    payload: DocumentUploadRequest,
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[DocumentUploadResponse]:
    """Upload and index PDF/DOC materials for grounded Document Teaching."""
    result = MultimodalDoubtService.upload_document(payload, learner_id=current_user.id)
    return ApiResponse(data=result)


@router.post(
    "/document/teach",
    response_model=ApiResponse[MultimodalDoubtResponse],
    status_code=status.HTTP_200_OK,
    summary="Personalized Teaching Grounded in Uploaded Document",
)
async def teach_from_document(
    payload: DocumentTeachRequest,
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[MultimodalDoubtResponse]:
    """Teach topics directly from student's uploaded notes, adapting to their Learning Twin."""
    result = MultimodalDoubtService.teach_from_document(payload, learner_id=current_user.id)
    return ApiResponse(data=result)


@router.post(
    "/code/mentor",
    response_model=ApiResponse[CodeMentorResponse],
    status_code=status.HTTP_200_OK,
    summary="AI Code Mentor: Debug, Explain, Hint, & Generate Similar Challenge",
)
async def mentor_code(
    payload: CodeMentorRequest,
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[CodeMentorResponse]:
    """Analyze code, explain errors, provide scaffolded hints/solutions, and generate similar drills."""
    result = MultimodalDoubtService.mentor_code(payload, learner_id=current_user.id)
    return ApiResponse(data=result)


@router.post(
    "/project/mentor",
    response_model=ApiResponse[ProjectMentorResponse],
    status_code=status.HTTP_200_OK,
    summary="AI Project Mentor: Roadmap, Architecture & Debugging",
)
async def guide_project(
    payload: ProjectMentorRequest,
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[ProjectMentorResponse]:
    """Guide learner through complex production project milestones and debug architecture logs."""
    result = MultimodalDoubtService.guide_project(payload, learner_id=current_user.id)
    return ApiResponse(data=result)


@router.post(
    "/interview/turn",
    response_model=ApiResponse[InterviewTurnResponse],
    status_code=status.HTTP_200_OK,
    summary="AI Mock Interview Mentor: Response Evaluation & Follow-ups",
)
async def evaluate_interview_turn(
    payload: InterviewTurnRequest,
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[InterviewTurnResponse]:
    """Evaluate candidate interview response, highlight gaps, and ask follow-up questions."""
    result = MultimodalDoubtService.evaluate_interview_turn(payload, learner_id=current_user.id)
    return ApiResponse(data=result)


@router.post(
    "/understanding-check/submit",
    response_model=ApiResponse[UnderstandingCheckResult],
    status_code=status.HTTP_200_OK,
    summary="Submit Understanding Check & Update Learning Twin",
)
async def submit_understanding_check(
    payload: UnderstandingCheckSubmission,
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[UnderstandingCheckResult]:
    """Verify comprehension and synchronize verified mastery with Learning Twin."""
    result = MultimodalDoubtService.submit_understanding_check(payload, learner_id=current_user.id)
    return ApiResponse(data=result)
