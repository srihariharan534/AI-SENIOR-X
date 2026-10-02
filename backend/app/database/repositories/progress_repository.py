"""Progress and Misconception Repository implementation."""

from collections.abc import Sequence
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database.models.misconception import Misconception
from backend.app.database.models.progress import Progress
from backend.app.database.repositories.base import BaseRepository


class ProgressRepository(BaseRepository[Progress]):
    """Repository handling database operations for Learner Progress and Misconceptions."""

    def __init__(self, session: AsyncSession):
        super().__init__(Progress, session)

    async def get_by_module(
        self, learner_profile_id: str, subject: str, module_id: str
    ) -> Progress | None:
        """Fetch progress record for a specific subject and module."""
        stmt = select(Progress).where(
            Progress.learner_profile_id == learner_profile_id,
            Progress.subject == subject,
            Progress.module_id == module_id,
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def list_by_learner(self, learner_profile_id: str) -> Sequence[Progress]:
        """Fetch all progress records for a learner."""
        stmt = (
            select(Progress)
            .where(Progress.learner_profile_id == learner_profile_id)
            .order_by(Progress.last_activity_at.desc())
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def record_study_activity(
        self,
        learner_profile_id: str,
        subject: str,
        module_id: str,
        time_spent_minutes: int,
        mastery_delta: float = 0.0,
    ) -> Progress:
        """Upsert study progress, mastery updates, and activity timestamps."""
        record = await self.get_by_module(learner_profile_id, subject, module_id)
        now = datetime.now(UTC)
        if not record:
            record = Progress(
                learner_profile_id=learner_profile_id,
                subject=subject,
                module_id=module_id,
                mastery_level=max(0.0, min(1.0, mastery_delta)),
                completed_missions_count=0,
                streak_days=1,
                total_time_spent_minutes=time_spent_minutes,
                last_activity_at=now,
            )
            self.session.add(record)
        else:
            record.total_time_spent_minutes += time_spent_minutes
            record.mastery_level = max(0.0, min(1.0, record.mastery_level + mastery_delta))
            record.last_activity_at = now
            self.session.add(record)

        await self.session.flush()
        return record

    async def log_misconception(
        self,
        learner_profile_id: str,
        concept_key: str,
        misconception_tag: str,
        description: str,
        severity: str = "moderate",
    ) -> Misconception:
        """Log a detected cognitive misconception."""
        misconception = Misconception(
            learner_profile_id=learner_profile_id,
            concept_key=concept_key,
            misconception_tag=misconception_tag,
            description=description,
            severity=severity,
            status="active",
            detected_at=datetime.now(UTC),
        )
        self.session.add(misconception)
        await self.session.flush()
        return misconception

    async def list_active_misconceptions(self, learner_profile_id: str) -> Sequence[Misconception]:
        """Fetch unresolved misconceptions for a learner."""
        stmt = (
            select(Misconception)
            .where(
                Misconception.learner_profile_id == learner_profile_id,
                Misconception.status == "active",
            )
            .order_by(Misconception.detected_at.desc())
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()
