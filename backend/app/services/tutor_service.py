"""AI Tutor & Session Management Service."""

from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.exceptions import EntityNotFoundException, ValidationException
from backend.app.database.repositories.learner_profile_repository import LearnerProfileRepository
from backend.app.database.repositories.learning_session_repository import LearningSessionRepository
from backend.app.schemas.tutor import (
    SessionCreate,
    SessionEndRequest,
    SessionRead,
    TutorInteractionPrompt,
    TutorInteractionResponse,
)


class TutorService:
    """Service governing AI Tutor interactions and active learning sessions."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.session_repo = LearningSessionRepository(session)
        self.profile_repo = LearnerProfileRepository(session)

    async def start_session(self, user_id: str, payload: SessionCreate) -> SessionRead:
        """Start a new tutoring or practice session for the user."""
        profile = await self.profile_repo.get_by_user_id(user_id)
        if not profile:
            raise EntityNotFoundException("Learner profile not found for user.")

        # Check if there is an ongoing active session; if so, return it or mark it completed
        active = await self.session_repo.get_active_session(profile.id)
        if active:
            # End existing active session to avoid stale sessions
            await self.session_repo.complete_session(active.id, {"closed_by": "new_session_start"})

        learning_session = await self.session_repo.create(
            learner_profile_id=profile.id,
            topic=payload.topic,
            session_type=payload.session_type,
            status="active",
            session_metadata=payload.session_metadata,
        )
        return SessionRead.model_validate(learning_session)

    async def get_active_session(self, user_id: str) -> SessionRead | None:
        """Fetch the current active session for the authenticated user."""
        profile = await self.profile_repo.get_by_user_id(user_id)
        if not profile:
            raise EntityNotFoundException("Learner profile not found.")
        session_obj = await self.session_repo.get_active_session(profile.id)
        if not session_obj:
            return None
        return SessionRead.model_validate(session_obj)

    async def list_user_sessions(
        self, user_id: str, limit: int = 50, skip: int = 0
    ) -> list[SessionRead]:
        """List historical sessions for the learner."""
        profile = await self.profile_repo.get_by_user_id(user_id)
        if not profile:
            raise EntityNotFoundException("Learner profile not found.")
        sessions = await self.session_repo.list_by_learner(profile.id, limit=limit, skip=skip)
        return [SessionRead.model_validate(s) for s in sessions]

    async def end_session(
        self, user_id: str, session_id: str, payload: SessionEndRequest
    ) -> SessionRead:
        """Mark a specific session as completed."""
        profile = await self.profile_repo.get_by_user_id(user_id)
        if not profile:
            raise EntityNotFoundException("Learner profile not found.")

        session_obj = await self.session_repo.get_by_id(session_id)
        if not session_obj or session_obj.learner_profile_id != profile.id:
            raise EntityNotFoundException("Session not found.")

        completed = await self.session_repo.complete_session(
            session_id=session_id,
            final_metadata=payload.final_metadata,
        )
        return SessionRead.model_validate(completed)

    async def interact(
        self, user_id: str, prompt: TutorInteractionPrompt
    ) -> TutorInteractionResponse:
        """Extension point for Multi-Agent AI Tutor interaction.

        In this foundation phase, verifies session validity and returns a structured
        response interface ready for LLM/RAG orchestration in Phase 2.
        """
        profile = await self.profile_repo.get_by_user_id(user_id)
        if not profile:
            raise EntityNotFoundException("Learner profile not found.")

        session_obj = await self.session_repo.get_by_id(prompt.session_id)
        if not session_obj or session_obj.learner_profile_id != profile.id:
            raise EntityNotFoundException("Tutoring session not found.")

        if session_obj.status != "active":
            raise ValidationException("Tutoring session is no longer active.")

        # Multi-Agent Orchestration
        from backend.app.agents.orchestrator.agent import orchestrator

        agent_response = await orchestrator.handle_interaction(
            query=prompt.message,
            learner_id=profile.id,
            session_id=session_obj.id,
            explicit_intent="LEARN",
            payload={"topic_id": session_obj.topic},
        )

        followups = [
            f"Practice solving problems in {session_obj.topic}",
            f"Take an adaptive quiz on {session_obj.topic}",
            "Ask for a step-by-step real-world analogy",
        ]
        if agent_response.next_suggested_action == "PRACTICE":
            followups.insert(0, "Start targeted practice challenge")

        return TutorInteractionResponse(
            session_id=session_obj.id,
            response_text=agent_response.content,
            suggested_followups=followups,
            concept_references=[session_obj.topic],
            confidence_score=agent_response.confidence,
        )
