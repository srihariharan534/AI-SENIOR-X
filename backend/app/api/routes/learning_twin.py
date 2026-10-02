"""AI-SENIOR-X Learning Twin REST Endpoints."""

from typing import Annotated, Any

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.api.dependencies import get_current_user
from backend.app.database.models.user import User
from backend.app.database.repositories.learner_profile_repository import LearnerProfileRepository
from backend.app.database.session import get_db
from backend.app.learning_twin.evidence import (
    AssessmentEvidence,
    BaseEvidence,
    CompletionEvidence,
    EvidenceType,
    MisconceptionEvidence,
    PracticeEvidence,
    TutorEvidence,
)
from backend.app.learning_twin.learner_model import LearnerTwin
from backend.app.learning_twin.skill_graph import SkillCompetency
from backend.app.learning_twin.twin_updater import TwinUpdater
from backend.app.schemas.common import ApiResponse

router = APIRouter(prefix="/learning-twin", tags=["Learning Twin"])

# In-memory session store for active twin instances
_twin_registry: dict[str, LearnerTwin] = {}


def get_or_create_twin(user_id: str, profile_data: dict[str, Any] = None) -> LearnerTwin:
    """Retrieve or instantiate a LearnerTwin in memory for the user."""
    if user_id in _twin_registry:
        return _twin_registry[user_id]

    twin = LearnerTwin(
        learner_id=f"twin_{user_id}",
        user_id=user_id,
        cognitive_twin_metadata=profile_data or {},
    )
    _twin_registry[user_id] = twin
    return twin


@router.get(
    "",
    response_model=ApiResponse[dict[str, Any]],
    status_code=status.HTTP_200_OK,
    summary="Get Cognitive Learning Twin Summary",
)
async def get_twin_summary(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ApiResponse[dict[str, Any]]:
    """Retrieve high-level cognitive twin summary including concepts tracked, mastery, and skills."""
    profile_repo = LearnerProfileRepository(db)
    profile = await profile_repo.get_by_user_id(current_user.id)
    twin = get_or_create_twin(current_user.id, profile.cognitive_twin_state if profile else None)
    return ApiResponse(data=twin.get_summary())


@router.get(
    "/knowledge",
    response_model=ApiResponse[dict[str, Any]],
    status_code=status.HTTP_200_OK,
    summary="Get Concept Knowledge State",
)
async def get_knowledge_state(
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[dict[str, Any]]:
    """Retrieve concept-level mastery scores, levels, and confidence ratings."""
    twin = get_or_create_twin(current_user.id)
    return ApiResponse(
        data={
            "subject_mastery": twin.knowledge_state.subject_mastery,
            "concepts": {
                k: v.model_dump(mode="json") for k, v in twin.knowledge_state.concepts.items()
            },
        }
    )


@router.get(
    "/skills",
    response_model=ApiResponse[list[SkillCompetency]],
    status_code=status.HTTP_200_OK,
    summary="Get Skill Competencies & Gap Analysis",
)
async def get_skills(
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[list[SkillCompetency]]:
    """Retrieve skill proficiencies, strengths, weaknesses, and prerequisite blockers."""
    twin = get_or_create_twin(current_user.id)
    sg = twin.get_skill_graph()
    return ApiResponse(data=sg.get_all_skills())


@router.get(
    "/history",
    response_model=ApiResponse[list[dict[str, Any]]],
    status_code=status.HTTP_200_OK,
    summary="Get Learning Activity Timeline",
)
async def get_learning_history(
    current_user: Annotated[User, Depends(get_current_user)],
    limit: int = Query(20, ge=1, le=100),
) -> ApiResponse[list[dict[str, Any]]]:
    """Retrieve event-sourced learning activity history."""
    twin = get_or_create_twin(current_user.id)
    events = twin.history.get_recent_events(limit=limit)
    return ApiResponse(data=[e.model_dump(mode="json") for e in events])


@router.get(
    "/misconceptions",
    response_model=ApiResponse[dict[str, Any]],
    status_code=status.HTTP_200_OK,
    summary="Get Misconception State",
)
async def get_misconception_state(
    current_user: Annotated[User, Depends(get_current_user)],
) -> ApiResponse[dict[str, Any]]:
    """Retrieve active and resolved cognitive misconceptions."""
    twin = get_or_create_twin(current_user.id)
    return ApiResponse(
        data={
            "active": [m.model_dump(mode="json") for m in twin.misconception_state.list_active()],
            "resolved": [
                m.model_dump(mode="json") for m in twin.misconception_state.list_resolved()
            ],
        }
    )


@router.post(
    "/evidence",
    response_model=ApiResponse[dict[str, Any]],
    status_code=status.HTTP_200_OK,
    summary="Submit Learning Evidence to Twin",
)
async def submit_learning_evidence(
    payload: dict[str, Any],
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ApiResponse[dict[str, Any]]:
    """Ingest assessment, practice, or tutor evidence into the Learning Twin."""
    twin = get_or_create_twin(current_user.id)
    ev_type = payload.get("evidence_type", "assessment")

    evidence: BaseEvidence
    if ev_type == EvidenceType.ASSESSMENT:
        evidence = AssessmentEvidence(**payload, learner_id=current_user.id)
    elif ev_type == EvidenceType.PRACTICE:
        evidence = PracticeEvidence(**payload, learner_id=current_user.id)
    elif ev_type == EvidenceType.TUTOR:
        evidence = TutorEvidence(**payload, learner_id=current_user.id)
    elif ev_type == EvidenceType.MISCONCEPTION:
        evidence = MisconceptionEvidence(**payload, learner_id=current_user.id)
    elif ev_type == EvidenceType.COMPLETION:
        evidence = CompletionEvidence(**payload, learner_id=current_user.id)
    else:
        evidence = BaseEvidence(**payload, learner_id=current_user.id)

    TwinUpdater.apply_evidence(twin, evidence)
    await TwinUpdater.sync_twin_with_db(db, current_user.id, twin)

    return ApiResponse(
        data={
            "message": "Evidence ingested successfully.",
            "updated_summary": twin.get_summary(),
        }
    )
