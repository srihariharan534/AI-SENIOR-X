"""Learning Session Repository implementation."""

from collections.abc import Sequence
from datetime import UTC, datetime
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database.models.learning_session import LearningSession
from backend.app.database.repositories.base import BaseRepository


class LearningSessionRepository(BaseRepository[LearningSession]):
    """Repository handling database operations for Learning Sessions."""

    def __init__(self, session: AsyncSession):
        super().__init__(LearningSession, session)

    async def get_active_session(self, learner_profile_id: str) -> LearningSession | None:
        """Fetch the current active learning session for a learner."""
        stmt = (
            select(LearningSession)
            .where(
                LearningSession.learner_profile_id == learner_profile_id,
                LearningSession.status == "active",
            )
            .order_by(LearningSession.created_at.desc())
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def list_by_learner(
        self, learner_profile_id: str, limit: int = 50, skip: int = 0
    ) -> Sequence[LearningSession]:
        """List learning sessions for a specific learner profile."""
        stmt = (
            select(LearningSession)
            .where(LearningSession.learner_profile_id == learner_profile_id)
            .order_by(LearningSession.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def complete_session(
        self, session_id: str, final_metadata: dict[str, Any] | None = None
    ) -> LearningSession | None:
        """Mark a learning session as completed."""
        learning_session = await self.get_by_id(session_id)
        if not learning_session:
            return None
        learning_session.status = "completed"
        learning_session.completed_at = datetime.now(UTC)
        if final_metadata:
            meta = dict(learning_session.session_metadata or {})
            meta.update(final_metadata)
            learning_session.session_metadata = meta
        self.session.add(learning_session)
        await self.session.flush()
        return learning_session
