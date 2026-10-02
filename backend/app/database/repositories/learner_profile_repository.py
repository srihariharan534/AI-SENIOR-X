"""Learner Profile Repository implementation."""

from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from backend.app.database.models.learner_profile import LearnerProfile
from backend.app.database.repositories.base import BaseRepository


class LearnerProfileRepository(BaseRepository[LearnerProfile]):
    """Repository handling database interactions for LearnerProfile entities."""

    def __init__(self, session: AsyncSession):
        super().__init__(LearnerProfile, session)

    async def get_by_user_id(
        self, user_id: str, load_relations: bool = False
    ) -> LearnerProfile | None:
        """Fetch learner profile by user ID."""
        stmt = select(LearnerProfile).where(LearnerProfile.user_id == user_id)
        if load_relations:
            stmt = stmt.options(
                selectinload(LearnerProfile.progress_records),
                selectinload(LearnerProfile.misconceptions),
                selectinload(LearnerProfile.learning_sessions),
            )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def update_cognitive_twin_state(
        self, profile_id: str, updates: dict[str, Any]
    ) -> LearnerProfile | None:
        """Update cognitive twin metadata."""
        profile = await self.get_by_id(profile_id)
        if not profile:
            return None
        current_state = dict(profile.cognitive_twin_state or {})
        current_state.update(updates)
        profile.cognitive_twin_state = current_state
        self.session.add(profile)
        await self.session.flush()
        return profile

    async def update_mastery(
        self, profile_id: str, subject_or_topic: str, mastery_score: float
    ) -> LearnerProfile | None:
        """Update subject mastery score in profile JSON mapping."""
        profile = await self.get_by_id(profile_id)
        if not profile:
            return None
        scores = dict(profile.mastery_scores or {})
        scores[subject_or_topic] = max(0.0, min(1.0, mastery_score))
        profile.mastery_scores = scores
        self.session.add(profile)
        await self.session.flush()
        return profile
